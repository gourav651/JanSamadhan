import axios from "../lib/axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

export const getNearbyIssues = async ({ lat, lng }) => {
  if (!lat || !lng) return [];

  const res = await API.get(
    `/issues/nearby?lat=${lat}&lng=${lng}`
  );

  return res.data.issues || [];
};
