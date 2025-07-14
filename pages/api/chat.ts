import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = await model.startChat({ history: messages });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const text = result.response.text();

    res.status(200).json({ reply: text });
  } catch (err: any) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Gemini API error', detail: err.message });
  }
}
