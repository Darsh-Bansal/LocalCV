/**
 * Main layout wrapper with sidebar and content area.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useTheme } from '../hooks/useTheme';
import { useAIStatus } from '../hooks/useAIStatus';

export function Layout() {
  const { theme, setTheme } = useTheme();
  const { status: aiStatus, loading: aiLoading } = useAIStatus();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 transition-colors duration-200">
      <Sidebar
        aiStatus={aiStatus}
        aiLoading={aiLoading}
        theme={theme}
        onThemeChange={setTheme}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[260px]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 lg:px-8">
          <Outlet context={{ aiStatus, aiLoading }} />
        </div>
      </main>
    </div>
  );
}
