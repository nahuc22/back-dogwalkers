import { Router } from "express";
import { getAllPets } from "../controllers/petController";

const petRoutes = Router();

// Ruta para obtener todos los perros disponibles (para walkers)
petRoutes.get("/", getAllPets);

export default petRoutes;
