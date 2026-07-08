import { ApiRequestError } from "@/shared/types/api";
import { trackSlugSchema } from "@/features/tracks/schemas/track-schema";

export function isValidTrackSlug(slug: string): boolean {
  return trackSlugSchema.safeParse(slug).success;
}

export function assertValidTrackSlug(slug: string): void {
  const result = trackSlugSchema.safeParse(slug);
  if (!result.success) {
    throw new ApiRequestError(
      400,
      "VALIDATION_ERROR",
      `Invalid track slug format: "${slug}"`,
    );
  }
}

export function isTrackNotFoundError(error: unknown): error is ApiRequestError {
  return (
    error instanceof ApiRequestError &&
    error.status === 404 &&
    error.code === "NOT_FOUND"
  );
}
