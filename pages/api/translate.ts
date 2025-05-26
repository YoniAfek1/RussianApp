import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

// Cache translations for the current session
const translationCache = new Map<string, string>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check cache first
    if (translationCache.has(text)) {
      return res.json({ translation: translationCache.get(text) });
    }

    // Call Python script for translation
    const pythonScript = path.join(process.cwd(), 'lib', 'translate.py');
    const pythonProcess = spawn('python', [pythonScript, text]);

    let translation = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      translation += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(null);
        } else {
          reject(new Error(`Python process exited with code ${code}`));
        }
      });
    });

    if (error) {
      console.error('Translation error:', error);
      return res.status(500).json({ error: 'Translation failed' });
    }

    // Cache the translation
    translationCache.set(text, translation);

    res.json({ translation });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 