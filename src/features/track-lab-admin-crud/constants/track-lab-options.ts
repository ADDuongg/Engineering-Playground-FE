import type {
  InputSurfaceType,
  MetricCatalogId,
  RuntimeAdapterType,
  TrackStatus,
  VisualizationKitId,
} from "@/features/track-lab-admin-crud/types/track-lab-admin-crud";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const TRACK_STATUS_OPTIONS: SelectOption<TrackStatus>[] = [
  { value: "active", label: "Active" },
  { value: "coming-soon", label: "Coming soon" },
];

export const LAB_STATUS_OPTIONS = TRACK_STATUS_OPTIONS;

export const RUNTIME_ADAPTER_OPTIONS: SelectOption<RuntimeAdapterType>[] = [
  { value: "playground_postgresql", label: "PostgreSQL playground" },
  { value: "playground_redis", label: "Redis playground" },
  { value: "headless_react_sandbox", label: "Headless React sandbox" },
  { value: "simulation_engine", label: "Simulation engine" },
];

export const INPUT_SURFACE_OPTIONS: SelectOption<InputSurfaceType>[] = [
  { value: "sql_editor", label: "SQL editor" },
  { value: "command_panel", label: "Command panel" },
  { value: "component_sandbox", label: "Component sandbox" },
  { value: "config_form", label: "Config form" },
];

export const METRIC_CATALOG_OPTIONS: SelectOption<MetricCatalogId>[] = [
  { value: "database-metrics", label: "Database metrics" },
  { value: "redis-metrics", label: "Redis metrics" },
  { value: "react-metrics", label: "React metrics" },
];

export const VISUALIZATION_KIT_OPTIONS: SelectOption<VisualizationKitId>[] = [
  { value: "database-viz", label: "Database visualization" },
  { value: "redis-viz", label: "Redis visualization" },
  { value: "react-viz", label: "React visualization" },
];

export function getOptionLabel<T extends string>(
  options: SelectOption<T>[],
  value: T,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
