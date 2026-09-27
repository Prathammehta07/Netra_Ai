import React, { useState } from 'react';
import axios from 'axios';
import { UserCheck, CheckCircle, AlertTriangle, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ReviewPanelProps {
  scanId: string;
  initialReview?: {
    status?: string;
    comments?: string;
    modifiedSeverity?: string;
    reviewerName?: string;
  };
  onReviewSaved?: (updatedReview: any) => void;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  scanId,
  initialReview,
  onReviewSaved
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<string>(initialReview?.status || 'PENDING');
  const [comments, setComments] = useState<string>(initialReview?.comments || '');
  const [modifiedSeverity, setModifiedSeverity] = useState<string>(initialReview?.modifiedSeverity || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await axios.post(`/api/retinal/scans/${scanId}/review`, {
        status,
        comments,
        modifiedSeverity
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Professional ophthalmic review saved successfully.' });
        if (onReviewSaved) onReviewSaved(res.data.review);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save review.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">{t('retinal.professionalReview')}</h3>
          <p className="text-xs text-slate-500">{t('retinal.reviewNotice')}</p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Ophthalmic Assessment Decision
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setStatus('APPROVED')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
              status === 'APPROVED'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve AI Screening Result</span>
          </button>

          <button
            type="button"
            onClick={() => setStatus('REVISED')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
              status === 'REVISED'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Request Further Clinical Evaluation</span>
          </button>
        </div>
      </div>

      {/* Modify Severity Override Option */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Adjust Severity Assessment (Optional Override)
        </label>
        <select
          value={modifiedSeverity}
          onChange={(e) => setModifiedSeverity(e.target.value)}
          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Keep AI Model Output (No Override)</option>
          <option value="No DR">Override to: No DR</option>
          <option value="Mild">Override to: Mild Diabetic Retinopathy</option>
          <option value="Moderate">Override to: Moderate Diabetic Retinopathy</option>
          <option value="Severe">Override to: Severe Non-Proliferative DR</option>
          <option value="Proliferative">Override to: Proliferative DR</option>
        </select>
      </div>

      {/* Comments input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Reviewer Clinical Notes & Recommendations
        </label>
        <textarea
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Enter specialist comments, recommended diagnostic tests, or follow-up timelines..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Review...' : t('retinal.saveReview')}</span>
        </button>
      </div>
    </div>
  );
};
