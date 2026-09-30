export const ROLES = {
  STUDENT: "STUDENT",
  OWNER: "OWNER"
} as const;

export type UserRoleType = (typeof ROLES)[keyof typeof ROLES];
