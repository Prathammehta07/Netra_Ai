import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const GovernmentSchemesPage: React.FC = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('/api/government-schemes')
      .then((res) => {
        if (res.data.success) {
          setSchemes(res.data.schemes || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('nav.governmentSchemes')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official Government of India national and state healthcare assistance programs
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-2">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <span>All links direct to official government portals (.gov.in / .nic.in). External sites open in a new browser tab.</span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading government schemes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id || scheme.title}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {scheme.category || 'Government Scheme'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{scheme.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{scheme.description}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Eligibility Criteria</span>
                  <p className="text-xs text-slate-700 font-medium">{scheme.eligibility}</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
