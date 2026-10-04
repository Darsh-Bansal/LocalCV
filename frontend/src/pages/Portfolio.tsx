/**
 * Portfolio page — renders a polished, production-ready personal developer portfolio
 * automatically generated from the user's Career Vault data.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  FileCode,
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { formatDate, downloadFile } from '../lib/utils';
import { toast } from 'sonner';

export function Portfolio() {
  const { profile, personalInfo, education, experience, projects, certifications, skills, achievements } =
    useProfile();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [portfolioTheme, setPortfolioTheme] = useState<'modern' | 'minimal' | 'cyber'>('modern');

  const allTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies).filter(Boolean))
  );

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) =>
          p.technologies.some((t) => t.toLowerCase() === selectedCategory.toLowerCase())
        );

  const totalSkills = skills.reduce((acc, s) => acc + s.items.length, 0);

  /**
   * Generates a fully self-contained, standalone single HTML file
   * containing the user's portfolio that can be hosted on GitHub Pages or anywhere.
   */
  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName || 'Developer'} — Portfolio</title>
  <meta name="description" content="${personalInfo.headline || personalInfo.summary || 'Portfolio'}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(255, 255, 255, 0.03);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --primary: #3b82f6;
      --primary-glow: rgba(59, 130, 246, 0.2);
      --accent: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 0 1.5rem;
    }
    .container { max-width: 960px; margin: 0 auto; padding: 4rem 0; }
    header { text-align: center; margin-bottom: 4rem; }
    h1 { font-size: 2.75rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.5rem; background: linear-gradient(to right, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .headline { font-size: 1.25rem; color: var(--text-muted); font-weight: 400; margin-bottom: 1.5rem; }
    .contact-links { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .contact-links a { color: var(--text-muted); text-decoration: none; font-size: 0.875rem; padding: 0.5rem 1rem; border-radius: 9999px; background: var(--card-bg); border: 1px solid var(--card-border); transition: all 0.2s; }
    .contact-links a:hover { color: #fff; border-color: var(--primary); background: var(--primary-glow); }
    .summary-box { max-width: 680px; margin: 0 auto 3rem; text-align: center; color: var(--text-muted); font-size: 1rem; }
    section { margin-bottom: 4.5rem; }
    h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 1rem; padding: 1.5rem; transition: transform 0.2s, border-color 0.2s; }
    .card:hover { transform: translateY(-3px); border-color: rgba(96, 165, 250, 0.4); }
    .badge { display: inline-block; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 9999px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; margin-right: 0.4rem; margin-bottom: 0.4rem; }
    .timeline-item { padding-left: 1.5rem; border-left: 2px solid var(--card-border); margin-bottom: 2rem; position: relative; }
    .timeline-item::before { content: ''; position: absolute; left: -6px; top: 0.35rem; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); }
    .timeline-title { font-weight: 600; font-size: 1.1rem; }
    .timeline-meta { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    footer { text-align: center; padding: 3rem 0; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--card-border); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${personalInfo.fullName || 'Professional'}</h1>
      <div class="headline">${personalInfo.headline || 'Full Stack Engineer'}</div>
      <div class="contact-links">
        ${personalInfo.email ? `<a href="mailto:${personalInfo.email}">📧 ${personalInfo.email}</a>` : ''}
        ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank">GitHub</a>` : ''}
        ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}
        ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank">Website</a>` : ''}
      </div>
      ${personalInfo.summary ? `<div class="summary-box">${personalInfo.summary}</div>` : ''}
    </header>

    ${
      skills.length > 0
        ? `
    <section>
      <h2>⚡ Skills & Technologies</h2>
      <div class="grid">
        ${skills
          .map(
            (g) => `
          <div class="card">
            <h3 style="font-size:0.95rem; font-weight:600; margin-bottom:0.75rem;">${g.category}</h3>
            <div>
              ${g.items.map((it) => `<span class="badge">${it}</span>`).join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      projects.length > 0
        ? `
    <section>
      <h2>🚀 Featured Projects</h2>
      <div class="grid">
        ${projects
          .map(
            (p) => `
          <div class="card">
            <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">${p.name}</h3>
            <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1rem;">${p.description}</p>
            ${
              p.technologies.length > 0
                ? `<div style="margin-bottom:1rem;">${p.technologies
                    .map((t) => `<span class="badge">${t}</span>`)
                    .join('')}</div>`
                : ''
            }
            <div>
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" style="color:#60a5fa; font-size:0.85rem; margin-right:1rem; text-decoration:none;">GitHub ↗</a>` : ''}
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="color:#34d399; font-size:0.85rem; text-decoration:none;">Live Demo ↗</a>` : ''}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      experience.length > 0
        ? `
    <section>
      <h2>💼 Professional Experience</h2>
      <div>
        ${experience
          .map(
            (e) => `
          <div class="timeline-item">
            <div class="timeline-title">${e.role} · ${e.company}</div>
            <div class="timeline-meta">${e.startDate} – ${e.endDate} ${e.location ? `· ${e.location}` : ''}</div>
            <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem;">${e.description}</p>
            ${
              e.achievements.length > 0
                ? `<ul style="font-size:0.85rem; padding-left:1.2rem; color:var(--text-muted);">
                ${e.achievements.map((a) => `<li>${a}</li>`).join('')}
              </ul>`
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      education.length > 0
        ? `
    <section>
      <h2>🎓 Education</h2>
      <div>
        ${education
          .map(
            (edu) => `
          <div class="timeline-item">
            <div class="timeline-title">${edu.degree} in ${edu.field}</div>
            <div class="timeline-meta">${edu.institution} · ${edu.startDate} – ${edu.endDate}</div>
            ${edu.gpa ? `<div style="font-size:0.85rem; color:var(--text-muted);">GPA: ${edu.gpa}</div>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    <footer>
      Generated with <strong>LocalCV</strong> — Local-first career management.
    </footer>
  </div>
</body>
</html>`;

    const filename = `${(personalInfo.fullName || 'portfolio').replace(/\s+/g, '_')}_Portfolio.html`;
    downloadFile(htmlContent, filename, 'text/html');
    toast.success('Standalone portfolio exported as HTML!');
  };

  const handleCopyMarkdown = () => {
    let md = `# ${personalInfo.fullName || 'Professional'}\n\n`;
    md += `**${personalInfo.headline || ''}**\n\n`;
    if (personalInfo.summary) md += `${personalInfo.summary}\n\n`;

    if (skills.length > 0) {
      md += `## Skills\n\n`;
      skills.forEach((g) => {
        md += `- **${g.category}:** ${g.items.join(', ')}\n`;
      });
      md += `\n`;
    }

    if (projects.length > 0) {
      md += `## Projects\n\n`;
      projects.forEach((p) => {
        md += `### ${p.name}\n${p.description}\n`;
        if (p.technologies.length > 0) md += `*Technologies:* ${p.technologies.join(', ')}\n`;
        if (p.githubUrl) md += `*Code:* ${p.githubUrl}\n`;
        if (p.liveUrl) md += `*Demo:* ${p.liveUrl}\n`;
        md += `\n`;
      });
    }

    if (experience.length > 0) {
      md += `## Experience\n\n`;
      experience.forEach((e) => {
        md += `### ${e.role} — ${e.company} (${e.startDate} - ${e.endDate})\n`;
        md += `${e.description}\n`;
        e.achievements.forEach((a) => (md += `- ${a}\n`));
        md += `\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopiedLink(true);
    toast.success('Portfolio copied as Markdown!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Portfolio Header Bar / Controls */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Automatic Portfolio Generation
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">
            Personal Portfolio
          </h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            Always up to date with your Career Vault. Export as a standalone deployable HTML bundle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setPortfolioTheme('modern')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                portfolioTheme === 'modern'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => setPortfolioTheme('minimal')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                portfolioTheme === 'minimal'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              Minimal
            </button>
            <button
              onClick={() => setPortfolioTheme('cyber')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                portfolioTheme === 'cyber'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              Cyber
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 text-xs font-medium transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Markdown
          </button>

          <button
            type="button"
            onClick={handleExportHTML}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export HTML Bundle
          </button>
        </div>
      </div>

      {/* Rendered Portfolio Display */}
      <div
        className={`rounded-2xl border shadow-xl p-8 sm:p-14 transition-all duration-300 ${
          portfolioTheme === 'minimal'
            ? 'bg-white dark:bg-surface-950 border-surface-200 dark:border-surface-800'
            : portfolioTheme === 'cyber'
            ? 'bg-surface-950 border-emerald-500/30 text-surface-100 shadow-emerald-950/20'
            : 'bg-gradient-to-b from-white via-surface-50/50 to-surface-100/30 dark:from-surface-900 dark:via-surface-950 dark:to-surface-950 border-surface-200 dark:border-surface-800'
        }`}
      >
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for Opportunities
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>

          <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 font-medium leading-relaxed">
            {personalInfo.headline || 'Software Engineer · Open Source Enthusiast · Systems Architect'}
          </p>

          {/* Contact & Links Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                <MapPin className="w-3.5 h-3.5 text-surface-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-brand-500 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-surface-400" />
                {personalInfo.email}
              </a>
            )}
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-brand-500 transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-surface-400" />
                GitHub
              </a>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-brand-500 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-surface-400" />
                LinkedIn
              </a>
            )}
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-brand-500 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-surface-400" />
                Website
              </a>
            )}
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <p className="text-sm sm:text-base text-surface-500 dark:text-surface-400 leading-relaxed max-w-2xl mx-auto pt-2">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-3">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brand-500" />
                Technical Competencies
              </h2>
              <span className="text-xs text-surface-400 font-medium">
                {totalSkills} Skills Documented
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((group) => (
                <div
                  key={group.id}
                  className="p-4 rounded-xl border border-surface-200/80 dark:border-surface-800/80 bg-white/60 dark:bg-surface-900/60 backdrop-blur-sm space-y-2.5"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects Section */}
        {projects.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-200 dark:border-surface-800 pb-3">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-500" />
                Featured Projects ({projects.length})
              </h2>

              {/* Filter pills */}
              {allTechs.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-brand-500 text-white font-medium'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200'
                    }`}
                  >
                    All
                  </button>
                  {allTechs.slice(0, 5).map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedCategory(tech)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                        selectedCategory === tech
                          ? 'bg-brand-500 text-white font-medium'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white/70 dark:bg-surface-900/70 p-6 flex flex-col justify-between hover:border-brand-500/50 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 group-hover:text-brand-500 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
                            aria-label="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded text-surface-400 hover:text-brand-500"
                            aria-label="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
                      {p.description}
                    </p>

                    {p.problemSolved && (
                      <div className="text-xs text-surface-500 dark:text-surface-400 bg-surface-50 dark:bg-surface-800/50 p-2.5 rounded-lg border border-surface-200/50 dark:border-surface-800">
                        <span className="font-semibold text-surface-700 dark:text-surface-300">
                          Problem Solved:
                        </span>{' '}
                        {p.problemSolved}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-surface-100 dark:border-surface-800/80 flex flex-wrap gap-1.5">
                    {p.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-700 dark:text-brand-400 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 border-b border-surface-200 dark:border-surface-800 pb-3">
              <Briefcase className="w-5 h-5 text-brand-500" />
              Work Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-6 border-l-2 border-brand-500/30 space-y-2"
                >
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-brand-500 border-2 border-white dark:border-surface-950" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
                      {exp.role}{' '}
                      <span className="text-brand-600 dark:text-brand-400">· {exp.company}</span>
                    </h3>
                    <span className="text-xs text-surface-400 font-mono">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                    </span>
                  </div>

                  {exp.location && (
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                      {exp.location}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 leading-relaxed pt-1">
                    {exp.description}
                  </p>

                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-xs sm:text-sm text-surface-600 dark:text-surface-400 space-y-1 pt-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {exp.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 border-b border-surface-200 dark:border-surface-800 pb-2">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/50 space-y-1"
                  >
                    <div className="text-sm font-bold text-surface-900 dark:text-surface-100">
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                      {edu.institution}
                    </div>
                    <div className="text-xs text-surface-400 font-mono">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 border-b border-surface-200 dark:border-surface-800 pb-2">
                <Award className="w-4 h-4 text-brand-500" />
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-surface-900 dark:text-surface-100">
                        {cert.name}
                      </div>
                      <div className="text-[11px] text-surface-500 dark:text-surface-400">
                        {cert.issuer} · {formatDate(cert.date)}
                      </div>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        Verify <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-surface-200 dark:border-surface-800 text-center text-xs text-surface-400">
          Powered by{' '}
          <strong className="text-surface-700 dark:text-surface-300">LocalCV</strong> — Private,
          local-first career architecture.
        </div>
      </div>
    </div>
  );
}
