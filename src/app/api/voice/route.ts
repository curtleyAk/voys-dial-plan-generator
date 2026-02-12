// app/api/voice/route.ts
import { NextRequest, NextResponse } from "next/server";

const HUME_TTS_URL = "https://api.hume.ai/v0/tts";

export async function POST(request: NextRequest) {
  try {
    const { text, description } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.HUME_API_KEY;

    if (!apiKey) {
      console.error("❌ HUME_API_KEY not configured");
      return NextResponse.json(
        { error: "Voice API not configured", fallback: true },
        { status: 503 },
      );
    }

    console.log("🎤 Generating voice:", text.substring(0, 50) + "...");

    // Hume AI REST API payload (not SDK)
    // Using simple format without voice specification (let Hume generate)
    const payload = {
      utterances: [
        {
          text: text,
          description:
            description ||
            "Professional, clear, and friendly voice suitable for business telephony",
        },
      ],
      format: {
        type: "mp3",
      },
      num_generations: 1,
      strip_headers: false, // We want the complete audio file with headers
    };

    console.log("📦 Request:", JSON.stringify(payload, null, 2));

    const response = await fetch(HUME_TTS_URL, {
      method: "POST",
      headers: {
        "X-Hume-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Hume API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return NextResponse.json(
        {
          error: `Voice generation failed: ${response.statusText}`,
          fallback: true,
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("📊 Response structure:", Object.keys(data));

    // Extract audio from response
    if (!data.generations || data.generations.length === 0) {
      throw new Error("No generations in response");
    }

    const generation = data.generations[0];
    const base64Audio = generation.audio;

    if (!base64Audio) {
      console.error("❌ No audio found. Generation:", generation);
      throw new Error("No audio in response");
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Audio, "base64");

    console.log("✅ Generated:", audioBuffer.byteLength, "bytes");
    console.log("🆔 Generation ID:", generation.generation_id);
    console.log("⏱️  Duration:", generation.duration, "seconds");

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000",
        "X-Generation-Id": generation.generation_id || "",
      },
    });
  } catch (error) {
    console.error("💥 Voice generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate voice",
        fallback: true,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
