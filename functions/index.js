import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

/**
 * 1. DAILY SCHEDULED CRON JOB (Runs every night at 2:00 AM)
 * Pulls recent search queries, triggers Gemini analysis, and saves to Firestore.
 */
export const scheduledDailyAudit = onSchedule({
  schedule: '0 2 * * *', // 2:00 AM daily
  timeZone: 'America/New_York',
  secrets: ['GEMINI_API_KEY'], // Securely inject API key from Google Cloud Secret Manager
}, async (event) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY secret environment variable.");
    return;
  }

  console.log("Starting scheduled daily Google Ads search term audit...");

  try {
    // 1. Fetch latest raw search terms (In production, this queries BigQuery)
    // For this scaffold, we fetch recent sync transactions or a sample dataset
    const rawTerms = await fetchRecentSearchTermsFromBigQuery();
    
    if (rawTerms.length === 0) {
      console.log("No new search terms to analyze.");
      return;
    }

    // 2. Query Gemini 2.5 Flash
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
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
      `Analyze these search terms: ${JSON.stringify(rawTerms)}`
    ]);

    const auditResult = JSON.parse(result.response.text());

    // 3. Save recommendations to Firestore (keeps the dashboard loaded with fresh recommendations)
    const auditRef = db.collection('audits').doc('latest');
    await auditRef.set({
      ...auditResult,
      updatedAt: FieldValue.serverTimestamp()
    });

    console.log("Daily audit completed and saved to Firestore successfully!");
  } catch (error) {
    console.error("Error during scheduled audit:", error);
  }
});

/**
 * 2. FRONTEND CALLABLE FUNCTION: Get Latest Recommendations
 * Fetches the structured recommendations stored in Firestore.
 */
export const getRecommendations = onCall(async (request) => {
  try {
    const doc = await db.collection('audits').doc('latest').get();
    if (!doc.exists) {
      throw new HttpsError('not-found', 'No audit recommendations found.');
    }
    return doc.data();
  } catch (error) {
    throw new HttpsError('internal', error.message);
  }
});

/**
 * 3. FRONTEND CALLABLE FUNCTION: Process Approval/Rejection
 * Updates recommendation status and queues approved negative keywords for syncing.
 */
export const processRecommendationAction = onCall(async (request) => {
  const { recommendationId, action } = request.data; // action = 'approved' or 'rejected'

  if (!recommendationId || !action) {
    throw new HttpsError('invalid-argument', 'Missing recommendationId or action.');
  }

  try {
    const actionRef = db.collection('actions').doc(recommendationId);
    await actionRef.set({
      action,
      processed: false, // Wait for syncing engine to push to Google Ads API
      updatedAt: FieldValue.serverTimestamp()
    });

    return { success: true, message: `Recommendation ${recommendationId} marked as ${action}` };
  } catch (error) {
    throw new HttpsError('internal', error.message);
  }
});

// Mock function representing BigQuery extraction
async function fetchRecentSearchTermsFromBigQuery() {
  // In production, you would run a BigQuery SQL query to pull search terms
  // that have impressions but 0 conversions over the last 24 hours.
  return [
    { term: "abcdefghijklmnopqrstuvwxyz", clicks: 15, cost: 8.50 },
    { term: "classroom alphabet banner", clicks: 2, cost: 5.20 },
    { term: "abc song download free", clicks: 8, cost: 4.10 }
  ];
}
