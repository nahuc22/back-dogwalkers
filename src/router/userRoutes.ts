import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/userController";

const userRoutes = Router();

// localhost:3001/api/users/register
userRoutes.post("/register", registerUser);
// localhost:3001/api/users/login
userRoutes.post("/login", loginUser);
// localhost:3001/api/users
userRoutes.get("/", getAllUsers);

export default userRoutes;