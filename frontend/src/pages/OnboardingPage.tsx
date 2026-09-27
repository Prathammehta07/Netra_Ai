import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, User, Heart, Settings, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, LANGUAGE_LABELS, type SupportedLanguage } from '../contexts/LanguageContext';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: user?.profile?.mobile || '',
    age: user?.profile?.age || 19,
    gender: user?.profile?.gender || 'Female',
    city: user?.profile?.city || 'Mumbai',
    state: user?.profile?.state || 'Maharashtra',
    diabeticStatus: user?.profile?.diabeticStatus || 'Type 1 Diabetes',
    medicalHistory: user?.profile?.medicalHistory || 'Routine screening',
    preferredLanguage: language
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.put('/api/users/me', {
        ...formData,
        language: formData.preferredLanguage,
        onboardingComplete: true
      });

      if (res.data.success && res.data.user) {
        updateUser(res.data.user);
        setLanguage(formData.preferredLanguage as SupportedLanguage);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Onboarding save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
            <span className={step >= 1 ? 'text-blue-600' : ''}>1. Personal Info</span>
            <span className={step >= 2 ? 'text-blue-600' : ''}>2. Health Basics</span>
            <span className={step >= 3 ? 'text-blue-600' : ''}>3. Preferences</span>
            <span className={step >= 4 ? 'text-blue-600' : ''}>4. Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500">Confirm your personal profile details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Health Basics */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Health Profile</h2>
                  <p className="text-xs text-slate-500">Provide basic health background for tailored screening</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Diabetic Status</label>
                  <select
                    value={formData.diabeticStatus}
                    onChange={(e) => setFormData({ ...formData, diabeticStatus: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  >
                    <option value="Type 1 Diabetes">Type 1 Diabetes</option>
                    <option value="Type 2 Diabetes">Type 2 Diabetes</option>
                    <option value="Pre-diabetic">Pre-diabetic</option>
                    <option value="Non-diabetic">Non-diabetic / Routine Screening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Medical History Notes</label>
                  <textarea
                    rows={3}
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    placeholder="e.g. Duration of diabetes, blood sugar control status..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Language & Preferences</h2>
                  <p className="text-xs text-slate-500">Choose your preferred application language</p>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Preferred Application Language
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((langKey) => {
                    const item = LANGUAGE_LABELS[langKey];
                    const isSelected = formData.preferredLanguage === langKey;
                    return (
                      <button
                        key={langKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredLanguage: langKey })}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>{item.native}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {item.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Complete */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Hi {user?.name} 👋
                </h2>
                <p className="text-lg font-bold text-teal-600">
                  Welcome to Netra AI.
                </p>
                <p className="text-sm text-slate-500">
                  How can I help you today? Your AI retinal screening environment is fully prepared.
                </p>
              </div>
            </div>
          )}

          {/* Step Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25 flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Finalizing Setup...' : 'Go to Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
