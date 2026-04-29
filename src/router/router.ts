import { Router } from "express";
import userRoutes from "./userRoutes";
import imageRoutes from "./imageRoutes";
import ownerRoutes from "./ownerRoutes";
import walkerRoutes from "./walkerRoutes";
import petRoutes from "./petRoutes";
import bookingRoutes from "./bookingRoutes";

const router = Router();

console.log("Main router initialized");

router.use("/users", userRoutes);
router.use("/images", imageRoutes);
router.use("/owners", ownerRoutes);
router.use("/walkers", walkerRoutes);
router.use("/pets", petRoutes);
router.use("/bookings", bookingRoutes);

export default router;