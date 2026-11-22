import React, { useState } from 'react';
import { Sparkles, Wand2, Scissors, Play, ArrowRight, CheckCircle2, AlertCircle, Clock, Star } from 'lucide-react';
import { Project, Clip } from '../types';

interface AiGeneratorViewProps {
  project: Project;
  onClipsGenerated: (updatedClips: Clip[]) => void;
  onOpenEditor: (clip: Clip) => void;
}

export const AiGeneratorView: React.FC<AiGeneratorViewProps> = ({
  project,
  onClipsGenerated,
  onOpenEditor
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [clips, setClips] = useState<Clip[]>(project.clips || []);

  const handleRunAiAnalysis = async () => {
    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/ai/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          videoTitle: project.title,
          transcriptSummary: 'Diskusi mendalam mengenai inovasi teknologi, produktivitas, dan masa depan kecerdasan buatan.',
          duration: project.duration
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menganalisis video.');
      }

      if (data.clips) {
        const mappedClips: Clip[] = data.clips.map((c: any, index: number) => ({
          id: `clip-gen-${Date.now()}-${index}`,
          projectId: project.id,
          title: c.title,
          description: c.description,
          startTime: c.startTime,
          endTime: Math.min(c.endTime, c.startTime + selectedDuration),
          duration: Math.min(c.endTime - c.startTime, selectedDuration),
          hookScore: c.hookScore || 92,
          aspectRatio: '9:16',
          quality: '1080p',
          status: 'ready'
        }));
        setClips(mappedClips);
        onClipsGenerated(mappedClips);
      }
      setAnalyzing(false);
    } catch (err: any) {
      setAnalyzing(false);
      setError(err.message || 'Terjadi kesalahan saat memanggil layanan Gemini AI.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Google Gemini 4 AI Clipper
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            File: {project.filename} · Durasi: {Math.round(project.duration / 60)} menit
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 px-3">Durasi Klip:</span>
            {[15, 30, 45, 60].map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedDuration === dur
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>

          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 shrink-0 transform hover:scale-105"
          >
            <Wand2 className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Menganalisis Video...' : 'Analisis AI & Buat Klip'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Rekomendasi Klip Viral ({clips.length})</h2>
          <span className="text-xs text-slate-400">Pilih klip untuk masuk ke Video & Subtitle Editor</span>
        </div>

        {clips.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-semibold text-white">Belum Ada Klip Dihasilkan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Klik tombol "Analisis AI & Buat Klip" di atas untuk mendeteksi segmen paling menarik secara otomatis menggunakan Gemini AI.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip, index) => (
              <div
                key={clip.id || index}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                      {clip.aspectRatio} · {clip.duration}s
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-400 text-xs font-bold font-mono">
                      <Star className="w-3 h-3 fill-current" />
                      {clip.hookScore} Skor Viral
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {clip.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {clip.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-500">
                    ⏱️ {clip.startTime}s - {clip.endTime}s
                  </div>
                  <button
                    onClick={() => onOpenEditor(clip)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    Edit Klip <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
