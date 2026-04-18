import { bigint, mysqlTable, serial, varchar, text } from 'drizzle-orm/mysql-core';
import { usersTable } from './users';

export const ownersTable = mysqlTable('owners', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true }).notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }),
  location: varchar({ length: 255 }),
  profileImage: varchar({ length: 500 }),
  description: text(),
  phone: varchar({ length: 50 }),
});
