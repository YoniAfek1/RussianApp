import { NextApiRequest, NextApiResponse } from 'next';

type Status = 'red' | 'yellow' | 'green' | null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wordId, status } = req.body;

    if (!wordId || (status !== 'red' && status !== 'yellow' && status !== 'green' && status !== null)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Get existing statuses from cookies
    const savedStatuses = JSON.parse(req.cookies.wordStatuses || '{}');

    // Update the status
    savedStatuses[wordId] = status;

    // Set the cookie with updated statuses
    res.setHeader('Set-Cookie', `wordStatuses=${JSON.stringify(savedStatuses)}; Path=/; Max-Age=31536000`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving status:', error);
    res.status(500).json({ error: 'Failed to save status' });
  }
}