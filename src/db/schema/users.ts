import { mysqlTable, serial, varchar, mysqlEnum, boolean, timestamp, int } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }),
  lastname: varchar({ length: 255 }),
  age: int(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }), // Opcional para usuarios de Firebase Auth
  firebaseUid: varchar({ length: 255 }).unique(), // UID de Firebase para autenticación
  role: mysqlEnum(['owner', 'walker', 'admin']).notNull().default('owner'),
  isActive: boolean().default(true),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().onUpdateNow(),
});