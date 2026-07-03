"use client";

import dynamic from "next/dynamic";
import { cn } from "@/shared/lib/utils";

const ReactFlow = dynamic(
  () => import("reactflow").then((mod) => mod.ReactFlow),
  { ssr: false },
);
const Background = dynamic(
  () => import("reactflow").then((mod) => mod.Background),
  { ssr: false },
);
const Controls = dynamic(
  () => import("reactflow").then((mod) => mod.Controls),
  { ssr: false },
);

import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
}

export function FlowCanvas({ nodes, edges, className }: FlowCanvasProps) {
  return (
    <div
      className={cn(
        "relative min-h-[280px] overflow-hidden rounded-lg border border-border bg-surface-2",
        className,
      )}
    >
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="oklch(26% 0.01 250)" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
