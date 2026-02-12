"use client";

import { useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Clock,
  Users,
  Mic,
  GitFork,
  Music,
  Filter,
  User,
  Voicemail,
} from "lucide-react";

// --- CUSTOM NODE COMPONENT ---
const CustomNode = ({ data }: any) => {
  const getIcon = () => {
    if (data.icon) return data.icon;
    const l = (data.label || "").toLowerCase();
    if (l.includes("user") || l.includes("partner")) return User;
    if (l.includes("group")) return Users;
    if (l.includes("filter") || l.includes("vip")) return Filter;
    if (l.includes("time") || l.includes("hour")) return Clock;
    if (l.includes("music") || l.includes("hold")) return Music;
    if (l.includes("ivr") || l.includes("menu")) return GitFork;
    if (l.includes("voice") || l.includes("mail")) return Voicemail;
    if (l.includes("welcome") || l.includes("announce")) return Mic;
    return Phone;
  };

  const Icon = getIcon();

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-white border-2 min-w-[150px] text-center ${
        data.active
          ? "border-blue-500 ring-2 ring-blue-100"
          : "border-slate-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="p-2 rounded-full bg-slate-100">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <div className="font-bold text-sm text-slate-800">{data.label}</div>
          {data.description && (
            <div className="text-xs text-slate-500 mt-1">
              {data.description}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-400"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
  entryPoint: CustomNode,
  filter: CustomNode,
  user: CustomNode,
  musicOnHold: CustomNode,
  timeCondition: CustomNode,
  announcement: CustomNode,
  ivr: CustomNode,
  variableAnnouncement: CustomNode,
  callGroup: CustomNode,
  voicemail: CustomNode,
};

interface Props {
  initialNodes: Node[];
  initialEdges: Edge[];
  title?: string;
}

export default function FlowchartSimple({
  initialNodes = [],
  initialEdges = [],
  title = "Dial Plan Visualizer",
}: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      // FIX: Map over nodes to ensure every node has a 'position' object
      // We cast node to 'any' to safely access properties like .label that might exist in your mock data
      // but strictly aren't on the default Node type.
      const safeNodes = initialNodes.map((node, index) => {
        const n = node as any;
        return {
          ...node,
          // If position is missing, assign a default cascaded position
          position: node.position || { x: index * 50, y: index * 80 },
          data: {
            ...node.data,
            // Safely access .label from the raw node object
            label: node.data?.label || n.label,
          },
        };
      });

      setNodes(safeNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <Card className="h-full shadow-sm flex flex-col border-slate-200">
      <CardHeader className="pb-2 border-b border-slate-100 bg-white">
        <CardTitle className="text-lg font-medium text-slate-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-[500px] bg-slate-50 relative">
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
            <Background color="#cbd5e1" gap={20} size={1} />
            <Controls className="bg-white border-slate-200 shadow-sm text-slate-600" />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
