/**
 * Dashboard page — main landing page with profile overview.
 */

import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FolderKanban,
  Award,
  Code2,
  Briefcase,
  FileText,
  Pencil,
  Globe,
  GraduationCap,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { AIStatusBadge } from '../components/AIStatusBadge';
import { calculateProfileCompletion, getGreeting } from '../lib/utils';
import type { AIStatus } from '../types';

export function Dashboard() {
  const { profile, projects, experience, certifications, skills, achievements, education } =
    useProfile();
  const { aiStatus, aiLoading } = useOutletContext<{ aiStatus: AIStatus; aiLoading: boolean }>();

  const completion = calculateProfileCompletion(profile);
  const totalSkills = skills.reduce((sum, g) => sum + g.items.length, 0);
  const greeting = getGreeting();
  const name = profile.personalInfo.fullName || 'there';

  const stats = [
    {
      icon: FolderKanban,
      label: 'Projects',
      value: projects.length,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 dark:bg-blue-500/5',
    },
    {
      icon: Code2,
      label: 'Skills',
      value: totalSkills,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
    },
    {
      icon: Award,
      label: 'Certifications',
      value: certifications.length,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 dark:bg-amber-500/5',
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: experience.length,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 dark:bg-violet-500/5',
    },
    {
      icon: GraduationCap,
      label: 'Education',
      value: education.length,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 dark:bg-rose-500/5',
    },
    {
      icon: Trophy,
      label: 'Achievements',
      value: achievements.length,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 dark:bg-orange-500/5',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
          {greeting}, {name.split(' ')[0]}
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Here's your career profile overview.
        </p>
      </div>

      {/* Profile completion + AI Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Completion */}
        <div className="p-6 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wide">
              Your Career Profile
            </h2>
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{completion}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700 ease-out"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
            {completion === 100
              ? 'Your profile is complete!'
              : 'Add more information to improve your resume quality.'}
          </p>
        </div>

        {/* AI Status */}
        <div className="p-6 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wide mb-4">
            Local AI Status
          </h2>
          <AIStatusBadge status={aiStatus} loading={aiLoading} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="p-4 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 transition-all hover:shadow-sm"
          >
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-surface-900 dark:text-surface-50">{value}</div>
            <div className="text-xs text-surface-500 dark:text-surface-400 font-medium mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/resume"
          className="group p-6 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Generate Resume</h3>
          </div>
          <p className="text-sm text-brand-100">
            Paste a job description and let local AI tailor your resume.
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-brand-200 group-hover:text-white transition-colors">
            Get started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/vault"
          className="group p-6 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Pencil className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            </div>
            <h3 className="font-semibold text-lg text-surface-900 dark:text-surface-100">
              Edit Profile
            </h3>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Update your career information, add projects, and manage skills.
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            Open vault
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/portfolio"
          className="group p-6 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Globe className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            </div>
            <h3 className="font-semibold text-lg text-surface-900 dark:text-surface-100">
              View Portfolio
            </h3>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            See your automatically generated portfolio website.
          </p>
          <div className="flex items-center gap-1 mt-4 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            View portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
