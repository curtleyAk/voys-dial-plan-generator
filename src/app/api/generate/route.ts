// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

// n8n webhook URL
const N8N_WEBHOOK_URL =
  "https://n8n.eu-staging.holodeck.voys.nl/webhook/4a8c1ce5-59fa-4cb3-9ab0-acc2f9859ad0";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📥 Received form data:", {
      businessName: body.businessName,
      businessType: body.businessType,
      staffCount: body.staffCount,
    });

    // Prepare payload for n8n
    const n8nPayload = {
      businessName: body.businessName,
      businessType: body.businessType,
      staffCount: body.staffCount,
      openTime: body.openTime,
      closeTime: body.closeTime,
      specialNeeds: body.specialNeeds,
      hours: `${body.openTime}-${body.closeTime}`,
      // Full description for the AI agent
      description: `${body.businessName} is a ${body.businessType} with ${body.staffCount} staff members. Operating hours: ${body.openTime} to ${body.closeTime}. Special requirements: ${body.specialNeeds}`,
    };

    console.log("🚀 Calling n8n webhook...");
    console.log("📍 URL:", N8N_WEBHOOK_URL);
    console.log("📦 Payload:", JSON.stringify(n8nPayload, null, 2));

    // Call n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(n8nPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(
      "📡 n8n Response Status:",
      n8nResponse.status,
      n8nResponse.statusText,
    );

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("❌ n8n webhook failed:", {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        body: errorText,
      });

      throw new Error(`n8n webhook failed with status ${n8nResponse.status}`);
    }

    const dialPlan = await n8nResponse.json();
    console.log("✅ Received dial plan from n8n");
    console.log("📊 Plan summary:", {
      nodes: dialPlan?.dialPlan?.nodes?.length || 0,
      features: dialPlan?.features?.length || 0,
      hasVoiceScripts: !!dialPlan?.voiceScripts,
    });

    return NextResponse.json(dialPlan);
  } catch (error) {
    console.error("💥 Generation error:", error);

    // Detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
    }

    // Use fallback mock data
    console.log("🔄 Using fallback mock data");
    const { MOCK_DIAL_PLAN } = await import("@/lib/mock-data");

    return NextResponse.json({
      ...MOCK_DIAL_PLAN,
      _fallback: true,
      _error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
