import z from "zod";

export const bookIdSchema = z.number().int().positive();

export const createBookSchema = z.object({
  name: z.string().min(1),
  author: z.string().min(1),
  pageCount: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

export const updateBookSchema = z
  .object({
    name: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    pageCount: z.coerce.number().int().positive().optional(),
    userId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
