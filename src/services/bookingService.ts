import { db } from '../db';
import { bookingsTable, ownersTable, walkersTable, petsTable, usersTable } from '../db/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { handleDrizzleError } from './drizzleErrorHandler';

/**
 * Crea una nueva reserva
 */
export async function createBookingService(bookingData: {
  ownerId: number;
  walkerId: number;
  petIds: number[];
  date: string;
  startTime: string;
  duration: number;
  location?: string;
  notes?: string;
  pricePerPet: number;
}) {
  try {
    console.log('🔍 Backend recibió fecha:', bookingData.date);
    console.log('📦 Datos completos de reserva:', bookingData);
    
    // Calcular precio total
    const totalPrice = bookingData.pricePerPet * bookingData.petIds.length;

    const [newBooking] = await db
      .insert(bookingsTable)
      .values({
        ownerId: bookingData.ownerId,
        walkerId: bookingData.walkerId,
        petIds: bookingData.petIds,
        date: bookingData.date,
        startTime: bookingData.startTime,
        duration: bookingData.duration,
        location: bookingData.location,
        notes: bookingData.notes,
        pricePerPet: bookingData.pricePerPet.toString(),
        totalPrice: totalPrice.toString(),
        status: 'pending',
      })
      .execute();

    return newBooking;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtiene una reserva por ID con información completa
 */
export async function getBookingByIdService(bookingId: number) {
  try {
    const booking = await db
      .select({
        // Booking info
        id: bookingsTable.id,
        petIds: bookingsTable.petIds,
        date: bookingsTable.date,
        startTime: bookingsTable.startTime,
        duration: bookingsTable.duration,
        location: bookingsTable.location,
        notes: bookingsTable.notes,
        pricePerPet: bookingsTable.pricePerPet,
        totalPrice: bookingsTable.totalPrice,
        status: bookingsTable.status,
        rejectionReason: bookingsTable.rejectionReason,
        cancellationReason: bookingsTable.cancellationReason,
        createdAt: bookingsTable.createdAt,
        updatedAt: bookingsTable.updatedAt,
        acceptedAt: bookingsTable.acceptedAt,
        completedAt: bookingsTable.completedAt,
        cancelledAt: bookingsTable.cancelledAt,
        
        // Owner info
        owner: {
          id: ownersTable.id,
          userId: ownersTable.userId,
          name: ownersTable.name,
          lastname: ownersTable.lastname,
          location: ownersTable.location,
          profileImage: ownersTable.profileImage,
        },
        
        // Walker info
        walker: {
          id: walkersTable.id,
          userId: walkersTable.userId,
          name: walkersTable.name,
          lastname: walkersTable.lastname,
          location: walkersTable.location,
          profileImage: walkersTable.profileImage,
          rating: walkersTable.rating,
          experience: walkersTable.experience,
          price: walkersTable.price,
        },
      })
      .from(bookingsTable)
      .innerJoin(ownersTable, eq(bookingsTable.ownerId, ownersTable.id))
      .innerJoin(walkersTable, eq(bookingsTable.walkerId, walkersTable.id))
      .where(eq(bookingsTable.id, bookingId))
      .execute();

    return booking[0];
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtiene todas las reservas de un owner
 */
export async function getOwnerBookingsService(ownerId: number) {
  try {
    const bookings = await db
      .select({
        id: bookingsTable.id,
        petIds: bookingsTable.petIds,
        date: bookingsTable.date,
        startTime: bookingsTable.startTime,
        duration: bookingsTable.duration,
        location: bookingsTable.location,
        totalPrice: bookingsTable.totalPrice,
        status: bookingsTable.status,
        createdAt: bookingsTable.createdAt,
        
        walker: {
          id: walkersTable.id,
          name: walkersTable.name,
          lastname: walkersTable.lastname,
          profileImage: walkersTable.profileImage,
          rating: walkersTable.rating,
        },
      })
      .from(bookingsTable)
      .innerJoin(walkersTable, eq(bookingsTable.walkerId, walkersTable.id))
      .where(eq(bookingsTable.ownerId, ownerId))
      .orderBy(desc(bookingsTable.createdAt))
      .execute();

    return bookings;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Obtiene todas las reservas de un walker
 */
export async function getWalkerBookingsService(walkerId: number) {
  try {
    const bookings = await db
      .select({
        id: bookingsTable.id,
        petIds: bookingsTable.petIds,
        date: bookingsTable.date,
        startTime: bookingsTable.startTime,
        duration: bookingsTable.duration,
        location: bookingsTable.location,
        totalPrice: bookingsTable.totalPrice,
        status: bookingsTable.status,
        notes: bookingsTable.notes,
        createdAt: bookingsTable.createdAt,
        
        owner: {
          id: ownersTable.id,
          name: ownersTable.name,
          lastname: ownersTable.lastname,
          profileImage: ownersTable.profileImage,
          location: ownersTable.location,
        },
      })
      .from(bookingsTable)
      .innerJoin(ownersTable, eq(bookingsTable.ownerId, ownersTable.id))
      .where(eq(bookingsTable.walkerId, walkerId))
      .orderBy(desc(bookingsTable.createdAt))
      .execute();

    return bookings;
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Walker acepta una reserva
 */
export async function acceptBookingService(bookingId: number, walkerId: number) {
  try {
    // Verificar que la reserva pertenece al walker
    const booking = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.id, bookingId),
          eq(bookingsTable.walkerId, walkerId)
        )
      )
      .execute();

    if (!booking || booking.length === 0) {
      throw new Error('Reserva no encontrada o no autorizada');
    }

    if (booking[0].status !== 'pending') {
      throw new Error('La reserva no está en estado pendiente');
    }

    await db
      .update(bookingsTable)
      .set({
        status: 'accepted',
        acceptedAt: new Date(),
      })
      .where(eq(bookingsTable.id, bookingId))
      .execute();

    return { message: 'Reserva aceptada exitosamente' };
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Walker rechaza una reserva
 */
export async function rejectBookingService(
  bookingId: number,
  walkerId: number,
  reason?: string
) {
  try {
    // Verificar que la reserva pertenece al walker
    const booking = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.id, bookingId),
          eq(bookingsTable.walkerId, walkerId)
        )
      )
      .execute();

    if (!booking || booking.length === 0) {
      throw new Error('Reserva no encontrada o no autorizada');
    }

    if (booking[0].status !== 'pending') {
      throw new Error('La reserva no está en estado pendiente');
    }

    await db
      .update(bookingsTable)
      .set({
        status: 'rejected',
        rejectionReason: reason,
      })
      .where(eq(bookingsTable.id, bookingId))
      .execute();

    return { message: 'Reserva rechazada' };
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Cancela una reserva (owner o walker)
 */
export async function cancelBookingService(
  bookingId: number,
  userId: number,
  role: 'owner' | 'walker',
  reason?: string
) {
  try {
    // Verificar que la reserva pertenece al usuario
    const booking = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .execute();

    if (!booking || booking.length === 0) {
      throw new Error('Reserva no encontrada');
    }

    // Verificar autorización según rol
    if (role === 'owner' && booking[0].ownerId !== userId) {
      throw new Error('No autorizado para cancelar esta reserva');
    }
    if (role === 'walker' && booking[0].walkerId !== userId) {
      throw new Error('No autorizado para cancelar esta reserva');
    }

    if (booking[0].status === 'completed' || booking[0].status === 'cancelled') {
      throw new Error('No se puede cancelar una reserva completada o ya cancelada');
    }

    await db
      .update(bookingsTable)
      .set({
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
      })
      .where(eq(bookingsTable.id, bookingId))
      .execute();

    return { message: 'Reserva cancelada exitosamente' };
  } catch (error) {
    handleDrizzleError(error);
  }
}

/**
 * Marca una reserva como completada
 */
export async function completeBookingService(bookingId: number, walkerId: number) {
  try {
    // Verificar que la reserva pertenece al walker
    const booking = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.id, bookingId),
          eq(bookingsTable.walkerId, walkerId)
        )
      )
      .execute();

    if (!booking || booking.length === 0) {
      throw new Error('Reserva no encontrada o no autorizada');
    }

    if (booking[0].status !== 'accepted') {
      throw new Error('Solo se pueden completar reservas aceptadas');
    }

    await db
      .update(bookingsTable)
      .set({
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(bookingsTable.id, bookingId))
      .execute();

    return { message: 'Reserva marcada como completada' };
  } catch (error) {
    handleDrizzleError(error);
  }
}
