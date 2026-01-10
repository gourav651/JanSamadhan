const IssueTimeline = ({ status = "OPEN", createdAt }) => {
  const STEPS = [
    {
      key: "REPORTED",
      title: "Issue Reported",
      description: "Submitted by citizen",
      activeFor: ["OPEN", "IN_PROGRESS", "RESOLVED"],
    },
    {
      key: "ACKNOWLEDGED",
      title: "Issue Acknowledged",
      description: "Assigned to concerned authority",
      activeFor: ["IN_PROGRESS", "RESOLVED"],
    },
    {
      key: "RESOLVED",
      title: "Issue Resolved",
      description: "Marked as resolved by authority",
      activeFor: ["RESOLVED"],
    },
  ];

  const isCompleted = (step) =>
    step.activeFor.includes(status) &&
    STEPS.findIndex((s) => s.key === step.key) <
      STEPS.findIndex((s) => s.key === status);

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Status Timeline</h3>

      <ul className="relative border-l border-gray-200 pl-8 space-y-8">
        {STEPS.map((step, index) => {
          const isActive = step.activeFor.includes(status);
          const isCurrent =
            step.key ===
            (status === "OPEN"
              ? "REPORTED"
              : status === "IN_PROGRESS"
              ? "ACKNOWLEDGED"
              : "RESOLVED");

          return (
            <li key={step.key} className="relative">
              {/* Timeline Dot */}
              <span
                className={`absolute -left-6.5 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                  isCurrent
                    ? "bg-green-500 ring-4 ring-green-100 animate-pulse"
                    : isActive
                    ? "bg-green-500"
                    : "bg-white border-2 border-gray-300"
                }`}
              >
                {isActive && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </span>

              {/* Content */}
              <div>
                <h4
                  className={`font-semibold ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h4>

                <p className="text-sm text-gray-500">
                  {step.description}
                  {step.key === "REPORTED" && createdAt && (
                    <> • {new Date(createdAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default IssueTimeline;
