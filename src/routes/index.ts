import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
const router = Router();

router.use(authRoutes);
router.use("/users", userRoutes);
// router.use('/books', bookRoutes);

export default router;
