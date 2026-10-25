import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function check() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log('Testing simple JSON generation without schema...');
  const t0 = Date.now();
  try {
    const res = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: 'Respond with valid JSON: {"status": "ok", "message": "hello"}',
      config: {
        responseMimeType: 'application/json'
      }
    });
    console.log(`Finished in ${Date.now() - t0}ms:`, res.text);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
