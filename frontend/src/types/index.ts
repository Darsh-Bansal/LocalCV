/**
 * Core type definitions for LocalCV.
 * All career data types used across the application.
 */

// ── Personal Information ──────────────────────────────────────────

export interface PersonalInfo {
  id: string;
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  otherLinks: LinkEntry[];
  summary: string;
}

export interface LinkEntry {
  label: string;
  url: string;
}

// ── Education ─────────────────────────────────────────────────────

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string[];
  description: string;
}

// ── Experience ────────────────────────────────────────────────────

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

// ── Projects ──────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  problemSolved: string;
  technologies: string[];
  achievements: string[];
  githubUrl: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
}

// ── Certifications ────────────────────────────────────────────────

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
  relevantSkills: string[];
}

// ── Skills ────────────────────────────────────────────────────────

export type SkillCategory =
  | 'Programming Languages'
  | 'Frameworks'
  | 'Libraries'
  | 'Databases'
  | 'Cloud'
  | 'AI/ML'
  | 'Data'
  | 'Tools'
  | 'Finance'
  | 'Other';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Frameworks',
  'Libraries',
  'Databases',
  'Cloud',
  'AI/ML',
  'Data',
  'Tools',
  'Finance',
  'Other',
];

export interface SkillGroup {
  id: string;
  category: SkillCategory;
  items: string[];
}

// ── Achievements ──────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
}

// ── Career Profile (aggregate) ────────────────────────────────────

export interface CareerProfile {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  skills: SkillGroup[];
  achievements: Achievement[];
}

// ── Resume Types ──────────────────────────────────────────────────

export type ResumeStyle =
  | 'ats-optimized'
  | 'technical'
  | 'balanced'
  | 'academic'
  | 'quantitative';

export const RESUME_STYLES: { value: ResumeStyle; label: string; description: string }[] = [
  { value: 'ats-optimized', label: 'ATS Optimized', description: 'Maximum compatibility with applicant tracking systems' },
  { value: 'technical', label: 'Technical', description: 'Emphasize technical skills and projects' },
  { value: 'balanced', label: 'Balanced', description: 'Well-rounded presentation of all qualifications' },
  { value: 'academic', label: 'Academic', description: 'Focus on education, research, and publications' },
  { value: 'quantitative', label: 'Quantitative / Finance', description: 'Highlight quantitative skills and analytical experience' },
];

export interface ResumePreferences {
  targetRole: string;
  jobDescription: string;
  style: ResumeStyle;
  pageLength: 1 | 2;
}

// ── AI Response Schema ────────────────────────────────────────────

export interface AIResumeResponse {
  summary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    sourceId: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  projects: {
    sourceId: string;
    name: string;
    technologies: string[];
    bullets: string[];
    github?: string | null;
    liveUrl?: string | null;
  }[];
  education: {
    sourceId: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string | null;
    coursework?: string[];
  }[];
  certifications: {
    sourceId: string;
    name: string;
    issuer: string;
    date: string;
  }[];
}

// ── AI Status ─────────────────────────────────────────────────────

export interface AIStatus {
  available: boolean;
  model: string;
  modelAvailable: boolean;
  models: string[];
}

// ── App Settings ──────────────────────────────────────────────────

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  hasCompletedOnboarding: boolean;
}

// ── Export/Import ─────────────────────────────────────────────────

export interface ProfileExport {
  version: string;
  exportDate: string;
  application: 'LocalCV';
  profile: CareerProfile;
}
