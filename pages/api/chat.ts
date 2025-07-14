import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body; // messages: [{role, content}, ...]
  if (!messages) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = await model.startChat({ history: messages });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const reply = result.response.text();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Gemini API error' });
  }
} 