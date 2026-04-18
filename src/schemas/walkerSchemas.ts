import { z } from 'zod';

/**
 * Schema para actualizar perfil de walker
 */
export const updateWalkerProfileSchema = z.object({
  name: z.string().min(1).optional(),
  lastname: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(), // Imagen de portada/presentación
  description: z.string().optional(), // Descripción profesional
  age: z.string().optional(), // Edad del walker
  experience: z.string().optional(),
  phone: z.string().optional(),
  rating: z.string().optional(), // Decimal como string
  verified: z.boolean().optional(),
  price: z.string().optional(), // Tarifa por hora (decimal como string)
});

/**
 * Schema para crear walker (usado internamente en registro)
 */
export const createWalkerSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  lastname: z.string().optional(),
  location: z.string().optional(),
});

/**
 * Schema para query params de búsqueda de walkers
 */
export const walkerSearchQuerySchema = z.object({
  location: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(), // Para búsqueda por texto
});

// Tipos TypeScript inferidos
export type UpdateWalkerProfile = z.infer<typeof updateWalkerProfileSchema>;
export type CreateWalker = z.infer<typeof createWalkerSchema>;
export type WalkerSearchQuery = z.infer<typeof walkerSearchQuerySchema>;
