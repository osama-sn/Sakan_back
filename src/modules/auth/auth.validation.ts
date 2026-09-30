import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters").optional(),
    firstName: z.string().trim().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters").optional(),
    email: z.string().trim().email("Invalid email format"),
    phone: z.string().trim().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().optional(),
    role: z
      .enum(["STUDENT", "OWNER"], {
        errorMap: () => ({ message: "Role must be either STUDENT or OWNER" })
      })
      .default("STUDENT"),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    governorate: z.string().trim().optional(),
    university: z.string().trim().optional(),
    faculty: z.string().trim().optional(),
    major: z.string().trim().optional(),
    academicYear: z.string().trim().optional()
  })
  .refine(
    (data) => !!data.fullName || (!!data.firstName && !!data.lastName),
    {
      message: "Please provide either full name or both first and last name",
      path: ["fullName"]
    }
  )
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"]
    }
  );

export const loginSchema = z
  .object({
    email: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    identifier: z.string().trim().optional(),
    password: z.string().min(8, "Password must be at least 8 characters")
  })
  .refine(
    (data) => Boolean(data.email || data.phone || data.identifier),
    {
      message: "Email or phone number is required",
      path: ["email"]
    }
  );

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
