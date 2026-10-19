import { z } from 'zod';
import { MODEL_ROUTING, type ModelConfig, type AIProvider } from '@/config/models';
import { getBackoffDelay, sleep, truncateToTokenBudget } from '@/lib/utils';

interface CallAIOptions<T extends z.ZodTypeAny> {
  task: string;
  prompt: string;
  systemInstruction?: string;
  schema: T;
  fallbackMockGenerator?: () => z.infer<T>;
}

interface CallResult<T> {
  data: T;
  modelUsed: string;
  provider: AIProvider;
  isMock: boolean;
}

/**
 * Call Gemini REST API directly.
 */
async function callGemini(
  model: string,
  prompt: string,
  systemInstruction: string | undefined,
  apiKey: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: Record<string, unknown> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      responseMimeType: 'application/json',
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const textContent =
    result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('Gemini returned empty candidate content');
  }

  return textContent;
}

/**
 * Call Groq REST API (OpenAI-compatible) directly.
 */
async function callGroq(
  model: string,
  prompt: string,
  systemInstruction: string | undefined,
  apiKey: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const messages: { role: string; content: string }[] = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const textContent = result?.choices?.[0]?.message?.content;

  if (!textContent) {
    throw new Error('Groq returned empty completion content');
  }

  return textContent;
}

/**
 * Primary AI execution engine with exponential backoff and fallback routing.
 */
export async function callAI<T extends z.ZodTypeAny>({
  task,
  prompt,
  systemInstruction,
  schema,
  fallbackMockGenerator,
}: CallAIOptions<T>): Promise<CallResult<z.infer<T>>> {
  const routing = MODEL_ROUTING[task] || MODEL_ROUTING['routine_analysis'];
  const chain: ModelConfig[] = [routing.primary, ...routing.fallbacks];

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  // Trim prompt to task's token budget
  const trimmedPrompt = truncateToTokenBudget(prompt, routing.tokenBudget);

  // Attempt each model in the fallback chain
  for (let modelIndex = 0; modelIndex < chain.length; modelIndex++) {
    const config = chain[modelIndex];
    const apiKey = config.provider === 'gemini' ? geminiKey : groqKey;

    // Skip if provider key is not configured
    if (!apiKey || apiKey.startsWith('your-')) {
      continue;
    }

    // Retries with exponential backoff
    for (let attempt = 0; attempt <= routing.maxRetries; attempt++) {
      try {
        let rawText = '';
        if (config.provider === 'gemini') {
          rawText = await callGemini(
            config.modelId,
            trimmedPrompt,
            systemInstruction,
            apiKey,
            config.maxTokens,
            config.temperature
          );
        } else {
          rawText = await callGroq(
            config.modelId,
            trimmedPrompt,
            systemInstruction,
            apiKey,
            config.maxTokens,
            config.temperature
          );
        }

        // Clean JSON formatting if markdown fences exist
        const cleanedText = rawText
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '')
          .trim();

        const jsonParsed = JSON.parse(cleanedText);
        const validatedData = schema.parse(jsonParsed);

        return {
          data: validatedData,
          modelUsed: config.modelId,
          provider: config.provider,
          isMock: false,
        };
      } catch (err) {
        if (attempt < routing.maxRetries) {
          const delay = getBackoffDelay(attempt);
          await sleep(delay);
        }
      }
    }
  }

  // If all providers fail or are unconfigured, use deterministic fallback
  if (fallbackMockGenerator) {
    const mockData = fallbackMockGenerator();
    return {
      data: schema.parse(mockData),
      modelUsed: 'deterministic-rules-engine',
      provider: 'gemini',
      isMock: true,
    };
  }

  throw new Error(
    `All AI models in fallback chain for task "${task}" failed or are unconfigured.`
  );
}
