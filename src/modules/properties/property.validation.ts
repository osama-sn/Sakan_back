import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  propertyType: z.enum(["APARTMENT", "STUDENT_HOUSING", "SHARED_APARTMENT"], {
    errorMap: () => ({ message: "Invalid property type" })
  }),
  city: z.string().trim().min(2, "City is required"),
  area: z.string().trim().min(2, "Area is required"),
  address: z.string().trim().min(3, "Address is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  genderPolicy: z.enum(["MALE", "FEMALE", "MIXED"], {
    errorMap: () => ({ message: "Invalid gender policy" })
  }),
  distanceFromUniversity: z.string().optional(),
  rating: z.number().optional(),
  isVerified: z.boolean().optional(),
  amenityIds: z.array(z.string()).optional().default([])
});

export const updatePropertySchema = createPropertySchema.partial();

export const queryPropertiesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  governorate: z.string().optional(),
  area: z.string().optional(),
  university: z.string().optional(),
  faculty: z.string().optional(),
  propertyType: z.enum(["APARTMENT", "STUDENT_HOUSING", "SHARED_APARTMENT"]).optional(),
  genderPolicy: z.enum(["MALE", "FEMALE", "MIXED"]).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  amenities: z.string().optional(),
  sortBy: z.enum(["createdAt", "monthlyPrice", "title", "rating"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional()
});

export const reorderImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int()
    })
  ).min(1, "Images array cannot be empty")
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type QueryPropertiesInput = z.infer<typeof queryPropertiesSchema>;
export type ReorderImagesInput = z.infer<typeof reorderImagesSchema>;
