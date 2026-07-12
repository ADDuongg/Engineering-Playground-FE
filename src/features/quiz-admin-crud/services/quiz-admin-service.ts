import {
  adminQuizOptionListResponseSchema,
  adminQuizOptionViewSchema,
  adminQuizQuestionListResponseSchema,
  adminQuizQuestionViewSchema,
  adminQuizViewSchema,
} from "@/features/quiz-admin-crud/schemas/quiz-admin-schema";
import type {
  AdminQuizOptionListResponse,
  AdminQuizOptionView,
  AdminQuizQuestionListResponse,
  AdminQuizQuestionView,
  AdminQuizView,
  CreateLabQuizRequest,
  CreateQuizOptionRequest,
  CreateQuizQuestionRequest,
  ReorderQuizOptionsRequest,
  ReorderQuizQuestionsRequest,
  UpdateLabQuizRequest,
  UpdateQuizOptionRequest,
  UpdateQuizQuestionRequest,
} from "@/features/quiz-admin-crud/types/quiz-admin-crud";
import {
  apiRequest,
  apiRequestNoContent,
} from "@/shared/services/api-client";

function quizPath(labSlug: string): string {
  return `/admin/labs/${encodeURIComponent(labSlug)}/quiz`;
}

function questionsPath(labSlug: string): string {
  return `${quizPath(labSlug)}/questions`;
}

function questionPath(labSlug: string, questionId: string): string {
  return `${questionsPath(labSlug)}/${encodeURIComponent(questionId)}`;
}

function optionsPath(labSlug: string, questionId: string): string {
  return `${questionPath(labSlug, questionId)}/options`;
}

function optionPath(
  labSlug: string,
  questionId: string,
  optionId: string,
): string {
  return `${optionsPath(labSlug, questionId)}/${encodeURIComponent(optionId)}`;
}

export async function fetchAdminLabQuiz(labSlug: string): Promise<AdminQuizView> {
  const data = await apiRequest<AdminQuizView>({
    path: quizPath(labSlug),
    method: "GET",
    auth: true,
  });

  return adminQuizViewSchema.parse(data);
}

export async function createAdminLabQuiz(
  labSlug: string,
  body: CreateLabQuizRequest,
): Promise<AdminQuizView> {
  const data = await apiRequest<AdminQuizView>({
    path: quizPath(labSlug),
    method: "POST",
    body,
    auth: true,
  });

  return adminQuizViewSchema.parse(data);
}

export async function updateAdminLabQuiz(
  labSlug: string,
  body: UpdateLabQuizRequest,
): Promise<AdminQuizView> {
  const data = await apiRequest<AdminQuizView>({
    path: quizPath(labSlug),
    method: "PATCH",
    body,
    auth: true,
  });

  return adminQuizViewSchema.parse(data);
}

export async function deleteAdminLabQuiz(labSlug: string): Promise<void> {
  return apiRequestNoContent({
    path: quizPath(labSlug),
    method: "DELETE",
    auth: true,
  });
}

export async function createAdminQuizQuestion(
  labSlug: string,
  body: CreateQuizQuestionRequest,
): Promise<AdminQuizQuestionView> {
  const data = await apiRequest<AdminQuizQuestionView>({
    path: questionsPath(labSlug),
    method: "POST",
    body,
    auth: true,
  });

  return adminQuizQuestionViewSchema.parse(data);
}

export async function updateAdminQuizQuestion(
  labSlug: string,
  questionId: string,
  body: UpdateQuizQuestionRequest,
): Promise<AdminQuizQuestionView> {
  const data = await apiRequest<AdminQuizQuestionView>({
    path: questionPath(labSlug, questionId),
    method: "PATCH",
    body,
    auth: true,
  });

  return adminQuizQuestionViewSchema.parse(data);
}

export async function deleteAdminQuizQuestion(
  labSlug: string,
  questionId: string,
): Promise<void> {
  return apiRequestNoContent({
    path: questionPath(labSlug, questionId),
    method: "DELETE",
    auth: true,
  });
}

export async function reorderAdminQuizQuestions(
  labSlug: string,
  body: ReorderQuizQuestionsRequest,
): Promise<AdminQuizQuestionListResponse | void> {
  const data = await apiRequest<AdminQuizQuestionListResponse | unknown>({
    path: `${questionsPath(labSlug)}/reorder`,
    method: "POST",
    body,
    auth: true,
  });

  const parsed = adminQuizQuestionListResponseSchema.safeParse(data);
  return parsed.success ? parsed.data : undefined;
}

export async function createAdminQuizOption(
  labSlug: string,
  questionId: string,
  body: CreateQuizOptionRequest,
): Promise<AdminQuizOptionView> {
  const data = await apiRequest<AdminQuizOptionView>({
    path: optionsPath(labSlug, questionId),
    method: "POST",
    body,
    auth: true,
  });

  return adminQuizOptionViewSchema.parse(data);
}

export async function updateAdminQuizOption(
  labSlug: string,
  questionId: string,
  optionId: string,
  body: UpdateQuizOptionRequest,
): Promise<AdminQuizOptionView> {
  const data = await apiRequest<AdminQuizOptionView>({
    path: optionPath(labSlug, questionId, optionId),
    method: "PATCH",
    body,
    auth: true,
  });

  return adminQuizOptionViewSchema.parse(data);
}

export async function deleteAdminQuizOption(
  labSlug: string,
  questionId: string,
  optionId: string,
): Promise<void> {
  return apiRequestNoContent({
    path: optionPath(labSlug, questionId, optionId),
    method: "DELETE",
    auth: true,
  });
}

export async function reorderAdminQuizOptions(
  labSlug: string,
  questionId: string,
  body: ReorderQuizOptionsRequest,
): Promise<AdminQuizOptionListResponse | void> {
  const data = await apiRequest<AdminQuizOptionListResponse | unknown>({
    path: `${optionsPath(labSlug, questionId)}/reorder`,
    method: "POST",
    body,
    auth: true,
  });

  const parsed = adminQuizOptionListResponseSchema.safeParse(data);
  return parsed.success ? parsed.data : undefined;
}
