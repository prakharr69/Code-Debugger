import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TEST_PORT = 5001;

async function runApiIntegrationTests() {
  console.log('==================================================');
  console.log('Starting Express API Route & Safeguard Tests');
  console.log('==================================================\n');

  const server = app.listen(TEST_PORT);
  const baseUrl = `http://localhost:${TEST_PORT}`;

  let passed = 0;
  let total = 5;

  try {
    // Test 1: GET /health
    console.log('Test 1: Health Check Endpoint (GET /health)');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    if (healthRes.status === 200 && healthData.status === 'ok') {
      console.log('  [PASS] /health returned 200 OK:', healthData);
      passed++;
    } else {
      console.error('  [FAIL] Health check failed:', healthRes.status, healthData);
    }

    // Test 2: Empty code submission (Should return 400)
    console.log('\nTest 2: Validation Check - Empty Code (POST /api/debug)');
    const emptyRes = await fetch(`${baseUrl}/api/debug`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '   ' })
    });
    const emptyData = await emptyRes.json();
    if (emptyRes.status === 400 && emptyData.error === 'Invalid input') {
      console.log('  [PASS] 400 Bad Request returned as expected for empty code.');
      passed++;
    } else {
      console.error('  [FAIL] Expected 400, got:', emptyRes.status, emptyData);
    }

    // Test 3: Exceeding 300 line limit (Should return 400)
    console.log('\nTest 3: Limit Check - Code Exceeding 300 Lines');
    const longCode = Array.from({ length: 305 }, (_, i) => `x_${i} = ${i}`).join('\n');
    const limitRes = await fetch(`${baseUrl}/api/debug`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: longCode })
    });
    const limitData = await limitRes.json();
    if (limitRes.status === 400 && limitData.error === 'Input limit exceeded') {
      console.log('  [PASS] 400 Bad Request returned as expected for >300 lines.');
      passed++;
    } else {
      console.error('  [FAIL] Expected 400 for line limit, got:', limitRes.status, limitData);
    }

    // Test 4: Valid code submission (Should return 200, X-Cache: MISS)
    console.log('\nTest 4: Valid Code Submission - Cache MISS Verification');
    const sampleCode = `def add(a, b):\n    return a + b\n\nprint(add(2, 3))`;
    const validRes = await fetch(`${baseUrl}/api/debug`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sampleCode })
    });
    const validData = await validRes.json();
    const cacheHeader = validRes.headers.get('x-cache');
    if (validRes.status === 200 && validData.isPython === true && cacheHeader === 'MISS') {
      console.log('  [PASS] 200 OK returned with X-Cache: MISS.');
      passed++;
    } else {
      console.error('  [FAIL] Expected 200 with X-Cache: MISS, got:', validRes.status, cacheHeader, validData);
    }

    // Test 5: Immediate identical repeat (Should return 200, X-Cache: HIT from LRU cache)
    console.log('\nTest 5: LRU In-Memory Cache Verification - Cache HIT Check');
    const repeatRes = await fetch(`${baseUrl}/api/debug`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: sampleCode })
    });
    const repeatData = await repeatRes.json();
    const repeatCacheHeader = repeatRes.headers.get('x-cache');
    if (repeatRes.status === 200 && repeatCacheHeader === 'HIT') {
      console.log('  [PASS] 200 OK returned with X-Cache: HIT (Zero quota consumed!).');
      passed++;
    } else {
      console.error('  [FAIL] Expected 200 with X-Cache: HIT, got:', repeatRes.status, repeatCacheHeader);
    }

  } catch (err) {
    console.error('[API Test Execution Error]:', err);
  } finally {
    process.exitCode = passed === total ? 0 : 1;
    console.log('\n==================================================');
    console.log(`API Safeguards Test Suite Complete: ${passed}/${total} passed`);
    console.log('==================================================');
    server.close();
  }
}

runApiIntegrationTests();
