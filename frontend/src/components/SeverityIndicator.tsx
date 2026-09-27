import React from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface SeverityIndicatorProps {
  severity: string;
  confidence: number;
  modelVersion?: string;
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  severity,
  confidence,
  modelVersion = 'v1.0.0-demo-model'
}) => {
  const getSeverityConfig = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case 'no dr':
      case 'normal':
        return {
          label: 'No DR Detected',
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badgeBg: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          color: '#16a34a'
        };
      case 'mild':
        return {
          label: 'Mild DR',
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badgeBg: 'bg-amber-500 text-white',
          icon: AlertTriangle,
          color: '#d97706'
        };
      case 'moderate':
        return {
          label: 'Moderate DR',
          bg: 'bg-orange-50 border-orange-200 text-orange-900',
          badgeBg: 'bg-orange-600 text-white',
          icon: AlertTriangle,
          color: '#ea580c'
        };
      case 'severe':
      case 'proliferative':
        return {
          label: 'Severe DR',
          bg: 'bg-red-50 border-red-200 text-red-900',
          badgeBg: 'bg-red-600 text-white',
          icon: AlertCircle,
          color: '#dc2626'
        };
      default:
        return {
          label: severity || 'Screening Complete',
          bg: 'bg-blue-50 border-blue-200 text-blue-900',
          badgeBg: 'bg-blue-600 text-white',
          icon: Info,
          color: '#2563eb'
        };
    }
  };

  const config = getSeverityConfig(severity);
  const Icon = config.icon;
  const isLowConfidence = confidence < 0.75;

  return (
    <div className={`p-4 rounded-2xl border ${config.bg} space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Icon className="w-5 h-5 stroke-[2.5]" />
          <span className="font-bold text-base tracking-tight">{config.label}</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.badgeBg}`}>
          {(confidence * 100).toFixed(0)}% Confidence
        </span>
      </div>

      {/* Progress visual bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-semibold text-slate-500">
          <span>AI Model Risk Rating</span>
          <span>{severity}</span>
        </div>
        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${Math.max(15, confidence * 100)}%`,
              backgroundColor: config.color
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
        <span>Model: <code className="font-mono text-slate-700">{modelVersion}</code></span>
        {isLowConfidence && (
          <span className="text-amber-700 font-medium">Low confidence — repeat imaging recommended</span>
        )}
      </div>
    </div>
  );
};
