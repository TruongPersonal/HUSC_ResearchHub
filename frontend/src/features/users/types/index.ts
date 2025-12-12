export type UserRole = "ADMIN" | "ASSISTANT" | "TEACHER" | "STUDENT";

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  departmentName?: string;
  departmentId?: number;
  password?: string;

  // Extended fields
  email?: string;
  phoneNumber?: string;
  sex?: boolean;
  bornDate?: string;
  avatarUrl?: string;
  course?: number;
  className?: string;
  academicDegree?: string;
}

export interface CreateUserRequest {
  username: string;
  fullName: string;
  role: UserRole;
  departmentId?: number;
}

export interface UpdateUserRequest {
  username: string;
  fullName: string;
  role: UserRole;
  departmentId?: number;
}

export interface UpdateProfileRequest {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  sex?: boolean;
  bornDate?: string;
  course?: number;
  className?: string;
  academicDegree?: string;
  deleteAvatar?: boolean;
}
