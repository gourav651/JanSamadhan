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
      <div className="h-full bg-gray-100 flex items-center justify-center rounded-xl">
        Detecting location…
      </div>
    );
  }

  return (
    <div className="h-full rounded-xl overflow-hidden border">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        className="h-full w-full"
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
  <Popup>
    <strong>You are here</strong>
  </Popup>
</Marker>


        {/* 🔵 CLUSTERED ISSUE MARKERS */}
        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {issues.map((issue) => (
            <Marker
              key={issue._id}
              position={[
                issue.location.coordinates[1],
                issue.location.coordinates[0],
              ]}
            >
              <Popup>
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/citizen/issues/${issue._id}`)}
                >
                  <strong className="block">{issue.title}</strong>
                  <span className="text-sm text-gray-600">
                    {issue.category.replace("_", " ")}
                  </span>
                  <p className="text-xs text-blue-600 mt-1">
                    View details →
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* 🔍 Auto zoom */}
        <FitBounds userLocation={userLocation} issues={issues} />
      </MapContainer>
    </div>
  );
};

export default MapPlaceholder;
