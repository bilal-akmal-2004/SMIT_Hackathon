import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

const Gemini = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseLanguage, setResponseLanguage] = useState("en"); // 'en' or 'ur'
  const { theme } = useTheme();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load latest chat
  useEffect(() => {
    const loadLatestChat = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chats/latest`,
          { withCredentials: true }
        );
        if (res.data) {
          setMessages(res.data.messages);
          setChatId(res.data._id);
        }
      } catch (err) {
        console.log("No previous chat found. Starting new session.");
      }
    };
    loadLatestChat();
  }, []);

  const saveChat = async (msgs) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats`,
        { messages: msgs },
        { withCredentials: true }
      );
      setChatId(res.data._id);
    } catch (err) {
      console.error("Failed to save chat:", err.response?.data || err.message);
    }
  };

  const deleteChat = async () => {
    if (chatId) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/chats/${chatId}`,
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to delete chat");
      }
    }
    setMessages([]);
    setChatId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError("");
    const userMessage = { role: "user", text: prompt };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/gemini`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ messages: newMessages, responseLanguage }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.text || "No response." };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);

      if (chatId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/chats/${chatId}`,
          { messages: updatedMessages },
          { withCredentials: true }
        );
      } else if (updatedMessages.length >= 2) {
        const saveRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/chats`,
          { messages: updatedMessages },
          { withCredentials: true }
        );
        setChatId(saveRes.data._id);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const formatAIResponse = (text) => {
    if (!text) return "";
    return text
      .replace(/^\s*\*{2,}\s*$/gm, "")
      .replace(/^\s*\*\s*$/gm, "")
      .replace(/^#{1,3}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/\b\*(.*?)\*\b/g, "<em>$1</em>")
      .replace(/\n{2,}/g, "</p><p class='mb-3'>")
      .replace(/^(.+)$/s, '<p class="mb-3">$1</p>')
      .replace(/<p class="mb-3">\s*<\/p>/g, "");
  };

  const toggleLanguage = () => {
    setResponseLanguage((prev) => (prev === "en" ? "ur" : "en"));
  };

  return (
    <div
      className={`flex flex-col h-full w-full overflow-hidden rounded-2xl border transition-all duration-300 ${
        theme === "light"
          ? "bg-white border-green-200 shadow-lg"
          : "bg-gray-900 border-gray-700 shadow-lg"
      }`}
    >
      {/* Header */}
      <div
        className={`shrink-0 p-4 border-b transition-all duration-300 ${
          theme === "light"
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
            : "bg-gradient-to-r from-gray-800 to-green-900/20 border-gray-700"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110">
              🤖
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-green-700 dark:text-green-400">
                HealthMate AI Chat
              </div>
              <div className="text-xs opacity-80 mt-0.5 text-green-600 dark:text-green-300">
                {responseLanguage === "en"
                  ? "💬 Replying in English"
                  : "💬 Replying in Roman Urdu"}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-110 ${
                theme === "light"
                  ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 hover:border-green-300"
                  : "bg-green-900/50 text-green-300 border border-green-800 hover:bg-green-800 hover:border-green-700"
              }`}
            >
              {responseLanguage === "en" ? "🇺🇸 English" : "🇵🇰 اردو"}
            </button>

            {/* Delete Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={deleteChat}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-110 ${
                  theme === "light"
                    ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 hover:border-red-300"
                    : "bg-red-900/50 text-red-300 border border-red-800 hover:bg-red-800 hover:border-red-700"
                }`}
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className={`flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent to-green-50/30 dark:to-gray-900/50 ${
          theme === "light" ? "custom-scrollbar-light" : "custom-scrollbar-dark"
        }`}
      >
        {messages.length === 0 && !loading && (
          <div className="text-center mt-12">
            <div className="text-5xl mb-4 opacity-60">💬</div>
            <div
              className={`text-lg font-medium mb-2 ${
                theme === "light" ? "text-green-700" : "text-green-400"
              }`}
            >
              Welcome to HealthMate AI
            </div>
            <div
              className={`text-sm opacity-80 max-w-md mx-auto ${
                theme === "light" ? "text-green-600" : "text-green-300"
              }`}
            >
              Ask me anything about health, symptoms, medications, or medical
              reports. I can explain in both English and Roman Urdu.
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {[
                "What are the symptoms of high blood pressure?",
                "Can you explain my lab report?",
                "What foods should I avoid with diabetes?",
                "Home remedies for common cold?",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className={`p-3 rounded-xl text-xs text-left transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                      : "bg-gray-800 border border-gray-700 text-green-300 hover:bg-gray-700 hover:border-gray-600"
                  }`}
                >
                  💡 {suggestion}
                </button>
              ))}
            </div>
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
              className={`max-w-[84%] px-4 py-3 rounded-2xl text-sm shadow-sm break-words transition-all duration-300 hover:scale-[1.02] ${
                msg.role === "user"
                  ? theme === "light"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-md"
                    : "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:shadow-md"
                  : theme === "light"
                  ? "bg-green-50 text-gray-800 border border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-md"
                  : "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:shadow-md"
              }`}
            >
              {msg.role === "ai" ? (
                <span
                  className="leading-relaxed"
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
              className={`max-w-[60%] px-4 py-3 rounded-2xl text-sm shadow-sm flex gap-2 items-center transition-all duration-300 ${
                theme === "light"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-gray-800 border border-gray-700 text-green-300"
              }`}
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
              </div>
              <span className="ml-2 text-green-600 dark:text-green-400">
                HealthMate AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`shrink-0 p-4 border-t transition-all duration-300 ${
          theme === "light"
            ? "bg-white border-green-200"
            : "bg-gray-900 border-gray-700"
        }`}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              rows="1"
              placeholder="Type your health question here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className={`w-full resize-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                theme === "light"
                  ? "border border-green-300 bg-green-50 focus:ring-green-400 focus:border-green-400 text-gray-800 placeholder-green-500 hover:border-green-400"
                  : "border border-gray-600 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 placeholder-green-400 hover:border-gray-500"
              }`}
            />
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                theme === "light" ? "text-green-500" : "text-green-400"
              }`}
            >
              {prompt.length}/2000
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              loading || !prompt.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-lg active:scale-95"
            } ${
              theme === "light"
                ? "bg-green-600 text-white border border-green-600 hover:bg-green-700"
                : "bg-green-600 text-white border border-green-600 hover:bg-green-500"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">📤 Send</span>
            )}
          </button>
        </div>

        {error && (
          <div
            className={`mt-3 p-3 rounded-lg text-center text-sm transition-all duration-300 ${
              theme === "light"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-red-900/30 text-red-300 border border-red-800"
            }`}
          >
            ⚠️ {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Gemini;
