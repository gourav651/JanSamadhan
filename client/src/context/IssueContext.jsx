import { createContext, useContext, useEffect, useState } from "react";
import { getNearbyIssues } from "../api/issueApi";

const IssueContext = createContext(null);

export const IssueProvider = ({ children }) => {
  /* =========================
     REPORT ISSUE DRAFT STATE
  ========================== */
  const [issueDraft, setIssueDraft] = useState({
    category: "",
    title: "",
    description: "",
    extraDescription: "",
    images: [],
    location: {
      lat: null,
      lng: null,
      address: "",
    },
  });

  const updateIssueDraft = (data) => {
    setIssueDraft((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const clearIssueDraft = () => {
    setIssueDraft({
      category: "",
      title: "",
      description: "",
      extraDescription: "",
      images: [],
      location: { lat: null, lng: null, address: "" },
    });
  };

  /* =========================
     USER LOCATION + NEARBY ISSUES
  ========================== */
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyIssues, setNearbyIssues] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 28.6139, lng: 77.209 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setUserLocation({ lat: 28.6139, lng: 77.209 });
      }
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchIssues = async () => {
      setLoadingNearby(true);
      const issues = await getNearbyIssues(userLocation);
      setNearbyIssues(issues);
      setLoadingNearby(false);
    };

    fetchIssues();
  }, [userLocation]);

  return (
    <IssueContext.Provider
      value={{
        /* report */
        issueDraft,
        updateIssueDraft,
        clearIssueDraft,

        /* home/map */
        userLocation,
        nearbyIssues,
        loadingNearby,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssue = () => {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error("useIssue must be used inside IssueProvider");
  return ctx;
};
