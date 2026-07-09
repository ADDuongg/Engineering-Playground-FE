"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      toastOptions={{
        style: {
          background: "oklch(20% 0.012 250)",
          border: "1px solid oklch(26% 0.01 250)",
          color: "oklch(96% 0.005 250)",
        },
      }}
    />
  );
}
