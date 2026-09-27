import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setIsSent(true);
      setMessage(res.data.message || 'Reset link sent to your email.');
    } catch (err: any) {
      setMessage('Failed to send reset link. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Eye className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Netra AI</span>
        </div>
        <LanguageSelector />
      </div>

      <div className="my-auto py-8 max-w-md w-full mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="text-xs text-slate-500">Enter your email to receive password reset instructions</p>
          </div>

          {isSent ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold">{message}</p>
              <Link to="/login" className="inline-block pt-2 text-xs font-bold text-blue-600 hover:underline">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs">
            <Link to="/login" className="font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        Netra AI Healthcare Assistant
      </div>
    </div>
  );
};
