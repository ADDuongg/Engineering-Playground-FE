import { create } from "zustand";
import { persist } from "zustand/middleware";

const LEFT_PANEL_MIN = 240;
const LEFT_PANEL_MAX = 560;
const LEFT_PANEL_DEFAULT = 320;

interface WorkspacePanelState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleBottom: () => void;
  setLeftPanelWidth: (width: number) => void;
}

function clampLeftPanelWidth(width: number): number {
  return Math.min(LEFT_PANEL_MAX, Math.max(LEFT_PANEL_MIN, Math.round(width)));
}

export const useWorkspaceStore = create<WorkspacePanelState>()(
  persist(
    (set) => ({
      leftPanelOpen: true,
      rightPanelOpen: true,
      bottomPanelOpen: true,
      leftPanelWidth: LEFT_PANEL_DEFAULT,
      rightPanelWidth: 360,
      toggleLeft: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
      toggleRight: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
      toggleBottom: () => set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),
      setLeftPanelWidth: (width) =>
        set({ leftPanelWidth: clampLeftPanelWidth(width) }),
    }),
    { name: "workspace-state" },
  ),
);

export const WORKSPACE_LEFT_PANEL_MIN = LEFT_PANEL_MIN;
export const WORKSPACE_LEFT_PANEL_MAX = LEFT_PANEL_MAX;
