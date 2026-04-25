import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";

export const registerService = async (
  email: string,
  password: string,
  name: string,
  role?: string,
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role!.toLowerCase() === "admin" ? Role.ADMIN : Role.USER,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
};
