import React from 'react';
import { FolderOpen, Scissors, Download, Trash2, Play, Video, Sparkles } from 'lucide-react';
import { Project, Clip } from '../types';

interface HistoryViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenEditor: (clip: Clip) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onOpenEditor
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
            Manajemen Proyek & Riwayat Klip
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Arsip Proyek Anda
          </h1>
          <p className="text-xs text-slate-400">
            Kelola seluruh video sumber dan hasil klip pendek Anda di satu tempat.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-white">Belum Ada Proyek Tersimpan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Semua video yang Anda unggah dan klip yang dihasilkan akan muncul di halaman ini.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-purple-400 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                      {project.fileSize} · {Math.round(project.duration / 60)} min
                    </span>
                    <span className="text-xs text-slate-500">{project.uploadDate}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{project.title}</h2>
                  <p className="text-xs text-slate-400 font-mono">{project.filename}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus Proyek
                  </button>
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Scissors className="w-4 h-4" /> Buat / Edit Klip
                  </button>
                </div>
              </div>

              {/* Clips List for this project */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Klip Terkait ({project.clips?.length || 0})</h3>
                {project.clips && project.clips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.clips.map((clip) => (
                      <div
                        key={clip.id}
                        className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{clip.aspectRatio} · {clip.quality}</span>
                            <span className="text-purple-400">Skor: {clip.hookScore}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{clip.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{clip.description}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500">⏱️ {clip.duration}s</span>
                          <button
                            onClick={() => onOpenEditor(clip)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" /> Buka Editor
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Belum ada klip yang dihasilkan untuk proyek ini.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
