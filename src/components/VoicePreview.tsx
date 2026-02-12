"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, Loader2, Volume2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VoiceScript {
  type: string;
  text: string;
  duration?: string;
}

interface Props {
  scripts: VoiceScript[];
}

export default function VoicePreview({ scripts }: Props) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [audioUrls, setAudioUrls] = useState<Map<number, string>>(new Map());
  const [useFallback, setUseFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio URLs on unmount
  useEffect(() => {
    return () => {
      audioUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [audioUrls]);

  const handlePlayElevenLabs = async (text: string, index: number) => {
    // If already playing this one, stop it
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
      return;
    }

    // Check if we already have the audio cached
    if (audioUrls.has(index)) {
      playAudio(audioUrls.get(index)!, index);
      return;
    }

    // Generate new audio
    setLoadingIndex(index);

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Voice generation failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Cache the URL
      setAudioUrls((prev) => new Map(prev).set(index, audioUrl));

      // Play it
      playAudio(audioUrl, index);
    } catch (error) {
      console.error("ElevenLabs failed, falling back to browser TTS:", error);
      setUseFallback(true);
      handlePlayBrowserTTS(text, index);
    } finally {
      setLoadingIndex(null);
    }
  };

  const playAudio = (url: string, index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onended = () => setPlayingIndex(null);
    audio.onerror = () => {
      console.error("Audio playback failed");
      setPlayingIndex(null);
    };

    audio.play();
    setPlayingIndex(index);
  };

  const handlePlayBrowserTTS = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported in this browser");
      return;
    }

    // Stop current speech
    window.speechSynthesis.cancel();

    if (playingIndex === index) {
      setPlayingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.includes("en") && v.name.includes("Google")) ||
      voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setPlayingIndex(null);
    utterance.onerror = () => setPlayingIndex(null);

    setPlayingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = (text: string, index: number) => {
    if (useFallback) {
      handlePlayBrowserTTS(text, index);
    } else {
      handlePlayElevenLabs(text, index);
    }
  };

  const handleDownload = (index: number) => {
    const url = audioUrls.get(index);
    if (!url) return;

    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-script-${index + 1}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-slate-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-blue-600" />
          Voice Greetings
          {useFallback && (
            <Badge variant="outline" className="text-xs">
              Browser TTS
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scripts.map((script, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border transition-all ${
              playingIndex === idx
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "bg-white border-slate-100 hover:border-blue-200"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="capitalize bg-white">
                {script.type}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                ~{script.duration || "10s"}
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-3 italic">
              "{script.text}"
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={playingIndex === idx ? "default" : "secondary"}
                className="flex-1 h-8"
                onClick={() => handlePlay(script.text, idx)}
                disabled={loadingIndex === idx}
              >
                {loadingIndex === idx ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />{" "}
                    Generating...
                  </>
                ) : playingIndex === idx ? (
                  <>
                    <Square className="h-3 w-3 mr-2 fill-current" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-2 fill-current" /> Preview Audio
                  </>
                )}
              </Button>

              {audioUrls.has(idx) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() => handleDownload(idx)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
