import { prisma } from "../../config/prisma";

export class AmenityService {
  async getAllAmenities() {
    return prisma.amenity.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        icon: true,
        category: true
      }
    });
  }
}

export const amenityService = new AmenityService();
