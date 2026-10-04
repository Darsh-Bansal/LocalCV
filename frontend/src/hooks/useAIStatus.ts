/**
 * AI status hook — periodically checks Ollama availability.
 */

import { useState, useEffect, useCallback } from 'react';
import type { AIStatus } from '../types';
import { checkAIStatus } from '../services/aiService';

export function useAIStatus(pollInterval: number = 30000) {
  const [status, setStatus] = useState<AIStatus>({
    available: false,
    model: 'gemma3:4b',
    modelAvailable: false,
    models: [],
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await checkAIStatus();
      setStatus(result);
    } catch {
      setStatus({
        available: false,
        model: 'gemma3:4b',
        modelAvailable: false,
        models: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, pollInterval);
    return () => clearInterval(interval);
  }, [refresh, pollInterval]);

  return { status, loading, refresh };
}
