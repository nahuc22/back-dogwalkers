import { z } from 'zod';

/**
 * Schema para registro de usuario
 */
export const userRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['owner', 'walker', 'admin']).default('owner'),
  lastname: z.string().optional(),
  location: z.string().optional(),
});

/**
 * Schema para login de usuario
 */
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Tipos TypeScript inferidos
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
