import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGE_LABELS, type SupportedLanguage } from '../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGE_LABELS[language];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-700 text-sm font-medium transition shadow-xs"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-blue-600" />
        <span>{currentLang.native}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Language
          </div>
          {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((key) => {
            const item = LANGUAGE_LABELS[key];
            const isSelected = key === language;
            return (
              <button
                key={key}
                onClick={() => {
                  setLanguage(key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-blue-50 transition ${
                  isSelected ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <span>{item.native} <span className="text-xs text-slate-400 font-normal">({item.label})</span></span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
