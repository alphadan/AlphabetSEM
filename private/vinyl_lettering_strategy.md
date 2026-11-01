# 🚚 B2B Vinyl Lettering — Master Strategic Audit & Action Plan

This document establishes the high-level strategy, priority matrix, and operational timeline to optimize Alphabet Signs' vinyl lettering campaigns, representing our highest-margin (70% gross profit) product lines.

---

## 📌 1. High-Level B2B Strategic Priorities

To maximize our 70% margins, we segment our optimizations into three functional priorities:

### 🔥 HIGH PRIORITY: Isolate B2C Consumer Leaks & Exclude "Friendly Fire" (Weeks 1 - 2)
*   **The Problem**: Your `70 Margin` shopping campaign is matching heavily to **low-AOV residential queries** (like `"mailbox post kit"`, `"green reflective mailbox numbers"`, and `"bronze mailbox with numbers"`). At a $0.92 average CPC, paying for people looking for $5.00 hardware parts ruins your margins.
    *   *The GMC Item ID Audit*: Your GA4 e-commerce report shows that your B2C mailbox letters (`VL00MB`) have an order value of only **$19.85**, whereas your custom B2B vinyl lettering (`VL0212`) has an astronomical Average Order Value (AOV) of **$172.50**! 
*   **The Strategic Action**: We must surgically separate your B2B commercial lettering from your consumer residential lettering. We will build a dedicated **`[Category Exclude] Mailboxes & Hardware`** list to block these terms in your B2B campaigns, while ensuring your core commercial vehicle terms (like `USDOT` and `Magnetic`) are protected.

### ⚡ MEDIUM PRIORITY: Implement Ad Group-Level Bidding Boundaries on Search (Weeks 3 - 4)
*   **The Problem**: Your `Truck Door Business Decals` ad group is monopolizing your search budget, spending **83% of your campaign cost ($854.64)** at an expensive **$5.31 average CPC**, returning a weak **1.02 ROAS**. Meanwhile, your highly efficient `Regulation Markings` ad group (2.50 ROAS) is starved of budget.
*   **The Strategic Action**: We must override your campaign-level bidding and apply **Ad Group-Level Bidding Boundaries** (such as custom ad group-level Target CPAs) to "choke" the expensive, low-performing business decals clicks and allow your high-ROAS regulatory markings to scale.

### ❄️ LOW PRIORITY: Re-Calibrate the Shopping ROAS Caps (Weeks 5 - 6)
*   **The Problem**: Your `VL07 Shopping` campaign is currently locked at a tight **220% Target ROAS**, which may be slightly too restrictive during current competitive bidding waves, causing Google's algorithm to restrict impressions on your highest-converting B2B decals.
*   **The Strategic Action**: We will incrementally lower this target to **180% to 200%** to release the bidding chokehold, while enforcing a strict **$3.50 Maximum Bid Cap (Max CPC)** to protect against individual click-price spikes.

---

## 📅 2. The 6-Week Strategic Timeline

```mermaid
graph TD
    classDef high fill:#0284c7,stroke:#0369a1,color:#fff,stroke-width:2px;
    classDef med fill:#f59e0b,stroke:#d97706,color:#fff,stroke-width:2px;
    classDef low fill:#10b981,stroke:#047857,color:#fff,stroke-width:2px;
    
    A[Strategy Audit] --> B("Weeks 1 - 2 | Global B2C Exclusions & Keyword Pruning") :::high
    B --> C("Weeks 3 - 4 | Ad Group Search CPA Restructuring") :::med
    C --> D("Weeks 5 - 6 | Value-Based tROAS & CPC Cap Alignment") :::low
```

*   **Weeks 1 - 2 (High Priority)**: Clean and apply your **B2C/Mailbox negative lists** globally to block residential click waste. Audit and prune your `Truck Search` keyword list, converting broad-match spammers to exact-match `[]` boundaries.
*   **Weeks 3 - 4 (Medium Priority)**: Implement your custom ad group-level Target CPAs to reallocate budget away from expensive B2C clicks into your high-converting USDOT and regulatory markings.
*   **Weeks 5 - 6 (Low Priority)**: Align your Shopping campaigns under Portfolio Bid Strategies, adjusting ROAS targets and setting strict Max CPC bid caps to lock in your B2B profit margins.
