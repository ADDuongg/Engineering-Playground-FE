export function getUserInitials(
  displayName?: string | null,
  email?: string | null,
): string {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }

  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase();
  }

  return "?";
}
