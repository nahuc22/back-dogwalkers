import { int, bigint, mysqlTable, serial, varchar, text, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { ownersTable } from './owners';

export const petsTable = mysqlTable('pets', {
  id: serial().primaryKey(),
  ownerId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => ownersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  breed: varchar({ length: 255 }),
  age: int(),
  type: mysqlEnum(['perro', 'gato', 'otro']).notNull().default('perro'),
  size: mysqlEnum(['pequeño', 'mediano', 'grande']),
  isCastrated: boolean(),
  getsAlongWithOthers: boolean(),
  medicalCondition: text(),
  specifications: text(),
  profileImage: varchar({ length: 500 }),
});
