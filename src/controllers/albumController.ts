import { Request, Response } from "express"
import { addAlbumMemberByIdPg, createAlbumPg, deleteAlbumByIdPg, deleteAlbumMemberByAlbumIdAndUserIdPg, getAlbumByIdPg, getAllAlbumMembersByAlbumIdPg, updateAlbumPg } from "../model/database/albumDb"
import { Album } from "../model/interfaces/album";

export const createAlbum = async(req: Request, res: Response) => {
    const albumFeatures = req.body;
    const result = await createAlbumPg({
        title: albumFeatures.title,
        description: albumFeatures.description,
        ownerId : albumFeatures.owner_id,
        locationName : albumFeatures.location_name,
        latitude : albumFeatures.latitude,
        longitude : albumFeatures.longitude,
        isGlobal : albumFeatures.is_global
    });
    if(!result) return res.status(500).json({message: "El album no se pudo crear"});
    return res.status(200).json({message:"El album se ha creado correctamente"});
}
export const getAlbumById = async (req: Request, res: Response) => {
    const album: Album = await getAlbumByIdPg(Number(req.params.id));
    if(!album) return res.status(500).json({message: "No se pudo obtener el album"});
    return res.status(200).json({album});
}
export const deleteAlbumById = async (req: Request, res: Response) => {
    const album: Album = await deleteAlbumByIdPg(Number(req.params.id));
    if(!album) return res.status(500).json({message: "El album no se pudo eliminar"});
    return res.status(200).json({album});
}
export const updateAlbum = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const albumFeatures = req.body;

    const updatedAlbum = await updateAlbumPg(id, {
        title: albumFeatures.title,
        description: albumFeatures.description,
        locationName: albumFeatures.location_name,
        latitude: albumFeatures.latitude,
        longitude: albumFeatures.longitude,
        isGlobal: albumFeatures.is_global
    });

    if (!updatedAlbum) {
        return res.status(500).json({ message: "No se pudo actualizar el álbum" });
    }

    return res.status(200).json(updatedAlbum);
};

export const addAlbumMember = async(req: Request, res: Response) => {
    const albumMemberFeatures = req.body;
    const result = await addAlbumMemberByIdPg({
        albumId: albumMemberFeatures.album_id,
        userId : albumMemberFeatures.user_id,
        role: albumMemberFeatures.role
    });
    if(!result) return res.status(500).json({message: "No se pudo añadir miembro al album"});
    return res.status(200).json({message:"Se ha añadido el miembro al album correctamente"});
}
export const getAllAlbumMembersByAlbumId = async (req: Request, res: Response) => {
    const albumMembers = await getAllAlbumMembersByAlbumIdPg(Number(req.params.id));
    if(!albumMembers) return res.status(500).json({message: "No se pudo obtener el miembro del album"});
    return res.status(200).json({albumMembers});
}
export const deleteAlbumMemberByAlbumIdAndUserId = async (req: Request, res: Response) => {
    console.log(Number(req.body.userId))
    const album = await deleteAlbumMemberByAlbumIdAndUserIdPg({albumId: Number(req.params.id), userId : Number(req.body.userId)});
    if(!album) return res.status(500).json({message: "no se pudo eliminar el miembro del album"});
    return res.status(200).json({album});
}
