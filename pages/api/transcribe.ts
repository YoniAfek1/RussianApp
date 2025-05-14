import { NextApiRequest, NextApiResponse } from 'next';

// API: תמלול שמע (שלב עתידי)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Implement actual transcription using Whisper or similar service
    // For now, return a mock response
    const mockResponses = [
      "Привет, как дела?",
      "Я изучаю русский язык",
      "Спасибо за помощь",
      "До свидания"
    ];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    res.status(200).json({
      transcript: randomResponse,
      confidence: Math.random() * 0.5 + 0.5 // Random confidence between 0.5 and 1.0
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
}