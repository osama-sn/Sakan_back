export const BOOKING_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED"
} as const;

export type BookingStatusType = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
