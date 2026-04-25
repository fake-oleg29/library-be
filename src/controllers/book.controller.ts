import { NextFunction, Response } from "express";
import { AuthRequest } from "../types";
import { bookService } from "../services/book.service";

export const getAllBooks = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const books = await bookService.getAll();
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await bookService.getById(id);
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const book = await bookService.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await bookService.update(id, req.body);
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await bookService.delete(id);
    res.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    next(error);
  }
};
