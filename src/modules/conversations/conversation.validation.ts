import { z } from "zod";

export const startConversationSchema = z.object({
  targetUserId: z.string({
    required_error: "Target user ID is required"
  }).min(1, "Target user ID cannot be empty"),
  propertyId: z.string().optional()
});

export const sendMessageSchema = z.object({
  text: z.string({
    required_error: "Message text is required"
  }).trim().min(1, "Message text cannot be empty").max(2000, "Message text cannot exceed 2000 characters")
});

export const queryMessagesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  before: z.string().optional() // Cursor for loading older messages
});

export const queryConversationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(["STUDENT_STUDENT", "STUDENT_OWNER"]).optional()
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type QueryMessagesInput = z.infer<typeof queryMessagesSchema>;
export type QueryConversationsInput = z.infer<typeof queryConversationsSchema>;
