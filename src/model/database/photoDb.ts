import { pool } from "./db";
import { Photo } from "../interfaces/photo";

export const addPhoto = async ({albumId, uploaderId, url, description}: {albumId: number, uploaderId: number, url: string, description?: string}): Promise<Photo> => {
    const result = await pool.query<Photo>(
        `INSERT INTO photos (album_id, uploader_id, url, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [albumId, uploaderId, url, description || null]
    );
    return result.rows[0];
};

export const deletePhotoById = async (id: number): Promise<Photo | null> => {
    const result = await pool.query<Photo>(
        `DELETE FROM photos WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0] || null;
};

export const getPhotosByAlbumId = async (albumId: number): Promise<Photo[]> => {
    const result = await pool.query<Photo>(
        `SELECT * FROM photos WHERE album_id = $1`,
        [albumId]
    );
    return result.rows;
};

export const getPhotoByIdPg = async (id: number): Promise<Photo | null> => {
    const result = await pool.query<Photo>(
        `SELECT * FROM photos WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
};
