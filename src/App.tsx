import React, { useState, useEffect } from 'react';
import { User, Project, Clip, SubtitleSegment } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { AiGeneratorView } from './components/AiGeneratorView';
import { VideoEditorView } from './components/VideoEditorView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [user, setUser] = useState<User | null>({
    id: 'user-1',
    name: 'Alex Pratama',
    email: 'alex@cliping.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    plan: 'Pro Creator',
    clipsRemaining: 50
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?userId=user-1');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        if (data.projects.length > 0 && !selectedProject) {
          setSelectedProject(data.projects[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const handleProjectCreated = (newProj: Project) => {
    setProjects([newProj, ...projects]);
    setSelectedProject(newProj);
    setCurrentView('ai-generator');
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleOpenEditor = (clip: Clip) => {
    setSelectedClip(clip);
    setCurrentView('editor');
  };

  const handleSaveClip = (updatedClip: Clip, updatedSubtitles: SubtitleSegment[]) => {
    if (selectedProject) {
      const updatedClips = selectedProject.clips.map(c => c.id === updatedClip.id ? updatedClip : c);
      const updatedProj = { ...selectedProject, clips: updatedClips, subtitles: updatedSubtitles };
      setSelectedProject(updatedProj);
      setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setCurrentView('register');
              }
            }}
            onLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'login' && (
          <AuthView
            mode="login"
            onSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setCurrentView('dashboard');
            }}
            switchToMode={(m) => setCurrentView(m)}
          />
        )}

        {currentView === 'register' && (
          <AuthView
            mode="register"
            onSuccess={(registeredUser) => {
              setUser(registeredUser);
              setCurrentView('dashboard');
            }}
            switchToMode={(m) => setCurrentView(m)}
          />
        )}

        {currentView === 'dashboard' && user && (
          <DashboardView
            user={user}
            projects={projects}
            onStartUpload={() => setCurrentView('upload')}
            onSelectProject={(proj) => {
              setSelectedProject(proj);
              setCurrentView('ai-generator');
            }}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {currentView === 'upload' && user && (
          <UploadView
            userId={user.id}
            onProjectCreated={handleProjectCreated}
          />
        )}

        {currentView === 'ai-generator' && user && selectedProject && (
          <AiGeneratorView
            project={selectedProject}
            onClipsGenerated={(newClips) => {
              const updated = { ...selectedProject, clips: newClips };
              setSelectedProject(updated);
              setProjects(projects.map(p => p.id === updated.id ? updated : p));
            }}
            onOpenEditor={handleOpenEditor}
          />
        )}

        {currentView === 'editor' && user && selectedClip && selectedProject && (
          <VideoEditorView
            clip={selectedClip}
            subtitles={selectedProject.subtitles || []}
            onBack={() => setCurrentView('ai-generator')}
            onSaveClip={handleSaveClip}
          />
        )}

        {currentView === 'history' && user && (
          <HistoryView
            projects={projects}
            onSelectProject={(proj) => {
              setSelectedProject(proj);
              setCurrentView('ai-generator');
            }}
            onDeleteProject={handleDeleteProject}
            onOpenEditor={handleOpenEditor}
          />
        )}

        {currentView === 'settings' && user && (
          <SettingsView
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
          />
        )}
      </main>
    </div>
  );
}
