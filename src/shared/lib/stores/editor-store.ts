import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorPreferences {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;
}

export const useEditorStore = create<EditorPreferences>()(
  persist(
    (set) => ({
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
    }),
    { name: "editor-preferences" },
  ),
);
