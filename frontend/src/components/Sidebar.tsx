import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Eye,
  Building2,
  PhoneCall,
  User,
  Bot,
  FileText,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/retinal-analysis', label: t('nav.retinalAnalysis'), icon: Eye, badge: 'AI Core' },
    { to: '/reports', label: t('nav.reports'), icon: FileText },
    { to: '/ai-assistant', label: t('nav.aiAssistant'), icon: Bot, highlight: true },
    { to: '/government-schemes', label: t('nav.governmentSchemes'), icon: Building2 },
    { to: '/emergency-numbers', label: t('nav.emergencyNumbers'), icon: PhoneCall },
    { to: '/profile', label: t('nav.profile'), icon: User }
  ];

  const content = (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full shadow-xs select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Eye className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 tracking-tight leading-none flex items-center space-x-1">
            <span>{t('brandName')}</span>
          </h1>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-600">AI Health Assistant</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-700">
                  {item.badge}
                </span>
              )}
              {item.highlight && (
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>{t('brandName')}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Healthier Today, Brighter Tomorrow
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {content}
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
