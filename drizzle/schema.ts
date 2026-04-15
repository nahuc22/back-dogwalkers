import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, serial, varchar, int } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const users = mysqlTable("users", {
	id: serial().notNull(),
	name: varchar({ length: 255 }).notNull(),
	age: int().notNull(),
	email: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
},
(table) => {
	return {
		usersId: primaryKey({ columns: [table.id], name: "users_id"}),
		id: unique("id").on(table.id),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});
