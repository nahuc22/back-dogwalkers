import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/userController";

const userRoutes = Router();

// Autenticación y gestión de usuarios
userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/", getAllUsers);

// NOTA: Las rutas de owners, walkers y pets se movieron a:
// - /api/owners/* (ver ownerRoutes.ts)
// - /api/walkers/* (ver walkerRoutes.ts)

export default userRoutes;