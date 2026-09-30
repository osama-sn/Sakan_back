import { Router } from "express";
import { conversationController } from "./conversation.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { validateBody, validateQuery } from "../../common/middleware/validate.middleware";
import {
  startConversationSchema,
  sendMessageSchema,
  queryMessagesSchema,
  queryConversationsSchema
} from "./conversation.validation";

const router = Router();

// All conversation routes require authentication
router.use(authenticate);

// Start or get existing conversation
router.post(
  "/",
  validateBody(startConversationSchema),
  (req, res, next) => conversationController.startOrGetConversation(req, res, next)
);

// Get user conversations list (Inbox)
router.get(
  "/",
  validateQuery(queryConversationsSchema),
  (req, res, next) => conversationController.getConversations(req, res, next)
);

// Get total unread messages count (for Badge)
router.get(
  "/unread-total",
  (req, res, next) => conversationController.getTotalUnreadCount(req, res, next)
);

// Get single conversation details
router.get(
  "/:id",
  (req, res, next) => conversationController.getConversationById(req, res, next)
);

// Get messages of a conversation
router.get(
  "/:id/messages",
  validateQuery(queryMessagesSchema),
  (req, res, next) => conversationController.getMessages(req, res, next)
);

// Send message in a conversation
router.post(
  "/:id/messages",
  validateBody(sendMessageSchema),
  (req, res, next) => conversationController.sendMessage(req, res, next)
);

// Mark conversation messages as read
router.patch(
  "/:id/read",
  (req, res, next) => conversationController.markAsRead(req, res, next)
);

// Delete message in a conversation (sender only)
router.delete(
  "/:id/messages/:messageId",
  (req, res, next) => conversationController.deleteMessage(req, res, next)
);

export const conversationRoutes = router;
