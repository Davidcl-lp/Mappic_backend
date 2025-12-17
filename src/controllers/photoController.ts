import { Request, Response } from "express";
import { addPhoto, deletePhotoById, getPhotosByAlbumId, getPhotoByIdPg } from "../model/database/photoDb";
import { Photo } from "../model/interfaces/photo";
import { supabase } from "../supabase";
import path from "path";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

    export const createPhoto = async (req: Request, res: Response) => {
    const result = await addPhoto({
        albumId: req.body.album_id,
        uploaderId: req.body.uploader_id,
        url: req.body.url,
        description: req.body.description
    });
    if (!result) return res.status(500).json({ message: "No se pudo crear" });
    return res.status(200).json({ message: "Foto creada", photo: result });
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
    return res.status(200).json(photos);
};

// Obtener foto por ID
export const getPhotoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await getPhotosByAlbumId(id);
    if (!result) return res.status(404).json({ message: "No se encontró la foto" });
    return res.status(200).json({ photo: result });
};

export const uploadPhotoFiles = async (req: Request, res: Response) => {
  try {
    const files = (req as any).files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ message: "No se enviaron imágenes" });
      return;
    }

    const albumId = Number(req.body.album_id);
    const uploaderId = Number(req.body.uploader_id);
    const description = req.body.description || null;

    const bucket = process.env.SUPABASE_BUCKET!;
    const uploadedPhotos = [];

    for (const file of files) {
      const ext = path.extname(file.originalname) || ".jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}${ext}`;

      const filePath = `albums/${albumId}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) continue;

      const publicUrl =
        supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;

      const photo = await addPhoto({
        albumId,
        uploaderId,
        url: publicUrl,
        description,
      });

      if (photo) uploadedPhotos.push(photo);
    }

    res.status(200).json({
      message: "Fotos subidas correctamente",
      photos: uploadedPhotos,
    });
  } catch (e: any) {
    res.status(500).json({ message: "Error interno", error: e.message });
  }
};
