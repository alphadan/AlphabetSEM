# 🛠️ Standard Search & Shopping Campaign Strategy for Building Letters
**Date:** July 3, 2026  
**Target Campaign:** `BL00 Building Letters` (Transition from PMax to Standard)

This guide outlines a step-by-step setup to transition from your leaking PMax campaign to a high-intent, leak-proof **Standard Search** and **Standard Shopping** structure.

---

## 🚫 1. Master Negative Keyword Lists (Copy & Paste)

Apply these to your **Account-Level Negative Keyword List** or create a specific **"Building Letters Exclusion List"** and apply it to both the new Search and Shopping campaigns.

### Topic 1: Boat & Marine Exclusions (Phrase & Broad)
*Blocks all lower-value marine registration lettering traffic.*
```text
boat
registration
vessel
marine
yacht
kayak
jetski
"jet ski"
outboard
"registration numbers"
"boat registration"
"boat numbers"
"boat decals"
"boat stickers"
"boat lettering"
"marine numbers"
"hull numbers"
"state registration"
"boat fonts"
"registration decals"
```

### Topic 2: Educational, School, & Alphabet Learners (Phrase & Broad)
*Blocks toddlers, parents, and teachers searching for classroom learning letters.*
```text
abc
alphabet
abcdefg
classroom
kindergarten
"bulletin board"
preschool
"abc song"
"alphabet song"
"jack hartmann"
"classroom wall"
kids
toy
toys
"alphabet letters"
"learning letters"
"toddler abc"
"school abc"
"felt board"
"alphabet ruler"
"educational letters"
```

### Topic 3: Household, DIY, & Low-Value Novelties (Phrase & Exact Match)
*Blocks consumer/hobbyist queries for cheap products that do not match high-end custom building letters.*
```text
"felt letter board"
"letterboard"
"magnetic letterboard"
"letter storage box"
"mailbox letters"
"address numbers"
"house numbers"
"diy letters"
"parade float"
"door numbers"
"wooden letters"
"bench plaque"
"memorial bench"
"hobby lobby letters"
"michaels letters"
"walmart letters"
"home depot letters"
"cheap letters"
"craft letters"
```

### Topic 4: Competitor Brands (Phrase Match)
*Saves budget by blocking searches for competitors where conversion rates are historically low.*
```text
"signoutfitters"
"national readerboard supply"
"ez signs online"
"alpha wolf decals llc"
"bannerbuzz"
"sign letter depot"
```

### Topic 5: Foreign Language (Broad)
*Blocks Spanish traffic that isn't landing on Spanish-supported pages.*
```text
letras
para
avisos
publicitarios
grande
"en grande"
```

---

## 🔍 2. Step-by-Step Standard Search Campaign Setup

### Campaign Name: `BL00 Building Letters | Search | Core`

### Step 1: Campaign Settings
1. **Goal:** Select **Create a campaign without a goal's guidance** (gives you the most control).
2. **Campaign Type:** Select **Search**.
3. **Networks:** 
   * **Search Network:** 🛑 **UNCHECK "Include Google search partners"**
   * **Display Network:** 🛑 **UNCHECK "Include Google Display Network"**
4. **Locations:** Select **United States** (or your specific shipping territories). Under Location options, select **Presence: People in or regularly in your targeted locations** (this prevents clicks from people outside the US using VPNs or searching about the US).
5. **Languages:** Select **English**.

### Step 2: Bidding Strategy
* **Initial Phase (First 30 days):** Select **Maximize Clicks** and **set a Maximum CPC limit of $3.50**. 
  * *Why:* This allows you to collect high-quality traffic data without Google bidding $20.00+ on any single search query.
* **Optimization Phase (After 30 conversions):** Switch to **Maximize Conversions** or **Maximize Conversion Value** (with a Target ROAS of 250%).

### Step 3: Ad Group & Keyword Structure
We will use **tightly themed Ad Groups** with **Phrase Match (`"..."`)** and **Exact Match (`[...]`)** keywords to prevent broad matching.

#### Ad Group 1: Metal Letters
```text
"metal letters for signs"
"metal letters for outdoor signs"
"aluminum sign letters"
"brass sign letters"
"cast aluminum letters"
"brushed metal letters"
[metal letters for signs]
[metal sign letters]
```

#### Ad Group 2: Plastic & Acrylic Letters
```text
"plastic letters for signs"
"acrylic letters for signs"
"molded plastic letters"
"acrylic sign letters"
"cut acrylic letters"
[acrylic letters for signs]
[plastic letters for outdoor signs]
```

#### Ad Group 3: Outdoor Building Letters
```text
"letters for buildings outdoor"
"outdoor letters for buildings"
"exterior building sign letters"
"exterior letters for buildings"
"commercial building letters"
[letters for buildings outdoor]
[outdoor building letters]
```

#### Ad Group 4: Dimensional & Raised Letters
```text
"dimensional sign letters"
"raised letters for signs"
"raised lettering signage"
"3d letters for signs"
"3d sign lettering"
[dimensional letters]
[3d letters for signs]
```

### Step 4: Ad Copy & Landing Pages
* **Landing Page:** Direct all traffic to your dedicated Building Letters landing page: `https://www.alphabetsigns.com/c/BL00/` (do **not** direct to the homepage).
* **Ad Headlines:** Include keywords directly in headlines:
  * *Headline 1:* Custom Building Letters
  * *Headline 2:* Metal & Plastic Sign Letters
  * *Headline 3:* Durable Outdoor Sign Letters
  * *Headline 4:* Official Gemini Letter Dealer
* **Descriptions:** Focus on B2B benefits:
  * "Lifetime Guarantee on All Outdoor Sign Letters. Free Shipping over $100. Shop Cast Metal, Acrylic & Molded Plastic."
  * "Custom manufactured exterior letters for business signage. Easy installation brackets included. Order online today."

---

## 🛒 3. Step-by-Step Standard Shopping Campaign Setup

### Campaign Name: `BL00 Building Letters | Shopping | Core`

### Step 1: Campaign Settings
1. **Goal:** Select **Create a campaign without a goal's guidance**.
2. **Campaign Type:** Select **Shopping**.
3. **Merchant Center Account:** Select your linked Google Merchant Center account.
4. **Campaign Subtype:** Select **Standard Shopping** (do **NOT** select Performance Max).

### Step 2: Bidding & Budget
1. **Bidding:** Select **Target ROAS** (tROAS) or **Maximize Conversion Value**.
   * Set your initial Target ROAS to **250%** (aligns with your goal and limits hyper-aggressive bidding on low-performing inventory).
2. **Daily Budget:** Set this to your desired amount (e.g., $50/day to start, shifting budget from your old PMax campaign).
3. **Campaign Priority:** Select **Medium** (or Low, as long as it is consistent).

### Step 3: Targeting & Networks
1. **Networks:** 
   * 🛑 **UNCHECK "Google Search Partners"**
2. **Devices:** Keep all devices active.
3. **Locations:** Set to **United States** with **Presence: People in or regularly in your targeted locations**.

### Step 4: Listing Group Configuration (Crucial!)
By default, standard shopping targets **"All products."** You must subdivide this:
1. Go to the campaign's **Products** tab, click **Listing Groups**, and click the edit pencil next to "All products."
2. Subdivide by **Category**, **Product Type**, or **Custom Label**.
3. Select your **Building Letters** category (or filter by Product IDs that belong to the `/c/BL00/` line).
4. **Exclude "All other products"** by clicking the status icon and selecting **Excluded**. 
   * *This ensures that ONLY your high-value building letters can ever show in this campaign, and absolutely blocks boat letters or yard signs from creeping in.*

---

## 🌐 4. Should You Include Google Search Partners?

### **The Answer: NO.**
You should **uncheck/disable Google Search Partners** on both your new Search and Shopping campaigns.

### Why Search Partners is a Major Drain:
1. **Extremely Low Intent:** Search Partners includes third-party sites (like ask.com, park domains, and smaller directories) where ads are matched with very low relevance. A user might be looking at a blog post about "preschool alphabet crafts" and Google will display your high-end building letters ad.
2. **Match Type Dilution:** Google's strict keyword match types (like Phrase or Exact) are heavily diluted on Search Partner sites. Exact match behaves more like loose broad match.
3. **No Transparency:** Google does not provide a report showing exactly which partner domains your budget was spent on, making click fraud and waste extremely hard to track.
4. **Poor Conversion Rates:** Historically, for industrial and high-AOV B2B products like dimensional building signage, Search Partners converts at a fraction of the rate of Google Core Search, yet costs the same CPC.

**By restricting your campaigns strictly to Google's core Search Network, you guarantee that every dollar is spent on a user actively entering transactional keywords directly into the main Google Search bar.**
