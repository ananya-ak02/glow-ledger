-- Seed data for common skincare ingredients
-- Reference data, not user data — writable only by service_role

INSERT INTO ingredients (name, aliases, function, category, irritation_risk, comedogenic_rating, pregnancy_unsafe, pregnancy_notes, common_sensitivities, description) VALUES

-- ─── Hydrators & Moisturizers ─────────────────────────────

('Hyaluronic Acid',
 ARRAY['HA', 'sodium hyaluronate', 'hyaluronan'],
 'Humectant — draws water to skin', 'hydrator', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'A powerful humectant that holds up to 1000x its weight in water. Works best in humid environments or layered under an occlusive.'),

('Glycerin',
 ARRAY['glycerol', 'vegetable glycerin'],
 'Humectant — attracts moisture', 'hydrator', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'One of the most effective and well-studied humectants. Found in most moisturizers.'),

('Ceramides',
 ARRAY['ceramide NP', 'ceramide AP', 'ceramide EOP', 'phytosphingosine', 'sphingolipids'],
 'Barrier repair — restores lipid barrier', 'moisturizer', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Essential lipids that make up ~50% of the skin barrier. Replenishing ceramides helps repair damaged or dry skin.'),

('Squalane',
 ARRAY['squalene', 'olive squalane'],
 'Emollient — lightweight oil', 'moisturizer', 'low', 1, FALSE, NULL,
 ARRAY[]::TEXT[],
 'A lightweight, non-comedogenic oil that mimics skin''s natural sebum. Great for all skin types.'),

('Shea Butter',
 ARRAY['butyrospermum parkii'],
 'Occlusive — locks in moisture', 'moisturizer', 'low', 2, FALSE, NULL,
 ARRAY['nut allergy'],
 'Rich emollient with anti-inflammatory properties. May be too heavy for oily or acne-prone skin.'),

-- ─── Actives: Vitamin C ──────────────────────────────────

('Vitamin C (L-Ascorbic Acid)',
 ARRAY['ascorbic acid', 'LAA', 'vitamin c'],
 'Antioxidant — brightens, boosts collagen', 'antioxidant', 'moderate', 0, FALSE, NULL,
 ARRAY['sensitive skin may experience tingling'],
 'The gold standard antioxidant. Most effective at pH 2.5-3.5. Unstable — look for airless, opaque packaging.'),

('Ascorbyl Glucoside',
 ARRAY['AA2G'],
 'Antioxidant — stable vitamin C derivative', 'antioxidant', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Stable, water-soluble vitamin C derivative. Gentler than L-ascorbic acid but less potent.'),

-- ─── Actives: Retinoids ──────────────────────────────────

('Retinol',
 ARRAY['vitamin A', 'retinoid'],
 'Anti-aging — promotes cell turnover', 'retinoid', 'high', 0, TRUE,
 'All retinoids are contraindicated during pregnancy due to risk of birth defects.',
 ARRAY['dryness', 'peeling', 'purging'],
 'Gold standard anti-aging ingredient. Start low (0.025-0.05%) and build tolerance. Always use sunscreen.'),

('Retinaldehyde',
 ARRAY['retinal'],
 'Anti-aging — one step from retinoic acid', 'retinoid', 'moderate', 0, TRUE,
 'All retinoids are contraindicated during pregnancy.',
 ARRAY['mild irritation'],
 'More potent than retinol but better tolerated. Converts to retinoic acid in one step.'),

('Adapalene',
 ARRAY['differin'],
 'Anti-acne retinoid — reduces comedones', 'retinoid', 'moderate', 0, TRUE,
 'Retinoid — avoid during pregnancy.',
 ARRAY['dryness', 'peeling'],
 'Synthetic retinoid primarily for acne. More stable and less irritating than tretinoin. Available OTC at 0.1%.'),

-- ─── Actives: Exfoliants ─────────────────────────────────

('Glycolic Acid',
 ARRAY['AHA', 'alpha hydroxy acid'],
 'Chemical exfoliant — resurfaces skin', 'exfoliant', 'moderate', 0, FALSE, NULL,
 ARRAY['stinging on sensitive skin', 'sun sensitivity'],
 'Smallest AHA molecule — most penetrating. Great for texture, dullness, and hyperpigmentation. Always use sunscreen.'),

('Lactic Acid',
 ARRAY['AHA'],
 'Gentle exfoliant — hydrating AHA', 'exfoliant', 'low', 0, FALSE, NULL,
 ARRAY['mild stinging'],
 'Larger AHA molecule — gentler than glycolic. Also acts as a humectant. Good for sensitive skin starting with exfoliation.'),

('Salicylic Acid',
 ARRAY['BHA', 'beta hydroxy acid'],
 'Exfoliant — unclogs pores', 'exfoliant', 'moderate', 0, TRUE,
 'High-dose salicylic acid (>2%) should be avoided during pregnancy. Low-dose facial washes are generally considered safe.',
 ARRAY['dryness', 'peeling'],
 'Oil-soluble BHA that penetrates pores. The go-to for acne and blackheads. Anti-inflammatory properties.'),

('Mandelic Acid',
 ARRAY['AHA'],
 'Gentle AHA exfoliant', 'exfoliant', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Largest common AHA molecule — very gentle. Good for sensitive and darker skin tones (lower risk of PIH).'),

-- ─── Niacinamide & Brightening ───────────────────────────

('Niacinamide',
 ARRAY['nicotinamide', 'vitamin B3'],
 'Multi-benefit — pores, oil control, barrier', 'brightening', 'low', 0, FALSE, NULL,
 ARRAY['high concentrations (>10%) may cause flushing'],
 'Swiss army knife ingredient: controls oil, minimizes pores, fades dark spots, strengthens barrier. Well-tolerated at 2-5%.'),

('Alpha Arbutin',
 ARRAY['arbutin'],
 'Brightening — inhibits melanin production', 'brightening', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Gentle, effective brightening agent. Safer alternative to hydroquinone. Works well with vitamin C.'),

('Tranexamic Acid',
 ARRAY['TXA'],
 'Brightening — targets stubborn pigmentation', 'brightening', 'low', 0, FALSE,
 'Limited data; consult doctor during pregnancy.',
 ARRAY[]::TEXT[],
 'Excellent for melasma and post-inflammatory hyperpigmentation. Can be used with other brightening agents.'),

('Kojic Acid',
 ARRAY[]::TEXT[],
 'Brightening — natural melanin inhibitor', 'brightening', 'moderate', 0, FALSE, NULL,
 ARRAY['contact dermatitis in sensitive individuals'],
 'Derived from fungi. Effective but can be sensitizing. Often combined with other brightening agents.'),

-- ─── Acne Treatments ─────────────────────────────────────

('Benzoyl Peroxide',
 ARRAY['BPO', 'BP'],
 'Anti-acne — kills acne bacteria', 'acne_treatment', 'high', 0, FALSE,
 'Limited safety data; consult doctor.',
 ARRAY['dryness', 'bleaching of fabrics', 'peeling'],
 'Potent antibacterial for acne. Can bleach fabric and hair. Start at 2.5% — as effective as higher concentrations with less irritation.'),

('Azelaic Acid',
 ARRAY['AzA'],
 'Anti-acne & brightening — multi-benefit', 'acne_treatment', 'low', 0, FALSE,
 'Generally considered safe during pregnancy.',
 ARRAY['mild tingling'],
 'Antibacterial, anti-inflammatory, and brightening. One of few actives considered safe in pregnancy at prescription strength.'),

-- ─── Soothing & Anti-inflammatory ────────────────────────

('Centella Asiatica',
 ARRAY['cica', 'madecassoside', 'asiaticoside', 'TECA', 'gotu kola'],
 'Soothing — calms irritation, promotes healing', 'soothing', 'low', 1, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Powerful anti-inflammatory and wound-healing ingredient. Great for sensitive and irritated skin.'),

('Allantoin',
 ARRAY[]::TEXT[],
 'Soothing — gentle skin protectant', 'soothing', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Gentle soothing and moisturizing ingredient. Promotes cell regeneration. Well-suited for sensitive skin.'),

('Panthenol',
 ARRAY['pro-vitamin B5', 'dexpanthenol', 'D-panthenol'],
 'Soothing — hydrating B5 vitamin', 'soothing', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Humectant and skin protectant. Improves barrier function and hydration. Very well-tolerated.'),

-- ─── Sunscreen Filters ───────────────────────────────────

('Zinc Oxide',
 ARRAY[]::TEXT[],
 'Mineral sunscreen — broad spectrum UV protection', 'sunscreen', 'low', 1, FALSE,
 'Mineral sunscreens are preferred during pregnancy.',
 ARRAY[]::TEXT[],
 'Physical UV filter providing broad-spectrum UVA/UVB protection. Sits on skin surface. Can leave white cast on darker skin tones.'),

('Titanium Dioxide',
 ARRAY[]::TEXT[],
 'Mineral sunscreen — UV protection', 'sunscreen', 'low', 0, FALSE,
 'Mineral sunscreens are preferred during pregnancy.',
 ARRAY[]::TEXT[],
 'Physical UV filter, primarily UVB protection. Often combined with zinc oxide. Less white cast than zinc alone.'),

-- ─── Peptides ────────────────────────────────────────────

('Peptides',
 ARRAY['copper peptides', 'matrixyl', 'argireline', 'palmitoyl tripeptide', 'acetyl hexapeptide'],
 'Anti-aging — signal skin to produce collagen', 'peptide', 'low', 0, FALSE, NULL,
 ARRAY[]::TEXT[],
 'Short chains of amino acids that signal skin repair. Various types target different concerns. Generally well-tolerated.'),

-- ─── Potentially Irritating ──────────────────────────────

('Fragrance',
 ARRAY['parfum', 'essential oils', 'limonene', 'linalool', 'citronellol', 'geraniol'],
 'Fragrance — aesthetic only, no skin benefit', 'fragrance', 'high', 0, FALSE, NULL,
 ARRAY['contact dermatitis', 'sensitization over time'],
 'No skin benefit. One of the top causes of contact dermatitis. Sensitization can develop over time with repeated exposure.'),

('Denatured Alcohol',
 ARRAY['alcohol denat', 'SD alcohol', 'isopropyl alcohol', 'ethanol'],
 'Solvent — helps product penetrate, can dry skin', 'solvent', 'high', 0, FALSE, NULL,
 ARRAY['dryness', 'barrier damage with prolonged use'],
 'Can help ingredients penetrate but damages skin barrier with repeated use. Small amounts in well-formulated products are usually fine.'),

('Tea Tree Oil',
 ARRAY['melaleuca alternifolia', 'TTO'],
 'Antibacterial — natural acne treatment', 'essential_oil', 'moderate', 2, FALSE, NULL,
 ARRAY['contact dermatitis', 'sensitization'],
 'Natural antibacterial effective against acne at 5% concentration. Can cause sensitization. Always use diluted, never pure.'),

('Hydroquinone',
 ARRAY['HQ'],
 'Skin lightening — prescription strength', 'brightening', 'high', 0, TRUE,
 'Avoid during pregnancy due to high absorption rate.',
 ARRAY['irritation', 'ochronosis with prolonged use'],
 'Most effective skin lightening agent. Prescription only in many countries. Use only under dermatologist supervision. Max 3 months on, then break.');
