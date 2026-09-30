import { TranslationDictionary } from "./messages";

export const en: TranslationDictionary = {
  // Authentication
  AUTH_LOGIN_SUCCESS: "Login successful",
  AUTH_ACCOUNT_CREATED: "Account created successfully",
  AUTH_INVALID_CREDENTIALS: "Invalid email or password",
  AUTH_UNAUTHORIZED: "Please log in first to continue",
  AUTH_TOKEN_EXPIRED: "Session expired, please log in again",
  AUTH_INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  AUTH_ACCOUNT_INACTIVE: "This account is currently inactive, please contact support",
  AUTH_LOGOUT_SUCCESS: "Logged out successfully",
  AUTH_CURRENT_USER_RETRIEVED: "User details retrieved successfully",
  AUTH_REGISTRATION_OPTIONS_RETRIEVED: "Registration options retrieved successfully",

  // Users
  USER_NOT_FOUND: "User not found",
  USER_EMAIL_ALREADY_EXISTS: "Email is already registered",
  USER_PHONE_ALREADY_EXISTS: "Phone number is already registered",
  USER_PROFILE_RETRIEVED: "User profile retrieved successfully",
  USER_PROFILE_UPDATED: "Profile updated successfully",
  USER_PASSWORD_UPDATED: "Password updated successfully",
  USER_CURRENT_PASSWORD_INVALID: "Current password is incorrect",
  ROOMMATES_RETRIEVED: "Roommates list retrieved successfully",

  // Properties
  PROPERTY_NOT_FOUND: "Property not found",
  PROPERTY_ACCESS_DENIED: "You are not authorized to modify this property",
  PROPERTY_CREATED: "Property created successfully",
  PROPERTY_UPDATED: "Property updated successfully",
  PROPERTY_DEACTIVATED: "Property deactivated successfully",
  PROPERTY_DELETED: "Property deleted successfully",
  PROPERTIES_RETRIEVED: "Properties retrieved successfully",
  PROPERTY_RETRIEVED: "Property retrieved successfully",
  PROPERTY_IMAGE_UPLOADED: "Property images uploaded successfully",
  PROPERTY_IMAGE_DELETED: "Image deleted successfully",
  PROPERTY_IMAGES_REORDERED: "Images reordered successfully",
  PROPERTY_IMAGE_NOT_FOUND: "Image not found",
  PROPERTY_VIEW_RECORDED: "Property view recorded successfully",

  // Rooms
  ROOM_NOT_FOUND: "Room not found",
  ROOM_ACCESS_DENIED: "You are not authorized to access this room",
  ROOM_FULL: "This room is currently full",
  ROOM_INVALID_CAPACITY: "Room capacity cannot be lower than the currently occupied beds",
  ROOM_CREATED: "Room created successfully",
  ROOM_UPDATED: "Room updated successfully",
  ROOM_DEACTIVATED: "Room deactivated successfully",
  ROOM_RETRIEVED: "Room details retrieved successfully",
  ROOMS_RETRIEVED: "Rooms retrieved successfully",
  ROOM_IMAGE_UPLOADED: "Room images uploaded successfully",
  ROOM_IMAGE_DELETED: "Room image deleted successfully",
  ROOM_IMAGE_NOT_FOUND: "Room image not found",

  // Bookings
  BOOKING_NOT_FOUND: "Booking request not found",
  BOOKING_ACCESS_DENIED: "You are not authorized to access this booking request",
  BOOKING_ALREADY_EXISTS: "You already have a pending or approved booking request for this room",
  BOOKING_INVALID_STATUS: "This request cannot be modified in its current state",
  BOOKING_CREATED: "Accommodation request sent successfully",
  BOOKING_APPROVED: "Accommodation request approved successfully",
  BOOKING_REJECTED: "Accommodation request rejected",
  BOOKING_CANCELLED: "Accommodation request cancelled successfully",
  BOOKINGS_RETRIEVED: "Booking requests retrieved successfully",
  BOOKING_CANNOT_REQUEST_OWN_PROPERTY: "You cannot request booking for your own property",
  BOOKING_ROOM_NOT_IN_PROPERTY: "Selected room does not belong to this property",

  // Favorites
  FAVORITE_ADDED: "Property added to favorites",
  FAVORITE_REMOVED: "Property removed from favorites",
  FAVORITES_RETRIEVED: "Favorites retrieved successfully",

  // Notifications
  NOTIFICATIONS_RETRIEVED: "Notifications retrieved successfully",
  NOTIFICATION_NOT_FOUND: "Notification not found",
  NOTIFICATION_MARKED_READ: "Notification marked as read",
  NOTIFICATIONS_ALL_MARKED_READ: "All notifications marked as read",
  NOTIFICATIONS_UNREAD_COUNT_RETRIEVED: "Unread notification count retrieved",

  // Amenities
  AMENITIES_RETRIEVED: "Amenities retrieved successfully",
  AMENITY_NOT_FOUND: "One or more specified amenities were not found",

  // Locations
  LOCATIONS_RETRIEVED: "Locations and districts retrieved successfully",

  // Conversations & Messages
  CONVERSATION_CREATED: "Conversation initiated successfully",
  CONVERSATIONS_RETRIEVED: "Conversations retrieved successfully",
  CONVERSATION_RETRIEVED: "Conversation details retrieved successfully",
  CONVERSATION_NOT_FOUND: "Conversation not found",
  CONVERSATION_ACCESS_DENIED: "You are not authorized to access this conversation",
  CANNOT_CHAT_WITH_SELF: "You cannot initiate a conversation with yourself",
  GENDER_MISMATCH_NOT_ALLOWED: "Chatting between students of different genders is not allowed for privacy and safety",
  INVALID_CHAT_PARTICIPANTS: "Invalid conversation participants",
  MESSAGE_SENT: "Message sent successfully",
  MESSAGE_DELETED: "Message deleted successfully",
  MESSAGE_NOT_FOUND: "Message not found",
  MESSAGE_DELETE_FORBIDDEN: "You can only delete messages sent by you",
  MESSAGES_RETRIEVED: "Messages retrieved successfully",
  MESSAGES_MARKED_READ: "Messages marked as read",
  UNREAD_MESSAGES_COUNT_RETRIEVED: "Unread message count retrieved",

  // Owner
  OWNER_DASHBOARD_RETRIEVED: "Owner dashboard statistics retrieved successfully",
  OWNER_PROPERTIES_RETRIEVED: "Owner properties retrieved successfully",
  OWNER_BOOKINGS_RETRIEVED: "Owner booking requests retrieved successfully",

  // General
  HEALTH_CHECK_SUCCESS: "Server is running",
  VALIDATION_ERROR: "Please check your input data",
  FORBIDDEN: "Forbidden: You do not have permission to perform this action",
  NOT_FOUND: "Requested resource was not found",
  INTERNAL_SERVER_ERROR: "An unexpected server error occurred, please try again later",
  UPLOAD_FAILED: "File upload failed, please check file size and format"
};
