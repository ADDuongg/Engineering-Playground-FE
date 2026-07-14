"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminFormField,
  AdminSelect,
  AdminTextarea,
} from "@/features/lab-flow-admin/components/form-field";
import {
  curriculumFormSchema,
  type CurriculumFormValues,
} from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";
import type { AdminLabCurriculumView } from "@/features/lab-flow-admin/types/lab-flow-admin";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

function curriculumToFormValues(
  curriculum?: AdminLabCurriculumView,
): CurriculumFormValues {
  if (!curriculum) {
    return {
      learningGoal: "",
      theory: "",
      recommendedQuerySql: "",
      recommendedQueryDescription: "",
      recommendedQueryExampleParameters: "[]",
      recommendedQueryParamHints: "[]",
      recommendedCreateIndexSql: "",
      recommendedDropIndexSql: "",
      datasetFamily: "",
      datasetVersion: "",
      datasetRecommendedTier: "small, medium",
      configJson: "",
      quizRequired: "false",
      optionalBenchmarkNote: "",
    };
  }

  return {
    learningGoal: curriculum.learningGoal,
    theory: curriculum.theory,
    recommendedQuerySql: curriculum.recommendedQuery?.sql ?? "",
    recommendedQueryDescription: curriculum.recommendedQuery?.description ?? "",
    recommendedQueryExampleParameters: JSON.stringify(
      curriculum.recommendedQuery?.exampleParameters ?? [],
      null,
      2,
    ),
    recommendedQueryParamHints: JSON.stringify(
      curriculum.recommendedQuery?.paramHints ?? [],
      null,
      2,
    ),
    recommendedCreateIndexSql: curriculum.recommendedCreateIndexSql ?? "",
    recommendedDropIndexSql: curriculum.recommendedDropIndexSql ?? "",
    datasetFamily: curriculum.dataset?.family ?? "",
    datasetVersion: curriculum.dataset?.version ?? "",
    datasetRecommendedTier:
      curriculum.dataset?.recommendedTier.join(", ") ?? "small, medium",
    configJson: curriculum.config
      ? JSON.stringify(curriculum.config, null, 2)
      : "",
    quizRequired: curriculum.quizRequired ? "true" : "false",
    optionalBenchmarkNote: curriculum.optionalBenchmarkNote ?? "",
  };
}

interface CurriculumFormProps {
  curriculum?: AdminLabCurriculumView;
  onSubmit: (values: CurriculumFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel: string;
}

export function CurriculumForm({
  curriculum,
  onSubmit,
  isSubmitting = false,
  submitLabel,
}: CurriculumFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumFormSchema),
    defaultValues: curriculumToFormValues(curriculum),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField
        label="Learning goal"
        htmlFor="learningGoal"
        error={errors.learningGoal?.message}
      >
        <AdminTextarea id="learningGoal" {...register("learningGoal")} />
      </AdminFormField>

      <AdminFormField
        label="Theory"
        htmlFor="theory"
        error={errors.theory?.message}
      >
        <AdminTextarea
          id="theory"
          className="min-h-40"
          {...register("theory")}
        />
      </AdminFormField>

      <p className="text-xs text-muted-foreground">
        SQL / dataset fields are Database track only — leave empty for React
        (and other non-SQL) labs; content goes in guided step{" "}
        <code className="font-mono">payload.reactScenario</code>.
      </p>

      <AdminFormField
        label="Recommended query SQL"
        htmlFor="recommendedQuerySql"
        error={errors.recommendedQuerySql?.message}
        hint="Optional for non-SQL tracks"
      >
        <AdminTextarea
          id="recommendedQuerySql"
          className="min-h-28 font-mono text-xs"
          {...register("recommendedQuerySql")}
        />
      </AdminFormField>

      <AdminFormField
        label="Recommended query description"
        htmlFor="recommendedQueryDescription"
        error={errors.recommendedQueryDescription?.message}
      >
        <Input
          id="recommendedQueryDescription"
          {...register("recommendedQueryDescription")}
        />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Example parameters (JSON array)"
          htmlFor="recommendedQueryExampleParameters"
          error={errors.recommendedQueryExampleParameters?.message}
          hint='e.g. ["alice@example.com"]'
        >
          <AdminTextarea
            id="recommendedQueryExampleParameters"
            className="min-h-20 font-mono text-xs"
            {...register("recommendedQueryExampleParameters")}
          />
        </AdminFormField>

        <AdminFormField
          label="Param hints (JSON array)"
          htmlFor="recommendedQueryParamHints"
          error={errors.recommendedQueryParamHints?.message}
          hint='e.g. ["email"]'
        >
          <AdminTextarea
            id="recommendedQueryParamHints"
            className="min-h-20 font-mono text-xs"
            {...register("recommendedQueryParamHints")}
          />
        </AdminFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Create index SQL"
          htmlFor="recommendedCreateIndexSql"
          error={errors.recommendedCreateIndexSql?.message}
          hint="Leave empty to clear"
        >
          <AdminTextarea
            id="recommendedCreateIndexSql"
            className="min-h-20 font-mono text-xs"
            {...register("recommendedCreateIndexSql")}
          />
        </AdminFormField>

        <AdminFormField
          label="Drop index SQL"
          htmlFor="recommendedDropIndexSql"
          error={errors.recommendedDropIndexSql?.message}
          hint="Leave empty to clear"
        >
          <AdminTextarea
            id="recommendedDropIndexSql"
            className="min-h-20 font-mono text-xs"
            {...register("recommendedDropIndexSql")}
          />
        </AdminFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminFormField
          label="Dataset family"
          htmlFor="datasetFamily"
          error={errors.datasetFamily?.message}
          hint="Optional for non-SQL tracks"
        >
          <Input id="datasetFamily" {...register("datasetFamily")} />
        </AdminFormField>

        <AdminFormField
          label="Dataset version"
          htmlFor="datasetVersion"
          error={errors.datasetVersion?.message}
        >
          <Input id="datasetVersion" {...register("datasetVersion")} />
        </AdminFormField>

        <AdminFormField
          label="Recommended tiers"
          htmlFor="datasetRecommendedTier"
          error={errors.datasetRecommendedTier?.message}
          hint="Comma-separated"
        >
          <Input
            id="datasetRecommendedTier"
            placeholder="small, medium"
            {...register("datasetRecommendedTier")}
          />
        </AdminFormField>
      </div>

      <AdminFormField
        label="Lab config (JSON object)"
        htmlFor="configJson"
        error={errors.configJson?.message}
        hint="Optional per-track metadata — leave empty for null"
      >
        <AdminTextarea
          id="configJson"
          className="min-h-24 font-mono text-xs"
          placeholder="{}"
          {...register("configJson")}
        />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Quiz required"
          htmlFor="quizRequired"
          error={errors.quizRequired?.message}
        >
          <AdminSelect
            id="quizRequired"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            {...register("quizRequired")}
          />
        </AdminFormField>

        <AdminFormField
          label="Optional benchmark note"
          htmlFor="optionalBenchmarkNote"
          error={errors.optionalBenchmarkNote?.message}
        >
          <Input
            id="optionalBenchmarkNote"
            {...register("optionalBenchmarkNote")}
          />
        </AdminFormField>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
