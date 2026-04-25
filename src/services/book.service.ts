import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { z } from "zod";
import {
  bookIdSchema,
  createBookSchema,
  updateBookSchema,
} from "../validators/book.validator";

type CreateBookInput = z.infer<typeof createBookSchema>;
type UpdateBookInput = z.infer<typeof updateBookSchema>;

const parseBookId = (id: number) => {
  const parsed = bookIdSchema.safeParse(id);
  if (!parsed.success) {
    throw ApiError.badRequest("Invalid book ID");
  }
  return parsed.data;
};

const ensureBookExists = async (id: number) => {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) throw ApiError.notFound("Book not found");
};

export const bookService = {
  async getAll() {
    return prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    const bookId = parseBookId(id);

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw ApiError.notFound("Book not found");

    return book;
  },

  async create(data: CreateBookInput) {
    const validatedData = createBookSchema.parse(data);

    return prisma.book.create({
      data: {
        name: validatedData.name,
        author: validatedData.author,
        pageCount: validatedData.pageCount,
        userId: validatedData.userId,
      },
    });
  },

  async update(id: number, data: UpdateBookInput) {
    const bookId = parseBookId(id);
    await ensureBookExists(bookId);
    const validatedData = updateBookSchema.parse(data);

    const updateData: Record<string, unknown> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.author !== undefined)
      updateData.author = validatedData.author;
    if (validatedData.pageCount !== undefined)
      updateData.pageCount = validatedData.pageCount;
    if (validatedData.userId !== undefined)
      updateData.userId = validatedData.userId;

    return prisma.book.update({ where: { id: bookId }, data: updateData });
  },

  async delete(id: number) {
    const bookId = parseBookId(id);
    await ensureBookExists(bookId);

    await prisma.book.delete({ where: { id: bookId } });
  },
};
