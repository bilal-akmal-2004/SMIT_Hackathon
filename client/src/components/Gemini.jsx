// Gemini.jsx (FINAL CLEAN VERSION)
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const Gemini = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/gemini`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.text || "No response." };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check your backend or network.");
    } finally {
      setLoading(false);
    }
  };

  // this is to format the ai reply
  // Helper to convert basic Markdown-like syntax to HTML
  const formatAIResponse = (text) => {
    if (!text) return "";

    return (
      text
        // Convert **bold** and __bold__
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        // Convert *italic* and _italic_
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<em>$1</em>")
        // Convert line breaks to <br>
        .replace(/\n/g, "<br />")
    );
  };

  return (
    // ✅ Remove outer h-full div — let parent control height
    <div
      className={`flex flex-col h-full w-full overflow-hidden rounded-2xl border transition ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-900 border-gray-800"
      }`}
    >
      <div
        className={`shrink-0 p-4 text-center font-semibold border-b ${
          theme === "light"
            ? "text-indigo-700 border-gray-200"
            : "text-indigo-300 border-gray-800"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            🧠
          </div>
          <div className="text-left">
            <div className="text-base font-semibold">HealthMate AI Chat</div>
            <div className="text-xs opacity-80 mt-0.5">
              Get clear answers to your medical questions
            </div>
          </div>
        </div>
      </div>

      {/* ✅ This will scroll, and stay within bounds */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && !loading && (
          <div
            className={`text-center text-sm opacity-80 mt-8 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            💬 Start a conversation with HealthMate — type a question below.
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[84%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words ${
                msg.role === "user"
                  ? theme === "light"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"
                  : theme === "light"
                  ? "bg-gray-100 text-slate-800"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.role === "ai" ? (
                <span
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: formatAIResponse(msg.text),
                  }}
                />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm shadow-sm flex gap-2 items-center ${
                theme === "light"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-150">●</span>
              <span className="animate-pulse delay-300">●</span>
              <span className="text-xs opacity-80 ml-2">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-4 border-t flex gap-3 items-center"
      >
        <textarea
          rows="1"
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          className={`flex-1 resize-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 transition ${
            theme === "light"
              ? "border border-gray-300 bg-gray-50 focus:ring-indigo-400 text-slate-800"
              : "border border-gray-700 bg-gray-800 focus:ring-indigo-500 text-gray-200"
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:scale-[1.05] active:scale-95"
          } ${
            theme === "light"
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {error && (
        <p
          className={`shrink-0 text-center text-sm py-2 ${
            theme === "light" ? "text-red-600" : "text-red-400"
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Gemini;
