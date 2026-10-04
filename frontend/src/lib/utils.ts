/**
 * Utility functions for LocalCV.
 */

/**
 * Simple className merger (no clsx dependency needed).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string (YYYY-MM or YYYY-MM-DD) to readable format.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'present') return 'Present';

  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthIndex = parseInt(parts[1]!, 10) - 1;
  const month = months[monthIndex] || parts[1];
  return `${month} ${parts[0]}`;
}

/**
 * Calculate profile completion percentage.
 */
export function calculateProfileCompletion(profile: {
  personalInfo: { fullName: string; headline: string; email: string; summary: string };
  education: unknown[];
  experience: unknown[];
  projects: unknown[];
  certifications: unknown[];
  skills: unknown[];
  achievements: unknown[];
}): number {
  let score = 0;
  const total = 10;

  if (profile.personalInfo.fullName) score++;
  if (profile.personalInfo.headline) score++;
  if (profile.personalInfo.email) score++;
  if (profile.personalInfo.summary) score++;
  if (profile.education.length > 0) score++;
  if (profile.experience.length > 0) score++;
  if (profile.projects.length > 0) score++;
  if (profile.certifications.length > 0) score++;
  if (profile.skills.length > 0) score++;
  if (profile.achievements.length > 0) score++;

  return Math.round((score / total) * 100);
}

/**
 * Get a greeting based on time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Download a string as a file.
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read a file as text.
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Sanitize text to prevent XSS.
 */
export function sanitizeText(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
