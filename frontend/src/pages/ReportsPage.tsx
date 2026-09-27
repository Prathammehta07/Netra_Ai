import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Download, FileText, PlusCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedEye, setSelectedEye] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('/api/reports')
      .then((res) => {
        if (res.data.success) {
          setReports(res.data.reports || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rep.reportNumber.toLowerCase().includes(search.toLowerCase()) ||
      rep.screeningCategory.toLowerCase().includes(search.toLowerCase());

    const matchesEye = selectedEye === 'ALL' || rep.eye === selectedEye;
    const matchesSeverity = selectedSeverity === 'ALL' || rep.severity.toLowerCase() === selectedSeverity.toLowerCase();

    return matchesSearch && matchesEye && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('nav.reports')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, and download historical AI retinal screening reports
          </p>
        </div>

        <Link
          to="/retinal-analysis"
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-md shadow-blue-500/20 flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Retinal Scan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patient Name, Report #, or Result..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedEye}
            onChange={(e) => setSelectedEye(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Eyes</option>
            <option value="Right Eye">Right Eye</option>
            <option value="Left Eye">Left Eye</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="No DR">No DR</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading reports list...</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No reports available matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Report Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Eye</th>
                  <th className="py-3 px-4">AI Screening Result</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {rep.reportNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(rep.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{rep.patientName}</td>
                    <td className="py-3.5 px-4 text-teal-700 font-medium">{rep.eye}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate">{rep.screeningCategory}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        rep.severity === 'No DR' ? 'bg-emerald-100 text-emerald-800' :
                        rep.severity === 'Mild' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rep.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{rep.status}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/retinal-analysis/${rep.id}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition inline-block"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => window.open(`/api/reports/${rep.id}/pdf`, '_blank')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition inline-block"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
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
