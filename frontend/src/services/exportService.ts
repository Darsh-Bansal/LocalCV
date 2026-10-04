/**
 * Export/Import service for career profile data.
 */

import type { CareerProfile, ProfileExport } from '../types';
import { getFullProfile, importProfile } from '../db/database';
import { downloadFile, readFileAsText } from '../lib/utils';

/**
 * Export the full profile as a JSON file.
 */
export async function exportProfile(): Promise<void> {
  const profile = await getFullProfile();

  const exportData: ProfileExport = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    application: 'LocalCV',
    profile,
  };

  const json = JSON.stringify(exportData, null, 2);
  const filename = `localcv-profile-${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(json, filename);
}

/**
 * Import a profile from a JSON file.
 * Validates the structure before importing.
 */
export async function importProfileFromFile(file: File): Promise<void> {
  const text = await readFileAsText(file);

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON file. Please select a valid LocalCV profile export.');
  }

  // Validate structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid file format.');
  }

  const exportData = data as Record<string, unknown>;

  // Support both direct profile and wrapped export format
  let profile: CareerProfile;

  if (exportData.application === 'LocalCV' && exportData.profile) {
    profile = exportData.profile as CareerProfile;
  } else if (exportData.personalInfo) {
    profile = exportData as unknown as CareerProfile;
  } else {
    throw new Error(
      'Invalid profile format. The file must be a LocalCV profile export or contain a valid career profile.'
    );
  }

  // Basic validation
  if (!profile.personalInfo || typeof profile.personalInfo !== 'object') {
    throw new Error('Profile is missing personal information.');
  }

  // Ensure arrays exist
  profile.education = profile.education || [];
  profile.experience = profile.experience || [];
  profile.projects = profile.projects || [];
  profile.certifications = profile.certifications || [];
  profile.skills = profile.skills || [];
  profile.achievements = profile.achievements || [];

  // Ensure personal info has an id
  if (!profile.personalInfo.id) {
    profile.personalInfo.id = 'personal';
  }

  await importProfile(profile);
}
