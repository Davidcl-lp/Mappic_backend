import { Request, Response } from "express"
import { addAlbumMemberByIdPg, createAlbumPg, deleteAlbumByIdPg, deleteAlbumMemberByAlbumIdAndUserIdPg, getAlbumByIdPg, getAllAlbumMembersByAlbumIdPg, updateAlbumPg } from "../model/database/albumDb"
import { Album } from "../model/interfaces/album";
import { getUserByIdPg } from "../model/database/userDb";

export const createAlbum = async(req: Request, res: Response) => {
    const albumFeatures = req.body;
    const result = await createAlbumPg({
        title: albumFeatures.title,
        description: albumFeatures.description,
        ownerId : albumFeatures.owner_id,
        latitude : albumFeatures.latitude || null,
        longitude : albumFeatures.longitude || null,
        locationName : albumFeatures.location_name || null,
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

export const addAlbumMember = async (req: Request, res: Response) => {
    try {
        const { album_id, user_id, role } = req.body;

        const member = await addAlbumMemberByIdPg({
            albumId: album_id,
            userId: user_id,
            role
        });

        if (!member) {
            return res.status(500).json({ message: "No se pudo añadir miembro al álbum" });
        }

        const user = await getUserByIdPg(user_id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const { password_hash, ...userWithoutPassword } = user;

        return res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error("ERROR ADD MEMBER:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};


export const getAllAlbumMembersByAlbumId = async (req: Request, res: Response) => {
    const albumMembers = await getAllAlbumMembersByAlbumIdPg(Number(req.params.id));
    return res.status(200).json(albumMembers); 
}

export const deleteAlbumMemberByAlbumIdAndUserId = async (req: Request, res: Response) => {
    try {
        const albumId = Number(req.params.id);
        const userIdToRemove = Number(req.body.userId);
        const requesterId = Number(req.body.requesterId); // Enviado desde la App

        // 1. Obtener todos los miembros para ver el rol del solicitante
        const members = await getAllAlbumMembersByAlbumIdPg(albumId);
        const requester = members.find(m => m.id === requesterId);

        if (!requester || (requester.role !== 'owner' && requester.role !== 'editor')) {
            return res.status(403).json({ message: "No tienes permiso para gestionar miembros" });
        }

        const result = await deleteAlbumMemberByAlbumIdAndUserIdPg({ albumId, userId: userIdToRemove });
        // ... resto del código
    } catch (error) {
        return res.status(500).json({ message: "Error interno" });
    }
}