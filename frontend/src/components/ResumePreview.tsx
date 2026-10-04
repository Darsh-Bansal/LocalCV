/**
 * Resume preview component — renders the AI-generated resume
 * using React, not AI-generated HTML.
 */

import React, { useRef } from 'react';
import { Download, Printer, ExternalLink, Github } from 'lucide-react';
import type { AIResumeResponse, PersonalInfo } from '../types';
import { generatePDF } from '../services/pdfService';
import { toast } from 'sonner';

interface ResumePreviewProps {
  resume: AIResumeResponse;
  personalInfo: PersonalInfo;
}

export function ResumePreview({ resume, personalInfo }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      const filename = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
      await generatePDF(resumeRef.current, filename);
      toast.success('Resume downloaded as PDF!');
    } catch (err) {
      toast.error('Failed to generate PDF. Try using the print option instead.');
      console.error('PDF generation error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Actions */}
      <div className="flex gap-3 mb-6 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Resume Document */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-surface-200 print:shadow-none print:border-none print:rounded-none">
        <div ref={resumeRef} className="p-8 md:p-12 max-w-[8.5in] mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          {/* Header */}
          <header className="text-center mb-6 pb-4 border-b-2 border-surface-900">
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
              {personalInfo.fullName}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-sm text-surface-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && (
                <>
                  <span className="text-surface-300">|</span>
                  <span>{personalInfo.phone}</span>
                </>
              )}
              {personalInfo.location && (
                <>
                  <span className="text-surface-300">|</span>
                  <span>{personalInfo.location}</span>
                </>
              )}
              {personalInfo.linkedin && (
                <>
                  <span className="text-surface-300">|</span>
                  <span>LinkedIn</span>
                </>
              )}
              {personalInfo.github && (
                <>
                  <span className="text-surface-300">|</span>
                  <span>GitHub</span>
                </>
              )}
              {personalInfo.website && (
                <>
                  <span className="text-surface-300">|</span>
                  <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                </>
              )}
            </div>
          </header>

          {/* Summary */}
          {resume.summary && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2 border-b border-surface-300 pb-1">
                Summary
              </h2>
              <p className="text-sm text-surface-700 leading-relaxed">{resume.summary}</p>
            </section>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2 border-b border-surface-300 pb-1">
                Technical Skills
              </h2>
              <div className="space-y-1">
                {resume.skills.map((group, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold text-surface-800">{group.category}: </span>
                    <span className="text-surface-700">{group.items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2 border-b border-surface-300 pb-1">
                Experience
              </h2>
              <div className="space-y-4">
                {resume.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold text-sm text-surface-900">{exp.title}</span>
                        <span className="text-sm text-surface-600"> · {exp.company}</span>
                      </div>
                      <span className="text-xs text-surface-500 whitespace-nowrap ml-4">
                        {exp.startDate} – {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-xs text-surface-500">{exp.location}</div>
                    )}
                    <ul className="mt-1.5 space-y-1">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-surface-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-surface-400">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2 border-b border-surface-300 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {resume.projects.map((project, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-surface-900">{project.name}</span>
                      {project.technologies && project.technologies.length > 0 && (
                        <span className="text-xs text-surface-500">
                          ({project.technologies.join(', ')})
                        </span>
                      )}
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {project.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-surface-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-surface-400">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2 border-b border-surface-300 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold text-sm text-surface-900">{edu.institution}</span>
                      </div>
                      <span className="text-xs text-surface-500 whitespace-nowrap ml-4">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-surface-700">
                      {edu.degree} in {edu.field}
                      {edu.gpa && <span className="text-surface-500"> · GPA: {edu.gpa}</span>}
                    </div>
                    {edu.coursework && edu.coursework.length > 0 && (
                      <div className="text-xs text-surface-500 mt-1">
                        <span className="font-medium">Relevant Coursework: </span>
                        {edu.coursework.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2 border-b border-surface-300 pb-1">
                Certifications
              </h2>
              <div className="space-y-1">
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="flex justify-between items-baseline text-sm">
                    <div>
                      <span className="font-medium text-surface-800">{cert.name}</span>
                      <span className="text-surface-500"> · {cert.issuer}</span>
                    </div>
                    <span className="text-xs text-surface-500 ml-4">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
