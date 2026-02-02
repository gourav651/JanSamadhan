import { useNavigate } from "react-router-dom";
import { useIssue } from "../../context/IssueContext";

const STATUS_STYLES = {
  CRITICAL: "bg-red-100 text-red-700",
  OPEN: "bg-orange-100 text-orange-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-green-100 text-green-700",
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds > 86400) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds > 3600) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds > 60) return `${Math.floor(seconds / 60)} minutes ago`;
  return "just now";
};

const getDisplayStatus = (issue) => {
  const hoursOld = (Date.now() - new Date(issue.createdAt)) / 36e5;
  if (issue.status === "OPEN" && (issue.upvotes >= 30 || hoursOld >= 48)) {
    return "CRITICAL";
  }
  return issue.status;
};

const NearbyIssues = () => {
  const navigate = useNavigate();
  const { nearbyIssues, loadingNearby } = useIssue();

  if (loadingNearby) {
    return <div className="bg-white rounded-xl border p-4">Loading…</div>;
  }

  return (
    <div className="bg-white rounded-xl border h-full flex flex-col">
      {/* HEADER */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Nearby Issues</h3>

        <button
          onClick={() => navigate("/citizen/my-issues")}
          className="text-sm font-medium text-blue-600 cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {nearbyIssues.map((issue) => {
          const status = getDisplayStatus(issue);

          return (
            <div
              key={issue._id}
              onClick={() => navigate(`/citizen/issues/${issue._id}`)}
              className="flex gap-4 p-4 border-b cursor-pointer hover:bg-gray-50"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={issue.images?.[0] || "https://via.placeholder.com/100"}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-semibold">{issue.title}</h4>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${STATUS_STYLES[status]}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {issue.category.replace("_", " ")} ·{" "}
                  {timeAgo(issue.createdAt)}
                </p>

                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {issue.description}
                </p>

                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  👍 {issue.upvotes ?? 0}
                  💬 {issue.comments?.length ?? 0}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NearbyIssues;
