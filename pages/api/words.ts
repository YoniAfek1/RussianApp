import { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// API: מחזיר רשימת מילים מהקובץ או מסד נתונים
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read both Excel files
    const similarWordsPath = path.join(process.cwd(), 'public/data/Russian_Similar_Words.xlsx');
    const associationWordsPath = path.join(process.cwd(), 'public/data/Russian_Association_Words.xlsx');

    const similarWordsBuffer = fs.readFileSync(similarWordsPath);
    const associationWordsBuffer = fs.readFileSync(associationWordsPath);

    // Parse Excel files
    const similarWorkbook = XLSX.read(similarWordsBuffer);
    const associationWorkbook = XLSX.read(associationWordsBuffer);

    // Get the first sheet from each workbook
    const similarSheet = similarWorkbook.Sheets[similarWorkbook.SheetNames[0]];
    const associationSheet = associationWorkbook.Sheets[associationWorkbook.SheetNames[0]];

    // Convert to JSON
    const similarWords = XLSX.utils.sheet_to_json(similarSheet);
    const associationWords = XLSX.utils.sheet_to_json(associationSheet);

    // Get saved statuses from localStorage (mocked for now)
    const savedStatuses = JSON.parse(req.cookies.wordStatuses || '{}');

    // Combine and format the data
    const formattedWords = [
      ...similarWords.map((word: any) => ({
        id: `similar_${word.Russian}`,
        russian: word.Russian,
        translation: word.English,
        type: 'similar',
        status: savedStatuses[`similar_${word.Russian}`] || null
      })),
      ...associationWords.map((word: any) => ({
        id: `association_${word.Russian}`,
        russian: word.Russian,
        translation: word.English,
        type: 'association',
        status: savedStatuses[`association_${word.Russian}`] || null
      }))
    ];

    res.status(200).json({ words: formattedWords });
  } catch (error) {
    console.error('Error loading words:', error);
    res.status(500).json({ error: 'Failed to load words' });
  }
}