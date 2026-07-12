"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminFormField,
  AdminTextarea,
} from "@/features/quiz-admin-crud/components/form-field";
import {
  createQuestionFormSchema,
  updateQuestionFormSchema,
  type CreateQuestionFormValues,
  type UpdateQuestionFormValues,
} from "@/features/quiz-admin-crud/schemas/quiz-admin-schema";
import type { AdminQuizQuestionView } from "@/features/quiz-admin-crud/types/quiz-admin-crud";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface CreateQuestionFormProps {
  nextSequenceOrder: number;
  onSubmit: (values: CreateQuestionFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function CreateQuestionForm({
  nextSequenceOrder,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CreateQuestionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateQuestionFormValues>({
    resolver: zodResolver(createQuestionFormSchema),
    defaultValues: {
      prompt: "",
      sequenceOrder: nextSequenceOrder,
      options: [
        { label: "", isCorrect: true },
        { label: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const options = watch("options");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField
        label="Prompt"
        htmlFor="prompt"
        error={errors.prompt?.message}
      >
        <AdminTextarea id="prompt" {...register("prompt")} />
      </AdminFormField>

      <AdminFormField
        label="Sequence order"
        htmlFor="sequenceOrder"
        error={errors.sequenceOrder?.message}
      >
        <Input
          id="sequenceOrder"
          type="number"
          min={0}
          {...register("sequenceOrder")}
        />
      </AdminFormField>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-medium">Options</h4>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => append({ label: "", isCorrect: false })}
          >
            Add option
          </Button>
        </div>
        {errors.options?.message || errors.options?.root?.message ? (
          <p className="text-xs text-danger">
            {errors.options.message ?? errors.options.root?.message}
          </p>
        ) : null}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-wrap items-start gap-2 rounded-md border border-border p-3"
          >
            <div className="min-w-0 flex-1">
              <Input
                placeholder={`Option ${index + 1}`}
                {...register(`options.${index}.label`)}
              />
              {errors.options?.[index]?.label ? (
                <p className="mt-1 text-xs text-danger">
                  {errors.options[index]?.label?.message}
                </p>
              ) : null}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="correct-option"
                checked={Boolean(options?.[index]?.isCorrect)}
                onChange={() => {
                  options?.forEach((_, optionIndex) => {
                    setValue(`options.${optionIndex}.isCorrect`, optionIndex === index);
                  });
                }}
              />
              Correct
            </label>
            {fields.length > 2 ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create question"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

interface UpdateQuestionFormProps {
  question: AdminQuizQuestionView;
  onSubmit: (values: UpdateQuestionFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function UpdateQuestionForm({
  question,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: UpdateQuestionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateQuestionFormValues>({
    resolver: zodResolver(updateQuestionFormSchema),
    defaultValues: {
      prompt: question.prompt,
      sequenceOrder: question.sequenceOrder,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField
        label="Prompt"
        htmlFor="prompt"
        error={errors.prompt?.message}
      >
        <AdminTextarea id="prompt" {...register("prompt")} />
      </AdminFormField>

      <AdminFormField
        label="Sequence order"
        htmlFor="sequenceOrder"
        error={errors.sequenceOrder?.message}
      >
        <Input
          id="sequenceOrder"
          type="number"
          min={0}
          {...register("sequenceOrder")}
        />
      </AdminFormField>

      <p className="text-xs text-muted-foreground">
        Edit options from the question card. This form only updates prompt and
        order.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save question"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
