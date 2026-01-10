import L from "leaflet";

export const userMarkerIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/64/64113.png", // blue location dot
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});
