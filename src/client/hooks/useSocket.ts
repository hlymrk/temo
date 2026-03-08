import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (
  role: "CUSTOMER" | "STAFF" | "ADMIN" = "CUSTOMER",
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(
    () => `user-${Math.random().toString(36).substr(2, 9)}`,
  );

  useEffect(() => {
    // Mock token for demo (replace with real JWT in production)
    const getToken = () => {
      if (role === "STAFF") return "staff-token";
      if (role === "ADMIN") return "admin-token";
      return "customer-token";
    };

    const socketInstance = io(import.meta.env.BASE_URL, {
      transports: ["websocket"],
      auth: {
        token: getToken(),
        userId,
        role,
      },
    });

    socketInstance.on("connect", () => {
      console.log("✓ Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("✗ Socket disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, role]);

  return { socket, isConnected, userId };
};
