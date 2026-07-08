# 🧠 AlphabetSEM — Agentic Thread Summary

*If this session runs out of space or you start a new developer thread, upload this file as direct context. It contains the complete architectural blueprints, hurdles cleared, and codebase structure of AlphabetSEM.*

---

## 🎯 Project Overview
*   **Context:** Built an internal MarTech platform for **Alphabet Signs** (e-commerce storefront selling custom dimensional sign letters, marquee letters, church letters, and graphics).
*   **Core Goal:** Isolate PMax ad budget leakages, maximize organic search CTRs, synchronize Merchant Center inventory, and build real-time visual website heatmaps.

---

## 💻 Codebase Blueprint (Files on Disk)

```text
AlphabetSEM/
├── package.json                   # Vite + React (v18.3.1) + Tailwind (v3.4) + Lucide Icons
├── tailwind.config.js             # Customized with Alphabet Signs' premium blue/slate colors
├── .env                           # Contains your Firebase keys and Google AI Studio key
├── src/
│   ├── App.jsx                    # Routing paths (/dashboard, /google-ads, /seo-hub, /email-hub, /products, /heatmap, /help)
│   ├── components/
│   │   ├── Sidebar.jsx            # Dark navigation bar with separator rules
│   │   └── ApprovalCard.jsx       # Interactive accept/reject UI card element
│   ├── pages/
│   │   ├── Dashboard.jsx          # Live KPI metrics joined with dynamic GMC and Gemini counts
│   │   ├── GoogleAds.jsx          # Displays real optimizations and False Positive Shields
│   │   ├── SeoHub.jsx             # Low CTR tracker, title tag copywriter, JSON Product Schema generator
│   │   ├── EmailHub.jsx           # Klaviyo abandoned checkout flow draft optimizer
│   │   ├── ProductHub.jsx         # Compact paginated catalog with Custom Label 0 filter
│   │   ├── HeatmapHub.jsx         # Visual overlay mapping click coordinates with Gemini audits
│   │   └── Help.jsx               # Categorized, copy-pasteable knowledge base
│   └── utils/
│       ├── firebase.js            # Frontend Firestore configuration
│       └── gemini.js              # Native SDK wrapper (Optional fallback)
├── functions/                     # Scheduled Node 22 Firebase Cloud Backend
│   ├── package.json               # Cloud Function dependencies
│   └── index.js                   # 2:00 AM Google Ads Audit & 4:00 AM Product Feed Sync to Firestore
├── scripts/                       # Local CLI Developer Utilities
│   ├── parse_search_terms.js      # Raw Google Ads CSV report parser
│   ├── parse_search_console.js    # Raw Search Console GSC queries parser
│   ├── parse_merchant_feed.js     # Live XML Google Merchant feed parser (creates products.json)
│   ├── gemini_analyst.js          # Direct script sending Ads CSV leaks to Gemini 2.5 Flash
│   └── test_key.js                # Direct fetch diagnostic script for API keys
└── reports/                       # Data Warehouse Local Fallbacks
    ├── google_ads/                # raw Ads CSVs and parsed recommendations.json
    ├── search_console/            # GSC query reports and parsed opportunities.json
    └── merchant_center/           # Parsed products.json catalog feed

    
🛠️ Major Hurdles Cleared (Technical Solutions)

### 1. Google Workspace 2FA Loop (The Catch-22)
*   **The Issue:** Enforcing domain-wide 2FA locked out Admin users because they couldn't turn it on individually, blocking Google Ads accepted invitations.
*   **The Solution:** Domain-wide enforcement was turned "OFF", allowing users to activate 2FA individually on their Google Security account pages. Once everyone was compliant, domain-wide "ON" enforcement was securely reactivated domain-wide.

### 2. Vite Direct Fetch Bypass (The `AQ` Corporate Key Issue)
*   **The Issue:** Modern enterprise Gemini API keys starting with `AQ` are misidentified as OAuth access tokens by Google's NPM SDK wrapper, triggering an `ACCESS_TOKEN_TYPE_UNSUPPORTED` error in the browser.
*   **The Solution:** Bypassed the SDK completely on client-side pages and used raw native browser `fetch` calls pointing directly to `https://generativelanguage.googleapis.com/v1beta/models/...`. This supports modern `AQ` corporate keys flawlessly.

### 3. Responsive Clicking Heatmap Coordinates
*   **The Issue:** Storing mouse clicks in absolute pixels breaks alignments when mapped across different viewport resolutions.
*   **The Solution:** Mapped click positions using responsive screen-width percentages (`(e.pageX / window.innerWidth) * 100`) in the tracking script, ensuring visual hotspots render correctly on both desktop overlays and mobile devices.