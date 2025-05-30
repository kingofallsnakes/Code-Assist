import React, { useState } from 'react';
import { callGemini } from '../api/gemini';
import { enhancePrompt } from '../utils/enhancer';
import { extractCodeOnly } from '../utils/codeUtils';
import { toast } from 'react-toastify';
import CodeEditor from './CodeEditor';
import ExportButton from './ExportButton';

const CodeFixer = () => {
  const [buggyCode, setBuggyCode] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [loading, setLoading] = useState(false);

  const languageMap = {
    JavaScript: 'javascript',
    Python: 'python',
    HTML: 'html',
    CSS: 'css',
    Java: 'java',
    'C++': 'cpp',
  };

  const handleFix = async () => {
    if (!buggyCode.trim()) {
      return toast.error('Paste some buggy code to fix!');
    }

    setLoading(true);
    try {
      const prompt = enhancePrompt(`Fix the bugs in this ${language} code:\n\n${buggyCode}`);
      const result = await callGemini(prompt);
      const cleanCode = extractCodeOnly(result.text);

      setFixedCode(cleanCode);
      saveToHistory('Bug Fixer', buggyCode, cleanCode);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fix the code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (type, input, response) => {
    const history = JSON.parse(localStorage.getItem('gca-history') || '[]');
    history.unshift({ type, input, response, timestamp: new Date().toISOString() });
    localStorage.setItem('gca-history', JSON.stringify(history.slice(0, 50)));
  };

  const handleClear = () => {
    setBuggyCode('');
    setFixedCode('');
  };

  return (
    <section className="code-fixer" style={{ padding: '1rem' }}>
      <h2 className="title">🐞 Bug Fixer</h2>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="language"><strong>Select Language</strong></label>
        <select
          id="language"
          aria-label="Language Selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>JavaScript</option>
          <option>Python</option>
          <option>HTML</option>
          <option>CSS</option>
          <option>Java</option>
          <option>C++</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="buggyCode"><strong>Paste Buggy Code</strong></label>
        <textarea
          id="buggyCode"
          aria-label="Buggy Code Input"
          rows="6"
          placeholder="Paste buggy code here..."
          value={buggyCode}
          onChange={(e) => setBuggyCode(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontFamily: 'monospace' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={handleFix}
          className="generate-btn"
          disabled={loading || !buggyCode.trim()}
        >
          {loading ? 'Fixing...' : 'Fix Code'}
        </button>

        <button
          onClick={handleClear}
          style={{ marginLeft: '1rem' }}
          disabled={loading && !fixedCode}
        >
          Clear
        </button>
      </div>

      {fixedCode && (
        <div className="output-section" style={{ marginTop: '2rem' }}>
          <h3>✅ Fixed Code:</h3>
          <CodeEditor language={languageMap[language]} value={fixedCode} />
          <ExportButton code={fixedCode} language={language} />
        </div>
      )}
    </section>
  );
};

export default CodeFixer;
