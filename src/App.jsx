import React, { useState, useEffect } from 'react';
import CodeGenerator from './components/CodeGenerator';
import CodeFixer from './components/CodeFixer';
import CodeExplainer from './components/CodeExplainer';
import ChatAssistant from './components/ChatAssistant';
import History from './components/History';
import ThemeToggle from './components/ThemeToggle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <h1>Cobra Code Assist</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>

      <main>
        <section>
          <CodeGenerator />
        </section>
        <section>
          <CodeFixer />
        </section>
        <section>
          <CodeExplainer />
        </section>
        <section>
          <ChatAssistant />
        </section>
        <section>
          <History />
        </section>
      </main>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default App;
