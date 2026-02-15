import AuthorityLayout from "../../components/authority/AuthorityLayout";
import { useEffect, useState, useRef } from "react";
import axios from "../../lib/axios";
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

        const res = await axios.get("/api/authority/issues/map", {
          params: {
            lat: mapCenter[0],
            lng: mapCenter[1],
          },
        });

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
      const res = await axios.get("/api/authority/issues/map", {
        params: {
          ...filters,
          lat: mapCenter[0],
          lng: mapCenter[1],
        },
      });

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
      <div className="relative w-full h-dvh overflow-hidden bg-[#0b0f14] font-display">
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
          className="absolute top-20 sm:top-6 left-4 sm:left-6 z-40"
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
          className="absolute top-16 sm:top-6 left-0 right-0 sm:left-auto sm:right-6 z-40 px-3 sm:px-0"
        >
          <div className="flex items-center gap-2 bg-[#111827]/90 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/10 shadow-lg">
            {/* Styled Dropdown Wrapper */}
            {[
              {
                label: "Category",
                value: filters.category,
                key: "category",
                options: [
                  "GARBAGE",
                  "ROAD",
                  "WATER",
                  "POTHOLE",
                  "STREET_LIGHT",
                ],
              },
              {
                label: "Status",
                value: filters.status,
                key: "status",
                options: ["ASSIGNED", "IN_PROGRESS", "RESOLVED"],
              },
              {
                label: "Radius",
                value: filters.radius,
                key: "radius",
                options: [2, 5, 10],
                suffix: " km",
              },
            ].map((filter) => (
              <div key={filter.key} className="relative group flex-1">
                <select
                  value={filter.value}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      [filter.key]:
                        filter.key === "radius"
                          ? Number(e.target.value)
                          : e.target.value,
                    }))
                  }
                  className="appearance-none w-full pl-2 pr-6 py-1.5 text-[10px] font-semibold tracking-wide bg-slate-800/60 text-white rounded-lg border border-white/5 focus:border-blue-500/50 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#111827] text-gray-400">
                    {filter.label}
                  </option>
                  {filter.options.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      className="bg-[#111827] text-white"
                    >
                      {String(opt).replace("_", " ")}
                      {filter.suffix || ""}
                    </option>
                  ))}
                </select>
                {/* Custom Chevron Icon for attractiveness */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
            <div className="h-6 w-px bg-white/10 mx-1" />{" "}
            {/* Vertical Divider */}
            <button
              onClick={fetchMapIssues}
              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all uppercase"
            >
              Apply
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
            attribution="&copy; Stadia Maps, &copy; OpenStreetMap"
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
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
              top: window.innerWidth < 640 ? "50%" : popupPos.top,
              left: window.innerWidth < 640 ? "50%" : popupPos.left,
              transform:
                window.innerWidth < 640
                  ? "translate(-50%, -50%)"
                  : "translate(16px, -50%)",
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
          className="absolute left-4 sm:left-6 bottom-28 sm:bottom-8 z-40"
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
          className="absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 w-full max-w-sm sm:max-w-md px-4 z-40"
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
