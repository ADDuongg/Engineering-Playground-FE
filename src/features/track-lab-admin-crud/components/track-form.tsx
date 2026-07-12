"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminFormField,
  AdminSelect,
  AdminTextarea,
} from "@/features/track-lab-admin-crud/components/admin-form-field";
import {
  INPUT_SURFACE_OPTIONS,
  METRIC_CATALOG_OPTIONS,
  RUNTIME_ADAPTER_OPTIONS,
  TRACK_STATUS_OPTIONS,
  VISUALIZATION_KIT_OPTIONS,
} from "@/features/track-lab-admin-crud/constants/track-lab-options";
import {
  createTrackFormSchema,
  updateTrackFormSchema,
  type CreateTrackFormValues,
  type UpdateTrackFormValues,
} from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import type { AdminTrackView } from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface CreateTrackFormProps {
  onSubmit: (values: CreateTrackFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function CreateTrackForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create track",
}: CreateTrackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTrackFormValues>({
    resolver: zodResolver(createTrackFormSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
      status: "coming-soon",
      displayOrder: 0,
      runtimeAdapterType: "playground_postgresql",
      inputSurfaceType: "sql_editor",
      metricCatalogId: "database-metrics",
      visualizationKitId: "database-viz",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField
        label="Slug"
        htmlFor="slug"
        error={errors.slug?.message}
        hint="Lowercase letters, numbers, and hyphens. Cannot be changed later."
      >
        <Input id="slug" placeholder="database-sql" {...register("slug")} />
      </AdminFormField>

      <AdminFormField label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="Database SQL" {...register("name")} />
      </AdminFormField>

      <AdminFormField
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <AdminTextarea id="description" {...register("description")} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Status" htmlFor="status" error={errors.status?.message}>
          <AdminSelect id="status" options={TRACK_STATUS_OPTIONS} {...register("status")} />
        </AdminFormField>

        <AdminFormField
          label="Display order"
          htmlFor="displayOrder"
          error={errors.displayOrder?.message}
        >
          <Input id="displayOrder" type="number" min={0} {...register("displayOrder")} />
        </AdminFormField>
      </div>

      <AdminFormField
        label="Runtime adapter"
        htmlFor="runtimeAdapterType"
        error={errors.runtimeAdapterType?.message}
      >
        <AdminSelect
          id="runtimeAdapterType"
          options={RUNTIME_ADAPTER_OPTIONS}
          {...register("runtimeAdapterType")}
        />
      </AdminFormField>

      <AdminFormField
        label="Input surface"
        htmlFor="inputSurfaceType"
        error={errors.inputSurfaceType?.message}
      >
        <AdminSelect
          id="inputSurfaceType"
          options={INPUT_SURFACE_OPTIONS}
          {...register("inputSurfaceType")}
        />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Metric catalog"
          htmlFor="metricCatalogId"
          error={errors.metricCatalogId?.message}
        >
          <AdminSelect
            id="metricCatalogId"
            options={METRIC_CATALOG_OPTIONS}
            {...register("metricCatalogId")}
          />
        </AdminFormField>

        <AdminFormField
          label="Visualization kit"
          htmlFor="visualizationKitId"
          error={errors.visualizationKitId?.message}
        >
          <AdminSelect
            id="visualizationKitId"
            options={VISUALIZATION_KIT_OPTIONS}
            {...register("visualizationKitId")}
          />
        </AdminFormField>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

interface UpdateTrackFormProps {
  track: AdminTrackView;
  onSubmit: (values: UpdateTrackFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function UpdateTrackForm({
  track,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: UpdateTrackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTrackFormValues>({
    resolver: zodResolver(updateTrackFormSchema),
    defaultValues: {
      name: track.name,
      description: track.description,
      status: track.status,
      displayOrder: track.displayOrder,
      runtimeAdapterType: track.runtimeAdapterType,
      inputSurfaceType: track.inputSurfaceType,
      metricCatalogId: track.metricCatalogId,
      visualizationKitId: track.visualizationKitId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField label="Slug" htmlFor="track-slug">
        <Input id="track-slug" value={track.slug} disabled readOnly />
      </AdminFormField>

      <AdminFormField label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register("name")} />
      </AdminFormField>

      <AdminFormField
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <AdminTextarea id="description" {...register("description")} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Status" htmlFor="status" error={errors.status?.message}>
          <AdminSelect id="status" options={TRACK_STATUS_OPTIONS} {...register("status")} />
        </AdminFormField>

        <AdminFormField
          label="Display order"
          htmlFor="displayOrder"
          error={errors.displayOrder?.message}
        >
          <Input id="displayOrder" type="number" min={0} {...register("displayOrder")} />
        </AdminFormField>
      </div>

      <AdminFormField
        label="Runtime adapter"
        htmlFor="runtimeAdapterType"
        error={errors.runtimeAdapterType?.message}
      >
        <AdminSelect
          id="runtimeAdapterType"
          options={RUNTIME_ADAPTER_OPTIONS}
          {...register("runtimeAdapterType")}
        />
      </AdminFormField>

      <AdminFormField
        label="Input surface"
        htmlFor="inputSurfaceType"
        error={errors.inputSurfaceType?.message}
      >
        <AdminSelect
          id="inputSurfaceType"
          options={INPUT_SURFACE_OPTIONS}
          {...register("inputSurfaceType")}
        />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Metric catalog"
          htmlFor="metricCatalogId"
          error={errors.metricCatalogId?.message}
        >
          <AdminSelect
            id="metricCatalogId"
            options={METRIC_CATALOG_OPTIONS}
            {...register("metricCatalogId")}
          />
        </AdminFormField>

        <AdminFormField
          label="Visualization kit"
          htmlFor="visualizationKitId"
          error={errors.visualizationKitId?.message}
        >
          <AdminSelect
            id="visualizationKitId"
            options={VISUALIZATION_KIT_OPTIONS}
            {...register("visualizationKitId")}
          />
        </AdminFormField>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
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
