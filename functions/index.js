import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Helper to extract XML tag contents
function getTagContent(itemString, tagName) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = itemString.match(regex);
  if (!match) return "";

  let content = match[1].trim();
  content = content.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/g, "$1").trim();
  return content;
}

/**
 * 1. DAILY SCHEDULED CRON JOB (Runs every night at 2:00 AM)
 * Pulls recent search queries, triggers Gemini analysis, and saves to Firestore.
 */
export const scheduledDailyAudit = onSchedule(
  {
    schedule: "0 2 * * *", // 2:00 AM daily
    timeZone: "America/New_York",
    secrets: ["GEMINI_API_KEY"], // Securely inject API key from Google Cloud Secret Manager
  },
  async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY secret environment variable.");
      return;
    }

    console.log("Starting scheduled daily Google Ads search term audit...");

    try {
      const rawTerms = await fetchRecentSearchTermsFromBigQuery();

      if (rawTerms.length === 0) {
        console.log("No new search terms to analyze.");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const systemPrompt = `
      You are an elite Google Ads SEM Analyst for 'Alphabet Signs'.
      Analyze the list of search terms and group budget leaks into logical Negative Keyword Exclusions.
      Output a valid JSON object matching this schema:
      {
        "executiveSummary": "brief text summary of the leaks",
        "totalEstimatedSavings": "$X,XXX/mo",
        "recommendations": [
          {
            "id": "unique-id",
            "title": "Group Title",
            "type": "Negative Keywords",
            "impact": "high" or "medium" or "low",
            "desc": "Explanation with examples of keywords to block.",
            "difficulty": "Easy (2 mins)",
            "costSavings": "Est. $XXX/mo",
            "negativeKeywordsToApply": ["word1", "word2"]
          }
        ]
      }
    `;

      const result = await model.generateContent([
        systemPrompt,
        `Analyze these search terms: ${JSON.stringify(rawTerms)}`,
      ]);

      const auditResult = JSON.parse(result.response.text());

      const auditRef = db.collection("audits").doc("latest");
      await auditRef.set({
        ...auditResult,
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log("Daily audit completed and saved to Firestore successfully!");
    } catch (error) {
      console.error("Error during scheduled audit:", error);
    }
  },
);

/**
 * 2. DAILY PRODUCT FEED SYNC CRON JOB (Runs daily at 4:00 AM)
 * Fetches Google Merchant Center product feed, parses it, and updates Firestore.
 */
export const scheduledProductFeedSync = onSchedule(
  {
    schedule: "0 4 * * *", // 4:00 AM daily
    timeZone: "America/New_York",
    cpu: 1, // Allocate sufficient memory for heavy XML string parsing
    memory: "256MiB",
  },
  async (event) => {
    const feedUrl = "https://www.alphabetsigns.com/google-product-feed.html";
    console.log(`Starting daily 4:00 AM Product Feed Sync from: ${feedUrl}`);

    try {
      const res = await fetch(feedUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch feed`);

      const xmlText = await res.text();
      const items = xmlText.split("<item>").slice(1);

      console.log(
        `Parsed ${items.length} product items. Commencing Firestore batch-write...`,
      );

      const batch = db.batch();
      const catalogList = [];

      // Process each item and map variables cleanly
      items.forEach((itemString, index) => {
        const id =
          getTagContent(itemString, "g:id") ||
          getTagContent(itemString, "id") ||
          `PROD-${index}`;
        const title =
          getTagContent(itemString, "title") ||
          getTagContent(itemString, "g:title");
        const description = getTagContent(itemString, "description")
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const link = getTagContent(itemString, "link");
        const imageLink =
          getTagContent(itemString, "g:image_link") ||
          getTagContent(itemString, "image_link");
        const price =
          getTagContent(itemString, "g:price") ||
          getTagContent(itemString, "price");
        const brand = getTagContent(itemString, "g:brand") || "Alphabet Signs";
        const mpn = getTagContent(itemString, "g:mpn") || "N/A";
        const gtin = getTagContent(itemString, "g:gtin") || "N/A";
        const condition = getTagContent(itemString, "g:condition") || "new";
        const availability =
          getTagContent(itemString, "g:availability") || "in_stock";
        const productType =
          getTagContent(itemString, "g:product_type") || "General Signs";
        const custom_label_0 =
          getTagContent(itemString, "g:custom_label_0") || "N/A";

        const productData = {
          id,
          title,
          description,
          link,
          image: imageLink,
          price,
          brand,
          mpn,
          gtin,
          condition,
          availability,
          category: productType,
          custom_label_0,
          updatedAt: FieldValue.serverTimestamp(),
        };

        // 1. Queue a write for individual product documents (useful for search collections queries)
        const prodRef = db.collection("products").doc(id);
        batch.set(prodRef, productData, { merge: true });

        // Save a mini summary reference for fast frontend loading
        catalogList.push({
          id,
          title,
          price,
          image: imageLink,
          category: productType,
          custom_label_0,
          availability,
        });
      });

      // 2. Also save consolidated catalog summary in one compact document
      const catalogRef = db.collection("catalog").doc("latest");
      batch.set(catalogRef, {
        products: catalogList,
        totalCount: catalogList.length,
        lastSync: FieldValue.serverTimestamp(),
      });

      await batch.commit();
      console.log(
        `Success! Firestore updated with ${catalogList.length} products.`,
      );
    } catch (error) {
      console.error("Error during scheduled product feed sync:", error);
    }
  },
);

/**
 * 3. FRONTEND CALLABLE FUNCTION: Get Latest Recommendations
 */
export const getRecommendations = onCall(async (request) => {
  try {
    const doc = await db.collection("audits").doc("latest").get();
    if (!doc.exists) {
      throw new HttpsError("not-found", "No audit recommendations found.");
    }
    return doc.data();
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});

/**
 * 4. FRONTEND CALLABLE FUNCTION: Process Approval/Rejection
 */
export const processRecommendationAction = onCall(async (request) => {
  const { recommendationId, action } = request.data;

  if (!recommendationId || !action) {
    throw new HttpsError(
      "invalid-argument",
      "Missing recommendationId or action.",
    );
  }

  try {
    const actionRef = db.collection("actions").doc(recommendationId);
    await actionRef.set({
      action,
      processed: false,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: `Recommendation ${recommendationId} marked as ${action}`,
    };
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});

// Mock function representing BigQuery extraction
async function fetchRecentSearchTermsFromBigQuery() {
  return [
    { term: "abcdefghijklmnopqrstuvwxyz", clicks: 15, cost: 8.5 },
    { term: "classroom alphabet banner", clicks: 2, cost: 5.2 },
    { term: "abc song download free", clicks: 8, cost: 4.1 },
  ];
}
