import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quizAdminKeys } from "@/features/quiz-admin-crud/constants/query-keys";
import {
  createAdminLabQuiz,
  createAdminQuizOption,
  createAdminQuizQuestion,
  deleteAdminLabQuiz,
  deleteAdminQuizOption,
  deleteAdminQuizQuestion,
  reorderAdminQuizOptions,
  reorderAdminQuizQuestions,
  updateAdminLabQuiz,
  updateAdminQuizOption,
  updateAdminQuizQuestion,
} from "@/features/quiz-admin-crud/services/quiz-admin-service";
import type {
  CreateLabQuizRequest,
  CreateQuizOptionRequest,
  CreateQuizQuestionRequest,
  ReorderQuizOptionsRequest,
  ReorderQuizQuestionsRequest,
  UpdateLabQuizRequest,
  UpdateQuizOptionRequest,
  UpdateQuizQuestionRequest,
} from "@/features/quiz-admin-crud/types/quiz-admin-crud";
import { quizKeys } from "@/features/quiz-engine/constants/query-keys";

function invalidateQuizQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  labSlug: string,
) {
  void queryClient.invalidateQueries({ queryKey: quizAdminKeys.quiz(labSlug) });
  void queryClient.invalidateQueries({
    queryKey: quizKeys.definition(labSlug),
  });
  void queryClient.invalidateQueries({ queryKey: quizKeys.result(labSlug) });
}

export function useCreateLabQuiz(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLabQuizRequest) =>
      createAdminLabQuiz(labSlug, data),
    onSuccess: (quiz) => {
      void queryClient.setQueryData(quizAdminKeys.quiz(labSlug), quiz);
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useUpdateLabQuiz(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLabQuizRequest) =>
      updateAdminLabQuiz(labSlug, data),
    onSuccess: (quiz) => {
      void queryClient.setQueryData(quizAdminKeys.quiz(labSlug), quiz);
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useDeleteLabQuiz(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAdminLabQuiz(labSlug),
    onSuccess: () => {
      void queryClient.removeQueries({ queryKey: quizAdminKeys.quiz(labSlug) });
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useCreateQuizQuestion(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizQuestionRequest) =>
      createAdminQuizQuestion(labSlug, data),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useUpdateQuizQuestion(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: UpdateQuizQuestionRequest;
    }) => updateAdminQuizQuestion(labSlug, questionId, data),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useDeleteQuizQuestion(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) =>
      deleteAdminQuizQuestion(labSlug, questionId),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useReorderQuizQuestions(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderQuizQuestionsRequest) =>
      reorderAdminQuizQuestions(labSlug, data),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useCreateQuizOption(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: CreateQuizOptionRequest;
    }) => createAdminQuizOption(labSlug, questionId, data),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useUpdateQuizOption(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      optionId,
      data,
    }: {
      questionId: string;
      optionId: string;
      data: UpdateQuizOptionRequest;
    }) => updateAdminQuizOption(labSlug, questionId, optionId, data),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useDeleteQuizOption(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      optionId,
    }: {
      questionId: string;
      optionId: string;
    }) => deleteAdminQuizOption(labSlug, questionId, optionId),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}

export function useReorderQuizOptions(labSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: ReorderQuizOptionsRequest;
    }) => reorderAdminQuizOptions(labSlug, questionId, data),
    onSuccess: () => {
      invalidateQuizQueries(queryClient, labSlug);
    },
  });
}
