import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { APP_NAME } from "@/shared/constants/routes";
import { AppProviders } from "@/shared/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description:
    "Interactive learning platform where developers understand databases through experimentation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          <AuthProvider>{children}</AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
