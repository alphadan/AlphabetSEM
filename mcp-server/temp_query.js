import { BigQuery } from "@google-cloud/bigquery";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, ".env") });

let keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (keyFilename) {
  if (!path.isAbsolute(keyFilename)) {
    const pathInRoot = path.resolve(__dirname, "..", keyFilename);
    const pathInMcp = path.resolve(__dirname, keyFilename);
    if (fs.existsSync(pathInMcp)) {
      keyFilename = pathInMcp;
    } else if (fs.existsSync(pathInRoot)) {
      keyFilename = pathInRoot;
    }
  }
} else {
  keyFilename = path.join(__dirname, "service-account-key.json");
}

const sqlQuery = `
SELECT DISTINCT c.campaign_name 
FROM \`google_ads.p_ads_SearchQueryStats_3166231030\` s
JOIN \`google_ads.p_ads_Campaign_3166231030\` c ON s.campaign_id = c.campaign_id
WHERE c.campaign_name LIKE '%Truck%' OR c.campaign_name LIKE '%VL07%'
`;

try {
  const bq = new BigQuery({ keyFilename });
  const [job] = await bq.createQueryJob({ query: sqlQuery });
  const [rows] = await job.getQueryResults();
  console.log(JSON.stringify({ success: true, count: rows.length, rows }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ success: false, error: err.message, stack: err.stack }, null, 2));
}
