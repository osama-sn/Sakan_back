import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { getPaginationParams, buildPaginationMeta } from "../../common/utils/pagination";
import { storageService } from "../uploads/storage.service";
import {
  CreatePropertyInput,
  UpdatePropertyInput,
  QueryPropertiesInput,
  ReorderImagesInput
} from "./property.validation";

export class PropertyService {
  async createProperty(ownerId: string, input: CreatePropertyInput) {
    const { amenityIds, ...propertyData } = input;

    // Validate amenity IDs if provided
    if (amenityIds && amenityIds.length > 0) {
      const count = await prisma.amenity.count({
        where: { id: { in: amenityIds }, isActive: true }
      });
      if (count !== amenityIds.length) {
        throw new AppError(ERROR_CODES.AMENITY_NOT_FOUND, 400);
      }
    }

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        ownerId,
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

    return property;
  }

  async updateProperty(ownerId: string, propertyId: string, input: UpdatePropertyInput) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.PROPERTY_ACCESS_DENIED, 403);
    }

    const { amenityIds, ...propertyData } = input;

    // Validate amenities if updating them
    if (amenityIds !== undefined) {
      if (amenityIds.length > 0) {
        const count = await prisma.amenity.count({
          where: { id: { in: amenityIds }, isActive: true }
        });
        if (count !== amenityIds.length) {
          throw new AppError(ERROR_CODES.AMENITY_NOT_FOUND, 400);
        }
      }

      // Delete existing amenities and recreate
      await prisma.propertyAmenity.deleteMany({
        where: { propertyId }
      });
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...propertyData,
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
        images: {
          orderBy: { sortOrder: "asc" }
        }
      }
    });

    return updated;
  }

  async deleteProperty(ownerId: string, propertyId: string, permanent: boolean = false) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.PROPERTY_ACCESS_DENIED, 403);
    }

    if (permanent) {
      // 1. Delete associated property images from cloud/local storage
      const images = await prisma.propertyImage.findMany({ where: { propertyId } });
      for (const img of images) {
        if (img.publicId) {
          await storageService.delete(img.publicId).catch(() => {});
        }
      }

      // 2. Delete room images from cloud/local storage
      const rooms = await prisma.room.findMany({ where: { propertyId } });
      for (const room of rooms) {
        const rImages = await prisma.roomImage.findMany({ where: { roomId: room.id } });
        for (const rImg of rImages) {
          if (rImg.publicId) {
            await storageService.delete(rImg.publicId).catch(() => {});
          }
        }
      }

      // 3. Delete property record from DB (Cascades rooms, images, amenities, favorites, etc.)
      await prisma.property.delete({
        where: { id: propertyId }
      });

      return { permanent: true };
    } else {
      // Soft delete: Deactivate property and all its rooms
      await prisma.$transaction([
        prisma.property.update({
          where: { id: propertyId },
          data: { isActive: false }
        }),
        prisma.room.updateMany({
          where: { propertyId },
          data: { isActive: false }
        })
      ]);

      return { permanent: false };
    }
  }

  async deactivateProperty(ownerId: string, propertyId: string) {
    return this.deleteProperty(ownerId, propertyId, false);
  }

  async getProperties(query: QueryPropertiesInput, currentUserId?: string) {
    const pagination = getPaginationParams(query);

    const andConditions: Prisma.PropertyWhereInput[] = [
      { isActive: true }
    ];

    // 1. Gender Policy Protection:
    // When a student is logged in, their gender is strictly enforced!
    // Male students NEVER see female housing, and female students NEVER see male housing!
    let studentGender: string | null = null;
    if (currentUserId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { gender: true, role: true }
      });
      if (currentUser?.role === "STUDENT" && currentUser.gender) {
        studentGender = currentUser.gender.toUpperCase();
      }
    }

    if (studentGender === "MALE") {
      andConditions.push({
        genderPolicy: { in: ["MALE", "MIXED"] }
      });
    } else if (studentGender === "FEMALE") {
      andConditions.push({
        genderPolicy: { in: ["FEMALE", "MIXED"] }
      });
    } else if (query.genderPolicy) {
      andConditions.push({
        genderPolicy: query.genderPolicy
      });
    }

    // 2. Governorate / City Filtering:
    const cityOrGov = (query.governorate || query.city || "").trim();
    if (cityOrGov) {
      andConditions.push({
        OR: [
          { city: { contains: cityOrGov, mode: "insensitive" } },
          { area: { contains: cityOrGov, mode: "insensitive" } },
          { address: { contains: cityOrGov, mode: "insensitive" } }
        ]
      });
    }

    if (query.area) {
      andConditions.push({
        area: { contains: query.area.trim(), mode: "insensitive" }
      });
    }

    // 3. University Filtering:
    if (query.university) {
      const uni = query.university.trim();
      andConditions.push({
        OR: [
          { distanceFromUniversity: { contains: uni, mode: "insensitive" } },
          { title: { contains: uni, mode: "insensitive" } },
          { description: { contains: uni, mode: "insensitive" } },
          { address: { contains: uni, mode: "insensitive" } },
          { area: { contains: uni, mode: "insensitive" } }
        ]
      });
    }

    // 4. Faculty Filtering:
    if (query.faculty) {
      const fac = query.faculty.trim();
      andConditions.push({
        OR: [
          { distanceFromUniversity: { contains: fac, mode: "insensitive" } },
          { title: { contains: fac, mode: "insensitive" } },
          { description: { contains: fac, mode: "insensitive" } }
        ]
      });
    }

    if (query.propertyType) {
      andConditions.push({ propertyType: query.propertyType });
    }

    if (query.search) {
      const search = query.search.trim();
      andConditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { area: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { distanceFromUniversity: { contains: search, mode: "insensitive" } }
        ]
      });
    }

    // Room price filtering
    const minPrice = query.minPrice ? parseFloat(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : undefined;

    if (minPrice !== undefined || maxPrice !== undefined) {
      andConditions.push({
        rooms: {
          some: {
            isActive: true,
            monthlyPrice: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice })
            }
          }
        }
      });
    }

    // Amenities filtering
    if (query.amenities) {
      const amenityNames = query.amenities.split(",").map((a) => a.trim());
      andConditions.push({
        amenities: {
          some: {
            amenity: {
              name: { in: amenityNames, mode: "insensitive" }
            }
          }
        }
      });
    }

    const where: Prisma.PropertyWhereInput = {
      AND: andConditions
    };

    // Sorting
    const orderBy: Prisma.PropertyOrderByWithRelationInput = {};
    if (query.sortBy === "title") {
      orderBy.title = query.sortOrder === "desc" ? "desc" : "asc";
    } else if (query.sortBy === "rating") {
      orderBy.rating = query.sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.createdAt = query.sortOrder === "asc" ? "asc" : "desc";
    }

    const [totalItems, properties] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1
          },
          amenities: {
            include: { amenity: true },
            take: 5
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
          ...(currentUserId && {
            favorites: {
              where: { userId: currentUserId }
            }
          }),
          _count: {
            select: {
              favorites: true
            }
          }
        }
      })
    ]);

    const items = properties.map((prop) => {
      const availableRoomsCount = prop.rooms.filter((r) => r.capacity > r.occupiedBeds).length;
      const prices = prop.rooms.map((r) => r.monthlyPrice);
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const isFavorite = currentUserId ? (prop.favorites && prop.favorites.length > 0) : false;
      const currentOccupants = prop.rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
      const amenityNames = prop.amenities ? prop.amenities.map((a: any) => a.amenity.name) : [];
      const favoritesCount = (prop as any)._count?.favorites ?? 0;

      return {
        id: prop.id,
        title: prop.title,
        thumbnail: prop.images[0]?.url || "",
        city: prop.city,
        area: prop.area,
        address: prop.address,
        propertyType: prop.propertyType,
        genderPolicy: prop.genderPolicy,
        startingPrice,
        currency: "EGP",
        rating: prop.rating,
        reviewsCount: prop.reviewsCount,
        viewsCount: prop.viewsCount ?? 0,
        favoritesCount,
        isVerified: prop.isVerified,
        distanceFromUniversity: prop.distanceFromUniversity || null,
        availableRooms: availableRoomsCount,
        currentOccupants,
        amenities: amenityNames,
        isFavorite
      };
    });

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }

  async recordPropertyView(propertyId: string, userId?: string, viewerIp?: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    // Check if view was already recorded for this user or IP
    let existingView = null;
    if (userId) {
      existingView = await prisma.propertyView.findFirst({
        where: { propertyId, userId }
      });
    } else if (viewerIp) {
      existingView = await prisma.propertyView.findFirst({
        where: { propertyId, viewerIp }
      });
    }

    let isNewView = false;
    let viewsCount = property.viewsCount ?? 0;

    if (!existingView) {
      try {
        await prisma.propertyView.create({
          data: {
            propertyId,
            userId: userId || null,
            viewerIp: viewerIp || null
          }
        });

        const updated = await prisma.property.update({
          where: { id: propertyId },
          data: { viewsCount: { increment: 1 } },
          select: { viewsCount: true }
        });

        viewsCount = updated.viewsCount;
        isNewView = true;
      } catch (error) {
        // In case of race condition duplicate insert
        viewsCount = property.viewsCount ?? 0;
      }
    }

    return {
      propertyId,
      viewsCount,
      isNewView
    };
  }

  async getPropertyDetails(propertyId: string, currentUserId?: string, viewerIp?: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: {
          orderBy: { sortOrder: "asc" }
        },
        amenities: {
          include: {
            amenity: true
          }
        },
        rooms: {
          where: { isActive: true },
          include: {
            images: {
              orderBy: { sortOrder: "asc" }
            },
            amenities: {
              include: {
                amenity: true
              }
            }
          }
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        ...(currentUserId && {
          favorites: {
            where: { userId: currentUserId }
          }
        }),
        _count: {
          select: {
            favorites: true
          }
        }
      }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    // Record unique view in background
    this.recordPropertyView(propertyId, currentUserId, viewerIp).catch((err) =>
      console.error("Error recording unique property view:", err)
    );

    const viewsCount = property.viewsCount ?? 0;
    const favoritesCount = (property as any)._count?.favorites ?? 0;

    // Fetch approved residents
    const approvedBookings = await prisma.bookingRequest.findMany({
      where: {
        propertyId,
        status: "APPROVED"
      },
      include: {
        student: true,
        room: { select: { name: true } }
      }
    });

    const currentResidents = approvedBookings.map((b) => ({
      id: b.student.id,
      fullName: b.student.fullName || `${b.student.firstName} ${b.student.lastName}`.trim(),
      profileImage: b.student.profileImage,
      university: b.student.university,
      faculty: b.student.faculty,
      major: b.student.major,
      academicYear: b.student.academicYear,
      roomName: b.room.name,
      interests: b.student.interests
        ? b.student.interests.split(/[,،]+/).map((t) => t.trim()).filter(Boolean)
        : []
    }));

    const isFavorite = currentUserId ? (property.favorites && property.favorites.length > 0) : false;
    const currentOccupants = property.rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);

    return {
      id: property.id,
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      genderPolicy: property.genderPolicy,
      rating: property.rating,
      reviewsCount: property.reviewsCount,
      viewsCount,
      favoritesCount,
      isVerified: property.isVerified,
      distanceFromUniversity: property.distanceFromUniversity || null,
      currentOccupants,
      images: property.images.map((img) => ({
        id: img.id,
        url: img.url,
        sortOrder: img.sortOrder
      })),
      location: {
        city: property.city,
        area: property.area,
        address: property.address,
        latitude: property.latitude,
        longitude: property.longitude
      },
      amenities: property.amenities.map((pa) => ({
        id: pa.amenity.id,
        name: pa.amenity.name,
        icon: pa.amenity.icon,
        category: pa.amenity.category
      })),
      owner: {
        id: property.owner.id,
        name: `${property.owner.firstName} ${property.owner.lastName}`,
        profileImage: property.owner.profileImage
      },
      rooms: property.rooms.map((room) => ({
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
      })),
      currentResidents,
      isFavorite
    };
  }

  async uploadImages(ownerId: string, propertyId: string, files: Express.Multer.File[]) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.PROPERTY_ACCESS_DENIED, 403);
    }

    const existingImagesCount = await prisma.propertyImage.count({
      where: { propertyId }
    });

    const uploadedRecords = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const uploadRes = await storageService.upload(file, `properties/${propertyId}`);

      const record = await prisma.propertyImage.create({
        data: {
          propertyId,
          url: uploadRes.url,
          publicId: uploadRes.publicId || null,
          sortOrder: existingImagesCount + i
        }
      });
      uploadedRecords.push(record);
    }

    return uploadedRecords;
  }

  async deleteImage(ownerId: string, propertyId: string, imageId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.PROPERTY_ACCESS_DENIED, 403);
    }

    const image = await prisma.propertyImage.findFirst({
      where: { id: imageId, propertyId }
    });

    if (!image) {
      throw new AppError(ERROR_CODES.PROPERTY_IMAGE_NOT_FOUND, 404);
    }

    if (image.publicId) {
      await storageService.delete(image.publicId);
    }

    await prisma.propertyImage.delete({
      where: { id: imageId }
    });

    return true;
  }

  async reorderImages(ownerId: string, propertyId: string, input: ReorderImagesInput) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    if (property.ownerId !== ownerId) {
      throw new AppError(ERROR_CODES.PROPERTY_ACCESS_DENIED, 403);
    }

    for (const item of input.images) {
      await prisma.propertyImage.updateMany({
        where: { id: item.id, propertyId },
        data: { sortOrder: item.sortOrder }
      });
    }

    return true;
  }
}

export const propertyService = new PropertyService();
