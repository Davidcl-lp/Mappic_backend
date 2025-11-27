import { Router } from 'express';
export const photoRouter: Router = Router();

photoRouter.post('/photo/signup', createPhoto);
photoRouter.post('/photo/login', getPhoto);
photoRouter.get('/photo/:id', getPhoto);
photoRouter.delete('/photo/:id', deletePhoto);
