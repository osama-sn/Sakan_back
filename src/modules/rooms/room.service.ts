import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { storageService } from "../uploads/storage.service";
import {
  CreateRoomInput,
  UpdateRoomInput,
  QueryPropertyRoomsInput
} from "./room.validation";

export class RoomService {
  async createRoom(ownerId: string, propertyId: string, input: CreateRoomInput) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.PROPERTY_ACCESS_DENIED, 403);
    }

    const { amenityIds, ...roomData } = input;

    if (amenityIds && amenityIds.length > 0) {
      const count = await prisma.amenity.count({
        where: { id: { in: amenityIds }, isActive: true }
      });
      if (count !== amenityIds.length) {
        throw new AppError(ERROR_CODES.AMENITY_NOT_FOUND, 400);
      }
    }

    const room = await prisma.room.create({
      data: {
        ...roomData,
        propertyId,
        occupiedBeds: 0,
        isActive: true,
        ...(amenityIds && amenityIds.length > 0 && {
          amenities: {
            create: amenityIds.map((amenityId) => ({ amenityId }))
          }
        })
      },
      include: {
        amenities: {
          include: { amenity: true }
        },
        images: true
      }
    });

    return room;
  }

  async updateRoom(ownerId: string, roomId: string, input: UpdateRoomInput) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room || !room.isActive) {
      throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
    }

    if (room.property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.ROOM_ACCESS_DENIED, 403);
    }

    // Critical rule: capacity cannot be reduced below currently occupied beds
    if (input.capacity !== undefined && input.capacity < room.occupiedBeds) {
      throw new AppError(ERROR_CODES.ROOM_INVALID_CAPACITY, 400);
    }

    const { amenityIds, ...roomData } = input;

    if (amenityIds !== undefined) {
      if (amenityIds.length > 0) {
        const count = await prisma.amenity.count({
          where: { id: { in: amenityIds }, isActive: true }
        });
        if (count !== amenityIds.length) {
          throw new AppError(ERROR_CODES.AMENITY_NOT_FOUND, 400);
        }
      }

      await prisma.roomAmenity.deleteMany({
        where: { roomId }
      });
    }

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...roomData,
        ...(amenityIds !== undefined && {
          amenities: {
            create: amenityIds.map((amenityId) => ({ amenityId }))
          }
        })
      },
      include: {
        amenities: {
          include: { amenity: true }
        },
        images: true
      }
    });

    return updated;
  }

  async deactivateRoom(ownerId: string, roomId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room || !room.isActive) {
      throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
    }

    if (room.property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.ROOM_ACCESS_DENIED, 403);
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { isActive: false }
    });

    return true;
  }

  async getPropertyRooms(propertyId: string, query: QueryPropertyRoomsInput) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    const where: Prisma.RoomWhereInput = {
      propertyId,
      isActive: true
    };

    if (query.minPrice || query.maxPrice) {
      where.monthlyPrice = {
        ...(query.minPrice && { gte: parseFloat(query.minPrice) }),
        ...(query.maxPrice && { lte: parseFloat(query.maxPrice) })
      };
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: "asc" }
        },
        amenities: {
          include: { amenity: true }
        }
      }
    });

    const filtered = query.availableOnly === "true"
      ? rooms.filter((r) => r.capacity > r.occupiedBeds)
      : rooms;

    return filtered.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      occupiedBeds: room.occupiedBeds,
      availableBeds: room.capacity - room.occupiedBeds,
      monthlyPrice: room.monthlyPrice,
      images: room.images.map((img) => ({ id: img.id, url: img.url, sortOrder: img.sortOrder })),
      amenities: room.amenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
        icon: ra.amenity.icon
      }))
    }));
  }

  async getRoomDetails(roomId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        images: {
          orderBy: { sortOrder: "asc" }
        },
        amenities: {
          include: { amenity: true }
        },
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            area: true,
            address: true,
            genderPolicy: true
          }
        }
      }
    });

    if (!room || !room.isActive) {
      throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
    }

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      capacity: room.capacity,
      occupiedBeds: room.occupiedBeds,
      availableBeds: room.capacity - room.occupiedBeds,
      monthlyPrice: room.monthlyPrice,
      images: room.images.map((img) => ({ id: img.id, url: img.url, sortOrder: img.sortOrder })),
      amenities: room.amenities.map((ra) => ({
        id: ra.amenity.id,
        name: ra.amenity.name,
        icon: ra.amenity.icon
      })),
      property: room.property
    };
  }

  async uploadImages(ownerId: string, roomId: string, files: Express.Multer.File[]) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room || !room.isActive) {
      throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
    }

    if (room.property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.ROOM_ACCESS_DENIED, 403);
    }

    const existingImagesCount = await prisma.roomImage.count({
      where: { roomId }
    });

    const uploadedRecords = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const uploadRes = await storageService.upload(file, `rooms/${roomId}`);

      const record = await prisma.roomImage.create({
        data: {
          roomId,
          url: uploadRes.url,
          publicId: uploadRes.publicId || null,
          sortOrder: existingImagesCount + i
        }
      });
      uploadedRecords.push(record);
    }

    return uploadedRecords;
  }

  async deleteImage(ownerId: string, roomId: string, imageId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { property: true }
    });

    if (!room || !room.isActive) {
      throw new AppError(ERROR_CODES.ROOM_NOT_FOUND, 404);
    }

    if (room.property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.ROOM_ACCESS_DENIED, 403);
    }

    const image = await prisma.roomImage.findFirst({
      where: { id: imageId, roomId }
    });

    if (!image) {
      throw new AppError(ERROR_CODES.ROOM_IMAGE_NOT_FOUND, 404);
    }

    if (image.publicId) {
      await storageService.delete(image.publicId);
    }

    await prisma.roomImage.delete({
      where: { id: imageId }
    });

    return true;
  }
}

export const roomService = new RoomService();
