import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "../../lib/axios";

const RequireRole = ({ allowedRoles, children }) => {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    axios
      .get("/api/users/me")
      .then((res) => setRole(res.data.user.role))
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isSignedIn) return <Navigate to="/" replace />;
  if (loading) return <p>Checking access…</p>;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

export default RequireRole;
