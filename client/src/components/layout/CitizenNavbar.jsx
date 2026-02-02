import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CitizenNavbar = () => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-1100 flex items-center justify-between border-b bg-green-100 px-10 py-3">
      {/* LEFT: Logo */}
      <h2
        onClick={() => navigate("/")}
        className="font-bold text-primary cursor-pointer"
      >
        JanSamadhan
      </h2>

      {/* RIGHT */}
      {!isSignedIn ? (
        <button
          onClick={() => openSignIn()}
          className="px-4 py-2 bg-primary rounded-full font-medium"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-10">
          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-slate-700 hover:text-primary transition cursor-pointer"
          >
            Home
          </button>

          {/* Report Issue */}
          <button
            onClick={() => navigate("/citizen/report")}
            className="text-sm font-medium text-slate-700 hover:text-primary transition cursor-pointer"
          >
            Report Issue
          </button>

          {/* My Activity */}
          <button
            onClick={() => navigate("/citizen/my-issues")}
            className="text-sm font-medium text-slate-700 hover:text-primary transition cursor-pointer"
          >
            My Activity
          </button>

          {/* User Avatar */}
          <UserButton />
        </div>
      )}
    </header>
  );
};

export default CitizenNavbar;
