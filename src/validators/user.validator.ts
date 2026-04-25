import { Role } from "@prisma/client";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export const userIdSchema = z.number().int().positive();

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  role: z.nativeEnum(Role),
});

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(3).optional(),
    role: z.nativeEnum(Role).optional(),
    password: z.string().min(8).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const parseUserId = (rawId: string): number => {
  const parsedId = Number(rawId);
  const result = userIdSchema.safeParse(parsedId);

  if (!result.success) {
    throw ApiError.badRequest("Invalid user ID");
  }

  return result.data;
};
