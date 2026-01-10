import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import useCurrentLocation from "../../hooks/useCurrentLocation";

import CitizenNavbar from "../../components/layout/CitizenNavbar";
import HeroSection from "../../components/citizen/HeroSection";
import MapPlaceholder from "../../components/citizen/MapPlaceholder";
import NearbyIssues from "../../components/citizen/NearbyIssues";
import QuickActions from "../../components/citizen/QuickActions";

const CitizenHome = () => {
  const { location, loading } = useCurrentLocation();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!location) return;

    const fetchNearby = async () => {
      try {
        const res = await axios.get(
          `/api/issues/nearby?lat=${location.lat}&lng=${location.lng}&radius=10000`
        );
        setIssues(res.data.issues);
      } catch (error) {
        console.error("Failed to fetch nearby issues", error);
      }
    };

    fetchNearby();
  }, [location]);

  return (
    <>
      <CitizenNavbar />

      <main className="max-w-360 mx-auto px-4 py-6 space-y-6">
        <HeroSection />

        <div className="grid lg:grid-cols-12 gap-6">
          {/* 🗺️ MAP */}
          <div className="relative z-0 lg:col-span-8 h-150">
            <MapPlaceholder
              userLocation={location}
              issues={issues}
              loading={loading}
            />
          </div>

          {/* 📋 NEARBY ISSUES */}
          <div className="lg:col-span-4 h-150 overflow-y-hidden">
            <NearbyIssues issues={issues} loading={loading} />
          </div>
        </div>

        <QuickActions />
      </main>
    </>
  );
};

export default CitizenHome;
