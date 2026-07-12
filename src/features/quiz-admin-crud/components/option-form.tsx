"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminFormField } from "@/features/quiz-admin-crud/components/form-field";
import {
  optionFormSchema,
  type OptionFormValues,
} from "@/features/quiz-admin-crud/schemas/quiz-admin-schema";
import type { AdminQuizOptionView } from "@/features/quiz-admin-crud/types/quiz-admin-crud";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface OptionFormProps {
  option?: AdminQuizOptionView;
  nextSequenceOrder?: number;
  onSubmit: (values: OptionFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
}

export function OptionForm({
  option,
  nextSequenceOrder = 0,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
}: OptionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OptionFormValues>({
    resolver: zodResolver(optionFormSchema),
    defaultValues: option
      ? {
          label: option.label,
          sequenceOrder: option.sequenceOrder,
          isCorrect: option.isCorrect ? "true" : "false",
        }
      : {
          label: "",
          sequenceOrder: nextSequenceOrder,
          isCorrect: "false",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField label="Label" htmlFor="label" error={errors.label?.message}>
        <Input id="label" {...register("label")} />
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

      <AdminFormField
        label="Correct answer"
        htmlFor="isCorrect"
        error={errors.isCorrect?.message}
        hint="Setting correct clears other correct flags on this question."
      >
        <select
          id="isCorrect"
          className="flex h-9 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm"
          {...register("isCorrect")}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </AdminFormField>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
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
