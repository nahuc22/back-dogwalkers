import { handler, HttpError } from '../lib/handler';
import { z } from 'zod';
import {
  createBookingService,
  getBookingByIdService,
  getOwnerBookingsService,
  getWalkerBookingsService,
  acceptBookingService,
  rejectBookingService,
  cancelBookingService,
  completeBookingService,
} from '../services/bookingService';

/**
 * Crea una nueva reserva
 * POST /api/bookings
 */
export const createBooking = handler({
  req: z.object({
    body: z.object({
      ownerId: z.number(),
      walkerId: z.number(),
      petIds: z.array(z.number()).min(1),
      date: z.string(),
      startTime: z.string(),
      duration: z.number(),
      location: z.string().optional(),
      notes: z.string().optional(),
      pricePerPet: z.number(),
    }),
  }),
  res: z.any(),
  async handler(req) {
    try {
      const {
        ownerId,
        walkerId,
        petIds,
        date,
        startTime,
        duration,
        location,
        notes,
        pricePerPet,
      } = req.body;

      const booking = await createBookingService({
        ownerId,
        walkerId,
        petIds,
        date,
        startTime,
        duration,
        location,
        notes,
        pricePerPet,
      });

      return booking;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al crear la reserva');
    }
  },
});

/**
 * Obtiene una reserva por ID
 * GET /api/bookings/:id
 */
export const getBookingById = handler({
  req: z.object({ params: z.object({ id: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const bookingId = parseInt(req.params.id);

      const booking = await getBookingByIdService(bookingId);

      if (!booking) {
        return new HttpError(404, 'Reserva no encontrada');
      }

      return booking;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al obtener la reserva');
    }
  },
});

/**
 * Obtiene todas las reservas de un owner
 * GET /api/bookings/owner/:ownerId
 */
export const getOwnerBookings = handler({
  req: z.object({ params: z.object({ ownerId: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const bookings = await getOwnerBookingsService(ownerId);
      return bookings;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al obtener las reservas del owner');
    }
  },
});

/**
 * Obtiene todas las reservas de un walker
 * GET /api/bookings/walker/:walkerId
 */
export const getWalkerBookings = handler({
  req: z.object({ params: z.object({ walkerId: z.string() }) }),
  res: z.any(),
  async handler(req) {
    try {
      const walkerId = parseInt(req.params.walkerId);
      const bookings = await getWalkerBookingsService(walkerId);
      return bookings;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al obtener las reservas del walker');
    }
  },
});

/**
 * Walker acepta una reserva
 * PUT /api/bookings/:id/accept
 */
export const acceptBooking = handler({
  req: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({ walkerId: z.number() }),
  }),
  res: z.any(),
  async handler(req) {
    try {
      const bookingId = parseInt(req.params.id);
      const { walkerId } = req.body;

      const result = await acceptBookingService(bookingId, walkerId);
      return result;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al aceptar la reserva');
    }
  },
});

/**
 * Walker rechaza una reserva
 * PUT /api/bookings/:id/reject
 */
export const rejectBooking = handler({
  req: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
      walkerId: z.number(),
      reason: z.string().optional(),
    }),
  }),
  res: z.any(),
  async handler(req) {
    try {
      const bookingId = parseInt(req.params.id);
      const { walkerId, reason } = req.body;

      const result = await rejectBookingService(bookingId, walkerId, reason);
      return result;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al rechazar la reserva');
    }
  },
});

/**
 * Cancela una reserva
 * PUT /api/bookings/:id/cancel
 */
export const cancelBooking = handler({
  req: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
      userId: z.number(),
      role: z.enum(['owner', 'walker']),
      reason: z.string().optional(),
    }),
  }),
  res: z.any(),
  async handler(req) {
    try {
      const bookingId = parseInt(req.params.id);
      const { userId, role, reason } = req.body;

      const result = await cancelBookingService(bookingId, userId, role, reason);
      return result;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al cancelar la reserva');
    }
  },
});

/**
 * Marca una reserva como completada
 * PUT /api/bookings/:id/complete
 */
export const completeBooking = handler({
  req: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({ walkerId: z.number() }),
  }),
  res: z.any(),
  async handler(req) {
    try {
      const bookingId = parseInt(req.params.id);
      const { walkerId } = req.body;

      const result = await completeBookingService(bookingId, walkerId);
      return result;
    } catch (error: any) {
      return new HttpError(400, error.message || 'Error al completar la reserva');
    }
  },
});
