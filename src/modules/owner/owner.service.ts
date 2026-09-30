import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { getPaginationParams, buildPaginationMeta } from "../../common/utils/pagination";

export interface OwnerBookingsQuery {
  propertyId?: string;
  roomId?: string;
  status?: BookingStatus;
  page?: string;
  limit?: string;
}

export class OwnerService {
  async getDashboardStats(ownerId: string) {
    const [
      totalProperties,
      activeProperties,
      rooms,
      pendingRequests,
      approvedRequests,
      ownerProperties
    ] = await Promise.all([
      prisma.property.count({
        where: { ownerId }
      }),
      prisma.property.count({
        where: { ownerId, isActive: true }
      }),
      prisma.room.findMany({
        where: {
          property: { ownerId },
          isActive: true
        },
        select: {
          capacity: true,
          occupiedBeds: true
        }
      }),
      prisma.bookingRequest.count({
        where: {
          property: { ownerId },
          status: BookingStatus.PENDING
        }
      }),
      prisma.bookingRequest.count({
        where: {
          property: { ownerId },
          status: BookingStatus.APPROVED
        }
      }),
      prisma.property.findMany({
        where: { ownerId },
        select: {
          viewsCount: true,
          _count: { select: { favorites: true } }
        }
      })
    ]);

    const totalRooms = rooms.length;
    let totalCapacity = 0;
    let totalOccupiedBeds = 0;

    for (const r of rooms) {
      totalCapacity += r.capacity;
      totalOccupiedBeds += r.occupiedBeds;
    }

    const availableBeds = Math.max(0, totalCapacity - totalOccupiedBeds);
    const totalViews = ownerProperties.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
    const totalFavorites = ownerProperties.reduce((acc, p) => acc + ((p as any)._count?.favorites || 0), 0);

    return {
      totalProperties,
      activeProperties,
      totalRooms,
      availableBeds,
      occupiedBeds: totalOccupiedBeds,
      pendingRequests,
      approvedRequests,
      totalViews,
      totalFavorites
    };
  }

  async getOwnerProperties(ownerId: string) {
    const properties = await prisma.property.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1
        },
        rooms: {
          where: { isActive: true },
          select: {
            id: true,
            capacity: true,
            occupiedBeds: true,
            monthlyPrice: true
          }
        },
        bookingRequests: {
          where: { status: BookingStatus.PENDING },
          select: { id: true }
        },
        _count: {
          select: { favorites: true }
        }
      }
    });

    return properties.map((prop) => {
      let totalCapacity = 0;
      let totalOccupied = 0;

      for (const r of prop.rooms) {
        totalCapacity += r.capacity;
        totalOccupied += r.occupiedBeds;
      }

      return {
        id: prop.id,
        title: prop.title,
        description: prop.description,
        propertyType: prop.propertyType,
        genderPolicy: prop.genderPolicy,
        city: prop.city,
        area: prop.area,
        address: prop.address,
        isActive: prop.isActive,
        createdAt: prop.createdAt,
        thumbnail: prop.images[0]?.url || "",
        totalRooms: prop.rooms.length,
        availableBeds: Math.max(0, totalCapacity - totalOccupied),
        occupiedBeds: totalOccupied,
        pendingBookingRequests: prop.bookingRequests.length,
        viewsCount: prop.viewsCount ?? 0,
        favoritesCount: (prop as any)._count?.favorites ?? 0
      };
    });
  }

  async getOwnerBookingRequests(ownerId: string, query: OwnerBookingsQuery) {
    const pagination = getPaginationParams(query);

    const where: Prisma.BookingRequestWhereInput = {
      property: { ownerId }
    };

    if (query.propertyId) {
      where.propertyId = query.propertyId;
    }

    if (query.roomId) {
      where.roomId = query.roomId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [totalItems, requests] = await Promise.all([
      prisma.bookingRequest.count({ where }),
      prisma.bookingRequest.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileImage: true
            }
          },
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              area: true
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

    const items = requests.map((req) => ({
      id: req.id,
      status: req.status,
      message: req.message,
      rejectionReason: req.rejectionReason,
      reviewedAt: req.reviewedAt,
      createdAt: req.createdAt,
      student: {
        id: req.student.id,
        name: `${req.student.firstName} ${req.student.lastName}`,
        email: req.student.email,
        phone: req.student.phone,
        profileImage: req.student.profileImage
      },
      property: req.property,
      room: {
        id: req.room.id,
        name: req.room.name,
        monthlyPrice: req.room.monthlyPrice,
        availableBeds: req.room.capacity - req.room.occupiedBeds
      }
    }));

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }
}

export const ownerService = new OwnerService();
