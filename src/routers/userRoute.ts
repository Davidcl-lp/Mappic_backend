import { Router } from 'express';
import { createUser, deleteUserBydId, getUserById, login } from '../controllers/userController';
export const userRouter: Router = Router();

userRouter.post('/user/signup', createUser);
userRouter.post('/user/login', login);
userRouter.get('/user/:id', getUserById);
userRouter.delete('/user/:id', deleteUserBydId);
