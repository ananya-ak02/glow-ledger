/**
 * Evaluation Set of ~15 Known Skincare Products
 * Used to verify pipeline accuracy, prompt synthesis quality,
 * and deterministic safety rule trigger behavior.
 */

export interface EvalProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  keyActives: string[];
  expectedSafetyFlags: ('pregnancy' | 'conflict_retinoid' | 'conflict_acid' | 'allergy_nut')[];
  description: string;
}

export const EVAL_PRODUCTS: EvalProduct[] = [
  {
    id: 'to-niacinamide',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'Serum',
    keyActives: ['Niacinamide', 'Zinc PCA'],
    expectedSafetyFlags: [],
    description: 'High-concentration B3 serum targeting sebum and pore appearance.',
  },
  {
    id: 'paulas-choice-bha',
    name: 'Skin Perfecting 2% BHA Liquid Exfoliant',
    brand: "Paula's Choice",
    category: 'Exfoliant',
    keyActives: ['Salicylic Acid', 'Green Tea Extract'],
    expectedSafetyFlags: ['pregnancy', 'conflict_retinoid'],
    description: 'Gold-standard leave-on BHA unclogging pores and smoothing rough texture.',
  },
  {
    id: 'cerave-moisturizing-cream',
    name: 'Moisturizing Cream',
    brand: 'CeraVe',
    category: 'Moisturizer',
    keyActives: ['Ceramides NP', 'Ceramides AP', 'Ceramides EOP', 'Hyaluronic Acid'],
    expectedSafetyFlags: [],
    description: 'Barrier-replenishing cream formulated with 3 essential ceramides.',
  },
  {
    id: 'cosrx-snail-mucin',
    name: 'Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    category: 'Essence',
    keyActives: ['Snail Secretion Filtrate', 'Sodium Hyaluronate', 'Panthenol'],
    expectedSafetyFlags: [],
    description: 'Lightweight hydrating essence providing intensive moisture and elasticity.',
  },
  {
    id: 'skinceuticals-ce-ferulic',
    name: 'C E Ferulic',
    brand: 'SkinCeuticals',
    category: 'Antioxidant Serum',
    keyActives: ['L-Ascorbic Acid 15%', 'Alpha Tocopherol 1%', 'Ferulic Acid 0.5%'],
    expectedSafetyFlags: ['conflict_retinoid'],
    description: 'Patented daytime antioxidant serum protecting against environmental oxidative stress.',
  },
  {
    id: 'differin-adapalene',
    name: 'Adapalene 0.1% Acne Treatment Gel',
    brand: 'Differin',
    category: 'Retinoid Treatment',
    keyActives: ['Adapalene 0.1%'],
    expectedSafetyFlags: ['pregnancy', 'conflict_acid'],
    description: 'Topical OTC third-generation retinoid specifically designed to treat acne.',
  },
  {
    id: 'boj-relief-sun',
    name: 'Relief Sun: Rice + Probiotics SPF 50+ PA++++',
    brand: 'Beauty of Joseon',
    category: 'Sunscreen',
    keyActives: ['Rice Extract 30%', 'Fermented Probiotics', 'Uvinul A Plus'],
    expectedSafetyFlags: [],
    description: 'Organic chemical sunscreen leaving a radiant finish without white cast.',
  },
  {
    id: 'lrp-cicaplast',
    name: 'Cicaplast Baume B5+ Ultra-Repairing Balm',
    brand: 'La Roche-Posay',
    category: 'Barrier Balm',
    keyActives: ['Panthenol 5%', 'Madecassoside', 'Zinc Gluconate', 'Tribioma'],
    expectedSafetyFlags: [],
    description: 'Multi-purpose soothing balm for irritated, compromised, or post-procedure skin.',
  },
  {
    id: 'inkey-hyaluronic-acid',
    name: 'Hyaluronic Acid Serum',
    brand: 'The INKEY List',
    category: 'Hydrating Serum',
    keyActives: ['Hyaluronic Acid 2%', 'Matrixyl 3000 Peptide'],
    expectedSafetyFlags: [],
    description: 'Multi-molecular humectant serum providing instant plumping hydration.',
  },
  {
    id: 'sunday-riley-good-genes',
    name: 'Good Genes All-In-One Lactic Acid Treatment',
    brand: 'Sunday Riley',
    category: 'AHA Treatment',
    keyActives: ['Purified Lactic Acid', 'Licorice Extract', 'Lemongrass'],
    expectedSafetyFlags: ['conflict_retinoid'],
    description: 'Gentle exfoliating AHA serum brightening dullness and clarifying dead skin buildup.',
  },
  {
    id: 'panoxyl-wash',
    name: 'Acne Foaming Wash 10% Benzoyl Peroxide',
    brand: 'PanOxyl',
    category: 'Cleanser / Treatment',
    keyActives: ['Benzoyl Peroxide 10%'],
    expectedSafetyFlags: ['conflict_retinoid'],
    description: 'Maximum-strength antimicrobial acne wash clearing existing breakouts and preventing new ones.',
  },
  {
    id: 'krave-great-barrier-relief',
    name: 'Great Barrier Relief',
    brand: 'KraveBeauty',
    category: 'Repair Serum',
    keyActives: ['Tamanu Oil 10%', 'Safflower Oil', 'Rosehip Oil', 'Ceramides'],
    expectedSafetyFlags: ['allergy_nut'],
    description: 'Skin-soothing serum repairing damaged barriers with cold-pressed tamanu oil.',
  },
  {
    id: 'drunk-elephant-tlc',
    name: 'T.L.C. Framboos Glycolic Night Serum',
    brand: 'Drunk Elephant',
    category: 'Acid Blend',
    keyActives: ['Glycolic Acid 10%', 'Salicylic Acid 1%', 'Tartaric Acid', 'Lactic Acid'],
    expectedSafetyFlags: ['pregnancy', 'conflict_retinoid'],
    description: 'Potent AHA/BHA blend resurfacing dull skin and congested pores overnight.',
  },
  {
    id: 'naturium-azelaic',
    name: 'Azelaic Topical Acid 10%',
    brand: 'Naturium',
    category: 'Treatment',
    keyActives: ['Azelaic Acid 10%', 'Niacinamide', 'Vitamin C'],
    expectedSafetyFlags: [],
    description: 'Bio-compatible treatment targeting dark spots, redness, and blemish-prone skin.',
  },
  {
    id: 'neutrogena-hydro-boost',
    name: 'Hydro Boost Water Gel',
    brand: 'Neutrogena',
    category: 'Moisturizer',
    keyActives: ['Hyaluronic Acid', 'Dimethicone', 'Glycerin'],
    expectedSafetyFlags: [],
    description: 'Oil-free gel moisturizer providing weightless hydration for normal to oily skin.',
  },
];
