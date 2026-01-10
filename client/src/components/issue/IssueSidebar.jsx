import axios from "../../lib/axios";
import { useState } from "react";
import LocationPreviewMap from "../../components/citizen/LocationPreviewMap";
import IssueLocationModal from "./IssueLocationModal";

const IssueSidebar = ({ issue }) => {
  const [upvotes, setUpvotes] = useState(issue.upvotes || 0);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // ✅ GeoJSON → lat/lng (MongoDB format)
  const lat = issue.location?.coordinates?.[1];
  const lng = issue.location?.coordinates?.[0];

  /* 👍 Safe upvote */
  const handleUpvote = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const res = await axios.post(`/api/issues/${issue._id}/upvote`);
      setUpvotes(res.data.upvotes);
    } catch (err) {
      console.error("Upvote failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔗 Share issue */
  const handleShare = () => {
    const url = `${window.location.origin}/citizen/issues/${issue._id}`;
    navigator.clipboard.writeText(url);
    alert("Issue link copied to clipboard");
  };

  return (
    <>
      <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-24 h-fit space-y-6">
        {/* UPVOTES */}
        <div className="bg-yellow-50 p-4 rounded flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{upvotes}</p>
            <p className="text-xs uppercase text-gray-500">Upvotes</p>
          </div>

          <button
            onClick={handleUpvote}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-semibold transition
              ${
                loading
                  ? "bg-yellow-100 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-200 hover:bg-yellow-300"
              }`}
          >
            👍 {loading ? "Voting..." : "Vote"}
          </button>
        </div>

        {/* LOCATION */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Location</span>

            {lat && lng && (
              <button
                onClick={() => setShowMap(true)}
                className="text-primary text-sm hover:underline"
              >
                View Full Map
              </button>
            )}
          </div>

          {lat && lng ? (
            <LocationPreviewMap lat={lat} lng={lng} />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 border rounded">
              Location unavailable
            </div>
          )}

          <p className="text-sm text-gray-600 mt-2">
            {issue.location?.address || "Address not available"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full border py-2 rounded text-sm hover:bg-gray-50"
          >
            Share Issue
          </button>

          <button
            disabled
            className="w-full bg-gray-100 py-2 rounded text-sm text-gray-400 cursor-not-allowed"
          >
            Follow Updates
          </button>
        </div>
      </div>

      {/* FULL MAP MODAL */}
      {showMap && lat && lng && (
        <IssueLocationModal
          lat={lat}
          lng={lng}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
};

export default IssueSidebar;
