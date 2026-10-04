/**
 * Main sidebar navigation for LocalCV.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Vault,
  Briefcase,
  Globe,
  FileText,
  Shield,
  Settings,
  Sun,
  Moon,
  Monitor,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { AIStatusBadge } from './AIStatusBadge';
import type { AIStatus } from '../types';

interface SidebarProps {
  aiStatus: AIStatus;
  aiLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vault', icon: Vault, label: 'Career Vault' },
  { to: '/portfolio', icon: Globe, label: 'Portfolio' },
  { to: '/resume', icon: FileText, label: 'Resume Generator' },
  { to: '/privacy', icon: Shield, label: 'Privacy' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({
  aiStatus,
  aiLoading,
  theme,
  onThemeChange,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-200 dark:border-surface-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-surface-900 dark:text-surface-50 tracking-tight">
            Local<span className="text-brand-500">CV</span>
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="ml-auto p-1.5 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-surface-200'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3">
        {/* AI Status */}
        {!collapsed ? (
          <AIStatusBadge status={aiStatus} loading={aiLoading} />
        ) : (
          <div className="flex justify-center">
            <AIStatusBadge status={aiStatus} loading={aiLoading} compact />
          </div>
        )}

        {/* Theme toggle */}
        {!collapsed && (
          <div className="flex gap-1 p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => onThemeChange(value)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  theme === value
                    ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                aria-label={`${label} theme`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
