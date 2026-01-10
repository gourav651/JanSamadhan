import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { markerIcon } from "../../utils/leafletIcon";

const IssueLocationModal = ({ lat, lng, onClose }) => {
  if (!lat || !lng) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Issue Location</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Map */}
        <div className="h-112.5">
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            className="h-full w-full"
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={markerIcon} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default IssueLocationModal;
