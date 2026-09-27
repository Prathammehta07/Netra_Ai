import React from 'react';

interface FindingBadgeProps {
  type: string;
  count: number;
  confidence?: number;
}

export const LESION_COLORS: Record<string, { color: string; bg: string; border: string; name: string }> = {
  microaneurysm: {
    color: '#16a34a',
    bg: 'bg-emerald-50 text-emerald-800',
    border: 'border-emerald-200',
    name: 'Microaneurysms'
  },
  hemorrhage: {
    color: '#dc2626',
    bg: 'bg-red-50 text-red-800',
    border: 'border-red-200',
    name: 'Hemorrhages'
  },
  exudate: {
    color: '#d97706',
    bg: 'bg-amber-50 text-amber-800',
    border: 'border-amber-200',
    name: 'Hard Exudates'
  },
  abnormal_vessels: {
    color: '#9333ea',
    bg: 'bg-purple-50 text-purple-800',
    border: 'border-purple-200',
    name: 'Abnormal Vessels'
  },
  macular: {
    color: '#0d9488',
    bg: 'bg-teal-50 text-teal-800',
    border: 'border-teal-200',
    name: 'Macular Edema'
  }
};

export const FindingBadge: React.FC<FindingBadgeProps> = ({ type, count, confidence }) => {
  const normalizedKey = type.toLowerCase().replace(' ', '_');
  const info = LESION_COLORS[normalizedKey] || {
    color: '#3b82f6',
    bg: 'bg-blue-50 text-blue-800',
    border: 'border-blue-200',
    name: type
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${info.bg} ${info.border}`}>
      <div className="flex items-center space-x-2.5">
        <span
          className="w-3 h-3 rounded-full inline-block shadow-xs"
          style={{ backgroundColor: info.color }}
        />
        <span className="font-semibold text-xs tracking-tight">{info.name}</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/80 border border-slate-200 shadow-2xs">
          {count} detected
        </span>
        {confidence !== undefined && (
          <span className="text-[10px] text-slate-500 font-medium">
            {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};
