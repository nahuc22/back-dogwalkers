import { Request, Response, NextFunction } from 'express';
import { uploadImage, deleteImage } from '../services/cloudinaryService';
import { db } from '../db';
import { ownersTable, walkersTable, petsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Sube imagen de perfil de usuario (owner o walker)
 */
export const uploadUserProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body; // 'owner' o 'walker'

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!role || !['owner', 'walker'].includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be owner or walker' });
      return;
    }

    // Subir imagen a Cloudinary
    const folder = role === 'owner' ? 'users/owners' : 'users/walkers';
    const result = await uploadImage(
      req.file.buffer,
      folder,
      `${role}_${userId}`
    );

    // Actualizar base de datos
    const table = role === 'owner' ? ownersTable : walkersTable;
    await db
      .update(table)
      .set({ profileImage: result.secure_url })
      .where(eq(table.userId, parseInt(userId)))
      .execute();

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error uploading user profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
};

/**
 * Sube imagen de portada de walker
 */
export const uploadWalkerCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Subir imagen a Cloudinary
    const result = await uploadImage(
      req.file.buffer,
      'users/walkers/covers',
      `walker_cover_${userId}`
    );

    // Actualizar base de datos
    await db
      .update(walkersTable)
      .set({ coverImage: result.secure_url })
      .where(eq(walkersTable.userId, parseInt(userId)))
      .execute();

    res.status(200).json({
      message: 'Walker cover image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error uploading walker cover image:', error);
    res.status(500).json({ error: 'Failed to upload cover image' });
  }
};

/**
 * Sube imagen de perfil de mascota
 */
export const uploadPetProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { petId } = req.params;

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Subir imagen a Cloudinary
    const result = await uploadImage(
      req.file.buffer,
      'pets',
      `pet_${petId}`
    );

    // Actualizar base de datos
    await db
      .update(petsTable)
      .set({ profileImage: result.secure_url })
      .where(eq(petsTable.id, parseInt(petId)))
      .execute();

    res.status(200).json({
      message: 'Pet profile image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error uploading pet profile image:', error);
    res.status(500).json({ error: 'Failed to upload pet profile image' });
  }
};

/**
 * Elimina imagen de perfil de usuario
 */
export const deleteUserProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role, publicId } = req.body;

    if (!role || !['owner', 'walker'].includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be owner or walker' });
      return;
    }

    if (!publicId) {
      res.status(400).json({ error: 'Public ID is required' });
      return;
    }

    // Eliminar de Cloudinary
    await deleteImage(publicId);

    // Actualizar base de datos
    const table = role === 'owner' ? ownersTable : walkersTable;
    await db
      .update(table)
      .set({ profileImage: null })
      .where(eq(table.userId, parseInt(userId)))
      .execute();

    res.status(200).json({
      message: 'Profile image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user profile image:', error);
    res.status(500).json({ error: 'Failed to delete profile image' });
  }
};

/**
 * Elimina imagen de perfil de mascota
 */
export const deletePetProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { petId } = req.params;
    const { publicId } = req.body;

    if (!publicId) {
      res.status(400).json({ error: 'Public ID is required' });
      return;
    }

    // Eliminar de Cloudinary
    await deleteImage(publicId);

    // Actualizar base de datos
    await db
      .update(petsTable)
      .set({ profileImage: null })
      .where(eq(petsTable.id, parseInt(petId)))
      .execute();

    res.status(200).json({
      message: 'Pet profile image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pet profile image:', error);
    res.status(500).json({ error: 'Failed to delete pet profile image' });
  }
};
