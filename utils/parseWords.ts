import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export interface Word {
  id: string;
  russian: string;
  translation: string;
  hint?: string;
  status: 'red' | 'yellow' | 'green' | null;
}

export async function parseWords(): Promise<Word[]> {
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
    const savedStatuses = JSON.parse(localStorage.getItem('wordStatuses') || '{}');

    // Combine and format the data
    const formattedWords: Word[] = [
      ...similarWords.map((word: any) => ({
        id: `similar_${word.Russian}`,
        russian: word.Russian,
        translation: word.English,
        hint: word.Hint,
        status: savedStatuses[`similar_${word.Russian}`] || null
      })),
      ...associationWords.map((word: any) => ({
        id: `association_${word.Russian}`,
        russian: word.Russian,
        translation: word.English,
        hint: word.Hint,
        status: savedStatuses[`association_${word.Russian}`] || null
      }))
    ];

    return formattedWords;
  } catch (error) {
    console.error('Error parsing words:', error);
    throw new Error('Failed to parse words');
  }
}