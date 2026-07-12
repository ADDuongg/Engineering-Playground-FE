export type QuizQuestionType = "single_select";

export interface AdminQuizOptionView {
  id: string;
  label: string;
  sequenceOrder: number;
  isCorrect: boolean;
  createdAt: string;
}

export interface AdminQuizQuestionView {
  id: string;
  prompt: string;
  questionType: QuizQuestionType;
  sequenceOrder: number;
  options: AdminQuizOptionView[];
  createdAt: string;
}

export interface AdminQuizView {
  id: string;
  labSlug: string;
  title: string | null;
  questions: AdminQuizQuestionView[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabQuizRequest {
  title?: string | null;
}

export interface UpdateLabQuizRequest {
  title?: string | null;
}

export interface CreateQuizOptionInline {
  label: string;
  sequenceOrder: number;
  isCorrect: boolean;
}

export interface CreateQuizQuestionRequest {
  prompt: string;
  sequenceOrder: number;
  questionType?: QuizQuestionType;
  options: CreateQuizOptionInline[];
}

export interface UpdateQuizQuestionRequest {
  prompt?: string;
  sequenceOrder?: number;
}

export interface CreateQuizOptionRequest {
  label: string;
  sequenceOrder: number;
  isCorrect: boolean;
}

export interface UpdateQuizOptionRequest {
  label?: string;
  sequenceOrder?: number;
  isCorrect?: boolean;
}

export interface ReorderQuizQuestionsRequest {
  questionIds: string[];
}

export interface ReorderQuizOptionsRequest {
  optionIds: string[];
}

export interface AdminQuizQuestionListResponse {
  questions: AdminQuizQuestionView[];
}

export interface AdminQuizOptionListResponse {
  options: AdminQuizOptionView[];
}
