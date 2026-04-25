import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { userService } from "../services/user.service";
import { parseUserId } from "../validators/user.validator";

export const getAllUsers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseUserId(req.params.id);
    const user = await userService.getUserById(id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseUserId(req.params.id);
    const user = await userService.updateUser(id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseUserId(req.params.id);
    await userService.deleteUser(id, req.user!.userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
