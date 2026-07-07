import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../reports/google_ads/search_terms_report_2026_06_12.csv');

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

function run() {
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV not found at ${csvPath}`);
    return;
  }

  const rawContent = fs.readFileSync(csvPath, 'utf8');
  const lines = rawContent.split(/\r?\n/).filter(line => line.trim() !== '');
  const headers = parseCSVLine(lines[2]);
  const dataRows = lines.slice(3);

  const bl00Rows = [];
  let bl00TotalCost = 0;
  let bl00TotalClicks = 0;
  let bl00TotalImpressions = 0;
  let bl00TotalConversions = 0;

  dataRows.forEach(rowString => {
    const row = parseCSVLine(rowString);
    if (row.length < headers.length) return;

    const campaign = row[3];
    if (campaign !== 'BL00 Building Letters | PMax | Core') return;

    const term = row[0];
    const matchType = row[1];
    const clicks = parseInt(row[7], 10) || 0;
    const impr = parseInt(row[8], 10) || 0;
    const cost = parseFloat(row[11]) || 0;
    const conversions = parseFloat(row[14]) || 0;

    bl00TotalCost += cost;
    bl00TotalClicks += clicks;
    bl00TotalImpressions += impr;
    bl00TotalConversions += conversions;

    bl00Rows.push({ term, matchType, clicks, impr, cost, conversions });
  });

  console.log(`=== BL00 Campaign Search Terms Analysis ===`);
  console.log(`Total Search Terms Found: ${bl00Rows.length}`);
  console.log(`Total Cost: $${bl00TotalCost.toFixed(2)}`);
  console.log(`Total Clicks: ${bl00TotalClicks}`);
  console.log(`Total Impressions: ${bl00TotalImpressions}`);
  console.log(`Total Conversions: ${bl00TotalConversions.toFixed(2)}`);
  console.log(`Cost Per Conversion: $${(bl00TotalConversions > 0 ? bl00TotalCost / bl00TotalConversions : 0).toFixed(2)}`);
  console.log(`\n--- Top 30 Search Terms by Cost ---`);

  const sortedByCost = [...bl00Rows].sort((a, b) => b.cost - a.cost);
  sortedByCost.slice(0, 30).forEach((item, index) => {
    console.log(`${index + 1}. "${item.term}"`);
    console.log(`   Cost: $${item.cost.toFixed(2)} | Clicks: ${item.clicks} | Impr: ${item.impr} | Conversions: ${item.conversions}`);
  });

  console.log(`\n--- Top 15 Converting Search Terms ---`);
  const sortedByConversions = [...bl00Rows].sort((a, b) => b.conversions - a.conversions);
  sortedByConversions.slice(0, 15).forEach((item, index) => {
    console.log(`${index + 1}. "${item.term}"`);
    console.log(`   Conversions: ${item.conversions} | Cost: $${item.cost.toFixed(2)} | Clicks: ${item.clicks} | Impr: ${item.impr}`);
  });

  // Let's analyze common themes or words in the terms that spend but don't convert
  const wordSpendMap = {};
  const wordConvMap = {};
  bl00Rows.forEach(item => {
    const words = item.term.toLowerCase().split(/[\s,.-]+/);
    words.forEach(word => {
      if (word.length <= 2) return;
      wordSpendMap[word] = (wordSpendMap[word] || 0) + item.cost;
      wordConvMap[word] = (wordConvMap[word] || 0) + item.conversions;
    });
  });

  console.log(`\n--- Top 20 High-Spend Words (and their conversions) ---`);
  const sortedWordsBySpend = Object.keys(wordSpendMap).sort((a, b) => wordSpendMap[b] - wordSpendMap[a]);
  sortedWordsBySpend.slice(0, 20).forEach((word, index) => {
    const spend = wordSpendMap[word];
    const conv = wordConvMap[word] || 0;
    console.log(`${index + 1}. "${word}": Spend: $${spend.toFixed(2)} | Conversions: ${conv.toFixed(2)} | CPA: $${conv > 0 ? (spend / conv).toFixed(2) : 'Infinity'}`);
  });
}

run();
