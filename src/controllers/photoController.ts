import { Request, Response } from "express";
import { addPhoto, deletePhotoById, getPhotosByAlbumId, getPhotoByIdPg } from "../model/database/photoDb";
import { Photo } from "../model/interfaces/photo";

// Crear foto
export const createPhoto = async (req: Request, res: Response) => {
    const photoFeatures = req.body;
    const result = await addPhoto({
        albumId: photoFeatures.album_id,
        uploaderId: photoFeatures.uploader_id,
        url: photoFeatures.url,
        description: photoFeatures.description
    });
    if (!result) return res.status(500).json({ message: "La foto no se pudo crear" });
    return res.status(200).json({ message: "La foto se ha creado correctamente", photo: result });
};

// Eliminar foto
export const removePhoto = async (req: Request, res: Response) => {
    const photo = await deletePhotoById(Number(req.params.id));
    if (!photo) return res.status(404).json({ message: "La foto no se pudo eliminar o no existe" });
    return res.status(200).json({ message: "La foto se eliminó correctamente", photo });
};

// Obtener todas las fotos de un álbum
export const listPhotosByAlbum = async (req: Request, res: Response) => {
    const photos: Photo[] = await getPhotosByAlbumId(Number(req.params.albumId));
    if (!photos || photos.length === 0) return res.status(404).json({ message: "No se encontraron fotos en el álbum" });
    return res.status(200).json({ photos });
};

// Obtener foto por ID
export const getPhotoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await getPhotosByAlbumId(id); // ⚠️ aquí necesitas una función getPhotoByIdPg en photoDb
    if (!result) return res.status(404).json({ message: "No se encontró la foto" });
    return res.status(200).json({ photo: result });
};