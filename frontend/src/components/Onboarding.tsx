/**
 * Onboarding flow — shown on first launch.
 */

import React, { useState, useRef } from 'react';
import { Shield, Sparkles, Cpu, ArrowRight, ArrowLeft, Upload, Briefcase } from 'lucide-react';
import { db } from '../db/database';
import { importProfileFromFile } from '../services/exportService';
import { importProfile } from '../db/database';
import { generateDemoProfile } from '../db/demoData';
import { toast } from 'sonner';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartFresh = async () => {
    await db.personalInfo.put({
      id: 'personal',
      fullName: name,
      headline,
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
      website: '',
      otherLinks: [],
      summary: '',
    });
    localStorage.setItem('localcv-onboarded', 'true');
    onComplete();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      await importProfileFromFile(file);
      localStorage.setItem('localcv-onboarded', 'true');
      toast.success('Profile imported successfully!');
      onComplete();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to import profile');
    } finally {
      setImporting(false);
    }
  };

  const handleLoadDemo = async () => {
    const demo = generateDemoProfile();
    await importProfile(demo);
    localStorage.setItem('localcv-onboarded', 'true');
    toast.success('Demo profile loaded!');
    onComplete();
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="text-center space-y-8 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25">
        <Briefcase className="w-10 h-10 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">
          Welcome to Local<span className="text-brand-500">CV</span>
        </h1>
        <p className="mt-3 text-lg text-surface-500 dark:text-surface-400 max-w-md mx-auto">
          Your career data stays on your computer.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[
          { icon: Shield, label: 'No account required' },
          { icon: Sparkles, label: 'No cloud database' },
          { icon: Cpu, label: 'No mandatory API key' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700"
          >
            <Icon className="w-5 h-5 text-brand-500 mx-auto mb-2" />
            <p className="text-xs text-surface-600 dark:text-surface-400 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>,

    // Step 1: Name
    <div key="name" className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Tell us about yourself</h2>
        <p className="mt-2 text-surface-500 dark:text-surface-400">This information stays on your device.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Chen"
            className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Professional Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Full-Stack Software Engineer"
            className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
          />
        </div>
      </div>
    </div>,

    // Step 2: Import or start
    <div key="import" className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Get started</h2>
        <p className="mt-2 text-surface-500 dark:text-surface-400">Choose how you'd like to begin.</p>
      </div>
      <div className="max-w-sm mx-auto space-y-3">
        <button
          onClick={handleStartFresh}
          className="w-full p-4 rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-left transition-all hover:shadow-md"
        >
          <div className="font-semibold text-brand-700 dark:text-brand-400">Start From Scratch</div>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Build your profile step by step.</p>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="w-full p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-left transition-all hover:shadow-md hover:border-surface-300 dark:hover:border-surface-600"
        >
          <div className="flex items-center gap-2 font-semibold text-surface-900 dark:text-surface-100">
            <Upload className="w-4 h-4" />
            Import Existing Profile
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Import a previously exported LocalCV profile.
          </p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <button
          onClick={handleLoadDemo}
          className="w-full p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-left transition-all hover:shadow-md hover:border-surface-300 dark:hover:border-surface-600"
        >
          <div className="flex items-center gap-2 font-semibold text-surface-900 dark:text-surface-100">
            <Sparkles className="w-4 h-4" />
            Load Demo Profile
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            See LocalCV in action with sample data.
          </p>
        </button>
      </div>
    </div>,

    // Step 3: AI info
    <div key="ai" className="space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 mx-auto flex items-center justify-center shadow-lg shadow-violet-500/25 mb-6">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Local AI</h2>
        <p className="mt-3 text-surface-500 dark:text-surface-400 max-w-md mx-auto">
          LocalCV uses <strong className="text-surface-700 dark:text-surface-200">Gemma</strong> through{' '}
          <strong className="text-surface-700 dark:text-surface-200">Ollama</strong> to tailor resumes
          without sending your career data to a remote AI service.
        </p>
      </div>
      <div className="max-w-md mx-auto space-y-3">
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            To enable AI features, install Ollama and run:
          </p>
          <code className="block mt-2 px-3 py-2 rounded-lg bg-surface-100 dark:bg-surface-900 font-mono text-sm text-surface-800 dark:text-surface-200">
            ollama pull gemma3:4b
          </code>
        </div>
        <p className="text-xs text-center text-surface-400 dark:text-surface-500">
          AI features are optional. The rest of LocalCV works without Ollama.
        </p>
      </div>
    </div>,
  ];

  const isLastStep = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex gap-2 justify-center mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step
                  ? 'w-8 bg-brand-500'
                  : 'w-4 bg-surface-200 dark:bg-surface-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        {steps[step]}

        {/* Navigation */}
        <div className="flex justify-between mt-12 max-w-sm mx-auto">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 2 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isLastStep && (
            <button
              onClick={() => {
                localStorage.setItem('localcv-onboarded', 'true');
                onComplete();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
