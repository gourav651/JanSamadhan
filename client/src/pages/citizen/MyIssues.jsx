import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";

const STATUS_COLORS = {
  OPEN: "bg-red-100 text-red-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-700",
};

const BORDER_COLORS = {
  OPEN: "bg-red-500",
  IN_PROGRESS: "bg-yellow-500",
  RESOLVED: "bg-green-500",
};

const formatDate = (date) => new Date(date).toLocaleDateString();

const CitizenMyIssues = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");

  const filteredIssues = issues.filter((issue) => {
    const categoryMatch = category === "all" || issue.category === category;

    const statusMatch = status === "all" || issue.status === status;

    return categoryMatch && statusMatch;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === "upvotes") {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }

    return 0;
  });

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);

  const paginatedIssues = sortedIssues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    const fetchMyIssues = async () => {
      const res = await axios.get("/api/issues/my");
      setIssues(res.data.issues);
    };
    fetchMyIssues();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, status, sortBy]);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold">My Issues</h2>
            <p className="text-gray-500">
              Track the status of the problems you've reported.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              className="border rounded-lg px-4 py-2 text-blue-700"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Street Light">Street Light</option>
              <option value="Roads">Roads</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Sanitation">Sanitation</option>
            </select>

            <select
              className="border rounded-lg px-4 py-2 text-blue-700"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              className="border rounded-lg px-4 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-2">
          {paginatedIssues.map((issue) => (
            <div
              key={issue._id}
              className="relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                  BORDER_COLORS[issue.status]
                }`}
              />

              {/* Left */}
              <div className="flex-1 space-y-2 pl-2">
                <h3 className="text-lg font-bold hover:text-primary">
                  {issue.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2">
                  {issue.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">
                    {issue.category}
                  </span>
                  <span>Reported: {formatDate(issue.createdAt)}</span>
                  <span>
                    {issue.location?.address || "Location not available"}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex md:flex-col justify-between items-end gap-4 min-w-30">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    STATUS_COLORS[issue.status]
                  }`}
                >
                  {issue.status.replace("_", " ")}
                </span>

                <button className="border rounded-lg px-3 py-1.5 text-sm flex items-center gap-1">
                  👍 {issue.upvotes}
                </button>

                <button
                  onClick={() => {
                    console.log("Clicked issue object:", issue);
                    console.log("Clicked issue ID:", issue._id);

                    navigate(`/citizen/issues/${issue._id}`);
                  }}
                  className="text-primary text-sm font-medium cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (static for now) */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {/* Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 border rounded-lg disabled:opacity-40"
            >
              Previous
            </button>

            {/* First page */}
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-2 border rounded-lg"
                >
                  1
                </button>
                <span className="px-2">...</span>
              </>
            )}

            {/* Middle pages (max 3) */}
            {getPaginationRange().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page ? "bg-green-500 text-white" : "border"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-2 border rounded-lg"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-2 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenMyIssues;
