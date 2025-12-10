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
    return res.status(200).json({ photos });
};

// Obtener foto por ID
export const getPhotoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await getPhotosByAlbumId(id);
    if (!result) return res.status(404).json({ message: "No se encontró la foto" });
    return res.status(200).json({ photo: result });
};

export const uploadPhotoFile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar que venga el archivo
    if (!req.file) {
      res.status(400).json({ message: "Falta el archivo 'image'" });
      return;
    }

    // Datos adicionales del body
    const albumId = Number(req.body.album_id);
    const uploaderId = Number(req.body.uploader_id);
    const description = req.body.description || null;

    // Configuración de bucket y nombre de archivo
    const bucket = process.env.SUPABASE_BUCKET!;
    const ext = path.extname(req.file.originalname) || ".jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = `albums/${albumId || "default"}/${fileName}`;

    // Subir a Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      res.status(500).json({ message: "Error al subir imagen", error: error.message });
      return;
    }

    // Obtener URL pública
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;

    // Guardar en BD
    const photo = await addPhoto({
      albumId,
      uploaderId,
      url: publicUrl,
      description: description || undefined,
    });

    res.status(200).json({ message: "Foto subida correctamente", photo });
  } catch (e: any) {
    res.status(500).json({ message: "Error interno", error: e?.message });
  }
};