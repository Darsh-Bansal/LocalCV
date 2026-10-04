/**
 * Main application router and state setup.
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { CareerVault } from './pages/CareerVault';
import { ResumeGenerator } from './pages/ResumeGenerator';
import { Portfolio } from './pages/Portfolio';
import { Privacy } from './pages/Privacy';
import { Settings } from './pages/Settings';

export function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('localcv-onboarded') === 'true';
  });

  if (!isOnboarded) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <Onboarding onComplete={() => setIsOnboarded(true)} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vault" element={<CareerVault />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="resume" element={<ResumeGenerator />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
