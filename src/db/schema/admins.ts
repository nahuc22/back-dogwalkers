import { bigint, mysqlTable, serial, varchar, json, timestamp } from 'drizzle-orm/mysql-core';
import { usersTable } from './users';

export const adminsTable = mysqlTable('admins', {
  id: serial().primaryKey(),
  userId: bigint({ mode: 'number', unsigned: true }).notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  lastname: varchar({ length: 255 }),
  permissions: json().$type<string[]>().default([]),
  lastLogin: timestamp(),
});
