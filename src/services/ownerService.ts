import { db } from "../db";
import { eq } from "drizzle-orm";
import { ownersTable } from "../db/schema";
import { UpdateOwnerProfile } from "../schemas/ownerSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";
import { parseLocation } from "../utils/locationUtils";

/**
 * Obtener perfil de owner por userId
 */
export async function getOwnerProfileService(userId: number) {
  try {
    const [profile] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.userId, userId))
      .limit(1)
      .execute();

    return profile;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Actualizar perfil de owner
 */
export async function updateOwnerProfileService(userId: number, profileData: UpdateOwnerProfile) {
  try {
    // Si se actualiza la ubicación, extraer provincia y ciudad
    const dataToUpdate: any = { ...profileData };
    if (profileData.location) {
      const { province, city } = parseLocation(profileData.location);
      dataToUpdate.province = province || undefined;
      dataToUpdate.city = city || undefined;
    }

    // Convertir coordenadas a string para la base de datos (decimal)
    if (profileData.latitude !== undefined) {
      dataToUpdate.latitude = profileData.latitude !== null ? String(profileData.latitude) : null;
    }
    if (profileData.longitude !== undefined) {
      dataToUpdate.longitude = profileData.longitude !== null ? String(profileData.longitude) : null;
    }

    await db
      .update(ownersTable)
      .set(dataToUpdate)
      .where(eq(ownersTable.userId, userId))
      .execute();

    const [updatedProfile] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.userId, userId))
      .limit(1)
      .execute();

    return updatedProfile;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtener todos los owners
 */
export async function getAllOwnersService() {
  try {
    const owners = await db
      .select()
      .from(ownersTable)
      .execute();

    return owners;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtener owner por ID
 */
export async function getOwnerByIdService(ownerId: number) {
  try {
    const [owner] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.id, ownerId))
      .limit(1)
      .execute();

    return owner;
  } catch (error) {
    handleDrizzleError(error);
  }
}
