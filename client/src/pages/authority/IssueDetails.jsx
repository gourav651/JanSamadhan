import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import AuthorityLayout from "../../components/authority/AuthorityLayout";

const AuthIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showAllImages, setShowAllImages] = useState(false);

  const [showMap, setShowMap] = useState(false);

  const isResolved = issue?.status === "RESOLVED";

  /* ---------------- FETCH ISSUE ---------------- */
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:5000/api/authority/issues/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setIssue(res.data.issue);
        setStatus(res.data.issue.status);
        setNotes(res.data.issue.resolutionNotes || "");
      } catch (err) {
        console.error("Failed to load issue", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  /* ---------------- SUCCESS RESET ---------------- */
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  /* ---------------- UPDATE STATUS ---------------- */
  const handleUpdateStatus = async () => {
    if (isResolved) return;

    try {
      setSaving(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append("status", status);
      formData.append("resolutionNotes", notes);

      files.forEach((f) => formData.append("resolutionImages", f));

      await axios.patch(
        `http://localhost:5000/api/authority/issues/${id}/status`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setIssue((prev) => ({
        ...prev,
        status,
        resolutionNotes: notes,
      }));

      setFiles([]);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update issue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <p className="text-center mt-20 text-gray-500">Loading issue…</p>
      </AuthorityLayout>
    );
  }

  if (!issue) {
    return (
      <AuthorityLayout>
        <p className="text-center mt-20 text-red-500">Issue not found</p>
      </AuthorityLayout>
    );
  }

  const citizenImages = issue.images || [];
  const heroImage = citizenImages[0];
  // const remainingImages = citizenImages.slice(1);

  const isUnchanged =
    status === issue?.status &&
    notes === (issue?.resolutionNotes || "") &&
    files.length === 0;

  const disabledOverlay =
    "relative cursor-not-allowed after:absolute after:inset-0 after:flex after:items-center after:justify-center after:opacity-0 hover:after:opacity-100 after:text-2xl after:text-red-500 after:bg-white/70";

  return (
    <AuthorityLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black">Manage Issue Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-gray-100 font-semibold"
          >
            Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="xl:col-span-8 space-y-6">
            {/* Main Image */}
            {issue.images?.[0] && (
              <div className="w-full h-90 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={issue.images[0]}
                  alt="Issue"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* ISSUE DETAILS */}
            <div className="bg-white p-6 rounded-xl border space-y-3">
              <p className="text-xs text-primary font-bold">
                ISSUE ID: {issue._id}
              </p>

              <h2 className="text-2xl font-bold">{issue.title}</h2>

              <p className="text-sm text-gray-500">
                Category: {issue.category}
              </p>

              <p className="text-gray-700">{issue.description}</p>

              <p className="text-sm font-semibold">
                👍 {issue.upvotes || 0} Upvotes
              </p>
            </div>

            {/* CITIZEN EVIDENCE */}
            {issue.images?.length > 1 && (
              <div>
                <h3 className="font-bold mb-3">Citizen Evidence</h3>

                <div className="grid grid-cols-3 gap-4">
                  {(showAllImages
                    ? issue.images
                    : issue.images.slice(1, 4)
                  ).map((img, i) => {
                    const isBlurred =
                      !showAllImages && i === 2 && issue.images.length > 4;

                    return (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => isBlurred && setShowAllImages(true)}
                      >
                        <img
                          src={img}
                          className={`w-full h-full object-cover ${
                            isBlurred ? "blur-sm" : ""
                          }`}
                          alt="Evidence"
                        />

                        {isBlurred && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
                            +{issue.images.length - 3} more
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-4 space-y-6">
            {/* LOCATION */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="font-bold">Location</h3>
                <button
                  onClick={() => setShowMap(true)}
                  className="text-primary text-sm font-semibold"
                >
                  View full map
                </button>
              </div>

              <div className="h-48">
                <iframe
                  title="map-preview"
                  className="w-full h-full"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${issue.location.coordinates[1]},${issue.location.coordinates[0]}&z=14&output=embed`}
                />
              </div>

              <div className="p-4 text-sm text-gray-600">
                <p>{issue.location.address}</p>
                <p className="text-xs mt-1">
                  Lat: {issue.location.coordinates[1]} | Lng:{" "}
                  {issue.location.coordinates[0]}
                </p>
              </div>
            </div>

            {/* AUTHORITY ACTION PANEL */}
            <div className="bg-white rounded-xl border-2 border-primary/20 p-6 space-y-6">
              <h3 className="text-xl font-bold">Authority Actions Panel</h3>

              {/* STATUS */}
              <div className={isResolved ? disabledOverlay : ""}>
                <select
                  value={status}
                  disabled={isResolved}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg bg-gray-100 disabled:opacity-60"
                >
                  <option value="OPEN">🔴 OPEN</option>
                  <option value="IN_PROGRESS">🟡 IN PROGRESS</option>
                  <option value="RESOLVED">🟢 RESOLVED</option>
                </select>
              </div>

              {/* NOTES */}
              <div className={isResolved ? disabledOverlay : ""}>
                <textarea
                  rows={4}
                  disabled={isResolved}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-100 disabled:opacity-60"
                />
              </div>

              {/* UPLOAD */}
              <div>
                <label className="block font-semibold mb-2">
                  Upload Resolution Proof
                </label>
                <div className={isResolved ? disabledOverlay : ""}>
                  <input
                    type="file"
                    multiple
                    disabled={isResolved}
                    onChange={(e) => setFiles([...e.target.files])}
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className={isResolved ? disabledOverlay : ""}>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isResolved || saving || isUnchanged}
                  className="w-full h-12 bg-primary font-bold rounded-xl disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Issue Status"}
                </button>
              </div>

              {isUnchanged && issue.status !== "RESOLVED" && (
                <p className="text-xs text-gray-500 text-center">
                  Make a change to enable update
                </p>
              )}

              {success && (
                <p className="text-green-600 text-sm font-semibold">
                  ✅ Issue updated successfully
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-4xl rounded-xl overflow-hidden relative">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-bold shadow"
            >
              ✕
            </button>

            <div className="h-125">
              <iframe
                title="map-full"
                className="w-full h-full"
                loading="lazy"
                src={`https://www.google.com/maps?q=${issue.location.coordinates[1]},${issue.location.coordinates[0]}&z=16&output=embed`}
              />
            </div>
          </div>
        </div>
      )}
    </AuthorityLayout>
  );
};

export default AuthIssueDetails;
