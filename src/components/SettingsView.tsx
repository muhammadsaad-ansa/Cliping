import React, { useState } from 'react';
import { Settings, User as UserIcon, Shield, Sparkles, CheckCircle2, Key, Save } from 'lucide-react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updated: User) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            Pengaturan Akun & Sistem
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pengaturan Profil
          </h1>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Perubahan berhasil disimpan!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-600/30">
            {name.charAt(0)}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">{name}</h2>
            <p className="text-xs text-slate-400">{email}</p>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" /> {user.plan}
            </span>
          </div>
        </div>

        {/* Form Settings */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-white">Informasi Pengguna</h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          </form>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" /> Integrasi AI & Keamanan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini API dikonfigurasi secara aman melalui server-side environment (`process.env.GEMINI_API_KEY`). Kunci rahasia tidak pernah diekspos ke browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
