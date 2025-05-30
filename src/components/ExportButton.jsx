import React from 'react';
import { saveAs } from 'file-saver';

const ExportButton = ({ code, language = 'text', filename = 'code-output' }) => {
  const handleDownload = () => {
    const extMap = {
      javascript: 'js',
      js: 'js',
      python: 'py',
      py: 'py',
      html: 'html',
      css: 'css',
      java: 'java',
      text: 'txt',
      txt: 'txt',
    };

    const ext = extMap[language.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${filename}.${ext}`);
  };

  return (
    <button 
      onClick={handleDownload}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      💾 Export Code
    </button>
  );
};

export default ExportButton;
