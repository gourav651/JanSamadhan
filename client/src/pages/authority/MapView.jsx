import AuthorityLayout from "../../components/authority/AuthorityLayout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { markerIcon } from "@/utils/leafletIcon";
import MarkerClusterGroup from "react-leaflet-cluster";

const STATUS_STYLES = {
  RESOLVED: "bg-emerald-500 ring-emerald-500/30",
  IN_PROGRESS: "bg-amber-500 ring-amber-500/30",
  ASSIGNED: "bg-red-500 ring-red-500/30",
};

const AuthMapView = () => {
  const { getToken } = useAuth();
  const popupRef = useRef(null);

  const navigate = useNavigate();

  const [allIssues, setAllIssues] = useState([]); 
  const [issues, setIssues] = useState([]); // visible issues
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [mapCenter, setMapCenter] = useState(null); //start as null
  const mapRef = useRef(null);

  const [filters, setFilters] = useState({
    category: "",
    status: "",
    radius: 5,
  });

  /* ================= GEOLOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      setMapCenter([20.5937, 78.9629]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
      () => setMapCenter([20.5937, 78.9629]),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  /* ================= INITIAL LOAD (ALL ISSUES) ================= */
  useEffect(() => {
    if (!mapCenter) return;

    const loadAllIssues = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await axios.get(
          "http://localhost:5000/api/authority/issues/map",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              lat: mapCenter[0],
              lng: mapCenter[1],
            },
          },
        );

        setAllIssues(res.data.issues);
        setIssues(res.data.issues); // ✅ show all initially
        setSearch(""); // ✅ reset search on new filter
      } catch (err) {
        console.error("Map load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllIssues();
  }, [mapCenter, getToken]);

  useEffect(() => {
    if (!selectedIssue) return;

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedIssue(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedIssue]);


  const fetchMapIssues = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await axios.get(
        "http://localhost:5000/api/authority/issues/map",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ...filters,
            lat: mapCenter[0],
            lng: mapCenter[1],
          },
        },
      );

      setAllIssues(res.data.issues); // 🔑 update search base
      setIssues(res.data.issues);
      setSearch(""); // 🔑 reset search input
      setSelectedIssue(null);
    } catch (err) {
      console.error("Map filter error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mapCenter) return null;

  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setIssues(allIssues);
      setSelectedIssue(null);
      return;
    }

    const q = value.toLowerCase();

    const filtered = allIssues.filter(
      (issue) =>
        issue._id.toLowerCase().includes(q) ||
        issue.title?.toLowerCase().includes(q) ||
        issue.location?.address?.toLowerCase().includes(q),
    );

    setIssues(filtered);
  };

  return (
    <AuthorityLayout>
      <div className="relative w-full h-screen overflow-hidden bg-[#0b0f14] font-display">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-50">
            Loading map data…
          </div>
        )}

        {!loading && issues.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-50 pointer-events-none">
            No assigned issues found
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-6 left-6 z-40"
        >
          <div className="bg-[#111827]/90 backdrop-blur-xl px-5 py-3 mt-15 rounded-xl border border-white/10 shadow-lg">
            <h2 className="text-sm font-bold text-white">
              Geospatial Issue Monitor
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Monitoring: Downtown District
            </p>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-6 right-6 z-40"
        >
          <div className="flex items-center gap-2 bg-[#111827]/90 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/10 shadow-lg">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              className="px-3 py-2 text-xs bg-transparent text-gray-200"
            >
              <option value="">Category</option>
              <option value="GARBAGE">Garbage</option>
              <option value="ROAD">Road</option>
              <option value="WATER">Water</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
              className="px-3 py-2 text-xs bg-transparent text-gray-200"
            >
              <option value="">Status</option>
              <option value="ASSIGNED">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              value={filters.radius}
              onChange={(e) =>
                setFilters((f) => ({ ...f, radius: Number(e.target.value) }))
              }
              className="px-3 py-2 text-xs bg-transparent text-gray-200"
            >
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>

            <button
              onClick={fetchMapIssues}
              className="ml-2 bg-primary px-4 py-2 rounded-lg text-xs font-bold"
            >
              APPLY
            </button>
          </div>
        </div>

        {/* ================= MAP ================= */}
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="absolute inset-0 z-10"
          whenCreated={(map) => {
            mapRef.current = map;
            map.on("click", () => setSelectedIssue(null));
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
            maxClusterRadius={50}
          >
            {issues.map((issue) => {
              if (!issue.location?.coordinates) return null;
              const [lng, lat] = issue.location.coordinates;

              return (
                <Marker
                  key={issue._id}
                  position={[lat, lng]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: (e) => {
                      e.originalEvent.stopPropagation();
                      setSelectedIssue(issue);
                      setPopupPos({
                        top: e.originalEvent.clientY,
                        left: e.originalEvent.clientX,
                      });
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        {/* ================= ISSUE POPUP ================= */}
        {selectedIssue && (
          <div
            ref={popupRef} // ✅ ADD THIS
            className="fixed z-50 w-80 bg-[#111827] rounded-xl border border-white/10 shadow-2xl"
            style={{
              top: popupPos.top,
              left: popupPos.left,
              transform: "translate(16px, -50%)",
            }}
          >
            <div className="p-4 space-y-3 text-gray-200">
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-500">
                {selectedIssue.status}
              </span>

              <h4 className="text-sm font-bold mt-2">{selectedIssue.title}</h4>

              <p className="text-xs text-gray-400">
                {selectedIssue.location?.address || "—"}
              </p>

              <div className="flex justify-end pt-3 border-t border-white/10">
                <button
                  onClick={() =>
                    navigate(`/authority/issues/${selectedIssue._id}`)
                  }
                  className="bg-primary text-xs font-bold px-4 py-2 rounded-lg"
                >
                  VIEW ISSUE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= LEGEND ================= */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-6 bottom-8 z-40"
        >
          <div className="bg-[#111827]/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-lg space-y-2 text-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Status Legend
            </p>
            <LegendRow color="red" label="Open" />
            <LegendRow color="amber" label="In Progress" />
            <LegendRow color="emerald" label="Resolved" />
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 w-full max-w-md px-4 z-40"
        >
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search location or issue ID..."
            className="w-full bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-2xl py-4 px-5 shadow-xl text-sm text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthMapView;

const LegendRow = ({ color, label }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className={`w-3 h-3 bg-${color}-500 rounded-full`} />
    {label}
  </div>
);
