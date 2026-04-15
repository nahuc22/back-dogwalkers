import { db } from "../db"; // Asegúrate de exportar tu instancia de Drizzle
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema/users";
import { UserRegistration , UserLogin } from "../schemas/userSchemas";
import { handleDrizzleError } from "./drizzleErrorHandler";
import { ServiceError } from "./serviceError";
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
        // ADVERTENCIA: Guardando contraseña en texto plano - SOLO PARA DESARROLLO
        const insertResult = await db.insert(usersTable).values({
            name: userData.name, 
            lastname: userData.lastname,
            age: userData.age,
            email: userData.email,
            password: userData.password, // Sin hashear - NO USAR EN PRODUCCIÓN
          }).$returningId();

          return insertResult[0];
  } catch (error) {
    handleDrizzleError(error);
  }
}

export async function loginUserService(LoginData: UserLogin) {
  const { email, password } = LoginData;

  try {
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
        throw new ServiceError("INVALID_USERNAME_OR_PASSWORD")
    }
    return user;
  } catch (error) {
    handleDrizzleError(error)
  }
}

export async function getAllUsersService() {
  try {
    const allUsers = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        lastname: usersTable.lastname,
        age: usersTable.age,
        email: usersTable.email
      })
      .from(usersTable)
      .execute();
    
    return allUsers;
  } catch (error) {
    handleDrizzleError(error);
  }
}
