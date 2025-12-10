import { Router } from 'express';
import { createPhoto, getPhotoById, removePhoto, listPhotosByAlbum, uploadPhotoFile } from '../controllers/photoController';
import { upload } from '../upload';

export const photoRouter: Router = Router();

photoRouter.post('/photo', createPhoto);
photoRouter.get('/photo/:id', getPhotoById);
photoRouter.delete('/photo/:id', removePhoto);
photoRouter.get('/album/:albumId/photos', listPhotosByAlbum);
photoRouter.post("/photo/upload", upload.single("image"), uploadPhotoFile);


