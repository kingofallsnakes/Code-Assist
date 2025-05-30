import React, { useState } from 'react';
import { callGemini } from '../api/gemini';
import { enhancePrompt } from '../utils/enhancer';
import { formatAsHtml } from '../utils/markdowntohtml';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ChatAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) {
      toast.error('Please enter a question!');
      return;
    }

    setLoading(true);
    try {
      const prompt = enhancePrompt(query);
      const result = await callGemini(prompt);
      const formatted = formatAsHtml(result.text);
      setResponse(formatted);
      saveToHistory('Chat Assistant', query, formatted);
    } catch (error) {
      console.error(error);
      toast.error('Failed to get response. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResponse('');
  };

  const saveToHistory = (type, input, response) => {
    const history = JSON.parse(localStorage.getItem('gca-history') || '[]');
    history.unshift({ type, input, response, timestamp: new Date().toISOString() });
    localStorage.setItem('gca-history', JSON.stringify(history.slice(0, 50)));
  };

  // Text-to-Speech for the response text (strip HTML tags)
  const speakText = (html) => {
    const text = html.replace(/<[^>]+>/g, ''); // remove HTML tags
    if (!text) {
      toast.error('Nothing to read!');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Export response div to PDF
  const handleExportPDF = async () => {
    const element = document.getElementById('chat-response');
    if (!element) {
      toast.error('No response to export!');
      return;
    }
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('chat-response.pdf');
    } catch (error) {
      console.error(error);
      toast.error('Failed to export PDF.');
    }
  };

  return (
    <section style={{ padding: '1rem', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h2>💬 AI Chat Assistant</h2>

      <label htmlFor="query" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
        Ask your programming question:
      </label>
      <textarea
        id="query"
        rows="3"
        placeholder="e.g. How does a binary search algorithm work?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontFamily: 'monospace',
          marginBottom: '1rem',
          borderRadius: '6px',
          border: '1px solid #444',
          backgroundColor: '#222',
          color: '#fff',
          resize: 'vertical',
        }}
        disabled={loading}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginRight: '1rem',
        }}
      >
        {loading ? 'Thinking...' : 'Ask Cobra'}
      </button>

      <button
        onClick={handleClear}
        disabled={loading && !query && !response}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        Clear
      </button>

      {response && (
        <div style={{ marginTop: '2rem' }}>
          <h3>🤖 Response:</h3>
          <div
            id="chat-response"
            style={{
              whiteSpace: 'pre-wrap',
              backgroundColor: '#333',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #555',
              color: '#eee',
            }}
            dangerouslySetInnerHTML={{ __html: response }}
          />

          <div style={{ marginTop: '1rem' }}>
            <CopyToClipboard text={response}>
              <button style={{ marginRight: '1rem', cursor: 'pointer' }}>📋 Copy</button>
            </CopyToClipboard>

            <button onClick={() => speakText(response)} style={{ marginRight: '1rem', cursor: 'pointer' }}>
              🔊 Read
            </button>

            <button onClick={handleExportPDF} style={{ cursor: 'pointer' }}>
              📄 Export PDF
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatAssistant;
