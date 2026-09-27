import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';

interface TopbarProps {
  onToggleMobile: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobile }) => {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger button + title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Demo AI Mode Active — Decision Support Only</span>
        </div>
      </div>

      {/* Right side: Language selector + User menu */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <LanguageSelector />
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
};
