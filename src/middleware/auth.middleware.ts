import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader: ", authHeader);
    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== Role.ADMIN) {
    next(ApiError.forbidden("Admin access required"));
    return;
  }
  next();
};
