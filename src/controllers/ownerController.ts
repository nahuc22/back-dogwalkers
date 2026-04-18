import { handler, HttpError } from "../lib/handler";
import { updateOwnerProfileSchema } from "../schemas/ownerSchemas";
import { ServiceError } from "../services/serviceError";
import { 
  getOwnerProfileService, 
  updateOwnerProfileService, 
  getAllOwnersService,
  getOwnerByIdService 
} from "../services/ownerService";
import { z } from "zod";

/**
 * Obtener perfil de owner por userId
 */
export const getOwnerProfile = handler({
  req: z.object({ params: z.object({ userId: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await getOwnerProfileService(userId);
      
      if (!profile) {
        return new HttpError(404, "OWNER_NOT_FOUND");
      }
      
      return profile;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

/**
 * Actualizar perfil de owner
 */
export const updateOwnerProfile = handler({
  req: z.object({ 
    body: updateOwnerProfileSchema, 
    params: z.object({ userId: z.string() }) 
  }),
  res: z.any(),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const updatedProfile = await updateOwnerProfileService(userId, req.body);
      return updatedProfile;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

/**
 * Obtener todos los owners
 */
export const getAllOwners = handler({
  req: z.object({}),
  res: z.array(z.any()),
  async handler(req) {
    try {
      const owners = await getAllOwnersService();
      return owners;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

/**
 * Obtener owner por ID
 */
export const getOwnerById = handler({
  req: z.object({ params: z.object({ ownerId: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const owner = await getOwnerByIdService(ownerId);
      
      if (!owner) {
        return new HttpError(404, "OWNER_NOT_FOUND");
      }
      
      return owner;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});
