"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminFormField,
  AdminSelect,
  AdminTextarea,
} from "@/features/lab-flow-admin/components/form-field";
import { GUIDED_STEP_ACTION_OPTIONS } from "@/features/lab-flow-admin/constants/guided-step-options";
import {
  guidedStepFormSchema,
  type GuidedStepFormValues,
} from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";
import type { AdminLabGuidedStepView } from "@/features/lab-flow-admin/types/lab-flow-admin";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

function stepToFormValues(
  step?: AdminLabGuidedStepView,
  nextDisplayOrder = 1,
): GuidedStepFormValues {
  if (!step) {
    return {
      title: "",
      instruction: "",
      action: "run_sql",
      displayOrder: nextDisplayOrder,
      payloadSql: "",
      payloadRecommendedSql: "",
      payloadRecommendedDescription: "",
      payloadRecommendedExampleParameters: '["user1@example.com"]',
      payloadRecommendedParamHints: '["email"]',
    };
  }

  return {
    title: step.title,
    instruction: step.instruction,
    action: step.action,
    displayOrder: step.displayOrder,
    payloadSql: step.payload?.sql ?? "",
    payloadRecommendedSql: step.payload?.recommendedQuery?.sql ?? "",
    payloadRecommendedDescription:
      step.payload?.recommendedQuery?.description ?? "",
    payloadRecommendedExampleParameters: JSON.stringify(
      step.payload?.recommendedQuery?.exampleParameters ?? [],
      null,
      2,
    ),
    payloadRecommendedParamHints: JSON.stringify(
      step.payload?.recommendedQuery?.paramHints ?? [],
      null,
      2,
    ),
  };
}

interface GuidedStepFormProps {
  step?: AdminLabGuidedStepView;
  nextDisplayOrder?: number;
  onSubmit: (values: GuidedStepFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
}

export function GuidedStepForm({
  step,
  nextDisplayOrder = 1,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
}: GuidedStepFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GuidedStepFormValues>({
    resolver: zodResolver(guidedStepFormSchema),
    defaultValues: stepToFormValues(step, nextDisplayOrder),
  });

  const action = useWatch({ control, name: "action" });
  const showRecommendedQuery =
    action === "run_sql" ||
    action === "run_explain" ||
    action === "run_explain_analyze";
  const showDdlSql =
    action === "create_index_sql" || action === "drop_index_sql";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField label="Title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" {...register("title")} />
      </AdminFormField>

      <AdminFormField
        label="Instruction"
        htmlFor="instruction"
        error={errors.instruction?.message}
      >
        <AdminTextarea id="instruction" {...register("instruction")} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Action"
          htmlFor="action"
          error={errors.action?.message}
        >
          <AdminSelect
            id="action"
            options={GUIDED_STEP_ACTION_OPTIONS}
            {...register("action")}
          />
        </AdminFormField>

        <AdminFormField
          label="Display order"
          htmlFor="displayOrder"
          error={errors.displayOrder?.message}
          hint="Reorder panel can also change order"
        >
          <Input
            id="displayOrder"
            type="number"
            min={0}
            {...register("displayOrder")}
          />
        </AdminFormField>
      </div>

      {showRecommendedQuery ? (
        <div className="space-y-4 rounded-md border border-border p-4">
          <p className="text-sm font-medium">
            Apply payload · <code className="text-xs">recommendedQuery</code>
          </p>
          <AdminFormField
            label="SQL"
            htmlFor="payloadRecommendedSql"
            error={errors.payloadRecommendedSql?.message}
            hint="Keep $1 placeholders — send parameters separately"
          >
            <AdminTextarea
              id="payloadRecommendedSql"
              className="min-h-24 font-mono text-xs"
              {...register("payloadRecommendedSql")}
            />
          </AdminFormField>

          <AdminFormField
            label="Description"
            htmlFor="payloadRecommendedDescription"
            error={errors.payloadRecommendedDescription?.message}
          >
            <Input
              id="payloadRecommendedDescription"
              {...register("payloadRecommendedDescription")}
            />
          </AdminFormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="Example parameters (JSON array)"
              htmlFor="payloadRecommendedExampleParameters"
              error={errors.payloadRecommendedExampleParameters?.message}
              hint='e.g. ["user1@example.com"]'
            >
              <AdminTextarea
                id="payloadRecommendedExampleParameters"
                className="min-h-20 font-mono text-xs"
                {...register("payloadRecommendedExampleParameters")}
              />
            </AdminFormField>

            <AdminFormField
              label="Param hints (JSON array)"
              htmlFor="payloadRecommendedParamHints"
              error={errors.payloadRecommendedParamHints?.message}
            >
              <AdminTextarea
                id="payloadRecommendedParamHints"
                className="min-h-20 font-mono text-xs"
                {...register("payloadRecommendedParamHints")}
              />
            </AdminFormField>
          </div>
        </div>
      ) : null}

      {showDdlSql ? (
        <AdminFormField
          label="DDL SQL"
          htmlFor="payloadSql"
          error={errors.payloadSql?.message}
          hint="Stored as payload.sql — runner uses parameters: []"
        >
          <AdminTextarea
            id="payloadSql"
            className="min-h-24 font-mono text-xs"
            placeholder="CREATE INDEX idx_users_email ON users (email)"
            {...register("payloadSql")}
          />
        </AdminFormField>
      ) : null}

      {!showRecommendedQuery && !showDdlSql ? (
        <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
          This action has no Apply SQL payload (usually{" "}
          <code className="font-mono">null</code>).
        </p>
      ) : null}

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
