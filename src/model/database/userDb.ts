import { User } from "../interfaces/user";
import { pool } from "./db"
export const insertUserPg = async ({
  name,
  email,
  password_hash,
  profile_picture_url
}: { name: string; email: string; password_hash: string; profile_picture_url?: string }): Promise<User> => {
  const result = await pool.query<User>(
    `INSERT INTO users (name, email, password_hash, profile_picture_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, password_hash, profile_picture_url || null]
  );
  return result.rows[0];
};
export const getUserByIdPg = async (id: number) =>
    {
        const result = await pool.query<User>(`SELECT * FROM users WHERE id = $1`, [id]);
        return result.rows[0] || null;

    }
export const getUserByEmailPg = async (email: string) =>
    {
        const result = await pool.query<User>(`SELECT * FROM users WHERE email = $1`, [email]);
        return result.rows[0] || null;

    }

export const deleteUserByIdPg = async (id: number) =>
    {
        const result = await pool.query<User>(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0] || null;

    }
