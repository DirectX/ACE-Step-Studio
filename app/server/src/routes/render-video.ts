import { Router, Request, Response } from 'express';
import { execSync, spawn } from 'child_process';
import { writeFile, mkdir, readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findFfmpeg(): string {
  // Check portable ffmpeg
  const portable = path.resolve(__dirname, '../../../../ffmpeg/ffmpeg.exe');
  if (existsSync(portable)) return portable;
  // Check system ffmpeg
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {
    throw new Error('ffmpeg not found');
  }
}

// Check if NVENC is available
function hasNvenc(ffmpegPath: string): boolean {
  try {
    const result = execSync(`"${ffmpegPath}" -encoders 2>&1`, { encoding: 'utf-8', timeout: 5000 });
    return result.includes('h264_nvenc');
  } catch {
    return false;
  }
}

router.post('/encode', async (req: Request, res: Response) => {
  const { frames, audioUrl, fps = 30 } = req.body;

  if (!frames || !frames.length) {
    res.status(400).json({ error: 'No frames provided' });
    return;
  }

  const tmpDir = path.join(__dirname, '../../tmp', `render_${Date.now()}`);

  try {
    const ffmpegPath = findFfmpeg();
    const useNvenc = hasNvenc(ffmpegPath);
    console.log(`[Render] ${frames.length} frames, ffmpeg: ${ffmpegPath}, nvenc: ${useNvenc}`);

    await mkdir(tmpDir, { recursive: true });

    // Write frames
    for (let i = 0; i < frames.length; i++) {
      const frameData = Buffer.from(frames[i], 'base64');
      await writeFile(path.join(tmpDir, `frame${String(i).padStart(6, '0')}.jpg`), frameData);
    }

    // Download audio
    const audioPath = path.join(tmpDir, 'audio.mp3');
    if (audioUrl.startsWith('/')) {
      // Local audio file
      const localAudioPath = path.join(__dirname, '../../public', audioUrl);
      if (existsSync(localAudioPath)) {
        const audioData = await readFile(localAudioPath);
        await writeFile(audioPath, audioData);
      }
    }

    const outputPath = path.join(tmpDir, 'output.mp4');

    // Build ffmpeg command
    const args = [
      '-framerate', String(fps),
      '-i', path.join(tmpDir, 'frame%06d.jpg'),
    ];

    if (existsSync(audioPath)) {
      args.push('-i', audioPath);
    }

    if (useNvenc) {
      args.push('-c:v', 'h264_nvenc', '-preset', 'p4', '-rc', 'vbr', '-cq', '28');
    } else {
      args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '23');
    }

    args.push(
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k',
      '-shortest',
      '-movflags', '+faststart',
      '-y',
      outputPath,
    );

    console.log(`[Render] Running: ffmpeg ${args.join(' ')}`);

    await new Promise<void>((resolve, reject) => {
      const proc = spawn(ffmpegPath, args, { stdio: 'pipe' });
      let stderr = '';
      proc.stderr?.on('data', d => { stderr += d.toString(); });
      proc.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`));
      });
      proc.on('error', reject);
    });

    // Read output and send
    const videoData = await readFile(outputPath);
    console.log(`[Render] Done: ${videoData.length} bytes`);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.send(videoData);

  } catch (error: any) {
    console.error('[Render] Failed:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    // Cleanup
    try { await rm(tmpDir, { recursive: true, force: true }); } catch {}
  }
});

export default router;
