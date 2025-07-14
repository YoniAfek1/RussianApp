import { NextApiRequest, NextApiResponse } from 'next';
import { Word, WordStatus } from '@/types/Word';
import path from 'path';
import * as XLSX from 'xlsx';

const COOKIE_NAME = 'wordStatuses';

/**
 * API endpoint handler for vocabulary data
 * Reads words from an Excel file and returns them in the required format
 * 
 * @param req - Next.js API request object
 * @param res - Next.js API response object
 * @returns JSON response with vocabulary words or error message
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Read the Excel file from the public directory
    const filePath = path.join(process.cwd(), 'public', 'data', 'Russian_Similar_Words.xlsx');
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Get saved statuses from cookie
    const savedStatuses: Record<string, WordStatus> = (() => {
      try {
        const cookie = req.cookies[COOKIE_NAME];
        return cookie ? JSON.parse(cookie) : {};
      } catch {
        return {};
      }
    })();

    /**
     * Maps Excel data to Word objects
     * Filters out entries without Russian words or Hebrew translations
     */
    const words = data.map((row: any, index: number) => {
      const id = index.toString();
      return {
        id,
        russianWord: row['Russian'] || '',
        hebrewTranslation: row['Hebrew Translation'] || '',
        hebrewTransliteration: row['תעתיק'] || '',
        status: savedStatuses[id] || 'red',
        topic: row['Topic'] || '',
        hasAssociation: Boolean(row['Association Word']),
        associationSentence: row['Association sentence'] || ''
      };
    }).filter(word => word.russianWord && word.hebrewTranslation);

    res.status(200).json(words);
  } catch (error) {
    console.error('Error reading vocabulary:', error);
    res.status(500).json({ error: 'Failed to load vocabulary' });
  }
} 