import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/admin",
  withCredentials: true,
});

// ✅ Attach token ONLY here
API.interceptors.request.use(async (config) => {
  if (window.Clerk?.session) {
    const token = await window.Clerk.session.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ===== APIs =====
export const fetchAllIssues = ({
  page = 1,
  limit = 15,
  search = "",
  status,
  category,
  priority,
  startDate,
  endDate,
} = {}) =>
  API.get("/issues", {
    params: {
      page,
      limit,
      search,
      status,
      category,
      priority,
      startDate,
      endDate,
    },
  });

export const fetchIssueById = (issueId) => API.get(`/issues/${issueId}`);

export const fetchAuthorities = ({
  search = "",
  status = "",
  department = "",
  page = 1,
  limit = 10,
} = {}) =>
  API.get("/authorities", {
    params: {
      search,
      status,
      department,
      page,
      limit,
    },
  });

export const assignIssue = (issueId, authorityId) =>
  API.patch(`/issues/${issueId}/assign`, { authorityId });
