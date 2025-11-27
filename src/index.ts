import express from "express";
import { albumRouter } from "./routers/albumRoute";
import { userRouter } from "./routers/userRoute";
import { photoRouter } from "./routers/photoRoute";
const app = express();
const port = 3000;
app.use(express.json());
app.use('/api',userRouter);
app.use('/api',albumRouter);
app.listen(port, () => {
    console.log("Servidor funcionando");
})