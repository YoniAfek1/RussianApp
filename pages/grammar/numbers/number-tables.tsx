import { useState } from 'react';
import styles from '../../../styles/Grammar.module.css';
import { LightbulbToggle } from '../../../components/LightbulbToggle';

interface NumberEntry {
  digit: number;
  hebrew: string;
  transliteration: string;
  russian: string;
  notes?: string; // Optional pronunciation notes for tooltip
}

// Numbers data by ranges
const NUMBERS_DATA: { [key: string]: NumberEntry[] } = {
  '0-9': [
    { digit: 0, hebrew: 'אפס', transliteration: 'נוּל', russian: 'ноль' },
    { digit: 1, hebrew: 'אחד', transliteration: 'אַדִין', russian: 'один' },
    { digit: 2, hebrew: 'שתיים', transliteration: 'דְוַה', russian: 'два' },
    { digit: 3, hebrew: 'שלוש', transliteration: 'טְרִי', russian: 'три' },
    { digit: 4, hebrew: 'ארבע', transliteration: 'צֶטִירֶה', russian: 'четыре' },
    { digit: 5, hebrew: 'חמש', transliteration: 'פּיַט', russian: 'пять' },
    { digit: 6, hebrew: 'שש', transliteration: 'שֶׁסְט', russian: 'шесть' },
    { digit: 7, hebrew: 'שבע', transliteration: 'סֶם', russian: 'семь' },
    { digit: 8, hebrew: 'שמונה', transliteration: 'ווֹסֶם', russian: 'восемь' },
    { digit: 9, hebrew: 'תשע', transliteration: 'דֶבְּיַט', russian: 'девять' }
  ],
  '10-19': [
    { digit: 10, hebrew: 'עשר', transliteration: 'דֶסְיַט', russian: 'десять' },
    { digit: 11, hebrew: 'אחת עשרה', transliteration: 'אַדִינַצַט', russian: 'одиннадцать' },
    { digit: 12, hebrew: 'שתים עשרה', transliteration: 'דְוֶנַצַט', russian: 'двенадцать' },
    { digit: 13, hebrew: 'שלוש עשרה', transliteration: 'טְרִינַצַט', russian: 'тринадцать' },
    { digit: 14, hebrew: 'ארבע עשרה', transliteration: 'צֶטִירְנַצַט', russian: 'четырнадцать' },
    { digit: 15, hebrew: 'חמש עשרה', transliteration: 'פּיַטְנַצַט', russian: 'пятнадцать' },
    { digit: 16, hebrew: 'שש עשרה', transliteration: 'שֶׁסְנַצַט', russian: 'шестнадцать' },
    { digit: 17, hebrew: 'שבע עשרה', transliteration: 'סֶמְנַצַט', russian: 'семнадцать' },
    { digit: 18, hebrew: 'שמונה עשרה', transliteration: 'וַסֶמְנַצַט', russian: 'восемнадцать' },
    { digit: 19, hebrew: 'תשע עשרה', transliteration: 'דֶבְּיַטְנַצַט', russian: 'девятнадцать' }
  ],
  '20-29': [
    { digit: 20, hebrew: 'עשרים', transliteration: 'דְוַצַט', russian: 'двадцать' },
    { digit: 21, hebrew: 'עשרים ואחת', transliteration: 'דְוַצַט אַדִין', russian: 'двадцать один' },
    { digit: 22, hebrew: 'עשרים ושתיים', transliteration: 'דְוַצַט דְוַה', russian: 'двадцать два' },
    { digit: 23, hebrew: 'עשרים ושלוש', transliteration: 'דְוַצַט טְרִי', russian: 'двадцать три' },
    { digit: 24, hebrew: 'עשרים וארבע', transliteration: 'דְוַצַט צֶטִירֶה', russian: 'двадцать четыре' },
    { digit: 25, hebrew: 'עשרים וחמש', transliteration: 'דְוַצַט פּיַט', russian: 'двадцать пять' },
    { digit: 26, hebrew: 'עשרים ושש', transliteration: 'דְוַצַט שֶׁסְט', russian: 'двадцать шесть' },
    { digit: 27, hebrew: 'עשרים ושבע', transliteration: 'דְוַצַט סֶם', russian: 'двадцать семь' },
    { digit: 28, hebrew: 'עשרים ושמונה', transliteration: 'דְוַצַט ווֹסֶם', russian: 'двадцать восемь' },
    { digit: 29, hebrew: 'עשרים ותשע', transliteration: 'דְוַצַט דֶבְּיַט', russian: 'двадцать девять' }
  ],
  '30-39': [
    { digit: 30, hebrew: 'שלושים', transliteration: 'טְרִיצַט', russian: 'тридцать' },
    { digit: 31, hebrew: 'שלושים ואחת', transliteration: 'טְרִיצַט אַדִין', russian: 'тридцать один' },
    { digit: 32, hebrew: 'שלושים ושתיים', transliteration: 'טְרִיצַט דְוַה', russian: 'тридцать два' },
    { digit: 33, hebrew: 'שלושים ושלוש', transliteration: 'טְרִיצַט טְרִי', russian: 'тридцать три' },
    { digit: 34, hebrew: 'שלושים וארבע', transliteration: 'טְרִיצַט צֶטִירֶה', russian: 'тридцать четыре' },
    { digit: 35, hebrew: 'שלושים וחמש', transliteration: 'טְרִיצַט פּיַט', russian: 'тридцать пять' },
    { digit: 36, hebrew: 'שלושים ושש', transliteration: 'טְרִיצַט שֶׁסְט', russian: 'тридцать шесть' },
    { digit: 37, hebrew: 'שלושים ושבע', transliteration: 'טְרִיצַט סֶם', russian: 'тридцать семь' },
    { digit: 38, hebrew: 'שלושים ושמונה', transliteration: 'טְרִיצַט ווֹסֶם', russian: 'тридцать восемь' },
    { digit: 39, hebrew: 'שלושים ותשע', transliteration: 'טְרִיצַט דֶבְּיַט', russian: 'тридцать девять' }
  ],
  '40-49': [
    { digit: 40, hebrew: 'ארבעים', transliteration: 'סוֹרַק', russian: 'сорок', notes: 'צורה מיוחדת, לא מבוססת על המספר 4' },
    { digit: 41, hebrew: 'ארבעים ואחת', transliteration: 'סוֹרַק אַדִין', russian: 'сорок один' },
    { digit: 42, hebrew: 'ארבעים ושתיים', transliteration: 'סוֹרַק דְוַה', russian: 'сорок два' },
    { digit: 43, hebrew: 'ארבעים ושלוש', transliteration: 'סוֹרַק טְרִי', russian: 'сорок три' },
    { digit: 44, hebrew: 'ארבעים וארבע', transliteration: 'סוֹרַק צֶטִירֶה', russian: 'сорок четыре' },
    { digit: 45, hebrew: 'ארבעים וחמש', transliteration: 'סוֹרַק פּיַט', russian: 'сорок пять' },
    { digit: 46, hebrew: 'ארבעים ושש', transliteration: 'סוֹרַק שֶׁסְט', russian: 'сорок шесть' },
    { digit: 47, hebrew: 'ארבעים ושבע', transliteration: 'סוֹרַק סֶם', russian: 'сорок семь' },
    { digit: 48, hebrew: 'ארבעים ושמונה', transliteration: 'סוֹרַק ווֹסֶם', russian: 'сорок восемь' },
    { digit: 49, hebrew: 'ארבעים ותשע', transliteration: 'סוֹרַק דֶבְּיַט', russian: 'сорок девять' }
  ],
  '50-59': [
    { digit: 50, hebrew: 'חמישים', transliteration: 'פּיַדְיֶסַט', russian: 'пятьдесят' },
    { digit: 51, hebrew: 'חמישים ואחת', transliteration: 'פּיַדְיֶסַט אַדִין', russian: 'пятьдесят один' },
    { digit: 52, hebrew: 'חמישים ושתיים', transliteration: 'פּיַדְיֶסַט דְוַה', russian: 'пятьдесят два' },
    { digit: 53, hebrew: 'חמישים ושלוש', transliteration: 'פּיַדְיֶסַט טְרִי', russian: 'пятьдесят три' },
    { digit: 54, hebrew: 'חמישים וארבע', transliteration: 'פּיַדְיֶסַט צֶטִירֶה', russian: 'пятьдесят четыре' },
    { digit: 55, hebrew: 'חמישים וחמש', transliteration: 'פּיַדְיֶסַט פּיַט', russian: 'пятьдесят пять' },
    { digit: 56, hebrew: 'חמישים ושש', transliteration: 'פּיַדְיֶסַט שֶׁסְט', russian: 'пятьдесят шесть' },
    { digit: 57, hebrew: 'חמישים ושבע', transliteration: 'פּיַדְיֶסַט סֶם', russian: 'пятьдесят семь' },
    { digit: 58, hebrew: 'חמישים ושמונה', transliteration: 'פּיַדְיֶסַט ווֹסֶם', russian: 'пятьдесят восемь' },
    { digit: 59, hebrew: 'חמישים ותשע', transliteration: 'פּיַדְיֶסַט דֶבְּיַט', russian: 'пятьдесят девять' }
  ],
  '60-69': [
    { digit: 60, hebrew: 'שישים', transliteration: 'שֶׁסְדְיֶסַט', russian: 'шестьдесят' },
    { digit: 61, hebrew: 'שישים ואחת', transliteration: 'שֶׁסְדְיֶסַט אַדִין', russian: 'шестьдесят один' },
    { digit: 62, hebrew: 'שישים ושתיים', transliteration: 'שֶׁסְדְיֶסַט דְוַה', russian: 'шестьдесят два' },
    { digit: 63, hebrew: 'שישים ושלוש', transliteration: 'שֶׁסְדְיֶסַט טְרִי', russian: 'шестьдесят три' },
    { digit: 64, hebrew: 'שישים וארבע', transliteration: 'שֶׁסְדְיֶסַט צֶטִירֶה', russian: 'шестьдесят четыре' },
    { digit: 65, hebrew: 'שישים וחמש', transliteration: 'שֶׁסְדְיֶסַט פּיַט', russian: 'шестьдесят пять' },
    { digit: 66, hebrew: 'שישים ושש', transliteration: 'שֶׁסְדְיֶסַט שֶׁסְט', russian: 'шестьдесят шесть' },
    { digit: 67, hebrew: 'שישים ושבע', transliteration: 'שֶׁסְדְיֶסַט סֶם', russian: 'шестьдесят семь' },
    { digit: 68, hebrew: 'שישים ושמונה', transliteration: 'שֶׁסְדְיֶסַט ווֹסֶם', russian: 'шестьдесят восемь' },
    { digit: 69, hebrew: 'שישים ותשע', transliteration: 'שֶׁסְדְיֶסַט דֶבְּיַט', russian: 'шестьдесят девять' }
  ],
  '70-79': [
    { digit: 70, hebrew: 'שבעים', transliteration: 'סֶמְדְיֶסַט', russian: 'семьдесят' },
    { digit: 71, hebrew: 'שבעים ואחת', transliteration: 'סֶמְדְיֶסַט אַדִין', russian: 'семьдесят один' },
    { digit: 72, hebrew: 'שבעים ושתיים', transliteration: 'סֶמְדְיֶסַט דְוַה', russian: 'семьдесят два' },
    { digit: 73, hebrew: 'שבעים ושלוש', transliteration: 'סֶמְדְיֶסַט טְרִי', russian: 'семьдесят три' },
    { digit: 74, hebrew: 'שבעים וארבע', transliteration: 'סֶמְדְיֶסַט צֶטִירֶה', russian: 'семьдесят четыре' },
    { digit: 75, hebrew: 'שבעים וחמש', transliteration: 'סֶמְדְיֶסַט פּיַט', russian: 'семьдесят пять' },
    { digit: 76, hebrew: 'שבעים ושש', transliteration: 'סֶמְדְיֶסַט שֶׁסְט', russian: 'семьдесят шесть' },
    { digit: 77, hebrew: 'שבעים ושבע', transliteration: 'סֶמְדְיֶסַט סֶם', russian: 'семьдесят семь' },
    { digit: 78, hebrew: 'שבעים ושמונה', transliteration: 'סֶמְדְיֶסַט ווֹסֶם', russian: 'семьдесят восемь' },
    { digit: 79, hebrew: 'שבעים ותשע', transliteration: 'סֶמְדְיֶסַט דֶבְּיַט', russian: 'семьдесят девять' }
  ],
  '80-89': [
    { digit: 80, hebrew: 'שמונים', transliteration: 'ווֹסֶמְדְיֶסַט', russian: 'восемьдесят' },
    { digit: 81, hebrew: 'שמונים ואחת', transliteration: 'ווֹסֶמְדְיֶסַט אַדִין', russian: 'восемьдесят один' },
    { digit: 82, hebrew: 'שמונים ושתיים', transliteration: 'ווֹסֶמְדְיֶסַט דְוַה', russian: 'восемьдесят два' },
    { digit: 83, hebrew: 'שמונים ושלוש', transliteration: 'ווֹסֶמְדְיֶסַט טְרִי', russian: 'восемьдесят три' },
    { digit: 84, hebrew: 'שמונים וארבע', transliteration: 'ווֹסֶמְדְיֶסַט צֶטִירֶה', russian: 'восемьдесят четыре' },
    { digit: 85, hebrew: 'שמונים וחמש', transliteration: 'ווֹסֶמְדְיֶסַט פּיַט', russian: 'восемьдесят пять' },
    { digit: 86, hebrew: 'שמונים ושש', transliteration: 'ווֹסֶמְדְיֶסַט שֶׁסְט', russian: 'восемьдесят шесть' },
    { digit: 87, hebrew: 'שמונים ושבע', transliteration: 'ווֹסֶמְדְיֶסַט סֶם', russian: 'восемьдесят семь' },
    { digit: 88, hebrew: 'שמונים ושמונה', transliteration: 'ווֹסֶמְדְיֶסַט ווֹסֶם', russian: 'восемьдесят восемь' },
    { digit: 89, hebrew: 'שמונים ותשע', transliteration: 'ווֹסֶמְדְיֶסַט דֶבְּיַט', russian: 'восемьдесят девять' }
  ],
  '90-99': [
    { digit: 90, hebrew: 'תשעים', transliteration: 'דִיבִינוֹסְטַה', russian: 'девяносто' },
    { digit: 91, hebrew: 'תשעים ואחת', transliteration: 'דִיבִינוֹסְטַה אַדִין', russian: 'девяносто один' },
    { digit: 92, hebrew: 'תשעים ושתיים', transliteration: 'דִיבִינוֹסְטַה דְוַה', russian: 'девяносто два' },
    { digit: 93, hebrew: 'תשעים ושלוש', transliteration: 'דִיבִינוֹסְטַה טְרִי', russian: 'девяносто три' },
    { digit: 94, hebrew: 'תשעים וארבע', transliteration: 'דִיבִינוֹסְטַה צֶטִירֶה', russian: 'девяносто четыре' },
    { digit: 95, hebrew: 'תשעים וחמש', transliteration: 'דִיבִינוֹסְטַה פּיַט', russian: 'девяносто пять' },
    { digit: 96, hebrew: 'תשעים ושש', transliteration: 'דִיבִינוֹסְטַה שֶׁסְט', russian: 'девяносто шесть' },
    { digit: 97, hebrew: 'תשעים ושבע', transliteration: 'דִיבִינוֹסְטַה סֶם', russian: 'девяносто семь' },
    { digit: 98, hebrew: 'תשעים ושמונה', transliteration: 'דִיבִינוֹסְטַה ווֹסֶם', russian: 'девяносто восемь' },
    { digit: 99, hebrew: 'תשעים ותשע', transliteration: 'דִיבִינוֹסְטַה דֶבְּיַט', russian: 'девяносто девять' }
  ],
  'עשרות': [
    { digit: 10, hebrew: 'עשר', transliteration: 'דֶסְיַט', russian: 'десять', notes: 'משמש גם כבסיס למספרים 11-19' },
    { digit: 20, hebrew: 'עשרים', transliteration: 'דְוַצַט', russian: 'двадцать' },
    { digit: 30, hebrew: 'שלושים', transliteration: 'טְרִיצַט', russian: 'тридцать' },
    { digit: 40, hebrew: 'ארבעים', transliteration: 'סוֹרַק', russian: 'сорок', notes: 'צורה מיוחדת, לא מבוססת על המספר 4' },
    { digit: 50, hebrew: 'חמישים', transliteration: 'פּיַדְיֶסַט', russian: 'пятьдесят' },
    { digit: 60, hebrew: 'שישים', transliteration: 'שֶׁסְדְיֶסַט', russian: 'шестьдесят' },
    { digit: 70, hebrew: 'שבעים', transliteration: 'סֶמְדְיֶסַט', russian: 'семьдесят' },
    { digit: 80, hebrew: 'שמונים', transliteration: 'ווֹסֶמְדְיֶסַט', russian: 'восемьдесят' },
    { digit: 90, hebrew: 'תשעים', transliteration: 'דִיבִינוֹסְטַה', russian: 'девяносто' },
    { digit: 100, hebrew: 'מאה', transliteration: 'סְטוֹ', russian: 'сто' }
  ],
  'מאות': [
    { digit: 100, hebrew: 'מאה', transliteration: 'סְטוֹ', russian: 'сто' },
    { digit: 200, hebrew: 'מאתיים', transliteration: 'דְבֵיסְטִי', russian: 'двести', notes: 'שים לב לשינוי הסיומת' },
    { digit: 300, hebrew: 'שלוש מאות', transliteration: 'טְרִיסְטַה', russian: 'триста' },
    { digit: 400, hebrew: 'ארבע מאות', transliteration: 'צֶטִירֶסְטַה', russian: 'четыреста' },
    { digit: 500, hebrew: 'חמש מאות', transliteration: 'פְּיַטְסוֹט', russian: 'пятьсот' },
    { digit: 600, hebrew: 'שש מאות', transliteration: 'שֶׁסְטְסוֹט', russian: 'шестьсот' },
    { digit: 700, hebrew: 'שבע מאות', transliteration: 'סֶמְסוֹט', russian: 'семьсот' },
    { digit: 800, hebrew: 'שמונה מאות', transliteration: 'ווֹסֶמְסוֹט', russian: 'восемьсот' },
    { digit: 900, hebrew: 'תשע מאות', transliteration: 'דֶבְיַטְסוֹט', russian: 'девятьсот' },
    { digit: 1000, hebrew: 'אלף', transliteration: 'טִיסְיַצַ`ה', russian: 'тысяча', notes: 'מילה נפרדת לגמרי, לא מבוססת על המספר 1000' }
  ]
};

// Update range groups to include all ranges
const RANGE_GROUPS = {
  'יחידות ועשרות': [
    '0-9', '10-19', '20-29', '30-39', '40-49', 
    '50-59', '60-69', '70-79', '80-89', '90-99'
  ],
  'מספרים מיוחדים': ['עשרות', 'מאות']
};

const RULE_TEXTS = {
  'עשרות': '💡 ברוב העשרות ברוסית, הסיומת של המספר היא "עשרים", "שלושים" וכו\' – ומסתיימת ב־"цать" או "десят", מה שמזכיר את המילה "עשר".',
  'מאות': '💡 במספרי מאות ברוסית, השורש של המספר מופיע לפני הסיומת "сто" (שמשמעותה "מאה"), והיא חוזרת בכל מילה.'
};

export const NumberTables = () => {
  const [selectedRange, setSelectedRange] = useState('0-9');

  return (
    <div className={styles.numberTablesContainer}>
      {/* Range Navigation */}
      <div className={styles.rangeGroups}>
        {Object.entries(RANGE_GROUPS).map(([groupName, ranges]) => (
          <div key={groupName} className={styles.rangeGroup}>
            <h3 className={styles.rangeGroupTitle}>{groupName}</h3>
            <div className={styles.rangeNavigation}>
              {ranges.map((range) => (
                <button
                  key={range}
                  className={`${styles.rangeButton} ${selectedRange === range ? styles.activeRange : ''}`}
                  onClick={() => setSelectedRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Numbers Table */}
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>מספר</th>
              <th>כתיב ברוסית</th>
              <th>תעתיק עברי</th>
            </tr>
          </thead>
          <tbody>
            {NUMBERS_DATA[selectedRange].map((entry) => (
              <tr key={entry.digit}>
                <td>{entry.digit}</td>
                <td>{entry.russian}</td>
                <td className={styles.transliterationCell}>
                  <div className={styles.tooltipContainer}>
                    {entry.transliteration}
                    {entry.notes && (
                      <span className={styles.tooltip}>
                        {entry.notes}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rule Display */}
      {selectedRange === 'עשרות' && (
        <LightbulbToggle>
          ברוב העשרות ברוסית, הסיומת של המספר היא "עשרים", "שלושים" וכו' – ומסתיימת ב־"цать" או "десят", מה שמזכיר את המילה "עשר".
        </LightbulbToggle>
      )}

      {selectedRange === 'מאות' && (
        <LightbulbToggle>
          במספרי מאות ברוסית, השורש של המספר מופיע לפני הסיומת "сто" (שמשמעותה "מאה"), והיא חוזרת בכל מילה.
        </LightbulbToggle>
      )}
    </div>
  );
}; 