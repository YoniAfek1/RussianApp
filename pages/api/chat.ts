import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Conversation {
  russian: string[];
  translation: string[];
  topic: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const debugLog: string[] = [];

  try {
    const dataDirectory = path.join(process.cwd(), 'public', 'data', 'Russian_Conversations');
    debugLog.push(`📁 Looking for directory: ${dataDirectory}`);

    if (!fs.existsSync(dataDirectory)) {
      debugLog.push('❌ Conversation directory not found');
      return res.status(404).json({ error: 'Conversation directory not found', debugLog });
    }

    const files = fs.readdirSync(dataDirectory);
    debugLog.push(`📄 Found ${files.length} file(s): ${files.join(', ')}`);

    const allConversations: Conversation[] = [];

    for (const file of files) {
      if (!file.endsWith('.txt')) {
        debugLog.push(`⏭️ Skipping non-text file: ${file}`);
        continue;
      }

      const filePath = path.join(dataDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      debugLog.push(`📖 Reading file: ${file}, ${lines.length} line(s)`);

      let currentConversation: Conversation = {
        russian: [],
        translation: [],
        topic: file.replace('.txt', '')
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') {
          if (currentConversation.russian.length > 0) {
            allConversations.push({ ...currentConversation });
            debugLog.push(`✅ Added conversation with ${currentConversation.russian.length} lines from file: ${file}`);
            currentConversation = {
              russian: [],
              translation: [],
              topic: file.replace('.txt', '')
            };
          }
          continue;
        }

        const parts = line.split(/\t|\s{2,}/);
        if (parts.length >= 2) {
          currentConversation.russian.push(parts[0].trim());
          currentConversation.translation.push(parts[1].trim());
        } else {
          debugLog.push(`⚠️ Line ${i + 1} in ${file} not valid: "${line}"`);
        }
      }

      if (currentConversation.russian.length > 0) {
        allConversations.push({ ...currentConversation });
        debugLog.push(`✅ Added final conversation from file: ${file}`);
      }
    }

    debugLog.push(`🎉 Total conversations loaded: ${allConversations.length}`);
    return res.status(200).json({ conversations: allConversations, debugLog });
  } catch (error) {
    console.error('Error loading conversations:', error);
    debugLog.push(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    return res.status(500).json({ error: 'Failed to load conversations', debugLog });
  }
}
