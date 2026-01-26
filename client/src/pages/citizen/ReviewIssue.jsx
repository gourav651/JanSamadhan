import { useIssue } from "../../context/IssueContext";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import LocationPreviewMap from "../../components/citizen/LocationPreviewMap";
import ReportStepper from "../../components/citizen/ReportStepper";
import { useAuth } from "@clerk/clerk-react";

const CATEGORY_MAP = {
  "Street Light": "STREET_LIGHT",
  Roads: "ROAD",
  "Water Supply": "WATER",
  Garbage: "GARBAGE",
  Pothole: "POTHOLE",
  Other: "OTHER",
};

const CitizenReviewIssue = () => {
  const { issueDraft, clearIssueDraft } = useIssue();
  const navigate = useNavigate();

  const reportedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  // ✅ FIXED: final description logic (from Code 1)
  const finalDescription =
    issueDraft.extraDescription?.trim() || issueDraft.description?.trim();

  const { getToken } = useAuth();

  const handleSubmit = async () => {
    try {
      const token = await getToken();

      const formData = new FormData();

      formData.append("title", issueDraft.title.trim());

      const normalizedCategory =
        CATEGORY_MAP[issueDraft.category] ?? issueDraft.category?.toUpperCase();

      formData.append("category", normalizedCategory);
      formData.append("description", finalDescription);

      formData.append(
        "location",
        JSON.stringify({
          lat: issueDraft.location.lat,
          lng: issueDraft.location.lng,
          address: issueDraft.location.address,
        })
      );

      issueDraft.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      await axios.post("/api/issues", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearIssueDraft();
      navigate("/citizen/my-issues");
    } catch (error) {
      console.error(error);
      alert("Failed to submit issue");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <ReportStepper currentStep={3} />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-6">
          {/* Issue Details */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Issue Details</h3>
              <button
                onClick={() => navigate("/citizen/report")}
                className="text-primary text-sm font-medium"
              >
                Edit
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Category</p>
                  <p className="font-medium">{issueDraft.category}</p>
                </div>

                {/* Reported Date */}
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Reported Date
                  </p>
                  <p className="font-medium">{reportedDate}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Title</p>
                <p className="font-semibold">{issueDraft.title}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase">Description</p>
                <p className="text-gray-700">{finalDescription}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Location</h3>
              <button
                onClick={() => navigate("/citizen/report/location")}
                className="text-primary text-sm font-medium"
              >
                Edit
              </button>
            </div>

            <div className="p-4 space-y-3">
              <LocationPreviewMap
                lat={issueDraft.location.lat}
                lng={issueDraft.location.lng}
              />
              <div>
                <p>PINPOINTED ADDRESS</p>
                <p className="text-sm text-gray-700 mt-2">
                  📍 {issueDraft.location.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-6">
          {/* Evidence */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">Evidence</h3>
              <button
                onClick={() => navigate("/citizen/report/location")}
                className="text-primary text-sm font-medium"
              >
                Edit
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              {issueDraft.images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt="evidence"
                  className="rounded-lg object-cover h-28 w-full"
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white border rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Ready to Submit?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm all details before submitting.
            </p>

            <button
              onClick={handleSubmit}
              className="w-full bg-primary font-bold py-3 rounded-lg transition"
            >
              Confirm & Submit
            </button>

            <button
              onClick={() => navigate("/citizen/report/location")}
              className="w-full mt-3 border py-3 rounded-lg text-gray-600"
            >
              Back to Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenReviewIssue;
