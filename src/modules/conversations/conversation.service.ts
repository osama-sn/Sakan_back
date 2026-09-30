import { prisma } from "../../config/prisma";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { getPaginationParams, buildPaginationMeta } from "../../common/utils/pagination";
import {
  StartConversationInput,
  SendMessageInput,
  QueryMessagesInput,
  QueryConversationsInput
} from "./conversation.validation";
import { ConversationType, NotificationType } from "@prisma/client";

const participantSelect = {
  id: true,
  fullName: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImage: true,
  role: true,
  gender: true,
  governorate: true,
  university: true,
  faculty: true,
  major: true,
  academicYear: true,
  housingStatus: true,
  bio: true
};

const propertySummarySelect = {
  id: true,
  title: true,
  propertyType: true,
  city: true,
  area: true,
  address: true,
  genderPolicy: true,
  images: {
    take: 1,
    orderBy: { sortOrder: "asc" as const },
    select: { url: true }
  }
};

export class ConversationService {
  /**
   * Start a new conversation or retrieve existing conversation between two users
   * Strictly enforces same-gender policy for student-to-student conversations
   */
  async startOrGetConversation(currentUserId: string, input: StartConversationInput) {
    const { targetUserId, propertyId } = input;

    if (currentUserId === targetUserId) {
      throw new AppError(ERROR_CODES.CANNOT_CHAT_WITH_SELF, 400);
    }

    // Fetch both users
    const [currentUser, targetUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: currentUserId } }),
      prisma.user.findUnique({ where: { id: targetUserId } })
    ]);

    if (!currentUser || !targetUser || !targetUser.isActive) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    // Determine Conversation Type
    let type: ConversationType;

    if (currentUser.role === "STUDENT" && targetUser.role === "STUDENT") {
      type = ConversationType.STUDENT_STUDENT;

      // STRICT GENDER POLICY: Student-to-student must be the same gender
      if (
        currentUser.gender &&
        targetUser.gender &&
        currentUser.gender.toUpperCase() !== targetUser.gender.toUpperCase()
      ) {
        throw new AppError(ERROR_CODES.GENDER_MISMATCH_NOT_ALLOWED, 403);
      }
    } else {
      type = ConversationType.STUDENT_OWNER;
    }

    // Check if a conversation already exists between these 2 users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [currentUserId, targetUserId]
        },
        ...(propertyId && { propertyId })
      },
      include: {
        participants: { select: participantSelect },
        property: { select: propertySummarySelect }
      }
    });

    if (existingConversation) {
      const otherParticipant = existingConversation.participants.find(
        (p) => p.id !== currentUserId
      );

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: existingConversation.id,
          senderId: { not: currentUserId },
          isRead: false
        }
      });

      return {
        ...existingConversation,
        recipient: otherParticipant || null,
        unreadCount
      };
    }

    // Validate property exists if provided
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId }
      });
      if (!property) {
        throw new AppError(ERROR_CODES.PROPERTY_NOT_FOUND, 404);
      }
    }

    // Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        participantIds: [currentUserId, targetUserId],
        type,
        propertyId: propertyId || null
      },
      include: {
        participants: { select: participantSelect },
        property: { select: propertySummarySelect }
      }
    });

    // Update conversationIds on both users
    await prisma.user.updateMany({
      where: { id: { in: [currentUserId, targetUserId] } },
      data: {
        conversationIds: {
          push: newConversation.id
        }
      }
    });

    const otherParticipant = newConversation.participants.find(
      (p) => p.id !== currentUserId
    );

    return {
      ...newConversation,
      recipient: otherParticipant || null,
      unreadCount: 0
    };
  }

  /**
   * Get all conversations for current user with unread counts and recipient profiles
   */
  async getConversations(currentUserId: string, query: QueryConversationsInput) {
    const pagination = getPaginationParams(query);

    const where: any = {
      participantIds: {
        has: currentUserId
      }
    };

    if (query.type) {
      where.type = query.type;
    }

    const [totalItems, conversations] = await Promise.all([
      prisma.conversation.count({ where }),
      prisma.conversation.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [
          { lastMessageAt: "desc" },
          { updatedAt: "desc" }
        ],
        include: {
          participants: { select: participantSelect },
          property: { select: propertySummarySelect }
        }
      })
    ]);

    // Calculate unread count for each conversation
    const items = await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipant = conv.participants.find(
          (p) => p.id !== currentUserId
        );

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: currentUserId },
            isRead: false
          }
        });

        return {
          id: conv.id,
          type: conv.type,
          propertyId: conv.propertyId,
          property: conv.property,
          lastMessageText: conv.lastMessageText,
          lastMessageAt: conv.lastMessageAt,
          lastMessageSenderId: conv.lastMessageSenderId,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          recipient: otherParticipant || null,
          unreadCount
        };
      })
    );

    return {
      items,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }

  /**
   * Get single conversation details by ID
   */
  async getConversationById(currentUserId: string, conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: { select: participantSelect },
        property: { select: propertySummarySelect }
      }
    });

    if (!conversation) {
      throw new AppError(ERROR_CODES.CONVERSATION_NOT_FOUND, 404);
    }

    if (!conversation.participantIds.includes(currentUserId)) {
      throw new AppError(ERROR_CODES.CONVERSATION_ACCESS_DENIED, 403);
    }

    const otherParticipant = conversation.participants.find(
      (p) => p.id !== currentUserId
    );

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: conversation.id,
        senderId: { not: currentUserId },
        isRead: false
      }
    });

    return {
      ...conversation,
      recipient: otherParticipant || null,
      unreadCount
    };
  }

  /**
   * Get messages of a conversation (paginated)
   */
  async getMessages(currentUserId: string, conversationId: string, query: QueryMessagesInput) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new AppError(ERROR_CODES.CONVERSATION_NOT_FOUND, 404);
    }

    if (!conversation.participantIds.includes(currentUserId)) {
      throw new AppError(ERROR_CODES.CONVERSATION_ACCESS_DENIED, 403);
    }

    const pagination = getPaginationParams(query);

    const where: any = {
      conversationId
    };

    if (query.before) {
      const beforeMessage = await prisma.message.findUnique({
        where: { id: query.before }
      });
      if (beforeMessage) {
        where.createdAt = { lt: beforeMessage.createdAt };
      }
    }

    const [totalItems, messages] = await Promise.all([
      prisma.message.count({ where: { conversationId } }),
      prisma.message.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              fullName: true,
              profileImage: true,
              role: true
            }
          }
        }
      })
    ]);

    // Return messages in chronological order for chat view
    const chronologicalMessages = [...messages].reverse();

    return {
      items: chronologicalMessages,
      pagination: buildPaginationMeta(totalItems, pagination.page, pagination.limit)
    };
  }

  /**
   * Send a new message in conversation
   */
  async sendMessage(currentUserId: string, conversationId: string, input: SendMessageInput) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new AppError(ERROR_CODES.CONVERSATION_NOT_FOUND, 404);
    }

    if (!conversation.participantIds.includes(currentUserId)) {
      throw new AppError(ERROR_CODES.CONVERSATION_ACCESS_DENIED, 403);
    }

    const recipientId = conversation.participantIds.find((id) => id !== currentUserId);

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUserId,
        text: input.text.trim(),
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fullName: true,
            profileImage: true,
            role: true
          }
        }
      }
    });

    // Update conversation last message preview
    const previewText = input.text.length > 100 ? input.text.substring(0, 97) + "..." : input.text;

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageText: previewText,
        lastMessageAt: message.createdAt,
        lastMessageSenderId: currentUserId,
        updatedAt: new Date()
      }
    });

    // Send in-app notification to recipient if exists
    if (recipientId) {
      const sender = message.sender;
      const senderName = sender.fullName || `${sender.firstName} ${sender.lastName}`.trim();
      const notifBody = input.text.length > 80 ? input.text.substring(0, 77) + "..." : input.text;

      await prisma.notification.create({
        data: {
          userId: recipientId,
          title: `رسالة جديدة من ${senderName}`,
          body: notifBody,
          type: NotificationType.NEW_MESSAGE,
          metadata: {
            conversationId,
            senderId: currentUserId,
            messageId: message.id
          }
        }
      }).catch((err) => {
        console.error("Failed to create message notification:", err);
      });
    }

    return message;
  }

  /**
   * Mark all unread messages in conversation as read for the current user
   */
  async markAsRead(currentUserId: string, conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new AppError(ERROR_CODES.CONVERSATION_NOT_FOUND, 404);
    }

    if (!conversation.participantIds.includes(currentUserId)) {
      throw new AppError(ERROR_CODES.CONVERSATION_ACCESS_DENIED, 403);
    }

    const updated = await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: currentUserId },
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    return {
      success: true,
      markedCount: updated.count
    };
  }

  /**
   * Get total unread messages count across all conversations
   */
  async getTotalUnreadCount(currentUserId: string) {
    const userConversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          has: currentUserId
        }
      },
      select: { id: true }
    });

    if (userConversations.length === 0) {
      return { unreadTotal: 0 };
    }

    const conversationIds = userConversations.map((c) => c.id);

    const unreadTotal = await prisma.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderId: { not: currentUserId },
        isRead: false
      }
    });

    return { unreadTotal };
  }

  /**
   * Delete a message (only sender can delete their own message)
   */
  async deleteMessage(currentUserId: string, conversationId: string, messageId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new AppError(ERROR_CODES.CONVERSATION_NOT_FOUND, 404);
    }

    if (!conversation.participantIds.includes(currentUserId)) {
      throw new AppError(ERROR_CODES.CONVERSATION_ACCESS_DENIED, 403);
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message || message.conversationId !== conversationId) {
      throw new AppError(ERROR_CODES.MESSAGE_NOT_FOUND, 404);
    }

    if (message.senderId !== currentUserId) {
      throw new AppError(ERROR_CODES.MESSAGE_DELETE_FORBIDDEN, 403);
    }

    // Delete message from database
    await prisma.message.delete({
      where: { id: messageId }
    });

    // If the deleted message was the last message, update the conversation summary with previous message
    const previousLatest = await prisma.message.findFirst({
      where: { conversationId },
      orderBy: { createdAt: "desc" }
    });

    if (previousLatest) {
      const previewText =
        previousLatest.text.length > 100
          ? previousLatest.text.substring(0, 97) + "..."
          : previousLatest.text;

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText: previewText,
          lastMessageAt: previousLatest.createdAt,
          lastMessageSenderId: previousLatest.senderId,
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText: null,
          lastMessageAt: null,
          lastMessageSenderId: null,
          updatedAt: new Date()
        }
      });
    }

    return {
      success: true,
      deletedMessageId: messageId
    };
  }
}

export const conversationService = new ConversationService();
