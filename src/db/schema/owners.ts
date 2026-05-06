import { bigint, mysqlTable, serial, varchar, text, decimal } from 'drizzle-orm/mysql-core';
import { usersTable } from './users';

export const ownersTable = mysqlTable('owners', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true }).notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }),
  location: varchar({ length: 255 }), // Ubicación completa (ej: "San Miguel de Tucumán, Tucumán")
  address: varchar({ length: 255 }), // Dirección exacta (ej: "Batalla de Suipacha 1284")
  province: varchar({ length: 100 }), // Provincia (ej: "Tucumán")
  city: varchar({ length: 255 }), // Ciudad (ej: "San Miguel de Tucumán")
  latitude: decimal({ precision: 10, scale: 8 }), // Coordenada GPS latitud
  longitude: decimal({ precision: 11, scale: 8 }), // Coordenada GPS longitud
  profileImage: varchar({ length: 500 }),
  description: text(),
  phone: varchar({ length: 50 }),
});
