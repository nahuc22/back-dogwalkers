import { handler, HttpError } from "../lib/handler";
import { petSchema, updatePetSchema } from "../schemas/petSchemas";
import { ServiceError } from "../services/serviceError";
import { addPetService, getAllPetsService, getPetsByOwnerService, updatePetService, deletePetService } from "../services/petService";
import { z } from "zod";

// Agregar mascota
export const addPet = handler({
  req: z.object({ body: petSchema, params: z.object({ userId: z.string() }) }),
  res: z.object({ id: z.number() }),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const newPet = await addPetService(userId, req.body);
      return newPet;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

// Obtener todos los perros disponibles (para walkers)
export const getAllPets = handler({
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
      const limit = req.query?.limit ? parseInt(req.query.limit) : 20;
      const pets = await getAllPetsService(location, limit);
      return pets;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

// Obtener mascotas de un owner
export const getPetsByOwner = handler({
  req: z.object({ params: z.object({ userId: z.string() }) }),
  res: z.array(z.any()),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return new HttpError(400, 'Invalid userId parameter');
      }
      
      const pets = await getPetsByOwnerService(userId);
      return pets;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

// Actualizar mascota
export const updatePet = handler({
  req: z.object({ 
    body: updatePetSchema, 
    params: z.object({ userId: z.string(), petId: z.string() }) 
  }),
  res: z.any(),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const petId = parseInt(req.params.petId);
      const updatedPet = await updatePetService(petId, userId, req.body);
      return updatedPet;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});

// Eliminar mascota
export const deletePet = handler({
  req: z.object({ params: z.object({ userId: z.string(), petId: z.string() }) }),
  res: z.object({ success: z.boolean() }),
  async handler(req) {
    try {
      const userId = parseInt(req.params.userId);
      const petId = parseInt(req.params.petId);
      const result = await deletePetService(petId, userId);
      return result;
    } catch (error) {
      if (error instanceof ServiceError) {
        return new HttpError(400, error.code);
      } else {
        throw error;
      }
    }
  },
});
