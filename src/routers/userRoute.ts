import { Router } from 'express';
import { createUser, deleteUserBydId, getAllUserAlbumsById, getAllUserAlbumsOnlyMemberById, getUserById, login } from '../controllers/userController';
export const userRouter: Router = Router();

userRouter.post('/user/signup', createUser);
userRouter.post('/user/login', login);
userRouter.get('/user/:id', getUserById);
userRouter.delete('/user/:id', deleteUserBydId);
userRouter.get('/user/albums/:id', getAllUserAlbumsById);
userRouter.get('/user/albums/member/:id', getAllUserAlbumsOnlyMemberById);

