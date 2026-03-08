import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(
    () => `user-${Math.random().toString(36).substr(2, 9)}`,
  );

  useEffect(() => {
    const socketInstance = io(import.meta.env.BASE_URL, {
      transports: ["websocket"],
      auth: {
        userId,
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
  }, [userId]);

  return { socket, isConnected, userId };
};
