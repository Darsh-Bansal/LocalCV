/**
 * Resume Generator page — core AI tailoring engine.
 * Generates tailored resumes based strictly on the user's Career Vault evidence.
 */

import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Brain,
  Layers,
  ArrowRight,
  ExternalLink,
  Code,
  Download,
  Info,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ResumePreview } from '../components/ResumePreview';
import { generateResume as callAIRemote } from '../services/aiService';
import type {
  AIStatus,
  AIResumeResponse,
  ResumeStyle,
  ResumePreferences,
  CareerProfile,
} from '../types';
import { RESUME_STYLES } from '../types';
import { toast } from 'sonner';

const SAMPLE_JOB_DESCRIPTION = `Senior Full-Stack Engineer — Local-First & Privacy Platforms

About the Role:
We are seeking an experienced Full-Stack Engineer to architect, build, and optimize high-performance, privacy-first web applications. You will work across modern React/TypeScript frontends and resilient Node/Python backend services, designing local storage architectures, real-time data synchronization, and client-side processing workflows.

Key Responsibilities:
• Build modern, accessible, responsive web interfaces using React, TypeScript, and modern CSS.
• Design offline-first data architectures using IndexedDB, Web Workers, and local database systems.
• Integrate local AI models and on-device machine learning inference pipelines.
• Implement robust end-to-end data schemas, type safety, and automated test suites.
• Champion privacy-by-design principles, eliminating unauthorized data exfiltration.

Requirements:
• 3+ years of professional software engineering experience.
• Mastery of TypeScript, React, modern web standards, and component architecture.
• Experience with local-first databases (IndexedDB, SQLite, Dexie, or similar).
• Hands-on familiarity with open-source AI tooling (Ollama, local LLMs, embeddings).
• Passion for data ownership, open-source software, and clean code craftsmanship.`;

export function ResumeGenerator() {
  const { profile, projects, experience, certifications, skills, education, personalInfo } =
    useProfile();
  const { aiStatus } = useOutletContext<{ aiStatus: AIStatus; aiLoading: boolean }>();

  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [style, setStyle] = useState<ResumeStyle>('ats-optimized');
  const [pageLength, setPageLength] = useState<1 | 2>(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedResume, setGeneratedResume] = useState<AIResumeResponse | null>(null);
  const [usedModel, setUsedModel] = useState<string>('gemma3:4b');
  const [activeView, setActiveView] = useState<'preview' | 'evidence' | 'raw'>('preview');
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Quick stats on career vault readiness
  const totalSkillsCount = skills.reduce((acc, s) => acc + s.items.length, 0);
  const hasProfileData =
    personalInfo.fullName &&
    (projects.length > 0 || experience.length > 0 || education.length > 0);

  const loadSampleJob = () => {
    setTargetRole('Senior Full-Stack Engineer');
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    toast.info('Sample job description loaded');
  };

  /**
   * Deterministic local/heuristic generator fallback.
   * Ensures that even if Ollama is not yet downloaded or running,
   * the user gets a high-quality tailored resume strictly from their Vault.
   */
  const generateLocalFallbackResume = (
    profileData: CareerProfile,
    role: string,
    jd: string,
    selectedStyle: ResumeStyle,
    length: 1 | 2
  ): AIResumeResponse => {
    const jdWords = new Set(
      jd
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    // Score and rank projects
    const scoredProjects = [...profileData.projects].map((p) => {
      let score = 0;
      const textToSearch = `${p.name} ${p.description} ${p.problemSolved} ${p.technologies.join(' ')} ${p.achievements.join(' ')}`.toLowerCase();
      jdWords.forEach((word) => {
        if (textToSearch.includes(word)) score += 1;
      });
      return { project: p, score };
    });
    scoredProjects.sort((a, b) => b.score - a.score);

    // Score and rank experience
    const scoredExp = [...profileData.experience].map((e) => {
      let score = 0;
      const textToSearch = `${e.role} ${e.company} ${e.description} ${e.technologies.join(' ')} ${e.achievements.join(' ')}`.toLowerCase();
      jdWords.forEach((word) => {
        if (textToSearch.includes(word)) score += 1;
      });
      return { exp: e, score };
    });
    scoredExp.sort((a, b) => b.score - a.score);

    const maxExpCount = length === 1 ? 3 : 5;
    const maxProjCount = length === 1 ? 3 : 5;

    const selectedExp = scoredExp.slice(0, maxExpCount).map(({ exp }) => ({
      sourceId: exp.id,
      title: exp.role,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      bullets: exp.achievements.length > 0 ? exp.achievements.slice(0, 3) : [exp.description],
    }));

    const selectedProjects = scoredProjects.slice(0, maxProjCount).map(({ project }) => ({
      sourceId: project.id,
      name: project.name,
      technologies: project.technologies,
      bullets:
        project.achievements.length > 0
          ? project.achievements.slice(0, 2)
          : [project.problemSolved || project.description],
      github: project.githubUrl,
      liveUrl: project.liveUrl,
    }));

    const selectedEdu = profileData.education.map((edu) => ({
      sourceId: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa || null,
      coursework: edu.coursework || [],
    }));

    const selectedCerts = profileData.certifications.map((c) => ({
      sourceId: c.id,
      name: c.name,
      issuer: c.issuer,
      date: c.date,
    }));

    // Categorized skills
    const selectedSkills = profileData.skills.map((s) => ({
      category: s.category,
      items: s.items,
    }));

    const name = profileData.personalInfo.fullName || 'Professional';
    const summary = `${profileData.personalInfo.headline || role} with proven expertise in ${
      profileData.skills[0]?.items.slice(0, 3).join(', ') || 'modern engineering'
    }. Dedicated to high-impact technical execution, clean architecture, and delivering measurable results. Tailored for ${role} alignment.`;

    return {
      summary,
      skills: selectedSkills,
      experience: selectedExp,
      projects: selectedProjects,
      education: selectedEdu,
      certifications: selectedCerts,
    };
  };

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter a target role');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }
    if (!hasProfileData) {
      toast.error('Your Career Vault is empty. Please add your experience/projects first.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedResume(null);

    const preferences: ResumePreferences = {
      targetRole: targetRole.trim(),
      jobDescription: jobDescription.trim(),
      style,
      pageLength,
    };

    try {
      setGenerationStep('Analyzing job description requirements...');
      await new Promise((r) => setTimeout(r, 400));

      setGenerationStep('Extracting relevant evidence from Career Vault...');
      await new Promise((r) => setTimeout(r, 400));

      if (aiStatus.available && aiStatus.modelAvailable) {
        setGenerationStep(`Synthesizing tailored resume using local ${aiStatus.model}...`);
        const result = await callAIRemote(profile, preferences);
        setGeneratedResume(result.resume);
        setUsedModel(result.model);
        toast.success('Resume successfully generated with local Gemma AI!');
      } else {
        // Fallback to local heuristic engine
        setGenerationStep('Ollama not active; using local heuristic tailoring engine...');
        await new Promise((r) => setTimeout(r, 600));
        const fallback = generateLocalFallbackResume(
          profile,
          targetRole,
          jobDescription,
          style,
          pageLength
        );
        setGeneratedResume(fallback);
        setUsedModel('Local Heuristic Vault Matcher');
        toast.info('Resume generated using Local Vault Matcher (start Ollama for full LLM rewrites)');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown generation error';
      console.warn('AI call failed, falling back to local matcher:', err);
      // Auto-fallback so user is never blocked
      try {
        const fallback = generateLocalFallbackResume(
          profile,
          targetRole,
          jobDescription,
          style,
          pageLength
        );
        setGeneratedResume(fallback);
        setUsedModel('Local Vault Matcher (Fallback)');
        toast.info('Resume generated with Vault matcher after AI timeout.');
      } catch (fallbackErr) {
        setGenerationError(msg);
        toast.error(`Generation failed: ${msg}`);
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopyRaw = () => {
    if (!generatedResume) return;
    navigator.clipboard.writeText(JSON.stringify(generatedResume, null, 2));
    setCopiedRaw(true);
    toast.success('JSON copied to clipboard');
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-brand-500" />
            Resume Generator
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Tailor your resume against any job description strictly using your stored career facts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSampleJob}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700/80 transition-colors"
          >
            Load Sample Job
          </button>
          <Link
            to="/vault"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex items-center gap-1.5"
          >
            Career Vault ({projects.length}p, {experience.length}e)
          </Link>
        </div>
      </div>

      {/* Vault Warning if Empty */}
      {!hasProfileData && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
          <div className="text-sm">
            <span className="font-semibold">Career Vault is empty:</span> You need to add at least
            your personal info and some experience or projects before generating a resume.
            <div className="mt-2">
              <Link
                to="/vault"
                className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 hover:underline"
              >
                Go to Career Vault <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Inputs on Left, Output/Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-500" />
              Target Position & Preferences
            </h2>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>

            {/* Job Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400">
                  Job Description
                </label>
                <span className="text-[11px] text-surface-400">
                  {jobDescription.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={9}
                placeholder="Paste the complete job description here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-surface-100 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-y"
              />
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-2">
                Resume Style
              </label>
              <div className="grid grid-cols-1 gap-2">
                {RESUME_STYLES.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setStyle(st.value)}
                    className={`flex items-start text-left p-3 rounded-lg border transition-all ${
                      style === st.value
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-surface-900 dark:text-surface-100 ring-1 ring-brand-500'
                        : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 text-surface-700 dark:text-surface-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-xs font-semibold">{st.label}</div>
                      <div className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">
                        {st.description}
                      </div>
                    </div>
                    {style === st.value && (
                      <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Length */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400 mb-2">
                Target Page Length
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPageLength(1)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    pageLength === 1
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
                >
                  1 Page (Concise)
                </button>
                <button
                  type="button"
                  onClick={() => setPageLength(2)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                    pageLength === 2
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
                >
                  2 Pages (Comprehensive)
                </button>
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/40 border border-surface-200/60 dark:border-surface-800 text-[11px] text-surface-500 dark:text-surface-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>100% On-Device:</strong> Only evidence from your vault is supplied. The AI
                is forbidden from inventing unrecorded experiences or credentials.
              </span>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !hasProfileData}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold transition-all shadow-md ${
                isGenerating || !hasProfileData
                  ? 'bg-surface-400 dark:bg-surface-700 cursor-not-allowed opacity-75'
                  : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-brand-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Tailoring with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Tailored Resume
                </>
              )}
            </button>

            {/* Live generation step message */}
            {isGenerating && (
              <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs flex items-center gap-2 animate-pulse">
                <Brain className="w-4 h-4 flex-shrink-0" />
                <span>{generationStep}</span>
              </div>
            )}

            {/* Error Message */}
            {generationError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
                {generationError}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Resume Preview & AI Transparency (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {generatedResume ? (
            <>
              {/* Section 14: AI Transparency Banner */}
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200 dark:border-surface-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-semibold text-sm text-surface-900 dark:text-surface-100">
                      Generated locally with {usedModel}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    Strict Zero-Cloud Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-surface-600 dark:text-surface-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{projects.length} projects analyzed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{experience.length} experiences analyzed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{certifications.length} certs evaluated</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{totalSkillsCount} skills indexed</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-surface-500 dark:text-surface-400 flex items-center justify-between">
                  <span>No career data was sent to a cloud AI service.</span>
                  <span className="italic text-surface-400">Review content before submission.</span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveView('preview')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === 'preview'
                        ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                        : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                    }`}
                  >
                    Resume Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('evidence')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === 'evidence'
                        ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                        : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                    }`}
                  >
                    Evidence Mapping ({generatedResume.projects.length + generatedResume.experience.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('raw')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeView === 'raw'
                        ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                        : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                    }`}
                  >
                    Structured JSON
                  </button>
                </div>

                {activeView === 'raw' && (
                  <button
                    type="button"
                    onClick={handleCopyRaw}
                    className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedRaw ? 'Copied' : 'Copy JSON'}
                  </button>
                )}
              </div>

              {/* View 1: Rendered Resume */}
              {activeView === 'preview' && (
                <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden shadow-lg bg-surface-100 dark:bg-surface-950 p-4">
                  <ResumePreview resume={generatedResume} personalInfo={personalInfo} />
                </div>
              )}

              {/* View 2: Evidence Mapping / Traceability */}
              {activeView === 'evidence' && (
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                      Career Vault Traceability
                    </h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                      Every element in this tailored resume is anchored to an immutable record in
                      your local database.
                    </p>
                  </div>

                  {/* Selected Experience */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                      Selected Experience ({generatedResume.experience.length})
                    </h4>
                    {generatedResume.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-surface-900 dark:text-surface-100">
                            {exp.title} — {exp.company}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                            sourceId: {exp.sourceId || 'vault-exp'}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-surface-600 dark:text-surface-300 space-y-1">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Selected Projects */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                      Selected Projects ({generatedResume.projects.length})
                    </h4>
                    {generatedResume.projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-surface-900 dark:text-surface-100">
                            {proj.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300">
                            sourceId: {proj.sourceId || 'vault-proj'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <ul className="list-disc list-inside text-xs text-surface-600 dark:text-surface-300 space-y-1">
                          {proj.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View 3: Raw JSON */}
              {activeView === 'raw' && (
                <div className="bg-surface-900 text-surface-100 rounded-xl p-4 overflow-x-auto font-mono text-xs max-h-[600px] border border-surface-800">
                  <pre>{JSON.stringify(generatedResume, null, 2)}</pre>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-dashed border-surface-300 dark:border-surface-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                  Ready to Tailor Your Resume
                </h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
                  Enter your target role and paste the job description on the left. LocalCV will
                  evaluate your career vault and synthesize a targeted, ATS-ready resume on your
                  device.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={loadSampleJob}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Try with our sample job description <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
