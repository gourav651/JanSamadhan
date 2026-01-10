const tips = [
  {
    icon: "info",
    title: "Be Specific",
    text: "Clear titles help categorize faster.",
    color: "blue"
  },
  {
    icon: "photo_camera",
    title: "Add Photos",
    text: "Visual proof speeds verification.",
    color: "yellow"
  },
  {
    icon: "verified",
    title: "Stay Safe",
    text: "Don't put yourself in danger.",
    color: "green"
  }
];

const ReportTips = () => {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {tips.map(tip => (
        <div
          key={tip.title}
          className={`p-4 rounded-lg border bg-${tip.color}-50`}
        >
          <span className="material-icons-outlined text-lg">
            {tip.icon}
          </span>
          <h3 className="font-medium text-sm mt-1">{tip.title}</h3>
          <p className="text-xs text-gray-600 mt-1">{tip.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportTips;
