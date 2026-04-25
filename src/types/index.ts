import { Request } from 'express';
import { Role as PrismaRole } from '@prisma/client';

export type Role = PrismaRole;

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
