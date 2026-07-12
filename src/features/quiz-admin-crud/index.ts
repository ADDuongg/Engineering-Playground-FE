export { AdminLabQuizPage } from "@/features/quiz-admin-crud/components/admin-lab-quiz-page";
export { quizAdminKeys } from "@/features/quiz-admin-crud/constants/query-keys";
export { useAdminLabQuiz } from "@/features/quiz-admin-crud/hooks/use-admin-lab-quiz";
export {
  useCreateLabQuiz,
  useCreateQuizOption,
  useCreateQuizQuestion,
  useDeleteLabQuiz,
  useDeleteQuizOption,
  useDeleteQuizQuestion,
  useReorderQuizOptions,
  useReorderQuizQuestions,
  useUpdateLabQuiz,
  useUpdateQuizOption,
  useUpdateQuizQuestion,
} from "@/features/quiz-admin-crud/hooks/use-quiz-admin-mutations";
export {
  createAdminLabQuiz,
  createAdminQuizOption,
  createAdminQuizQuestion,
  deleteAdminLabQuiz,
  deleteAdminQuizOption,
  deleteAdminQuizQuestion,
  fetchAdminLabQuiz,
  reorderAdminQuizOptions,
  reorderAdminQuizQuestions,
  updateAdminLabQuiz,
  updateAdminQuizOption,
  updateAdminQuizQuestion,
} from "@/features/quiz-admin-crud/services/quiz-admin-service";
export type {
  AdminQuizOptionView,
  AdminQuizQuestionView,
  AdminQuizView,
} from "@/features/quiz-admin-crud/types/quiz-admin-crud";
export {
  formatQuizAdminErrorMessage,
  isNotFoundError,
} from "@/features/quiz-admin-crud/utils/format-quiz-admin-error";
