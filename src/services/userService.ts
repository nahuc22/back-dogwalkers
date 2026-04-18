import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable, ownersTable, walkersTable, adminsTable } from "../db/schema";
import { UserRegistration, UserLogin } from "../schemas/authSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";
import { ServiceError } from "./serviceError";
import { getOwnerProfileService } from "./ownerService";
import { getWalkerProfileService } from "./walkerService";
// import bcrypt from "bcryptjs"; // DESHABILITADO PARA DESARROLLO - NO USAR EN PRODUCCIÓN

// async function hash(value: string): Promise<string> {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(value, salt);
// }

// async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
//   return bcrypt.compare(plainPassword, hashedPassword);
// }

export async function registerUserService(userData: UserRegistration) {
  try {
    // 1. Crear usuario en tabla users
    const [newUser] = await db.insert(usersTable).values({
      email: userData.email,
      password: userData.password, // ADVERTENCIA: Sin hashear - SOLO PARA DESARROLLO
      role: userData.role,
    }).$returningId();

    const userId = newUser.id;

    // 2. Crear perfil según el rol
    let profileId: number;
    if (userData.role === 'owner') {
      const [owner] = await db.insert(ownersTable).values({
        userId,
        name: userData.name,
        lastname: userData.lastname,
        location: userData.location,
      }).$returningId();
      profileId = owner.id;
    } else if (userData.role === 'walker') {
      const [walker] = await db.insert(walkersTable).values({
        userId,
        name: userData.name,
        lastname: userData.lastname,
        location: userData.location,
      }).$returningId();
      profileId = walker.id;
    } else if (userData.role === 'admin') {
      const [admin] = await db.insert(adminsTable).values({
        userId,
        name: userData.name,
        lastname: userData.lastname,
      }).$returningId();
      profileId = admin.id;
    } else {
      throw new ServiceError("INVALID_USERNAME_OR_PASSWORD");
    }

    return { userId, profileId, role: userData.role };
  } catch (error) {
    handleDrizzleError(error);
  }
}

export async function loginUserService(LoginData: UserLogin) {
  const { email, password } = LoginData;

  try {
    // 1. Buscar usuario
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1)
      .execute();

    if (!user) {
      throw new ServiceError("INVALID_USERNAME_OR_PASSWORD");
    }

    // ADVERTENCIA: Comparación en texto plano - SOLO PARA DESARROLLO
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new ServiceError("INVALID_USERNAME_OR_PASSWORD");
    }

    // 2. Obtener datos del perfil según el rol
    let profile;
    if (user.role === 'owner') {
      profile = await getOwnerProfileService(user.id);
    } else if (user.role === 'walker') {
      profile = await getWalkerProfileService(user.id);
    } else if (user.role === 'admin') {
      [profile] = await db
        .select()
        .from(adminsTable)
        .where(eq(adminsTable.userId, user.id))
        .limit(1)
        .execute();
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      profile,
    };
  } catch (error) {
    handleDrizzleError(error);
  }
}

export async function getAllUsersService() {
  try {
    const allUsers = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        isActive: usersTable.isActive,
      })
      .from(usersTable)
      .execute();

    return allUsers;
  } catch (error) {
    handleDrizzleError(error);
  }
}

// NOTA: Las funciones de actualización de perfiles se movieron a:
// - updateOwnerProfileService -> ownerService.ts
// - updateWalkerProfileService -> walkerService.ts
