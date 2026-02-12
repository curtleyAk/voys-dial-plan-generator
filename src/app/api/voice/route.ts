// src/app/api/voice/route.ts
import { NextRequest, NextResponse } from "next/server";

// ElevenLabs API endpoint
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Default voice ID (Rachel - professional female voice)
// You can get other voice IDs from: https://api.elevenlabs.io/v1/voices
const DEFAULT_VOICE_ID = "SAz9YHcvj6GT2YYXdXww"; // Claire voice (professional male)

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.error("❌ ELEVENLABS_API_KEY not set in environment");
      return NextResponse.json(
        { error: "ElevenLabs API key not configured", fallback: true },
        { status: 503 },
      );
    }

    console.log("🎤 Generating voice for:", text.substring(0, 50) + "...");

    const voiceId = voice_id || DEFAULT_VOICE_ID;
    const url = `${ELEVENLABS_API_URL}/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2", // Current best model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ElevenLabs API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      // Return error with fallback flag
      return NextResponse.json(
        {
          error: `Voice generation failed: ${response.statusText}`,
          fallback: true,
          details: errorText,
        },
        { status: response.status },
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
      {
        error: "Failed to generate voice",
        fallback: true,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
