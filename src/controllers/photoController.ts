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
      return res.status(400).json({ message: "No se enviaron imágenes" });
    }

    const albumId = Number(req.body.album_id);
    const uploaderId = Number(req.body.uploader_id);
    const description = req.body.description || null;

    if (isNaN(albumId) || isNaN(uploaderId) || uploaderId <= 0) {
      console.error("IDs inválidos recibidos:", { albumId, uploaderId });
      return res.status(400).json({ 
        message: "ID de álbum o de usuario inválido. Asegúrese de estar logueado." 
      });
    }

    const bucket = process.env.SUPABASE_BUCKET;
    if (!bucket) {
      throw new Error("SUPABASE_BUCKET no está definido en el entorno");
    }

    const uploadedPhotos = [];

    for (const file of files) {
      try {
        const ext = path.extname(file.originalname) || ".jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const filePath = `albums/${albumId}/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (storageError) {
          console.error("Error subiendo a Supabase:", storageError.message);
          continue; 
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        const photo = await addPhoto({
          albumId,
          uploaderId,
          url: publicUrl,
          description,
        });

        if (photo) {
          uploadedPhotos.push(photo);
        }
      } catch (fileError) {
        console.error("Error procesando un archivo individual:", fileError);
      }
    }

    if (uploadedPhotos.length === 0) {
      return res.status(500).json({ message: "No se pudo guardar ninguna foto en la base de datos" });
    }

    return res.status(200).json({
      message: "Fotos subidas correctamente",
      photos: uploadedPhotos,
    });

  } catch (e: any) {
    console.error("Error crítico en uploadPhotoFiles:", e);
    return res.status(500).json({ 
      message: "Error interno del servidor", 
      error: e.message 
    });
  }
};