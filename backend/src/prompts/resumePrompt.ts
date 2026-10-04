/**
 * Resume tailoring prompt templates.
 * 
 * These prompts enforce the no-fabrication constraint:
 * The AI can only select, reorder, rewrite, and emphasize
 * information that already exists in the user's career profile.
 */

export const SYSTEM_PROMPT = `You are a resume tailoring engine.

The career profile supplied by the user is the ONLY source of factual information.

You MUST NOT invent:
- employers
- job titles
- projects
- degrees
- certifications
- technologies
- skills
- metrics
- achievements
- dates
- responsibilities
- links

You may:
- select relevant information
- reorder information
- shorten information
- rewrite existing descriptions to be more impactful
- improve wording
- emphasize relevance to the target role
- rephrase achievements using action verbs

Every factual statement in the generated resume must be traceable to information contained in the career profile.

If information needed by the job description does not exist in the profile, do not fabricate it.

Return ONLY valid JSON matching the provided schema. No markdown, no code fences, no explanation.`;

export function buildResumePrompt(params: {
  profile: string;
  jobDescription: string;
  targetRole: string;
  style: string;
  pageLength: number;
}): string {
  const { profile, jobDescription, targetRole, style, pageLength } = params;

  const bulletCount = pageLength === 1 ? '2-3' : '3-5';
  const projectCount = pageLength === 1 ? '2-3' : '3-5';
  const experienceNote = pageLength === 1
    ? 'Include only the most relevant experiences. Be concise.'
    : 'Include all relevant experiences with detailed bullets.';

  return `
## TASK

Analyze the following job description and career profile. Select the most relevant information from the career profile to create a tailored resume for the target role.

## TARGET ROLE

${targetRole}

## RESUME STYLE

${style}

## RESUME LENGTH

${pageLength} page(s). ${experienceNote}

## JOB DESCRIPTION

${jobDescription}

## CAREER PROFILE (ONLY SOURCE OF TRUTH)

${profile}

## INSTRUCTIONS

1. Analyze the job description to identify key requirements, skills, and qualifications.
2. From the career profile ONLY, select the most relevant:
   - Skills (matching job requirements)
   - Experiences (most relevant roles)
   - Projects (demonstrating required skills)
   - Education (relevant degrees/coursework)
   - Certifications (relevant to the role)
3. Write a concise professional summary (2-3 sentences) tailored to the target role, using ONLY facts from the profile.
4. For each experience, write ${bulletCount} achievement-oriented bullet points using action verbs. Every bullet must be based on information in the profile.
5. For each project, write ${bulletCount} bullets describing what was built and the impact, using ONLY information from the profile.
6. Select up to ${projectCount} most relevant projects.

## OUTPUT SCHEMA

Return a JSON object with exactly this structure:

{
  "summary": "Professional summary string",
  "skills": [
    {
      "category": "Category name",
      "items": ["skill1", "skill2"]
    }
  ],
  "experience": [
    {
      "sourceId": "the id field from the profile experience entry",
      "title": "Job title from profile",
      "company": "Company from profile",
      "location": "Location from profile",
      "startDate": "Start date from profile",
      "endDate": "End date from profile or Present",
      "bullets": ["Achievement bullet 1", "Achievement bullet 2"]
    }
  ],
  "projects": [
    {
      "sourceId": "the id field from the profile project entry",
      "name": "Project name from profile",
      "technologies": ["tech1", "tech2"],
      "bullets": ["Description bullet 1", "Description bullet 2"],
      "github": "GitHub URL from profile or null",
      "liveUrl": "Live URL from profile or null"
    }
  ],
  "education": [
    {
      "sourceId": "the id field from the profile education entry",
      "institution": "Institution from profile",
      "degree": "Degree from profile",
      "field": "Field from profile",
      "startDate": "Start date",
      "endDate": "End date",
      "gpa": "GPA if available or null",
      "coursework": ["relevant course 1", "relevant course 2"]
    }
  ],
  "certifications": [
    {
      "sourceId": "the id field from the profile certification entry",
      "name": "Certification name from profile",
      "issuer": "Issuer from profile",
      "date": "Date from profile"
    }
  ]
}

Return ONLY the JSON object. No markdown fences, no explanation, no additional text.`;
}
