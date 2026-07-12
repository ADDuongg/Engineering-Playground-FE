"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GuidedStepForm } from "@/features/lab-flow-admin/components/guided-step-form";
import { getGuidedStepActionLabel } from "@/features/lab-flow-admin/constants/guided-step-options";
import {
  useCreateLabStep,
  useDeleteLabStep,
  useReorderLabSteps,
  useUpdateLabStep,
} from "@/features/lab-flow-admin/hooks/use-step-mutations";
import { useAdminLabSteps } from "@/features/lab-flow-admin/hooks/use-admin-lab-steps";
import type { GuidedStepFormValues } from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";
import type { AdminLabGuidedStepView } from "@/features/lab-flow-admin/types/lab-flow-admin";
import { formatLabFlowAdminErrorMessage } from "@/features/lab-flow-admin/utils/format-lab-flow-admin-error";
import { guidedStepFormToPayload } from "@/features/lab-flow-admin/utils/map-curriculum-form";
import { EmptyState } from "@/shared/components/common/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Modal } from "@/shared/components/ui/modal";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface GuidedStepsEditorProps {
  labSlug: string;
}

type EditorMode =
  | { type: "idle" }
  | { type: "create" }
  | { type: "edit"; step: AdminLabGuidedStepView };

export function GuidedStepsEditor({ labSlug }: GuidedStepsEditorProps) {
  const stepsQuery = useAdminLabSteps(labSlug);
  const createStep = useCreateLabStep(labSlug);
  const updateStep = useUpdateLabStep(labSlug);
  const deleteStep = useDeleteLabStep(labSlug);
  const reorderSteps = useReorderLabSteps(labSlug);
  const [mode, setMode] = useState<EditorMode>({ type: "idle" });

  const steps = useMemo(() => {
    const list = stepsQuery.data?.steps ?? [];
    return [...list].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.id.localeCompare(b.id);
    });
  }, [stepsQuery.data?.steps]);

  const nextDisplayOrder = steps.length + 1;
  const closeModal = () => setMode({ type: "idle" });

  const handleCreate = async (values: GuidedStepFormValues) => {
    try {
      await createStep.mutateAsync({
        title: values.title.trim(),
        instruction: values.instruction.trim(),
        action: values.action,
        displayOrder: values.displayOrder,
        payload: guidedStepFormToPayload(values),
      });
      toast.success("Step created");
      closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error &&
          (error.message.includes("JSON") ||
            error.message.includes("parameters") ||
            error.message.includes("hints"))
          ? error.message
          : formatLabFlowAdminErrorMessage(error),
      );
    }
  };

  const handleUpdate = async (values: GuidedStepFormValues) => {
    if (mode.type !== "edit") {
      return;
    }

    try {
      await updateStep.mutateAsync({
        stepId: mode.step.id,
        data: {
          title: values.title.trim(),
          instruction: values.instruction.trim(),
          action: values.action,
          displayOrder: values.displayOrder,
          payload: guidedStepFormToPayload(values),
        },
      });
      toast.success("Step updated");
      closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error &&
          (error.message.includes("JSON") ||
            error.message.includes("parameters") ||
            error.message.includes("hints"))
          ? error.message
          : formatLabFlowAdminErrorMessage(error),
      );
    }
  };

  const handleDelete = async (step: AdminLabGuidedStepView) => {
    const confirmed = window.confirm(
      `Delete step "${step.title}"? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteStep.mutateAsync(step.id);
      toast.success("Step deleted");
      if (mode.type === "edit" && mode.step.id === step.id) {
        closeModal();
      }
    } catch (error) {
      toast.error(formatLabFlowAdminErrorMessage(error));
    }
  };

  const moveStep = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= steps.length) {
      return;
    }

    const reordered = [...steps];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      await reorderSteps.mutateAsync({
        stepIds: reordered.map((step) => step.id),
      });
      toast.success("Steps reordered");
    } catch (error) {
      toast.error(formatLabFlowAdminErrorMessage(error));
    }
  };

  if (stepsQuery.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (stepsQuery.error) {
    return (
      <EmptyState
        title="Could not load steps"
        description={formatLabFlowAdminErrorMessage(stepsQuery.error)}
        className="py-10"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Ordered guided steps shown in the learner workspace.
        </p>
        <Button size="sm" onClick={() => setMode({ type: "create" })}>
          <Plus className="h-4 w-4" />
          Add step
        </Button>
      </div>

      {steps.length === 0 ? (
        <EmptyState
          title="No guided steps yet"
          description="Add steps to guide learners through the lab flow. Empty guidedSteps is allowed if curriculum exists."
          action={
            <Button onClick={() => setMode({ type: "create" })}>
              Add step
            </Button>
          }
          className="py-10"
        />
      ) : null}

      {steps.length > 0 ? (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <Card key={step.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{step.displayOrder}
                    </span>
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted-foreground">
                      {getGuidedStepActionLabel(step.action)}
                    </span>
                  </div>
                  <div className="font-medium">{step.title}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {step.instruction}
                  </p>
                  {step.payload?.recommendedQuery?.sql ? (
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground line-clamp-1">
                      payload.recommendedQuery: {step.payload.recommendedQuery.sql}
                    </p>
                  ) : null}
                  {step.payload?.sql ? (
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground line-clamp-1">
                      payload.sql: {step.payload.sql}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Move up"
                    disabled={index === 0 || reorderSteps.isPending}
                    onClick={() => void moveStep(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Move down"
                    disabled={
                      index === steps.length - 1 || reorderSteps.isPending
                    }
                    onClick={() => void moveStep(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Edit step"
                    onClick={() => setMode({ type: "edit", step })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Delete step"
                    disabled={deleteStep.isPending}
                    onClick={() => void handleDelete(step)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <Modal
        open={mode.type === "create"}
        title="New guided step"
        onClose={closeModal}
      >
        <GuidedStepForm
          nextDisplayOrder={nextDisplayOrder}
          onSubmit={handleCreate}
          onCancel={closeModal}
          isSubmitting={createStep.isPending}
          submitLabel="Create step"
        />
      </Modal>

      <Modal
        open={mode.type === "edit"}
        title="Edit guided step"
        onClose={closeModal}
      >
        {mode.type === "edit" ? (
          <GuidedStepForm
            key={mode.step.id}
            step={mode.step}
            onSubmit={handleUpdate}
            onCancel={closeModal}
            isSubmitting={updateStep.isPending}
            submitLabel="Save step"
          />
        ) : null}
      </Modal>
    </div>
  );
}
