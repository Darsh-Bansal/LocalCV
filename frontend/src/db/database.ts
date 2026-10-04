/**
 * Dexie.js database definition for LocalCV.
 * All career data is stored locally in IndexedDB.
 */

import Dexie, { type Table } from 'dexie';
import type {
  PersonalInfo,
  Education,
  Experience,
  Project,
  Certification,
  SkillGroup,
  Achievement,
} from '../types';

export class LocalCVDatabase extends Dexie {
  personalInfo!: Table<PersonalInfo, string>;
  education!: Table<Education, string>;
  experience!: Table<Experience, string>;
  projects!: Table<Project, string>;
  certifications!: Table<Certification, string>;
  skills!: Table<SkillGroup, string>;
  achievements!: Table<Achievement, string>;

  constructor() {
    super('localcv');

    this.version(1).stores({
      personalInfo: 'id',
      education: 'id',
      experience: 'id',
      projects: 'id',
      certifications: 'id',
      skills: 'id, category',
      achievements: 'id',
    });
  }
}

export const db = new LocalCVDatabase();

/**
 * Get the complete career profile from IndexedDB.
 */
export async function getFullProfile() {
  const [personalInfoArr, education, experience, projects, certifications, skills, achievements] =
    await Promise.all([
      db.personalInfo.toArray(),
      db.education.toArray(),
      db.experience.toArray(),
      db.projects.toArray(),
      db.certifications.toArray(),
      db.skills.toArray(),
      db.achievements.toArray(),
    ]);

  const personalInfo: PersonalInfo = personalInfoArr[0] || {
    id: 'personal',
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    website: '',
    otherLinks: [],
    summary: '',
  };

  return {
    personalInfo,
    education,
    experience,
    projects,
    certifications,
    skills,
    achievements,
  };
}

/**
 * Clear all data from the database.
 */
export async function clearAllData() {
  await Promise.all([
    db.personalInfo.clear(),
    db.education.clear(),
    db.experience.clear(),
    db.projects.clear(),
    db.certifications.clear(),
    db.skills.clear(),
    db.achievements.clear(),
  ]);
}

/**
 * Import a full profile into the database.
 * Clears existing data first.
 */
export async function importProfile(profile: {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  skills: SkillGroup[];
  achievements: Achievement[];
}) {
  await clearAllData();

  await Promise.all([
    db.personalInfo.put(profile.personalInfo),
    ...(profile.education.length ? [db.education.bulkPut(profile.education)] : []),
    ...(profile.experience.length ? [db.experience.bulkPut(profile.experience)] : []),
    ...(profile.projects.length ? [db.projects.bulkPut(profile.projects)] : []),
    ...(profile.certifications.length ? [db.certifications.bulkPut(profile.certifications)] : []),
    ...(profile.skills.length ? [db.skills.bulkPut(profile.skills)] : []),
    ...(profile.achievements.length ? [db.achievements.bulkPut(profile.achievements)] : []),
  ]);
}
