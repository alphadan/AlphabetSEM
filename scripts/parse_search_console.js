import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to handle ESM paths in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const csvPath = path.join(__dirname, '../reports/search_console/queries_report.csv');
const outputPath = path.join(__dirname, '../reports/search_console/gsc_opportunities.json');

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

function runGSCParser() {
  console.log('====================================================');
  console.log('    AlphabetSEM - Google Search Console Parser      ');
  console.log('====================================================');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`⚠️ Error: Could not find raw Queries CSV report at:`);
    console.error(`  ${csvPath}`);
    console.error(`\nPlease export your 'Queries.csv' from GSC, rename it to 'queries_report.csv', and save it in that folder!`);
    process.exit(1);
  }
  
  const rawContent = fs.readFileSync(csvPath, 'utf8');
  const lines = rawContent.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // GSC web export usually starts directly with headers, but let's check
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const parsedLine = parseCSVLine(lines[i]);
    if (parsedLine.some(h => h.toLowerCase().includes('query') || h.toLowerCase().includes('click') || h.toLowerCase().includes('impression'))) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = parseCSVLine(lines[headerRowIndex]);
  const dataRows = lines.slice(headerRowIndex + 1);

  console.log(`Headers detected: [${headers.join(', ')}]`);
  console.log(`Total organic search terms found: ${dataRows.length}`);

  const opportunities = [];

  dataRows.forEach(rowString => {
    const row = parseCSVLine(rowString);
    if (row.length < headers.length) return;
    
    const query = row[0];
    const clicks = parseInt(row[1].replace(/,/g, ''), 10) || 0;
    const impressions = parseInt(row[2].replace(/,/g, ''), 10) || 0;
    
    // Parse CTR (e.g. "1.25%" or "0.0125")
    let ctrVal = row[3];
    let ctrNum = 0.0;
    if (ctrVal.includes('%')) {
      ctrNum = parseFloat(ctrVal.replace('%', ''));
    } else {
      ctrNum = parseFloat(ctrVal) * 100;
    }
    
    const position = parseFloat(row[4]) || 0.0;

    // Opportunity Heuristic: High impressions (>1000) but low click-through-rate (< 1.5%)
    // These represent high-volume keywords where your site is ranking, but your meta tag title is boring!
    if (impressions > 500 && ctrNum < 1.8) {
      let priority = 'low';
      if (impressions > 5000) priority = 'high';
      else if (impressions > 1500) priority = 'medium';

      opportunities.push({
        query,
        impressions: impressions.toLocaleString(),
        clicks: clicks.toLocaleString(),
        ctr: `${ctrNum.toFixed(2)}%`,
        position: position.toFixed(1),
        priority
      });
    }
  });

  // Sort opportunities by highest impressions first
  opportunities.sort((a, b) => {
    const impA = parseInt(a.impressions.replace(/,/g, ''), 10);
    const impB = parseInt(b.impressions.replace(/,/g, ''), 10);
    return impB - impA;
  });

  // Save the structured JSON file
  fs.writeFileSync(outputPath, JSON.stringify(opportunities, null, 2), 'utf8');

  console.log(`\n====================================================`);
  console.log(`🎉  PARSING COMPLETE! Saved ${opportunities.length} GSC high-potential opportunities.`);
  console.log(`📁 File written to: \n  ${outputPath}`);
  console.log('====================================================');
}

runGSCParser();
