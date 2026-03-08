import { Request, Response, NextFunction } from "express";

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    restaurantId?: string;
  };
}

// Simple token-based auth (in production, use JWT)
export const authMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const role = req.headers["x-user-role"] as UserRole;

    // For development: Allow requests without auth
    if (process.env.NODE_ENV === "development" && !authHeader) {
      req.user = {
        id: "dev-user",
        role: role || "CUSTOMER",
        restaurantId: "restaurant-1",
      };
      return next();
    }

    // In production, validate JWT token here
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Mock user extraction (replace with real JWT validation)
    const token = authHeader.replace("Bearer ", "");
    const user = parseToken(token);

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    next();
  };
};

// Mock token parser (replace with real JWT verification)
function parseToken(token: string): AuthRequest["user"] | null {
  // In production: verify JWT and extract user info
  if (token === "staff-token") {
    return { id: "staff-1", role: "STAFF", restaurantId: "restaurant-1" };
  }
  if (token === "admin-token") {
    return { id: "admin-1", role: "ADMIN", restaurantId: "restaurant-1" };
  }
  return { id: "customer-1", role: "CUSTOMER" };
}

// Socket.io auth helper
export function authenticateSocket(handshake: any): AuthRequest["user"] {
  const token = handshake.auth?.token;
  const role = handshake.auth?.role as UserRole;

  if (process.env.NODE_ENV === "production") {
    if (!token) {
      throw new Error("Unauthorized");
    }
    const user = parseToken(token);
    if (!user) {
      throw new Error("Invalid token");
    }
    return user;
  } else {
    // Development: allow role override
    return {
      id: handshake.auth?.userId || `user-${Date.now()}`,
      role: role || "CUSTOMER",
      restaurantId: handshake.auth?.restaurantId || "restaurant-1",
    };
  }
}
