// client/src/pages/SharedWithMe.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const SharedWithMe = () => {
  const [sharedWithMe, setSharedWithMe] = useState([]); // people who shared with me
  const [sharedByMe, setSharedByMe] = useState([]); // people I shared with
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // People who shared with me
        const sharedWithMeRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/shared-with-me`,
          { withCredentials: true }
        );
        setSharedWithMe(sharedWithMeRes.data);

        // People I shared with (reverse lookup)
        const allShares = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/shared-by-me`,
          { withCredentials: true }
        );
        setSharedByMe(allShares.data);
      } catch (err) {
        console.error("Failed to load shared lists");
      }
    };
    fetchData();
  }, []);

  const handleRevoke = async (viewerId) => {
    if (!window.confirm("Revoke access? They will no longer see your data."))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/share/revoke/${viewerId}`,
        { withCredentials: true }
      );
      setSharedByMe((prev) => prev.filter((u) => u.id !== viewerId));
    } catch (err) {
      alert("Failed to revoke access");
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-gray-950 to-black"
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/home")}
          className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm border ${
            theme === "light"
              ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
          }`}
        >
          ← Back to Home
        </button>

        {/* Shared With Me */}
        <div
          className={`rounded-2xl p-6 mb-8 shadow-sm border ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            👥 Shared With You
          </h2>
          {sharedWithMe.length === 0 ? (
            <p
              className={theme === "light" ? "text-gray-600" : "text-gray-400"}
            >
              No one has shared their health data with you yet.
            </p>
          ) : (
            <div className="space-y-3">
              {sharedWithMe.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/shared/${user.id}`)}
                  className={`p-4 rounded-xl cursor-pointer transition ${
                    theme === "light"
                      ? "bg-indigo-50 hover:bg-indigo-100"
                      : "bg-gray-900 hover:bg-gray-850"
                  }`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm opacity-70">{user.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shared By Me */}
        <div
          className={`rounded-2xl p-6 shadow-sm border ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            📤 You Shared With
          </h2>
          {sharedByMe.length === 0 ? (
            <p
              className={theme === "light" ? "text-gray-600" : "text-gray-400"}
            >
              You haven’t shared your data with anyone yet.
            </p>
          ) : (
            <div className="space-y-3">
              {sharedByMe.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 rounded-xl flex justify-between items-center ${
                    theme === "light" ? "bg-gray-50" : "bg-gray-900"
                  }`}
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm opacity-70">{user.email}</div>
                  </div>
                  <button
                    onClick={() => handleRevoke(user.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg ${
                      theme === "light"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    }`}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedWithMe;
