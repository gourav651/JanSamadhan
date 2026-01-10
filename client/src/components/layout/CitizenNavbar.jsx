import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const CitizenNavbar = () => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  return (
    <header className="sticky top-0 z-1100 flex items-center justify-between border-b bg-green-100 px-10 py-3">
      <h2 className="font-bold text-primary cursor-pointer">
        JanSamadhan
      </h2>

      {!isSignedIn ? (
        <button
          onClick={() => openSignIn()}
          className="px-4 py-2 bg-primary rounded-full font-medium"
        >
          Login
        </button>
      ) : (
        <UserButton />
      )}
    </header>
  );
};

export default CitizenNavbar;
