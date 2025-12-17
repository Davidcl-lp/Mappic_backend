import { Router } from 'express';
import { createUser, getAllUserAlbumsById, getAllUserAlbumsOnlyMemberById, getUserById, login, deleteUser } from '../controllers/userController';
export const userRouter: Router = Router();

userRouter.post('/user/signup', createUser);
userRouter.post('/user/login', login);
userRouter.get('/user/:id', getUserById);
userRouter.get('/user/albums/:id', getAllUserAlbumsById);
userRouter.get('/user/albums/member/:id', getAllUserAlbumsOnlyMemberById);
userRouter.delete("/user", deleteUser);

