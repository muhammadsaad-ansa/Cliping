import React from 'react';
import { Video, Scissors, Clock, Plus, ArrowUpRight, Sparkles, FolderOpen, Play, Trash2 } from 'lucide-react';
import { Project, User } from '../types';

interface DashboardViewProps {
  user: User;
  projects: Project[];
  onStartUpload: () => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  projects,
  onStartUpload,
  onSelectProject,
  onDeleteProject
}) => {
  const totalUploads = projects.length;
  const totalClips = projects.reduce((acc, p) => acc + (p.clips?.length || 0), 0);
  const totalDurationMinutes = Math.round(projects.reduce((acc, p) => acc + p.duration, 0) / 60);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Akun {user.plan}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Halo, {user.name}! 👋
          </h1>
          <p className="text-sm text-slate-400">
            Siap mengubah video panjang Anda menjadi klip viral berkualitas tinggi hari ini?
          </p>
        </div>
        <button
          onClick={onStartUpload}
          className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 shrink-0 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Mulai Buat Klip Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Video Diunggah</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalUploads}</div>
          <div className="text-xs text-slate-500 mt-1">Video sumber tersimpan</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Klip Dibuat</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalClips}</div>
          <div className="text-xs text-slate-500 mt-1">Siap diunduh & dipublish</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Durasi Video</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalDurationMinutes} <span className="text-sm font-normal text-slate-400">menit</span></div>
          <div className="text-xs text-slate-500 mt-1">Diproses AI dengan efisien</div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Proyek Video & Klip Terbaru</h2>
            <p className="text-xs text-slate-400">Daftar video yang telah diunggah dan klip hasil analisis AI Anda.</p>
          </div>
          <button
            onClick={onStartUpload}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            Unggah Baru <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 space-y-4 border border-dashed border-slate-800 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white">Belum Ada Proyek Video</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Mulai unggah video panjang pertama Anda untuk menghasilkan klip viral secara otomatis.
            </p>
            <button
              onClick={onStartUpload}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all"
            >
              Unggah Video Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                      {project.fileSize} · {Math.round(project.duration / 60)} min
                    </span>
                    <span className="text-xs text-slate-500">{project.uploadDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{project.filename}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-white">{project.clips?.length || 0}</span> Klip AI Tersedia
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Buka Editor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
