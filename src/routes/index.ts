import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

router.use(authRoutes);
// router.use('/users', userRoutes);
// router.use('/books', bookRoutes);

export default router;
