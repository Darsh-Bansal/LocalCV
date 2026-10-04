import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  calculateProfileCompletion,
  truncate,
  sanitizeText,
} from '../lib/utils';
import { generateDemoProfile } from '../db/demoData';

describe('Utility Functions', () => {
  it('cn merges class names properly and filters falsy values', () => {
    expect(cn('class1', false && 'class2', 'class3', null, undefined)).toBe('class1 class3');
  });

  it('formatDate formats YYYY-MM dates cleanly', () => {
    expect(formatDate('2023-05')).toBe('May 2023');
    expect(formatDate('2024-01-15')).toBe('Jan 2024');
    expect(formatDate('present')).toBe('Present');
    expect(formatDate('')).toBe('');
  });

  it('truncate trims long strings with ellipsis', () => {
    expect(truncate('Hello world', 5)).toBe('Hello…');
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('calculateProfileCompletion accurately computes score', () => {
    const demo = generateDemoProfile();
    const score = calculateProfileCompletion(demo);
    expect(score).toBe(100);

    const empty = {
      personalInfo: { fullName: '', headline: '', email: '', summary: '' },
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      skills: [],
      achievements: [],
    };
    expect(calculateProfileCompletion(empty)).toBe(0);
  });
});

describe('Demo Profile Integrity', () => {
  it('generateDemoProfile returns complete career records', () => {
    const demo = generateDemoProfile();
    expect(demo.personalInfo.fullName).toBe('Alex Chen');
    expect(demo.projects.length).toBeGreaterThan(0);
    expect(demo.experience.length).toBeGreaterThan(0);
    expect(demo.education.length).toBeGreaterThan(0);
    expect(demo.skills.length).toBeGreaterThan(0);
    expect(demo.certifications.length).toBeGreaterThan(0);
  });
});
