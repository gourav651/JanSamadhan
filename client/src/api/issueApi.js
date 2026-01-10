import axios from "../lib/axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getNearbyIssues = async ({ lat, lng }) => {
  if (!lat || !lng) return [];

  const res = await axios.get(
    `/api/issues/nearby?lat=${lat}&lng=${lng}`
  );

  return res.data.issues || [];
};

