import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyBJjYZif960Nh_FccIVcngUZcSFfPq_tgA";
const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = await model.startChat({ history: messages });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);

    const reply = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('⚠️ Gemini reply is undefined. Full result:', JSON.stringify(result, null, 2));
      return res.status(500).json({ error: 'Empty reply from Gemini' });
    }

    console.log('✅ reply:', reply);
    res.status(200).json({ reply });
  } catch (err) {
    console.error('❌ API error:', err);
    res.status(500).json({ error: 'Gemini API error' });
  }
}
