"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const settingsSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  editorFontSize: z.coerce.number().min(10).max(24),
  defaultDataset: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "Nguyen Van Duong",
      email: "duong@example.com",
      editorFontSize: 14,
      defaultDataset: "users-1m",
    },
  });

  const onSubmit = (_data: SettingsFormValues) => {
    // Service not implemented
  };

  return (
    <>
      <AppTopbar title="Settings" />
      <main className="mx-auto max-w-2xl flex-1 overflow-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <h3 className="mb-4 font-semibold">Profile</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" className="mt-2" {...register("displayName")} />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-danger">{errors.displayName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-2" {...register("email")} />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 font-semibold">Editor preferences</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editorFontSize">Font size</Label>
                <Input
                  id="editorFontSize"
                  type="number"
                  className="mt-2 w-24"
                  {...register("editorFontSize")}
                />
              </div>
              <div>
                <Label htmlFor="defaultDataset">Default dataset</Label>
                <select
                  id="defaultDataset"
                  className="mt-2 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm"
                  {...register("defaultDataset")}
                >
                  <option value="users-1m">users · 1M rows</option>
                  <option value="orders-500k">orders · 500K</option>
                  <option value="products-50k">products · 50K</option>
                </select>
              </div>
            </div>
          </Card>
          <Button type="submit">Save changes</Button>
        </form>
      </main>
    </>
  );
}
