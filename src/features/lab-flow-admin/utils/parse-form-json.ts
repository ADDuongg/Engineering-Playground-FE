export function parseJsonArray(raw: string, fieldLabel: string): unknown[] {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error(`${fieldLabel} must be a JSON array`);
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error && error.message.includes("must be a JSON")) {
      throw error;
    }
    throw new Error(`${fieldLabel} must be valid JSON`);
  }
}

export function parseOptionalJsonObject(
  raw: string | undefined,
  fieldLabel: string,
): Record<string, unknown> | null {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      throw new Error(`${fieldLabel} must be a JSON object`);
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.message.includes("must be a JSON")) {
      throw error;
    }
    throw new Error(`${fieldLabel} must be valid JSON`);
  }
}

export function parseTierList(raw: string): string[] {
  const tiers = raw
    .split(/[,\n]/)
    .map((tier) => tier.trim())
    .filter(Boolean);

  if (tiers.length === 0) {
    throw new Error("At least one recommended tier is required");
  }

  return tiers;
}
