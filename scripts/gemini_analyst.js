import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to handle ESM paths in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const envPath = path.join(__dirname, "../.env");
const csvPath = path.join(
  __dirname,
  "../reports/google_ads/search_terms_report_2026_06_12.csv",
);
const outputPath = path.join(
  __dirname,
  "../reports/google_ads/gemini_recommendations.json",
);

// 1. Load Vite .env variables manually to avoid external dependencies
function loadEnv() {
  if (!fs.existsSync(envPath)) {
    console.error("⚠️ Error: .env file not found in the project root.");
    console.error(
      "Please create a .env file with VITE_GEMINI_API_KEY before running this.",
    );
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([^#\s=]+)\s*=\s*(.*)$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      // Remove surrounding quotes if they exist
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

// 2. CSV Parser
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((val) => val.replace(/^"|"$/g, "").trim());
}

// Heuristic filter (we pass a targeted subset to Gemini to keep tokens low and focus high)
function filterHighRiskTerms() {
  if (!fs.existsSync(csvPath)) {
    console.error(`⚠️ Error: Could not find CSV report at ${csvPath}`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(csvPath, "utf8");
  const lines = rawContent.split(/\r?\n/).filter((line) => line.trim() !== "");
  const headers = parseCSVLine(lines[2]);
  const dataRows = lines.slice(3);

  const flaggedTerms = [];

  dataRows.forEach((rowString) => {
    const row = parseCSVLine(rowString);
    if (row.length < headers.length) return;

    const term = row[0];
    const campaign = row[3];
    const clicks = parseInt(row[7], 10) || 0;
    const impressions = parseInt(row[8], 10) || 0;
    const cost = parseFloat(row[11]) || 0.0;
    const conversions = parseFloat(row[14]) || 0.0;

    // Filter terms that spent money but returned ZERO conversions
    // Or clear toddler/spam terms with clicks
    const isKeyboardSpam =
      /abcdefg|hijklmn|opqrst|uvwxyz/i.test(term) ||
      (term.match(/(?:^|\s)[a-z](?=\s|$)/g) || []).length >= 4;
    const isEducational =
      /kids|toy|classroom|kindergarten|preschool|bulletin|jack hartmann|abc song/i.test(
        term,
      );
    const isSpanish = /letras|para|avisos|publicitarios/i.test(term);
    const isUnrelated = /spouse|god is/i.test(term);

    if (
      (conversions === 0 && cost > 0.5) ||
      isKeyboardSpam ||
      isEducational ||
      isSpanish ||
      isUnrelated
    ) {
      flaggedTerms.push({
        term,
        campaign,
        clicks,
        impressions,
        cost,
        conversions,
      });
    }
  });

  // Sort by highest bleed first
  return flaggedTerms.sort((a, b) => b.cost - a.cost);
}

// 3. Main runner
async function main() {
  loadEnv();

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith("your_")) {
    console.error(
      "⚠️ Error: VITE_GEMINI_API_KEY is not configured or is still a placeholder in your .env file.",
    );
    process.exit(1);
  }

  console.log("⚡ Initializing Gemini AI Analyst...");
  const genAI = new GoogleGenerativeAI(apiKey);
  // We use gemini-2.5-flash: it is lightning fast, cheap, and perfect for structured analytical tasks
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }, // Force JSON output
  });

  console.log("⚡ Gathering leaked traffic terms from Google Ads CSV...");
  const highRiskTerms = filterHighRiskTerms();

  // Only send the top 100 bleeders to stay within healthy token scopes and focus intelligence
  const sampleTerms = highRiskTerms.slice(0, 100);
  console.log(
    `📊 Found ${highRiskTerms.length} total bleeder terms. Sending the top ${sampleTerms.length} highest cost leaks to Gemini for structural analysis...`,
  );

  const systemInstructions = `
    You are an elite Google Ads SEM Analyst and MarTech Automation system for 'Alphabet Signs' (a brand that sells high-end dimensional letters, marquee letters, church sign letters, and commercial vehicle graphics).

    You are analyzing Search Term report rows that represent budget leakage.
    Analyze the queries and group them into logical Negative Keyword Exclusions.

    CRITICAL RULE FOR SAFETY (FALSE POSITIVES):
    'Alphabet Signs' sells "letters for signs" and "marquee letters".
    DO NOT recommend blocking terms that imply commercial intent for signs, marquee letters, or sign boards (e.g. "letters for outdoor church signs", "menu sign board", "commercial lettering").
    If you spot any such high-intent queries in the leakage list, identify them as 'False Positives' so we can save them.

    You must output a strictly structured JSON object matching this schema:
    {
      "executiveSummary": "A brief overview of where the account is bleeding money and why PMax is triggering it.",
      "totalEstimatedSavings": "$X,XXX/mo",
      "recommendations": [
        {
          "id": "unique-id",
          "title": "Group/Action title (e.g., Block Toddler ABC Spam)",
          "type": "Negative Keywords" or "Bidding Strategy" or "Campaign Structure",
          "impact": "high" or "medium" or "low",
          "desc": "Detailed explanation of what is triggering this leak, references to specific terms, and the exact negative words to apply.",
          "difficulty": "Easy (2 mins)" or "Medium (10 mins)",
          "costSavings": "Est. $XXX/mo",
          "negativeKeywordsToApply": ["word1", "word2"]
        }
      ],
      "falsePositivesSafety": [
        {
          "term": "the search term",
          "reason": "Why this query actually has high value and why we must NOT block it."
        }
      ]
    }
  `;

  const prompt = `
    Here is the list of top budget leak search terms from the Alphabet Signs Google Ads Account:
    ${JSON.stringify(sampleTerms, null, 2)}

    Perform the analysis and generate the requested JSON output now.
  `;

  try {
    console.log("🤖 Querying Gemini (gemini-1.5-flash)...");
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemInstructions + "\n\n" + prompt }],
        },
      ],
    });

    const responseText = result.response.text();

    // Save response
    fs.writeFileSync(outputPath, responseText, "utf8");

    // Parse to print a beautiful summary in terminal
    const data = JSON.parse(responseText);

    console.log("\n====================================================");
    console.log("🎉   GEMINI AUDIT COMPLETE & RECOMMENDATIONS SAVED    ");
    console.log("====================================================");
    console.log(`\n📝 Executive Summary:\n${data.executiveSummary}`);
    console.log(`\n💰 Total Estimated Savings: ${data.totalEstimatedSavings}`);
    console.log(
      `\n📦 Total Recommendations Generated: ${data.recommendations.length}`,
    );

    console.log("\n💡 High Impact Recommended Actions:");
    data.recommendations.forEach((rec, i) => {
      console.log(
        `\n[${i + 1}] ${rec.title} (${rec.costSavings} Savings | ${rec.impact.toUpperCase()} Impact)`,
      );
      console.log(`    Description: ${rec.desc}`);
      if (
        rec.negativeKeywordsToApply &&
        rec.negativeKeywordsToApply.length > 0
      ) {
        console.log(
          `    Exclusion Keywords: [${rec.negativeKeywordsToApply.join(", ")}]`,
        );
      }
    });

    if (data.falsePositivesSafety && data.falsePositivesSafety.length > 0) {
      console.log("\n🛡️ False Positive Protections Active:");
      data.falsePositivesSafety.forEach((fp) => {
        console.log(`    • "${fp.term}": ${fp.reason}`);
      });
    }

    console.log(
      `\n📁 Full JSON payload successfully saved to:\n  ${outputPath}`,
    );
    console.log("====================================================");
  } catch (err) {
    console.error("❌ Error executing Gemini Analysis:", err);
  }
}

main();
