// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📥 Received form data:", body);

    // Call your n8n webhook
    const n8nResponse = await fetch(
      "https://n8n.eu-staging.holodeck.voys.nl/webhook-test/49ebcf4a-a934-4a5b-abe0-a0ad2fb1a097",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: body.businessName,
          businessType: body.businessType,
          staffCount: body.staffCount,
          openTime: body.openTime,
          closeTime: body.closeTime,
          specialNeeds: body.specialNeeds,
          // Send full description as well
          description: `${body.businessName} is a ${body.businessType} with ${body.staffCount} staff members. Operating hours: ${body.openTime} to ${body.closeTime}. Special requirements: ${body.specialNeeds}`,
        }),
      },
    );

    if (!n8nResponse.ok) {
      console.error(
        "❌ n8n webhook failed:",
        n8nResponse.status,
        n8nResponse.statusText,
      );
      throw new Error(`n8n webhook failed with status ${n8nResponse.status}`);
    }

    const dialPlan = await n8nResponse.json();
    console.log("✅ Received dial plan from n8n");

    return NextResponse.json(dialPlan);
  } catch (error) {
    console.error("💥 Generation error:", error);

    // Fallback to mock data for demo
    const { MOCK_DIAL_PLAN } = await import("@/lib/mock-data");
    console.log("🔄 Using fallback mock data");

    return NextResponse.json(MOCK_DIAL_PLAN);
  }
}
