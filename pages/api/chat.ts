import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body; // messages: [{role, content}, ...]
  if (!messages) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  // Debug logging
  console.log('🔑 API_KEY present:', !!process.env.API_KEY);
  console.log('📝 Incoming prompt:', messages[messages.length - 1]?.content);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = await model.startChat({ history: messages });
    const result = await chat.sendMessage(messages[messages.length - 1].content);
    console.log('🤖 Gemini API result:', JSON.stringify(result, null, 2));
    const reply = result.response.text();
    res.status(200).json({ reply });
  } catch (err) {
    console.error('❌ Gemini API error:', err);
    res.status(500).json({ error: 'Gemini API error' });
  }
} 