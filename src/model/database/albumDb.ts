import { pool } from "./db";
import { Album } from "../interfaces/album";
import { User } from "../interfaces/user";

export const createAlbumPg = async({title, description, ownerId, locationName, latitude, longitude, isGlobal}: {title:string, description:string, ownerId:number, locationName:string, latitude:number, longitude:number, isGlobal:boolean}) => {
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
export const getAllUserAlbumsByUserIdPg = async (id: number) =>
    {
        const result = await pool.query<Album>(`SELECT * FROM albums WHERE user_id = $1`, [id]);
        return result.rows[0] || null;
    }
export const deleteAlbumByIdPg = async (id: number) =>
    {
        const result = await pool.query<Album>(`DELETE FROM albums WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0] || null;
    }
export const updateAlbumPg = async (
    id: number,
    data: {
        title?: string;
        description?: string;
        locationName?: string;
        latitude?: number;
        longitude?: number;
        isGlobal?: boolean;
     }
) => {
    const result = await pool.query(
        `UPDATE albums
         SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            location_name = COALESCE($3, location_name),
            latitude = COALESCE($4, latitude),
            longitude = COALESCE($5, longitude),
            is_global = COALESCE($6, is_global),
            updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [
            data.title,
            data.description,
            data.locationName,
            data.latitude,
            data.longitude,
            data.isGlobal,
            id
        ]
    );

    return result.rows[0] || null;
};

export const getAllUserAlbumsByIdPg = async (id:number) => {
        const result = await pool.query<Album>(`SELECT * FROM albums WHERE owner_id = $1`, [id]);
        return result.rows || null;
}


export const getAllUserAlbumsOnlyMemberByIdPg = async (id: number) => {
    const result = await pool.query<Album>(`
        SELECT a.*
        FROM albums a
        JOIN album_members am ON a.id = am.album_id
        WHERE am.user_id = $1
          AND a.owner_id <> $1;`, [id]);
    return result.rows;
}

export const addAlbumMemberByIdPg = async ({albumId, userId, role}: {albumId: number, userId: number, role: string}) => {
    const result = await pool.query(
        `INSERT INTO album_members (album_id, user_id, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (album_id, user_id) 
         DO UPDATE SET role = EXCLUDED.role -- Si ya existe, actualiza el rol
         RETURNING *;`, 
        [albumId, userId, role]
    );
    return result.rows[0] || null;
}

export const getAllAlbumMembersByAlbumIdPg = async (albumId: number) => {
    const result = await pool.query(
        `
        SELECT u.id, u.name, u.email, u.profile_picture_url, am.role -- <--- AÑADIR am.role AQUÍ
        FROM album_members am
        JOIN users u ON u.id = am.user_id
        WHERE am.album_id = $1
        `,
        [albumId]
    );
    return result.rows;
};

export const deleteAlbumMemberByAlbumIdAndUserIdPg = async ({albumId, userId}: {albumId: number, userId: number}) =>
    {
        const result = await pool.query(`DELETE FROM album_members WHERE album_id = $1 AND user_id = $2 RETURNING *`, [albumId, userId]);
        return result.rows[0] || null;
    }


