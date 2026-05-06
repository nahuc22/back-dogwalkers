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
export async function getAllPetsService(location?: string, limit: number = 20) {
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
      .where(
        sql`${usersTable.isActive} = 1 AND (
          ${location 
            ? sql`${ownersTable.location} LIKE ${`%${location}%`} OR ${ownersTable.location} IS NULL OR ${ownersTable.location} = ''`
            : sql`1=1`
          }
        )`
      )
      .limit(limit)
      .execute();

    return pets;
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
