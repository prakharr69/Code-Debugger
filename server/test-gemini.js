import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzePythonCode } from './services/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const testScripts = [
  {
    name: '1. Syntax Error (Missing colon)',
    code: `def calculate_average(numbers)
    total = sum(numbers)
    return total / len(numbers)`,
    error: 'SyntaxError: expected \':\''
  },
  {
    name: '2. Indentation Error',
    code: `def greet(name):
if not name:
    return "Hello, Stranger!"
return f"Hello, {name}!"`,
    error: 'IndentationError: expected an indented block after \'def\''
  },
  {
    name: '3. Logic & Off-By-One Error',
    code: `def print_elements(items):
    # Off-by-one: accessing items[len(items)] will raise IndexError
    for i in range(len(items) + 1):
        print(f"Item: {items[i]}")`,
    error: 'IndexError: list index out of range'
  },
  {
    name: '4. Runtime & Type Error',
    code: `def format_invoice(client, amount):
    # TypeError: cannot concatenate string and integer
    message = "Client " + client + " owes $" + amount
    return message`,
    error: 'TypeError: can only concatenate str (not "int") to str'
  },
  {
    name: '5. Bad Import & Undefined Name',
    code: `import mathe  # Typo in module name

def get_circle_area(radius):
    return mathe.pi * (radius ** 2)`,
    error: 'ModuleNotFoundError: No module named \'mathe\''
  },
  {
    name: '6. Non-Python Code Rejection',
    code: `function computeSum(a, b) {
    console.log("Adding numbers in JS");
    return a + b;
}`,
    error: ''
  }
];

async function runGeminiTests() {
  console.log('====================================================');
  console.log('Running Gemini AI Service Automated Test Suite');
  console.log('Model:', process.env.GEMINI_MODEL || 'gemini-2.5-flash');
  console.log('API Key Present:', Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'));
  console.log('====================================================\n');

  let passed = 0;
  for (const test of testScripts) {
    console.log(`Testing: ${test.name}`);
    try {
      const result = await analyzePythonCode({ code: test.code, error: test.error });

      if (test.name.includes('Non-Python')) {
        if (result.isPython === false) {
          console.log('  [PASS] Successfully rejected non-Python code.');
          passed++;
        } else {
          console.error('  [FAIL] Expected isPython: false, but got true');
        }
      } else {
        if (result.isPython === true && typeof result.summary === 'string' && typeof result.fixedCode === 'string') {
          console.log(`  [PASS] isPython: true | Bugs Found: ${result.bugs.length} | Summary: "${result.summary.slice(0, 70)}..."`);
          if (result.bugs.length > 0) {
            console.log(`         Sample Bug: Line ${result.bugs[0].line} [${result.bugs[0].type.toUpperCase()}] (${result.bugs[0].severity})`);
          }
          passed++;
        } else {
          console.error('  [FAIL] Output did not match expected structure:', result);
        }
      }
    } catch (err) {
      console.error(`  [ERROR] Test failed with exception: ${err.message}`);
    }
    console.log('----------------------------------------------------');
  }

  console.log(`\nTest Suite Complete: ${passed}/${testScripts.length} passed.`);
}

runGeminiTests();
