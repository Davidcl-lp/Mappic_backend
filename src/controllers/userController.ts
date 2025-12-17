import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  deleteUserByIdPg,
  getUserByEmailPg,
  getUserByIdPg,
  insertUserPg,
} from "../model/database/userDb";
import { getAllUserAlbumsByIdPg, getAllUserAlbumsOnlyMemberByIdPg } from "../model/database/albumDb";
import { User } from "../model/interfaces/user";
import { Album } from "../model/interfaces/album";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profile_picture_url } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await getUserByEmailPg(email);
    if (existingUser) {
        return res.status(409).json({ message: "This email is already registered" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must contain 6 characters, including a letter and a number" });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const result = await insertUserPg({
      name,
      email,
      password_hash: password_hash,
      profile_picture_url,
    });

    if (!result) {
      return res.status(500).json({ message: "User could not be created" });
    }

    const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      token,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        profile_picture_url: result.profile_picture_url,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await getUserByEmailPg(email);
    if (!user) {
        return res.status(401).json({ message: "User not registered" });
    }
    
    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
        return res.status(401).json({ message: "Wrong password" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: User = await getUserByIdPg(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteUserByIdPg(Number(req.params.id));
    if (!deleted) return res.status(500).json({ message: "User could not be deleted" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllUserAlbumsById = async (req: Request, res: Response) => {
  try {
    const albums: Album[] = await getAllUserAlbumsByIdPg(Number(req.params.id));
    if (!albums) return res.status(404).json({ message: "No albums found for this user" });
    return res.status(200).json(albums);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllUserAlbumsOnlyMemberById = async (req: Request, res: Response) => {
  try {
    const albums = await getAllUserAlbumsOnlyMemberByIdPg(Number(req.params.id));
    if (!albums) return res.status(404).json({ message: "No albums found for this user" });
    return res.status(200).json(albums);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const deleted = await deleteUserByIdPg(payload.id);
    if (!deleted) return res.status(500).json({ message: "User could not be deleted" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
