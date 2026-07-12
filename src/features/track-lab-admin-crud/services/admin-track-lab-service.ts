import {
  adminLabListResponseSchema,
  adminLabViewSchema,
  adminTrackListResponseSchema,
  adminTrackViewSchema,
} from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import type {
  AdminLabListResponse,
  AdminLabView,
  AdminTrackListResponse,
  AdminTrackView,
  CreateLabRequest,
  CreateTrackRequest,
  UpdateLabRequest,
  UpdateTrackRequest,
} from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { apiRequest } from "@/shared/services/api-client";

function encodeSlug(slug: string): string {
  return encodeURIComponent(slug);
}

export async function fetchAdminTracks(): Promise<AdminTrackListResponse> {
  const data = await apiRequest<AdminTrackListResponse>({
    path: "/admin/tracks",
    method: "GET",
    auth: true,
  });

  return adminTrackListResponseSchema.parse(data);
}

export async function fetchAdminTrackBySlug(
  slug: string,
): Promise<AdminTrackView> {
  const data = await apiRequest<AdminTrackView>({
    path: `/admin/tracks/${encodeSlug(slug)}`,
    method: "GET",
    auth: true,
  });

  return adminTrackViewSchema.parse(data);
}

export async function createAdminTrack(
  body: CreateTrackRequest,
): Promise<AdminTrackView> {
  const data = await apiRequest<AdminTrackView>({
    path: "/admin/tracks",
    method: "POST",
    body,
    auth: true,
  });

  return adminTrackViewSchema.parse(data);
}

export async function updateAdminTrack(
  slug: string,
  body: UpdateTrackRequest,
): Promise<AdminTrackView> {
  const data = await apiRequest<AdminTrackView>({
    path: `/admin/tracks/${encodeSlug(slug)}`,
    method: "PATCH",
    body,
    auth: true,
  });

  return adminTrackViewSchema.parse(data);
}

export async function fetchAdminLabsByTrack(
  trackSlug: string,
): Promise<AdminLabListResponse> {
  const data = await apiRequest<AdminLabListResponse>({
    path: `/admin/tracks/${encodeSlug(trackSlug)}/labs`,
    method: "GET",
    auth: true,
  });

  return adminLabListResponseSchema.parse(data);
}

export async function fetchAdminLabBySlug(
  labSlug: string,
): Promise<AdminLabView> {
  const data = await apiRequest<AdminLabView>({
    path: `/admin/labs/${encodeSlug(labSlug)}`,
    method: "GET",
    auth: true,
  });

  return adminLabViewSchema.parse(data);
}

export async function createAdminLab(
  trackSlug: string,
  body: CreateLabRequest,
): Promise<AdminLabView> {
  const data = await apiRequest<AdminLabView>({
    path: `/admin/tracks/${encodeSlug(trackSlug)}/labs`,
    method: "POST",
    body,
    auth: true,
  });

  return adminLabViewSchema.parse(data);
}

export async function updateAdminLab(
  labSlug: string,
  body: UpdateLabRequest,
): Promise<AdminLabView> {
  const data = await apiRequest<AdminLabView>({
    path: `/admin/labs/${encodeSlug(labSlug)}`,
    method: "PATCH",
    body,
    auth: true,
  });

  return adminLabViewSchema.parse(data);
}
