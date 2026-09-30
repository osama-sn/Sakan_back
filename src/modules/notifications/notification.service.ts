import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { getPaginationParams, buildPaginationMeta, PaginationQuery } from "../../common/utils/pagination";

export class NotificationService {
  async getNotifications(userId: string, query: PaginationQuery) {
    const pagination = getPaginationParams(query);

    const where = { userId };

    const [totalItems, items] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" }
      })
    ]);

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }

  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    return { count };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification || notification.userId !== userId) {
      throw new AppError(ERROR_CODES.NOTIFICATION_NOT_FOUND, 404);
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    return updated;
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return true;
  }
}

export const notificationService = new NotificationService();
