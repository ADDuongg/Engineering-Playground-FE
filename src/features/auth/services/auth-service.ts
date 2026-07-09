import {
  authResponseSchema,
  userProfileSchema,
} from "@/features/auth/schemas/auth-schema";
import { normalizeAuthEmail } from "@/features/auth/utils/normalize-auth-email";
import {
  apiRequest,
  apiRequestNoContent,
} from "@/shared/services/api-client";
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserProfile,
} from "@/features/auth/types/auth";

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>({
    path: "/auth/register",
    method: "POST",
    body: {
      ...data,
      email: normalizeAuthEmail(data.email),
    },
    auth: false,
  });

  return authResponseSchema.parse(response);
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>({
    path: "/auth/login",
    method: "POST",
    body: {
      ...data,
      email: normalizeAuthEmail(data.email),
    },
    auth: false,
  });

  return authResponseSchema.parse(response);
}

export async function refreshTokens(
  data: RefreshTokenRequest,
): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>({
    path: "/auth/refresh",
    method: "POST",
    body: data,
    auth: false,
    skipRefresh: true,
  });

  return authResponseSchema.parse(response);
}

export async function logout(data: LogoutRequest): Promise<void> {
  return apiRequestNoContent({
    path: "/auth/logout",
    method: "POST",
    body: data,
    auth: true,
  });
}

export async function getMe(): Promise<UserProfile> {
  const response = await apiRequest<UserProfile>({
    path: "/auth/me",
    method: "GET",
    auth: true,
  });

  return userProfileSchema.parse(response);
}
