import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to handle ESM paths in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const csvPath = path.join(__dirname, '../reports/google_ads/search_terms_report_2026_06_12.csv');

// Robust CSV Line parser to handle fields wrapped in double quotes
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, '').trim());
}

// Heuristic categorization engine
function analyzeTerm(term) {
  const normalized = term.toLowerCase();
  
  // Rule 1: Toddler Alphabet Spam / Repeating single characters
  // Matches "a b c d" or "abcdefghijkl" or multiple single letters separated by spaces
  const singleLetterCount = (normalized.match(/(?:^|\s)[a-z](?=\s|$)/g) || []).length;
  if (
    /abcdefg|hijklmn|opqrst|uvwxyz/i.test(normalized) || 
    singleLetterCount >= 4 ||
    normalized.includes('all the alphabets')
  ) {
    return { flagged: true, category: 'Alphabet Learner / Toddler Keyboard Spam' };
  }
  
  // Rule 2: Children/Educational Content
  if (
    /kids|toy|classroom|kindergarten|preschool|bulletin board|jack hartmann|abc song|alphabet song|school abc/i.test(normalized)
  ) {
    return { flagged: true, category: 'Kids & Educational Content' };
  }
  
  // Rule 3: Spanish / Unoptimized Foreign Market Traffic (Exclude if non-converting)
  if (
    /letras|para|avisos|publicitarios|grande|en grande/i.test(normalized)
  ) {
    return { flagged: true, category: 'Spanish / Language Incongruence' };
  }
  
  // Rule 4: High Leeway Unrelated matching
  if (
    /spouse|god is showing you|pumpkin patch|breakfast flag|honey for sale|peach|produce me/i.test(normalized)
  ) {
    return { flagged: true, category: 'High-Leeway Unrelated Queries' };
  }
  
  return { flagged: false, category: null };
}

function runAudit() {
  console.log('====================================================');
  console.log('       AlphabetSEM - Google Ads CSV Parser          ');
  console.log('====================================================');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: Could not find CSV report at ${csvPath}`);
    process.exit(1);
  }
  
  const rawContent = fs.readFileSync(csvPath, 'utf8');
  const lines = rawContent.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // Skip metadata header rows (Rows 1 & 2) and extract headers (Row 3)
  const headers = parseCSVLine(lines[2]);
  const dataRows = lines.slice(3);
  
  console.log(`Successfully read: ${lines[1].replace(/"/g, '')}`);
  console.log(`Total queries found in report: ${dataRows.length}\n`);

  let totalCost = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  
  let flaggedCost = 0;
  let flaggedClicks = 0;
  let flaggedCount = 0;
  
  const categoriesMap = {};
  const exclusionKeywords = new Set();
  const flaggedDetails = [];

  dataRows.forEach(rowString => {
    const row = parseCSVLine(rowString);
    if (row.length < headers.length) return; // Skip malformed rows
    
    const term = row[0];
    const matchType = row[1];
    const campaign = row[3];
    const clicks = parseInt(row[7], 10) || 0;
    const impressions = parseInt(row[8], 10) || 0;
    const cost = parseFloat(row[11]) || 0.0;
    const conversions = parseFloat(row[14]) || 0.0;
    
    totalCost += cost;
    totalClicks += clicks;
    totalImpressions += impressions;
    
    const analysis = analyzeTerm(term);
    
    if (analysis.flagged) {
      flaggedCount++;
      flaggedCost += cost;
      flaggedClicks += clicks;
      
      // Categorize
      categoriesMap[analysis.category] = (categoriesMap[analysis.category] || 0) + cost;
      
      // Collect exclusion seeds (individual keywords to add to negative lists)
      const words = term.split(/[\s,.-]+/);
      words.forEach(word => {
        const cleanWord = word.toLowerCase().trim();
        if (
          cleanWord.length > 2 && 
          !['signs', 'letters', 'marquee', 'custom', 'building', 'metal', 'yard', 'lettering', 'for', 'with', 'and'].includes(cleanWord)
        ) {
          exclusionKeywords.add(cleanWord);
        }
      });
      
      flaggedDetails.push({
        term,
        campaign,
        clicks,
        impressions,
        cost,
        conversions,
        reason: analysis.category
      });
    }
  });

  // Sort flagged bleeders by cost descending
  flaggedDetails.sort((a, b) => b.cost - a.cost);

  console.log('--- 🛑 HIGHEST-BLEED FLAGGED QUERIES ---');
  flaggedDetails.slice(0, 15).forEach(item => {
    console.log(`• "${item.term}" [${item.reason}]`);
    console.log(`  Campaign: ${item.campaign}`);
    console.log(`  Impressions: ${item.impressions} | Clicks: ${item.clicks} | Cost: $${item.cost.toFixed(2)} | Conversions: ${item.conversions}`);
    console.log('--------------------------------------------------');
  });

  console.log('\n--- 📊 FINANCIAL BLEED SUMMARY ---');
  console.log(`Total Account Spend: $${totalCost.toFixed(2)}`);
  console.log(`Flagged/Wasted Spend: $${flaggedCost.toFixed(2)} (${((flaggedCost / totalCost) * 100).toFixed(1)}% of total)`);
  console.log(`Flagged Clicks: ${flaggedClicks} clicks on non-commercial traffic`);
  console.log(`Flagged Queries Count: ${flaggedCount} distinct terms`);
  
  console.log('\n--- 🏷️ BLEED BY CATEGORY ---');
  Object.keys(categoriesMap).sort((a,b) => categoriesMap[b] - categoriesMap[a]).forEach(cat => {
    console.log(`• ${cat}: $${categoriesMap[cat].toFixed(2)}`);
  });

  console.log('\n--- 🚫 RECOMMENDED NEGATIVE KEYWORDS FOR BRAND EXCLUSIONS ---');
  const sortedKeywords = Array.from(exclusionKeywords).sort();
  console.log(sortedKeywords.join(', '));
  console.log('====================================================');
}

runAudit();
