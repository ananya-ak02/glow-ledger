export const SAFETY_DISCLAIMERS = {
  general:
    'This information is for educational purposes only and is not medical advice. Always patch test new products and consult a dermatologist for persistent skin concerns.',
  pregnancy:
    'Pregnancy safety flags are based on general guidelines. Always consult your OB-GYN or dermatologist before using any skincare product during pregnancy or breastfeeding.',
  aiGenerated:
    'Analysis is AI-generated from publicly available data. Accuracy is not guaranteed. Source links are provided for verification.',
  severeCondition:
    'Based on the severity of your concern, we strongly recommend consulting a board-certified dermatologist for personalized medical advice.',
  consent:
    'This app uses free-tier AI APIs that may process prompts for model improvement. We never send personal information (name, email, photos) to AI providers. For details, see our privacy section.',
} as const;

/** Conditions that trigger dermatologist referral */
export const DERM_REFERRAL_TRIGGERS = [
  'severe_acne',
  'cystic_acne',
  'sudden_reaction',
  'persistent_burning',
  'suspicious_mole',
  'widespread_rash',
  'skin_infection',
] as const;

/** Ingredients unsafe during pregnancy */
export const PREGNANCY_UNSAFE_INGREDIENTS = [
  {
    name: 'retinol',
    aliases: [
      'retinoid', 'retinoic acid', 'tretinoin', 'adapalene',
      'tazarotene', 'retinaldehyde', 'retinyl palmitate', 'retinal',
    ],
    reason:
      'Retinoids are linked to birth defects. Avoid all forms during pregnancy.',
  },
  {
    name: 'salicylic acid (high dose)',
    aliases: ['bha'],
    reason:
      'High-concentration salicylic acid (>2%) should be avoided. Low-dose facial products are generally considered safe — consult your doctor.',
  },
  {
    name: 'hydroquinone',
    aliases: [],
    reason: 'High absorption rate makes it risky during pregnancy.',
  },
  {
    name: 'benzoyl peroxide',
    aliases: [],
    reason: 'Limited safety data during pregnancy. Consult your doctor.',
  },
  {
    name: 'chemical sunscreen filters',
    aliases: ['oxybenzone', 'avobenzone', 'octinoxate', 'homosalate'],
    reason:
      'Some chemical UV filters have hormonal concerns. Mineral sunscreens (zinc oxide, titanium dioxide) are preferred.',
  },
  {
    name: 'formaldehyde',
    aliases: [
      'formalin', 'formaldehyde releasing preservatives',
      'dmdm hydantoin', 'imidazolidinyl urea',
      'diazolidinyl urea', 'quaternium-15',
    ],
    reason: 'Known carcinogen and irritant.',
  },
  {
    name: 'phthalates',
    aliases: ['diethyl phthalate', 'dep'],
    reason: 'Endocrine disruptors linked to developmental issues.',
  },
] as const;
