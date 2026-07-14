import type { ReactScenarioPayload } from "@/shared/labs";
import { runReactExperimentInputSchema } from "@/features/react-sandbox-runtime/schemas/react-sandbox-schema";
import type {
  ReactSandboxInteraction,
  ReactSandboxRunOptions,
  RunReactExperimentInput,
} from "@/features/react-sandbox-runtime/types/react-sandbox";

export class ReactSandboxMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReactSandboxMappingError";
  }
}

function mapInteractions(
  interactions: unknown[] | undefined,
): ReactSandboxInteraction[] | undefined {
  if (!interactions || interactions.length === 0) {
    return undefined;
  }

  return interactions.map((item, index) => {
    if (
      item &&
      typeof item === "object" &&
      "type" in item &&
      typeof (item as { type: unknown }).type === "string" &&
      (item as { type: string }).type.length > 0
    ) {
      const typed = item as { type: string; payload?: unknown };
      return {
        type: typed.type,
        ...(typed.payload !== undefined ? { payload: typed.payload } : {}),
      };
    }

    throw new ReactSandboxMappingError(
      `Invalid interaction at index ${index}: expected { type: string }.`,
    );
  });
}

function mapOptions(
  options: ReactScenarioPayload["options"] | undefined,
): ReactSandboxRunOptions | undefined {
  if (!options) {
    return undefined;
  }

  const mapped: ReactSandboxRunOptions = {};
  if (typeof options.memo === "boolean") {
    mapped.memo = options.memo;
  }
  if (options.keyStrategy === "index" || options.keyStrategy === "stable") {
    mapped.keyStrategy = options.keyStrategy;
  }

  return Object.keys(mapped).length > 0 ? mapped : undefined;
}

export interface MapReactScenarioToRunInputArgs {
  action: string;
  labSlug: string;
  trackSlug?: string;
  scenario: ReactScenarioPayload;
}

/**
 * Build a contract-safe run DTO from a guided React scenario.
 * Never includes `componentSource` (backend rejects it with VALIDATION_ERROR).
 */
export function mapReactScenarioToRunInput(
  args: MapReactScenarioToRunInputArgs,
): RunReactExperimentInput {
  const fixtureId = args.scenario.scenarioId?.trim();
  if (!fixtureId) {
    throw new ReactSandboxMappingError(
      "This guided step is missing a fixture id (scenarioId).",
    );
  }

  const action = args.action.trim();
  if (!action) {
    throw new ReactSandboxMappingError("React experiment action is required.");
  }

  const labSlug = args.labSlug.trim();
  if (!labSlug) {
    throw new ReactSandboxMappingError("Lab slug is required for React runs.");
  }

  const input: RunReactExperimentInput = {
    action,
    fixtureId,
    labSlug,
  };

  if (args.trackSlug?.trim()) {
    input.trackSlug = args.trackSlug.trim();
  }

  if (args.scenario.props && Object.keys(args.scenario.props).length > 0) {
    input.props = args.scenario.props;
  }

  const interactions = mapInteractions(args.scenario.interactions);
  if (interactions) {
    input.interactions = interactions;
  }

  const options = mapOptions(args.scenario.options);
  if (options) {
    input.options = options;
  }

  return runReactExperimentInputSchema.parse(input);
}
