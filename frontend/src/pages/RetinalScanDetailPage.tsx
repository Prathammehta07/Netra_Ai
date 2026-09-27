import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Layers, Activity } from 'lucide-react';
import { PatientInfoCard } from '../components/PatientInfoCard';
import { RetinalImageViewer } from '../components/RetinalImageViewer';
import { SeverityIndicator } from '../components/SeverityIndicator';
import { FindingBadge } from '../components/FindingBadge';
import { ReviewPanel } from '../components/ReviewPanel';

export const RetinalScanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/retinal/scans/${id}`)
        .then((res) => {
          if (res.data.success) {
            setScan(res.data.scan);
          }
        })
        .catch((err) => setError(err.response?.data?.message || 'Failed to load scan report.'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading scan detail report...</div>;
  }

  if (error || !scan) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-red-600 font-semibold">{error || 'Scan not found.'}</p>
        <Link to="/reports" className="text-xs text-blue-600 underline">Return to Reports</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/reports" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>
        <button
          onClick={() => window.open(`/api/reports/${scan.id}/pdf`, '_blank')}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs flex items-center space-x-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      <PatientInfoCard
        name={scan.user?.name || 'Shraddha Patil'}
        age={scan.user?.profile?.age || 19}
        gender={scan.user?.profile?.gender || 'Female'}
        patientId={scan.user?.id ? `SMT-${scan.user.id.slice(0, 8).toUpperCase()}` : 'SMT20250876'}
        eye={scan.eye}
        scanDate={new Date(scan.scanDate).toLocaleDateString()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Retinal Fundus Image</span>
          </h3>
          <RetinalImageViewer imageSrc={scan.imagePath} findings={scan.findings} />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Screening Summary</span>
          </h3>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-lg font-extrabold text-slate-900">
              {scan.analysisResult?.screeningCategory}
            </h4>

            <SeverityIndicator
              severity={scan.analysisResult?.severity || 'Normal'}
              confidence={scan.analysisResult?.screeningConfidence || 0.9}
              modelVersion={scan.analysisResult?.modelVersion}
            />

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">AI Explanation:</p>
              <p className="mt-1">{scan.analysisResult?.explanation}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700">Detected Lesions</p>
            {scan.findings && scan.findings.length > 0 ? (
              scan.findings.map((f: any) => (
                <FindingBadge key={f.id} type={f.type} count={f.count} confidence={f.confidence} />
              ))
            ) : (
              <p className="text-xs text-slate-500">No abnormal lesions detected.</p>
            )}
          </div>
        </div>
      </div>

      <ReviewPanel scanId={scan.id} initialReview={scan.review} />
    </div>
  );
};
