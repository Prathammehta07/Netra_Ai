import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Save, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, LANGUAGE_LABELS, type SupportedLanguage } from '../contexts/LanguageContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.profile?.mobile || '',
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || 'Female',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    diabeticStatus: user?.profile?.diabeticStatus || '',
    medicalHistory: user?.profile?.medicalHistory || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setIsSavingProfile(true);

    try {
      const res = await axios.put('/api/users/me', {
        ...formData,
        language
      });

      if (res.data.success && res.data.user) {
        updateUser(res.data.user);
        setIsEditing(false);
        setProfileMsg({ type: 'success', text: 'Profile information updated successfully.' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await axios.put('/api/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('nav.profile')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details, language preferences, and security settings
        </p>
      </div>

      {/* Main Profile Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user?.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {profileMsg && (
          <div className={`p-3.5 rounded-2xl text-xs font-medium flex items-center space-x-2 ${
            profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-70 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Email</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Mobile</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-70 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Age</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-70 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Gender</label>
                <select
                  disabled={!isEditing}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-70 outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">City</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-70 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">State</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:opacity-70 outline-none"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Language Preference Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Global Application Language</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((langKey) => {
            const item = LANGUAGE_LABELS[langKey];
            const isSelected = language === langKey;
            return (
              <button
                key={langKey}
                onClick={() => setLanguage(langKey)}
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

      {/* Account Security Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <Lock className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-900 text-base">Account Security & Password</h3>
        </div>

        {passwordMsg && (
          <div className={`p-3.5 rounded-2xl text-xs font-medium ${
            passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingPassword}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md shadow-purple-500/20 disabled:opacity-50"
          >
            {isSavingPassword ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
