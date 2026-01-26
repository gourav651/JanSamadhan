import { useNavigate } from "react-router-dom";

const IssueCard = ({ issue }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
      <div
        className="md:w-64 h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${issue.images?.[0] || "/placeholder.jpg"})`,
        }}
      />

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {issue.category.replace("_", " ")}
            </span>

            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700">
              {issue.status}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {issue.title}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {issue.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500">
            <p>
              {issue.location?.address || "Location not available"}
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/authority/issues/${issue._id}`)
            }
            className="bg-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
