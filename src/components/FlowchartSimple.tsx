"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLayoutedElements } from "@/lib/layout-utils";
import {
  Phone,
  Clock,
  Users,
  Mic,
  ArrowRight,
  GitFork,
  Music,
} from "lucide-react";

// --- CUSTOM NODE COMPONENTS ---
// This makes the nodes look pretty (Card style)
const CustomNode = ({ data }: any) => {
  const Icon = data.icon || ArrowRight;
  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-white border-2 min-w-[150px] text-center ${data.borderColor || "border-slate-200"}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400"
      />
      <div className="flex flex-col items-center gap-1">
        <div className={`p-2 rounded-full ${data.bg || "bg-slate-100"}`}>
          <Icon className={`w-4 h-4 ${data.color || "text-slate-500"}`} />
        </div>
        <div className="font-bold text-xs text-slate-700">{data.label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-400"
      />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

interface Props {
  chartCode: string; // We'll ignore this now
  title?: string;
}

// Helper to parse Mermaid string into React Flow Nodes (Simple Parser)
// In a real app, we'd use the JSON directly, but this bridges your current setup.
const parseMermaidToFlow = (code: string) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  const lines = code.split("\n");

  lines.forEach((line) => {
    // 1. Find Nodes: id["Label"]
    const nodeMatch = line.match(/(\w+)\["([^"]+)"\]/);
    if (nodeMatch) {
      const [_, id, label] = nodeMatch;
      // Assign icons/colors based on label keywords
      let icon = ArrowRight;
      let color = "text-slate-500";
      let bg = "bg-slate-100";
      let borderColor = "border-slate-200";

      const l = label.toLowerCase();
      if (l.includes("call") || l.includes("line")) {
        icon = Phone;
        color = "text-blue-500";
        bg = "bg-blue-50";
        borderColor = "border-blue-200";
      }
      if (l.includes("time") || l.includes("open")) {
        icon = Clock;
        color = "text-orange-500";
        bg = "bg-orange-50";
        borderColor = "border-orange-200";
      }
      if (l.includes("ring") || l.includes("staff")) {
        icon = Users;
        color = "text-green-500";
        bg = "bg-green-50";
        borderColor = "border-green-200";
      }
      if (l.includes("voice") || l.includes("message")) {
        icon = Mic;
        color = "text-purple-500";
        bg = "bg-purple-50";
        borderColor = "border-purple-200";
      }
      if (l.includes("queue")) {
        icon = Music;
        color = "text-pink-500";
        bg = "bg-pink-50";
        borderColor = "border-pink-200";
      }
      if (l.includes("press")) {
        icon = GitFork;
        color = "text-indigo-500";
        bg = "bg-indigo-50";
        borderColor = "border-indigo-200";
      }

      if (!nodes.find((n) => n.id === id)) {
        nodes.push({
          id,
          type: "custom",
          data: { label, icon, color, bg, borderColor },
          position: { x: 0, y: 0 },
        });
      }
    }

    // 2. Find Edges: id1 --> id2
    // Also handles labels: id1 -->|"Yes"| id2
    const edgeMatch = line.match(/(\w+)\s*-->\s*\|?"?([^"|]*)"?\|?\s*(\w+)/);
    if (edgeMatch) {
      // If we have a label (3 groups), or just source->target (logic varies)
      // Simple regex for id --> id
      const simpleMatch = line.match(/(\w+)\s*-->\s*(\w+)/);
      if (simpleMatch && !line.includes("|")) {
        edges.push({
          id: `e-${simpleMatch[1]}-${simpleMatch[2]}`,
          source: simpleMatch[1],
          target: simpleMatch[2],
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Labeled edge
      const labelMatch = line.match(/(\w+)\s*-->\|"([^"]+)"\|\s*(\w+)/);
      if (labelMatch) {
        edges.push({
          id: `e-${labelMatch[1]}-${labelMatch[3]}`,
          source: labelMatch[1],
          target: labelMatch[3],
          label: labelMatch[2],
          type: "smoothstep",
          labelStyle: { fill: "#64748b", fontWeight: 700, fontSize: 11 },
          style: { stroke: "#94a3b8" },
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    }
  });

  return { nodes, edges };
};

export default function FlowchartSimple({
  chartCode,
  title = "Call Flow",
}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // 1. Parse the dirty Mermaid string into nice Objects
    const { nodes: initialNodes, edges: initialEdges } =
      parseMermaidToFlow(chartCode);

    // 2. Auto-layout them nicely
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [chartCode, setNodes, setEdges]);

  return (
    <Card className="h-full shadow-sm flex flex-col">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-lg font-medium text-slate-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-[400px] bg-slate-50 relative">
        <div className="absolute inset-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#e2e8f0" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
