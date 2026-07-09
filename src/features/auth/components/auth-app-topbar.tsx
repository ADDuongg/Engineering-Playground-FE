"use client";

import { AppTopbar } from "@/shared/components/layout/app-topbar";
import { AuthAvatarMenu } from "@/features/auth/components/auth-avatar-menu";

interface AuthAppTopbarProps {
  title: string;
  badge?: string;
  actions?: React.ReactNode;
}

export function AuthAppTopbar(props: AuthAppTopbarProps) {
  return <AppTopbar {...props} avatar={<AuthAvatarMenu />} />;
}
