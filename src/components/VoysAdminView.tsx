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
  Filter,
  User,
  Mic,
} from "lucide-react";

interface Props {
  planData: any; // Expects the full dialPlan object { nodes: [], edges: [] }
}

const TYPE_CONFIG: Record<string, any> = {
  entryPoint: {
    icon: Phone,
    label: "Inbound Call",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  filter: {
    icon: Filter,
    label: "Smart Filter",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  user: {
    icon: User,
    label: "User",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  musicOnHold: {
    icon: Music,
    label: "Music on Hold",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  timeCondition: {
    icon: Clock,
    label: "Opening Hours",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  announcement: {
    icon: MessageSquare,
    label: "Message",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  variableAnnouncement: {
    icon: Mic,
    label: "Var. Announcement",
    color: "text-slate-700",
    bg: "bg-white",
    border: "border-slate-200",
  },
  ivr: {
    icon: GitFork,
    label: "IVR Menu",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  callGroup: {
    icon: Users,
    label: "Call Group",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  voicemail: {
    icon: Voicemail,
    label: "Voicemail",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

export default function VoysAdminView({ planData }: Props) {
  // Safely access nodes/edges from the passed prop
  const nodes = planData?.nodes || [];
  const edges = planData?.edges || [];

  const getNode = (id: string) => nodes.find((n: any) => n.id === id);

  // Recursive Tree Component
  const NodeTree = ({
    nodeId,
    stepNumber,
    visited = new Set(),
  }: {
    nodeId: string;
    stepNumber: string;
    visited?: Set<string>;
  }) => {
    const node = getNode(nodeId);
    if (!node) return null;

    // Detect loops
    if (visited.has(nodeId)) {
      return (
        <div className="ml-8 mt-2 p-2 border border-dashed border-slate-300 rounded text-xs text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-3 h-3" /> Re-enters flow at {node.label}
        </div>
      );
    }
    const newVisited = new Set(visited).add(nodeId);

    // Find outgoing edges (children)
    // Note: React Flow uses 'source' and 'target'
    const childrenEdges = edges.filter((e: any) => e.source === nodeId);

    // Get config or default
    const config = TYPE_CONFIG[node.type] || {
      icon: ArrowRight,
      label: node.type,
      color: "text-gray-500",
      bg: "bg-gray-50",
      border: "border-gray-200",
    };
    const Icon = config.icon;

    // Determine display labels from data object
    const mainLabel = node.label || config.label;
    const subLabel = node.data?.label || node.data?.description || "";

    return (
      <div className="relative">
        {/* Node Card */}
        <div
          className={`flex items-start justify-between ${config.bg} p-3 rounded border ${config.border} shadow-sm mb-3 relative`}
        >
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-1.5 mt-0.5 rounded ${config.bg} ${config.color} border border-slate-100`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${config.color}`}>
                  {mainLabel}
                </span>
                {node.data?.extension && (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 bg-white"
                  >
                    Ext {node.data.extension}
                  </Badge>
                )}
              </div>

              {subLabel && (
                <div className="text-sm text-slate-600 mt-0.5 leading-snug">
                  {subLabel}
                </div>
              )}

              {/* Specific metadata rendering */}
              {node.data?.email && (
                <div className="text-xs text-slate-400 mt-1">
                  📧 {node.data.email}
                </div>
              )}
              {node.data?.options && (
                <div className="flex gap-1 mt-1.5">
                  {node.data.options.map((opt: string) => (
                    <Badge
                      key={opt}
                      variant="secondary"
                      className="text-[10px] h-4 px-1"
                    >
                      {opt}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2">
            {/* Play button for audio types */}
            {["announcement", "voicemail", "ivr", "musicOnHold"].includes(
              node.type,
            ) && (
              <button className="p-1 hover:bg-slate-200/50 rounded transition-colors">
                <PlayCircle className="w-4 h-4 text-slate-400 hover:text-blue-600" />
              </button>
            )}
            <Badge
              variant="outline"
              className="bg-white/50 text-slate-500 font-mono text-[10px] border-slate-200"
            >
              Step {stepNumber}
            </Badge>
          </div>
        </div>

        {/* Render Children */}
        {childrenEdges.length > 0 && (
          <div className="ml-5 border-l-2 border-slate-100 pl-4 space-y-2 pb-2">
            {childrenEdges.map((edge: any, index: number) => {
              const childStepNumber = `${stepNumber}.${index + 1}`;
              return (
                <div key={edge.id} className="relative pt-1">
                  {/* Connection Line & Label */}
                  <div className="absolute -left-4 top-5 w-4 h-px bg-slate-300"></div>

                  {edge.label && (
                    <div className="absolute -left-2 -top-2 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 z-10">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">
                        {edge.label}
                      </span>
                    </div>
                  )}

                  <div className={edge.label ? "mt-4" : "mt-0"}>
                    <NodeTree
                      nodeId={edge.target}
                      stepNumber={childStepNumber}
                      visited={newVisited}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const rootNode = nodes.find((n: any) => n.type === "entryPoint") || nodes[0];

  return (
    <Card className="h-full bg-slate-50/50 border-slate-200 shadow-sm flex flex-col">
      <CardHeader className="pb-4 bg-white border-b border-slate-100 flex-none">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              V
            </div>
            Admin Route View
          </CardTitle>
          <Badge variant="outline" className="text-xs font-normal">
            {nodes.length} Modules
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 overflow-y-auto flex-1">
        {rootNode ? (
          <div className="max-w-3xl mx-auto">
            <NodeTree nodeId={rootNode.id} stepNumber="1" />
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>No dial plan loaded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
