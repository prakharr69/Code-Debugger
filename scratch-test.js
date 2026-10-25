import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzePythonCode } from '../server/services/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testCall() {
  console.log('Sending test debug request to Gemini...');
  const start = Date.now();
  try {
    const result = await analyzePythonCode({
      code: `def get_user_initials(names):
    initials = []
    for i in range(len(names) + 1):
        full_name = names[i]
        initials.append(full_name[0])
    return initials`,
      error: `IndexError: list index out of range`
    });
    console.log(`Success in ${Date.now() - start}ms:`);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testCall();
