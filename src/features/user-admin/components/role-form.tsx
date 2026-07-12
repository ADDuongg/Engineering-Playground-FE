"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUpdateAdminUserRole } from "@/features/user-admin/hooks/use-update-admin-user-role";
import {
  updateAdminUserRoleRequestSchema,
} from "@/features/user-admin/schemas/user-admin-schema";
import type {
  AdminUserRole,
  AdminUserView,
  UpdateAdminUserRoleRequest,
} from "@/features/user-admin/types/user-admin";
import { formatUserAdminErrorMessage } from "@/features/user-admin/utils/format-user-admin-error";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

const ROLE_OPTIONS: { value: AdminUserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

interface RoleFormProps {
  user: AdminUserView;
}

export function RoleForm({ user }: RoleFormProps) {
  const mutation = useUpdateAdminUserRole(user.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdateAdminUserRoleRequest>({
    resolver: zodResolver(updateAdminUserRoleRequestSchema),
    defaultValues: { role: user.role },
  });

  useEffect(() => {
    reset({ role: user.role });
  }, [user.role, user.updatedAt, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const previousRole = user.role;
    try {
      const updated = await mutation.mutateAsync(values);
      if (updated.role === previousRole) {
        toast.success("Role unchanged");
      } else {
        toast.success(`Role updated to ${updated.role}`);
      }
    } catch (error) {
      toast.error(formatUserAdminErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          className="mt-2 flex h-9 w-full max-w-xs rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={mutation.isPending}
          {...register("role")}
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Demoting the last remaining admin is blocked by the API.
        </p>
      </div>
      <Button type="submit" disabled={mutation.isPending || !isDirty}>
        {mutation.isPending ? "Saving…" : "Save role"}
      </Button>
    </form>
  );
}
