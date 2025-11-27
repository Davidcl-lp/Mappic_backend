import { Router } from 'express';
export const albumRouter: Router = Router();

albumRouter.post('/album', createAlbum);
albumRouter.get('/album/:id', getAlbumById);
albumRouter.delete('/album/:id', deleteAlbumById);

albumRouter.post('/album/member', insertAlbumMember);
albumRouter.get('/album/member/:id', getAlbumMembersByAlbumId);
albumRouter.delete('/album/member/:id', deleteAlbumMemberById);


