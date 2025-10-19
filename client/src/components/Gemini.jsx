import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const Gemini = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]); // stores all chat messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
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

  return (
    <div
      className={`w-full h-full flex items-center flex-col transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
      }`}
    >
      <div
        className={`w-full h-full rounded-2xl shadow-lg border flex flex-col overflow-hidden transition ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-900 border-gray-800"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 text-center font-semibold border-b ${
            theme === "light"
              ? "text-indigo-700 border-gray-200"
              : "text-indigo-400 border-gray-800"
          }`}
        >
          🧠 Health Mate AI Chat
        </div>

        {/* Chat area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && !loading && (
            <div
              className={`text-center text-sm opacity-70 mt-10 ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              💬 Start a conversation with Health Mate...
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
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.role === "user"
                    ? theme === "light"
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-500 text-white"
                    : theme === "light"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading message (AI typing) */}
          {loading && (
            <div className="flex justify-start">
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm flex gap-1 items-center ${
                  theme === "light"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-150">●</span>
                <span className="animate-bounce delay-300">●</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Footer / Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t flex gap-2 items-center"
        >
          <textarea
            rows="1"
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className={`flex-1 resize-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 transition ${
              theme === "light"
                ? "border border-gray-300 bg-gray-50 focus:ring-indigo-400 text-gray-800"
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
            {loading ? "..." : "Send"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p
            className={`text-center text-sm py-2 ${
              theme === "light" ? "text-red-600" : "text-red-400"
            }`}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Gemini;
