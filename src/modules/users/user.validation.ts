import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").optional(),
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").optional(),
  phone: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  profileImage: z.string().trim().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  governorate: z.string().trim().optional(),
  university: z.string().trim().optional(),
  faculty: z.string().trim().optional(),
  major: z.string().trim().optional(),
  academicYear: z.string().trim().optional(),
  housingStatus: z.string().trim().optional(),
  interests: z.string().trim().optional()
});

export const queryRoommatesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  governorate: z.string().optional(),
  university: z.string().optional(),
  faculty: z.string().optional(),
  housingStatus: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  matchMyProfile: z.string().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type QueryRoommatesInput = z.infer<typeof queryRoommatesSchema>;
