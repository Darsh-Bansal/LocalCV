/**
 * AI service — communicates with the LocalCV backend for AI operations.
 */

import type { AIStatus, AIResumeResponse, CareerProfile, ResumePreferences } from '../types';

const API_BASE = '/api/ai';

/**
 * Check AI model availability.
 */
export async function checkAIStatus(): Promise<AIStatus> {
  try {
    const response = await fetch(`${API_BASE}/status`);
    if (!response.ok) {
      return { available: false, model: 'gemma3:4b', modelAvailable: false, models: [] };
    }
    return await response.json();
  } catch {
    return { available: false, model: 'gemma3:4b', modelAvailable: false, models: [] };
  }
}

/**
 * Generate a tailored resume using local AI.
 */
export async function generateResume(
  profile: CareerProfile,
  preferences: ResumePreferences,
): Promise<{
  resume: AIResumeResponse;
  model: string;
  retries: number;
}> {
  const response = await fetch(`${API_BASE}/generate-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile: JSON.stringify(profile, null, 2),
      jobDescription: preferences.jobDescription,
      targetRole: preferences.targetRole,
      style: preferences.style,
      pageLength: preferences.pageLength,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
}
