// src/upload.ts
import multer from "multer";

// Configuración: almacenamiento en memoria
export const upload = multer({ storage: multer.memoryStorage() });
