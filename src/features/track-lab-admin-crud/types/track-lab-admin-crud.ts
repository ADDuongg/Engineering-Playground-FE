export type TrackStatus = "active" | "coming-soon";
export type LabStatus = "active" | "coming-soon";

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

export type MetricCatalogId =
  | "database-metrics"
  | "redis-metrics"
  | "react-metrics";

export type VisualizationKitId =
  | "database-viz"
  | "redis-viz"
  | "react-viz";

export interface AdminTrackView {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: TrackStatus;
  displayOrder: number;
  runtimeAdapterType: RuntimeAdapterType;
  inputSurfaceType: InputSurfaceType;
  metricCatalogId: MetricCatalogId;
  visualizationKitId: VisualizationKitId;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTrackListResponse {
  tracks: AdminTrackView[];
}

export interface CreateTrackRequest {
  slug: string;
  name: string;
  description: string;
  status?: TrackStatus;
  displayOrder?: number;
  runtimeAdapterType: RuntimeAdapterType;
  inputSurfaceType: InputSurfaceType;
  metricCatalogId: MetricCatalogId;
  visualizationKitId: VisualizationKitId;
}

export interface UpdateTrackRequest {
  name?: string;
  description?: string;
  status?: TrackStatus;
  displayOrder?: number;
  runtimeAdapterType?: RuntimeAdapterType;
  inputSurfaceType?: InputSurfaceType;
  metricCatalogId?: MetricCatalogId;
  visualizationKitId?: VisualizationKitId;
}

export interface AdminLabView {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  trackSlug: string;
  sequenceOrder: number;
  status: LabStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLabListResponse {
  labs: AdminLabView[];
}

export interface CreateLabRequest {
  slug: string;
  title: string;
  description?: string | null;
  sequenceOrder: number;
  status?: LabStatus;
}

export interface UpdateLabRequest {
  title?: string;
  description?: string | null;
  sequenceOrder?: number;
  status?: LabStatus;
}
