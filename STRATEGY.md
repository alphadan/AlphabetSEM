# 🗺️ AlphabetSEM Elite — Master Strategy & Optimization Playbook

AlphabetSEM Elite is the internal MarTech orchestrator custom-engineered for **Alphabet Signs**. By bridging the analytical power of **Google Cloud BigQuery** with the real-time reasoning of **Gemini 3.5 Flash** over native REST bypasses, the platform automates B2B campaign auditing on autopilot.

---

## 📌 1. B2B Portfolio Strategy (Active ENABLED Campaigns)

Our live BigQuery audits revealed that your high-ticket Performance Max campaigns have successfully transitioned to **PAUSED** as of July 2026. The strictly active campaign portfolio must be optimized using data-backed bidding guidelines:

```text
📊 Verified Active campaign performance data from BigQuery:
1. "BL00 Building Letters | Shopping | BL00"        → 8.10 ROAS (Hidden Gem — Starved of budget)
2. "Truck Lettering | Shopping | VL07" & Low AOV PMax → 4.85 ROAS (Outstanding Trade Contractor Funnel)
3. "CL00 | Search | Marquee Letters"                 → 2.70 ROAS (Highly profitable Search volume)
4. "Boat Registration Numbers | Shopping | Low AOV"  → 2.46 ROAS (Massive Checkout Volume Driver)
5. "BL00 Building Letters | Search | Core"          → 0.00 ROAS (Severe Budget Leak — Max Clicks)
6. "Truck Lettering | Search | Core"                 → 0.06 ROAS (Severe Budget Leak — Max Clicks)
```

---

## 📊 2. Active Optimization Blueprints (Action Required)

### 📈 Blueprint A: Device Bid Adjustments
Our BQ device audit proved that Desktop is your absolute conversion engine, while mobile visitors browse but don't finalize design checkouts:
*   **Desktop CVR is 2.4x higher** (5.68% CVR vs Mobile's 2.36%).
*   **Desktop AOV is 2.2x higher** ($137.24 vs Mobile's $62.49).

#### 🛠️ Direct Device Actions:
Apply these bid modifiers inside your Google Ads panel under Campaign Devices:
1.  **B2B Search (Building Letters & Truck Search Core)**:
    *   **Desktop**: 📈 **+20%**
    *   **Mobile**: 📉 **-50%** (Let mobile researchers browse, but do not pay premium bids for them)
    *   **Tablet**: 📉 **-60%**
    *   **Connected TV**: 🚫 **-100% (Exclude Entirely)**
2.  **Shopping & Hybrid (Boat Registration Numbers)**:
    *   **Desktop**: **0% (Standard)**
    *   **Mobile**: 📉 **-15%** (Minor discount to secure the lower Mobile order size)

---

### ⏰ Blueprint B: Dayparting Schedule Modifiers
By grouping conversions hourly, we identified distinct midweek B2B buying waves and late-night consumer dips:
*   **Late Night Sleep (1:00 AM – 5:59 AM)**: **1.15 ROAS** (Hour 4 is 0.00 ROAS).
*   **Morning Commute (7:00 AM – 7:59 AM)**: **0.58 ROAS**.
*   **Midweek Peak (Mon & Wed, 8:00 AM – 4:59 PM)**: **2.02 to 2.85 ROAS** (Primary revenue waves).
*   **Dinner Dip (5:00 PM – 6:59 PM)**: **0.64 ROAS**.

#### 🛠️ Direct Dayparting Actions:
Configure your **Ad Schedules** individually for your high-ticket B2B search and shopping campaigns:
*   **1:00 AM – 4:59 AM**: 📉 **-40% Bid Modifier**
*   **7:00 AM – 7:59 AM**: 📉 **-25% Bid Modifier**
*   **8:00 AM – 4:59 PM (Mondays & Wednesdays only)**: 📈 **+15% Bid Modifier**
*   **8:00 AM – 4:59 PM (Tues, Thurs, Fri)**: **0% (Standard)**
*   **5:00 PM – 6:59 PM**: 📉 **-35% Bid Modifier**
*   **Saturdays & Sundays**: **OFF** (For B2B Search only) / **-25%** (For shopping feeds).

---

## 🚦 3. Stepping-Stone Bidding Strategy Migration

To resolve the budget bleed on **Building Letters | Search** and **Truck Lettering | Search** without freezing their ad reach, migrate them away from "Maximize clicks" using this transition playbook:

1.  **Transition 1 (Immediate)**: Switch bidding from *Maximize clicks* to **Maximize Conversions with a Target CPA**.
    *   🏢 Set `Building Letters | Search | Core` Target CPA to: **`$75.00`**
    *   🚚 Set `Truck Lettering | Search | Core` Target CPA to: **`$35.00`**
2.  **Transition 2 (Algorithmic Learning)**: Leave campaigns untouched for 7 days to let Gemini's programmatic shields and Google's conversion modeling stabilize.
3.  **Transition 3 (Scaling Profit)**: Once a campaign achieves **15 conversions in a 30-day window**, migrate to **Maximize Conversion Value with a Target ROAS of 150% - 180%** to optimize for high-AOV order values.

---

## 🚫 4. Google Ads Auto-Apply Recommendations (AAR) Safe Shield

To protect your B2B keyword bid partitions and landing page alignments, **turn off Google Ads Auto-Apply Recommendations immediately.**

*   **Protect exact matches**: Deleting exact brand terms like `[gemini pronto letters]` or `[wagner zip change letters]` forces Google's broad matching to trigger non-commercial search leaks.
*   **Block blind URL expansion**: Google Ads recently routed searches for `[3d letters]` to your adhesive vinyl `/signs/truck-decals.html` landing page, driving up your bounce rate and wasting click budgets.

**Route all traffic validations through AlphabetSEM Elite first!**
