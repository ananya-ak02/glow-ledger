// Model routing table — swap models without code changes
// Tasks route to primary model with fallback chain

export type AIProvider = 'gemini' | 'groq';

export interface ModelConfig {
  provider: AIProvider;
  modelId: string;
  maxTokens: number;
  temperature: number;
}

export interface TaskRouting {
  task: string;
  description: string;
  primary: ModelConfig;
  fallbacks: ModelConfig[];
  maxRetries: number;
  /** Max input tokens to send (rough budget) */
  tokenBudget: number;
}

// ─── Model Presets ───────────────────────────────────────

export const GEMINI_FLASH: ModelConfig = {
  provider: 'gemini',
  modelId: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  maxTokens: 2048,
  temperature: 0.3,
};

export const GEMINI_FLASH_BACKUP: ModelConfig = {
  provider: 'gemini',
  modelId: 'gemini-3.5-flash-lite',
  maxTokens: 2048,
  temperature: 0.3,
};

export const GEMINI_FLASH_LITE: ModelConfig = {
  provider: 'gemini',
  modelId: process.env.GEMINI_LITE_MODEL || 'gemini-3.5-flash-lite',
  maxTokens: 1024,
  temperature: 0.2,
};

export const GROQ_LLAMA: ModelConfig = {
  provider: 'groq',
  modelId: 'llama-3.3-70b-versatile',
  maxTokens: 2048,
  temperature: 0.3,
};

// ─── Task → Model Routing ────────────────────────────────

export const MODEL_ROUTING: Record<string, TaskRouting> = {
  ingredient_extraction: {
    task: 'ingredient_extraction',
    description: 'Extract and classify ingredients from product text',
    primary: GROQ_LLAMA,
    fallbacks: [GEMINI_FLASH_LITE, GEMINI_FLASH],
    maxRetries: 3,
    tokenBudget: 2000,
  },
  classification: {
    task: 'classification',
    description: 'Classify product category and type',
    primary: GROQ_LLAMA,
    fallbacks: [GEMINI_FLASH_LITE, GEMINI_FLASH],
    maxRetries: 3,
    tokenBudget: 1500,
  },
  routine_analysis: {
    task: 'routine_analysis',
    description: 'Analyze skincare routine for issues and improvements',
    primary: GEMINI_FLASH,
    fallbacks: [GEMINI_FLASH_BACKUP, GROQ_LLAMA],
    maxRetries: 2,
    tokenBudget: 4000,
  },
  product_synthesis: {
    task: 'product_synthesis',
    description: 'Synthesize research data into product verdict',
    primary: GEMINI_FLASH,
    fallbacks: [GEMINI_FLASH_BACKUP, GROQ_LLAMA],
    maxRetries: 2,
    tokenBudget: 6000,
  },
  personalization: {
    task: 'personalization',
    description: 'Personalize shared report for specific user profile',
    primary: GEMINI_FLASH_LITE,
    fallbacks: [GEMINI_FLASH, GROQ_LLAMA],
    maxRetries: 2,
    tokenBudget: 3000,
  },
};
