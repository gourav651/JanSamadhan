import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported, using fallback");
      setLat(28.6139);
      setLng(77.2090);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => {
        console.warn("Using fallback location");
        setLat(28.6139);
        setLng(77.2090);
      }
    );
  }, []);

  return { lat, lng };
};
