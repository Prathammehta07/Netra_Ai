import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  FileText,
  Activity,
  PlusCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('/api/retinal/scans')
      .then((res) => {
        if (res.data.success) {
          setScans(res.data.scans || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalScans = scans.length;
  const latestScan = scans.length > 0 ? scans[0] : null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Retinal Healthcare Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('dashboard.welcome')}, {user?.name}
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            {t('dashboard.subtitle')}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              to="/retinal-analysis"
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition shadow-md flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>{t('dashboard.startAnalysis')}</span>
            </Link>
            <Link
              to="/reports"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-sm transition flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('dashboard.viewReports')}</span>
            </Link>
          </div>
        </div>

        {/* Decorative Eye SVG motif background */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none text-white hidden sm:block">
          <Eye className="w-80 h-80 stroke-1" />
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.totalScans')}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalScans}</div>
          </div>
        </div>

        {/* Latest Screening */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.latestScreening')}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
              {latestScan?.analysisResult?.severity || 'No Scans Yet'}
            </div>
          </div>
        </div>

        {/* Reports Available */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('dashboard.reportsAvailable')}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalScans}</div>
          </div>
        </div>

        {/* Health Resources */}
        <Link
          to="/government-schemes"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.healthResources')}
              </div>
              <div className="text-xs font-semibold text-blue-600 group-hover:underline mt-0.5">
                Govt Health Schemes →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Analyses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('dashboard.recentAnalyses')}</h3>
            <p className="text-xs text-slate-500">History of your AI fundus image screenings</p>
          </div>
          <Link
            to="/reports"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading recent analyses...</div>
        ) : scans.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Eye className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">{t('dashboard.noScans')}</p>
            <Link
              to="/retinal-analysis"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('dashboard.startFirst')}</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Eye</th>
                  <th className="py-3 px-4">AI Screening Result</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {scans.slice(0, 5).map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {new Date(scan.scanDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-teal-700">{scan.eye}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {scan.analysisResult?.screeningCategory || 'Complete'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        scan.analysisResult?.severity === 'No DR' ? 'bg-emerald-100 text-emerald-800' :
                        scan.analysisResult?.severity === 'Mild' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {scan.analysisResult?.severity || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-500 font-medium">
                        {scan.review?.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/retinal-analysis/${scan.id}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition inline-block"
                      >
                        View Scan
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
