import React, { useState } from 'react';
import axios from 'axios';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  Layers,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientInfoCard } from '../components/PatientInfoCard';
import { RetinalImageViewer } from '../components/RetinalImageViewer';
import { SeverityIndicator } from '../components/SeverityIndicator';
import { FindingBadge } from '../components/FindingBadge';
import { ReviewPanel } from '../components/ReviewPanel';

export const RetinalAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [eye, setEye] = useState<string>('Right Eye');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Workflow states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'clinical'>('explanation');

  const steps = [
    'Image Quality Check',
    'Preprocessing & Contrast Enhancement',
    'Retinal Feature Detection',
    'Lesion Analysis',
    'Severity Assessment',
    'Report Generation'
  ];

  const handleFileDrop = (file: File) => {
    setUploadError(null);
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setUploadError('Only JPG, JPEG, and PNG image files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds maximum allowed limit of 10MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setActiveStep(0);
    setAnalysisResult(null);

    // Simulate animated step-by-step progress visually
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('eye', eye);

      const uploadRes = await axios.post('/api/retinal/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.message || 'Image upload failed');
      }

      // 2. Call AI Analysis API
      const analyzeRes = await axios.post('/api/retinal/analyze', {
        imagePath: uploadRes.data.file.path,
        originalFilename: uploadRes.data.file.filename,
        fileSize: uploadRes.data.file.size,
        mimeType: uploadRes.data.file.mimeType,
        eye
      });

      if (analyzeRes.data.success && analyzeRes.data.scan) {
        setAnalysisResult(analyzeRes.data.scan);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setUploadError(err.response?.data?.message || 'Retinal analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!analysisResult?.id) return;
    window.open(`/api/reports/${analysisResult.id}/pdf`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('retinal.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('retinal.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-700">Examined Eye:</label>
          <select
            value={eye}
            onChange={(e) => setEye(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 shadow-2xs outline-none"
          >
            <option value="Right Eye">Right Eye</option>
            <option value="Left Eye">Left Eye</option>
          </select>
        </div>
      </div>

      {/* Patient Information horizontal card */}
      <PatientInfoCard
        name={user?.name || 'Shraddha Patil'}
        age={user?.profile?.age || 19}
        gender={user?.profile?.gender || 'Female'}
        patientId={user?.id ? `SMT-${user.id.slice(0, 8).toUpperCase()}` : 'SMT20250876'}
        eye={eye}
        scanDate={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      />

      {/* Demo AI Mode Alert Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">{t('retinal.demoBadge')}</span>
        </div>
      </div>

      {/* Main Analysis Workflow Container */}
      {!analysisResult && !isAnalyzing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900">{t('retinal.uploadTitle')}</h3>
            <p className="text-xs text-slate-500">Select fundus retinal scan image for AI feature extraction</p>
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div className="max-w-xl mx-auto">
            {!previewUrl ? (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) handleFileDrop(e.dataTransfer.files[0]);
                }}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer transition text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Click to browse or drag image here</p>
                  <p className="text-xs text-slate-400 mt-1">{t('retinal.uploadHint')}</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4 text-center">
                <div className="relative inline-block rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img src={previewUrl} alt="Retinal Preview" className="max-h-64 w-auto mx-auto object-cover" />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleStartAnalysis}
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/25 flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Retinal Analysis</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Animated Screen */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto relative">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">{t('retinal.analyzing')}</h3>
            <p className="text-xs text-slate-500">Extracting microvascular features and classifying severity</p>
          </div>

          <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {steps.map((stepName, idx) => {
              const isDone = idx < activeStep;
              const isCurrent = idx === activeStep;
              return (
                <div key={stepName} className="flex items-center space-x-3 text-xs">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className={`font-medium ${isCurrent ? 'text-blue-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Results Display (3-Column Layout) */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-800">Scan ID: {analysisResult.id}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Analysis Complete</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Analysis</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('retinal.downloadPdf')}</span>
              </button>
            </div>
          </div>

          {/* THREE-COLUMN ANALYSIS AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Retinal Image with Bounding Overlays */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Retinal Fundus Image & Visual Overlay</span>
              </h3>
              <RetinalImageViewer
                imageSrc={analysisResult.imagePath || previewUrl || '/uploads/sample_retina_1.jpg'}
                findings={analysisResult.findings}
              />
            </div>

            {/* CENTER COLUMN: AI Analysis Result & Severity */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>AI Screening Assessment</span>
              </h3>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    AI Screening Classification
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-1 leading-tight">
                    {analysisResult.analysisResult?.screeningCategory || 'Possible Moderate Diabetic Retinopathy'}
                  </h4>
                </div>

                <SeverityIndicator
                  severity={analysisResult.analysisResult?.severity || 'Moderate'}
                  confidence={analysisResult.analysisResult?.screeningConfidence || 0.88}
                  modelVersion={analysisResult.analysisResult?.modelVersion}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: AI Summary & Detected Lesions */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Detected Lesions ({analysisResult.findings?.length || 0})</span>
              </h3>

              <div className="space-y-2">
                {analysisResult.findings && analysisResult.findings.length > 0 ? (
                  analysisResult.findings.map((finding: any) => (
                    <FindingBadge
                      key={finding.id || finding.type}
                      type={finding.type}
                      count={finding.count}
                      confidence={finding.confidence}
                    />
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center border border-slate-200">
                    No abnormal microvascular lesions detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BELOW COLUMNS: Tabs for AI Explanation & Clinical Notes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex border-b border-slate-100 space-x-4">
              <button
                onClick={() => setActiveTab('explanation')}
                className={`pb-3 text-xs font-bold transition border-b-2 ${
                  activeTab === 'explanation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {t('retinal.aiExplanation')}
              </button>
              <button
                onClick={() => setActiveTab('clinical')}
                className={`pb-3 text-xs font-bold transition border-b-2 ${
                  activeTab === 'clinical' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {t('retinal.clinicalNotes')}
              </button>
            </div>

            {activeTab === 'explanation' ? (
              <p className="text-xs text-slate-700 leading-relaxed">
                {analysisResult.analysisResult?.explanation || 'AI screening identified microvascular changes requiring expert eye-care evaluation.'}
              </p>
            ) : (
              <p className="text-xs font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                {analysisResult.analysisResult?.clinicalNotes || 'Fundus examination shows punctate microaneurysms with focal hemorrhages.'}
              </p>
            )}
          </div>

          {/* Professional Review Section */}
          <ReviewPanel
            scanId={analysisResult.id}
            initialReview={analysisResult.review}
          />
        </div>
      )}
    </div>
  );
};
