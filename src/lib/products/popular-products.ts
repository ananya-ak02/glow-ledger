export interface CatalogProduct {
  name: string;
  brand: string;
  category: string;
  keyActives?: string[];
}

export const POPULAR_PRODUCT_CATEGORIES = [
  'Cleanser',
  'Toner / Mist',
  'Serum / Ampoule',
  'Exfoliant / Acid',
  'Retinoid / Treatment',
  'Eye Cream',
  'Moisturizer',
  'Sunscreen',
  'Face Oil',
] as const;

export const POPULAR_PRODUCTS: CatalogProduct[] = [
  // Cleansers
  { name: 'CeraVe Hydrating Facial Cleanser', brand: 'CeraVe', category: 'Cleanser', keyActives: ['Ceramides', 'Hyaluronic Acid'] },
  { name: 'CeraVe Foaming Facial Cleanser', brand: 'CeraVe', category: 'Cleanser', keyActives: ['Niacinamide', 'Ceramides'] },
  { name: 'CeraVe SA Smoothing Cleanser', brand: 'CeraVe', category: 'Cleanser', keyActives: ['Salicylic Acid', 'Ceramides'] },
  { name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', category: 'Cleanser', keyActives: ['Niacinamide', 'Panthenol', 'Glycerin'] },
  { name: 'Cetaphil Oily Skin Cleanser', brand: 'Cetaphil', category: 'Cleanser', keyActives: ['Niacinamide', 'Zinc'] },
  { name: 'La Roche-Posay Toleriane Hydrating Gentle Cleanser', brand: 'La Roche-Posay', category: 'Cleanser', keyActives: ['Prebiotic Thermal Water', 'Ceramide-3'] },
  { name: 'La Roche-Posay Effaclar Purifying Foaming Gel', brand: 'La Roche-Posay', category: 'Cleanser', keyActives: ['Zinc PCA'] },
  { name: 'Cosrx Low pH Good Morning Gel Cleanser', brand: 'Cosrx', category: 'Cleanser', keyActives: ['Tea Tree Oil', 'BHA'] },
  { name: 'Bioderma Sensibio H2O Micellar Water', brand: 'Bioderma', category: 'Cleanser', keyActives: ['Micellar Micelles', 'Cucumber Extract'] },
  { name: 'Minimalist 2% Salicylic Acid Cleanser', brand: 'Minimalist', category: 'Cleanser', keyActives: ['Salicylic Acid 2%', 'LHA', 'Zinc'] },
  { name: 'Minimalist Aquaporin Booster Cleanser', brand: 'Minimalist', category: 'Cleanser', keyActives: ['Hyaluronic Acid', 'Aquaporin'] },
  { name: 'Neutrogena Hydro Boost Hydrating Cleansing Gel', brand: 'Neutrogena', category: 'Cleanser', keyActives: ['Hyaluronic Acid'] },
  { name: 'Simple Kind to Skin Refreshing Facial Wash', brand: 'Simple', category: 'Cleanser', keyActives: ['Pro-Vitamin B5', 'Vitamin E'] },
  { name: 'Plum Green Tea Pore Cleansing Face Wash', brand: 'Plum', category: 'Cleanser', keyActives: ['Green Tea', 'Glycolic Acid'] },
  { name: 'Dot & Key Cica Calming Blemish Clearing Face Wash', brand: 'Dot & Key', category: 'Cleanser', keyActives: ['Cica', 'Salicylic Acid'] },
  { name: 'Banila Co Clean It Zero Cleansing Balm', brand: 'Banila Co', category: 'Cleanser', keyActives: ['Hot Springs Water', 'Acerola'] },
  { name: 'DHC Deep Cleansing Oil', brand: 'DHC', category: 'Cleanser', keyActives: ['Olive Fruit Oil', 'Vitamin E'] },

  // Toners / Mists
  { name: 'The Ordinary Glycolic Acid 7% Toning Solution', brand: 'The Ordinary', category: 'Toner / Mist', keyActives: ['Glycolic Acid 7%', 'Tasmanian Pepperberry'] },
  { name: 'Paula\'s Choice Skin Balancing Pore-Reducing Toner', brand: 'Paula\'s Choice', category: 'Toner / Mist', keyActives: ['Niacinamide', 'Hyaluronic Acid'] },
  { name: 'Beauty of Joseon Ginseng Essence Water', brand: 'Beauty of Joseon', category: 'Toner / Mist', keyActives: ['Ginseng Water 80%', 'Niacinamide 2%'] },
  { name: 'Haruharu Wonder Black Rice Hyaluronic Toner', brand: 'Haruharu Wonder', category: 'Toner / Mist', keyActives: ['Fermented Black Rice', 'Hyaluronic Acid'] },
  { name: 'Laneige Cream Skin Cerapeptide Toner & Moisturizer', brand: 'Laneige', category: 'Toner / Mist', keyActives: ['Ceramides', 'Peptides', 'White Tea'] },
  { name: 'I\'m From Rice Toner', brand: 'I\'m From', category: 'Toner / Mist', keyActives: ['Rice Extract 77.78%', 'Niacinamide'] },
  { name: 'Klairs Supple Preparation Unscented Toner', brand: 'Klairs', category: 'Toner / Mist', keyActives: ['Centella Asiatica', 'Lipidure', 'Hyaluronic Acid'] },
  { name: 'Cosrx AHA/BHA Clarifying Treatment Toner', brand: 'Cosrx', category: 'Toner / Mist', keyActives: ['Willow Bark Water', 'Apple Fruit Water', 'Glycolic Acid'] },
  { name: 'Minimalist PHA 3% + Biotics Face Toner', brand: 'Minimalist', category: 'Toner / Mist', keyActives: ['Gluconolactone 3%', 'Pre-Biotics'] },
  { name: 'Plum Green Tea Alcohol-Free Toner', brand: 'Plum', category: 'Toner / Mist', keyActives: ['Green Tea', 'Glycolic Acid'] },
  { name: 'Avene Thermal Spring Water Mist', brand: 'Avene', category: 'Toner / Mist', keyActives: ['Avene Thermal Spring Water'] },

  // Serums / Ampoules
  { name: 'The Ordinary Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'Serum / Ampoule', keyActives: ['Niacinamide 10%', 'Zinc PCA 1%'] },
  { name: 'The Ordinary Hyaluronic Acid 2% + B5', brand: 'The Ordinary', category: 'Serum / Ampoule', keyActives: ['Hyaluronic Acid 2%', 'Pro-Vitamin B5'] },
  { name: 'The Ordinary Multi-Peptide + HA Serum ("Buffet")', brand: 'The Ordinary', category: 'Serum / Ampoule', keyActives: ['Matrixyl 3000', 'Copper Peptides', 'Syn-Ake'] },
  { name: 'The Ordinary Alpha Arbutin 2% + HA', brand: 'The Ordinary', category: 'Serum / Ampoule', keyActives: ['Alpha Arbutin 2%', 'Hyaluronic Acid'] },
  { name: 'Minimalist 10% Niacinamide Face Serum', brand: 'Minimalist', category: 'Serum / Ampoule', keyActives: ['Niacinamide 10%', 'Zinc PCA', 'EUK-134'] },
  { name: 'Minimalist 10% Vitamin C Face Serum', brand: 'Minimalist', category: 'Serum / Ampoule', keyActives: ['Ethyl Ascorbic Acid 10%', 'Centella Asiatica'] },
  { name: 'Minimalist 16% Vitamin C Face Serum', brand: 'Minimalist', category: 'Serum / Ampoule', keyActives: ['Ethyl Ascorbic Acid 16%', 'Fullerene'] },
  { name: 'Minimalist 2% Alpha Arbutin Serum', brand: 'Minimalist', category: 'Serum / Ampoule', keyActives: ['Alpha Arbutin 2%', 'Hyaluronic Acid'] },
  { name: 'Cosrx Advanced Snail 96 Mucin Power Essence', brand: 'Cosrx', category: 'Serum / Ampoule', keyActives: ['Snail Secretion Filtrate 96%', 'Sodium Hyaluronate'] },
  { name: 'Skin1004 Madagascar Centella Asiatica Ampoule', brand: 'Skin1004', category: 'Serum / Ampoule', keyActives: ['Centella Asiatica Extract 100%'] },
  { name: 'Beauty of Joseon Glow Serum (Propolis + Niacinamide)', brand: 'Beauty of Joseon', category: 'Serum / Ampoule', keyActives: ['Propolis 60%', 'Niacinamide 2%'] },
  { name: 'Beauty of Joseon Revive Serum (Ginseng + Snail)', brand: 'Beauty of Joseon', category: 'Serum / Ampoule', keyActives: ['Ginseng Root Water 63%', 'Snail Mucin 3%'] },
  { name: 'La Roche-Posay Hyalu B5 Pure Hyaluronic Acid Serum', brand: 'La Roche-Posay', category: 'Serum / Ampoule', keyActives: ['Hyaluronic Acid', 'Vitamin B5', 'Madecassoside'] },
  { name: 'Dr. Sheth\'s Centella & Niacinamide Serum', brand: 'Dr. Sheth\'s', category: 'Serum / Ampoule', keyActives: ['Centella', 'Niacinamide 10%'] },
  { name: 'Plum 15% Vitamin C Face Serum with Mandarin', brand: 'Plum', category: 'Serum / Ampoule', keyActives: ['Ethyl Ascorbic Acid 15%', 'Mandarin'] },

  // Exfoliants / Acids
  { name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice', category: 'Exfoliant / Acid', keyActives: ['Salicylic Acid 2%', 'Green Tea'] },
  { name: 'The Ordinary AHA 30% + BHA 2% Peeling Solution', brand: 'The Ordinary', category: 'Exfoliant / Acid', keyActives: ['Glycolic Acid', 'Lactic Acid', 'Salicylic Acid 2%'] },
  { name: 'The Ordinary Lactic Acid 10% + HA', brand: 'The Ordinary', category: 'Exfoliant / Acid', keyActives: ['Lactic Acid 10%', 'Tasmanian Pepperberry'] },
  { name: 'The Ordinary Mandelic Acid 10% + HA', brand: 'The Ordinary', category: 'Exfoliant / Acid', keyActives: ['Mandelic Acid 10%', 'Hyaluronic Acid'] },
  { name: 'Minimalist 2% Salicylic Acid Face Serum', brand: 'Minimalist', category: 'Exfoliant / Acid', keyActives: ['Salicylic Acid 2%', 'Oligopeptide'] },
  { name: 'Minimalist AHA BHA 10% Exfoliator', brand: 'Minimalist', category: 'Exfoliant / Acid', keyActives: ['Lactic Acid', 'Salicylic Acid', 'Gluconolactone'] },
  { name: 'Cosrx BHA Blackhead Power Liquid', brand: 'Cosrx', category: 'Exfoliant / Acid', keyActives: ['Betaine Salicylate 4%', 'Niacinamide'] },

  // Retinoids / Treatments
  { name: 'The Ordinary Retinol 0.2% in Squalane', brand: 'The Ordinary', category: 'Retinoid / Treatment', keyActives: ['Retinol 0.2%', 'Squalane'] },
  { name: 'The Ordinary Retinol 0.5% in Squalane', brand: 'The Ordinary', category: 'Retinoid / Treatment', keyActives: ['Retinol 0.5%', 'Squalane'] },
  { name: 'The Ordinary Granactive Retinoid 2% Emulsion', brand: 'The Ordinary', category: 'Retinoid / Treatment', keyActives: ['Hydroxypinacolone Retinoate'] },
  { name: 'Differin Adapalene Gel 0.1% Acne Treatment', brand: 'Differin', category: 'Retinoid / Treatment', keyActives: ['Adapalene 0.1%'] },
  { name: 'Minimalist 0.3% Retinol Face Serum', brand: 'Minimalist', category: 'Retinoid / Treatment', keyActives: ['Retinol 0.3%', 'Coenzyme Q10'] },
  { name: 'CeraVe Resurfacing Retinol Serum', brand: 'CeraVe', category: 'Retinoid / Treatment', keyActives: ['Encapsulated Retinol', 'Licorice Root', 'Niacinamide'] },
  { name: 'CeraVe Skin Renewing Retinol Serum', brand: 'CeraVe', category: 'Retinoid / Treatment', keyActives: ['Retinol', 'Hyaluronic Acid', 'Ceramides'] },
  { name: 'Cosrx The Retinol 0.1 Cream', brand: 'Cosrx', category: 'Retinoid / Treatment', keyActives: ['Pure Retinol 0.1%', 'Panthenol', 'Tocotrienol'] },
  { name: 'The Ordinary Azelaic Acid Suspension 10%', brand: 'The Ordinary', category: 'Retinoid / Treatment', keyActives: ['Azelaic Acid 10%'] },

  // Eye Creams
  { name: 'Beauty of Joseon Revive Eye Serum (Ginseng + Retinal)', brand: 'Beauty of Joseon', category: 'Eye Cream', keyActives: ['Ginseng Extract 10%', 'Retinal Liposome 2%'] },
  { name: 'CeraVe Eye Repair Cream', brand: 'CeraVe', category: 'Eye Cream', keyActives: ['Ceramides', 'Hyaluronic Acid', 'Marine & Botanical Complex'] },
  { name: 'The Ordinary Caffeine Solution 5% + EGCG', brand: 'The Ordinary', category: 'Eye Cream', keyActives: ['Caffeine 5%', 'EGCG Green Tea'] },
  { name: 'Kiehl\'s Creamy Eye Treatment with Avocado', brand: 'Kiehl\'s', category: 'Eye Cream', keyActives: ['Avocado Oil', 'Shea Butter'] },

  // Moisturizers
  { name: 'CeraVe Daily Moisturizing Lotion', brand: 'CeraVe', category: 'Moisturizer', keyActives: ['Ceramides 1, 3, 6-II', 'Hyaluronic Acid'] },
  { name: 'CeraVe Moisturizing Cream (in tub)', brand: 'CeraVe', category: 'Moisturizer', keyActives: ['Ceramides', 'Hyaluronic Acid', 'Petrolatum'] },
  { name: 'CeraVe PM Facial Moisturizing Lotion', brand: 'CeraVe', category: 'Moisturizer', keyActives: ['Niacinamide', 'Ceramides', 'Hyaluronic Acid'] },
  { name: 'Cetaphil Moisturising Cream', brand: 'Cetaphil', category: 'Moisturizer', keyActives: ['Sweet Almond Oil', 'Niacinamide', 'Panthenol'] },
  { name: 'Neutrogena Hydro Boost Water Gel', brand: 'Neutrogena', category: 'Moisturizer', keyActives: ['Hyaluronic Acid', 'Trehalose'] },
  { name: 'La Roche-Posay Cicaplast Baume B5+ Soothing Balm', brand: 'La Roche-Posay', category: 'Moisturizer', keyActives: ['Panthenol 5%', 'Madecassoside', 'Tribioma'] },
  { name: 'La Roche-Posay Toleriane Double Repair Face Moisturizer', brand: 'La Roche-Posay', category: 'Moisturizer', keyActives: ['Ceramide-3', 'Niacinamide', 'Glycerin'] },
  { name: 'SoonJung 2x Barrier Intensive Cream', brand: 'Etude SoonJung', category: 'Moisturizer', keyActives: ['Panthenol', 'Madecassoside', 'Shea Butter'] },
  { name: 'Illiyoon Ceramide Ato Concentrate Cream', brand: 'Illiyoon', category: 'Moisturizer', keyActives: ['Ceramide Skin Complex', 'Panax Ginseng'] },
  { name: 'Minimalist Marula Oil 5% Face Moisturizer', brand: 'Minimalist', category: 'Moisturizer', keyActives: ['Marula Oil', 'Hyaluronic Acid', 'Vitamin F'] },
  { name: 'Minimalist Sepicalm 3% Oat Moisturizer', brand: 'Minimalist', category: 'Moisturizer', keyActives: ['Sepicalm 3%', 'Oat Extract', 'Polyglutamic Acid'] },
  { name: 'Dot & Key 72HR Hydrating Gel + Probiotics', brand: 'Dot & Key', category: 'Moisturizer', keyActives: ['Hyaluronic Acid', 'Kombucha', 'Rice Water'] },
  { name: 'Clinique Moisture Surge 100H Auto-Replenishing Hydrator', brand: 'Clinique', category: 'Moisturizer', keyActives: ['Aloe Bio-Ferment', 'Hyaluronic Acid'] },
  { name: 'Plum 2% Niacinamide & Rice Water Gel Moisturizer', brand: 'Plum', category: 'Moisturizer', keyActives: ['Niacinamide 2%', 'Rice Water', 'Cactus Water'] },

  // Sunscreens
  { name: 'La Roche-Posay Anthelios UVmune 400 Invisible Fluid SPF 50+', brand: 'La Roche-Posay', category: 'Sunscreen', keyActives: ['Mexoryl 400', 'Netlock Technology'] },
  { name: 'Biore UV Aqua Rich Watery Essence SPF 50+ PA++++', brand: 'Biore', category: 'Sunscreen', keyActives: ['Hyaluronic Acid', 'Royal Jelly Extract'] },
  { name: 'Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+ PA++++', brand: 'Beauty of Joseon', category: 'Sunscreen', keyActives: ['Rice Extract 30%', 'Grain Probiotics'] },
  { name: 'Round Lab Birch Juice Moisturizing Sun Cream SPF 50+ PA++++', brand: 'Round Lab', category: 'Sunscreen', keyActives: ['Birch Tree Sap', 'Vita Hyaluronic Acid'] },
  { name: 'Skin1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF 50+', brand: 'Skin1004', category: 'Sunscreen', keyActives: ['Hyalu-Cica', 'Centella Asiatica'] },
  { name: 'Minimalist Light Fluid SPF 50 Sunscreen', brand: 'Minimalist', category: 'Sunscreen', keyActives: ['Uvinul A Plus', 'Avobenzone', 'Octocrylene'] },
  { name: 'Minimalist Invisible Sunscreen SPF 40', brand: 'Minimalist', category: 'Sunscreen', keyActives: ['Fucogel', 'Modern UV Filters'] },
  { name: 'Dr. Sheth\'s Ceramide & Vitamin C Sunscreen SPF 50+ PA+++', brand: 'Dr. Sheth\'s', category: 'Sunscreen', keyActives: ['Ceramides 1%', 'Vitamin C 2%', 'Zinc Oxide'] },
  { name: 'Dot & Key Watermelon Hyaluronic Cooling Sunscreen SPF 50', brand: 'Dot & Key', category: 'Sunscreen', keyActives: ['Watermelon Extract', 'Hyaluronic Acid'] },
  { name: 'Aqualogica Radiance+ Dewy Sunscreen SPF 50+ PA+++', brand: 'Aqualogica', category: 'Sunscreen', keyActives: ['Watermelon', 'Niacinamide', 'Hyaluronic Acid'] },
  { name: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 55', brand: 'Neutrogena', category: 'Sunscreen', keyActives: ['Helioplex', 'Dry-Touch Silica'] },
  { name: 'Supergoop! Unseen Sunscreen SPF 40', brand: 'Supergoop!', category: 'Sunscreen', keyActives: ['Red Algae', 'Frankincense', 'Meadowfoam'] },
  { name: 'EltaMD UV Clear Broad-Spectrum SPF 46', brand: 'EltaMD', category: 'Sunscreen', keyActives: ['Zinc Oxide 9%', 'Niacinamide 5%', 'Hyaluronic Acid'] },

  // Face Oils
  { name: 'The Ordinary 100% Organic Cold-Pressed Rose Hip Seed Oil', brand: 'The Ordinary', category: 'Face Oil', keyActives: ['Rose Hip Seed Oil', 'Pro-Vitamin A'] },
  { name: 'The Ordinary 100% Plant-Derived Squalane', brand: 'The Ordinary', category: 'Face Oil', keyActives: ['100% Plant Squalane'] },
  { name: 'Minimalist 100% Squalane Oil', brand: 'Minimalist', category: 'Face Oil', keyActives: ['Olive-derived Squalane'] },
  { name: 'Plum Grape Seed & Sea Buckthorn Glow-Restore Face Oil', brand: 'Plum', category: 'Face Oil', keyActives: ['Grape Seed Oil', 'Sea Buckthorn Oil'] },
];

/**
 * Fast search for products matching user typing.
 */
export function searchPopularProducts(query: string, maxResults = 8): CatalogProduct[] {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  const tokens = clean.split(/\s+/).filter(Boolean);

  const scored = POPULAR_PRODUCTS.map((prod) => {
    const haystack = `${prod.brand} ${prod.name} ${prod.category} ${(prod.keyActives || []).join(' ')}`.toLowerCase();
    let score = 0;

    // Exact name match
    if (prod.name.toLowerCase().startsWith(clean)) score += 50;
    else if (prod.brand.toLowerCase().startsWith(clean)) score += 40;
    else if (prod.name.toLowerCase().includes(clean)) score += 30;
    else if (prod.brand.toLowerCase().includes(clean)) score += 20;

    // Token match
    const tokenMatches = tokens.every((t) => haystack.includes(t));
    if (tokenMatches) score += 25;

    return { prod, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.prod);
}
