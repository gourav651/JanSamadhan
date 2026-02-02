const IssueTimeline = ({ status = "OPEN", createdAt }) => {
  const STEPS = [
    {
      id: 0,
      key: "REPORTED",
      title: "Issue Reported",
      description: "Submitted by citizen",
    },
    {
      id: 1,
      key: "ACKNOWLEDGED",
      title: "Issue Acknowledged",
      description: "Assigned to concerned authority",
    },
    {
      id: 2,
      key: "RESOLVED",
      title: "Issue Resolved",
      description: "Marked as resolved by authority",
    },
  ];

  const STATUS_TO_STEP_INDEX = {
    OPEN: 0,
    ASSIGNED: 1,
    RESOLVED: 2,
  };

  const currentStepIndex = STATUS_TO_STEP_INDEX[status] ?? 0;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Status Timeline</h3>

      <ul className="relative border-gray-200 pl-8 space-y-8">
        <span className="absolute left-4 top-0 h-44 w-px bg-gray-200" />
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.key} className="relative">
              {/* Timeline Dot */}
              <span
                className={`absolute -left-6.5 top-1 w-5 h-5 rounded-full flex items-center justify-center
            ${
              isCurrent
                ? "bg-green-500 ring-4 ring-green-100"
                : isCompleted
                  ? "bg-green-500"
                  : "bg-white border-2 border-gray-300"
            }`}
              >
                {(isCurrent || isCompleted) && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </span>

              {/* Content */}
              <div>
                <h4
                  className={`font-semibold ${
                    isCurrent || isCompleted ? "text-gray-900" : "text-gray-400"
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
