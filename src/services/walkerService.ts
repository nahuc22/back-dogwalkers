import { db } from "../db";
import { eq, sql, or } from "drizzle-orm";
import { walkersTable, usersTable } from "../db/schema";
import { UpdateWalkerProfile } from "../schemas/walkerSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";
import { parseLocation } from "../utils/locationUtils";

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
    // Si se actualiza la ubicación, extraer provincia y ciudad
    const dataToUpdate = { ...profileData };
    if (profileData.location) {
      const { province, city } = parseLocation(profileData.location);
      dataToUpdate.province = province || undefined;
      dataToUpdate.city = city || undefined;
    }

    // Convertir coordenadas de string a número si existen
    if (profileData.latitude) {
      dataToUpdate.latitude = profileData.latitude;
    }
    if (profileData.longitude) {
      dataToUpdate.longitude = profileData.longitude;
    }

    await db
      .update(walkersTable)
      .set(dataToUpdate)
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
      .select({
        id: walkersTable.id,
        userId: walkersTable.userId,
        name: walkersTable.name,
        lastname: walkersTable.lastname,
        location: walkersTable.location,
        address: walkersTable.address,
        province: walkersTable.province,
        city: walkersTable.city,
        latitude: walkersTable.latitude,
        longitude: walkersTable.longitude,
        profileImage: walkersTable.profileImage,
        coverImage: walkersTable.coverImage,
        description: walkersTable.description,
        age: walkersTable.age,
        rating: walkersTable.rating,
        experience: walkersTable.experience,
        verified: walkersTable.verified,
        phone: walkersTable.phone,
        price: walkersTable.price,
      })
      .from(walkersTable)
      .innerJoin(usersTable, eq(walkersTable.userId, usersTable.id))
      .where(
        sql`${usersTable.isActive} = 1 AND (
          ${location 
            ? sql`(
              ${walkersTable.province} LIKE ${`%${location}%`} OR 
              ${walkersTable.city} LIKE ${`%${location}%`} OR 
              ${walkersTable.location} LIKE ${`%${location}%`} OR 
              ${walkersTable.location} IS NULL OR 
              ${walkersTable.location} = ''
            )`
            : sql`1=1`
          }
        )`
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
 * @param userLocation - Ubicación del usuario (ej: "San Miguel de Tucumán, Tucumán")
 * @param limit - Número máximo de resultados (default: 10)
 */
export async function getNearbyWalkersService(userLocation?: string, limit: number = 10) {
  try {
    // Extraer provincia del usuario para filtrar
    const { province: userProvince } = parseLocation(userLocation);

    const walkers = await db
      .select({
        id: walkersTable.id,
        userId: walkersTable.userId,
        name: walkersTable.name,
        lastname: walkersTable.lastname,
        location: walkersTable.location,
        address: walkersTable.address,
        province: walkersTable.province,
        city: walkersTable.city,
        latitude: walkersTable.latitude,
        longitude: walkersTable.longitude,
        profileImage: walkersTable.profileImage,
        coverImage: walkersTable.coverImage,
        description: walkersTable.description,
        age: walkersTable.age,
        rating: walkersTable.rating,
        experience: walkersTable.experience,
        verified: walkersTable.verified,
        phone: walkersTable.phone,
        price: walkersTable.price,
      })
      .from(walkersTable)
      .innerJoin(usersTable, eq(walkersTable.userId, usersTable.id))
      .where(
        sql`${usersTable.isActive} = 1 AND (
          ${userProvince
            ? sql`${walkersTable.province} = ${userProvince} OR ${walkersTable.province} IS NULL`
            : sql`1=1`
          }
        )`
      )
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
      .select({
        id: walkersTable.id,
        userId: walkersTable.userId,
        name: walkersTable.name,
        lastname: walkersTable.lastname,
        location: walkersTable.location,
        address: walkersTable.address,
        province: walkersTable.province,
        city: walkersTable.city,
        latitude: walkersTable.latitude,
        longitude: walkersTable.longitude,
        profileImage: walkersTable.profileImage,
        coverImage: walkersTable.coverImage,
        description: walkersTable.description,
        age: walkersTable.age,
        rating: walkersTable.rating,
        experience: walkersTable.experience,
        verified: walkersTable.verified,
        phone: walkersTable.phone,
        price: walkersTable.price,
      })
      .from(walkersTable)
      .innerJoin(usersTable, eq(walkersTable.userId, usersTable.id))
      .where(
        sql`${usersTable.isActive} = 1 AND (
          ${walkersTable.name} LIKE ${`%${searchTerm}%`} OR 
          ${walkersTable.province} LIKE ${`%${searchTerm}%`} OR 
          ${walkersTable.city} LIKE ${`%${searchTerm}%`} OR 
          ${walkersTable.location} LIKE ${`%${searchTerm}%`}
        )`
      )
      .execute();

    return walkers;
  } catch (error) {
    handleDrizzleError(error);
  }
}
