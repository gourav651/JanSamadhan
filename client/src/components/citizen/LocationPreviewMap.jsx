import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { markerIcon } from "../../utils/leafletIcon";

const LocationPreviewMap = ({ lat, lng }) => {
  if (!lat || !lng) return null;

  return (
    <div className="h-64 rounded-lg overflow-hidden border">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
};

export default LocationPreviewMap;
