// Home.jsx
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
const HomePage = () => {
  const [user, setUser] = useState(null);
  const handleLogout = () => {
    localStorage.removeItem("user"); // remove token
    navigate("/"); // redirect to login/signup page
    toast.success("User logged out successfully.");
  };
  const navigate = useNavigate();
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (cookie) {
      const token = cookie.split("=")[1];
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return (
    <div>
      <h1 className="text-6xl">🏠 Welcome to Home Page</h1>
      {user && (
        <p>
          Logged in as: <strong>{user.name}</strong> ({user.email})
        </p>
      )}
      <button
        className="mt-5 bg-emerald-500 tracking-wide font-semibold w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default HomePage;
