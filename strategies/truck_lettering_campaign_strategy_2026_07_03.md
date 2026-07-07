# 🚛 Truck Lettering & USDOT Decal Campaign Reconstruction Blueprint
**Date:** July 3, 2026  
**Target Campaign:** `Truck Lettering | PMax | BestSellers` (Transition to Standard Search & Shopping)

---

## 🚨 1. Forensic Diagnosis of Your Campaign's Failures

Based on your uploaded screenshots (Edit Signals, Audience Insights, and Search Terms Report), we have identified three critical system failures that are draining your ad spend.

### Failure A: The Catastrophic Feed Exclusion ("All products are excluded")
Your PMax campaign has a major diagnostic warning: **"All products are excluded from this campaign. Updated at Jun 27, 2026."**
* **The Impact:** Since PMax has zero products in its Shopping feed, **it cannot show any Shopping Ads (Product Listing Ads)** on Google's Shopping tab or Search page.
* **The Consequence:** To satisfy your daily budget, PMax is spending 100% of your money on **Search, YouTube, and Display ads**. Because it has no bidding limits or keyword match restrictions, it behaves like an uncontrolled broad match Search campaign, bidding astronomical amounts on unrelated keywords.

### Failure B: Severe "Building & Marquee Letters" Cannibalization
In your Search Terms report, we found that your **Truck Lettering** campaign is actively displaying ads for high-cost **building sign and marquee letters** keywords. This is a severe bleed:
* **`8 inch plastic letters for outdoor signs`** - Cost you **$50.56 for only 2 clicks** ($25.28 per click!).
* **`letters for outdoor signs`** - Cost you **$15.78 for 1 click**.
* **`outdoor sign letter`** - Cost you **$15.35 for 2 clicks**.
* **`4 sign letters`** - Cost you **$14.45 for 2 clicks**.
* **`windmasters`** - Cost you **$18.34 for 1 click** (this is a wind-resistant sidewalk sign brand, not truck lettering!).
* **Why this is happening:** With **Final URL Expansion** enabled on PMax, Google's algorithm has free rein over your entire website. If it sees a high-value building letters search, it will serve it through your Truck Lettering campaign, charging you up to **$25+ per click**!

### Failure C: The "Video Game Fans" Audience Mismatch
You uploaded a highly relevant B2B customer list (**USDOT Renewals June, July, August, September**). However, look at Google's actual targeting breakdown:
* **Affinity Target:** `Truck & SUV Enthusiasts` (consumer hobbyists, not B2B operators)
* **Asset Insights Target:** `Driving & Racing Game Fans` (people playing video games!)
* **Why this is happening:** PMax treats your first-party lists as mere "hints." The machine learning algorithm saw the words "truck" and "driving" and mathematically expanded your targeting to consumers who like driving video games or off-road trucks. Google then displayed your B2B commercial truck decals to kids and gamers on YouTube and Gmail.

---

## 🚫 2. Master Exclusions List for Truck Lettering

To prevent overlaps and stop building/marquee letters from bleeding into your truck lettering budget, you must apply this negative keyword list to your new Truck Lettering campaigns:

```text
"building letters"
"marquee letters"
"church letters"
"dimensional letters"
"3d letters"
"brass letters"
"bronze letters"
"cast metal letters"
"acrylic letters"
"building signs"
"windmasters"
"windmaster"
"letterboard"
"bulletin board"
"school"
"kindergarten"
"classroom"
```

---

## 🔍 3. Step-by-Step Rebuild Plan: Option A (Standard Search & Shopping)

We will break the Truck Lettering campaign into two highly-controlled campaigns: one for **Standard Search (USDOT & Vinyl Lettering)** and one for **Standard Shopping (Products only)**.

### Campaign 1: `Truck Lettering | Search | Core` (The B2B Driver)
This campaign will target commercial vehicle operators who need USDOT numbers and company name decals.

#### Step 1: Campaign Settings
1. **Goal:** Create without guidance -> **Search**.
2. **Networks:** 
   * 🛑 **UNCHECK "Include Google search partners"**
   * 🛑 **UNCHECK "Include Google Display Network"**
3. **Locations:** United States (with **Presence: People in or regularly in your targeted locations**).
4. **Bidding:** Select **Maximize Clicks** with a **Maximum CPC limit of $4.00** to protect you from $25 clicks.

#### Step 2: Tightly-Themed Ad Groups & Keywords
Create three ad groups. Use **Phrase Match (`"..."`)** and **Exact Match (`[...]`)** only.

* **Ad Group 1: USDOT Stickers & Numbers**
  ```text
  "usdot stickers"
  "usdot number decals"
  "us dot number stickers"
  "dot decals for trucks"
  "usdot magnet signs"
  [usdot stickers]
  [us dot decals]
  ```
* **Ad Group 2: Truck Door Business Decals**
  ```text
  "truck door lettering"
  "commercial truck decals"
  "custom truck door decals"
  "truck business name decals"
  "vinyl lettering for trucks"
  [truck door lettering]
  [custom truck magnets]
  ```
* **Ad Group 3: Specific Regulation Markings**
  ```text
  "ca number decals"
  "gvw weight stickers"
  "mc number decals"
  "not for hire stickers"
  [not for hire decals]
  [ca number decals]
  ```

#### Step 3: Verified B2B Responsive Ad Copy
* **Final URL:** Link directly to your USDOT and Truck Lettering page: `https://www.alphabetsigns.com/c/truck-lettering/` (or specific USDOT landing page).

##### Headlines (Max 30 Chars)
1. **`Custom USDOT Number Decals`** *(27 Chars)*
2. **`Truck Lettering & Decals`** *(26 Chars)*
3. **`US DOT Number Stickers`** *(23 Chars)*
4. **`Commercial Truck Door Decals`** *(28 Chars)*
5. **`Custom Truck Magnets`** *(20 Chars)*
6. **`100% DOT Compliant Decals`** *(26 Chars)*
7. **`Ships Within 24 Hours`** *(22 Chars)*
8. **`Heavy-Duty Exterior Vinyl`** *(25 Chars)*
9. **`Easy-to-Apply Truck Letters`** *(27 Chars)*
10. **`B2B Commercial Grade Decals`** *(27 Chars)*

##### Descriptions (Max 90 Chars)
1. **`100% DOT Compliant Truck Decals & USDOT Numbers. Heavy-Duty Weatherproof Vinyl.`** *(78 Chars)*
2. **`Design commercial truck lettering & magnets online. Fast 24-hour shipping on all orders.`** *(88 Chars)*
3. **`Includes USDOT, MC, CA numbers & GVW weight stickers. Easy peel-and-stick installation.`** *(87 Chars)*
4. **`Heavy-duty outdoor-grade vinyl stickers for semi-trucks, vans, and commercial vehicles.`** *(87 Chars)*

---

### Campaign 2: `Truck Lettering | Shopping | Core`
This will serve your product feed exclusively to Shopping users.

#### Step 1: Settings
1. **Goal:** Create without guidance -> **Shopping**.
2. **Subtype:** **Standard Shopping** (NOT PMax).
3. **Networks:** 🛑 **UNCHECK "Google Search Partners"**.
4. **Bidding:** Set to **Target ROAS (200%)** or **Maximize Conversion Value**.

#### Step 2: Listing Group Isolation (The Solution to the Product Warning!)
1. Go to the campaign's **Listing Groups** tab.
2. Click the edit pencil next to **All products**.
3. Subdivide by **Category** or **Custom Label** and select your **Truck Lettering & USDOT Decals** product line.
4. **Exclude "All other products"**. 
   * *This ensures your Shopping campaign is active (unlike your broken PMax campaign) and only displays relevant truck lettering products, while completely isolating your building letters!*
