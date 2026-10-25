import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const candidates = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash'
];

async function checkCandidates() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  for (const model of candidates) {
    const t0 = Date.now();
    try {
      const res = await ai.models.generateContent({
        model,
        contents: 'Return {"status": "ok"}'
      });
      console.log(`[AVAILABLE] ${model} responded in ${Date.now() - t0}ms:`, res.text.trim().slice(0, 40));
    } catch (err) {
      console.log(`[FAILED] ${model}:`, err.message.slice(0, 100));
    }
  }
}

checkCandidates();
