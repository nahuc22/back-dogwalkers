import { z } from 'zod';

/**
 * Schema para actualizar perfil de owner
 */
export const updateOwnerProfileSchema = z.object({
  name: z.string().min(1).optional(),
  lastname: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(), // Dirección exacta (ej: "Batalla de Suipacha 1284")
  province: z.string().optional(), // Provincia (ej: "Tucumán")
  city: z.string().optional(), // Ciudad (ej: "San Miguel de Tucumán")
  latitude: z.union([z.string(), z.number(), z.null()]).optional(), // Coordenada GPS
  longitude: z.union([z.string(), z.number(), z.null()]).optional(), // Coordenada GPS
  profileImage: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * Schema para crear owner (usado internamente en registro)
 */
export const createOwnerSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  lastname: z.string().optional(),
  location: z.string().optional(),
});

// Tipos TypeScript inferidos
export type UpdateOwnerProfile = z.infer<typeof updateOwnerProfileSchema>;
export type CreateOwner = z.infer<typeof createOwnerSchema>;
