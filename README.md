# PyFix AI — Python AI Code Debugger

An intelligent, stateless web application that debugs Python code using Google Gemini Flash. Users paste or upload Python code (and optional terminal error tracebacks) to receive structured bug diagnoses, line citations, severity levels, explanations, side-by-side diff comparisons, and corrected scripts.

---

## Architecture

```
React (Monaco Editor)  ──▶  POST /api/debug  ──▶  Express + Rate Limiter
      ▲                                                   │
      │                                             In-Memory LRU Cache
      │                                                   │
      └──────  Structured JSON ◀── Gemini API  ◀──────────┘
```

- **Zero Sandbox Risk**: No user code is ever executed. Analysis is strictly static via Gemini Flash.
- **Quota Safeguards**:
  - Enforced client & server input cap: `<= 300 lines` or `<= 12,000 characters`.
  - Rate limiter: 10 requests per minute per IP.
  - In-Memory LRU Cache: SHA-256 hash prevents duplicate API calls.
  - Auto-retry with backoff on transient errors.

---

## API Contract

### `POST /api/debug`
**Request:**
```json
{
  "code": "string (max 300 lines or 12,000 chars)",
  "error": "string (optional, max 4,000 chars)"
}
```

**Response (`200 OK`):**
```json
{
  "isPython": true,
  "summary": "Detected 1 syntax error and 1 logic boundary error.",
  "bugs": [
    {
      "line": 4,
      "type": "syntax",
      "severity": "high",
      "explanation": "Missing colon ':' at the end of the if statement.",
      "fix": "if condition:"
    }
  ],
  "fixedCode": "# Corrected Python script\n..."
}
```

---

## Quickstart

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Edit `.env` in the root directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(If no API key is provided, the server runs in local demo analyzer mode so you can test immediately without interruption).*

### 3. Start Development Servers
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

---

## Test Suites

- **AI Gemini Analysis Test**:
  ```bash
  npm run test:ai
  ```
- **API Safeguards & Cache Test**:
  ```bash
  npm run test:api
  ```
- **End-to-End Bug Categories Test**:
  ```bash
  npm run test:e2e
  ```

---

## Deployment

### Backend (Render / Railway)
- Use `server/Dockerfile` or `Procfile`.
- Environment variables: `PORT=5000`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLIENT_URL`.

### Frontend (Vercel / Netlify)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Configured with `vercel.json` and `netlify.toml` for automatic API proxying.
