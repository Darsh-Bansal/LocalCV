/**
 * Career Vault page — complete career data management interface.
 * Organized with tabbed sections for each data type.
 */

import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Award,
  Code2,
  Trophy,
  Plus,
  Trash2,
  Save,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useProfile } from '../hooks/useProfile';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';
import type {
  PersonalInfo,
  Education,
  Experience,
  Project,
  Certification,
  SkillGroup,
  Achievement,
  SkillCategory,
} from '../types';
import { SKILL_CATEGORIES } from '../types';

type TabId = 'personal' | 'education' | 'experience' | 'projects' | 'certifications' | 'skills' | 'achievements';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

// ── Reusable form field components ─────────────────────────────────────

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors text-sm';

const textareaClass = `${inputClass} resize-none`;

// ── List Items (comma-separated) input ─────────────────────────────────

function ListInput({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Field label={label}>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder || 'Type and press Enter'}
          className={inputClass}
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-100 dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700"
            >
              {item}
              <button
                onClick={() => removeItem(i)}
                className="text-surface-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}

// ── Main Career Vault Component ────────────────────────────────────────

export function CareerVault() {
  const {
    personalInfo,
    education,
    experience,
    projects,
    certifications,
    skills,
    achievements,
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
  } = useProfile();

  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', onConfirm: () => {} });

  const confirmDelete = (title: string, onConfirm: () => void) => {
    setDeleteDialog({
      isOpen: true,
      title,
      onConfirm: () => {
        onConfirm();
        setDeleteDialog({ isOpen: false, title: '', onConfirm: () => {} });
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Career Vault</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage your complete career profile. All data is stored locally.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 border-b border-surface-200 dark:border-surface-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
        {activeTab === 'personal' && (
          <PersonalInfoForm info={personalInfo} onSave={savePersonalInfo} />
        )}
        {activeTab === 'education' && (
          <EntryList<Education>
            items={education}
            entityName="Education"
            onAdd={(item) => { addEducation(item); toast.success('Education added!'); }}
            onUpdate={(item) => { updateEducation(item); toast.success('Education updated!'); }}
            onDelete={(id) => confirmDelete('this education entry', () => { deleteEducation(id); toast.success('Education deleted.'); })}
            renderForm={(item, onChange) => <EducationForm item={item} onChange={onChange} />}
            renderSummary={(item) => (
              <div>
                <div className="font-medium text-surface-900 dark:text-surface-100">{item.institution || 'New Education'}</div>
                <div className="text-sm text-surface-500">{item.degree} {item.field && `in ${item.field}`}</div>
              </div>
            )}
            createEmpty={() => ({
              id: uuid(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', coursework: [], description: '',
            })}
          />
        )}
        {activeTab === 'experience' && (
          <EntryList<Experience>
            items={experience}
            entityName="Experience"
            onAdd={(item) => { addExperience(item); toast.success('Experience added!'); }}
            onUpdate={(item) => { updateExperience(item); toast.success('Experience updated!'); }}
            onDelete={(id) => confirmDelete('this experience entry', () => { deleteExperience(id); toast.success('Experience deleted.'); })}
            renderForm={(item, onChange) => <ExperienceForm item={item} onChange={onChange} />}
            renderSummary={(item) => (
              <div>
                <div className="font-medium text-surface-900 dark:text-surface-100">{item.role || 'New Role'}</div>
                <div className="text-sm text-surface-500">{item.company}</div>
              </div>
            )}
            createEmpty={() => ({
              id: uuid(), company: '', role: '', location: '', startDate: '', endDate: '', description: '', achievements: [], technologies: [],
            })}
          />
        )}
        {activeTab === 'projects' && (
          <EntryList<Project>
            items={projects}
            entityName="Project"
            onAdd={(item) => { addProject(item); toast.success('Project added!'); }}
            onUpdate={(item) => { updateProject(item); toast.success('Project updated!'); }}
            onDelete={(id) => confirmDelete('this project', () => { deleteProject(id); toast.success('Project deleted.'); })}
            renderForm={(item, onChange) => <ProjectForm item={item} onChange={onChange} />}
            renderSummary={(item) => (
              <div>
                <div className="font-medium text-surface-900 dark:text-surface-100">{item.name || 'New Project'}</div>
                <div className="text-sm text-surface-500">{item.technologies.slice(0, 4).join(', ')}</div>
              </div>
            )}
            createEmpty={() => ({
              id: uuid(), name: '', description: '', problemSolved: '', technologies: [], achievements: [], githubUrl: '', liveUrl: '', startDate: '', endDate: '',
            })}
          />
        )}
        {activeTab === 'certifications' && (
          <EntryList<Certification>
            items={certifications}
            entityName="Certification"
            onAdd={(item) => { addCertification(item); toast.success('Certification added!'); }}
            onUpdate={(item) => { updateCertification(item); toast.success('Certification updated!'); }}
            onDelete={(id) => confirmDelete('this certification', () => { deleteCertification(id); toast.success('Certification deleted.'); })}
            renderForm={(item, onChange) => <CertificationForm item={item} onChange={onChange} />}
            renderSummary={(item) => (
              <div>
                <div className="font-medium text-surface-900 dark:text-surface-100">{item.name || 'New Certification'}</div>
                <div className="text-sm text-surface-500">{item.issuer}</div>
              </div>
            )}
            createEmpty={() => ({
              id: uuid(), name: '', issuer: '', date: '', credentialId: '', credentialUrl: '', relevantSkills: [],
            })}
          />
        )}
        {activeTab === 'skills' && (
          <SkillsSection
            skills={skills}
            onAdd={(item) => { addSkillGroup(item); toast.success('Skill group added!'); }}
            onUpdate={(item) => { updateSkillGroup(item); toast.success('Skills updated!'); }}
            onDelete={(id) => confirmDelete('this skill group', () => { deleteSkillGroup(id); toast.success('Skill group deleted.'); })}
          />
        )}
        {activeTab === 'achievements' && (
          <EntryList<Achievement>
            items={achievements}
            entityName="Achievement"
            onAdd={(item) => { addAchievement(item); toast.success('Achievement added!'); }}
            onUpdate={(item) => { updateAchievement(item); toast.success('Achievement updated!'); }}
            onDelete={(id) => confirmDelete('this achievement', () => { deleteAchievement(id); toast.success('Achievement deleted.'); })}
            renderForm={(item, onChange) => <AchievementForm item={item} onChange={onChange} />}
            renderSummary={(item) => (
              <div>
                <div className="font-medium text-surface-900 dark:text-surface-100">{item.title || 'New Achievement'}</div>
                <div className="text-sm text-surface-500">{item.date}</div>
              </div>
            )}
            createEmpty={() => ({
              id: uuid(), title: '', description: '', date: '', url: '',
            })}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Entry"
        message={`Are you sure you want to delete ${deleteDialog.title}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={deleteDialog.onConfirm}
        onCancel={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
      />
    </div>
  );
}

// ── Generic Entry List Component ───────────────────────────────────────

interface EntryListProps<T extends { id: string }> {
  items: T[];
  entityName: string;
  onAdd: (item: T) => void;
  onUpdate: (item: T) => void;
  onDelete: (id: string) => void;
  renderForm: (item: T, onChange: (item: T) => void) => React.ReactNode;
  renderSummary: (item: T) => React.ReactNode;
  createEmpty: () => T;
}

function EntryList<T extends { id: string }>({
  items,
  entityName,
  onAdd,
  onUpdate,
  onDelete,
  renderForm,
  renderSummary,
  createEmpty,
}: EntryListProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<T>(createEmpty());

  const handleSaveNew = () => {
    onAdd(newItem);
    setIsAdding(false);
    setNewItem(createEmpty());
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onUpdate(editingItem);
      setEditingId(null);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-surface-300 dark:border-surface-600 text-sm font-medium text-surface-600 dark:text-surface-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add {entityName}
        </button>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="p-5 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/20 space-y-4 animate-slide-down">
          <h3 className="font-medium text-surface-900 dark:text-surface-100">New {entityName}</h3>
          {renderForm(newItem, setNewItem)}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewItem(createEmpty()); }}
              className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing entries */}
      {items.length === 0 && !isAdding && (
        <div className="text-center py-12 text-surface-400 dark:text-surface-500">
          <p className="text-sm">No {entityName.toLowerCase()} entries yet.</p>
          <p className="text-xs mt-1">Click the button above to add one.</p>
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden transition-all"
        >
          {editingId === item.id ? (
            <div className="p-5 space-y-4 animate-fade-in">
              {renderForm(editingItem || item, (updated) => setEditingItem(updated))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditingItem(null); }}
                  className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
              <div className="flex-1">{renderSummary(item)}</div>
              <div className="flex gap-1.5 ml-4">
                <button
                  onClick={() => { setEditingId(item.id); setEditingItem({ ...item }); }}
                  className="p-2 rounded-lg text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  title="Edit"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Personal Info Form ─────────────────────────────────────────────────

function PersonalInfoForm({ info, onSave }: { info: PersonalInfo; onSave: (info: PersonalInfo) => void }) {
  const [form, setForm] = useState<PersonalInfo>(info);

  const handleSave = () => {
    onSave(form);
    toast.success('Personal information saved!');
  };

  const update = (field: keyof PersonalInfo, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name">
          <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputClass} placeholder="Alex Chen" />
        </Field>
        <Field label="Professional Headline">
          <input type="text" value={form.headline} onChange={(e) => update('headline', e.target.value)} className={inputClass} placeholder="Full-Stack Software Engineer" />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} placeholder="alex@example.com" />
        </Field>
        <Field label="Phone">
          <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} placeholder="+1 (555) 234-5678" />
        </Field>
        <Field label="Location">
          <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} placeholder="San Francisco, CA" />
        </Field>
        <Field label="GitHub">
          <input type="url" value={form.github} onChange={(e) => update('github', e.target.value)} className={inputClass} placeholder="https://github.com/username" />
        </Field>
        <Field label="LinkedIn">
          <input type="url" value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/username" />
        </Field>
        <Field label="Personal Website">
          <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} className={inputClass} placeholder="https://example.com" />
        </Field>
      </div>
      <Field label="Professional Summary">
        <textarea
          value={form.summary}
          onChange={(e) => update('summary', e.target.value)}
          rows={4}
          className={textareaClass}
          placeholder="Brief professional summary highlighting your key qualifications..."
        />
      </Field>
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
      >
        <Save className="w-4 h-4" />
        Save Personal Info
      </button>
    </div>
  );
}

// ── Education Form ─────────────────────────────────────────────────────

function EducationForm({ item, onChange }: { item: Education; onChange: (item: Education) => void }) {
  const update = (field: keyof Education, value: string | string[]) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Institution">
          <input type="text" value={item.institution} onChange={(e) => update('institution', e.target.value)} className={inputClass} placeholder="University of California, Berkeley" />
        </Field>
        <Field label="Degree">
          <input type="text" value={item.degree} onChange={(e) => update('degree', e.target.value)} className={inputClass} placeholder="Bachelor of Science" />
        </Field>
        <Field label="Field of Study">
          <input type="text" value={item.field} onChange={(e) => update('field', e.target.value)} className={inputClass} placeholder="Computer Science" />
        </Field>
        <Field label="GPA">
          <input type="text" value={item.gpa} onChange={(e) => update('gpa', e.target.value)} className={inputClass} placeholder="3.8" />
        </Field>
        <Field label="Start Date">
          <input type="month" value={item.startDate} onChange={(e) => update('startDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="End Date">
          <input type="month" value={item.endDate} onChange={(e) => update('endDate', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <ListInput label="Coursework" items={item.coursework} onChange={(items) => update('coursework', items)} placeholder="e.g., Data Structures" />
      <Field label="Description">
        <textarea value={item.description} onChange={(e) => update('description', e.target.value)} rows={3} className={textareaClass} placeholder="Additional notes about your education..." />
      </Field>
    </div>
  );
}

// ── Experience Form ────────────────────────────────────────────────────

function ExperienceForm({ item, onChange }: { item: Experience; onChange: (item: Experience) => void }) {
  const update = (field: keyof Experience, value: string | string[]) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company">
          <input type="text" value={item.company} onChange={(e) => update('company', e.target.value)} className={inputClass} placeholder="Stripe" />
        </Field>
        <Field label="Role">
          <input type="text" value={item.role} onChange={(e) => update('role', e.target.value)} className={inputClass} placeholder="Software Engineer" />
        </Field>
        <Field label="Location">
          <input type="text" value={item.location} onChange={(e) => update('location', e.target.value)} className={inputClass} placeholder="San Francisco, CA" />
        </Field>
        <div />
        <Field label="Start Date">
          <input type="month" value={item.startDate} onChange={(e) => update('startDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="End Date (leave empty for current)">
          <input type="month" value={item.endDate} onChange={(e) => update('endDate', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="Description">
        <textarea value={item.description} onChange={(e) => update('description', e.target.value)} rows={3} className={textareaClass} placeholder="Brief description of your role..." />
      </Field>
      <ListInput label="Achievements" items={item.achievements} onChange={(items) => update('achievements', items)} placeholder="e.g., Reduced API latency by 35%" />
      <ListInput label="Technologies" items={item.technologies} onChange={(items) => update('technologies', items)} placeholder="e.g., TypeScript" />
    </div>
  );
}

// ── Project Form ───────────────────────────────────────────────────────

function ProjectForm({ item, onChange }: { item: Project; onChange: (item: Project) => void }) {
  const update = (field: keyof Project, value: string | string[]) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Project Name">
          <input type="text" value={item.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="DevFlow" />
        </Field>
        <div />
        <Field label="Start Date">
          <input type="month" value={item.startDate} onChange={(e) => update('startDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="End Date">
          <input type="month" value={item.endDate} onChange={(e) => update('endDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="GitHub URL">
          <input type="url" value={item.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} className={inputClass} placeholder="https://github.com/..." />
        </Field>
        <Field label="Live Demo URL">
          <input type="url" value={item.liveUrl} onChange={(e) => update('liveUrl', e.target.value)} className={inputClass} placeholder="https://..." />
        </Field>
      </div>
      <Field label="Description">
        <textarea value={item.description} onChange={(e) => update('description', e.target.value)} rows={3} className={textareaClass} placeholder="What does this project do?" />
      </Field>
      <Field label="Problem Solved">
        <textarea value={item.problemSolved} onChange={(e) => update('problemSolved', e.target.value)} rows={2} className={textareaClass} placeholder="What problem does this project solve?" />
      </Field>
      <ListInput label="Technologies" items={item.technologies} onChange={(items) => update('technologies', items)} placeholder="e.g., React" />
      <ListInput label="Achievements" items={item.achievements} onChange={(items) => update('achievements', items)} placeholder="e.g., 2,400+ GitHub stars" />
    </div>
  );
}

// ── Certification Form ─────────────────────────────────────────────────

function CertificationForm({ item, onChange }: { item: Certification; onChange: (item: Certification) => void }) {
  const update = (field: keyof Certification, value: string | string[]) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Certification Name">
          <input type="text" value={item.name} onChange={(e) => update('name', e.target.value)} className={inputClass} placeholder="AWS Solutions Architect" />
        </Field>
        <Field label="Issuer">
          <input type="text" value={item.issuer} onChange={(e) => update('issuer', e.target.value)} className={inputClass} placeholder="Amazon Web Services" />
        </Field>
        <Field label="Date">
          <input type="month" value={item.date} onChange={(e) => update('date', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Credential ID">
          <input type="text" value={item.credentialId} onChange={(e) => update('credentialId', e.target.value)} className={inputClass} placeholder="AWS-SAA-2023-0042" />
        </Field>
        <Field label="Credential URL" className="md:col-span-2">
          <input type="url" value={item.credentialUrl} onChange={(e) => update('credentialUrl', e.target.value)} className={inputClass} placeholder="https://..." />
        </Field>
      </div>
      <ListInput label="Relevant Skills" items={item.relevantSkills} onChange={(items) => update('relevantSkills', items)} placeholder="e.g., AWS" />
    </div>
  );
}

// ── Achievement Form ───────────────────────────────────────────────────

function AchievementForm({ item, onChange }: { item: Achievement; onChange: (item: Achievement) => void }) {
  const update = (field: keyof Achievement, value: string) => {
    onChange({ ...item, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title">
          <input type="text" value={item.title} onChange={(e) => update('title', e.target.value)} className={inputClass} placeholder="CalHacks 9.0 — 2nd Place" />
        </Field>
        <Field label="Date">
          <input type="month" value={item.date} onChange={(e) => update('date', e.target.value)} className={inputClass} />
        </Field>
        <Field label="URL" className="md:col-span-2">
          <input type="url" value={item.url} onChange={(e) => update('url', e.target.value)} className={inputClass} placeholder="https://..." />
        </Field>
      </div>
      <Field label="Description">
        <textarea value={item.description} onChange={(e) => update('description', e.target.value)} rows={3} className={textareaClass} placeholder="Describe your achievement..." />
      </Field>
    </div>
  );
}

// ── Skills Section ─────────────────────────────────────────────────────

function SkillsSection({
  skills,
  onAdd,
  onUpdate,
  onDelete,
}: {
  skills: SkillGroup[];
  onAdd: (group: SkillGroup) => void;
  onUpdate: (group: SkillGroup) => void;
  onDelete: (id: string) => void;
}) {
  const [newCategory, setNewCategory] = useState<SkillCategory>('Programming Languages');
  const existingCategories = skills.map((s) => s.category);
  const availableCategories = SKILL_CATEGORIES.filter((c) => !existingCategories.includes(c));

  const handleAddCategory = () => {
    if (!availableCategories.length) return;
    const category = newCategory || availableCategories[0];
    if (!category) return;
    onAdd({ id: uuid(), category: category, items: [] });
  };

  return (
    <div className="space-y-4">
      {skills.length === 0 && (
        <div className="text-center py-8 text-surface-400 dark:text-surface-500">
          <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No skills added yet.</p>
        </div>
      )}

      {skills.map((group) => (
        <div key={group.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-surface-900 dark:text-surface-100">{group.category}</h3>
            <button
              onClick={() => onDelete(group.id)}
              className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <ListInput
            label=""
            items={group.items}
            onChange={(items) => onUpdate({ ...group, items })}
            placeholder={`Add a ${group.category.toLowerCase()} skill`}
          />
        </div>
      ))}

      {availableCategories.length > 0 && (
        <div className="flex gap-2 items-end">
          <Field label="Add Skill Category" className="flex-1">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
              className={inputClass}
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </Field>
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors mb-px"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      )}
    </div>
  );
}
