import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { getPaginationParams, buildPaginationMeta, PaginationQuery } from "../../common/utils/pagination";

export class FavoriteService {
  async addFavorite(userId: string, propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property || !property.isActive) {
      throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
    }

    // Idempotent: check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    });

    if (existing) {
      return existing;
    }

    return prisma.favorite.create({
      data: {
        userId,
        propertyId
      }
    });
  }

  async removeFavorite(userId: string, propertyId: string) {
    try {
      await prisma.favorite.delete({
        where: {
          userId_propertyId: {
            userId,
            propertyId
          }
        }
      });
    } catch {
      // Idempotent if already deleted
    }

    return true;
  }

  async getFavorites(userId: string, query: PaginationQuery) {
    const pagination = getPaginationParams(query);

    const where = {
      userId,
      property: {
        isActive: true
      }
    };

    const [totalItems, favorites] = await Promise.all([
      prisma.favorite.count({ where }),
      prisma.favorite.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
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
              }
            }
          }
        }
      })
    ]);

    const items = favorites.map((fav) => {
      const prop = fav.property;
      const availableRoomsCount = prop.rooms.filter((r) => r.capacity > r.occupiedBeds).length;
      const prices = prop.rooms.map((r) => r.monthlyPrice);
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;

      return {
        id: prop.id,
        title: prop.title,
        thumbnail: prop.images[0]?.url || "",
        city: prop.city,
        area: prop.area,
        propertyType: prop.propertyType,
        genderPolicy: prop.genderPolicy,
        startingPrice,
        currency: "EGP",
        availableRooms: availableRoomsCount,
        isFavorite: true
      };
    });

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }
}

export const favoriteService = new FavoriteService();
