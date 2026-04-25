import { Request, Response, NextFunction } from "express";
import { registerService, loginService } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    const data = await registerService(email, password, name, role);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
