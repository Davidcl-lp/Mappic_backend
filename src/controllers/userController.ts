import { Request, Response} from "express";
import bcrypt from 'bcrypt';
import { deleteUserByIdPg, getUserByEmailPg, getUserByIdPg, insertUserPg } from "../model/database/userDb";
import { User } from "../model/interfaces/user";
import { deleteAlbumByIdPg } from "../model/database/albumDb";

export const createUser = async (req: Request, res: Response) => {
    const user = req.body;
    const password_hash = bcrypt.hashSync(req.body.password, 10);
    const result = await insertUserPg({
  name : user.name,
  email : user.email,
  password_hash : password_hash,
  profile_picture_url : user.profile_picture_url,
});
    if(!result) return res.status(500).json({message: "El usuario no se pudo crear"});
    return res.status(200).json({message:"El usuario se ha creado correctamente"})

}
export const getUserById = async (req: Request, res: Response) =>{
    const user: User = await getUserByIdPg(Number(req.params.id));
    if(!user) return res.status(500).json({message:"No se ha encontrado el usuario"});
    const {password_hash, ...UserWithOutHash} = user;
    return res.status(200).json({UserWithOutHash});
}
export const deleteUserBydId = async (req: Request, res: Response) =>{
    const result = await deleteUserByIdPg(Number(req.params.id));
    if(!result) return res.status(500).json({message: "El usuario no se pudo eliminar"});
    return res.status(200);
}
export const login = async (req: Request, res: Response) =>{
    const loginData = await getUserByEmailPg(req.body.email);
    console.log(loginData)
    console.log(req.body.password)
    const isValid: boolean = bcrypt.compareSync(req.body.password, loginData.password_hash);
    if (isValid) {
    return res.status(200).json({ message: "Login exitoso" });
    }

    return res.status(401).json({ message: "Usuario o contraseña incorrecta" });
}

