import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PhoneCall, ShieldAlert, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const EmergencyNumbersPage: React.FC = () => {
  const { t } = useLanguage();
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('/api/emergency-numbers')
      .then((res) => {
        if (res.data.success) {
          setEmergencies(res.data.numbers || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('nav.emergencyNumbers')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Direct dial emergency medical services and national health support helplines
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <span>Emergency phone numbers displayed below apply to India. Please verify local emergency services if traveling abroad.</span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading emergency directory...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencies.map((item) => (
            <div
              key={item.id || item.number}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.service}</h3>
                  <div className="text-2xl font-extrabold text-red-600 font-mono tracking-tight mt-1">
                    {item.number}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${item.number}`}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md shadow-red-500/20 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {item.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
