"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

// Component imports - all default exports
import BusinessInputForm from "@/components/BusinessInputForm";
import FlowchartSimple from "@/components/FlowchartSimple";
import FeatureChecklist from "@/components/FeatureChecklist";
import VoicePreview from "@/components/VoicePreview";
import VoysAdminView from "@/components/VoysAdminView";

// Mock data imports
import { MOCK_DIAL_PLAN } from "@/lib/mock-data";
import { MOCK_DIAL_PLAN_MEDICAL } from "@/lib/mock-data-medical";
import { MOCK_DIAL_PLAN_CORPORATE } from "@/lib/mock-data-corporate";
import { MOCK_DIAL_PLAN_HARDWARE } from "@/lib/mock-data-hardware";

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

              {/* NEW: TEST SCENARIO SWITCHER */}
              <div className="flex gap-1 ml-4 border-l pl-4 border-slate-200">
                <span className="text-xs text-slate-400 font-medium self-center mr-2">
                  LOAD TEST:
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN)}
                >
                  Pizza
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN_MEDICAL)}
                >
                  Medical
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN_CORPORATE)}
                >
                  Corporate
                </Button>
                {/* Inside your "LOAD TEST" div */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDialPlanData(MOCK_DIAL_PLAN_HARDWARE)}
                >
                  Hardware
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
            {/* LEFT COLUMN: Features (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <FeatureChecklist features={dialPlanData.features} />
              {/* NEW COMPONENT HERE */}
              <VoicePreview scripts={dialPlanData.voiceScripts} />
            </div>

            {/* RIGHT COLUMN: Visuals (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Flowcharts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FlowchartSimple
                  title="Customer View (Simple)"
                  chartCode={dialPlanData.mermaidSimple}
                />
                <VoysAdminView planData={dialPlanData} />
              </div>

              {/* Implementation Guide */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-6 text-slate-800">
                  Setup Guide
                </h2>
                <div className="space-y-0">
                  {dialPlanData.implementationSteps?.map(
                    (step: any, idx: number) => (
                      <div
                        key={step.step}
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
                        <div className="pt-1">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {step.title}
                          </h3>
                          <p className="text-slate-600 mt-1 mb-2">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
                              ⏱ {step.estimatedTime}
                            </span>
                            <a
                              href="#"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Open Admin Panel →
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
