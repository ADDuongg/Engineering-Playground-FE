export type TrackStatus = "active" | "coming-soon";

export type RuntimeAdapterType =
  | "playground_postgresql"
  | "playground_redis"
  | "headless_react_sandbox"
  | "simulation_engine";

export type InputSurfaceType =
  | "sql_editor"
  | "command_panel"
  | "component_sandbox"
  | "config_form";

export interface TrackSummary {
  slug: string;
  name: string;
  description: string;
  status: TrackStatus;
  displayOrder: number;
}

export interface TrackListResponse {
  tracks: TrackSummary[];
}

export interface TrackDetail extends TrackSummary {
  runtimeAdapterType: RuntimeAdapterType;
  inputSurfaceType: InputSurfaceType;
  metricCatalogId: string;
  visualizationKitId: string;
  isLabStartable: boolean;
}
