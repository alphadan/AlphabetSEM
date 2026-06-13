🚀 AlphabetSEM — Marketing Intelligence & Automation Command Center

AlphabetSEM is a proprietary, enterprise-grade **Marketing Technology (MarTech)** command center custom-built for **Alphabet Signs**. 

It integrates developers' serverless infrastructure (Vite, React, Tailwind, and Firebase) directly with the raw analytical power of **Gemini 2.5 Flash** and automated **BigQuery Data Warehouses** to isolate multi-channel ad budget waste, maximize organic search CTR, and automate customer lifetime value recovery.

---

## 🏗️ System Architecture

*   **Google Ads API** ➡️ Daily Sync ➡️ **BigQuery Dataset**
*   **Google Analytics 4** ➡️ Streaming Logs ➡️ **BigQuery Dataset**
*   **Search Console** ➡️ Daily Bulk Export ➡️ **BigQuery Dataset**
*   **BigQuery SQL** ➡️ **Firebase Cloud Functions** ➡️ **Gemini 2.5 Flash** ➡️ **React UI**

---

## 🌟 Key Features

### 1. Google Ads Command Center
*   **Visual Approval Queue:** Reviews, approves, or rejects Gemini-generated negative keyword recommendations.
*   **Leak Detection:** Isolates toddler keyboard spam, kids/classroom queries, and unrelated generic terms matching Performance Max.
*   **False Positive Safety Shield:** Explicitly filters and protects highly profitable, commercial-intent keywords (like "gemini letters", "usdot magnets", and "readerboard letters") from being accidentally excluded.

### 2. Organic SEO & CTR Hub
*   **Opportunity Tracker:** Imports Search Console query exports to highlight high-impression but low-CTR "goldmine" landing pages.
*   **Live Meta Tag Generator:** Connects directly to Gemini 2.5 Flash in real-time to write title tags and description copies designed to maximize SERP CTR.
*   **JSON-LD Schema Creator:** Auto-compiles copy-pasteable HTML Product Schemas, enabling star-ratings and direct manufacturer price spans in Google search.

### 3. Data Warehousing & Streaming
*   Direct, serverless, zero-code connections pulling Google Ads, GA4 Streaming, and Search Console data straight into unified `US (multi-region)` datasets in BigQuery.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies in both the frontend and functions workspace:

```bash
# Install frontend packages
npm install

# Install Cloud Functions packages
cd functions && npm install && cd ..
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Firebase Connection Keys
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google AI Studio Gemini API Key
VITE_GEMINI_API_KEY=AIzaSyYourGeminiAPIKeyHere
```

### 3. Run Locally
Start the development server in your local browser:

```bash
npm run dev
```
Navigate to `http://localhost:5173`.

---

## 📁 Repository Structure

*   `package.json` — React Vite build & styling frameworks
*   `tailwind.config.js` — Theme configurations (Custom slate/blue)
*   `firebase.json` — Firebase deployment rules
*   `firestore.rules` — Authenticated database security policies
*   `src/main.jsx` — React entry point
*   `src/App.jsx` — Routing & central layout
*   `src/index.css` — Global styles & Tailwind directives
*   `src/components/Sidebar.jsx` — Dark-themed dashboard navigation bar
*   `src/components/ApprovalCard.jsx` — Custom approve/reject keyword UI
*   `src/pages/Dashboard.jsx` — Multi-channel KPIs & performance index
*   `src/pages/GoogleAds.jsx` — Ads command panel & safety shield
*   `src/pages/SeoHub.jsx` — Search Console optimizer & schema writer
*   `src/pages/EmailHub.jsx` — CLV Recovery templates (Klaviyo)
*   `src/utils/firebase.js` — Frontend SDK configurations
*   `src/utils/gemini.js` — Direct API caller configuration
*   `functions/index.js` — 2:00 AM Scheduled Audits & API callables
*   `functions/package.json` — Cloud Function dependencies (Node 22)
*   `scripts/parse_search_terms.js` — Zero-dependency Ads CSV leak parses
*   `scripts/parse_search_console.js` — Zero-dependency Search Console CSV parsed
*   `scripts/gemini_analyst.js` — Direct script connecting parsed leaks to Gemini 2.5
*   `scripts/test_key.js` — API Key and GCP capability diagnostics
*   `reports/google_ads/` — Ads CSVs and JSON recommendation output
*   `reports/search_console/` — Queries CSV and GSC goldmines output

---

## 💻 Developer Command-Line Utilities

Your workspace contains a series of lightning-fast, zero-dependency Node.js CLI tools:

### 1. Test your API Key and Google Scopes
`node scripts/test_key.js`  
*Outputs all active models you have secure clearance to query (e.g. `gemini-2.5-flash`).*

### 2. Parse Raw Google Ads Search Terms
`node scripts/parse_search_terms.js`  
*Processes thousands of search queries in milliseconds, calculating exact cash spend wasted on toddler keyboard spam and irrelevant classroom bulletin boards.*

### 3. Generate Gemini Recommendations File
`node scripts/gemini_analyst.js`  
*Queries Gemini 2.5 Flash with filtered leak terms to output a structured JSON recommendation package complete with costs, explanations, and false-positive protections.*

### 4. Parse Google Search Console Queries
`node scripts/parse_search_console.js`  
*Parses exported GSC queries, compiling high-volume queries with low click-through rates (CTR) to load as opportunities on your frontend dashboard.*

---

## ☁️ Deploying the Backend
The Firebase Cloud Function utilizes Google Secret Manager and is structured on the modern **Node.js 22** runtime.

1. Set your secret Gemini API key:  
   `firebase functions:secrets:set GEMINI_API_KEY`
2. Deploy the scheduled cron background jobs:  
   `firebase deploy --only functions
