import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function getFFmpeg(onLog?: (message: string) => void): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  if (onLog) {
    ffmpeg.on('log', ({ message }) => {
      onLog(message);
    });
  }

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
}

export async function trimVideo(
  videoFileOrUrl: File | string,
  startTime: number,
  endTime: number,
  aspectRatio: '9:16' | '16:9' | '1:1',
  quality: '720p' | '1080p',
  onProgress?: (progress: number) => void,
  onLog?: (msg: string) => void
): Promise<string> {
  const f = await getFFmpeg(onLog);

  let data: Uint8Array;
  if (videoFileOrUrl instanceof File) {
    data = await fetchFile(videoFileOrUrl);
  } else {
    const response = await fetch(videoFileOrUrl);
    const blob = await response.blob();
    data = await fetchFile(blob);
  }

  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  await f.writeFile(inputName, data);

  if (onProgress) {
    f.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  const duration = endTime - startTime;
  const resolutionFilter = aspectRatio === '9:16' 
    ? (quality === '1080p' ? 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2' : 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2')
    : aspectRatio === '1:1'
    ? (quality === '1080p' ? 'scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2' : 'scale=720:720:force_original_aspect_ratio=decrease,pad=720:720:(ow-iw)/2:(oh-ih)/2')
    : (quality === '1080p' ? 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2' : 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2');

  const args = [
    '-ss', startTime.toString(),
    '-i', inputName,
    '-t', duration.toString(),
    '-vf', resolutionFilter,
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-c:a', 'aac',
    outputName
  ];

  if (onLog) {
    onLog(`Executing ffmpeg ${args.join(' ')}`);
  }

  await f.exec(args);

  const outputData = await f.readFile(outputName);
  const blobData = typeof outputData === 'string' ? new TextEncoder().encode(outputData) : outputData;
  const outputBlob = new Blob([blobData as unknown as BlobPart], { type: 'video/mp4' });
  const outputUrl = URL.createObjectURL(outputBlob);

  return outputUrl;
}
