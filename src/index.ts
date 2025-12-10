import express from "express";
import { albumRouter } from "./routers/albumRoute";
import { userRouter } from "./routers/userRoute";
import { photoRouter } from "./routers/photoRoute";
import { pool } from './model/database/db';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();



pool.query('SELECT NOW()')
  .then(res => console.log('Conexión OK:', res.rows[0]))
  .catch(err => console.error('Error de conexión:', err));

const app = express();
const port = 3000;
console.log("Supabase key en uso:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,20));

app.use(cors());
app.use(express.json());
app.use('/api',userRouter);
app.use('/api',albumRouter);
app.use('/api', photoRouter)


app.listen(port, () => {
    console.log("Servidor funcionando");
})