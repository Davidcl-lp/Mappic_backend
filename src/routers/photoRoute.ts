import { Router } from 'express';
import { createPhoto, getPhotoById, removePhoto, listPhotosByAlbum } from '../controllers/photoController';

export const photoRouter: Router = Router();

photoRouter.post('/photo', createPhoto);
photoRouter.get('/photo/:id', getPhotoById);
photoRouter.delete('/photo/:id', removePhoto);
photoRouter.get('/album/:albumId/photos', listPhotosByAlbum);
