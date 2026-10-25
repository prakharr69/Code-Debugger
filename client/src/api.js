/**
 * Client API service for Python AI Code Debugger
 */

export async function checkHealth() {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error(`Health check returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to connect to backend server:', err.message);
    return { status: 'error', message: err.message };
  }
}

export async function debugPythonCode({ code, error }) {
  try {
    const res = await fetch('/api/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, error })
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error(data.message || 'Please provide valid Python code under 300 lines / 12,000 characters.');
      }
      if (res.status === 429) {
        throw new Error(data.message || 'Rate limit reached. Please wait a minute before submitting again.');
      }
      if (res.status === 502) {
        throw new Error(data.message || 'AI service temporarily unavailable. Please try again in a few moments.');
      }
      throw new Error(data.message || `Server responded with status ${res.status}`);
    }

    return {
      success: true,
      data,
      isCached: res.headers.get('x-cache') === 'HIT'
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while communicating with the debugger.'
    };
  }
}
