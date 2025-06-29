import React, { useState } from "react";
import "./styles.css";
import { getAIReply } from "../api/openrouter";

export default function Popup() {
  const [reply, setReply] = useState("");
  const [context, setContext] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("message");
  const [tone, setTone] = useState("Polite");

  const generateReply = async () => {
    setLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, async (response) => {
        const extracted = response?.text || "No context found.";
        setContext(extracted);

        const input =
          mode === "message"
            ? `Rewrite the message "${userInput}" in a ${tone.toLowerCase()} tone.`
            : userInput;

        const prompt = `Context:\n${extracted}\n\nUser:\n${input}`;

        try {
          const result = await getAIReply(prompt);
          setReply(result || "No reply received.");
        } catch {
          setReply("Failed to fetch reply.");
        }
        setLoading(false);
      });
    });
  };

  return (
    <div className="container">
      <h1>retort.ai</h1>

      <div className="toggle-section">
        <span className="switch-label">
          {mode === "message" ? "Message Mode" : "Prompt Mode"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={mode === "prompt"}
            onChange={() => setMode(mode === "message" ? "prompt" : "message")}
          />
          <span className="slider" />
        </label>
      </div>

      {mode === "message" && (
        <div className="toggle-section" style={{ marginTop: 4 }}>
          <span className="switch-label">Tone:</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="tone-select"
          >
            <option value="Polite">Polite</option>
            <option value="Friendly">Friendly</option>
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Witty">Witty</option>
            <option value="Formal">Formal</option>
          </select>
        </div>
      )}

      <textarea
        className="box"
        placeholder={mode === "message" ? "Type your message..." : "Write a prompt..."}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <div className="box">{context || "Context will appear here..."}</div>

      <div className="box reply-box">{reply || "AI reply will appear here..."}</div>

      <button onClick={generateReply} disabled={loading}>
        {loading ? "Thinking..." : "Generate Reply"}
      </button>
    </div>
  );
}
