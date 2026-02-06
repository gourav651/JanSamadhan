import { useIssue } from "../../context/IssueContext";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ArrowRight } from "lucide-react";

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
      <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
          <ClipboardList size={20} className="text-blue-600" />
        </div>
        Issue Summary
      </h3>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="text-sm text-black">Category</label>
          <p className="font-medium">{issueDraft.category}</p>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-black">Description</label>
          <p className="text-sm text-gray-700">{issueDraft.description}</p>
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

      <div className="mt-8 pt-6 border-t-2 border-slate-50">
        <button
          onClick={handleContinue}
          className="group w-full cursor-pointer bg-green-400 flex items-center justify-center gap-2 border-2 border-slate-900 py-4 rounded-2xl font-black hover:shadow-none transition-all active:scale-95"
        >
          Continue to Review
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default IssueSummary;
