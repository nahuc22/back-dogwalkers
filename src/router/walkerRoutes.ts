import { Router } from "express";
import { 
  getWalkerProfile, 
  updateWalkerProfile, 
  getAllWalkers, 
  getWalkerById,
  searchWalkers
} from "../controllers/walkerController";

const walkerRoutes = Router();

// Rutas de walkers
walkerRoutes.get("/", getAllWalkers); // GET /api/walkers?location=xxx&limit=10
walkerRoutes.get("/search", searchWalkers); // GET /api/walkers/search?q=xxx
walkerRoutes.get("/:walkerId", getWalkerById); // GET /api/walkers/123

// Rutas de perfil de walker (por userId)
walkerRoutes.get("/profile/:userId", getWalkerProfile);
walkerRoutes.patch("/profile/:userId", updateWalkerProfile);

export default walkerRoutes;
