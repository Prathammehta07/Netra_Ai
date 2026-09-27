import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSelector } from '../components/LanguageSelector';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success && res.data.token) {
        login(res.data.token, res.data.user);
        if (!res.data.user.profile?.onboardingComplete) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@swasthmitra.org');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header Language switch */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Eye className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Netra AI</span>
        </div>
        <LanguageSelector />
      </div>

      {/* Main Form Container */}
      <div className="my-auto py-8 max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Hero Brand Box */}
        <div className="space-y-6 text-left hidden md:block">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>AI Retinal Healthcare Platform</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AI-Powered Early <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">Diabetic Retinopathy</span> Screening
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Empowering healthcare providers and patients with instant microvascular retinal image analysis, risk estimation, and clinical reports.
          </p>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Quick Demo Access Credentials</span>
            </div>
            <p className="text-xs text-slate-500">
              Click below to auto-fill the official demo account:
            </p>
            <button
              onClick={handleDemoLogin}
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              Fill Demo Login: demo@swasthmitra.org
            </button>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-xs text-slate-500">Sign in to access your retinal screening dashboard</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        Netra AI Healthcare Assistant • Version 1.0 Production
      </div>
    </div>
  );
};
