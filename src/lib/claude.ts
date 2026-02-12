import Anthropic from "@anthropic-ai/sdk";
import { VOYS_DOCUMENTATION } from "./voys-rules";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateDialPlan(businessDescription: string) {
  const systemPrompt = `
You are the Voys Dial Plan Architect, an expert in telecommunications call routing.

${VOYS_DOCUMENTATION}

MERMAID DIAGRAM RULES (CRITICAL):
1. Node IDs: Use ONLY alphanumeric + underscore (e.g., entry_point, time_check). NO spaces or special chars.
2. Labels: ALWAYS wrap labels in double quotes (e.g., entry["Call Arrives"]).
3. Arrows: Use ONLY double dash --> (e.g., A --> B).
4. Edge Labels: ALWAYS wrap in double quotes (e.g., A -->|"Open"| B).

YOUR TASK:
Analyze the business description and return a valid JSON object matching this schema exactly. Do not include markdown formatting or preamble.

{
  "businessContext": {
    "name": "string",
    "type": "string"
  },
  "dialPlan": {
    "nodes": [
      { "id": "entry", "type": "entryPoint", "label": "Call Arrives", "simpleLabel": "Someone calls" },
      { "id": "time", "type": "timeCondition", "label": "Opening Hours", "simpleLabel": "Are we open?" }
      // ... add other nodes (callGroup, voicemail, queue, ivr)
    ],
    "edges": [
      { "from": "entry", "to": "time", "condition": null, "label": "" }
      // ... add connections
    ]
  },
  "mermaidSimple": "graph TD\\n    entry[\\"Someone calls\\"] --> time[\\"Are we open?\\"]...",
  "mermaidTechnical": "graph TD\\n    entry[\\"Call Arrives\\"] --> time[\\"Opening Hours\\"]...",
  "features": [
    { "id": "voicemail", "name": "Voicemail", "description": "Records messages", "helpUrl": "https://help.voys.co.za/voicemail", "used": true }
  ],
  "voiceScripts": [
    { "type": "welcome", "text": "Thank you for calling...", "duration": "5s" }
  ],
  "implementationSteps": [
    { "step": 1, "title": "Create Users", "description": "Add staff...", "actions": ["Go to Admin > Users"], "helpUrl": "..." }
  ]
}
`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: businessDescription }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response format");

  try {
    // Clean up if Claude adds markdown blocks
    const cleanJson = content.text.replace(/```json\n|\n```/g, "");
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Error", content.text);
    throw new Error("Failed to parse dial plan JSON");
  }
}
