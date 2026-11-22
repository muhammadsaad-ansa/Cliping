import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI client on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-memory database for demo projects, uploads, and clips
interface Project {
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
}

interface Clip {
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

interface SubtitleSegment {
  id: string;
  start: number;
  end: number;
  text: string;
}

// Mock initial projects
const projectsStore: Map<string, Project> = new Map([
  ['proj-1', {
    id: 'proj-1',
    userId: 'user-1',
    title: 'Podcast Teknologi & Masa Depan AI Bersama Pakar (Full Episode)',
    filename: 'podcast_tech_ai_full.mp4',
    duration: 3600, // 60 mins
    fileSize: '450 MB',
    uploadDate: '2026-11-20 14:30',
    status: 'ready',
    clips: [
      {
        id: 'clip-1',
        projectId: 'proj-1',
        title: 'Mengapa AI Akan Mengubah Cara Kita Bekerja di 2027',
        description: 'Potongan klip pembahasan mengenai disrupsi AI pada dunia kerja profesional.',
        startTime: 120,
        endTime: 175,
        duration: 55,
        hookScore: 94,
        aspectRatio: '9:16',
        quality: '1080p',
        status: 'ready'
      },
      {
        id: 'clip-2',
        projectId: 'proj-1',
        title: 'Rahasia Produktif 10x Lipat Setiap Hari',
        description: 'Tips kilat mengatur fokus dan energi dalam pekerjaan kreatif.',
        startTime: 450,
        endTime: 510,
        duration: 60,
        hookScore: 89,
        aspectRatio: '9:16',
        quality: '1080p',
        status: 'ready'
      }
    ],
    subtitles: [
      { id: 'sub-1', start: 0, end: 3, text: 'Halo semuanya, selamat datang kembali di podcast teknologi.' },
      { id: 'sub-2', start: 3.2, end: 6.5, text: 'Hari ini kita akan membahas bagaimana kecerdasan buatan mengubah masa depan.' },
      { id: 'sub-3', start: 6.8, end: 10.5, text: 'Banyak orang khawatir pekerjaan mereka akan digantikan oleh robot.' }
    ]
  }]
]);

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Get user projects
app.get('/api/projects', (req, res) => {
  const userId = req.query.userId as string || 'user-1';
  const userProjects = Array.from(projectsStore.values()).filter(p => p.userId === userId);
  res.json({ projects: userProjects });
});

// Create/Upload project simulation
app.post('/api/projects', (req, res) => {
  const { title, filename, duration, fileSize, userId = 'user-1' } = req.body;
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    userId,
    title: title || 'Video Tanpa Judul',
    filename: filename || 'video.mp4',
    duration: duration || 300,
    fileSize: fileSize || '25 MB',
    uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'ready',
    clips: [],
    subtitles: [
      { id: 'sub-1', start: 0, end: 4, text: 'Selamat datang di video ini, mari kita mulai pembahasan.' },
      { id: 'sub-2', start: 4.1, end: 8, text: 'Poin utama hari ini adalah memahami potensi luar biasa dari teknologi.' }
    ]
  };
  projectsStore.set(newProject.id, newProject);
  res.json({ success: true, project: newProject });
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  if (projectsStore.has(id)) {
    projectsStore.delete(id);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// AI Clip Generator endpoint using Google Gemini API
app.post('/api/ai/analyze-video', async (req, res) => {
  try {
    const { projectId, videoTitle, transcriptSummary, duration = 300 } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ 
        error: 'API Key Gemini belum dikonfigurasi. Harap periksa Secrets di pengaturan AI Studio.' 
      });
    }

    const prompt = `Analisis transkrip atau topik video berjudul "${videoTitle || 'Video Tanpa Judul'}" dengan durasi ${duration} detik berikut. 
    Tugas Anda adalah mengidentifikasi 3 hingga 5 segmen klip pendek paling menarik (viral potential) untuk platform TikTok, Instagram Reels, atau YouTube Shorts.
    
    Berikan hasil dalam format JSON array yang berisi objek dengan properti berikut:
    - title: Judul klip yang menarik dan memancing rasa ingin tahu (dalam Bahasa Indonesia)
    - description: Deskripsi singkat klip
    - startTime: Waktu mulai dalam detik (angka)
    - endTime: Waktu selesai dalam detik (angka, durasi klip antara 15 sampai 60 detik)
    - hookScore: Skor potensi menarik perhatian dari 1 sampai 100 (angka)
    - aspectRatio: Rekomendasi rasio video (pilih "9:16")
    - suggestedSubtitle: Cuplikan subtitle utama untuk klip ini
    
    Konteks/Topik tambahan: ${transcriptSummary || 'Video edukasi dan diskusi menarik.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              startTime: { type: Type.NUMBER },
              endTime: { type: Type.NUMBER },
              hookScore: { type: Type.NUMBER },
              aspectRatio: { type: Type.STRING },
              suggestedSubtitle: { type: Type.STRING }
            },
            required: ['title', 'description', 'startTime', 'endTime', 'hookScore', 'aspectRatio']
          }
        }
      }
    });

    const jsonText = response.text || '[]';
    const recommendedClips = JSON.parse(jsonText);

    // Save generated clips to project if projectId exists
    if (projectId && projectsStore.has(projectId)) {
      const proj = projectsStore.get(projectId)!;
      const newClips: Clip[] = recommendedClips.map((c: any, index: number) => ({
        id: `clip-ai-${Date.now()}-${index}`,
        projectId,
        title: c.title,
        description: c.description,
        startTime: c.startTime,
        endTime: Math.min(c.endTime, c.startTime + 60),
        duration: Math.min(c.endTime - c.startTime, 60),
        hookScore: c.hookScore || 90,
        aspectRatio: '9:16',
        quality: '1080p',
        status: 'ready'
      }));
      proj.clips = [...proj.clips, ...newClips];
      projectsStore.set(projectId, proj);
    }

    res.json({ success: true, clips: recommendedClips });
  } catch (error: any) {
    console.error('Gemini AI analysis error:', error);
    res.status(500).json({ error: error.message || 'Gagal menganalisis video dengan AI.' });
  }
});

// Auto-Subtitle generation endpoint
app.post('/api/ai/transcribe', async (req, res) => {
  try {
    const { videoTitle, textContent } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'API Key Gemini belum dikonfigurasi.' });
    }

    const prompt = `Buatlah transkrip subtitle otomatis berformat waktu (mulai dan selesai dalam detik) dalam Bahasa Indonesia untuk video berjudul "${videoTitle || 'Video'}". 
    Buat sekitar 6 sampai 10 baris subtitle yang berurutan dari detik 0 sampai 60.
    Setiap baris memiliki start, end, dan text.
    Format JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              start: { type: Type.NUMBER },
              end: { type: Type.NUMBER },
              text: { type: Type.STRING }
            },
            required: ['start', 'end', 'text']
          }
        }
      }
    });

    const subtitles = JSON.parse(response.text || '[]');
    res.json({ success: true, subtitles });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan transkrip subtitle.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CLIPING AI Server running on port ${PORT}`);
  });
}

startServer();
