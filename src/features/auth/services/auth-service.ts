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
  return apiRequest<AuthResponse>({
    path: "/auth/register",
    method: "POST",
    body: data,
    auth: false,
  });
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    path: "/auth/login",
    method: "POST",
    body: data,
    auth: false,
  });
}

export async function refreshTokens(
  data: RefreshTokenRequest,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>({
    path: "/auth/refresh",
    method: "POST",
    body: data,
    auth: false,
    skipRefresh: true,
  });
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
  return apiRequest<UserProfile>({
    path: "/auth/me",
    method: "GET",
    auth: true,
  });
}
