import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import useCurrentLocation from "../../hooks/useCurrentLocation";

import CitizenNavbar from "../../components/layout/CitizenNavbar";
import HeroSection from "../../components/citizen/HeroSection";
import MapPlaceholder from "../../components/citizen/MapPlaceholder";
import NearbyIssues from "../../components/citizen/NearbyIssues";
import QuickActions from "../../components/citizen/QuickActions";
import CitizenFooter from "@/components/layout/CitizenFooter";
import HomeServicesSection from "@/components/citizen/HomeServicesSection";

const CitizenHome = () => {
  const { location, loading } = useCurrentLocation();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!location) return;

    const fetchNearby = async () => {
      try {
        const res = await axios.get(
          `/api/issues/nearby?lat=${location.lat}&lng=${location.lng}&radius=10000`,
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
      <div className="bg-slate-50/50">
        <CitizenNavbar />

        <main className="max-w-360 w-full mx-auto px-4 sm:px-5 md:px-6 py-6 space-y-6">
          <HeroSection />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* 🗺️ MAP */}
            <div className="relative lg:col-span-8 min-h-87.5 sm:min-h-105 lg:h-150 rounded-3xl sm:rounded-7xl overflow-hidden shadow-2xl shadow-slate-200 border border-white">
              <MapPlaceholder
                userLocation={location}
                issues={issues}
                loading={loading}
              />
            </div>

            {/* 📋 NEARBY ISSUES */}
            <div className="lg:col-span-4 h-150 flex flex-col">
              <NearbyIssues issues={issues} loading={loading} />
            </div>
          </div>
          <HomeServicesSection />
          <QuickActions />
        </main>
      </div>
      <CitizenFooter />
    </>
  );
};

export default CitizenHome;
