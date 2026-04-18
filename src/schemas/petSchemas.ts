import { z } from 'zod';

/**
 * Schema para agregar/actualizar mascota
 */
export const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  breed: z.string().optional(),
  age: z.number().int().positive().optional(),
  type: z.enum(['perro', 'gato', 'otro']).default('perro'),
  size: z.enum(['pequeño', 'mediano', 'grande']).optional(),
  isCastrated: z.boolean().optional(),
  getsAlongWithOthers: z.boolean().optional(),
  medicalCondition: z.string().optional(),
  specifications: z.string().optional(),
  profileImage: z.string().optional(),
});

/**
 * Schema para crear mascota (incluye ownerId)
 */
export const createPetSchema = petSchema.extend({
  ownerId: z.number().int().positive(),
});

/**
 * Schema para actualizar mascota (todos los campos opcionales)
 */
export const updatePetSchema = z.object({
  name: z.string().min(1).optional(),
  breed: z.string().optional(),
  age: z.number().int().positive().optional(),
  type: z.enum(['perro', 'gato', 'otro']).optional(),
  size: z.enum(['pequeño', 'mediano', 'grande']).optional(),
  isCastrated: z.boolean().optional(),
  getsAlongWithOthers: z.boolean().optional(),
  medicalCondition: z.string().optional(),
  specifications: z.string().optional(),
  profileImage: z.string().optional(),
});

// Tipos TypeScript inferidos
export type Pet = z.infer<typeof petSchema>;
export type CreatePet = z.infer<typeof createPetSchema>;
export type UpdatePet = z.infer<typeof updatePetSchema>;
