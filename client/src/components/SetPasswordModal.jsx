import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SetPasswordModal({ isOpen, onClose, email, theme }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/set-password`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(res.data.msg || "Password set successfully!");
      setTimeout(() => {
        onClose();
        window.location.reload(); // force them to log in again
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error setting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div
        className={`p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 transform hover:scale-[1.02] ${
          theme === "light"
            ? "bg-white border border-green-200"
            : "bg-gray-800 border border-gray-700"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-110">
            <span className="text-2xl">🔐</span>
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              theme === "light" ? "text-green-700" : "text-green-400"
            }`}
          >
            Set Your Password
          </h2>
          <p
            className={`text-sm ${
              theme === "light" ? "text-green-600" : "text-green-300"
            }`}
          >
            Create a password for your HealthMate account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Display */}
          <div
            className={`p-3 rounded-xl text-center ${
              theme === "light"
                ? "bg-green-50 border border-green-200"
                : "bg-gray-700 border border-gray-600"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                theme === "light" ? "text-green-700" : "text-green-300"
              }`}
            >
              {email}
            </p>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${
                theme === "light" ? "text-green-700" : "text-green-300"
              }`}
            >
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 border ${
                theme === "light"
                  ? "bg-green-50 border-green-300 text-gray-800 focus:ring-green-400 focus:border-green-400 placeholder-green-500 hover:border-green-400"
                  : "bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500 placeholder-green-400 hover:border-gray-500"
              }`}
              required
              minLength={6}
            />
            <p
              className={`text-xs ${
                theme === "light" ? "text-green-600" : "text-green-400"
              }`}
            >
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                theme === "light"
                  ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                  : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500"
              }`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : theme === "light"
                  ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:shadow-lg"
                  : "bg-green-600 text-white border border-green-600 hover:bg-green-500 hover:shadow-lg"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting Password...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✅ Save Password
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Security Note */}
        <div
          className={`mt-6 p-3 rounded-xl text-center ${
            theme === "light"
              ? "bg-blue-50 border border-blue-200"
              : "bg-blue-900/20 border border-blue-800"
          }`}
        >
          <p
            className={`text-xs ${
              theme === "light" ? "text-blue-700" : "text-blue-300"
            }`}
          >
            🔒 Your password is encrypted and stored securely
          </p>
        </div>
      </div>
    </div>
  );
}
