import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  if (window.Clerk) {
    const token = await window.Clerk.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
