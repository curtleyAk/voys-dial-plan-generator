// src/app/api/voice/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    console.log("🎤 Generating voice for:", text.substring(0, 50) + "...");

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", // Rachel voice
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      },
    );

    if (!response.ok) {
      console.error(
        "❌ ElevenLabs error:",
        response.status,
        response.statusText,
      );

      // If ElevenLabs fails, return error so component can fallback to browser TTS
      return NextResponse.json(
        { error: "Voice generation failed", fallback: true },
        { status: 503 },
      );
    }

    const audioBuffer = await response.arrayBuffer();
    console.log("✅ Voice generated:", audioBuffer.byteLength, "bytes");

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("💥 Voice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice", fallback: true },
      { status: 500 },
    );
  }
}
