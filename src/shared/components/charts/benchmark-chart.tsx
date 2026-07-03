"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/shared/lib/utils";

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BenchmarkChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  className?: string;
}

export function BenchmarkChart({
  data,
  dataKey = "value",
  className,
}: BenchmarkChartProps) {
  return (
    <div className={cn("h-64 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="oklch(26% 0.01 250)" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="oklch(62% 0.012 250)"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="oklch(62% 0.012 250)"
            fontSize={11}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(20% 0.012 250)",
              border: "1px solid oklch(26% 0.01 250)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="oklch(62% 0.18 255)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
