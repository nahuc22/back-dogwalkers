import { Router } from "express";
import userRoutes from "./userRoutes";

const router = Router();

console.log("Main router initialized");

router.use("/users", userRoutes);

export default router;