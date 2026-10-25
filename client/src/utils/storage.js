const HISTORY_KEY = 'pyfix_debug_history';
const THEME_KEY = 'pyfix_theme';
const MAX_SESSIONS = 5;

/**
 * Get all stored debug sessions
 */
export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load history from localStorage:', err);
    return [];
  }
}

/**
 * Add a new session to the history (FIFO, max 5)
 */
export function saveSessionToHistory(session) {
  try {
    const current = getStoredHistory();
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      code: session.code,
      error: session.error || '',
      result: session.result
    };

    // Filter out duplicate identical code if already present at top
    const filtered = current.filter(item => item.code.trim() !== session.code.trim());
    const updated = [newEntry, ...filtered].slice(0, MAX_SESSIONS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save session to localStorage:', err);
    return [];
  }
}

/**
 * Clear history
 */
export function clearStoredHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.warn('Failed to clear history:', err);
  }
}

/**
 * Theme helper
 */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
