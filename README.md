# 🧠 Cobra Code Assist

**Cobra Code Assist** is a powerful, browser-based AI coding assistant built with **React.js** and **Vite**, powered by **Gemini 2.0 API**. It offers an all-in-one solution to generate, fix, explain, and chat about code using a modern, responsive interface.

## 🔥 Features

- 💡 **Code Generator** – Generate code from natural language prompts
- 🛠️ **Code Fixer** – Automatically debug and fix broken code
- 🧠 **Code Explainer** – Understand what code does in plain language
- 💬 **AI Chat Assistant** – Chat with Gemini AI for any code help
- 🎨 **Dark/Light Theme Toggle** – Switch between themes instantly
- 🕓 **Prompt History** – Access and reuse your previous prompts
- 📤 **Export to PDF** – Save code or output as a clean PDF file
- 📋 **Copy-to-Clipboard** – Instantly copy any code block
- 🗣️ **Text-to-Speech** – Listen to the AI’s explanation
- ⚡ **Runs Entirely in Browser** – No backend server required

---

## 📁 Project Structure

```

Gemini-Code-Assist/
│
├── public/
│   └── cobra.png                 # Logo/icon
│
├── src/
│   ├── api/
│   │   ├── gemini.js             # Gemini API integration
│   │   └── .env                  # API Key (not tracked by Git)
│   │
│   ├── components/
│   │   ├── ChatAssistant.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── CodeExplainer.jsx
│   │   ├── CodeFixer.jsx
│   │   ├── CodeGenerator.jsx
│   │   ├── ExportButton.jsx
│   │   ├── History.jsx
│   │   ├── Tabs.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── styles/
│   │   └── styles.css            # Global styles
│   │
│   ├── utils/
│   │   ├── codeUtils.js          # Code formatting/copy logic
│   │   ├── enhancer.js           # Prompt enhancer
│   │   ├── history.js            # LocalStorage history logic
│   │   └── markdownToHtml.js     # Converts markdown to HTML
│   │
│   ├── App.jsx                   # Root component with tab UI
│   └── main.jsx                  # React/Vite entry point
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── eslint.config.js

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gemini-code-assist.git
cd gemini-code-assist
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your Gemini API Key

Create a `.env` file inside `src/api/`:

```bash
src/api/.env
```

Add your API key (replace with your actual key):

```env
VITE_GEMINI_API_KEY=your-api-key-here
```

### 4. Run the App

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📸 Screenshots

> *(Add your app screenshots here to showcase the UI)*

---

## 📦 Build for Production

```bash
npm run build
```

---

## ✨ Technologies Used

* [React.js](https://react.dev/)
* [Vite](https://vitejs.dev/)
* [Gemini API](https://ai.google.dev/)
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js)
* [React Toastify](https://fkhadra.github.io/react-toastify/)

## 🔒 Environment & Security

* All API keys are stored in `.env` and accessed via `import.meta.env`.
* App runs entirely in-browser – **no server or data logging**.

## 🧠 Smart Prompt Enhancer

Automatically improves your code generation prompts using internal logic from `utils/enhancer.js`, ensuring better AI responses.

## 🙏 Acknowledgments

* Thanks to Google DeepMind for the **Gemini API**
* Based on inspiration from ChatGPT, Bard, and Copilot AI tools

## 📜 License

MIT License. Feel free to use, modify, and share.

## 💡 Future Enhancements

* 🧪 Unit testing with Jest
* ⌨️ Keyboard shortcuts for quick actions
* 📦 Plugin system for more AI tools
* 🌐 i18n for multi-language support

---

Made with ❤️ using AI.
