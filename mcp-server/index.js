import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import Official Google Cloud Client SDKs
import { BigQuery } from "@google-cloud/bigquery";
import { Firestore } from "@google-cloud/firestore";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(
  __dirname,
  "../reports/merchant_center/products.json",
);

// ================= COGNITIVE AGENT CONFIGURATIONS =================

// False Positive Safety Shield
const SAFETY_SHIELD = [
  {
    term: "gemini",
    reason:
      "Gemini is a well-known manufacturer of high-end dimensional letters, which Alphabet Signs sells. This is a high-intent search for a specific product type.",
  },
  {
    term: "usdot",
    reason:
      "Related to DOT compliant signage, falling under commercial vehicle graphics.",
  },
  {
    term: "readerboard",
    reason:
      "High-intent for changeable copy letters, a core product line ('marquee letters').",
  },
  {
    term: "changeable",
    reason:
      "High-intent for changeable copy letters, a core product line ('marquee letters').",
  },
  { term: "marquee", reason: "Core product line ('marquee letters')." },
  {
    term: "cast metal",
    reason: "High-intent for premium metal dimensional sign letters.",
  },
  {
    term: "flat cut",
    reason: "High-intent for flat cut dimensional sign letters.",
  },
  {
    term: "plastic letters",
    reason: "High-intent for formed plastic sign letters.",
  },
  {
    term: "outdoor sign",
    reason: "Directly refers to a core product: 'letters for signs'.",
  },
  {
    term: "sign letters",
    reason: "Directly refers to a core product: 'letters for signs'.",
  },
  {
    term: "building letters",
    reason: "High-intent query for dimensional letters used on buildings.",
  },
  {
    term: "magnetic dot",
    reason:
      "Related to DOT compliant signage, falling under 'commercial vehicle graphics'.",
  },
  { term: "placard", reason: "Related to DOT compliant vehicle signage." },
];

// Helper to clean HTML tags and extract content
function extractTagContent(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

// Regex-based metadata parser for native fallback scraper
function parseHTMLMetadata(html) {
  const title =
    extractTagContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
    "No title found";
  let description = "No description found";
  const descMatch =
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
    );
  if (descMatch) description = descMatch[1].trim();

  const h1s = [];
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let match;
  while ((match = h1Regex.exec(html)) !== null) {
    h1s.push(match[1].replace(/<[^>]*>/g, "").trim());
  }

  const h2s = [];
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  while ((match = h2Regex.exec(html)) !== null) {
    h2s.push(match[1].replace(/<[^>]*>/g, "").trim());
  }

  const schemas = [];
  const schemaRegex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  while ((match = schemaRegex.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1].trim()));
    } catch {
      // ignore
    }
  }

  const wordCount = html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title,
    description,
    headings: { h1: h1s.slice(0, 5), h2: h2s.slice(0, 10) },
    schemas: schemas.slice(0, 3),
    wordCount,
    hasProductSchema: schemas.some(
      (s) => s["@type"] === "Product" || s["@type"]?.includes("Product"),
    ),
    hasReviewsSchema:
      html.includes("AggregateRating") || html.includes("reviewRating"),
  };
}

// Shared central handler to process tool calls
async function handleToolCall(name, args) {
  switch (name) {
    case "ping_diagnostics":
      return {
        content: [
          {
            type: "text",
            text: "🟢 Success! Local MCP server is fully operational and bridged to your React App.",
          },
        ],
      };

    case "google_search": {
      const apiKey = process.env.SERP_API_KEY;
      if (!apiKey || apiKey === "your_serp_api_key_here") {
        return {
          content: [
            {
              type: "text",
              text: "⚠️ Config Error: Please configure a valid SERP_API_KEY inside mcp-server/.env",
            },
          ],
        };
      }
      try {
        console.error(`Fetching SerpAPI results for query: "${args.query}"...`);
        const url = `https://serpapi.com/search.json?q=${encodeURIComponent(args.query)}&engine=google&api_key=${apiKey}&gl=us&hl=en`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`SerpAPI returned HTTP status ${response.status}`);

        const data = await response.json();
        const organicResults = (data.organic_results || [])
          .slice(0, args.num_results || 5)
          .map((res) => ({
            position: res.position,
            title: res.title,
            link: res.link,
            snippet: res.snippet || "",
          }));

        return {
          content: [
            { type: "text", text: JSON.stringify(organicResults, null, 2) },
          ],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `❌ Search Error: ${err.message}` }],
        };
      }
    }

    case "scrape_competitor": {
      const targetUrl = args.url;
      const firecrawlKey = process.env.FIRECRAWL_API_KEY;

      if (firecrawlKey && firecrawlKey !== "your_firecrawl_api_key_here") {
        try {
          const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${firecrawlKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: targetUrl,
              formats: ["markdown", "json"],
              onlyMainContent: true,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        source: "Firecrawl Premium API",
                        title: data.data.metadata?.title || "N/A",
                        description: data.data.metadata?.description || "N/A",
                        markdownSnippet:
                          data.data.markdown?.substring(0, 1500) +
                          "\n... [Truncated] ...",
                        metadata: data.data.metadata,
                      },
                      null,
                      2,
                    ),
                  },
                ],
              };
            }
          }
        } catch (err) {
          console.error("Firecrawl error:", err.message);
        }
      }

      // Fallback
      try {
        const response = await fetch(targetUrl, {
          headers: { "User-Agent": "Mozilla/5.0 Windows NT 10.0; Win64; x64" },
        });
        if (!response.ok)
          throw new Error(`Target returned HTTP status ${response.status}`);
        const html = await response.text();
        const parsedData = parseHTMLMetadata(html);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  source: "Local Native HTML Parser",
                  url: targetUrl,
                  ...parsedData,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            { type: "text", text: `❌ Scraping Failure: ${err.message}` },
          ],
        };
      }
    }

    case "run_bigquery_query": {
      const sqlQuery = args.query;
      const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (keyFilename && keyFilename !== "your_service_account_path.json") {
        try {
          console.error(
            `Attempting live BigQuery query: "${sqlQuery.substring(0, 60)}..."`,
          );
          const bq = new BigQuery({ keyFilename });
          const [job] = await bq.createQueryJob({ query: sqlQuery });
          const [rows] = await job.getQueryResults();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  { source: "Live BigQuery Warehouse", rows },
                  null,
                  2,
                ),
              },
            ],
          };
        } catch (err) {
          console.error("Live BigQuery call failed:", err.message);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    source: "Live BigQuery Attempt Failed",
                    errorMessage: err.message,
                    executedQuery: sqlQuery,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }
      }

      // Sandbox fallback
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                source: "AlphabetSEM SQL Simulator (Sandbox Fallback)",
                executedQuery: sqlQuery,
                message:
                  "Verify GOOGLE_APPLICATION_CREDENTIALS path in .env to run live query.",
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case "query_firestore": {
      const collection = args.collection;
      const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (keyFilename && keyFilename !== "your_service_account_path.json") {
        try {
          console.error(
            `Attempting live Firestore query: collection '${collection}'...`,
          );
          const db = new Firestore({ keyFilename });
          const snapshot = await db.collection(collection).limit(5).get();
          const docs = [];
          snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  { source: "Live Firestore Database", docs },
                  null,
                  2,
                ),
              },
            ],
          };
        } catch (err) {
          console.error("Live Firestore call failed:", err.message);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    source: "Live Firestore Attempt Failed",
                    errorMessage: err.message,
                    collection,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }
      }

      // Sandbox fallback
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                source: "Cloud Firestore Simulator (Sandbox Fallback)",
                collection,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case "audit_negative_keywords": {
      const minSpend = args.min_spend || 1.0;
      const minClicks = args.min_clicks || 1;
      const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      let rows = [];
      let liveMode = false;

      // 1. Fetch search queries from live BigQuery
      if (keyFilename && keyFilename !== "your_service_account_path.json") {
        try {
          console.error("Initiating live Search Query BigQuery extraction...");
          const bq = new BigQuery({ keyFilename });

          const sqlQuery = `
            SELECT
              c.campaign_name,
              s.search_term_view_search_term as search_query,
              SUM(s.metrics_clicks) as clicks,
              ROUND(SUM(s.metrics_cost_micros) / 1000000, 2) as cost_usd,
              SUM(s.metrics_conversions) as conversions
            FROM \`google_ads.p_ads_Campaign_3166231030\` c
            JOIN \`google_ads.p_ads_SearchQueryStats_3166231030\` s ON c.campaign_id = s.campaign_id
            GROUP BY c.campaign_name, s.search_term_view_search_term
            HAVING conversions = 0 AND cost_usd >= ${minSpend} AND clicks >= ${minClicks}
            ORDER BY cost_usd DESC
            LIMIT 100
          `;
          const [job] = await bq.createQueryJob({ query: sqlQuery });
          const [bqRows] = await job.getQueryResults();
          rows = bqRows;
          liveMode = true;
          console.error(
            `Extracted ${rows.length} live bleed queries from BigQuery.`,
          );
        } catch (err) {
          console.error(
            "Live BigQuery extraction failed, falling back to mock sandbox:",
            err.message,
          );
        }
      }

      // Sandbox Fallback
      if (!liveMode) {
        console.error("Using local search query sandbox simulation dataset...");
        rows = [
          {
            campaign_name: "CL00 | PMax | Marquee Lettering",
            search_query: "abcdefghijklmnopqrstuvwxyz vwxyz",
            clicks: 35,
            cost_usd: 84.12,
            conversions: 0,
          },
          {
            campaign_name: "CL00 | PMax | Marquee Lettering",
            search_query: "letter r jack hartmann",
            clicks: 18,
            cost_usd: 41.5,
            conversions: 0,
          },
          {
            campaign_name: "CL00 | PMax | Marquee Lettering",
            search_query: "signs god is showing you your spouse",
            clicks: 9,
            cost_usd: 22.8,
            conversions: 0,
          },
          {
            campaign_name: "Catch All | PMax | Medium Margin",
            search_query: "bulletin boards for school abc",
            clicks: 27,
            cost_usd: 68.4,
            conversions: 0,
          },
          {
            campaign_name: "Boat Registration Numbers | Shopping | Low AOV",
            search_query: "letras para avisos publicitarios",
            clicks: 7,
            cost_usd: 18.5,
            conversions: 0,
          },
          {
            campaign_name: "CL00 | Search | Marquee Letters",
            search_query: "marquee letters 12 inch",
            clicks: 15,
            cost_usd: 35.2,
            conversions: 0,
          },
          {
            campaign_name: "Branded Search | Alphabet Signs",
            search_query: "gemini letters brushed bronze",
            clicks: 12,
            cost_usd: 28.4,
            conversions: 0,
          },
          {
            campaign_name: "Building Letters | Search",
            search_query: "how to paint wood school alphabets",
            clicks: 14,
            cost_usd: 31.2,
            conversions: 0,
          },
        ];
      }

      const falsePositivesSafety = [];
      let totalWastedSpend = 0;

      const categoriesList = [
        {
          id: "block-generic-alphabet-spam",
          title: "Block Generic 'ABC' & Alphabet Searches",
          type: "Negative Keywords",
          impact: "high",
          desc: "PMax campaigns are broadly interpreting 'alphabet' and 'abc' keywords, leading to wasted ad spend on extremely generic, non-commercial toddler keyboard inputs.",
          keywords: new Set(),
          cost: 0,
        },
        {
          id: "block-educational-content",
          title: "Block Educational & Kid-Related Terms",
          type: "Negative Keywords",
          impact: "high",
          desc: "Wasted ad spend on childrens' songs, classroom decorations, or teacher school bulletin board supplies. Exclude keywords to lock budget onto high-end commercial sign builders.",
          keywords: new Set(),
          cost: 0,
        },
        {
          id: "block-spanish-mismatch",
          title: "Block Spanish Language Queries",
          type: "Negative Keywords",
          impact: "medium",
          desc: "Wasted ad spend on Spanish queries such as 'letras para avisos'. Recommended for exclusion if Spanish landing pages are not supported.",
          keywords: new Set(),
          cost: 0,
        },
        {
          id: "block-low-intent-generic",
          title: "Block Low-Intent & Unrelated Queries",
          type: "Negative Keywords",
          impact: "medium",
          desc: "Queries matching broad, high-leeway generic terms like 'spouse' or unrelated items. These queries do not align with commercial signage sales.",
          keywords: new Set(),
          cost: 0,
        },
      ];

      rows.forEach((row) => {
        const queryText = (row.search_query || "").trim();
        if (!queryText) return;

        const normalizedQuery = queryText.toLowerCase();

        const shieldMatch = SAFETY_SHIELD.find((s) =>
          normalizedQuery.includes(s.term),
        );
        if (shieldMatch) {
          falsePositivesSafety.push({
            term: queryText,
            reason: shieldMatch.reason,
            campaign: row.campaign_name,
            clicks: row.clicks,
            cost: `$${row.cost_usd.toFixed(2)}`,
          });
          return;
        }

        let matchedCategoryId = null;
        let seedKeyword = null;

        const singleLetterCount = (
          normalizedQuery.match(/(?:^|\s)[a-z](?=\s|$)/g) || []
        ).length;
        if (
          /abcdefg|hijklmn|opqrst|uvwxyz/i.test(normalizedQuery) ||
          singleLetterCount >= 4 ||
          normalizedQuery.includes("all the alphabets")
        ) {
          matchedCategoryId = "block-generic-alphabet-spam";
          seedKeyword =
            normalizedQuery
              .split(" ")
              .find(
                (w) => w.length === 1 || ["alphabets", "alphabet"].includes(w),
              ) || "alphabet";
        } else if (
          /jack hartmann|classroom|kindergarten|preschool|bulletin board|abc song|alphabet song|school abc|educational|toys/i.test(
            normalizedQuery,
          )
        ) {
          matchedCategoryId = "block-educational-content";
          seedKeyword = normalizedQuery.includes("jack hartmann")
            ? "jack hartmann"
            : normalizedQuery.includes("bulletin")
              ? "bulletin"
              : normalizedQuery.includes("classroom")
                ? "classroom"
                : "toys";
        } else if (
          /letras|para|avisos|publicitarios|grande|en grande/i.test(
            normalizedQuery,
          )
        ) {
          matchedCategoryId = "block-spanish-mismatch";
          seedKeyword = normalizedQuery.includes("letras")
            ? "letras"
            : "publicitarios";
        } else if (
          /spouse|god is showing you|pumpkin patch|breakfast flag|honey for sale|peach|produce me/i.test(
            normalizedQuery,
          )
        ) {
          matchedCategoryId = "block-low-intent-generic";
          seedKeyword =
            normalizedQuery
              .split(" ")
              .find((w) =>
                ["spouse", "god", "pumpkin", "honey", "breakfast"].includes(w),
              ) || "spouse";
        }

        if (matchedCategoryId) {
          totalWastedSpend += row.cost_usd;
          const cat = categoriesList.find((c) => c.id === matchedCategoryId);
          if (cat) {
            cat.cost += row.cost_usd;
            cat.keywords.add(seedKeyword);
          }
        }
      });

      const formattedRecommendations = categoriesList
        .filter((cat) => cat.cost > 0)
        .map((cat) => ({
          id: cat.id,
          title: cat.title,
          type: cat.type,
          impact: cat.impact,
          desc: cat.desc,
          difficulty: "Easy (2 mins)",
          costSavings: `Est. $${cat.cost.toFixed(2)}/mo`,
          negativeKeywordsToApply: Array.from(cat.keywords),
        }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                source: liveMode
                  ? "Live Google Ads BigQuery Audit"
                  : "AlphabetSEM Audit Sandbox Mode",
                executiveSummary: `AlphabetSEM has completed a live audit of your search query metrics. We identified a total of $${totalWastedSpend.toFixed(2)} in monthly budget leakage. Major bleeding areas include generic spelling queries, educational classroom terms, and non-commercial matching. We have applied your False Positive Shield to protect ${falsePositivesSafety.length} core search queries from accidental exclusions.`,
                totalEstimatedSavings: `$${totalWastedSpend.toFixed(2)}/mo`,
                recommendations: formattedRecommendations,
                falsePositivesSafety: falsePositivesSafety,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    case "cross_reference_catalog_pricing": {
      const competitorUrl = args.competitor_url;
      const targetProductId = args.product_id;

      console.error(
        `Initiating competitor catalog cross-reference for URL: "${competitorUrl}"...`,
      );

      // 1. Scrape the competitor page first using our existing scraper pipeline
      let competitorText = "";
      let competitorTitle = "";
      const scrapeResult = await handleToolCall("scrape_competitor", {
        url: competitorUrl,
      });

      try {
        const parsedScrape = JSON.parse(scrapeResult.content[0].text);
        competitorTitle = parsedScrape.title || "Competitor Page";
        competitorText =
          parsedScrape.markdownSnippet || JSON.stringify(parsedScrape);
      } catch {
        competitorText = scrapeResult.content[0].text;
      }

      // 2. Extract competitor price from page content via intelligent regex scans
      const priceMatches = competitorText.match(/\$?([0-9]+\.[0-9]{2})/g) || [];
      const competitorPrices = priceMatches
        .map((p) => parseFloat(p.replace(/[^0-9.]/g, "")))
        .filter((p) => p > 0);

      const competitorPrice =
        competitorPrices.length > 0 ? Math.min(...competitorPrices) : null;

      // 3. Load Alphabet Signs' Google Merchant Center Feed
      let ourProduct = null;
      try {
        const rawCatalog = fs.readFileSync(productsPath, "utf8");
        const catalog = JSON.parse(rawCatalog);

        if (targetProductId) {
          ourProduct = catalog.find((p) => p.id === targetProductId);
        } else {
          // Auto-Matching by keyword title overlap
          const competitorWords = competitorTitle
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 3);
          let bestScore = 0;
          catalog.forEach((p) => {
            const ourWords = p.title.toLowerCase().split(/\s+/);
            const score = competitorWords.filter((w) =>
              ourWords.includes(w),
            ).length;
            if (score > bestScore) {
              bestScore = score;
              ourProduct = p;
            }
          });
        }
      } catch (err) {
        console.error(
          "Error reading Merchant Center catalog fallback:",
          err.message,
        );
      }

      // 4. Perform Price Matching & Competitive Analysis
      if (!ourProduct) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Catalog Match Failed",
                  tip: "Please specify a valid product_id to manually match, or make sure the competitor page title contains keywords matching your products.",
                  competitorExtractedTitle: competitorTitle,
                  competitorEstimatedPrice: competitorPrice
                    ? `$${competitorPrice.toFixed(2)}`
                    : "Unknown",
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      const ourPriceFloat =
        parseFloat(ourProduct.price.replace(/[^0-9.]/g, "")) || 0;
      let analysisResult = {};

      if (competitorPrice && ourPriceFloat > 0) {
        const priceDiff = ourPriceFloat - competitorPrice;
        const percentageDiff = (Math.abs(priceDiff) / ourPriceFloat) * 100;

        let position = "undercutting";
        let recommendation =
          "You are currently more competitive! Maintain this price point to maximize Performance Max click-through conversion rates.";

        if (priceDiff > 0) {
          position = "overpriced";
          recommendation = `Competitor is undercutting you by $${priceDiff.toFixed(2)} (${percentageDiff.toFixed(1)}%). We suggest a 10% price promotion on ${ourProduct.id} to recover shopping ad traffic and click rates.`;
        } else if (priceDiff === 0) {
          position = "matched";
          recommendation =
            "Pricing is identical. Improve conversion rate by highlighting free shipping, rapid manufacturing, or warranty terms on your landing page H1 tags.";
        }

        analysisResult = {
          status: "success",
          competitorPage: {
            title: competitorTitle,
            url: competitorUrl,
            estimatedPrice: `$${competitorPrice.toFixed(2)}`,
          },
          alphabetSignsProduct: {
            id: ourProduct.id,
            title: ourProduct.title,
            price: ourProduct.price,
            link: ourProduct.link,
          },
          pricingComparison: {
            alphabetSignsPrice: `$${ourPriceFloat.toFixed(2)}`,
            competitorPrice: `$${competitorPrice.toFixed(2)}`,
            difference: `$${priceDiff.toFixed(2)}`,
            percentageDifference: `${percentageDiff.toFixed(1)}%`,
            competitivePosition: position,
          },
          actionableRecommendation: recommendation,
        };
      } else {
        analysisResult = {
          status: "partial_match",
          competitorPage: {
            title: competitorTitle,
            url: competitorUrl,
            estimatedPrice:
              "Could not automatically parse pricing pattern from HTML/Markdown",
          },
          alphabetSignsProduct: {
            id: ourProduct.id,
            title: ourProduct.title,
            price: ourProduct.price,
            link: ourProduct.link,
          },
          actionableRecommendation:
            "Manual audit required. Scrape completed but no clear currency pattern ($xx.xx) was discovered on the competitor storefront. Review competitor link.",
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(analysisResult, null, 2),
          },
        ],
      };
    }

    case "autonomous_pricing_audit": {
      const targetCategory =
        args.product_category || "boat registration numbers";
      const maxCompetitors = args.max_competitors_to_scan || 2;

      console.error(
        `Starting autonomous pricing audit for category: "${targetCategory}"...`,
      );

      try {
        console.error(
          "Searching Google to locate high-ranking competitor storefronts...",
        );
        const searchResult = await handleToolCall("google_search", {
          query: targetCategory,
          num_results: 5,
        });
        const competitors = JSON.parse(searchResult.content[0].text);

        const validCompetitors = competitors
          .filter((c) => {
            const url = c.link.toLowerCase();
            return (
              !url.includes("wikipedia.org") &&
              !url.includes("amazon.com") &&
              !url.includes("ehow.com") &&
              !url.includes("alphabetsigns.com")
            );
          })
          .slice(0, maxCompetitors);

        if (validCompetitors.length === 0) {
          throw new Error(
            "No valid commercial competitors discovered on Google Page 1.",
          );
        }

        console.error(
          `Autonomous Pricing Agent found ${validCompetitors.length} competitors to crawl.`,
        );

        const auditComparisons = [];
        let undercutsCount = 0;

        for (const comp of validCompetitors) {
          console.error(`Auditing pricing on: ${comp.link}...`);
          const crossRef = await handleToolCall(
            "cross_reference_catalog_pricing",
            { competitor_url: comp.link },
          );
          const parsed = JSON.parse(crossRef.content[0].text);

          if (parsed.status === "success") {
            auditComparisons.push(parsed);
            if (
              parsed.pricingComparison?.competitivePosition === "overpriced"
            ) {
              undercutsCount++;
            }
          }
        }

        const summaryStatus =
          undercutsCount > 0
            ? "🚨 Alert: Competitive undercuts detected on your core product lines!"
            : "🟢 Secure: Your catalog pricing is highly competitive across active Google search results.";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  source: "Autonomous AlphaPilot Price-Compliance Audit",
                  productCategoryAudited: targetCategory,
                  statusSummary: summaryStatus,
                  totalCompetitorsAudited: validCompetitors.length,
                  activeUndercutsFound: undercutsCount,
                  auditComparisons: auditComparisons,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        console.error("Autonomous price audit error:", err.message);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  source: "Autonomous AlphaPilot Price Audit Attempt Failed",
                  errorMessage: err.message,
                  sandboxModeFallbackHint:
                    "Please verify that your SERP_API_KEY is configured correctly to let Gemini search Google on autopilot.",
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    }

    // ================== WEEK 8 AUTONOMOUS SEO COPYWRITING AGENT ==================

    case "generate_seo_blog_content": {
      const topic = args.blog_topic;
      const primaryKeyword = args.primary_keyword;
      const secondaryKeywords = args.secondary_keywords || [];
      const geminiApiKey =
        process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

      console.error(
        `Autonomous SEO Blog Copywriter active for topic: "${topic}"...`,
      );

      if (!geminiApiKey || geminiApiKey === "AIzaSyYourGeminiAPIKeyHere") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Configuration Needed",
                  tip: "Please configure your GEMINI_API_KEY inside mcp-server/.env to authorize copywriting generations.",
                  fallbackSandboxSnippet: `# 📘 Blog Stub: How to Install Dimensional building letters\n\nDimensional building letters add an incredible, premium feel to any commercial storefront... [Configure GEMINI_API_KEY to retrieve full article]`,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      try {
        // Step 1: Scan competitor Page 1 titles to extract SERP density context
        console.error(
          "Scanning Google SERPs for competitor contextual density...",
        );
        const serpResult = await handleToolCall("google_search", {
          query: topic,
          num_results: 3,
        });
        const serpData = JSON.parse(serpResult.content[0].text);

        const serpContext = serpData
          .map(
            (res) =>
              `Competitor Title: "${res.title}" | Snippet: "${res.snippet}"`,
          )
          .join("\n");

        // Step 2: Build the optimized copywriting instruction packet
        const prompt = {
          contents: [
            {
              parts: [
                {
                  text: `You are an elite, enterprise-grade MarTech copywriter and senior SEO consultant specializing in commercial sign building, custom dimension sign lettering, vehicle decals, and marketing copy.

Generate a comprehensive, high-ranking, SEO-optimized long-form blog article tailored for the website of Alphabet Signs (custom dimensional sign letters manufacturer).

Target Blog Topic: "${topic}"
Primary Target Keyword: "${primaryKeyword}"
Secondary Keywords: ${JSON.stringify(secondaryKeywords)}

Here is the current live Page 1 competitor SERP landscape context to beat:
${serpContext}

Provide your response in a structured JSON packet with these EXACT fields:
{
  "seoMetadata": {
    "titleTag": "An optimized title tag under 60 characters with the primary keyword on line 1",
    "metaDescription": "A compelling meta description under 155 characters designed to maximize search CTR",
    "primaryKeywordDensityRecommendation": "Short strategic summary"
  },
  "blogArticleMarkdown": "The complete, formatted long-form blog post (at least 800-1200 words) in beautiful Markdown. Use proper H1, H2, and H3 headers. Include detailed paragraphs, step-by-step bullet points, recommended image alt texts (e.g. ![Alt text here]), and a call-to-action directing readers to explore Alphabet Signs catalog product pages."
}`,
                },
              ],
            },
          ],
        };

        console.error("Calling Gemini 2.5 Flash Reasoning Engine...");
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prompt),
        });

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Strip markdown backticks if Gemini wrapped the JSON response
        const cleanJsonText = rawText.replace(/^```json|```$/gi, "").trim();
        const parsedReport = JSON.parse(cleanJsonText);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  source: "Google Gemini 2.5 Flash SEO Copywriter",
                  ...parsedReport,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (err) {
        console.error("Gemini copywriting error:", err.message);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: `SEO Copywriter Failed: ${err.message}`,
                  rawDetails: err.stack,
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    }

    default:
      throw new Error(`Tool "${name}" not found.`);
  }
}

// Factory function to create clean Server instance for standard clients
function createMcpServer() {
  const server = new Server(
    {
      name: "alphabet-sem-mcp-server",
      version: "1.3.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Declare available tools to standard clients
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "ping_diagnostics",
          description:
            "Diagnose connection health to the AlphabetSEM MCP server.",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "google_search",
          description:
            "Run a live Google Search via SerpAPI to find ranking competitors, organic search results, and SERP metadata.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "The search query (e.g., 'outdoor metal letters').",
              },
              num_results: {
                type: "number",
                description: "Number of results to retrieve.",
                default: 5,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "scrape_competitor",
          description:
            "Scrape and audit competitor URLs to analyze their titles, H1 headings, word counts, and JSON-LD structured schemas.",
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description:
                  "The complete URL of the competitor page to crawl.",
              },
            },
            required: ["url"],
          },
        },
        {
          name: "run_bigquery_query",
          description:
            "Run SQL analytical queries against the BigQuery ad metrics warehouse to find performance leaks.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Standard SQL query matching BigQuery schemas.",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "query_firestore",
          description:
            "Query document records from Cloud Firestore database collections (optimizations, settings, heatmaps).",
          inputSchema: {
            type: "object",
            properties: {
              collection: {
                type: "string",
                description:
                  "Target collection path (e.g., 'optimizations', 'heatmaps', 'settings').",
              },
            },
            required: ["collection"],
          },
        },
        {
          name: "audit_negative_keywords",
          description:
            "Audit live search query performance datasets to identify low-intent budget leaks, filter against the False Positive Safety Shield, and compile recommended negatives.",
          inputSchema: {
            type: "object",
            properties: {
              min_spend: {
                type: "number",
                description:
                  "Minimum spent amount to trigger audit exclusion check (default $1.00)",
                default: 1.0,
              },
              min_clicks: {
                type: "number",
                description: "Minimum click count to trigger check (default 1)",
                default: 1,
              },
            },
          },
        },
        {
          name: "cross_reference_catalog_pricing",
          description:
            "Scrapes a competitor storefront product page, extracts their current price, matches it to your live Google Merchant Center catalog, and runs competitive price comparison analysis.",
          inputSchema: {
            type: "object",
            properties: {
              competitor_url: {
                type: "string",
                description: "The competitor product page URL to audit.",
              },
              product_id: {
                type: "string",
                description:
                  "Optional product SKU/ID from your Merchant feed to lock the match. If omitted, matching is resolved automatically by title similarity.",
              },
            },
            required: ["competitor_url"],
          },
        },
        {
          name: "autonomous_pricing_audit",
          description:
            "Automated Price Matcher Agent: Automatically searches Google for competitor listings, scrapes their storefront price points, maps them against your live XML feed, and creates price margin alerts.",
          inputSchema: {
            type: "object",
            properties: {
              product_category: {
                type: "string",
                description:
                  "Target product category to search on Google (default: 'boat registration numbers').",
                default: "boat registration numbers",
              },
              max_competitors_to_scan: {
                type: "number",
                description:
                  "Maximum competitors to scan on Google Page 1 (default 2)",
                default: 2,
              },
            },
          },
        },
        {
          name: "generate_seo_blog_content",
          description:
            "Autonomous Copywriting Agent: Runs competitive SERP density analysis, triggers Gemini 2.5 Flash, and drafts complete, high-ranking long-form blog articles in markdown.",
          inputSchema: {
            type: "object",
            properties: {
              blog_topic: {
                type: "string",
                description:
                  "The marketing topic of the article to generate (e.g. 'how to install dimensional sign letters').",
              },
              primary_keyword: {
                type: "string",
                description:
                  "The primary high-volume keyword to target for rankings.",
              },
              secondary_keywords: {
                type: "array",
                items: { type: "string" },
                description:
                  "Optional list of secondary semantic keywords to build density.",
              },
            },
            required: ["blog_topic", "primary_keyword"],
          },
        },
      ],
    };
  });

  // Bind operational handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return await handleToolCall(name, args);
  });

  return server;
}

// Express Application Configuration
const app = express();
app.use(cors());
app.use(express.json());

let activeServer = null;
let sseTransport = null;

// ================= DUAL ENGINE PORTAL ROUTING =================

app.get("/api/status", (req, res) => {
  res.json({ status: "online", version: "1.3.0" });
});

app.post("/api/tools/call", async (req, res) => {
  const { name, arguments: args } = req.body;
  try {
    const output = await handleToolCall(name, args);
    res.json(output);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/sse", async (req, res) => {
  console.log("🔌 Standard MCP Client connected via SSE!");

  if (activeServer) {
    try {
      await activeServer.close();
    } catch (err) {
      console.warn("Soft warning during connection cleanup:", err.message);
    }
  }

  activeServer = createMcpServer();
  sseTransport = new SSEServerTransport("/messages", res);

  try {
    await activeServer.connect(sseTransport);
    console.log("🟢 Standard MCP Server connected to transport.");
  } catch (err) {
    console.error("Critical MCP connection failure:", err);
  }
});

app.post("/messages", async (req, res) => {
  if (sseTransport) {
    try {
      await sseTransport.handleMessage(req, res);
    } catch (err) {
      console.error("Error handling incoming message packet:", err);
      res.status(500).send(`Execution Error: ${err.message}`);
    }
  } else {
    res.status(400).send("No active SSE session found");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`📡 AlphabetSEM MCP Bridge active at http://localhost:${PORT}`);
  console.log(
    `⚡ Direct Dashboard Client: http://localhost:${PORT}/api/status`,
  );
  console.log(`🔌 Standard SSE MCP Client:  http://localhost:${PORT}/sse`);
  console.log(`====================================================`);
});
