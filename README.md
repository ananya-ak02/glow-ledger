# GlowLedger 🌿

> **Personalized Skincare Intelligence Web Application**  
> Built strictly with **100% permanent free tiers and open-source tools**. No paid subscriptions, no credit card required.

---

## 💡 The Problem
People discover trending skincare products on Instagram or TikTok, then spend exhausting hours cross-checking Reddit (r/SkincareAddiction, r/AsianBeauty), Quora, Amazon, Nykaa, and Sephora reviews. They're left with two unanswered questions:
1. **"Is this product right for MY skin?"**
2. **"Where does it fit in MY routine?"**

GlowLedger replaces the endless tabs with instant, personalized dermatological intelligence.

---

## 🏗️ Zero-Cost Technology Stack

Every component operates within permanent free-tier quotas:

| Layer | Technology | Free Tier Provision | Purpose in GlowLedger |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router) + TS | Open Source | Modern React 19 architecture with Turbopack |
| **Design System** | Tailwind CSS v4 + shadcn/ui | Open Source | Soft skincare palette (Warm cream `#FAF6F1`, Sage `#A9B8A0`, Terracotta `#C98B7B`) |
| **Hosting** | Vercel Hobby Plan | 100 GB Bandwidth, 10s Serverless | Fast edge rendering; long tasks split into client-orchestrated steps |
| **Backend & DB** | Supabase Postgres Free Tier | 500 MB DB, 50K MAU, RLS | 10 relational tables protected with Row Level Security |
| **Authentication** | Supabase Auth | 50,000 MAU free | Email/password, Google OAuth, and 1-click Demo mode |
| **Primary AI** | Google Gemini 2.0 Flash | 15 RPM / 1,500 RPD / 1M TPM | Complex routine analysis and product report synthesis |
| **Secondary AI** | Gemini 2.0 Flash-Lite | 30 RPM / 1,500 RPD / 1M TPM | Lightweight per-user personalization deltas (~500 tokens) |
| **Extraction AI** | Groq (Llama 3.3 70B) | 30 RPM / 14,400 RPD | Fast, zero-cost ingredient parsing & classification |
| **Cosmetic Data** | Open Beauty Facts API | Free Community Open Data | Direct INCI ingredient resolution without scraping retailer sites |
| **Review Sources** | Reddit Public API + Tavily | Free low-volume limits | Real community feedback from r/SkincareAddiction |
| **Deterministic Engine** | TypeScript Pure Code | 0 Tokens / 0 API Calls | Chemical contraindications, pregnancy checks, layering order |

---

## 🛡️ Free-Tier Survival Rules

To guarantee permanent zero-cost operation, GlowLedger enforces strict architectural constraints:

1. **Shared vs. Personal Pipeline Decoupling:**
   - **Shared Research (Expensive):** Researched **once** and saved to the Postgres `research_reports` cache with a 30-day TTL. Subsequent queries by *any* user hit the cache with **0 external search and 0 AI synthesis calls**.
   - **Personalization (Cheap):** A lightweight Gemini Flash-Lite call evaluates the cached report against the user's specific skin profile.
2. **Deterministic Rules Before LLMs:**
   - Chemical conflicts (e.g. Retinol + AHA/BHA), pregnancy contraindications, and layering order are computed with pure TypeScript logic (`src/lib/ingredients/conflict-rules.ts`), consuming **zero** tokens.
3. **Task-Based Model Routing Table:**
   - Lives in [`src/config/models.ts`](file:///c:/Users/HP/Desktop/skincare-des/src/config/models.ts). Models can be swapped without modifying business code.
4. **Resilient Fallback Chains & Backoff:**
   - Every AI request is wrapped in exponential backoff with jitter (`getBackoffDelay`).
   - If Gemini rate-limits (HTTP 429), it automatically falls back to Groq Llama 3.3 70B, and then to a deterministic fallback.
5. **Supabase Inactivity Mitigation:**
   - Supabase free instances pause after 7 days of inactivity. The client-side `<SupabaseWakeup />` component intercepts initial timeouts and presents a friendly animated "Waking up database..." state.

---

## 📊 Free-Tier Budget & Quotas

Enforced server-side via [`src/config/rate-limits.ts`](file:///c:/Users/HP/Desktop/skincare-des/src/config/rate-limits.ts):

| Limit Type | Configured Limit | Provider Hard Ceiling | Strategy |
| :--- | :--- | :--- | :--- |
| **Per-User Daily Researches** | 5 researches / day | N/A | Preserves search API and AI token allotments |
| **Global Daily AI Calls** | 500 calls / day | 1,500 RPD (Gemini) | Graceful "High demand, resets shortly" banner |
| **Global Search Queries** | 30 queries / day | 1,000 / month (Tavily) | Max 2 queries per uncached product |
| **Report Cache TTL** | 30 days | N/A | Popular products (CeraVe, BHA) hit cache 80%+ |

---

## 🌟 Core Features

### 1. Multi-Step Onboarding Intake ([`/onboarding`](file:///c:/Users/HP/Desktop/skincare-des/src/app/onboarding/page.tsx))
- **Step 1: Skin Type:** Dry, oily, combination, normal, sensitive with visual cards and custom notes.
- **Step 2: Skin Concerns:** Acne (severity check), dark spots, PIH/PIE marks, redness, texture, dehydration, pores, plus facial zone tagging.
- **Step 3: Current Routine:** AM & PM builder with product name, category, and frequency.
- **Step 4: History & Reactions:** Holy-grail staples logger vs negative reaction logger with suspected trigger tagging.
- **Step 5: Context & Preferences:** Age bracket, climate, budget, pregnancy mode toggle, fragrance preference, and AI consent.
- *Draft Resilience:* Auto-saves to local storage; completely skippable and re-editable at [`/profile`](file:///c:/Users/HP/Desktop/skincare-des/src/app/profile/page.tsx).

### 2. Routine Analyzer ([`/routine`](file:///c:/Users/HP/Desktop/skincare-des/src/app/routine/page.tsx))
- **One Synthesis Call:** Identifies what's correct, formulation issues, chemical conflicts, and duplicate steps.
- **Ingredient-Type Primacy:** Recommends active ingredient types first (e.g. *Azelaic Acid 10%* or *Ceramides NP/AP/EOP*) before suggesting product categories.
- **Scientific Layering Order:** Visual timeline ordering steps from thinnest consistency to thickest occlusive.

### 3. Hero Product Research Engine ([`/research`](file:///c:/Users/HP/Desktop/skincare-des/src/app/research/page.tsx))
- **3 Input Modes:** Product Name & Brand, Product URL, or Pasted INCI Ingredient List & Reviews.
- **Product Verdict Card:**
  - Verdict: **Good fit** / **Use with caution** / **Avoid**, with confidence score.
  - Personalized ingredient breakdown flagging allergies and past reaction history.
  - Review summary with promotional authenticity trust notes.
  - Routine placement: AM vs PM, frequency, and conservative intro plan (patch test, 2x/week start).
  - Routine conflict warnings against currently applied products.
  - Verifiable source citations (Reddit, Open Beauty Facts).

### 4. Reaction & Trigger Log ([`/reactions`](file:///c:/Users/HP/Desktop/skincare-des/src/app/reactions/page.tsx))
- Logs skin intolerances with symptoms and severity.
- **Auto-Detected Triggers:** Deterministic frequency analyzer detects co-occurring trigger ingredients across multiple flagged products and warns users in future research verdicts.
- Explains clinical difference between *Active Purging* vs *Barrier Irritation*.

### 5. Routine Builder & Intro Timeline ([`/routine/builder`](file:///c:/Users/HP/Desktop/skincare-des/src/app/routine/builder/page.tsx))
- Assembles an optimized AM/PM routine combining user profile + shortlisted wishlist items.
- **Hero Feature — One-New-Active-at-a-Time Intro Timeline:** Staggers potent actives into 3-week sequential phases with patch-testing instructions to isolate reactions and preserve the barrier.

### 6. Wishlist & Product Comparison ([`/wishlist`](file:///c:/Users/HP/Desktop/skincare-des/src/app/wishlist/page.tsx))
- Save shortlisted products from research reports.
- Side-by-side comparison modal evaluating formulas, pros/cons, and verdicts using **existing cached reports** (**0 new AI API calls**).

---

## ⚕️ Safety, Medical Ethics & Privacy

GlowLedger implements hard safety boundaries documented at [`/safety`](file:///c:/Users/HP/Desktop/skincare-des/src/app/safety/page.tsx):
- **Medical Disclaimer:** Informational intelligence only; not clinical medical advice.
- **Dermatologist Escalation:** Proactive escalation banners for severe/cystic acne, sudden facial reactions, suspicious moles, or persistent burning.
- **Pregnancy Safety Mode:** Automatically excludes retinoids (retinol, tretinoin, adapalene), high-dose salicylic acid (>2%), and hydroquinone.
- **AI Privacy Safeguards:** Personal identifiers (names, emails, user photos) are **never** transmitted to AI providers.
- **Delete My Data:** 1-click data wipe available directly in user settings.
- **Portfolio / Demo License:** Distributed as an open-source demonstration project for portfolio and educational use.

---

## 🚧 Architectural Roadmap: Deferred Features

The following features were intentionally deferred because they require paid or privacy-heavy infrastructure that violates the zero-cost constraint:
1. **Progress Photo Tracker:** Requires HIPAA-compliant client-side encrypted storage exceeding Supabase's free 500MB tier.
2. **Retailer Price Comparison & Dupes:** Requires paid scraping proxies (e.g. BrightData/Apify) or formal commercial affiliate APIs to bypass retailer anti-bot blocks.
3. **Background Async Queues:** Requires dedicated Redis Celery/BullMQ worker instances exceeding Vercel Hobby's 10s serverless timeout; resolved in GlowLedger via client-orchestrated sequential steps.
4. **Payment Gateways:** Omitted to ensure 100% free accessibility.

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/glowledger.git
cd glowledger
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your free API keys:
- **Supabase URL & Anon Key:** Create a free project at [supabase.com](https://supabase.com).
- **Gemini API Key:** Generate a free key at [Google AI Studio](https://aistudio.google.com).
- **Groq API Key:** Generate a free key at [Groq Console](https://console.groq.com).
- *(Optional)* **Tavily API Key:** Free 1,000 searches at [tavily.com](https://tavily.com).

### 3. Run Database Migrations in Supabase
Open your Supabase Project Dashboard → **SQL Editor** and run:
1. [`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/HP/Desktop/skincare-des/supabase/migrations/001_initial_schema.sql) (Sets up 10 tables, enums, triggers, and Row Level Security policies).
2. [`supabase/migrations/002_seed_ingredients.sql`](file:///c:/Users/HP/Desktop/skincare-des/supabase/migrations/002_seed_ingredients.sql) (Seeds 30 foundational cosmetic ingredients).

### 4. Run Automated Tests
```bash
npm test
```
Runs 39 unit tests across conflict rules, trigger detection, AI schemas, and pipeline prompts via Vitest.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel Hobby
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Project Settings → Environment Variables**, add your keys from `.env.local`.
4. Deploy! Next.js 16 App Router will build and optimize all static pages automatically.

---

## 🧪 Evaluation Benchmark Dataset

The repo includes a benchmark test set of 15 iconic skincare products in [`src/lib/research/eval-products.ts`](file:///c:/Users/HP/Desktop/skincare-des/src/lib/research/eval-products.ts) used to verify safety rules and synthesis quality:
- *Paula's Choice 2% BHA* (Exfoliant / Salicylic Acid)
- *Differin Gel Adapalene 0.1%* (Retinoid / Pregnancy Contraindication)
- *CeraVe Moisturizing Cream* (Moisturizer / 3 Essential Ceramides)
- *SkinCeuticals C E Ferulic* (Vitamin C / Antioxidant)
- *Beauty of Joseon Relief Sun SPF 50* (Sunscreen / Rice Extract)
- *COSRX Snail Mucin 96 Essence* (Hydration)
- *La Roche-Posay Cicaplast Baume B5+* (Barrier Balm)
- *The Ordinary Niacinamide 10% + Zinc* (Serum)
- *PanOxyl 10% Benzoyl Peroxide Wash* (Acne Wash)
- *KraveBeauty Great Barrier Relief* (Tamanu Oil)
- ...and 5 more.

---

## 📄 License & Attribution
Distributed under the MIT License. Built with open-source tools: Next.js, React, Tailwind CSS, Supabase, Google Gemini API, Groq, and Open Beauty Facts.
