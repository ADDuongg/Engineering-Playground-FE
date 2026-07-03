import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspacePanelState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleBottom: () => void;
}

export const useWorkspaceStore = create<WorkspacePanelState>()(
  persist(
    (set) => ({
      leftPanelOpen: true,
      rightPanelOpen: true,
      bottomPanelOpen: true,
      leftPanelWidth: 280,
      rightPanelWidth: 360,
      toggleLeft: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
      toggleRight: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
      toggleBottom: () => set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),
    }),
    { name: "workspace-state" },
  ),
);
