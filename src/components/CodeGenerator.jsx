import React, { useState, useEffect } from 'react';
import { callGemini } from '../api/gemini';
import { enhancePrompt } from '../utils/enhancer';
import { extractCodeOnly } from '../utils/codeUtils';
import { saveToHistory } from '../utils/history';
import { toast } from 'react-toastify';
import CodeEditor from './CodeEditor';
import ExportButton from './ExportButton';

const CodeGenerator = () => {
  const [language, setLanguage] = useState('JavaScript');
  const [task, setTask] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = ['JavaScript', 'Python', 'HTML', 'CSS', 'Java', 'C++'];

  const languageMap = {
    JavaScript: 'javascript',
    Python: 'python',
    HTML: 'html',
    CSS: 'css',
    Java: 'java',
    'C++': 'cpp',
  };

  useEffect(() => {
    document.getElementById('task')?.focus();
  }, []);

  const handleGenerate = async () => {
    if (!task.trim()) {
      return toast.error('Please enter a task description!');
    }

    setLoading(true);
    try {
      const prompt = enhancePrompt(`Generate ${language} code for: ${task}`);
      const result = await callGemini(prompt);
      const cleanCode = extractCodeOnly(result.text);

      setOutput(cleanCode);
      saveToHistory('Code Generator', task, cleanCode);
    } catch (err) {
      console.error('Error generating code:', err.message || err);
      toast.error(err?.message || 'Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTask('');
    setOutput('');
  };

  const handleExample = (example) => {
    setTask(example);
    toast.info(`Example task loaded: "${example}"`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Code copied to clipboard!');
  };

  return (
    <section className="code-generator" style={{ padding: '1rem' }}>
      <h2 className="title">🔧 Code Generator</h2>

      <div className="form-group">
        <label htmlFor="task"><strong>Describe Task</strong></label>
        <textarea
          id="task"
          aria-label="Task Description"
          rows="3"
          placeholder="Describe what code you need..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label htmlFor="language"><strong>Select Language</strong></label>
        <select
          id="language"
          aria-label="Language Selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading || !task.trim()}
        >
          {loading ? (
            <span className="spinner" aria-label="Generating..." />
          ) : (
            'Generate Code'
          )}
        </button>

        <button
          onClick={handleClear}
          style={{ marginLeft: '1rem' }}
          disabled={loading && !output}
        >
          Clear
        </button>
      </div>

      <div
        className="output-section"
        aria-live="polite"
        style={{ marginTop: '2rem' }}
      >
        {output ? (
          <>
            <h3>Generated Code:</h3>
            <CodeEditor language={languageMap[language]} value={output} showLineNumbers />
            <div style={{ marginTop: '1rem' }}>
              <ExportButton code={output} language={language} />
              <button onClick={copyToClipboard} style={{ marginLeft: '1rem' }}>
                Copy to Clipboard
              </button>
            </div>
          </>
        ) : !loading ? (
          <p style={{ color: '#888' }}>No code generated yet.</p>
        ) : null}
      </div>
    </section>
  );
};

export default CodeGenerator;
