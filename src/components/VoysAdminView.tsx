"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Voicemail,
  PlayCircle,
  Music,
  Phone,
  GitFork,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface Props {
  planData: any;
}

const TYPE_CONFIG: Record<string, any> = {
  entryPoint: {
    icon: Phone,
    label: "Inbound call",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  timeCondition: {
    icon: Clock,
    label: "Opening hours",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  callGroup: {
    icon: Users,
    label: "Call group",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  voicemail: {
    icon: Voicemail,
    label: "Voicemail",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  queue: {
    icon: Music,
    label: "Queue",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  ivr: {
    icon: GitFork,
    label: "IVR menu",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  announcement: {
    icon: MessageSquare,
    label: "Message",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  external: {
    icon: ArrowRight,
    label: "Fixed destination",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
};

export default function VoysAdminView({ planData }: Props) {
  const nodes = planData?.dialPlan?.nodes || [];
  const edges = planData?.dialPlan?.edges || [];

  // Safety check
  if (!planData || !planData.dialPlan) {
    return (
      <Card className="h-full bg-slate-50/50 border-slate-200 shadow-sm">
        <CardHeader className="pb-4 bg-white border-b border-slate-100">
          <CardTitle className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              V
            </div>
            Voys Freedom Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex items-center justify-center">
          <p className="text-slate-400">No dial plan data available</p>
        </CardContent>
      </Card>
    );
  }
  // Helper to get node data
  const getNode = (id: string) => nodes.find((n: any) => n.id === id);

  // Recursive component to render the tree
  const NodeTree = ({
    nodeId,
    stepNumber,
    visited = new Set(),
    depth = 0,
  }: {
    nodeId: string;
    stepNumber: string;
    visited?: Set<string>;
    depth?: number;
  }) => {
    const node = getNode(nodeId);
    if (!node) return null;

    // Cycle detection
    if (visited.has(nodeId)) {
      return (
        <div className="ml-8 mt-2 p-2 border border-dashed border-slate-300 rounded text-xs text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-3 h-3" /> Re-enters flow at step{" "}
          {node.label}
        </div>
      );
    }
    const newVisited = new Set(visited).add(nodeId);

    // Find children (outgoing edges)
    const childrenEdges = edges.filter((e: any) => e.from === nodeId);
    const config = TYPE_CONFIG[node.type] || {
      icon: Phone,
      label: "Step",
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
    };
    const Icon = config.icon;

    return (
      <div className="relative">
        {/* The Node Card */}
        <div
          className={`flex items-center justify-between ${config.bg} p-3 rounded border ${config.border} shadow-sm group hover:border-blue-400 transition-colors mb-2 relative`}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-1.5 rounded ${config.bg} ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${config.color}`}>
                  {config.label}
                </span>
                {node.config?.number && (
                  <Badge variant="outline" className="text-xs">
                    {node.config.number}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-slate-600 mt-0.5">
                {node.config?.description || node.simpleLabel || node.label}
              </div>
              {node.config?.timeout && (
                <div className="flex items-center text-xs text-slate-400 gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {node.config.timeout}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Play button for audio nodes */}
            {["announcement", "voicemail", "ivr"].includes(node.type) && (
              <button className="p-1 hover:bg-slate-100 rounded">
                <PlayCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
              </button>
            )}
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-600 font-mono text-xs"
            >
              {stepNumber}
            </Badge>
          </div>
        </div>

        {/* Children Container */}
        {childrenEdges.length > 0 && (
          <div className={`${depth > 0 ? "ml-8" : "ml-4"} space-y-2`}>
            {childrenEdges.map((edge: any, index: number) => {
              // Calculate hierarchical numbering (e.g., 1.1, 1.2, 1.1.1)
              const childStepNumber = `${stepNumber}.${index + 1}`;

              return (
                <div
                  key={`${edge.from}-${edge.to}-${index}`}
                  className="relative"
                >
                  {/* Connection Label Badge */}
                  {edge.label && (
                    <div className="flex items-center gap-2 mb-1 ml-4">
                      <div className="h-px w-4 bg-slate-300"></div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-50 text-slate-600 border-slate-300"
                      >
                        {edge.label}
                      </Badge>
                    </div>
                  )}

                  <NodeTree
                    nodeId={edge.to}
                    stepNumber={childStepNumber}
                    visited={newVisited}
                    depth={depth + 1}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Find root node (usually entryPoint)
  const rootNode = nodes.find((n: any) => n.type === "entryPoint") || nodes[0];

  return (
    <Card className="h-full bg-slate-50/50 border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="pb-4 bg-white border-b border-slate-100 flex-none">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              V
            </div>
            Voys Freedom Visualizer
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {nodes.length} steps
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 overflow-auto flex-1">
        <div className="max-w-4xl">
          {rootNode ? (
            <NodeTree nodeId={rootNode.id} stepNumber="1" />
          ) : (
            <div className="text-center text-slate-400 py-10">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No dial plan data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
