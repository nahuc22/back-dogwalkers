/**
 * @deprecated Este archivo se mantiene solo para compatibilidad hacia atrás.
 * Por favor, usa los archivos específicos de cada entidad:
 * - authSchemas.ts para autenticación
 * - ownerSchemas.ts para owners
 * - walkerSchemas.ts para walkers
 * - petSchemas.ts para mascotas
 */

// Re-exportar desde los archivos específicos
export { 
  userRegistrationSchema, 
  userLoginSchema,
  type UserRegistration,
  type UserLogin
} from './authSchemas';

export { 
  updateOwnerProfileSchema,
  type UpdateOwnerProfile
} from './ownerSchemas';

export { 
  updateWalkerProfileSchema,
  type UpdateWalkerProfile
} from './walkerSchemas';

export { 
  petSchema,
  updatePetSchema,
  type Pet,
  type UpdatePet
} from './petSchemas';
