import { Router } from "express";
import { 
  getOwnerProfile, 
  updateOwnerProfile, 
  getAllOwners, 
  getOwnerById 
} from "../controllers/ownerController";
import { addPet, getPetsByOwner, updatePet, deletePet } from "../controllers/petController";

const ownerRoutes = Router();

// Rutas de owners
ownerRoutes.get("/", getAllOwners);
ownerRoutes.get("/:ownerId", getOwnerById);

// Rutas de perfil de owner (por userId)
ownerRoutes.get("/profile/:userId", getOwnerProfile);
ownerRoutes.patch("/profile/:userId", updateOwnerProfile);

// Gestión de mascotas (por userId)
ownerRoutes.post("/:userId/pets", addPet);
ownerRoutes.get("/:userId/pets", getPetsByOwner);
ownerRoutes.patch("/:userId/pets/:petId", updatePet);
ownerRoutes.delete("/:userId/pets/:petId", deletePet);

export default ownerRoutes;
