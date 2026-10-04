import { Router, Request, Response } from 'express';
import { checkOllamaStatus, generate, parseModelJSON } from '../services/ollamaService.js';
import { SYSTEM_PROMPT, buildResumePrompt } from '../prompts/resumePrompt.js';

const router = Router();

/**
 * GET /api/ai/status
 * Check Ollama availability and model status.
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await checkOllamaStatus();
    res.json(status);
  } catch (error) {
    res.json({
      available: false,
      model: 'gemma3:4b',
      modelAvailable: false,
      models: [],
    });
  }
});

/**
 * POST /api/ai/generate-resume
 * Generate a tailored resume from career profile + job description.
 */
router.post('/generate-resume', async (req: Request, res: Response) => {
  try {
    const { profile, jobDescription, targetRole, style, pageLength } = req.body;

    // Validate required fields
    if (!profile || !jobDescription || !targetRole) {
      res.status(400).json({
        error: 'Missing required fields: profile, jobDescription, targetRole',
      });
      return;
    }

    // Check Ollama availability
    const status = await checkOllamaStatus();
    if (!status.available) {
      res.status(503).json({
        error: 'Ollama is not running. Please start Ollama and try again.',
        code: 'OLLAMA_UNAVAILABLE',
      });
      return;
    }

    if (!status.modelAvailable) {
      res.status(503).json({
        error: `Model ${status.model} is not available. Run: ollama pull ${status.model}`,
        code: 'MODEL_UNAVAILABLE',
      });
      return;
    }

    // Build the prompt
    const profileStr = typeof profile === 'string' ? profile : JSON.stringify(profile, null, 2);
    const prompt = buildResumePrompt({
      profile: profileStr,
      jobDescription,
      targetRole,
      style: style || 'balanced',
      pageLength: pageLength || 1,
    });

    // Generate with retry logic
    let lastError: Error | null = null;
    const MAX_RETRIES = 2;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const raw = await generate(SYSTEM_PROMPT, prompt);
        const parsed = parseModelJSON(raw);

        // Basic validation
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('AI response is not a valid object');
        }

        const resume = parsed as Record<string, unknown>;
        if (!resume.summary && !resume.experience && !resume.projects) {
          throw new Error('AI response is missing expected fields');
        }

        res.json({
          resume: parsed,
          model: status.model,
          retries: attempt,
        });
        return;
      } catch (parseError) {
        lastError = parseError instanceof Error ? parseError : new Error(String(parseError));
        if (attempt < MAX_RETRIES) {
          continue; // Retry
        }
      }
    }

    res.status(500).json({
      error: 'Failed to generate a valid resume after multiple attempts. The AI model produced an invalid response.',
      code: 'GENERATION_FAILED',
      details: lastError?.message,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: `Resume generation failed: ${message}`,
      code: 'INTERNAL_ERROR',
    });
  }
});

export default router;
