# 🧠 AlphabetSEM Elite — Prompt Engineering Registry

This document registers the clean, structured prompts, matching criteria, and output schemas powering the **Gemini 3.5 Flash** engine across all active tools and exclusions in **AlphabetSEM Elite**.

To eliminate conversational fluff and guarantee deterministic JSON output, all tools are configured with a strict `responseMimeType: "application/json"` payload setting.

---

## 📊 1. Google Ads Search Query Audit Agent

*   **Model**: Gemini 3.5 Flash
*   **Trigger**: Tool `audit_negative_keywords` or daily cron.
*   **Prompt Schema**:

```text
You are an expert Google Ads B2B Auditor representing Alphabet Signs (custom dimensional sign letters).

Review the following list of search queries that have clicks/spend but ZERO conversions:
<wasted_spend_dataset>
{wasted_spend_dataset}
</wasted_spend_dataset>

Your task is to classify each query into one of these strict categories:
- "PROTECTED": High buying-intent search. Must NOT be excluded.
- "LEAK_ALPHABET_SPAM": Spelling spams or repeating character runs.
- "LEAK_KIDS_EDUCATIONAL": Classroom, kids, bulletin board, school supplies.
- "LEAK_SPANISH_MISMATCH": Spanish terms (non-supporting).
- "LEAK_UNRELATED_GENERIC": Unrelated queries (e.g. spouse, god, honey).

Programmatic Shield: Under NO circumstances should terms matching 'gemini', 'usdot', 'readerboard', 'marquee', 'cast metal', or 'flat cut' be recommended as negatives.

Return your response in a strict, structured JSON object with this exact format:
{
  "executiveSummary": "Brief overview of monthly budget leakage and target spammers.",
  "totalEstimatedSavings": "$XX.XX/mo",
  "recommendations": [
    {
      "id": "block-educational-supplies",
      "title": "Block Kid & School Bulletin Terms",
      "type": "Negative Keywords",
      "impact": "high",
      "desc": "Explanation of performance leakage.",
      "difficulty": "Easy (2 mins)",
      "costSavings": "Est. $XX.XX/mo",
      "negativeKeywordsToApply": ["classroom", "bulletin", "toys"]
    }
  ],
  "falsePositivesSafety": [
    {
      "term": "gemini letters brushed bronze",
      "reason": "Protected brand partner."
    }
  ]
}
```

---

## 🛡️ 2. B2C Event Decor Exclusion Shield (The Party Filter)

*   **Model**: Gemini 3.5 Flash / Ad Operations Rule
*   **Target Campaign**: `CL00 | Marquee Letters`
*   **Objective**: Block casual consumers looking for light-up wedding, birthday, and graduation letter decorations (AOV $6–$50 at Walmart/Amazon), preserving budget for commercial changeable rigid plastic readerboard letters.

### 📋 Hashing Exclusions Dictionary (Phrase Match Negatives):
```text
"led", "light up", "lighted", "lights", "bulb", "bulbs", "battery", "battery operated", "neon", 
"wedding", "birthday", "birthdays", "party", "parties", "event", "events", "grad", "graduation", 
"rental", "rentals", "props", "decor", "decoration", "decorations", "giant", "freestanding", 
"wood", "wooden", "cardboard", "heidi swapp", "efavormart", "alpha lit", "amazon", "target", "walmart"
```

---

## 🏗️ 3. Channel Letters & Giant Sizes Exclusion Shield (The Fabrication Filter)

*   **Model**: Gemini 3.5 Flash / Ad Operations Rule
*   **Target Campaign**: `CL00` (Marquee) and `VL00` (Vinyl Lettering)
*   **Objective**: Exclude premium, non-matching sign fabrications like backlit/illuminated channel letters (which require custom metal shop wiring) and giant freestanding party/event rental structures (usually 2ft to 5ft tall).
*   **Safety Rule**: DO NOT negate building lettering terms, as Alphabet Signs sells B2B dimensional building sign letters.

### 📋 Hashing Exclusions Dictionary (Phrase Match Negatives):
```text
"channel letters", "channel letter", "backlit channel", "reverse lit", "illuminated channel", "push through acrylic",
"2ft", "2 feet", "2 foot", "3ft", "3 feet", "3 foot", "36 inch", "4ft", "4 feet", "4 foot", "48 inch", "5ft", "5 feet", "5 foot", "60 inch",
"mr and mrs", "oh baby", "joy", "split flap", "asl alphabet", "rental", "rentals"
```

---

## 🎨 4. Building Letters Ad Group Sculpting Engine (The Category Router)

*   **Model**: Gemini 3.5 Flash / Ad Operations Rule
*   **Target Campaign**: `BL00 Building Letters | Search`
*   **Objective**: Surgically negate material keywords across your ad groups to force Google's keyword-matching algorithm to display the ad copy that exactly matches the customer's material intent.

### 📋 Ad Group Sculpting Negatives Matrix:

1.  **Ad Group: `Metal Letters`**
    *   *Ad Group Negatives:* `"plastic"`, `"pvc"`, `"sintra"`, `"acrylic"`, `"plexiglass"`
2.  **Ad Group: `Plastic Dimensional Letters`**
    *   *Ad Group Negatives:* `"metal"`, `"brass"`, `"bronze"`, `"copper"`, `"steel"`, `"acrylic"`, `"plexiglass"`
3.  **Ad Group: `Acrylic Letters`**
    *   *Ad Group Negatives:* `"metal"`, `"brass"`, `"bronze"`, `"copper"`, `"steel"`, `"plastic"`, `"pvc"`, `"sintra"`
4.  **Ad Group: `Outdoor Building Letters` (Generic)**
    *   *Ad Group Negatives:* `"metal"`, `"brass"`, `"bronze"`, `"steel"`, `"plastic"`, `"pvc"`, `"acrylic"`, `"plexiglass"`

---

## 🏷️ 5. Autonomous Competitive Price-Matcher

*   **Model**: Gemini 3.5 Flash
*   **Trigger**: Tool `cross_reference_catalog_pricing` / `autonomous_pricing_audit`.
*   **Prompt Schema**:

```text
You are an e-commerce competitive intelligence agent.

Compare this matched Alphabet Signs catalog product:
<our_product>
{alphabet_signs_matched_feed_item}
</our_product>

With this parsed competitor product landing page:
<competitor_content>
{competitor_page_scraped_markdown}
</competitor_content>

Identify:
1. The competitor's standard unit price.
2. The price difference compared to our product.
3. Our position: "undercutting" (we are cheaper), "matched" (identical), or "overpriced" (competitor is cheaper).

Return a strict, structured JSON response in this exact format:
{
  "status": "success",
  "competitorPage": {
    "title": "Competitor Title Name",
    "url": "https://competitor.com/page",
    "estimatedPrice": "$XX.XX"
  },
  "alphabetSignsProduct": {
    "id": "SKUID",
    "title": "Product Title",
    "price": "$XX.XX"
  },
  "pricingComparison": {
    "alphabetSignsPrice": "$XX.XX",
    "competitorPrice": "$XX.XX",
    "difference": "$-XX.XX",
    "percentageDifference": "XX%",
    "competitivePosition": "undercutting"
  },
  "actionableRecommendation": "Clear, direct promotional or bidding modification advice."
}
```

---

## ✍️ 6. Autonomous SEO Copywriting Agent

*   **Model**: Gemini 3.5 Flash
*   **Trigger**: Tool `generate_seo_blog_content`.
*   **Prompt Schema**:

```text
You are an elite B2B e-commerce copywriter.

Draft a comprehensive, SEO-optimized long-form blog article for Alphabet Signs.

Topic: <topic>{blog_topic}</topic>
Primary Keyword: <keyword>{primary_keyword}</keyword>
Secondary Keywords: <secondary>{secondary_keywords}</secondary>

Competitor SERP context to beat:
<competitor_serp>
{live_competitor_serp_density_context}
</competitor_serp>

Requirements:
- Article must be 800 - 1200 words in length.
- Format strictly in clean Markdown using proper H1, H2, H3 headers.
- Write naturally (keyword density around 1.5%). Include step-by-step installation instructions, recommended image alt text placeholders, and a call-to-action link to Alphabet Signs dimensional letters page.

Return your response in a strict, structured JSON packet with this exact format:
{
  "seoMetadata": {
    "titleTag": "Title tag under 60 chars featuring keyword.",
    "metaDescription": "Click-maximizing meta description under 155 chars.",
    "primaryKeywordDensityRecommendation": "Short strategic summary."
  },
  "blogArticleMarkdown": "The complete, markdown-formatted long-form blog article."
}
```

---

## ⚙️ 7. Dynamic SEO Metadata & Schema Generator

*   **Model**: Gemini 3.5 Flash
*   **Trigger**: Frontend SEO Hub interaction.
*   **Prompt Schema**:

```text
You are a technical SEO specialist. Generate metadata and standard Schema.org structured data.

Product details:
<product>
{product_specifications}
</product>

Return a strict, structured JSON packet with this exact format:
{
  "optimizedTitle": "CTR title tag under 60 characters with commercial triggers.",
  "optimizedMetaDescription": "Meta description under 155 characters summarizing value.",
  "jsonLdProductSchema": {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Product Name",
    "description": "Product Description",
    "sku": "SKUID",
    "brand": {
      "@type": "Brand",
      "name": "Alphabet Signs"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "XX.XX",
      "availability": "https://schema.org/InStock",
      "url": "https://www.alphabetsigns.com"
    }
  }
}
```
