export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free Trial' | 'Pro Creator' | 'Agency Enterprise';
  clipsRemaining: number;
}

export interface Clip {
  id: string;
  projectId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  duration: number;
  hookScore: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  quality: '720p' | '1080p';
  status: 'generated' | 'rendering' | 'ready';
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface SubtitleSegment {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  filename: string;
  duration: number;
  fileSize: string;
  uploadDate: string;
  status: 'ready' | 'analyzing' | 'processing' | 'error';
  clips: Clip[];
  subtitles: SubtitleSegment[];
  videoUrl?: string;
}

export interface Activity {
  id: string;
  type: 'upload' | 'ai_analyze' | 'clip_export' | 'subtitle';
  description: string;
  timestamp: string;
}
