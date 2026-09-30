import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, "Room name is required"),
  description: z.string().trim().optional(),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  monthlyPrice: z.number().positive("Monthly price must be greater than 0"),
  amenityIds: z.array(z.string()).optional().default([])
});

export const updateRoomSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  capacity: z.number().int().min(1).optional(),
  monthlyPrice: z.number().positive().optional(),
  amenityIds: z.array(z.string()).optional()
});

export const queryPropertyRoomsSchema = z.object({
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  availableOnly: z.string().optional()
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type QueryPropertyRoomsInput = z.infer<typeof queryPropertyRoomsSchema>;
