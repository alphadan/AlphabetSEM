# 📅 Post-Migration Campaign Optimization & Monitoring Calendar
**Date:** July 3, 2026  
**Context:** Campaigns revised to Standard Search & Shopping. Bidding strategies are currently in the **"Learning"** phase. Weekend dayparting is active (no ads on Saturdays & Sundays).

---

## 🕒 Understanding the "Learning" Phase with Weekend Dayparting

Because you do not advertise on weekends, your 5-to-7-day Google Ads "Learning" phase will take slightly longer in real calendar time:
* **Why:** Google only counts days where the campaign is actively serving and collecting impressions/clicks. 
* **The Impact:** Instead of finishing in a standard week, expect the learning status to remain active for **7 to 10 calendar days**. This is completely normal and your campaign is still serving and protecting your budget in the meantime. Do **not** make any bid, keyword, or budget changes during this time, or the learning clock will reset!

---

## 🗓️ Step-by-Step Optimization Roadmap

### 🟥 Phase 1: The 3-Day Steps (Surgical Monitoring)
*Focus: Verification and absolute safety. Ensuring the "pipes" are flowing and the correct campaigns are receiving traffic.*

1. **Verify the PMax Exclusions:**
   * Go to your remaining active `Catch All | PMax` campaigns. Check their **Listing Groups** to verify that your `BL00` (Building Letters), `VL07` (Truck Lettering), and `CL00` (Marquee Letters) products are successfully **EXCLUDED**. This ensures they don't try to hijack traffic from your new campaigns.
2. **Check for "Double Serving":**
   * Confirm that your old underperforming PMax campaigns (`BL00 PMax`, `VL07 PMax`, `CL00 PMax`) are **100% Paused**.
3. **Monitor the Search Campaign Impressions:**
   * Ensure your new standard search campaigns are receiving at least a few impressions. Since they are restricted to phrase/exact matches and have a $3.50 to $4.00 CPC bid cap, the flow will be slow and steady on Friday, then pause on Saturday/Sunday, and pick up fully on Monday morning.
4. **Weekend Dayparting Check:**
   * On Saturday morning, quickly log in once to verify that **your campaigns have successfully paused** and are not spending money over the weekend.

---

### 🟨 Phase 2: The 7-Day Steps (The First Hand-Off)
*Focus: Traffic quality control and initial query sculpting. Your bidding strategies should be emerging from their learning phases.*

1. **Perform your First Search Terms Audit (M-F Data):**
   * Navigate to **Insights and reports -> Search terms** for your new standard Search campaigns (`BL00 Search` and `Truck Lettering Search`).
   * Look for any new "close variant" leakage that Google's algorithm may have snuck past your phrase matches.
   * If you spot any non-commercial terms, add them immediately as **Campaign-Level Negative Keywords**.
2. **Standard Shopping Bid Triage:**
   * Review the average Cost-Per-Click (CPC) of your new `BL00` and `VL07` Standard Shopping campaigns.
   * If you are on Target ROAS and the campaign is generating impressions but not hitting budget, **leave it alone**.
   * If you are using Manual CPC on your Catch-All campaign and it's spending its budget too fast on Monday/Tuesday, lower your default bid from **$0.45 to $0.35**.
3. **Review "Limited by Budget" Statuses:**
   * Because your standard campaigns are highly efficient, you want them to have enough budget to serve. If any of your standard campaigns display a "Limited by Budget" warning on Tuesday or Wednesday, safely shift more budget away from other generic/unoptimized campaigns directly into them.

---

### 🟩 Phase 3: The 30-Day Steps (Data-Driven Scaling)
*Focus: Scaling profitability and migrating bid strategies to smart optimization.*

1. **The Dayparting Efficiency Review:**
   * Navigate to **When and where ads showed -> When ads showed**. Look at your hourly performance from Monday through Friday.
   * *Insight:* You may discover that your B2B buyers convert heavily between 9 AM and 3 PM, but are unprofitable between 6 PM and Midnight. If so, adjust your dayparting schedule to run **only during business hours (e.g., Mon-Fri, 8 AM to 5 PM)** to squeeze even more profitability out of your budget.
2. **Harvest Keywords to Search:**
   * Look at your new Standard Shopping campaigns. Find any specific, high-intent product titles that converted.
   * **Action:** Add those exact converting product queries into your Search campaigns as **Exact Match keywords** to guarantee you always win the absolute top position for those exact items.
3. **Smart Bidding Migration (The Graduation):**
   * For campaigns that have accumulated **15+ conversions over the past 30 days**:
     * Migrate your bidding strategy from **Maximize Clicks** to **Maximize Conversions** or **Maximize Conversion Value (Target ROAS)**.
     * Set the Target ROAS based on your 70% profit margin limits (e.g., set to **250%** or **300%**).
     * *Why:* Now that Google has 30 days of pristine, high-intent B2B conversion data, its machine learning will be "perfectly trained" to target only the highest-intent corporate buyers, completely locking in your target ROAS.
4. **Fix the Technical Warnings (GA4 & GTM):**
   * Within this 30-day window, work with your web developer to resolve the **Enhanced Conversions** setup warning we discovered in your `CL00` search campaign. This is vital to ensure Google has 100% accurate customer purchase data going forward.
