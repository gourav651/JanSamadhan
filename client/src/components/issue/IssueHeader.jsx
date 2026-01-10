const IssueHeader = ({ issue }) => {
  const handleCopyId = () => {
    navigator.clipboard.writeText(issue._id);
    alert("Issue ID copied");
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds > 86400) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds > 3600) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds > 60) return `${Math.floor(seconds / 60)} minutes ago`;
    return "just now";
  };

  const getSeverity = (issue) => {
    const hoursOld =
      (Date.now() - new Date(issue.createdAt)) / (1000 * 60 * 60);

    if (issue.upvotes >= 30 || hoursOld >= 72) return "HIGH";
    if (issue.upvotes >= 10 || hoursOld >= 24) return "MEDIUM";
    return "LOW";
  };

  const SEVERITY_STYLES = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    LOW: "bg-gray-100 text-gray-600",
  };

  const severity = getSeverity(issue);

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">{issue.title}</h1>

      {/* Meta info */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold">
          {issue.category}
        </span>

        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            issue.status === "OPEN"
              ? "bg-red-100 text-red-700"
              : issue.status === "IN_PROGRESS"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-700"
          }`}
        >
          {issue.status.replace("_", " ")}
        </span>

        {/* ✅ SEVERITY BADGE */}
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${SEVERITY_STYLES[severity]}`}
        >
          ⚠ {severity} PRIORITY
        </span>

        <span title={new Date(issue.createdAt).toLocaleString()}>
          Reported {timeAgo(issue.createdAt)}
        </span>

        <span className="flex items-center gap-2">
          ID: {issue._id}
          <button
            onClick={handleCopyId}
            title="Copy Issue ID"
            className="text-gray-400 hover:text-gray-700 text-xs"
          >
            📋
          </button>
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">{issue.description}</p>
    </div>
  );
};

export default IssueHeader;
