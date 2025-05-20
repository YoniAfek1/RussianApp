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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form data
    const form = formidable({ 
      uploadDir: tmpdir(),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const audioFile = files.audio;
    if (!audioFile || Array.isArray(audioFile)) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Ensure we have a single file
    const file = audioFile as unknown as File;
    if (!file.filepath) {
      return res.status(400).json({ error: 'Invalid audio file' });
    }

    const webmPath = file.filepath;
    const wavPath = join(tmpdir(), `audio-${Date.now()}.wav`);

    // Convert webm to wav using ffmpeg
    await new Promise<void>((resolve, reject) => {
      exec(
        `ffmpeg -i "${webmPath}" -ar 16000 -ac 1 -f wav "${wavPath}"`,
        (error) => {
          if (error) {
            console.error('FFmpeg conversion error:', error);
            reject(new Error('Audio conversion failed'));
            return;
          }
          resolve();
        }
      );
    });

    // Run Python script for transcription with the wav file
    const pythonProcess = exec(`python scripts/transcribe.py "${wavPath}"`);

    let transcription = '';
    let error = '';

    pythonProcess.stdout?.on('data', (data) => {
      transcription += data.toString();
    });

    pythonProcess.stderr?.on('data', (data) => {
      error += data.toString();
    });

    return new Promise((resolve) => {
      pythonProcess.on('close', async (code) => {
        // Clean up temporary files
        try {
          await fs.unlink(webmPath);
          await fs.unlink(wavPath);
        } catch (err) {
          console.error('Error cleaning up temporary files:', err);
        }

        if (code !== 0) {
          resolve(res.status(500).json({ error: `Transcription failed: ${error}` }));
          return;
        }

        resolve(res.status(200).json({ text: transcription.trim() }));
      });
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}