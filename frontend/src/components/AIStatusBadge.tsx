/**
 * AI Status indicator component.
 * Shows whether Ollama + Gemma are available.
 */

import React from 'react';
import { Cpu, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { AIStatus } from '../types';

interface AIStatusBadgeProps {
  status: AIStatus;
  loading: boolean;
  compact?: boolean;
}

export function AIStatusBadge({ status, loading, compact = false }: AIStatusBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {!compact && <span>Checking AI...</span>}
      </div>
    );
  }

  if (status.available && status.modelAvailable) {
    return (
      <div className={`flex items-center gap-2 ${compact ? '' : 'p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20'}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Local AI Ready
          </span>
        </div>
        {!compact && (
          <div className="ml-auto text-xs text-surface-500 dark:text-surface-400">
            {status.model} · Ollama
          </div>
        )}
      </div>
    );
  }

  if (status.available && !status.modelAvailable) {
    return (
      <div className={`flex flex-col gap-1.5 ${compact ? '' : 'p-3 rounded-lg bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20'}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
            Model Not Found
          </span>
        </div>
        {!compact && (
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Run: <code className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-mono">ollama pull {status.model}</code>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${compact ? '' : 'p-3 rounded-lg bg-surface-100 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700'}`}>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-surface-400" />
        <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
          Local AI Offline
        </span>
      </div>
      {!compact && (
        <div className="text-xs text-surface-500 dark:text-surface-400 space-y-1">
          <p>Install Ollama and run:</p>
          <code className="block px-2 py-1 rounded bg-surface-100 dark:bg-surface-800 font-mono">
            ollama pull {status.model}
          </code>
        </div>
      )}
    </div>
  );
}
