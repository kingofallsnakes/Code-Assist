import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value }) => {
  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
      <Editor
        height="300px"
        defaultLanguage={language}
        value={value}
        theme="vs-dark"
        options={{
          readOnly: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          padding: { top: 10 },
        }}
      />
    </div>
  );
};

export default CodeEditor;
