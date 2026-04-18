import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { walkersTable } from "../db/schema";
import { UpdateWalkerProfile } from "../schemas/walkerSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";

/**
 * Obtener perfil de walker por userId
 */
export async function getWalkerProfileService(userId: number) {
  try {
    const [profile] = await db
      .select()
      .from(walkersTable)
      .where(eq(walkersTable.userId, userId))
      .limit(1)
      .execute();

    return profile;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Actualizar perfil de walker
 */
export async function updateWalkerProfileService(userId: number, profileData: UpdateWalkerProfile) {
  try {
    await db
      .update(walkersTable)
      .set(profileData)
      .where(eq(walkersTable.userId, userId))
      .execute();

    const [updatedProfile] = await db
      .select()
      .from(walkersTable)
      .where(eq(walkersTable.userId, userId))
      .limit(1)
      .execute();

    return updatedProfile;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtener todos los walkers
 */
export async function getAllWalkersService(location?: string, limit: number = 20) {
  try {
    const walkers = await db
      .select()
      .from(walkersTable)
      .where(
        location 
          ? sql`(${walkersTable.location} LIKE ${`%${location}%`} OR ${walkersTable.location} IS NULL OR ${walkersTable.location} = '')`
          : sql`1=1`
      )
      .limit(limit)
      .execute();

    return walkers;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtener walker por ID
 */
export async function getWalkerByIdService(walkerId: number) {
  try {
    const [walker] = await db
      .select()
      .from(walkersTable)
      .where(eq(walkersTable.id, walkerId))
      .limit(1)
      .execute();

    return walker;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtener walkers cercanos a una ubicación
 * @param userLocation - Ubicación del usuario (ej: "San Miguel de Tucumán, Argentina")
 * @param limit - Número máximo de resultados (default: 10)
 */
export async function getNearbyWalkersService(userLocation?: string, limit: number = 10) {
  try {
    // Por ahora retornamos todos los walkers
    // TODO: Implementar cálculo de distancia cuando tengamos coordenadas lat/lng
    const walkers = await db
      .select()
      .from(walkersTable)
      .limit(limit)
      .execute();

    return walkers;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Buscar walkers por nombre o ubicación
 */
export async function searchWalkersService(searchTerm: string) {
  try {
    const walkers = await db
      .select()
      .from(walkersTable)
      .where(
        sql`${walkersTable.name} LIKE ${`%${searchTerm}%`} OR ${walkersTable.location} LIKE ${`%${searchTerm}%`}`
      )
      .execute();

    return walkers;
  } catch (error) {
    handleDrizzleError(error);
  }
}
