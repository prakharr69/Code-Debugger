import React, { useState, useEffect } from 'react';
import { Play, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import Editor from './components/Editor';
import ResultPanel from './components/ResultPanel';
import HistoryDrawer from './components/HistoryDrawer';
import AlertBanner from './components/AlertBanner';
import { debugPythonCode, checkHealth } from './api';
import {
  getStoredHistory,
  saveSessionToHistory,
  clearStoredHistory,
  getSavedTheme,
  saveTheme
} from './utils/storage';
import { SAMPLE_SNIPPETS } from './data/samples';

const MAX_LINES = 300;
const MAX_CHARS = 12000;

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(getSavedTheme);

  // Debug inputs and outputs
  const [code, setCode] = useState(SAMPLE_SNIPPETS[0].code);
  const [result, setResult] = useState(null);
  const [isCached, setIsCached] = useState(false);

  // Status and error handling
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking'); // 'ok' | 'error' | 'checking'
  const [modelName, setModelName] = useState('Gemini Flash');

  // History state
  const [history, setHistory] = useState(getStoredHistory);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync theme to document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    saveTheme(theme);
  }, [theme]);

  // Check health on initial mount
  useEffect(() => {
    let isMounted = true;
    checkHealth().then((res) => {
      if (!isMounted) return;
      if (res.status === 'ok') {
        setServerStatus('ok');
        if (res.model) setModelName(res.model);
      } else {
        setServerStatus('error');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Line & Character calculations
  const lineCount = code ? code.split(/\r?\n/).length : 0;
  const charCount = code ? code.length : 0;
  const isOverLimits = lineCount > MAX_LINES || charCount > MAX_CHARS;
  const isInputEmpty = !code || code.trim().length === 0;

  // Handle Debug Submit
  const handleDebug = async () => {
    if (isInputEmpty || isOverLimits || isAnalyzing) return;

    setIsAnalyzing(true);
    setApiError(null);

    const response = await debugPythonCode({
      code,
      error: ''
    });

    setIsAnalyzing(false);

    if (response.success) {
      setResult(response.data);
      setIsCached(response.isCached);

      // Save to localStorage history
      const updatedHistory = saveSessionToHistory({
        code,
        error: '',
        result: response.data
      });
      setHistory(updatedHistory);
    } else {
      setApiError(response.error);
    }
  };

  // Select sample from dropdown
  const handleSelectSample = (sample) => {
    setCode(sample.code);
    setResult(null);
    setApiError(null);
  };

  // Restore past session from history
  const handleSelectSession = (session) => {
    setCode(session.code);
    setResult(session.result);
    setApiError(null);
  };

  const handleClearHistory = () => {
    clearStoredHistory();
    setHistory([]);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onSelectSample={handleSelectSample}
        isAnalyzing={isAnalyzing}
        modelName={modelName}
      />

      {/* Global Server Offline Alert */}
      {serverStatus === 'error' && (
        <AlertBanner
          type="warning"
          message="Cannot reach the Express backend server at http://localhost:5000. Ensure the server is running."
        />
      )}

      {/* API / Limit Error Banner */}
      {apiError && (
        <AlertBanner
          type="error"
          message={apiError}
          onDismiss={() => setApiError(null)}
        />
      )}

      {/* Main Split-Screen Workspace */}
      <main className="workspace-grid">
        {/* Left Panel: Input & Monaco Editor */}
        <section className="panel-card">
          <div className="panel-header">
            <div className="panel-title">
              <span>Python Source Code</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDebug}
                disabled={isInputEmpty || isOverLimits || isAnalyzing}
                title="Run Gemini static code analysis"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>Debug Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="panel-body">
            {/* Monaco Editor */}
            <Editor
              code={code}
              onChange={setCode}
              theme={theme}
              isOverLimit={isOverLimits}
              lineCount={lineCount}
              charCount={charCount}
              disabled={isAnalyzing}
            />
          </div>
        </section>

        {/* Right Panel: Results (Bug Cards, Diff View, Fixed Monaco Editor) */}
        <section>
          <ResultPanel
            result={result}
            originalCode={code}
            theme={theme}
            isCached={isCached}
          />
        </section>
      </main>

      {/* LocalStorage History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectSession={handleSelectSession}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <footer className="footer-disclaimer">
        PyFix AI &bull; Stateless Python Static Code Debugger powered by Gemini Flash &bull; No user code is ever executed
      </footer>

      {/* Inline Keyframe for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
