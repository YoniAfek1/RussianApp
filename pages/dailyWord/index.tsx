import { useEffect, useState } from 'react';
import styles from '../../styles/DailyWord.module.css';
import * as XLSX from 'xlsx';
import { FaVolumeUp, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface DailyWordRow {
  Russian: string;
  Hebrew: string;
  Transliteration: string;
  Association: string;
  Icon: string;
}

export default function DailyWordPage() {
  const [words, setWords] = useState<DailyWordRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        setError(null);
        console.log('Starting to fetch Excel file...');
        
        // Debug: Log the current URL and path
        console.log('Current URL:', window.location.href);
        console.log('Attempting to fetch from:', '/data/Russian_Daily_Word.xlsx');
        
        // Try to fetch the file
        let response;
        try {
          response = await fetch('/data/Russian_Daily_Word.xlsx', {
            method: 'GET',
            headers: {
              'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
          });
          
          if (!response.ok) {
            console.error('Response not OK:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`Failed to fetch Excel file: ${response.status} ${response.statusText}`);
          }
        } catch (err: any) {
          console.error('Error details:', {
            name: err?.name || 'Unknown error',
            message: err?.message || 'No error message',
            stack: err?.stack || 'No stack trace'
          });
          throw new Error('Failed to access the Excel file. Please check the browser console for details.');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch Excel file: ${response.status} ${response.statusText}. Please ensure the file exists in the public/data directory.`);
        }
        
        // Get the file as array buffer
        const arrayBuffer = await response.arrayBuffer();
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error('Received empty file');
        }
        
        // Parse the Excel file
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('No sheets found in workbook');
        }
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        if (!jsonData || jsonData.length === 0) {
          throw new Error('No data found in sheet');
        }
        
        // Log the data structure
        console.log('First row of raw data:', jsonData[0]);
        
        // Transform the data to match our interface
        const transformedData = jsonData.map((row: any) => ({
          Russian: row['מילה אחת'] || row['Russian'] || '',
          Hebrew: row['Hebrew'] || '',
          Transliteration: row['Transliteration'] || '',
          Association: row['Association'] || '',
          Icon: row['Icon'] || ''
        }));
        
        console.log('Transformed first row:', transformedData[0]);
        console.log('Total rows:', transformedData.length);
        
        setWords(transformedData);
      } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error occurred';
        console.error('Error loading Excel file:', errorMessage);
        setError(errorMessage);
      }
    };

    loadExcel();
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setFlipped(false);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    setFlipped(false);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>שגיאה בטעינת הנתונים</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!words.length) {
    return <div className={styles.loading}>טוען...</div>;
  }

  const word = words[currentIndex];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>מילה יומית 💡</h1>
      <div className={styles.card} onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <div className={styles.front}>
            <div className={styles.bigWord}>{word.Hebrew}</div>
            <div className={styles.icon}>{word.Icon}</div>
            <button className={styles.speakButton} onClick={(e) => { e.stopPropagation(); speak(word.Russian); }}>
              <FaVolumeUp />
            </button>
          </div>
        ) : (
          <div className={styles.back}>
            <div className={styles.russian}>{word.Russian}</div>
            <div className={styles.transliteration}>{word.Transliteration}</div>
            <div className={styles.association}>{word.Association}</div>
          </div>
        )}
      </div>

      <div className={styles.navigation}>
        <button onClick={prev}><FaArrowLeft /></button>
        <button onClick={next}><FaArrowRight /></button>
      </div>
    </div>
  );
}
