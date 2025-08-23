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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-lg w-96 ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          Set Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg focus:outline-none border ${
              theme === "light"
                ? "bg-gray-100 border-gray-300 text-black focus:border-gray-500"
                : "bg-gray-700 border-gray-600 text-white focus:border-gray-400"
            }`}
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                theme === "light"
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-indigo-900 text-white hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                theme === "light"
                  ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
