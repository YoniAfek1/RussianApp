import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';
import formidable, { Fields, Files, File } from 'formidable';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

// API: תמלול שמע (שלב עתידי)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('[API] Received transcription request');

  if (req.method !== 'POST') {
    console.error('[API] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form data
    const form = formidable({ 
      uploadDir: tmpdir(),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    console.log('[API] Starting formidable parse...');
    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) {
          console.error('[API] Formidable parse error:', err);
          reject(err);
        } else {
          console.log('[API] Formidable parsed files:', files);
          resolve([fields, files]);
        }
      });
    });

    const audioFile = files.audio;
    if (!audioFile || Array.isArray(audioFile)) {
      console.error('[API] No audio file received or multiple files received');
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Ensure we have a single file
    const file = audioFile as unknown as File;
    if (!file.filepath) {
      console.error('[API] Invalid audio file - no filepath');
      return res.status(400).json({ error: 'Invalid audio file' });
    }

    console.log('[API] Processing audio file:', {
      originalFilename: file.originalFilename,
      size: file.size,
      filepath: file.filepath
    });

    const webmPath = file.filepath;
    const wavPath = join(tmpdir(), `audio-${Date.now()}.wav`);

    // Convert webm to wav using ffmpeg
    console.log('[API] Converting webm to wav:', { webmPath, wavPath });
    await new Promise<void>((resolve, reject) => {
      exec(
        `ffmpeg -i "${webmPath}" -ar 16000 -ac 1 -f wav "${wavPath}"`,
        (error) => {
          if (error) {
            console.error('[API] FFmpeg conversion error:', error);
            reject(new Error('Audio conversion failed'));
            return;
          }
          console.log('[API] FFmpeg conversion succeeded');
          resolve();
        }
      );
    });

    // Run Python script for transcription with the wav file
    const command = `python scripts/transcribe.py "${wavPath}"`;
    console.log('[API] Running transcription command:', command);

    const pythonProcess = exec(command);
    let transcription = '';
    let error = '';

    pythonProcess.stdout?.on('data', (data) => {
      transcription += data.toString();
      console.log('[API] Python stdout:', data.toString());
    });

    pythonProcess.stderr?.on('data', (data) => {
      error += data.toString();
      console.error('[API] Python stderr:', data.toString());
    });

    return new Promise((resolve) => {
      pythonProcess.on('close', async (code) => {
        console.log('[API] Python process exited with code:', code);
        
        // Clean up temporary files
        try {
          await fs.unlink(webmPath);
          await fs.unlink(wavPath);
          console.log('[API] Temporary files cleaned up');
        } catch (err) {
          console.error('[API] Error cleaning up temporary files:', err);
        }

        if (code !== 0) {
          console.error('[API] Transcription failed:', error);
          resolve(res.status(500).json({ error: `Transcription failed: ${error}` }));
          return;
        }

        console.log('[API] Transcription result:', transcription.trim());
        resolve(res.status(200).json({ text: transcription.trim() }));
      });
    });
  } catch (error) {
    console.error('[API] Transcription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}