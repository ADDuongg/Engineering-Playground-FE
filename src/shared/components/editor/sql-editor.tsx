"use client";

import dynamic from "next/dynamic";
import { useEditorStore } from "@/shared/lib/stores/editor-store";
import { cn } from "@/shared/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
});

interface SqlEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function SqlEditor({
  value,
  onChange,
  readOnly = false,
  className,
}: SqlEditorProps) {
  const { fontSize, tabSize, wordWrap } = useEditorStore();

  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-lg border border-border bg-editor-bg",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-3 py-2 text-sm">
        <span className="text-muted-foreground">SQL Editor</span>
      </div>
      {/* Absolute fill so Monaco gets a real pixel height even when parent is not a sized flex column */}
      <div className="relative min-h-[160px] flex-1">
        <div className="absolute inset-0">
          <MonacoEditor
            height="100%"
            defaultLanguage="sql"
            theme="vs-dark"
            value={value}
            onChange={(v) => onChange?.(v ?? "")}
            options={{
              readOnly,
              fontSize,
              tabSize,
              wordWrap: wordWrap ? "on" : "off",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              padding: { top: 16 },
            }}
          />
        </div>
      </div>
    </div>
  );
}
