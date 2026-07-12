import {
  adminLabCurriculumViewSchema,
  adminLabGuidedStepListResponseSchema,
  adminLabGuidedStepViewSchema,
} from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";
import type {
  AdminLabCurriculumView,
  AdminLabGuidedStepListResponse,
  AdminLabGuidedStepView,
  CreateLabCurriculumRequest,
  CreateLabGuidedStepRequest,
  ReorderLabGuidedStepsRequest,
  UpdateLabCurriculumRequest,
  UpdateLabGuidedStepRequest,
} from "@/features/lab-flow-admin/types/lab-flow-admin";
import {
  apiRequest,
  apiRequestNoContent,
} from "@/shared/services/api-client";

function encodeSlug(slug: string): string {
  return encodeURIComponent(slug);
}

function stepsBasePath(labSlug: string): string {
  return `/admin/labs/${encodeSlug(labSlug)}/steps`;
}

function curriculumPath(labSlug: string): string {
  return `/admin/labs/${encodeSlug(labSlug)}/curriculum`;
}

export async function fetchAdminLabSteps(
  labSlug: string,
): Promise<AdminLabGuidedStepListResponse> {
  const data = await apiRequest<AdminLabGuidedStepListResponse>({
    path: stepsBasePath(labSlug),
    method: "GET",
    auth: true,
  });

  return adminLabGuidedStepListResponseSchema.parse(data);
}

export async function fetchAdminLabStep(
  labSlug: string,
  stepId: string,
): Promise<AdminLabGuidedStepView> {
  const data = await apiRequest<AdminLabGuidedStepView>({
    path: `${stepsBasePath(labSlug)}/${encodeURIComponent(stepId)}`,
    method: "GET",
    auth: true,
  });

  return adminLabGuidedStepViewSchema.parse(data);
}

export async function createAdminLabStep(
  labSlug: string,
  body: CreateLabGuidedStepRequest,
): Promise<AdminLabGuidedStepView> {
  const data = await apiRequest<AdminLabGuidedStepView>({
    path: stepsBasePath(labSlug),
    method: "POST",
    body,
    auth: true,
  });

  return adminLabGuidedStepViewSchema.parse(data);
}

export async function updateAdminLabStep(
  labSlug: string,
  stepId: string,
  body: UpdateLabGuidedStepRequest,
): Promise<AdminLabGuidedStepView> {
  const data = await apiRequest<AdminLabGuidedStepView>({
    path: `${stepsBasePath(labSlug)}/${encodeURIComponent(stepId)}`,
    method: "PATCH",
    body,
    auth: true,
  });

  return adminLabGuidedStepViewSchema.parse(data);
}

export async function deleteAdminLabStep(
  labSlug: string,
  stepId: string,
): Promise<void> {
  return apiRequestNoContent({
    path: `${stepsBasePath(labSlug)}/${encodeURIComponent(stepId)}`,
    method: "DELETE",
    auth: true,
  });
}

export async function reorderAdminLabSteps(
  labSlug: string,
  body: ReorderLabGuidedStepsRequest,
): Promise<void> {
  await apiRequest<unknown>({
    path: `${stepsBasePath(labSlug)}/reorder`,
    method: "POST",
    body,
    auth: true,
  });
}

export async function fetchAdminLabCurriculum(
  labSlug: string,
): Promise<AdminLabCurriculumView> {
  const data = await apiRequest<AdminLabCurriculumView>({
    path: curriculumPath(labSlug),
    method: "GET",
    auth: true,
  });

  return adminLabCurriculumViewSchema.parse(data);
}

export async function createAdminLabCurriculum(
  labSlug: string,
  body: CreateLabCurriculumRequest,
): Promise<AdminLabCurriculumView> {
  const data = await apiRequest<AdminLabCurriculumView>({
    path: curriculumPath(labSlug),
    method: "POST",
    body,
    auth: true,
  });

  return adminLabCurriculumViewSchema.parse(data);
}

export async function updateAdminLabCurriculum(
  labSlug: string,
  body: UpdateLabCurriculumRequest,
): Promise<AdminLabCurriculumView> {
  const data = await apiRequest<AdminLabCurriculumView>({
    path: curriculumPath(labSlug),
    method: "PATCH",
    body,
    auth: true,
  });

  return adminLabCurriculumViewSchema.parse(data);
}
