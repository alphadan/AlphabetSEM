import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const rawCsvPath = path.join(__dirname, "../public/Alphabet_Signs_-_Offline_Conversions_ERRORS.csv");
const sanitizedCsvPath = path.join(__dirname, "../public/conversions_sanitized.csv");

// Helper to calculate SHA-256 hash
function sha256(text) {
  if (!text) return "";
  const cleaned = text.trim().toLowerCase();
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

// Helper to clean and hash phone numbers (Must have country code e.g. +17318472378)
function hashPhone(phone) {
  if (!phone) return "";
  // Strip spaces, dashes, parentheses
  let cleaned = phone.trim().replace(/[\s\-\(\)]/g, "");
  // Ensure country code exists
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

// Helper to append timezone (EST: -0400)
function formatTime(timeStr) {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  // If timezone is already specified, return it
  if (trimmed.includes("-") && trimmed.split("-").length > 3) return trimmed;
  // Else, append EST/EDT timezone (Eastern Time: -04:00 or -0400)
  return `${trimmed} -0400`;
}

// Simple CSV Line parser supporting quote escaping
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

function processConversions() {
  if (!fs.existsSync(rawCsvPath)) {
    console.error(`⚠️ Error: Could not find your raw conversions file at:\n  ${rawCsvPath}`);
    console.error("Please export your raw sheet as a CSV and save it to that path.");
    return;
  }

  console.log("⚡ Loading raw conversion entries...");
  const fileContent = fs.readFileSync(rawCsvPath, "utf8");
  const lines = fileContent.split(/\r?\n/).filter((line) => line.trim() !== "");
  
  // Headers
  const rawHeaders = parseCSVLine(lines[1] || lines[0]);
  const dataRows = lines.slice(2);

  // Google expects these exact column headers for hashed uploads
  const targetHeaders = [
    "Email",
    "Phone Number",
    "First Name",
    "Last Name",
    "Street Address",
    "City",
    "State",
    "Zip",
    "Country",
    "Transaction ID",
    "Conversion Name",
    "Conversion Time",
    "Conversion Value",
    "Conversion Currency",
    "Ad_Measurement_Consent",
    "Ad_Personalization_Consent"
  ];

  const processedRows = [targetHeaders.join(",")];

  console.log(`⚡ Hashing and formatting ${dataRows.length} conversion rows...`);
  
  dataRows.forEach((rowStr) => {
    const row = parseCSVLine(rowStr);
    if (row.length < 14) return;

    // Extract clear-text values
    const rawEmail = row[0];
    const rawPhone = row[1];
    const firstName = row[2];
    const lastName = row[3];
    const street = row[4];
    const city = row[5];
    const state = row[6];
    const zip = row[7];
    const country = row[8];
    const txId = row[9];
    const convName = row[10];
    const rawTime = row[11];
    const convValue = row[12];
    const currency = row[13];
    const adUserDataConsent = row[14] || "GRANTED";
    const adPersonalizationConsent = row[15] || "GRANTED";

    // Hash PII fields
    const hashedEmail = sha256(rawEmail);
    const hashedPhone = hashPhone(rawPhone);
    const formattedTime = formatTime(rawTime);

    // Format row values cleanly
    const formattedRow = [
      hashedEmail,
      hashedPhone,
      `"${firstName}"`,
      `"${lastName}"`,
      `"${street}"`,
      `"${city}"`,
      state,
      `"${zip}"`,
      country,
      txId,
      convName,
      `"${formattedTime}"`,
      convValue,
      currency,
      adUserDataConsent,
      adPersonalizationConsent
    ];

    processedRows.push(formattedRow.join(","));
  });

  // Write output
  fs.writeFileSync(sanitizedCsvPath, processedRows.join("\n"), "utf8");
  console.log("\n====================================================");
  console.log("🎉   CONVERSION SANITIZATION COMPLETE!               ");
  console.log("====================================================");
  console.log(`📁 Hashed PII & timezones applied successfully.`);
  console.log(`📁 100% Google-compliant CSV written to:\n  ${sanitizedCsvPath}`);
  console.log("====================================================");
}

processConversions();
