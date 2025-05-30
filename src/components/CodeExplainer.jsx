import React, { useState } from "react";
import { callGemini } from "../api/gemini";
import { toast } from "react-toastify";
import { formatAsHtml } from "../utils/markdowntohtml";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tabs } from "./Tabs";

const CodeExplainer = () => {
  const [codeInput, setCodeInput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!codeInput.trim()) {
      toast.error("Paste some code to explain!");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Explain the following ${language} code line by line:\n\n${codeInput}`;
      const result = await callGemini(prompt);
      setExplanation(result.text);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get explanation.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("explanation-output");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("cobra-doc.pdf");
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      toast.error("Speech synthesis not supported in this browser.");
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const tabs = ["Explain"];
  const activeTab = "Explain";

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Tabs activeTab={activeTab} tabs={tabs} onChangeTab={() => {}} />

      <h2>📘 Code Explainer</h2>

      <label>
        <strong>Select Language</strong>
      </label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        <option>JavaScript</option>
        <option>Python</option>
        <option>HTML</option>
        <option>CSS</option>
        <option>Java</option>
        <option>C++</option>
      </select>

      <textarea
        rows={6}
        placeholder="Paste code here..."
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontFamily: "monospace",
          backgroundColor: "#333",
          color: "#f1f1f1",
          border: "none",
          borderRadius: "4px",
        }}
      />

      <button
        onClick={handleExplain}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Explaining..." : "Explain"}
      </button>

      {explanation && (
        <div
          id="explanation-output"
          style={{
            marginTop: "2rem",
            backgroundColor: "#222",
            padding: "1rem",
            borderRadius: "6px",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>✅ Explanation:</h3>
          <div dangerouslySetInnerHTML={{ __html: formatAsHtml(explanation) }} />

          <div style={{ marginTop: "1rem" }}>
            <CopyToClipboard text={explanation}>
              <button style={{ marginRight: "1rem", cursor: "pointer" }}>
                📋 Copy
              </button>
            </CopyToClipboard>

            <button
              onClick={() => speakText(explanation)}
              style={{ marginRight: "1rem", cursor: "pointer" }}
            >
              🔊 Read
            </button>

            <button onClick={handleExportPDF} style={{ cursor: "pointer" }}>
              📄 Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplainer;
