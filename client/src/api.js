import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,

  withCredentials: true,
});

export const googleAuth = (code) =>
  api.get(`/api/auth/google?code=${encodeURIComponent(code)}`);
