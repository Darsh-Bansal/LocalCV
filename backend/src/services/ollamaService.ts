/**
 * Ollama service — communicates with a locally running Ollama instance.
 * 
 * Default model: gemma3:4b
 * The model can be changed via the OLLAMA_MODEL environment variable.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'gemma3:4b';

export interface OllamaGenerateRequest {
  model: string;
  system: string;
  prompt: string;
  stream: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
  };
  format?: 'json';
}

export interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  eval_count?: number;
}

/**
 * Check if Ollama is running and the model is available.
 */
export async function checkOllamaStatus(): Promise<{
  available: boolean;
  model: string;
  modelAvailable: boolean;
  models: string[];
}> {
  const model = DEFAULT_MODEL;

  try {
    // Check if Ollama is running
    const tagsResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!tagsResponse.ok) {
      return { available: false, model, modelAvailable: false, models: [] };
    }

    const tagsData = await tagsResponse.json() as { models?: Array<{ name: string }> };
    const models = (tagsData.models || []).map((m: { name: string }) => m.name);
    const modelAvailable = models.some(
      (m: string) => m === model || m.startsWith(model.split(':')[0])
    );

    return { available: true, model, modelAvailable, models };
  } catch {
    return { available: false, model, modelAvailable: false, models: [] };
  }
}

/**
 * Generate a response from Ollama.
 */
export async function generate(
  system: string,
  prompt: string,
  model?: string
): Promise<string> {
  const selectedModel = model || DEFAULT_MODEL;

  const requestBody: OllamaGenerateRequest = {
    model: selectedModel,
    system,
    prompt,
    stream: false,
    format: 'json',
    options: {
      temperature: 0.3,
      top_p: 0.9,
      num_predict: 4096,
    },
  };

  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(300000), // 5 minute timeout
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as OllamaGenerateResponse;
  return data.response;
}

/**
 * Parse and validate JSON from the model response.
 * Handles common issues like markdown fences around JSON.
 */
export function parseModelJSON(raw: string): unknown {
  let cleaned = raw.trim();

  // Remove markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }

  cleaned = cleaned.trim();

  // Try to extract JSON object if there's extra text
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }

  return JSON.parse(cleaned);
}
