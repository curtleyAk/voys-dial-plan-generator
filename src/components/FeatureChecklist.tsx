"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Mic,
  Phone,
  Music,
  Info,
  ExternalLink,
  Volume2,
  Filter,
  Headphones,
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  helpUrl: string;
  used: boolean;
}

interface Props {
  features: Feature[];
}

const ICON_MAP: Record<string, any> = {
  voip_account: Phone,
  users: Users,
  phone_number: Phone,
  opening_hours_basic: Clock,
  opening_hours_advanced: Clock,
  call_group: Users,
  messages: Volume2,
  voicemail: Mic,
  queue: Headphones,
  ivr: Phone,
  announcements: Music,
  caller_name: Info,
  call_recording: Mic,
  fixed_mobile: Phone,
  filter: Filter,
  sounds: Music,
  music_on_hold: Music,
};

export default function FeatureChecklist({ features }: Props) {
  const activeFeatures = features.filter((f) => f.used);
  const inactiveFeatures = features.filter((f) => !f.used);

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Active Features</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {activeFeatures.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Your plan requires these Voys modules.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {activeFeatures.map((feature) => {
            const Icon = ICON_MAP[feature.id] || Info;
            return (
              <div
                key={feature.id}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Checkbox
                  id={feature.id}
                  checked={true}
                  disabled
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none flex-1">
                  <label
                    htmlFor={feature.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="flex-1">{feature.name}</span>
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <button type="button" className="flex-shrink-0">
                            <Info className="h-3 w-3 text-slate-400 cursor-help hover:text-slate-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-slate-900 text-white">
                          <p>{feature.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <a
                    href={feature.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 flex items-center hover:underline gap-1 w-fit"
                  >
                    View Documentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {inactiveFeatures.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-500 mb-3">
              Available Upgrades
            </h4>
            <div className="space-y-3 opacity-60">
              {inactiveFeatures.map((feature) => {
                const Icon = ICON_MAP[feature.id] || Info;
                return (
                  <div
                    key={feature.id}
                    className="flex items-center space-x-3 p-1"
                  >
                    <Checkbox
                      id={`inactive-${feature.id}`}
                      checked={false}
                      disabled
                    />
                    <Icon className="h-3 w-3 text-slate-400" />
                    <label
                      htmlFor={`inactive-${feature.id}`}
                      className="text-sm text-slate-500"
                    >
                      {feature.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
