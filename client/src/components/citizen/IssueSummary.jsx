import { useIssue } from "../../context/IssueContext";
import { useNavigate } from "react-router-dom";

const IssueSummary = () => {
  const { issueDraft, updateIssueDraft } = useIssue();
  const navigate = useNavigate();

  const handleContinue = () => {
    // 📍 Location validation
    if (!issueDraft.location?.lat || !issueDraft.location?.lng) {
      alert("📍 Please select a location on the map before continuing.");
      return;
    }

    // 📷 Image validation
    if (!issueDraft.images || issueDraft.images.length === 0) {
      alert("📷 Please upload at least one visual evidence.");
      return;
    }

    navigate("/citizen/report/review");
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4">Issue Summary</h3>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="text-sm text-black">Category</label>
          <p className="font-medium">{issueDraft.category}</p>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-black">Description</label>
          <p className="text-sm text-gray-700">
            {issueDraft.description}
          </p>
        </div>

        {/* ✅ Additional description (FIXED) */}
        <div>
          <label className="text-sm text-black">
            Additional Details (optional)
          </label>
          <textarea
            value={issueDraft.extraDescription || ""}
            onChange={(e) =>
              updateIssueDraft({
                extraDescription: e.target.value,
              })
            }
            rows={3}
            placeholder="Add more details about the location, timing, severity, etc."
            className="w-full mt-1 border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <button
          onClick={handleContinue}
          className="w-full bg-primary py-3 rounded-lg font-semibold"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default IssueSummary;
