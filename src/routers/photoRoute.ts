import { Router } from 'express';
import { getPhotoById, removePhoto, listPhotosByAlbum, uploadPhotoFiles } from '../controllers/photoController';
import { upload } from '../upload';

export const photoRouter: Router = Router();

photoRouter.get('/photo/:id', getPhotoById);
photoRouter.post("/photo/upload", upload.array("images", 10), uploadPhotoFiles);
photoRouter.delete('/photo/:id', removePhoto);
photoRouter.get('/album/:albumId/photos', listPhotosByAlbum);



