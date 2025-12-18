import { Request, Response } from "express";
import { addPhoto, deletePhotoById, getPhotosByAlbumId, getPhotoByIdPg } from "../model/database/photoDb";
import { Photo } from "../model/interfaces/photo";
import { supabase } from "../supabase";
import path from "path";
import { pool } from "../model/database/db";

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

export const listPhotosByAlbum = async (req: Request, res: Response) => {
    const photos: Photo[] = await getPhotosByAlbumId(Number(req.params.albumId));
    return res.status(200).json(photos ?? []);
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

    // --- BLOQUE DE SEGURIDAD Y PERMISOS ---
    
    // 1. Verificar si es el dueño del álbum
    const albumRes = await pool.query("SELECT owner_id FROM albums WHERE id = $1", [albumId]);
    const isOwner = albumRes.rows[0]?.owner_id === uploaderId;

    if (!isOwner) {
      // 2. Si no es dueño, verificar si es editor en album_members
      const memberRes = await pool.query(
        "SELECT role FROM album_members WHERE album_id = $1 AND user_id = $2",
        [albumId, uploaderId]
      );
      
      const role = memberRes.rows[0]?.role;

      if (!role || role === 'viewer') {
        return res.status(403).json({ 
          message: "No tienes permisos de edición en este álbum." 
        });
      }
    }
    // ---------------------------------------

    const bucket = process.env.SUPABASE_BUCKET;
    const uploadedPhotos = [];

    for (const file of files) {
      try {
        const ext = path.extname(file.originalname) || ".jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const filePath = `albums/${albumId}/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from(bucket!)
          .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (storageError) continue;

        const { data } = supabase.storage.from(bucket!).getPublicUrl(filePath);
        
        const photo = await addPhoto({
          albumId,
          uploaderId,
          url: data.publicUrl,
          description,
        });

        if (photo) uploadedPhotos.push(photo);
      } catch (fileError) {
        console.error("Error en archivo:", fileError);
      }
    }

    return res.json(uploadedPhotos);

  } catch (e: any) {
    return res.status(500).json({ message: "Error", error: e.message });
  }
};