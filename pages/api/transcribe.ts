import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';
import formidable, { Fields, Files, File } from 'formidable';
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[API] Received transcription request');

  if (req.method !== 'POST') {
    console.error('[API] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: tmpdir(),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
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
    if (!audioFile) {
      console.error('[API] No audio file received');
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const file = Array.isArray(audioFile) ? audioFile[0] : audioFile;
    if (!file || !file.filepath) {
      console.error('[API] Invalid audio file - no filepath');
      return res.status(400).json({ error: 'Invalid audio file' });
    }

    console.log('[API] Processing audio file:', {
      originalFilename: file.originalFilename,
      size: file.size,
      filepath: file.filepath
    });

    const wavPath = file.filepath;

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
        
        try {
          await fs.unlink(wavPath);
          console.log('[API] Temporary file cleaned up');
        } catch (err) {
          console.error('[API] Error cleaning up temporary file:', err);
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
