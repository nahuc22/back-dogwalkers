import { Router } from 'express';
import {
  createBooking,
  getBookingById,
  getOwnerBookings,
  getWalkerBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking,
} from '../controllers/bookingController';

const bookingRoutes = Router();

// Crear nueva reserva
bookingRoutes.post('/', createBooking);

// Obtener reservas de un owner
bookingRoutes.get('/owner/:ownerId', getOwnerBookings);

// Obtener reservas de un walker
bookingRoutes.get('/walker/:walkerId', getWalkerBookings);

// Obtener reserva por ID
bookingRoutes.get('/:id', getBookingById);

// Aceptar reserva (walker)
bookingRoutes.put('/:id/accept', acceptBooking);

// Rechazar reserva (walker)
bookingRoutes.put('/:id/reject', rejectBooking);

// Cancelar reserva (owner o walker)
bookingRoutes.put('/:id/cancel', cancelBooking);

// Completar reserva (walker)
bookingRoutes.put('/:id/complete', completeBooking);

export default bookingRoutes;
