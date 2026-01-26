import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AuthorityLayout from "../../components/authority/AuthorityLayout";
import IssueCard from "../../components/authority/IssueCard";
import axios from "axios";

const AuthAssignedIssues = () => {
  const { getToken } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Filters
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔄 Fetch assigned issues (with filters)
  const fetchAssignedIssues = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await axios.get(
        "http://localhost:5000/api/authority/issues/assigned",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status,
            category,
            priority,
            page,
            limit: 5,
          },
        },
      );

      setIssues(res.data.issues);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch assigned issues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [status, category, priority]);

  // 🔁 Re-fetch whenever filters change
  useEffect(() => {
    fetchAssignedIssues();
  }, [status, category, priority, page]);

  return (
    <AuthorityLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between w-full mb-6">
          {/* LEFT: TITLE */}
          <div>
            <h1 className="text-4xl font-black text-gray-900">
              My Assigned Issues
            </h1>
            <p className="text-gray-500 mt-2">
              {issues.length} active tasks requiring your attention
            </p>
          </div>

          {/* RIGHT: FILTERS */}
          <div className="flex items-center gap-3">
            {/* Category */}
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 px-1 rounded-2xl border bg-gray-200 text-sm font-medium shadow-sm hover:border-gray-400 focus:outline-none"
            >
              <option value="">Category</option>
              <option value="WATER">Water</option>
              <option value="ROAD">Road</option>
              <option value="GARBAGE">Garbage</option>
              <option value="STREET_LIGHT">Street Light</option>
            </select>

            {/* Priority */}
            <select
              onChange={(e) => setPriority(e.target.value)}
              className="h-10 px-4 rounded-2xl border bg-gray-200 text-sm font-medium shadow-sm hover:border-gray-400 focus:outline-none"
            >
              <option value="">Priority</option>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>

            {/* Status */}
            <select
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 px-1 rounded-2xl border bg-gray-200 text-sm font-medium shadow-sm hover:border-gray-400 focus:outline-none"
            >
              <option value="">Status</option>
              <option value="ASSIGNED">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading issues...</p>
        )}

        {!loading && issues.length === 0 && (
          <p className="text-center text-gray-500">
            No issues assigned to you.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
};

export default AuthAssignedIssues;
