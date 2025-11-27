import { pool } from "./db";
import { Album } from "../interfaces/album";
import { User } from "../interfaces/user";

export const insertAlbumPg = async({title, description, ownerId, locationName, latitude, longitude, isGlobal}: {title:string, description:string, ownerId:number, locationName:string, latitude:number, longitude:number, isGlobal:boolean}) => {
    const result = await pool.query<Album>(`
    INSERT INTO albums 
      (title, description, owner_id, location_name, latitude, longitude, is_global)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `,
    [title, description, ownerId, locationName, latitude, longitude, isGlobal]);
    return result.rows[0];
}
export const getAlbumByIdPg = async (id: number) =>
    {
        const result = await pool.query<Album>(`SELECT * FROM albums WHERE id = $1`, [id]);
        return result.rows[0] || null;
    }
export const deleteAlbumByIdPg = async (id: number) =>
    {
        const result = await pool.query<Album>(`DELETE FROM album WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0] || null;
    }
export const addAlbumMemberByIdPg = async ({albumId, userId, role}: {albumId: number, userId: number, role: string}) => {
        const result = await pool.query(
             `INSERT INTO album_members
             (album_id, user_id, role)
              VALUES ($1, $2, $3)
              RETURNING *;
  `
            , [albumId, userId, role]);
        return result.rows[0] || null;
}
export const getAlbumMembersByAlbumIdPg = async (id: number) =>
    {
        const result = await pool.query<User[]>(`SELECT * FROM album_members WHERE album_id = $1`, [id]);
        return result.rows[0] || null;
    }
export const deleteAlbumMemberByAlbumIdPg = async (id: number) =>
    {
        const result = await pool.query(`DELETE FROM album_members WHERE album_id = $1 RETURNING *`, [id]);
        return result.rows[0] || null;
    }



