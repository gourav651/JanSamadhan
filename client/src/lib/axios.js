import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  try {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Token attach error:", error);
  }

  return config;
});


export default instance;
