import multer from 'multer';
import { Request } from 'express';

// Configuración de almacenamiento en memoria (no guardamos en disco)
const storage = multer.memoryStorage();

// Filtro de archivos - solo imágenes
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Tipos MIME permitidos
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'));
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

// Middleware para subir una sola imagen
export const uploadSingle = upload.single('image');

// Middleware para subir múltiples imágenes
export const uploadMultiple = upload.array('images', 10); // Máximo 10 imágenes

export default upload;
