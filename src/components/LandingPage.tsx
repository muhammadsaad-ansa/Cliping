import React from 'react';
import { Sparkles, Video, Scissors, Wand2, ArrowRight, Play, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 blur-[120px] rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            Didukung oleh Google Gemini 4 AI & FFmpeg Engine
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Ubah Video Panjang Menjadi <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Klip Viral</span> Sekejap
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Platform AI Video Clipper profesional untuk kreator, podcaster, dan agency. Analisis cerdas, auto subtitle Bahasa Indonesia, dan rasio 9:16 siap TikTok & Reels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl shadow-xl shadow-purple-600/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              Mulai Buat Klip Gratis
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-purple-400" />
              Masuk ke Akun
            </button>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Tanpa Kartu Kredit
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Hasil 1080p HD
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Subtitle Otomatis ID
            </span>
          </div>
        </div>

        {/* Video / App Mockup Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-purple-500/20 via-slate-800/40 to-slate-950 border border-slate-800 shadow-2xl">
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-[16/9] flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-slate-900/60 to-blue-950/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <Wand2 className="w-10 h-10 text-purple-400 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-white">AI Studio Clipper Preview</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Unggah video podcast atau webinar Anda, biarkan AI mendeteksi momen paling menarik secara otomatis.
              </p>
              <button
                onClick={onGetStarted}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
              >
                Coba Unggah Video Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Fitur Profesional untuk Kreator Modern
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Semua yang Anda butuhkan untuk mendominasi TikTok, Instagram Reels, dan YouTube Shorts dalam satu platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 hover:border-purple-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analisis AI Cerdas</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Google Gemini mendeteksi bagian video dengan potensi viral tertinggi, lengkap dengan skor daya tarik dan judul otomatis.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 hover:border-purple-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Auto Subtitle Bahasa Indonesia</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transkripsi audio akurat otomatis disinkronkan dengan timeline video, siap diedit dan diberi gaya warna menarik.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 hover:border-purple-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Editor & Rasio 9:16</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Potong video dengan presisi tinggi, sesuaikan rasio 9:16, 16:9, atau 1:1, dan render dalam kualitas HD 1080p.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">C</div>
            <span className="font-bold text-slate-300">CLIPING AI</span> &copy; 2026. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Ketentuan Layanan</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
