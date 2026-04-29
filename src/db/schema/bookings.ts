import { mysqlTable, int, bigint, varchar, timestamp, decimal, text, mysqlEnum, json, serial } from 'drizzle-orm/mysql-core';
import { usersTable } from './users';
import { walkersTable } from './walkers';
import { ownersTable } from './owners';

export const bookingsTable = mysqlTable('bookings', {
  id: serial().primaryKey(),
  
  // Relaciones
  ownerId: bigint('owner_id', { mode: 'number', unsigned: true }).notNull().references(() => ownersTable.id),
  walkerId: bigint('walker_id', { mode: 'number', unsigned: true }).notNull().references(() => walkersTable.id),
  
  // Detalles de la reserva
  petIds: json('pet_ids').$type<number[]>().notNull(), // Array de IDs de mascotas
  date: varchar('date', { length: 10 }).notNull(), // Formato: YYYY-MM-DD
  startTime: varchar('start_time', { length: 5 }).notNull(), // Formato: HH:MM (ej: "14:00")
  duration: int('duration').notNull(), // Duración en minutos (30, 45, 60, 90, 120)
  
  // Ubicación y detalles
  location: varchar('location', { length: 255 }), // Ubicación del paseo
  notes: text('notes'), // Notas del owner para el walker
  
  // Precio
  pricePerPet: decimal('price_per_pet', { precision: 10, scale: 2 }).notNull(), // Precio por perro
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(), // Precio total calculado
  
  // Estado de la reserva
  status: mysqlEnum('status', [
    'pending',    // Esperando respuesta del walker
    'accepted',   // Walker aceptó
    'rejected',   // Walker rechazó
    'completed',  // Paseo completado
    'cancelled'   // Cancelado por owner o walker
  ]).notNull().default('pending'),
  
  // Metadata
  rejectionReason: text('rejection_reason'), // Razón si fue rechazado
  cancellationReason: text('cancellation_reason'), // Razón si fue cancelado
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  acceptedAt: timestamp('accepted_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
});

export type Booking = typeof bookingsTable.$inferSelect;
export type NewBooking = typeof bookingsTable.$inferInsert;
