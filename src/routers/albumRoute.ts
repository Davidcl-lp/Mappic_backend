import { Router } from 'express';
import { addAlbumMember, createAlbum, deleteAlbumById, deleteAlbumMemberByAlbumIdAndUserId, getAlbumById, getAllAlbumMembersByAlbumId } from '../controllers/albumController';
export const albumRouter: Router = Router();

albumRouter.post('/album', createAlbum);
albumRouter.get('/album/:id', getAlbumById);
albumRouter.delete('/album/:id', deleteAlbumById);

albumRouter.post('/album/member', addAlbumMember);
albumRouter.get('/album/member/:id', getAllAlbumMembersByAlbumId);
albumRouter.delete('/album/member/:id',deleteAlbumMemberByAlbumIdAndUserId);



