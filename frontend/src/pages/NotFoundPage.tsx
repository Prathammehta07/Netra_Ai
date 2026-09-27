import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
        <Eye className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md">
        The requested page does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-md flex items-center space-x-2 inline-flex"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
