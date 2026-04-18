import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log para verificar configuración (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  console.log('☁️ Cloudinary configured:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
  });
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes: number;
}

/**
 * Sube una imagen a Cloudinary
 * @param file - Buffer o path del archivo
 * @param folder - Carpeta en Cloudinary (ej: 'users', 'pets')
 * @param publicId - ID público opcional para el archivo
 * @returns Resultado del upload con URL y metadata
 */
export const uploadImage = async (
  file: Buffer | string,
  folder: string,
  publicId?: string
): Promise<CloudinaryUploadResult> => {
  try {
    const options: any = {
      folder: `dogwalkers/${folder}`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }, // Optimización automática
      ],
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    // Si es un Buffer, convertirlo a base64
    let uploadSource: string;
    if (Buffer.isBuffer(file)) {
      uploadSource = `data:image/jpeg;base64,${file.toString('base64')}`;
    } else {
      uploadSource = file;
    }

    const result = await cloudinary.uploader.upload(uploadSource, options);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      resource_type: result.resource_type,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Elimina una imagen de Cloudinary
 * @param publicId - ID público del archivo a eliminar
 * @returns Resultado de la eliminación
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Genera una URL transformada de Cloudinary
 * @param publicId - ID público del archivo
 * @param transformations - Transformaciones a aplicar
 * @returns URL transformada
 */
export const getTransformedUrl = (
  publicId: string,
  transformations: any = {}
): string => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
};

/**
 * Genera una URL de thumbnail
 * @param publicId - ID público del archivo
 * @param width - Ancho del thumbnail (default: 200)
 * @param height - Alto del thumbnail (default: 200)
 * @returns URL del thumbnail
 */
export const getThumbnailUrl = (
  publicId: string,
  width: number = 200,
  height: number = 200
): string => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width, height, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
};

export default cloudinary;
