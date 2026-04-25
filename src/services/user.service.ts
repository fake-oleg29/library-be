import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

const safeUser = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

const getUserOrThrow = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

export const userService = {
  async getAllUsers() {
    return prisma.user.findMany({
      select: safeUser,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: safeUser,
    });
    if (!user) throw ApiError.notFound("User not found");

    return user;
  },

  async createUser(data: CreateUserInput) {
    const validatedData = createUserSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser)
      throw ApiError.conflict("User with this email already exists");

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role,
      },
      select: safeUser,
    });
    return user;
  },

  async updateUser(
    id: number,
    data: UpdateUserInput,
  ) {
    await getUserOrThrow(id);
    const validatedData = updateUserSchema.parse(data);

    const updateData: Record<string, unknown> = {};
    if (validatedData.email !== undefined) updateData.email = validatedData.email;
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.role !== undefined) updateData.role = validatedData.role;
    if (validatedData.password !== undefined)
      updateData.password = await bcrypt.hash(validatedData.password, 10);

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: safeUser,
    });
  },

  async deleteUser(id: number, currentUserId: number) {
    await getUserOrThrow(id);

    if (currentUserId === id) {
      throw ApiError.badRequest("Cannot delete your own account");
    }

    await prisma.user.delete({ where: { id } });
  },
};
