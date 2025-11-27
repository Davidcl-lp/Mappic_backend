import { pool } from "./db";
export const addPhoto = async ({albumId, uploaderId, url, description}: {albumId: number, uploaderId: number, url: string, description: string}) => {
    const result = await pool.query(`
        INSERT INTO photos (album_id, uploader_id, url, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [albumId, uploaderId, url, description]);
        return result.rows[0];
}
export const deletePhotoById = async (id:number) => {
    const result = await pool.query(`
        DELETE FROM photos WHERE id = $1
        `,
        [id]);
        return result.rows[0];
}
export const getPhotosByAlbumId = async (id:number) => {
    const result = await pool.query(`
        SELECT FROM photos WHERE album_id = $1
        `,
        [id]);
        return result.rows[0];
}