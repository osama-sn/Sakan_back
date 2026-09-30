import { z } from "zod";

export const createBookingSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  roomId: z.string().min(1, "Room ID is required"),
  message: z.string().trim().optional()
});

export const rejectBookingSchema = z.object({
  reason: z.string().trim().min(3, "Rejection reason must be at least 3 characters")
});

export const queryBookingsSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type RejectBookingInput = z.infer<typeof rejectBookingSchema>;
export type QueryBookingsInput = z.infer<typeof queryBookingsSchema>;
