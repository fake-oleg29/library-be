import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", requireAdmin, createBook);
router.put("/:id", requireAdmin, updateBook);
router.patch("/:id", requireAdmin, updateBook);
router.delete("/:id", requireAdmin, deleteBook);

export default router;
