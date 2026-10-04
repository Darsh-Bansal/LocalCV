/**
 * Privacy page — explains LocalCV's local-first architecture and privacy guarantees.
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Server,
  HardDrive,
  Lock,
  Cpu,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Terminal,
  Database,
  Eye,
  Radio,
  Trash2,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportProfile } from '../services/exportService';
import { clearAllData } from '../db/database';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';

export function Privacy() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async () => {
    try {
      await exportProfile();
      toast.success('Career profile exported to local JSON');
    } catch (err) {
      toast.error('Failed to export profile');
    }
  };

  const handleClear = async () => {
    try {
      await clearAllData();
      toast.success('All local career data deleted');
      setShowClearConfirm(false);
      window.location.reload();
    } catch (err) {
      toast.error('Failed to clear data');
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero-Exfiltration Architecture
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50">
          Privacy & Local-First Guarantees
        </h1>
        <p className="mt-2 text-base text-surface-600 dark:text-surface-400 leading-relaxed">
          Your career history documents every project, role, credential, and achievement you have
          ever worked for. That data belongs entirely on your computer — not on a cloud server.
        </p>
      </div>

      {/* Philosophy Statement Box */}
      <div className="rounded-2xl border-2 border-brand-500/30 bg-brand-500/5 dark:bg-brand-950/20 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-500" />
          The LocalCV Philosophy
        </h2>
        <div className="space-y-3 text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
          <p>
            <strong>LocalCV is local-first.</strong> Your career profile is stored directly in your
            browser's local database (IndexedDB via Dexie.js).
          </p>
          <p>
            When local AI is enabled, resume tailoring is performed through <strong>Ollama</strong>{' '}
            running directly on your machine.
          </p>
          <p>
            LocalCV does not require a cloud AI provider. There are no mandatory OpenAI, Anthropic, or
            Gemini cloud API keys. Your career data is <strong>never uploaded</strong> by LocalCV to
            any third-party cloud service.
          </p>
        </div>
      </div>

      {/* Comparison: LocalCV vs Typical Cloud Resume SaaS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
          How LocalCV Compares to Cloud Resume Builders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cloud SaaS */}
          <div className="p-6 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <XCircle className="w-5 h-5" />
              Standard Cloud Resume SaaS
            </div>
            <ul className="space-y-2.5 text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Requires mandatory account registration and email sign-in.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                All career history, resumes, and contact info saved in remote cloud databases.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Transmits career history over the internet to commercial AI APIs (OpenAI/Anthropic).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Subject to remote outages, data breaches, AI training terms, and subscription paywalls.
              </li>
            </ul>
          </div>

          {/* LocalCV */}
          <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              LocalCV (Local-First)
            </div>
            <ul className="space-y-2.5 text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                No accounts, passwords, or authentication required.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                100% of profile records stay in your local browser's IndexedDB.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                AI inference runs locally via Ollama and open weights (e.g. Gemma 3 4B).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Functions offline once initialized. Full ownership and export to JSON anytime.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-500" />
          Technical Data Flow
        </h2>

        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 font-mono text-xs text-surface-700 dark:text-surface-300 leading-relaxed overflow-x-auto">
          <pre>{`[ Your Browser (React SPA) ]
      │
      ├── IndexedDB (dexie) ──> Career Vault (Master data persists locally)
      │
      └── Local API Bridge (:3001) ──> Ollama Instance (:11434)
                                             │
                                             └── Gemma 3 4B Open Weights
                                                 (Inference executed on your local GPU/CPU)`}</pre>
        </div>

        <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
          At no point in this pipeline does any packet leave your local network (127.0.0.1).
          Even PDF generation is compiled client-side in your browser using canvas rendering.
        </p>
      </div>

      {/* Verify for yourself guide */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-500" />
          How to Verify Network Traffic Yourself
        </h2>

        <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
          You don't need to trust our claims — you can independently audit the application:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-surface-700 dark:text-surface-300">
          <li>
            Open Developer Tools in your browser (<kbd className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 border">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 border">Cmd+Option+I</kbd>).
          </li>
          <li>
            Switch to the <strong>Network</strong> tab.
          </li>
          <li>
            Click <strong>Generate Tailored Resume</strong> or edit your profile.
          </li>
          <li>
            Observe that every single HTTP request is addressed strictly to <code className="text-brand-500">localhost</code> or <code className="text-brand-500">127.0.0.1</code>.
          </li>
          <li>
            Disconnect your computer from Wi-Fi entirely. LocalCV will continue to load, view, and manage your vault without interruption.
          </li>
        </ol>
      </div>

      {/* Data Ownership & Controls */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-500" />
          Data Rights & Erasure
        </h2>

        <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
          Because your data exists purely on your device, you have immediate, irrevocable control over it:
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Complete Vault (JSON)
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Erase Local Database
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Wipe All Local Career Data?"
        message="This will permanently delete all personal information, experience, projects, skills, education, and certifications stored in your browser's IndexedDB. This action cannot be undone."
        confirmLabel="Erase Everything"
        isDestructive
        onConfirm={handleClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
