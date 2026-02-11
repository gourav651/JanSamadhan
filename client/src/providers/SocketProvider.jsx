import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import socket from "@/lib/socket";

const SocketProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    socket.connect();
    socket.emit("join", { userId: user.id });

    return () => {
      socket.disconnect();
    };
  }, [isSignedIn, user?.id]);

  return children;
};

export default SocketProvider;
