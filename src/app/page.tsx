"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

// Component imports
import BusinessInputForm from "@/components/BusinessInputForm";
import FlowchartSimple from "@/components/FlowchartSimple";
import FeatureChecklist from "@/components/FeatureChecklist";
import VoicePreview from "@/components/VoicePreview";
import VoysAdminView from "@/components/VoysAdminView";

// Mock data imports
import { MOCK_DIAL_PLAN } from "@/lib/mock-data";
import { MOCK_DIAL_PLAN_MEDICAL } from "@/lib/mock-data-medical";
import { MOCK_DIAL_PLAN_CORPORATE } from "@/lib/mock-data-corporate";

export default function Home() {
  const [dialPlanData, setDialPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const data = await response.json();
      setDialPlanData(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Using backup data.");
      setDialPlanData(MOCK_DIAL_PLAN);
    } finally {
      setLoading(false);
    }
  };

  // RESULTS DASHBOARD
  if (dialPlanData) {
    return (
      <main className="min-h-screen bg-slate-50 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialPlanData(null)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Edit
              </Button>

              {/* TEST SCENARIO SWITCHER */}
              <div className="flex gap-1 ml-4 border-l pl-4 border-slate-200">
                <span className="text-xs text-slate-400 font-medium self-center mr-2">
                  LOAD TEST:
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN)}
                >
                  Pizza Shop
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN_MEDICAL)}
                >
                  Medical Office
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN_CORPORATE)}
                >
                  Law Firm
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN (Checklist & Audio) */}
            <div className="lg:col-span-3 space-y-6">
              <FeatureChecklist features={dialPlanData?.features || []} />
              <VoicePreview scripts={dialPlanData?.voiceScripts || []} />
            </div>

            {/* RIGHT COLUMN (Visuals & Steps) */}
            <div className="lg:col-span-9 space-y-6">
              {/* CHANGE: Removed 'grid grid-cols-1 md:grid-cols-2', changed to vertical stack */}
              <div className="flex flex-col gap-6">
                {/* Visual Flowchart - Full Width */}
                <div className="h-[500px]">
                  {" "}
                  {/* Added explicit height container */}
                  <FlowchartSimple
                    title="Visual Call Flow"
                    initialNodes={dialPlanData?.dialPlan?.nodes || []}
                    initialEdges={dialPlanData?.dialPlan?.edges || []}
                  />
                </div>

                {/* Admin View - Full Width */}
                <VoysAdminView planData={dialPlanData?.dialPlan} />
              </div>

              {/* Implementation Steps */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-slate-800">
                  Setup Guide
                </h2>

                <div className="space-y-0">
                  {dialPlanData.implementationSteps?.map(
                    (step: any, idx: number) => (
                      <div
                        key={step.step || idx}
                        className="flex gap-4 pb-8 relative last:pb-0"
                      >
                        {/* Timeline Line */}
                        {idx !==
                          dialPlanData.implementationSteps.length - 1 && (
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200" />
                        )}

                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm z-10">
                          {step.step}
                        </div>
                        <div className="pt-1 w-full">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {step.title}
                          </h3>
                          <p className="text-slate-600 mt-1 mb-2">
                            {step.description}
                          </p>

                          {/* Actions List */}
                          <div className="bg-slate-50 rounded-md p-4 border border-slate-100 space-y-2">
                            {step.actions?.map((action: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm text-slate-700"
                              >
                                <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">
                                  ✓
                                </span>
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>

                          {/* {step.helpUrl && (
                            <p className="text-slate-500 text-xs mt-3 mb-1">
                              Documentation: {step.helpUrl}
                            </p>
                          )} */}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600 border border-slate-200">
                              ⏱ {step.estimatedTime}
                            </span>

                            <a
                              href={step.helpUrl || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              Open Feature in Freedom{" "}
                              <ArrowLeft className="w-3 h-3 rotate-180" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // INPUT FORM
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <BusinessInputForm onGenerate={handleGenerate} isGenerating={loading} />
    </main>
  );
}
