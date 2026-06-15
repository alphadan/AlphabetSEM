🚀 AlphabetSEM Elite — Autonomous Marketing Intelligence Command Center

AlphabetSEM is a proprietary, enterprise-grade MarTech orchestrator custom-built for **Alphabet Signs**.

It integrates a serverless **Vite + React (v18.3.1)** and **Tailwind (v3.4)** cockpit directly with a secure, local **Node.js Express MCP Server** and your live **Google Cloud Platform Data Warehouse** (BigQuery and Cloud Firestore) to automate traffic audits, competitor price-scraping, and content copywriting on autopilot.

---

## 🏗️ System Architecture

*   **Google Ads API** ➡️ Daily Sync ➡️ **BigQuery Warehouse**
*   **Google Analytics 4** ➡️ Streaming Logs ➡️ **BigQuery Warehouse**
*   **BigQuery & GMC Feed** ➡️ **Express MCP API** ➡️ **Gemini 2.5 Flash** ➡️ **React UI Cockpit**

---

## 🌟 Key Features & Tool Implementations

### 📊 1. Live Google Ads Traffic Audit & Exclusions (Week 5)
*   Queries live search query performance metrics directly from `p_ads_SearchQueryStats_3166231030` in BigQuery.
*   Isolates spelling spam, childrens' songs, classroom decorations, or unrelated intent matching broad Performance Max budgets.
*   **False Positive Safety Shield**: Protects highly profitable, commercial keywords (like "gemini letters", "usdot magnets", and "readerboard letters") from being accidentally negated.

### 🏷️ 2. Autonomous Competitive Price-Matcher (Weeks 6 & 7)
*   **SerpAPI Integration**: Automatically searches Google Page 1 to locate high-ranking competitor sign stores.
*   **Firecrawl Integration**: Crawls competitor pages, bypasses anti-bot firewalls, and extracts competitor price tags.
*   **GMC Cross-Reference**: Matches competitor pricing to your live Google Merchant Center XML feed catalog (`products.json`) to calculate competitive positions and generate promo recommendations.

### ✍️ 3. Autonomous SEO Copywriting Agent (Week 8)
*   Queries Page 1 SERP snippets to analyze keyword density and layout structures.
*   Prompts Gemini 2.5 Flash (using direct REST fetch to support enterprise `AQ` API keys) to write high-ranking, 1200+ word blog articles in Markdown, ready to publish.

---

## 🚀 Getting Started & Local Launch

### 1. Install Workspace Packages
Install dependencies in both the frontend dashboard and the MCP server directory:

```bash
# Install frontend dashboard packages
npm install

# Install local MCP Server packages
cd mcp-server && npm install && cd ..
```

### 2. Configure Environment Secrets
Create a `.env` file inside your `mcp-server/` directory:

```env
# Google Cloud Service Account Key (for BigQuery & Firestore)
GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json

# SerpAPI Key (GMC competitor searches)
SERP_API_KEY=your_copied_serp_api_key

# Firecrawl API Key (competitor page crawling)
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Google AI Studio Gemini API Key (REST direct fetch)
VITE_GEMINI_API_KEY=your_copied_gemini_api_key
```

### 3. Start the Ecosystem
Run the backend server and the frontend dashboard in separate terminal windows:

```bash
# Terminal 1: Run the MCP Server Express Bridge
cd mcp-server && npm start

# Terminal 2: Run the React Vite Dashboard
npm run dev
```
Navigate to **`http://localhost:5173/mcp-bridge`** to access your unified command cockpit!

---

## 📁 Repository Structure

*   `package.json` — React Vite build & styling frameworks
*   `mcp-server/package.json` — Express, GCP BigQuery, Firestore, and MCP SDK configurations
*   `mcp-server/index.js` — Core MCP Server logic hosting SSE and direct HTTP tool APIs
*   `src/App.jsx` — Central routes mapping
*   `src/pages/McpHub.jsx` — Interactive control playground, diagnostic log console, and audit panels
*   `src/pages/ProductHub.jsx` — GMC-style product feed details modal
*   `reports/merchant_center/products.json` — Live parsed Google Merchant XML catalog feed
