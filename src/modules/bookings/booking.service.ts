import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { getPaginationParams, buildPaginationMeta } from "../../common/utils/pagination";
import {
  CreateBookingInput,
  QueryBookingsInput
} from "./booking.validation";

export class BookingService {
  async createBooking(studentId: string, input: CreateBookingInput) {
    const { propertyId, roomId, message } = input;

    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    // Student cannot book their own property
    if (property.ownerId === studentId) {
      throw new AppError(ERROR_CODES.BOOKING_CANNOT_REQUEST_OWN_PROPERTY, 400);
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room || !room.isActive) {
      throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
    }

    // Room must belong to property
    if (room.propertyId !== propertyId) {
      throw new AppError(ERROR_CODES.BOOKING_ROOM_NOT_IN_PROPERTY, 400);
    }

    // Room capacity check
    if (room.occupiedBeds >= room.capacity) {
      throw new AppError(ERROR_CODES.ROOM_FULL, 400);
    }

    // Duplicate booking check: PENDING or APPROVED for same room
    const existing = await prisma.bookingRequest.findFirst({
      where: {
        studentId,
        roomId,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] }
      }
    });

    if (existing) {
      throw new AppError(ERROR_CODES.BOOKING_ALREADY_EXISTS, 400);
    }

    const booking = await prisma.bookingRequest.create({
      data: {
        studentId,
        propertyId,
        roomId,
        message: message || null,
        status: BookingStatus.PENDING
      },
      include: {
        property: {
          select: { id: true, title: true, city: true, area: true }
        },
        room: {
          select: { id: true, name: true, monthlyPrice: true }
        },
        student: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        }
      }
    });

    // Create notification for property owner
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        title: "طلب حجز جديد / New Booking Request",
        body: `تلقيت طلب حجز جديد لسكن ${property.title} - غرفة ${room.name}`,
        type: "NEW_BOOKING_REQUEST",
        metadata: {
          bookingId: booking.id,
          propertyId,
          roomId,
          studentId
        }
      }
    });

    return booking;
  }

  async getMyBookings(studentId: string, query: QueryBookingsInput) {
    const pagination = getPaginationParams(query);

    const where: Prisma.BookingRequestWhereInput = {
      studentId
    };

    if (query.status) {
      where.status = query.status;
    }

    const [totalItems, bookings] = await Promise.all([
      prisma.bookingRequest.count({ where }),
      prisma.bookingRequest.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              area: true,
              address: true,
              images: { take: 1, orderBy: { sortOrder: "asc" } }
            }
          },
          room: {
            select: {
              id: true,
              name: true,
              monthlyPrice: true,
              capacity: true,
              occupiedBeds: true
            }
          }
        }
      })
    ]);

    const items = bookings.map((b) => ({
      id: b.id,
      status: b.status,
      message: b.message,
      rejectionReason: b.rejectionReason,
      reviewedAt: b.reviewedAt,
      createdAt: b.createdAt,
      property: {
        id: b.property.id,
        title: b.property.title,
        city: b.property.city,
        area: b.property.area,
        address: b.property.address,
        thumbnail: b.property.images[0]?.url || ""
      },
      room: {
        id: b.room.id,
        name: b.room.name,
        monthlyPrice: b.room.monthlyPrice,
        availableBeds: b.room.capacity - b.room.occupiedBeds
      }
    }));

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }

  async approveBooking(ownerId: string, bookingId: string) {
    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        room: true
      }
    });

    if (!booking) {
      throw new AppError(ERROR_CODES.BOOKING_NOT_FOUND, 404);
    }

    if (booking.property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.BOOKING_ACCESS_DENIED, 403);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError(ERROR_CODES.BOOKING_INVALID_STATUS, 400);
    }

    // Atomic transaction for capacity validation and update
    const result = await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: booking.roomId }
      });

      if (!room || !room.isActive) {
        throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
      }

      if (room.occupiedBeds >= room.capacity) {
        throw new AppError(ERROR_CODES.ROOM_FULL, 400);
      }

      const updatedBooking = await tx.bookingRequest.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.APPROVED,
          reviewedById: ownerId,
          reviewedAt: new Date()
        }
      });

      await tx.room.update({
        where: { id: booking.roomId },
        data: {
          occupiedBeds: { increment: 1 }
        }
      });

      await tx.notification.create({
        data: {
          userId: booking.studentId,
          title: "تمت الموافقة على طلب السكن / Booking Request Approved",
          body: `تهانينا! تمت الموافقة على طلب حجز الغرفة ${room.name} في ${booking.property.title}`,
          type: "BOOKING_APPROVED",
          metadata: {
            bookingId: booking.id,
            propertyId: booking.propertyId,
            roomId: booking.roomId
          }
        }
      });

      return updatedBooking;
    });

    return result;
  }

  async rejectBooking(ownerId: string, bookingId: string, reason: string) {
    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        room: true
      }
    });

    if (!booking) {
      throw new AppError(ERROR_CODES.BOOKING_NOT_FOUND, 404);
    }

    if (booking.property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.BOOKING_ACCESS_DENIED, 403);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError(ERROR_CODES.BOOKING_INVALID_STATUS, 400);
    }

    const updatedBooking = await prisma.bookingRequest.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.REJECTED,
        rejectionReason: reason,
        reviewedById: ownerId,
        reviewedAt: new Date()
      }
    });

    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        title: "تم رفض طلب السكن / Booking Request Rejected",
        body: `عذراً، تم رفض طلب الحجز للغرفة ${booking.room.name}. السبب: ${reason}`,
        type: "BOOKING_REJECTED",
        metadata: {
          bookingId: booking.id,
          propertyId: booking.propertyId,
          roomId: booking.roomId,
          reason
        }
      }
    });

    return updatedBooking;
  }

  async cancelBooking(studentId: string, bookingId: string) {
    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        room: true
      }
    });

    if (!booking) {
      throw new AppError(ERROR_CODES.BOOKING_NOT_FOUND, 404);
    }

    if (booking.studentId !== studentId) {
      throw new AppError(ERROR_CODES.BOOKING_ACCESS_DENIED, 403);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError(ERROR_CODES.BOOKING_INVALID_STATUS, 400);
    }

    const updatedBooking = await prisma.bookingRequest.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED
      }
    });

    // Notify owner about student cancellation
    await prisma.notification.create({
      data: {
        userId: booking.property.ownerId,
        title: "تم إلغاء طلب السكن / Booking Request Cancelled",
        body: `قام الطالب بإلغاء طلب الحجز للغرفة ${booking.room.name}`,
        type: "BOOKING_CANCELLED",
        metadata: {
          bookingId: booking.id,
          propertyId: booking.propertyId,
          roomId: booking.roomId,
          studentId
        }
      }
    });

    return updatedBooking;
  }
}

export const bookingService = new BookingService();
