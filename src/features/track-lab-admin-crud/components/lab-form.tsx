"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminFormField,
  AdminSelect,
  AdminTextarea,
} from "@/features/track-lab-admin-crud/components/admin-form-field";
import { LAB_STATUS_OPTIONS } from "@/features/track-lab-admin-crud/constants/track-lab-options";
import {
  createLabFormSchema,
  updateLabFormSchema,
  type CreateLabFormValues,
  type UpdateLabFormValues,
} from "@/features/track-lab-admin-crud/schemas/track-lab-admin-schema";
import type { AdminLabView } from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface CreateLabFormProps {
  trackSlug: string;
  onSubmit: (values: CreateLabFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateLabForm({
  trackSlug,
  onSubmit,
  isSubmitting = false,
}: CreateLabFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLabFormValues>({
    resolver: zodResolver(createLabFormSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
      sequenceOrder: 0,
      status: "coming-soon",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField label="Track" htmlFor="trackSlug">
        <Input id="trackSlug" value={trackSlug} disabled readOnly />
      </AdminFormField>

      <AdminFormField label="Slug" htmlFor="slug" error={errors.slug?.message}>
        <Input id="slug" placeholder="index-playground" {...register("slug")} />
      </AdminFormField>

      <AdminFormField label="Title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" placeholder="Index Playground" {...register("title")} />
      </AdminFormField>

      <AdminFormField
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <AdminTextarea id="description" {...register("description")} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Sequence order"
          htmlFor="sequenceOrder"
          error={errors.sequenceOrder?.message}
        >
          <Input id="sequenceOrder" type="number" min={0} {...register("sequenceOrder")} />
        </AdminFormField>

        <AdminFormField label="Status" htmlFor="status" error={errors.status?.message}>
          <AdminSelect id="status" options={LAB_STATUS_OPTIONS} {...register("status")} />
        </AdminFormField>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating…" : "Create lab"}
      </Button>
    </form>
  );
}

interface UpdateLabFormProps {
  lab: AdminLabView;
  onSubmit: (values: UpdateLabFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function UpdateLabForm({
  lab,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: UpdateLabFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLabFormValues>({
    resolver: zodResolver(updateLabFormSchema),
    defaultValues: {
      title: lab.title,
      description: lab.description ?? "",
      sequenceOrder: lab.sequenceOrder,
      status: lab.status,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AdminFormField label="Slug" htmlFor="lab-slug">
        <Input id="lab-slug" value={lab.slug} disabled readOnly />
      </AdminFormField>

      <AdminFormField label="Track" htmlFor="lab-track">
        <Input id="lab-track" value={lab.trackSlug} disabled readOnly />
      </AdminFormField>

      <AdminFormField label="Title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" {...register("title")} />
      </AdminFormField>

      <AdminFormField
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <AdminTextarea id="description" {...register("description")} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          label="Sequence order"
          htmlFor="sequenceOrder"
          error={errors.sequenceOrder?.message}
        >
          <Input id="sequenceOrder" type="number" min={0} {...register("sequenceOrder")} />
        </AdminFormField>

        <AdminFormField label="Status" htmlFor="status" error={errors.status?.message}>
          <AdminSelect id="status" options={LAB_STATUS_OPTIONS} {...register("status")} />
        </AdminFormField>
      </div>

      <p className="text-xs text-muted-foreground">
        Set status to &quot;Coming soon&quot; to soft-hide a lab from learners.
      </p>

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
