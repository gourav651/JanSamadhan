import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";
import { syncUserWithDB } from "../../utils/syncUser";

const PostLoginRedirect = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasRun.current) return;

    hasRun.current = true;

    const redirect = async () => {
      await syncUserWithDB(user);
      const res = await axios.get("/api/users/me");
      const role = res.data.user.role;

      if (role === "ADMIN") navigate("/admin/dashboard", { replace: true });
      else if (role === "AUTHORITY")
        navigate("/authority/dashboard", { replace: true });
      // CITIZEN → stay on /
    };

    redirect();
  }, [isLoaded, isSignedIn, user, navigate]);

  return null;
};

export default PostLoginRedirect;
