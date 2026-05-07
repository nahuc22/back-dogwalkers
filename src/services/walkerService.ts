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
 * Acepta coordenadas opcionales para calcular distancia real
 */
export async function getAllWalkersService(
  location?: string, 
  limit: number = 20,
  userLatitude?: number,
  userLongitude?: number,
  maxDistanceKm: number = 50 // Radio máximo de búsqueda en km
) {
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
      .where(sql`${usersTable.isActive} = 1`)
      .execute();

    // Si hay coordenadas del owner, calcular distancia y filtrar
    if (userLatitude && userLongitude) {
      const walkersWithDistance = walkers
        .map(walker => {
          // Si el walker tiene coordenadas, calcular distancia
          if (walker.latitude && walker.longitude) {
            const walkerLat = typeof walker.latitude === 'string' ? parseFloat(walker.latitude) : walker.latitude;
            const walkerLon = typeof walker.longitude === 'string' ? parseFloat(walker.longitude) : walker.longitude;
            
            // Fórmula de Haversine para calcular distancia
            const R = 6371; // Radio de la Tierra en km
            const dLat = (walkerLat - userLatitude) * Math.PI / 180;
            const dLon = (walkerLon - userLongitude) * Math.PI / 180;
            const a = 
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLatitude * Math.PI / 180) * Math.cos(walkerLat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            
            return { ...walker, distance };
          }
          // Si no tiene coordenadas, asignar distancia muy alta
          return { ...walker, distance: 9999 };
        })
        .filter(walker => walker.distance <= maxDistanceKm) // Filtrar por radio
        .sort((a, b) => a.distance - b.distance) // Ordenar por distancia
        .slice(0, limit); // Limitar resultados

      return walkersWithDistance;
    }

    // Si no hay coordenadas, usar filtro por texto (fallback)
    if (location) {
      return walkers.filter(walker => 
        walker.location?.toLowerCase().includes(location.toLowerCase()) ||
        walker.city?.toLowerCase().includes(location.toLowerCase()) ||
        walker.province?.toLowerCase().includes(location.toLowerCase())
      ).slice(0, limit);
    }

    return walkers.slice(0, limit);
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
