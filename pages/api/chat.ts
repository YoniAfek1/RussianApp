import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debugLog: string[] = [];

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', debugLog });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    debugLog.push('❌ Invalid or missing messages');
    return res.status(400).json({ error: 'No messages provided', debugLog });
  }

  try {
    debugLog.push('🚀 Sending initial prompt to Gemini');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = await model.startChat({ history: messages });
    const result = await chat.sendMessage(messages[messages.length - 1].content);

    debugLog.push(`📦 Gemini raw response: ${JSON.stringify(result)}`);

    const reply = await result.response.text();  // חשוב: await

    debugLog.push(`✅ Gemini replied: ${reply}`);
    return res.status(200).json({ reply, debugLog });
  } catch (err) {
    console.error('❌ Gemini API error:', err);
    debugLog.push(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
    return res.status(500).json({ error: 'Gemini API error', debugLog });
  }
}
