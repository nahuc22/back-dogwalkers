import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { petsTable, ownersTable, usersTable } from "../db/schema";
import { Pet } from "../schemas/userSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";
import { ServiceError } from "./serviceError";

// Agregar mascota
export async function addPetService(userId: number, petData: Pet) {
  try {
    // 1. Verificar que el usuario sea owner
    const [owner] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.userId, userId))
      .limit(1)
      .execute();

    if (!owner) {
      throw new ServiceError("USER_NOT_OWNER");
    }

    // 2. Crear mascota
    const [newPet] = await db.insert(petsTable).values({
      ownerId: owner.id,
      ...petData,
    }).$returningId();

    return newPet;
  } catch (error) {
    handleDrizzleError(error);
  }
}

// Obtener todos los perros disponibles (para walkers)
// Acepta coordenadas opcionales para calcular distancia real
export async function getAllPetsService(
  location?: string, 
  limit: number = 20,
  userLatitude?: number,
  userLongitude?: number,
  maxDistanceKm: number = 50 // Radio máximo de búsqueda en km
) {
  try {
    const pets = await db
      .select({
        id: petsTable.id,
        name: petsTable.name,
        breed: petsTable.breed,
        age: petsTable.age,
        type: petsTable.type,
        size: petsTable.size,
        profileImage: petsTable.profileImage,
        medicalCondition: petsTable.medicalCondition,
        specifications: petsTable.specifications,
        ownerId: petsTable.ownerId,
        ownerName: ownersTable.name,
        ownerLastname: ownersTable.lastname,
        ownerLocation: ownersTable.location,
        ownerAddress: ownersTable.address,
        ownerCity: ownersTable.city,
        ownerProvince: ownersTable.province,
        latitude: ownersTable.latitude,
        longitude: ownersTable.longitude,
        ownerProfileImage: ownersTable.profileImage,
        ownerUserId: ownersTable.userId,
      })
      .from(petsTable)
      .innerJoin(ownersTable, eq(petsTable.ownerId, ownersTable.id))
      .innerJoin(usersTable, eq(ownersTable.userId, usersTable.id))
      .where(sql`${usersTable.isActive} = 1`)
      .execute();

    // Si hay coordenadas del walker, calcular distancia y filtrar
    if (userLatitude && userLongitude) {
      const petsWithDistance = pets
        .map(pet => {
          // Si la mascota tiene coordenadas, calcular distancia
          if (pet.latitude && pet.longitude) {
            const petLat = typeof pet.latitude === 'string' ? parseFloat(pet.latitude) : pet.latitude;
            const petLon = typeof pet.longitude === 'string' ? parseFloat(pet.longitude) : pet.longitude;
            
            // Fórmula de Haversine para calcular distancia
            const R = 6371; // Radio de la Tierra en km
            const dLat = (petLat - userLatitude) * Math.PI / 180;
            const dLon = (petLon - userLongitude) * Math.PI / 180;
            const a = 
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLatitude * Math.PI / 180) * Math.cos(petLat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            
            return { ...pet, distance };
          }
          // Si no tiene coordenadas, asignar distancia muy alta
          return { ...pet, distance: 9999 };
        })
        .filter(pet => pet.distance <= maxDistanceKm) // Filtrar por radio
        .sort((a, b) => a.distance - b.distance) // Ordenar por distancia
        .slice(0, limit); // Limitar resultados

      return petsWithDistance;
    }

    // Si no hay coordenadas, usar filtro por texto (fallback)
    if (location) {
      return pets.filter(pet => 
        pet.ownerLocation?.toLowerCase().includes(location.toLowerCase())
      ).slice(0, limit);
    }

    return pets.slice(0, limit);
  } catch (error) {
    handleDrizzleError(error);
  }
}

// Obtener mascotas de un owner
export async function getPetsByOwnerService(userId: number) {
  try {
    const [owner] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.userId, userId))
      .limit(1)
      .execute();

    if (!owner) {
      throw new ServiceError("USER_NOT_OWNER");
    }

    const pets = await db
      .select()
      .from(petsTable)
      .where(eq(petsTable.ownerId, owner.id))
      .execute();

    return pets;
  } catch (error) {
    handleDrizzleError(error);
  }
}

// Actualizar mascota
export async function updatePetService(petId: number, userId: number, petData: Partial<Pet>) {
  try {
    // Verificar que la mascota pertenezca al usuario
    const [owner] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.userId, userId))
      .limit(1)
      .execute();

    if (!owner) {
      throw new ServiceError("USER_NOT_OWNER");
    }

    await db
      .update(petsTable)
      .set(petData)
      .where(eq(petsTable.id, petId))
      .execute();

    const [updatedPet] = await db
      .select()
      .from(petsTable)
      .where(eq(petsTable.id, petId))
      .limit(1)
      .execute();

    return updatedPet;
  } catch (error) {
    handleDrizzleError(error);
  }
}

// Eliminar mascota
export async function deletePetService(petId: number, userId: number) {
  try {
    const [owner] = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.userId, userId))
      .limit(1)
      .execute();

    if (!owner) {
      throw new ServiceError("USER_NOT_OWNER");
    }

    await db
      .delete(petsTable)
      .where(eq(petsTable.id, petId))
      .execute();

    return { success: true };
  } catch (error) {
    handleDrizzleError(error);
  }
}
