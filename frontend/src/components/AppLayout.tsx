import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onToggleMobile={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Persistent Medical Disclaimer Footer */}
          <footer className="bg-white border-t border-slate-200/80 px-4 py-3 text-center">
            <div className="max-w-5xl mx-auto flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{t('disclaimer')}</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
