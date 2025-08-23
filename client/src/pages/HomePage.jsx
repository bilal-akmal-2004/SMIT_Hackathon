// Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";
const HomePage = () => {
  const [user, setUser] = useState(null);

  const logoutUser = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("User logged out successfully.");
      navigate("/"); // Redirect to login
    } catch (err) {
      console.error("Error logging out", err);
      toast.error("Logout failed");
    }
  };

  const navigate = useNavigate();

  // this to fecth the token jwt from cookies
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("User not authenticated", err);
        navigate("/"); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1 className="text-6xl">🏠 Welcome to Home Page</h1>
      {user && (
        <p className="flex justify-center text-3xl hover:bg-amber-400 rounded-2xl">
          Logged in as: <strong>{user.name}</strong> ({user.email})
        </p>
      )}
      <button
        className="mt-5 bg-emerald-500 tracking-wide font-semibold w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        onClick={logoutUser}
      >
        Log out
      </button>
    </div>
  );
};

export default HomePage;
