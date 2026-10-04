/**
 * Settings page — AI model configuration, backup/restore, and demo data loader.
 */

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Cpu,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { checkAIStatus } from '../services/aiService';
import { exportProfile, importProfileFromFile } from '../services/exportService';
import { clearAllData, importProfile } from '../db/database';
import { generateDemoProfile } from '../db/demoData';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { AIStatus } from '../types';
import { toast } from 'sonner';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { aiStatus: initialAIStatus } = useOutletContext<{ aiStatus: AIStatus; aiLoading: boolean }>();

  const [aiStatus, setAIStatus] = useState<AIStatus>(initialAIStatus);
  const [testingAI, setTestingAI] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const testConnection = async () => {
    setTestingAI(true);
    try {
      const res = await checkAIStatus();
      setAIStatus(res);
      if (res.available && res.modelAvailable) {
        toast.success(`Connected to Ollama! Model ${res.model} is ready.`);
      } else if (res.available) {
        toast.warning(`Ollama is running, but ${res.model} is not yet downloaded.`);
      } else {
        toast.error('Ollama is not running. Please start it on localhost:11434');
      }
    } catch {
      toast.error('Could not reach backend AI bridge');
    } finally {
      setTestingAI(false);
    }
  };

  const copyPullCommand = () => {
    navigator.clipboard.writeText('ollama pull gemma3:4b');
    setCopiedCmd(true);
    toast.success('Copied: ollama pull gemma3:4b');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleExportData = async () => {
    try {
      await exportProfile();
      toast.success('Career profile exported to JSON');
    } catch (err) {
      toast.error('Failed to export profile');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importProfileFromFile(file);
      toast.success('Career profile imported successfully!');
      setTimeout(() => window.location.reload(), 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      toast.error(msg);
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleLoadDemo = async () => {
    try {
      await importProfile(generateDemoProfile());
      setShowDemoConfirm(false);
      toast.success('Sample demo profile loaded!');
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error('Failed to load demo profile');
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllData();
      setShowClearConfirm(false);
      toast.success('All local career data deleted');
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error('Failed to clear data');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50 flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-brand-500" />
          Settings & Data Management
        </h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Configure local AI inference, manage your profile backups, and adjust application preferences.
        </p>
      </div>

      {/* Section 1: Local AI Configuration */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-100">
                Local AI Inference Engine
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Powered by Ollama with Google's open-weights Gemma model on your machine.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={testConnection}
            disabled={testingAI}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-xs font-semibold text-surface-700 dark:text-surface-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingAI ? 'animate-spin' : ''}`} />
            Test Connection
          </button>
        </div>

        {/* Live Status Card */}
        <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {aiStatus.available && aiStatus.modelAvailable ? (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              ) : (
                <span className="inline-flex rounded-full h-3 w-3 bg-amber-500" />
              )}
              <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                {aiStatus.available && aiStatus.modelAvailable
                  ? 'Local AI Ready (Ollama Online)'
                  : aiStatus.available
                  ? 'Ollama Running (Model Missing)'
                  : 'Local AI Offline (Ollama Not Detected)'}
              </span>
            </div>

            <span className="text-xs font-mono text-surface-500 dark:text-surface-400">
              Default Target: {aiStatus.model || 'gemma3:4b'}
            </span>
          </div>

          {/* Model info or pull instructions */}
          {(!aiStatus.available || !aiStatus.modelAvailable) && (
            <div className="pt-2 border-t border-surface-200 dark:border-surface-700/60 space-y-3">
              <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                To enable local AI tailoring, install Ollama from{' '}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-500 hover:underline inline-flex items-center gap-0.5"
                >
                  ollama.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and run the following terminal command:
              </p>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-900 text-surface-100 font-mono text-xs">
                <span>ollama pull gemma3:4b</span>
                <button
                  type="button"
                  onClick={copyPullCommand}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {aiStatus.models && aiStatus.models.length > 0 && (
            <div className="pt-2 text-xs text-surface-500 dark:text-surface-400">
              <span className="font-semibold text-surface-700 dark:text-surface-300">
                Detected Installed Models:
              </span>{' '}
              {aiStatus.models.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Data Management (Demo Data, Export, Import, Wipe) */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-surface-200 dark:border-surface-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Career Vault Storage & Backup
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Manage your local IndexedDB records. Back up or restore your entire career profile anytime.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Load Demo Data */}
          <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                Sample Demo Profile
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                Load a realistic sample software engineer profile (Alex Morgan) to explore all
                features immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoConfirm(true)}
              className="w-full py-2 px-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-xs font-semibold text-surface-800 dark:text-surface-200 hover:bg-surface-100 transition-colors"
            >
              Load Demo Profile
            </button>
          </div>

          {/* Export Vault */}
          <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-500" />
                Export Career Vault
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                Download your complete profile as a formatted, portable JSON file to back up or move to another machine.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Export JSON Backup
            </button>
          </div>

          {/* Import Vault */}
          <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                Import Career Vault
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                Restore a previously exported LocalCV JSON file into your local database.
              </p>
            </div>
            <label className="w-full py-2 px-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-xs font-semibold text-center text-surface-800 dark:text-surface-200 hover:bg-surface-100 cursor-pointer transition-colors block">
              {isImporting ? 'Importing...' : 'Select JSON File'}
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>

          {/* Wipe Vault */}
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Erase All Career Data
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                Permanently purge all records from browser IndexedDB. Clean slate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-2 px-3 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
            >
              Wipe Database
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Appearance & Theme */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-surface-900 dark:text-surface-100">
          Appearance & Theme
        </h2>
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {[
            { value: 'light' as const, label: 'Light', icon: Sun },
            { value: 'dark' as const, label: 'Dark', icon: Moon },
            { value: 'system' as const, label: 'System', icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                theme === value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold ring-1 ring-brand-500'
                  : 'border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={showDemoConfirm}
        title="Load Sample Demo Profile?"
        message="This will replace current Career Vault data with realistic sample data for Alex Morgan (Full-Stack Engineer). You can export your current data first if you wish to keep it."
        confirmLabel="Load Demo Data"
        onConfirm={handleLoadDemo}
        onCancel={() => setShowDemoConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Wipe All Local Career Data?"
        message="This will permanently delete all records from IndexedDB. This action cannot be undone."
        confirmLabel="Erase Everything"
        isDestructive
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
