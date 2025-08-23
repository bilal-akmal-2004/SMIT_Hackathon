import { useEffect, useState } from "react";

import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
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

  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;
