import axios from "../lib/axios";

export const syncUserWithDB = async (user) => {
  if (!user) return;

  try {
    await axios.post("/api/users/sync", {
      name: user.fullName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
    });
  } catch (err) {
    console.error("❌ User sync failed", err.response?.data || err);
  }
};
