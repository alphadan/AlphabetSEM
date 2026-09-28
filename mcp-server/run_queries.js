import { BigQuery } from "@google-cloud/bigquery";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env - check both mcp-server/.env and root .env
const mcpEnv = path.join(__dirname, "./.env");
const rootEnv = path.join(__dirname, "../.env");
if (fs.existsSync(mcpEnv)) {
  dotenv.config({ path: mcpEnv });
} else {
  dotenv.config({ path: rootEnv });
}

async function run() {
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.error("Using keyFilename:", keyFilename);
  if (!keyFilename) {
    console.error("GOOGLE_APPLICATION_CREDENTIALS is not defined in .env or environment.");
  }
  
  const bq = new BigQuery({ keyFilename });

  const queryA = `
WITH latest_campaigns AS (
  SELECT campaign_id, campaign_name, campaign_status,
         ROW_NUMBER() OVER (PARTITION BY campaign_id ORDER BY _PARTITIONTIME DESC) as rn
  FROM \`google_ads.p_ads_Campaign_3166231030\`
)
SELECT 
  c.campaign_name, 
  SUM(s.metrics_clicks) as clicks, 
  ROUND(SUM(s.metrics_cost_micros) / 1000000, 2) as cost_usd,
  SUM(s.metrics_conversions) as conversions,
  ROUND(SUM(s.metrics_conversions_value), 2) as conversion_value_usd
FROM latest_campaigns c
JOIN \`google_ads.p_ads_CampaignStats_3166231030\` s ON c.campaign_id = s.campaign_id
WHERE c.rn = 1 AND c.campaign_status = 'ENABLED'
  AND DATE(s._PARTITIONTIME) BETWEEN '2026-06-24' AND '2026-07-23'
GROUP BY c.campaign_name
ORDER BY cost_usd DESC;
  `;

  const queryB = `
WITH latest_campaigns AS (
  SELECT campaign_id, campaign_name, campaign_status,
         ROW_NUMBER() OVER (PARTITION BY campaign_id ORDER BY _PARTITIONTIME DESC) as rn
  FROM \`google_ads.p_ads_Campaign_3166231030\`
)
SELECT 
  c.campaign_name, 
  SUM(s.metrics_clicks) as clicks, 
  ROUND(SUM(s.metrics_cost_micros) / 1000000, 2) as cost_usd,
  SUM(s.metrics_conversions) as conversions,
  ROUND(SUM(s.metrics_conversions_value), 2) as conversion_value_usd
FROM latest_campaigns c
JOIN \`google_ads.p_ads_CampaignStats_3166231030\` s ON c.campaign_id = s.campaign_id
WHERE c.rn = 1 AND c.campaign_status = 'ENABLED'
  AND DATE(s._PARTITIONTIME) BETWEEN '2026-07-20' AND '2026-07-23'
GROUP BY c.campaign_name
ORDER BY cost_usd DESC;
  `;

  try {
    console.error("Running Query A (Last 30 Days)...");
    const [jobA] = await bq.createQueryJob({ query: queryA });
    const [rowsA] = await jobA.getQueryResults();

    console.error("Running Query B (Last 4 Days)...");
    const [jobB] = await bq.createQueryJob({ query: queryB });
    const [rowsB] = await jobB.getQueryResults();

    const output = {
      queryA_last_30_days: rowsA,
      queryB_last_4_days: rowsB
    };

    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    console.error("Error executing BigQuery queries:", error);
    process.exit(1);
  }
}

run();
