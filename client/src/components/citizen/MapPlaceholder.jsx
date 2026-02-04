import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { markerIcon } from "../../utils/leafletIcon";
import { userMarkerIcon } from "../../utils/userMarkerIcon";

/* 🔧 Auto-fit bounds when issues change */
const FitBounds = ({ userLocation, issues }) => {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;

    const bounds = [];

    bounds.push([userLocation.lat, userLocation.lng]);

    issues.forEach((issue) => {
      if (issue.location?.coordinates) {
        bounds.push([
          issue.location.coordinates[1],
          issue.location.coordinates[0],
        ]);
      }
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [userLocation, issues, map]);

  return null;
};

const MapPlaceholder = ({ userLocation, issues, loading }) => {
  const navigate = useNavigate();

  if (loading || !userLocation) {
    return (
      <div className="h-full bg-slate-50 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-tight">
          Locating your neighborhood...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative group">
      {/* Floating Label overlay */}
      <div className="absolute top-4 left-4 z-400 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20 pointer-events-none">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Active Zone
        </p>
        <p className="text-sm font-bold text-slate-800">Local Area Map</p>
      </div>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        className="h-full w-full z-0"
        zoomControl={false} // Hide default for cleaner look
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 User location */}
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userMarkerIcon}
        >
          <Popup className="custom-popup">
            <strong>You are here</strong>
          </Popup>
        </Marker>

        <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
          {issues.map((issue) => (
            <Marker
              key={issue._id}
              position={[
                issue.location.coordinates[1],
                issue.location.coordinates[0],
              ]}
              icon={markerIcon}
            >
              <Popup>
                <div
                  className="p-1 min-w-37.5 cursor-pointer"
                  onClick={() => navigate(`/citizen/issues/${issue._id}`)}
                >
                  <div className="w-full h-20 bg-slate-100 rounded-lg mb-2 overflow-hidden">
                    <img
                      src={issue.images?.[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <strong className="block text-slate-800">
                    {issue.title}
                  </strong>
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    Details →
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <FitBounds userLocation={userLocation} issues={issues} />
      </MapContainer>
    </div>
  );
};

export default MapPlaceholder;
