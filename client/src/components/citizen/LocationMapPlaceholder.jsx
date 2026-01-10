import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useIssue } from "../../context/IssueContext";
import { markerIcon } from "../../utils/leafletIcon";
import { useEffect, useState } from "react";

/* Keeps map centered on marker */
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
};

const DraggableMarker = ({ position, onChange }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      icon={markerIcon}
      eventHandlers={{
        dragend: (e) => {
          onChange(e.target.getLatLng());
        },
      }}
    />
  );
};

const LocationMap = () => {
  const { issueDraft, updateIssueDraft, userLocation } = useIssue();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (issueDraft.location.lat && issueDraft.location.lng) {
      setPosition({
        lat: issueDraft.location.lat,
        lng: issueDraft.location.lng,
      });
    } else if (userLocation) {
      setPosition(userLocation);
    }
  }, [userLocation, issueDraft.location]);

  const fetchAddress = async ({ lat, lng }) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name || "";
    } catch {
      return "";
    }
  };

  const handleLocationChange = async (latlng) => {
    setPosition(latlng);
    const address = await fetchAddress(latlng);

    updateIssueDraft({
      location: {
        lat: latlng.lat,
        lng: latlng.lng,
        address,
      },
    });
  };

  if (!position) {
    return <div className="h-96 bg-gray-100">Loading map…</div>;
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="h-96">
        <MapContainer
          center={position}
          zoom={15}
          className="h-full w-full"
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap position={position} />

          <DraggableMarker
            position={position}
            onChange={handleLocationChange}
          />
        </MapContainer>
      </div>

      <div className="p-4">
        <label className="text-sm font-medium">Detected Address</label>
        <input
          value={issueDraft.location.address || ""}
          readOnly
          className="w-full mt-1 px-3 py-2 border rounded bg-gray-50 text-sm"
        />
      </div>
    </div>
  );
};

export default LocationMap;
