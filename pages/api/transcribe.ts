import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
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
    const { audioData } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // Convert base64 audio data to buffer
    const audioBuffer = Buffer.from(audioData.split(',')[1], 'base64');

    // Create temporary files for audio
    const tempDir = tmpdir();
    const webmPath = join(tempDir, `audio-${Date.now()}.webm`);
    const wavPath = join(tempDir, `audio-${Date.now()}.wav`);

    // Write the webm file
    await writeFile(webmPath, audioBuffer);

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
      pythonProcess.on('close', (code) => {
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