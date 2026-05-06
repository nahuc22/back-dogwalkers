import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable, ownersTable, walkersTable, adminsTable } from "../db/schema";
import { UserRegistration, UserLogin, FirebaseAuth } from "../schemas/authSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";
import { ServiceError } from "./serviceError";
import { getOwnerProfileService } from "./ownerService";
import { getWalkerProfileService } from "./walkerService";
import { verifyFirebaseToken } from "./firebaseService";
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

    // Verificar si el usuario está activo
    if (user.isActive === false || user.isActive === null) {
      throw new ServiceError("USER_INACTIVE");
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

export async function firebaseAuthService(authData: FirebaseAuth) {
  const { idToken, role } = authData;
  
  try {
    // Verificar el token con Firebase
    const firebaseUser = await verifyFirebaseToken(idToken);
    
    if (!firebaseUser.email) {
      throw new ServiceError("INVALID_USERNAME_OR_PASSWORD");
    }

    const { uid: firebaseUid, email, name } = firebaseUser;

    // Buscar si el usuario ya existe por firebaseUid o email
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.firebaseUid, firebaseUid))
      .limit(1)
      .execute();

    // Si no se encuentra por firebaseUid, buscar por email
    let userByEmail = null;
    if (!existingUser) {
      [userByEmail] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
        .execute();
    }

    const foundUser = existingUser || userByEmail;

    if (foundUser) {
      // Verificar si el usuario está activo
      if (foundUser.isActive === false || foundUser.isActive === null) {
        throw new ServiceError("USER_INACTIVE");
      }

      // Si el usuario existe pero no tiene firebaseUid, actualizarlo
      if (!foundUser.firebaseUid && firebaseUid) {
        await db
          .update(usersTable)
          .set({ firebaseUid })
          .where(eq(usersTable.id, foundUser.id))
          .execute();
      }

      // Usuario existente - hacer login
      let profile;
      if (foundUser.role === 'owner') {
        profile = await getOwnerProfileService(foundUser.id);
      } else if (foundUser.role === 'walker') {
        profile = await getWalkerProfileService(foundUser.id);
      }

      return {
        userId: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        profile,
      };
    }

    // Usuario nuevo - registrar
    // Separar nombre completo en nombre y apellido
    const nameParts = (name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const [newUser] = await db.insert(usersTable).values({
      email,
      firebaseUid,
      role,
      name: firstName,
      lastname: lastName,
    }).$returningId();

    const userId = newUser.id;

    // Crear perfil según el rol
    if (role === 'owner') {
      await db.insert(ownersTable).values({
        userId,
        name: firstName,
        lastname: lastName,
      }).$returningId();
    } else {
      await db.insert(walkersTable).values({
        userId,
        name: firstName,
        lastname: lastName,
      }).$returningId();
    }

    // Obtener el perfil completo
    let profile;
    if (role === 'owner') {
      profile = await getOwnerProfileService(userId);
    } else {
      profile = await getWalkerProfileService(userId);
    }

    return {
      userId,
      email,
      role,
      profile,
    };
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    handleDrizzleError(error);
  }
}

// NOTA: Las funciones de actualización de perfiles se movieron a:
// - updateOwnerProfileService -> ownerService.ts
// - updateWalkerProfileService -> walkerService.ts
