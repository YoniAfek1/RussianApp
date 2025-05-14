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
  try {
    const dataDirectory = path.join(process.cwd(), 'public', 'data', 'Russian_Conversations');
    
    // Check if directory exists
    if (!fs.existsSync(dataDirectory)) {
      return res.status(404).json({ error: 'Conversation directory not found' });
    }
    
    // Read all files from directory
    const files = fs.readdirSync(dataDirectory);
    
    const allConversations: Conversation[] = [];
    
    for (const file of files) {
      // Only process text files
      if (!file.endsWith('.txt')) continue;
      
      const filePath = path.join(dataDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      let currentConversation: Conversation = {
        russian: [],
        translation: [],
        topic: file.replace('.txt', '')
      };
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Empty line indicates end of conversation
        if (line === '') {
          if (currentConversation.russian.length > 0) {
            allConversations.push({...currentConversation});
            currentConversation = {
              russian: [],
              translation: [],
              topic: file.replace('.txt', '')
            };
          }
          continue;
        }
        
        // Split line by tab or multiple spaces to separate Russian and translation
        const parts = line.split(/\t|\s{2,}/);
        
        if (parts.length >= 2) {
          currentConversation.russian.push(parts[0].trim());
          currentConversation.translation.push(parts[1].trim());
        }
      }
      
      // Add the last conversation if not empty
      if (currentConversation.russian.length > 0) {
        allConversations.push({...currentConversation});
      }
    }
    
    return res.status(200).json(allConversations);
  } catch (error) {
    console.error('Error loading conversations:', error);
    return res.status(500).json({ error: 'Failed to load conversations' });
  }
} 