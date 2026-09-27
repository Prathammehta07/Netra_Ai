import React from 'react';
import { User, Calendar, Eye, IdCard } from 'lucide-react';

interface PatientInfoCardProps {
  name: string;
  age: number | string;
  gender?: string;
  patientId: string;
  eye: string;
  scanDate: string;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  name,
  age,
  gender = 'N/A',
  patientId,
  eye,
  scanDate
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Patient Profile summary */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{name}</h2>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
              <span>{age} Yrs</span>
              <span>•</span>
              <span>{gender}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">Patient</span>
            </div>
          </div>
        </div>

        {/* Dynamic details grid */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase flex items-center space-x-1">
              <IdCard className="w-3.5 h-3.5" />
              <span>Patient ID</span>
            </div>
            <div className="font-mono font-bold text-slate-800 text-xs mt-0.5">{patientId}</div>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>Eye Examined</span>
            </div>
            <div className="font-semibold text-teal-700 text-xs mt-0.5">{eye}</div>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date of Scan</span>
            </div>
            <div className="font-semibold text-slate-800 text-xs mt-0.5">{scanDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
