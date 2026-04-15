import { int, mysqlTable, serial, varchar, text, timestamp } from 'drizzle-orm/mysql-core';
import { usersTable } from './users';

export const petsTable = mysqlTable('pets', {
  id: serial().primaryKey(),
  ownerId: int('owner_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  breed: varchar({ length: 100 }),
  age: int(),
  size: varchar({ length: 20 }), // 'small', 'medium', 'large'
  weight: int(), // en kg
  specialNotes: text('special_notes'), // alergias, comportamiento, etc.
  photoUrl: varchar('photo_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
