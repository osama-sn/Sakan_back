import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SAKAN Backend API",
      version: "1.0.0",
      description:
        "Complete REST API specification for SAKAN Non-Profit Student Housing Platform with Arabic & English localization."
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: "Local Development Server"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT Access Token (without 'Bearer ' prefix)"
        }
      },
      parameters: {
        AcceptLanguage: {
          name: "Accept-Language",
          in: "header",
          description: "Preferred language: 'ar' (Arabic, default) or 'en' (English)",
          schema: {
            type: "string",
            enum: ["ar", "en"],
            default: "ar"
          }
        }
      },
      schemas: {
        StandardSuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            code: { type: "string", example: "PROPERTIES_RETRIEVED" },
            message: { type: "string", example: "تم جلب أماكن السكن بنجاح" },
            data: { type: "object" }
          }
        },
        StandardErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            code: { type: "string", example: "PROPERTY_NOT_FOUND" },
            message: { type: "string", example: "لم يتم العثور على مكان السكن" },
            errors: {
              type: "array",
              nullable: true,
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    paths: {
      "/health": {
        get: {
          summary: "Server health check",
          tags: ["Health"],
          parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
          responses: {
            200: {
              description: "Server is healthy"
            }
          }
        }
      },
      "/auth/register": {
        post: {
          summary: "Register new user (STUDENT or OWNER)",
          tags: ["Authentication"],
          parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    fullName: { type: "string", example: "أحمد محمد إبراهيم" },
                    firstName: { type: "string", example: "أحمد" },
                    lastName: { type: "string", example: "محمود" },
                    email: { type: "string", format: "email", example: "student@eng.asu.edu.eg" },
                    phone: { type: "string", example: "01012345678" },
                    password: { type: "string", minLength: 8, example: "Password123" },
                    confirmPassword: { type: "string", example: "Password123" },
                    role: { type: "string", enum: ["STUDENT", "OWNER"], example: "STUDENT", default: "STUDENT" },
                    gender: { type: "string", enum: ["MALE", "FEMALE"], example: "MALE" },
                    governorate: { type: "string", example: "القاهرة" },
                    university: { type: "string", example: "جامعة عين شمس" },
                    faculty: { type: "string", example: "كلية الهندسة" },
                    major: { type: "string", example: "هندسة مدنية" },
                    academicYear: { type: "string", example: "سنة 1" }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Account created successfully" },
            409: { description: "Email or phone already exists" }
          }
        }
      },
      "/auth/login": {
        post: {
          summary: "User login",
          tags: ["Authentication"],
          parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email", example: "osama@example.com" },
                    password: { type: "string", example: "Password123" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Login successful with tokens" },
            401: { description: "Invalid credentials" }
          }
        }
      },
      "/auth/refresh-token": {
        post: {
          summary: "Refresh access token",
          tags: ["Authentication"],
          parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["refreshToken"],
                  properties: {
                    refreshToken: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Tokens refreshed" },
            401: { description: "Invalid refresh token" }
          }
        }
      },
      "/auth/logout": {
        post: {
          summary: "Revoke refresh token",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["refreshToken"],
                  properties: {
                    refreshToken: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Logged out successfully" }
          }
        }
      },
      "/auth/me": {
        get: {
          summary: "Get current authenticated user profile",
          tags: ["Authentication"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Current user profile" },
            401: { description: "Unauthorized" }
          }
        }
      },
      "/users/roommates": {
        get: {
          summary: "Search and filter roommates and student directory",
          tags: ["Users"],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "page", in: "query", schema: { type: "string", default: "1" } },
            { name: "limit", in: "query", schema: { type: "string", default: "10" } },
            { name: "search", in: "query", schema: { type: "string" }, description: "Search by student name, faculty, major, or keywords" },
            { name: "governorate", in: "query", schema: { type: "string" }, description: "Filter by origin governorate (e.g. الإسكندرية)" },
            { name: "university", in: "query", schema: { type: "string" }, description: "Filter by university (e.g. جامعة القاهرة)" },
            { name: "faculty", in: "query", schema: { type: "string" }, description: "Filter by faculty (e.g. كلية الهندسة)" },
            { name: "housingStatus", in: "query", schema: { type: "string" }, description: "Filter by housing status (e.g. يبحث عن شريك سكن)" },
            { name: "gender", in: "query", schema: { type: "string", enum: ["MALE", "FEMALE"] } }
          ],
          responses: {
            200: { description: "List of students looking for roommates" }
          }
        }
      },
      "/users/me": {
        get: {
          summary: "Get profile details",
          tags: ["Users"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "User profile" } }
        },
        patch: {
          summary: "Update profile information",
          tags: ["Users"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    phone: { type: "string" },
                    bio: { type: "string" },
                    profileImage: { type: "string" },
                    gender: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { 200: { description: "Profile updated" } }
        }
      },
      "/users/me/password": {
        patch: {
          summary: "Change user password",
          tags: ["Users"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string", minLength: 8 },
                    newPassword: { type: "string", minLength: 8 }
                  }
                }
              }
            }
          },
          responses: { 200: { description: "Password updated" } }
        }
      },
      "/properties": {
        get: {
          summary: "List active properties with filters, search, and pagination",
          tags: ["Properties"],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "city", in: "query", schema: { type: "string" } },
            { name: "area", in: "query", schema: { type: "string" } },
            { name: "propertyType", in: "query", schema: { type: "string", enum: ["APARTMENT", "STUDENT_HOUSING", "SHARED_APARTMENT"] } },
            { name: "genderPolicy", in: "query", schema: { type: "string", enum: ["MALE", "FEMALE", "MIXED"] } },
            { name: "minPrice", in: "query", schema: { type: "number" } },
            { name: "maxPrice", in: "query", schema: { type: "number" } },
            { name: "amenities", in: "query", schema: { type: "string" } }
          ],
          responses: { 200: { description: "Paginated property cards" } }
        },
        post: {
          summary: "Create property (OWNER only)",
          tags: ["Properties"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "propertyType", "city", "area", "address", "genderPolicy"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    propertyType: { type: "string", enum: ["APARTMENT", "STUDENT_HOUSING", "SHARED_APARTMENT"] },
                    city: { type: "string" },
                    area: { type: "string" },
                    address: { type: "string" },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    genderPolicy: { type: "string", enum: ["MALE", "FEMALE", "MIXED"] },
                    amenityIds: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: { 201: { description: "Property created" } }
        }
      },
      "/properties/{propertyId}": {
        get: {
          summary: "Get property details with rooms, amenities, and owner info",
          tags: ["Properties"],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Property details" }, 404: { description: "Property not found" } }
        },
        patch: {
          summary: "Update property (OWNER only)",
          tags: ["Properties"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Property updated" } }
        },
        delete: {
          summary: "Deactivate property (OWNER only)",
          tags: ["Properties"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Property deactivated" } }
        }
      },
      "/properties/{propertyId}/rooms": {
        get: {
          summary: "Get rooms of a property",
          tags: ["Rooms"],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Rooms retrieved" } }
        },
        post: {
          summary: "Create room in property (OWNER only)",
          tags: ["Rooms"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "capacity", "monthlyPrice"],
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    capacity: { type: "integer", minimum: 1 },
                    monthlyPrice: { type: "number", minimum: 1 },
                    amenityIds: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          },
          responses: { 201: { description: "Room created" } }
        }
      },
      "/rooms/{roomId}": {
        get: {
          summary: "Get room details",
          tags: ["Rooms"],
          parameters: [{ name: "roomId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Room details" } }
        },
        patch: {
          summary: "Update room (OWNER only)",
          tags: ["Rooms"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "roomId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Room updated" } }
        },
        delete: {
          summary: "Deactivate room (OWNER only)",
          tags: ["Rooms"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "roomId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Room deactivated" } }
        }
      },
      "/booking-requests": {
        post: {
          summary: "Create booking request (STUDENT only)",
          tags: ["Bookings"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["propertyId", "roomId"],
                  properties: {
                    propertyId: { type: "string" },
                    roomId: { type: "string" },
                    message: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { 201: { description: "Booking request created" } }
        }
      },
      "/booking-requests/my": {
        get: {
          summary: "Get student's own booking requests (STUDENT only)",
          tags: ["Bookings"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Booking requests retrieved" } }
        }
      },
      "/booking-requests/{bookingId}/approve": {
        patch: {
          summary: "Approve booking request atomically (OWNER only)",
          tags: ["Bookings"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "bookingId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Booking approved and occupied beds incremented" } }
        }
      },
      "/booking-requests/{bookingId}/reject": {
        patch: {
          summary: "Reject booking request (OWNER only)",
          tags: ["Bookings"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "bookingId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["reason"],
                  properties: {
                    reason: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { 200: { description: "Booking rejected" } }
        }
      },
      "/booking-requests/{bookingId}/cancel": {
        patch: {
          summary: "Cancel pending booking request (STUDENT only)",
          tags: ["Bookings"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "bookingId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Booking cancelled" } }
        }
      },
      "/favorites": {
        get: {
          summary: "Get student favorites (Authenticated)",
          tags: ["Favorites"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Favorite properties list" } }
        }
      },
      "/favorites/{propertyId}": {
        post: {
          summary: "Add property to favorites (Authenticated)",
          tags: ["Favorites"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Added to favorites" } }
        },
        delete: {
          summary: "Remove property from favorites (Authenticated)",
          tags: ["Favorites"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "propertyId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Removed from favorites" } }
        }
      },
      "/notifications": {
        get: {
          summary: "Get user notifications",
          tags: ["Notifications"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Notifications retrieved" } }
        }
      },
      "/notifications/unread-count": {
        get: {
          summary: "Get unread notifications count",
          tags: ["Notifications"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Unread notifications count" } }
        }
      },
      "/notifications/read-all": {
        patch: {
          summary: "Mark all notifications as read",
          tags: ["Notifications"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "All marked read" } }
        }
      },
      "/notifications/{notificationId}/read": {
        patch: {
          summary: "Mark notification as read",
          tags: ["Notifications"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "notificationId", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Notification marked read" } }
        }
      },
      "/amenities": {
        get: {
          summary: "Get all active amenities",
          tags: ["Amenities"],
          responses: { 200: { description: "Amenities list" } }
        }
      },
      "/locations": {
        get: {
          summary: "Get Egyptian cities and their student neighborhoods/districts with search and city filter",
          tags: ["Locations"],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "city", in: "query", schema: { type: "string" }, description: "Filter by city name or ID (e.g. الجيزة, cairo)" },
            { name: "search", in: "query", schema: { type: "string" }, description: "Search by city or area name in Arabic or English (e.g. الدقي, Nasr City)" }
          ],
          responses: {
            200: {
              description: "List of cities with their student housing areas",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      code: { type: "string", example: "LOCATIONS_RETRIEVED" },
                      message: { type: "string", example: "تم جلب قائمة المدن والمناطق بنجاح" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", example: "giza" },
                            nameAr: { type: "string", example: "الجيزة" },
                            nameEn: { type: "string", example: "Giza" },
                            areas: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  id: { type: "string", example: "dokki" },
                                  nameAr: { type: "string", example: "الدقي" },
                                  nameEn: { type: "string", example: "Dokki" }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/locations/cities": {
        get: {
          summary: "Get lightweight list of all cities/governorates",
          tags: ["Locations"],
          parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
          responses: {
            200: {
              description: "List of cities overview",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      code: { type: "string", example: "LOCATIONS_RETRIEVED" },
                      message: { type: "string", example: "تم جلب قائمة المدن والمناطق بنجاح" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", example: "cairo" },
                            nameAr: { type: "string", example: "القاهرة" },
                            nameEn: { type: "string", example: "Cairo" },
                            areasCount: { type: "number", example: 25 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/locations/cities/{city}/areas": {
        get: {
          summary: "Get all areas/districts for a specific city",
          tags: ["Locations"],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "city", in: "path", required: true, schema: { type: "string" }, description: "City ID or Arabic/English Name (e.g. cairo, الجيزة)" }
          ],
          responses: {
            200: {
              description: "List of areas for the specified city",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      code: { type: "string", example: "LOCATIONS_RETRIEVED" },
                      message: { type: "string", example: "تم جلب قائمة المدن والمناطق بنجاح" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", example: "dokki" },
                            nameAr: { type: "string", example: "الدقي" },
                            nameEn: { type: "string", example: "Dokki" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/owner/dashboard": {
        get: {
          summary: "Get owner dashboard statistics (OWNER only)",
          tags: ["Owner"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Dashboard statistics" } }
        }
      },
      "/owner/properties": {
        get: {
          summary: "Get owner properties with capacity status (OWNER only)",
          tags: ["Owner"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Owner properties list" } }
        }
      },
      "/owner/booking-requests": {
        get: {
          summary: "Get owner booking requests (OWNER only)",
          tags: ["Owner"],
          security: [{ BearerAuth: [] }],
          responses: { 200: { description: "Booking requests for owner properties" } }
        }
      },
      "/conversations": {
        post: {
          summary: "Start or get existing conversation (Student-Student or Student-Owner)",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/AcceptLanguage" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["targetUserId"],
                  properties: {
                    targetUserId: { type: "string", example: "678e244b7852c161980a3120", description: "Target student or owner ID" },
                    propertyId: { type: "string", example: "678e244b7852c161980a3125", description: "Optional property ID if chatting with owner about a property" }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Conversation initiated or returned" },
            400: { description: "Cannot chat with yourself" },
            403: { description: "Gender mismatch between students" },
            404: { description: "User or property not found" }
          }
        },
        get: {
          summary: "Get user conversations inbox with unread count and latest messages",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            { name: "type", in: "query", schema: { type: "string", enum: ["STUDENT_STUDENT", "STUDENT_OWNER"] } }
          ],
          responses: {
            200: { description: "List of conversations" }
          }
        }
      },
      "/conversations/unread-total": {
        get: {
          summary: "Get total unread messages count across all conversations (for Navigation Badge)",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Total unread messages count",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      code: { type: "string", example: "UNREAD_MESSAGES_COUNT_RETRIEVED" },
                      data: {
                        type: "object",
                        properties: {
                          unreadTotal: { type: "integer", example: 3 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/conversations/{id}": {
        get: {
          summary: "Get single conversation details",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: { description: "Conversation details" },
            403: { description: "Access denied" },
            404: { description: "Conversation not found" }
          }
        }
      },
      "/conversations/{id}/messages": {
        get: {
          summary: "Get paginated messages of a conversation",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 30 } },
            { name: "before", in: "query", schema: { type: "string" }, description: "Message ID cursor for loading older messages" }
          ],
          responses: {
            200: { description: "Paginated messages list" }
          }
        },
        post: {
          summary: "Send a message in a conversation",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: { type: "string", example: "السلام عليكم، هل السكن لا يزال متاحاً؟" }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Message sent" },
            403: { description: "Access denied" },
            404: { description: "Conversation not found" }
          }
        }
      },
      "/conversations/{id}/read": {
        patch: {
          summary: "Mark all messages in conversation as read",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "id", in: "path", required: true, schema: { type: "string" } }
          ],
          responses: {
            200: { description: "Messages marked as read" }
          }
        }
      },
      "/conversations/{id}/messages/{messageId}": {
        delete: {
          summary: "Delete a message (Sender only)",
          tags: ["Conversations"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/AcceptLanguage" },
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Conversation ID" },
            { name: "messageId", in: "path", required: true, schema: { type: "string" }, description: "Message ID to delete" }
          ],
          responses: {
            200: { description: "Message deleted successfully" },
            403: { description: "Cannot delete message sent by other user" },
            404: { description: "Conversation or message not found" }
          }
        }
      }
    }
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(options);
