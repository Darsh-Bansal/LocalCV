/**
 * Profile hook — provides CRUD operations for career profile data.
 * Uses Dexie's useLiveQuery for reactive updates.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type {
  PersonalInfo,
  Education,
  Experience,
  Project,
  Certification,
  SkillGroup,
  Achievement,
  CareerProfile,
} from '../types';

const DEFAULT_PERSONAL_INFO: PersonalInfo = {
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

export function useProfile() {
  const personalInfo = useLiveQuery(
    () => db.personalInfo.get('personal'),
    [],
    DEFAULT_PERSONAL_INFO
  );

  const education = useLiveQuery(() => db.education.toArray(), [], []);
  const experience = useLiveQuery(() => db.experience.toArray(), [], []);
  const projects = useLiveQuery(() => db.projects.toArray(), [], []);
  const certifications = useLiveQuery(() => db.certifications.toArray(), [], []);
  const skills = useLiveQuery(() => db.skills.toArray(), [], []);
  const achievements = useLiveQuery(() => db.achievements.toArray(), [], []);

  const profile: CareerProfile = {
    personalInfo: personalInfo || DEFAULT_PERSONAL_INFO,
    education: education || [],
    experience: experience || [],
    projects: projects || [],
    certifications: certifications || [],
    skills: skills || [],
    achievements: achievements || [],
  };

  // ── Personal Info ────────────────────────────────────────────

  const savePersonalInfo = async (info: PersonalInfo) => {
    await db.personalInfo.put({ ...info, id: 'personal' });
  };

  // ── Education ────────────────────────────────────────────────

  const addEducation = async (entry: Education) => {
    await db.education.put(entry);
  };

  const updateEducation = async (entry: Education) => {
    await db.education.put(entry);
  };

  const deleteEducation = async (id: string) => {
    await db.education.delete(id);
  };

  // ── Experience ───────────────────────────────────────────────

  const addExperience = async (entry: Experience) => {
    await db.experience.put(entry);
  };

  const updateExperience = async (entry: Experience) => {
    await db.experience.put(entry);
  };

  const deleteExperience = async (id: string) => {
    await db.experience.delete(id);
  };

  // ── Projects ─────────────────────────────────────────────────

  const addProject = async (entry: Project) => {
    await db.projects.put(entry);
  };

  const updateProject = async (entry: Project) => {
    await db.projects.put(entry);
  };

  const deleteProject = async (id: string) => {
    await db.projects.delete(id);
  };

  // ── Certifications ───────────────────────────────────────────

  const addCertification = async (entry: Certification) => {
    await db.certifications.put(entry);
  };

  const updateCertification = async (entry: Certification) => {
    await db.certifications.put(entry);
  };

  const deleteCertification = async (id: string) => {
    await db.certifications.delete(id);
  };

  // ── Skills ───────────────────────────────────────────────────

  const addSkillGroup = async (entry: SkillGroup) => {
    await db.skills.put(entry);
  };

  const updateSkillGroup = async (entry: SkillGroup) => {
    await db.skills.put(entry);
  };

  const deleteSkillGroup = async (id: string) => {
    await db.skills.delete(id);
  };

  // ── Achievements ─────────────────────────────────────────────

  const addAchievement = async (entry: Achievement) => {
    await db.achievements.put(entry);
  };

  const updateAchievement = async (entry: Achievement) => {
    await db.achievements.put(entry);
  };

  const deleteAchievement = async (id: string) => {
    await db.achievements.delete(id);
  };

  return {
    profile,
    personalInfo: personalInfo || DEFAULT_PERSONAL_INFO,
    education: education || [],
    experience: experience || [],
    projects: projects || [],
    certifications: certifications || [],
    skills: skills || [],
    achievements: achievements || [],
    savePersonalInfo,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addSkillGroup,
    updateSkillGroup,
    deleteSkillGroup,
    addAchievement,
    updateAchievement,
    deleteAchievement,
  };
}
