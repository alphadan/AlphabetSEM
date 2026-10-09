import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const publicDir = path.join(__dirname, "../public");
const outputDir = path.join(publicDir, "output");

// Helper to calculate SHA-256 hash
function sha256(text) {
  if (!text) return "";
  const cleaned = text.trim().toLowerCase();
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

// Helper to clean and hash phone numbers (Must have country code e.g. +14195451555)
function hashPhone(phone) {
  if (!phone) return "";
  let cleaned = phone.trim().replace(/[\s\-\(\)]/g, "");
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

// Helper to append timezone (Eastern Time: -0400)
function formatTime(timeStr) {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (trimmed.includes("-") && trimmed.split("-").length > 3) return trimmed;
  return `${trimmed} -0400`;
}

// Simple CSV line parser supporting quoted fields
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

// Helper to locate the most recently created raw CSV file in public/
function getMostRecentRawFile() {
  if (!fs.existsSync(publicDir)) return null;

  const files = fs.readdirSync(publicDir)
    .filter((file) => file.endsWith(".csv") && file.startsWith("external_"))
    .map((file) => {
      const filePath = path.join(publicDir, file);
      const stat = fs.statSync(filePath);
      return { file, path: filePath, mtime: stat.mtime };
    });

  if (files.length === 0) return null;

  // Sort by modification time descending (most recent first)
  files.sort((a, b) => b.mtime - a.mtime);
  return files[0];
}

function run() {
  let targetFile = process.argv[2]; // Check command line arguments
  let rawCsvPath;

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (targetFile) {
    // User specified a file (e.g. node scripts/sanitize_conversions.js public/external_20261007.csv)
    rawCsvPath = path.resolve(targetFile);
    console.log(`⚡ Targeting user-specified file: ${path.basename(rawCsvPath)}`);
  } else {
    // Auto-detect the most recent raw CSV file
    const recentFile = getMostRecentRawFile();
    if (!recentFile) {
      console.error("⚠️ Error: No raw conversion files (starting with 'external_') found in your public/ folder.");
      console.error("Usage: node scripts/sanitize_conversions.js [path/to/file.csv]");
      return;
    }
    rawCsvPath = recentFile.path;
    console.log(`⚡ Auto-detected most recent raw file: ${recentFile.file} (modified: ${recentFile.mtime.toLocaleTimeString()})`);
  }

  if (!fs.existsSync(rawCsvPath)) {
    console.error(`⚠️ Error: File not found at path: ${rawCsvPath}`);
    return;
  }

  const baseName = path.basename(rawCsvPath, ".csv");
  const sanitizedCsvPath = path.join(outputDir, `${baseName}_sanitized.csv`);

  console.log(`⚡ Loading conversions from: ${path.basename(rawCsvPath)}...`);
  const rawContent = fs.readFileSync(rawCsvPath, "utf8");
  const lines = rawContent.split(/\r?\n/).filter((line) => line.trim() !== "");

  // Universally compliant headers (spaces for general columns, underscores for consent)
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

  lines.forEach((line) => {
    const row = parseCSVLine(line);
    if (row.length < 14) return;

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

  fs.writeFileSync(sanitizedCsvPath, processedRows.join("\n"), "utf8");
  console.log("\n====================================================");
  console.log("🎉 SUCCESS! Sanitized file has been successfully written!");
  console.log(`📁 Sanitized file saved to:\n  ${sanitizedCsvPath}`);
  console.log("====================================================");
}

run();
