import { z } from 'zod';

/**
 * Schema para actualizar perfil de walker
 */
export const updateWalkerProfileSchema = z.object({
  name: z.string().min(1).optional(),
  lastname: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(), // Dirección exacta (ej: "Batalla de Suipacha 1284")
  province: z.string().optional(), // Provincia (ej: "Tucumán")
  city: z.string().optional(), // Ciudad (ej: "San Miguel de Tucumán")
  latitude: z.string().optional(), // Coordenada GPS (decimal como string)
  longitude: z.string().optional(), // Coordenada GPS (decimal como string)
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
  latitude: z.string().optional(), // Latitud del usuario para búsqueda por distancia
  longitude: z.string().optional(), // Longitud del usuario para búsqueda por distancia
  radius: z.string().optional(), // Radio de búsqueda en km (default: 10)
  limit: z.string().optional(),
  q: z.string().optional(), // Para búsqueda por texto
});

// Tipos TypeScript inferidos
export type UpdateWalkerProfile = z.infer<typeof updateWalkerProfileSchema>;
export type CreateWalker = z.infer<typeof createWalkerSchema>;
export type WalkerSearchQuery = z.infer<typeof walkerSearchQuerySchema>;
