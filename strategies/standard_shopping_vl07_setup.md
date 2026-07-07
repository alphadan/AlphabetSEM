# 🛒 Rebuilding Standard Shopping for Truck Lettering (Category VL07)
**Date:** July 3, 2026  
**Target Campaign:** `Truck Lettering | Shopping | VL07`

This guide explains how to leverage your product feed's custom attributes—specifically **`custom_label_0 = VL07`**—to build a standard shopping campaign that is completely isolated from other products in your catalog (such as your `BL00` building letters).

---

## 📊 Feed Analysis: Identifying Your VL07 Products
Our analysis of your Merchant Center product feed database (`products.json`) confirmed that all of your commercial truck lettering and regulatory markings are pre-configured with the following Google Merchant Center custom labels:
* **`custom_label_0`:** `VL07` (This designates the truck-lettering category!)
* **`custom_label_1`:** `70` (Indicates a **70% Profit Margin**—meaning every $1.00 in sales costs $0.30 to manufacture, leaving $0.70 in gross profit!)
* **`custom_label_2`:** `BestSeller` or `Standard` (Differentiates performance tiers)

### Products Automatically Included Under `VL07`:
* `VL0701`: **Custom USDOT Number Stickers** ($2.75)
* `VL0702`: **Custom Truck Door Lettering - 9"H x 24"W Set** ($52.50)
* `VL0703`: **Custom Truck Door Business Name & Numbers Decal Set** ($52.50)
* `VL0704`: **GVW Gross Vehicle Weight Stickers - 2"** ($3.75)

---

## 💰 1. The Profitability Math of custom_label_1 (70% Margin)

Understanding that **`custom_label_1 = 70`** represents your **70% gross profit margin** is a major competitive advantage. This lets us calculate your exact, risk-proof advertising boundaries.

### The Profitability Matrix:
* **Gross Profit Margin:** 70% (Cost of Goods Sold = 30%)
* **Break-Even ROAS Threshold:** **143% (or 1.43x)**
  * *The Formula:* `1 / Gross Margin = 1 / 0.70 = 1.428`
  * *What this means:* If your campaign returns exactly $1.43 for every $1.00 spent on ads, you have completely broken even after manufacturing costs.
* **Your Old PMax ROAS (116.44%):** Under the old campaign, you were returning only $1.16 for every $1.00 in ad spend. Because this is below the 143% break-even mark, **you were actively losing money on every sale.**
* **Target ROAS (200%):** At a 200% ROAS ($2.00 in sales per $1.00 of ad spend):
  * Gross Profit on $2.00 of sales = `$2.00 * 0.70 = $1.40`
  * Advertising Cost = `$1.00`
  * **Net Profit Margin:** **$0.40 net profit** for every $1.00 spent on ads!
* **Target ROAS (250%):** At a 250% ROAS ($2.50 in sales per $1.00 of ad spend):
  * Gross Profit on $2.50 of sales = `$2.50 * 0.70 = $1.75`
  * Advertising Cost = `$1.00`
  * **Net Profit Margin:** **$0.75 net profit** for every $1.00 spent on ads!

---

## 🛠️ Step-by-Step Setup Guide

### Phase 1: Campaign Configuration
1. Click the blue **"+"** button in Google Ads to create a new campaign.
2. Select **Create a campaign without a goal's guidance**.
3. Select **Shopping** as your campaign type.
4. Select your **Google Merchant Center** account from the dropdown.
5. Under **Campaign Subtype**, select **Standard Shopping campaign** (do **NOT** select Performance Max).
6. **Name the campaign:** `Truck Lettering | Shopping | VL07 | Core`

### Phase 2: Bidding, Budget, & Networks
1. **Bidding:** Select **Target ROAS** (tROAS).
   * *Initial Target:* Set to **200%** (gives Google room to learn while protecting your bottom line).
2. **Daily Budget:** Set this to **$40.00/day** or **$50.00/day** (shifting budget away from your old, bleeding PMax campaign).
3. **Networks:**
   * 🛑 **UNCHECK "Include Google search partners"** (Ensures your products only appear on Google's core Shopping and Search grids).
4. **Locations:** Select *United States*. Click **Location options** and select **Presence: People in or regularly in your targeted locations**.

### Phase 3: The "Magic Step" - Segmenting the Listing Groups by Custom Label
By default, a Standard Shopping campaign targets your entire product catalog. To restrict it to *only* your `VL07` truck lettering products:

1. Once the campaign is created, go into the campaign and click on the **Products** tab on the left-hand menu, then select **Listing Groups**.
2. Click the **edit pencil icon** next to **"All products"**.
3. Under **Subdivide All products by:**, click the dropdown and select **Custom label 0** (Google pulls this directly from your feed).
4. You will see a list of values found in your feed. Check the box next to **`VL07`**.
5. Click **Save**.
6. Back on the Listing Groups screen, you will now see two rows under "All products":
   * **`Custom label 0: VL07`** (Status: **Submitted / Active**)
   * **`Everything else in 'All products'`** (Status: Active).
7. **🛑 Action Item:** Hover over the green status dot next to **"Everything else in 'All products'"** and change its status to **EXCLUDED**.

---

## 🏆 Why This Listing Group Purity is a Game-Changer
By excluding everything except `VL07` via Custom Label 0:
1. **Zero Overlap:** Your `BL00` building letters, yard signs, and custom banners can **never** enter this campaign's auctions.
2. **Perfect Bid Optimization:** You can adjust bidding (e.g., raise/lower the Target ROAS) specifically for truck decal metrics without impacting high-AOV building letters.
3. **No Bleeding:** Because Google Shopping is feed-driven, and you have strictly limited this campaign to the `VL07` feed items, Google cannot show ads for search terms unrelated to truck lettering, USDOT decals, and vehicle markings.
