import { handler, HttpError } from "../lib/handler";
import { updateWalkerProfileSchema } from "../schemas/walkerSchemas";
import { ServiceError } from "../services/serviceError";
import { 
  getWalkerProfileService, 
  updateWalkerProfileService, 
  getAllWalkersService,
  getWalkerByIdService,
  getNearbyWalkersService,
  searchWalkersService
} from "../services/walkerService";
import { z } from "zod";

/**
 * Obtener perfil de walker por userId
 */
export const getWalkerProfile = handler({
  req: z.object({ params: z.object({ userId: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await getWalkerProfileService(userId);
      
      if (!profile) {
        return new HttpError(404, "WALKER_NOT_FOUND");
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
 * Actualizar perfil de walker
 */
export const updateWalkerProfile = handler({
  req: z.object({ 
    body: updateWalkerProfileSchema, 
    params: z.object({ userId: z.string() }) 
  }),
  res: z.any(),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const updatedProfile = await updateWalkerProfileService(userId, req.body);
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
 * Obtener todos los walkers
 */
export const getAllWalkers = handler({
  req: z.object({ 
    query: z.object({ 
      location: z.string().optional(),
      limit: z.string().optional() 
    }).optional() 
  }),
  res: z.array(z.any()),
  async handler(req) {
    try {
      const location = req.query?.location;
      const limit = req.query?.limit ? parseInt(req.query.limit) : 10;
      
      // Si hay ubicación, buscar walkers cercanos
      if (location) {
        const walkers = await getNearbyWalkersService(location, limit);
        return walkers;
      }
      
      // Si no hay ubicación, retornar todos los walkers
      const walkers = await getAllWalkersService();
      return walkers;
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
 * Obtener walker por ID
 */
export const getWalkerById = handler({
  req: z.object({ params: z.object({ walkerId: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const walkerId = parseInt(req.params.walkerId);
      const walker = await getWalkerByIdService(walkerId);
      
      if (!walker) {
        return new HttpError(404, "WALKER_NOT_FOUND");
      }
      
      return walker;
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
 * Buscar walkers por nombre o ubicación
 */
export const searchWalkers = handler({
  req: z.object({ 
    query: z.object({ 
      q: z.string() 
    }) 
  }),
  res: z.array(z.any()),
  async handler(req) {
    try {
      const searchTerm = req.query.q;
      const walkers = await searchWalkersService(searchTerm);
      return walkers;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});
