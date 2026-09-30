import { Request, Response, NextFunction } from "express";
import { conversationService } from "./conversation.service";
import { ERROR_CODES } from "../../common/constants/error-codes";
import { sendSuccess } from "../../common/utils/response";
import {
  StartConversationInput,
  SendMessageInput,
  QueryMessagesInput,
  QueryConversationsInput
} from "./conversation.validation";

export class ConversationController {
  /**
   * POST /api/v1/conversations
   * Start or get existing conversation
   */
  async startOrGetConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const input = req.body as StartConversationInput;

      const result = await conversationService.startOrGetConversation(currentUserId, input);
      sendSuccess(res, ERROR_CODES.CONVERSATION_CREATED, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations
   * Get all user conversations
   */
  async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const query = req.query as unknown as QueryConversationsInput;

      const result = await conversationService.getConversations(currentUserId, query);
      sendSuccess(res, ERROR_CODES.CONVERSATIONS_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations/unread-total
   * Get total unread messages count for badge
   */
  async getTotalUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;

      const result = await conversationService.getTotalUnreadCount(currentUserId);
      sendSuccess(res, ERROR_CODES.UNREAD_MESSAGES_COUNT_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations/:id
   * Get conversation details
   */
  async getConversationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const conversationId = req.params.id || "";

      const result = await conversationService.getConversationById(currentUserId, conversationId);
      sendSuccess(res, ERROR_CODES.CONVERSATION_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/conversations/:id/messages
   * Get messages of a conversation
   */
  async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const conversationId = req.params.id || "";
      const query = req.query as unknown as QueryMessagesInput;

      const result = await conversationService.getMessages(currentUserId, conversationId, query);
      sendSuccess(res, ERROR_CODES.MESSAGES_RETRIEVED, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/conversations/:id/messages
   * Send a new message
   */
  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const conversationId = req.params.id || "";
      const input = req.body as SendMessageInput;

      const result = await conversationService.sendMessage(currentUserId, conversationId, input);
      sendSuccess(res, ERROR_CODES.MESSAGE_SENT, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/conversations/:id/read
   * Mark all messages in conversation as read
   */
  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const conversationId = req.params.id || "";

      const result = await conversationService.markAsRead(currentUserId, conversationId);
      sendSuccess(res, ERROR_CODES.MESSAGES_MARKED_READ, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/conversations/:id/messages/:messageId
   * Delete user's own message
   */
  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const conversationId = req.params.id || "";
      const messageId = req.params.messageId || "";

      const result = await conversationService.deleteMessage(currentUserId, conversationId, messageId);
      sendSuccess(res, ERROR_CODES.MESSAGE_DELETED, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController = new ConversationController();
