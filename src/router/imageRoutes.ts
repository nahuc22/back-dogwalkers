import { Router } from 'express';
import {
  uploadUserProfileImage,
  uploadWalkerCoverImage,
  uploadPetProfileImage,
  deleteUserProfileImage,
  deletePetProfileImage,
} from '../controllers/imageController';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = Router();

// Rutas para imágenes de perfil de usuarios
router.post('/users/:userId/profile-image', uploadSingle, uploadUserProfileImage);
router.delete('/users/:userId/profile-image', deleteUserProfileImage);

// Rutas para imagen de portada de walkers
router.post('/walkers/:userId/cover-image', uploadSingle, uploadWalkerCoverImage);

// Rutas para imágenes de perfil de mascotas
router.post('/pets/:petId/profile-image', uploadSingle, uploadPetProfileImage);
router.delete('/pets/:petId/profile-image', deletePetProfileImage);

export default router;
