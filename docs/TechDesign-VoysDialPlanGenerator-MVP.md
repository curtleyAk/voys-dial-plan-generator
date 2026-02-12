# Technical Design Document: Voys Dial Plan Generator MVP

## How We'll Build It (24-Hour Sprint Edition)

### Executive Summary

**Timeline:** 2 days (16-20 hours) → Demo ready Thursday Feb 12, 2pm GMT+1
**Approach:** AI-generated code with human testing/refinement
**Primary Risk:** Mermaid parser failures, invalid Voys logic
**Mitigation:** Validation layers, fallback rendering, extensive Voys context

---

## Recommended Approach: Rapid AI-Generated Stack

Based on your 24-hour constraint and "AI writes all code" preference, here's the optimal path:

### Primary Recommendation: v0.dev + Next.js + Mermaid.js

**Why this is perfect for you:**
1. **v0.dev generates 80% of UI instantly** - Paste prompt, get working React components
2. **Next.js App Router** - Simple file-based routing, built-in API routes
3. **Mermaid.js with validation** - Text-based (AI can generate), with error recovery
4. **Local dev only** - No deployment complexity, just `npm run dev`

**What it costs:** $0 (all free tiers)

**Time to working prototype:** 8-12 hours of focused work

**Key limitation:** Mermaid parser is finicky - we'll build robust validation

---

## Alternative Options Compared

| Option | Pros | Cons | Cost | Time to MVP | Verdict |
|--------|------|------|------|-------------|---------|
| **v0.dev + Next.js + Mermaid** | Fastest UI generation, free, simple | Mermaid can break | $0 | 8-12hrs | ✅ **RECOMMENDED** |
| **Bolt.new + React Flow** | More interactive flowcharts | Slower setup, harder to AI-generate | $0 | 12-16hrs | ⚠️ Too slow for 24hr |
| **Lovable + Supabase** | Full-stack generated | Overkill for localhost demo | $0 | 10-14hrs | ⚠️ Good backup option |
| **Pure React + D3.js** | Maximum control | Too much manual coding | $0 | 20+ hrs | ❌ Not enough time |

**Decision:** v0.dev + Next.js + Mermaid.js with fallback text rendering

---

## Project Architecture (Simplified for Speed)

```
voys-dial-plan-generator/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page with input form
│   │   ├── results/
│   │   │   └── page.tsx          # Results dashboard
│   │   └── api/
│   │       ├── generate/route.ts # Claude API integration
│   │       └── voice/route.ts    # ElevenLabs integration
│   ├── components/
│   │   ├── InputForm.tsx         # Business input form
│   │   ├── FlowchartSimple.tsx   # Mermaid simple view
│   │   ├── FlowchartTechnical.tsx # Mermaid Voys view
│   │   ├── FeatureChecklist.tsx  # Dynamic checklist
│   │   ├── ChatbotAssistant.tsx  # Refinement chat
│   │   ├── VoicePreview.tsx      # Audio players
│   │   └── ImplementationGuide.tsx # Step-by-step guide
│   ├── lib/
│   │   ├── claude.ts             # Claude API client
│   │   ├── mermaid-validator.ts  # Mermaid syntax validator
│   │   ├── elevenlabs.ts         # Voice generation
│   │   └── voys-rules.ts         # Voys logic validation
│   └── types/
│       └── dialplan.ts           # TypeScript interfaces
├── public/
│   └── voys-logo.svg             # Branding assets
├── .env.local                     # API keys (Claude, ElevenLabs)
├── package.json
└── README.md
```

**Why this structure:**
- Matches Next.js conventions (AI tools understand it)
- Separates concerns (easy to debug)
- API routes keep secrets server-side
- All components in one place (fast navigation)

---

## Critical Component: Mermaid Validation Strategy

### The Problem
Mermaid's parser is **notoriously finicky**:
- Extra spaces break it
- Invalid node IDs crash it
- Unicode characters cause issues
- Syntax errors = blank screen

### The Solution: 3-Layer Defense

#### Layer 1: Pre-Generation Validation (Claude Prompt)
```typescript
// In lib/claude.ts - System prompt includes:
const MERMAID_RULES = `
CRITICAL MERMAID SYNTAX RULES:
1. Node IDs: Use only alphanumeric + underscore (no spaces, no special chars)
   ✅ GOOD: entry_point, time_check_1, call_group
   ❌ BAD: "entry point", time-check, callGroup!

2. Labels: Wrap in quotes if they contain spaces
   ✅ GOOD: entry["Call Arrives"]
   ❌ BAD: entry[Call Arrives]

3. Arrows: Use standard syntax only
   ✅ GOOD: A --> B
   ❌ BAD: A -> B (single dash breaks it)

4. Conditions: Always wrap in quotes
   ✅ GOOD: A -->|"Open Hours"| B
   ❌ BAD: A -->|Open Hours| B

5. No special characters in IDs: Remove (, ), -, /, \, spaces
   Example: "Call Group (Ring All)" → call_group_ring_all

VALIDATE EVERY MERMAID OUTPUT BEFORE RETURNING.
`;
```

#### Layer 2: Runtime Validation (Before Rendering)
```typescript
// lib/mermaid-validator.ts
export function validateMermaidSyntax(mermaidCode: string): {
  valid: boolean;
  errors: string[];
  sanitized: string;
} {
  const errors: string[] = [];
  let sanitized = mermaidCode;

  // Check 1: Valid node ID pattern
  const nodeIdRegex = /^\w+$/;
  const nodeMatches = mermaidCode.matchAll(/(\w+)\[/g);
  for (const match of nodeMatches) {
    if (!nodeIdRegex.test(match[1])) {
      errors.push(`Invalid node ID: ${match[1]}`);
      // Auto-sanitize: replace spaces/special chars with underscore
      sanitized = sanitized.replace(match[1], match[1].replace(/[^a-zA-Z0-9_]/g, '_'));
    }
  }

  // Check 2: Labels must be quoted
  const unquotedLabelRegex = /\[[^"\]]+\s[^\]]+\]/;
  if (unquotedLabelRegex.test(sanitized)) {
    errors.push('Unquoted labels with spaces detected');
    // Auto-fix: add quotes to labels
    sanitized = sanitized.replace(/\[([^"\]]+)\]/g, '["$1"]');
  }

  // Check 3: Arrow syntax
  if (sanitized.includes('->') && !sanitized.includes('-->')) {
    errors.push('Invalid arrow syntax (use --> not ->)');
    sanitized = sanitized.replace(/->/g, '-->');
  }

  // Check 4: Edge labels must be quoted
  const edgeLabelRegex = /-->\|([^"]+)\|/;
  const edgeMatches = sanitized.matchAll(edgeLabelRegex);
  for (const match of edgeMatches) {
    if (!match[1].startsWith('"')) {
      sanitized = sanitized.replace(`|${match[1]}|`, `|"${match[1]}"|`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}
```

#### Layer 3: Fallback Rendering (If Mermaid Fails)
```typescript
// components/FlowchartSimple.tsx
import Mermaid from 'react-mermaid2';
import { validateMermaidSyntax } from '@/lib/mermaid-validator';

export function FlowchartSimple({ mermaidCode, dialPlanJson }) {
  const { valid, errors, sanitized } = validateMermaidSyntax(mermaidCode);
  const [renderError, setRenderError] = useState(false);

  if (renderError || !valid) {
    // FALLBACK: Text-based flow representation
    return (
      <div className="fallback-flow">
        <div className="alert alert-warning">
          Flowchart rendering unavailable. Showing text flow:
        </div>
        <TextFlow dialPlan={dialPlanJson} />
      </div>
    );
  }

  return (
    <Mermaid
      chart={sanitized}
      config={{ 
        theme: 'neutral',
        flowchart: { useMaxWidth: true }
      }}
      onError={() => setRenderError(true)}
    />
  );
}

// Fallback component
function TextFlow({ dialPlan }) {
  return (
    <div className="text-flow space-y-4">
      {dialPlan.nodes.map((node, idx) => (
        <div key={node.id} className="flow-step">
          <div className="font-bold">
            Step {idx + 1}: {node.simpleLabel}
          </div>
          {node.config && (
            <div className="text-sm text-gray-600">
              {JSON.stringify(node.config, null, 2)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Claude API Integration (Preventing Invalid Voys Logic)

### The Problem
Claude might generate dial plans that violate Voys routing rules:
- Routing to non-existent features
- Invalid time conditions
- Circular routing
- Missing required steps

### The Solution: Voys Context Loading + Validation

#### Step 1: Load Voys Documentation into Context
```typescript
// lib/voys-rules.ts
export const VOYS_DOCUMENTATION = `
VOYS PLATFORM RULES & CONSTRAINTS:

1. AVAILABLE FEATURES:
   - Opening Hours (Basic & Advanced)
   - Call Groups (Simultaneous or Sequential ringing)
   - IVR (Interactive Voice Response menus)
   - Voicemail (with custom greetings)
   - Queue (with music on hold)
   - Call Recording
   - Announcements (pre-recorded messages)
   - Filters (caller ID routing)
   - Fixed-Mobile (link office + mobile)

2. ROUTING LOGIC RULES:
   - Every dial plan MUST start with a phone number entry point
   - Opening Hours MUST be defined before time-based routing
   - Call Groups REQUIRE at least 1 user to be configured first
   - IVR menus can have max 9 options (0-9 keys)
   - Voicemail REQUIRES a greeting (recorded or TTS)
   - Queue timeout max: 600 seconds (10 minutes)
   - Announcements must reference uploaded sound files

3. VALID ROUTING PATHS:
   ✅ Entry → Time Check → Open (Welcome) → Call Group → Queue → Voicemail
   ✅ Entry → Time Check → Closed → After Hours Voicemail
   ✅ Entry → IVR → Option 1 (Sales) / Option 2 (Support)
   ❌ INVALID: Routing to non-existent users
   ❌ INVALID: Circular loops (Queue → Call Group → Queue)
   ❌ INVALID: IVR with 0 options

4. COMMON PATTERNS:
   - Small Business (1-5 staff): Entry → Time Check → Call Group → Voicemail
   - Department Routing: Entry → IVR → Dept Call Groups
   - After Hours: Entry → Time Check → Closed Message → Voicemail
   - Busy Handling: Call Group (30s timeout) → Queue (2min) → Voicemail

5. USER SETUP REQUIREMENTS:
   - Users must exist before adding to Call Groups
   - Each user needs: name, extension, device (phone/softphone)
   - Call Groups strategy: "Simultaneous" (all ring) or "Sequential" (one by one)

FOLLOW THESE RULES STRICTLY. VALIDATE OUTPUT BEFORE RETURNING.
`;

export function validateDialPlan(dialPlan: DialPlan): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Rule 1: Must have entry point
  const hasEntry = dialPlan.nodes.some(n => n.type === 'entryPoint');
  if (!hasEntry) {
    errors.push('Dial plan must have an entry point');
  }

  // Rule 2: Call groups must have members
  dialPlan.nodes.forEach(node => {
    if (node.type === 'callGroup') {
      if (!node.config?.members || node.config.members.length === 0) {
        errors.push(`Call group "${node.label}" has no members`);
      }
    }
  });

  // Rule 3: Time conditions need hours defined
  dialPlan.nodes.forEach(node => {
    if (node.type === 'timeCondition') {
      if (!node.config?.openHours) {
        errors.push(`Time condition "${node.label}" has no hours defined`);
      }
    }
  });

  // Rule 4: Detect circular routing
  const nodeMap = new Map(dialPlan.nodes.map(n => [n.id, n]));
  function hasCircularPath(nodeId: string, visited = new Set<string>()): boolean {
    if (visited.has(nodeId)) return true;
    visited.add(nodeId);
    
    const edges = dialPlan.edges.filter(e => e.from === nodeId);
    return edges.some(edge => hasCircularPath(edge.to, new Set(visited)));
  }

  dialPlan.nodes.forEach(node => {
    if (hasCircularPath(node.id)) {
      errors.push(`Circular routing detected involving node: ${node.label}`);
    }
  });

  // Rule 5: IVR must have options
  dialPlan.nodes.forEach(node => {
    if (node.type === 'ivr') {
      const ivrEdges = dialPlan.edges.filter(e => e.from === node.id);
      if (ivrEdges.length === 0) {
        errors.push(`IVR "${node.label}" has no menu options`);
      }
    }
  });

  // Warnings (non-blocking but important)
  const hasVoicemail = dialPlan.nodes.some(n => n.type === 'voicemail');
  if (!hasVoicemail) {
    warnings.push('No voicemail configured - callers may have no way to leave messages');
  }

  return { valid: errors.length === 0, errors, warnings };
}
```

#### Step 2: Claude System Prompt with Validation
```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';
import { VOYS_DOCUMENTATION } from './voys-rules';
import { MERMAID_RULES } from './mermaid-validator';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generateDialPlan(businessDescription: string) {
  const systemPrompt = `
You are the Voys Dial Plan Architect, an expert in telecommunications call routing for small businesses in South Africa.

${VOYS_DOCUMENTATION}

${MERMAID_RULES}

Your job is to analyze a business description and generate a professional, logical dial plan that:
1. FOLLOWS ALL VOYS ROUTING RULES (see documentation above)
2. GENERATES VALID MERMAID SYNTAX (see rules above)
3. PROVIDES BOTH SIMPLE AND TECHNICAL VIEWS

OUTPUT FORMAT:
Return ONLY valid JSON (no markdown, no preamble) matching this schema:

{
  "businessContext": {
    "name": "Business Name",
    "type": "restaurant|office|retail|medical|other",
    "staffCount": 3,
    "hours": "09:00-21:00",
    "timezone": "Africa/Johannesburg"
  },
  "dialPlan": {
    "nodes": [
      {
        "id": "entry_point",  // CRITICAL: Use underscore, no spaces
        "type": "entryPoint",
        "label": "Call Arrives",
        "simpleLabel": "Someone calls",
        "config": {}
      }
      // ... more nodes following rules
    ],
    "edges": [
      {
        "from": "entry_point",
        "to": "time_check",
        "condition": null,
        "label": ""
      }
      // ... more edges
    ]
  },
  "mermaidSimple": "graph TD\n    entry_point[\"Someone calls\"]\\n    entry_point --> time_check\\n    ...",
  "mermaidTechnical": "graph TD\n    entry_point[\"Call Arrives\"]\\n    entry_point --> time_check\\n    ...",
  "features": [...],
  "voiceScripts": [...],
  "implementationSteps": [...]
}

CRITICAL RULES:
1. Node IDs: Use only alphanumeric + underscore (entry_point, time_check_1)
2. Validate routing logic against Voys rules before returning
3. Both Mermaid diagrams must be syntactically valid
4. Simple view uses plain language ("Are we open?")
5. Technical view uses Voys terminology ("Opening Hours Check")
6. Test Mermaid syntax mentally before including it

VALIDATION CHECKLIST BEFORE RESPONDING:
✓ Entry point exists
✓ All call groups have members
✓ No circular routing
✓ All node IDs are valid (alphanumeric + underscore only)
✓ All Mermaid labels are properly quoted
✓ Voicemail is included for missed calls

Now process this business description:
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: businessDescription
      }
    ]
  });

  // Extract JSON from response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON (Claude should return pure JSON)
  let dialPlanData;
  try {
    dialPlanData = JSON.parse(content.text);
  } catch (e) {
    // Fallback: Try to extract JSON from markdown code blocks
    const jsonMatch = content.text.match(/```json\n([\s\S]+)\n```/);
    if (jsonMatch) {
      dialPlanData = JSON.parse(jsonMatch[1]);
    } else {
      throw new Error('Failed to parse Claude response as JSON');
    }
  }

  return dialPlanData;
}
```

---

## Building Each Feature (AI-Generated Components)

### Feature 1: Business Input Form

**Complexity:** Easy (v0.dev handles this perfectly)

#### v0.dev Prompt:
```
Create a Next.js form component called "BusinessInputForm" with Tailwind CSS and shadcn/ui.

Requirements:
1. Form fields:
   - Business name (text input, required)
   - Business type (select dropdown: Restaurant, Office, Retail Store, Service Business, Medical Practice, Other)
   - Number of staff (number input, min 1, max 50)
   - Operating hours (two time inputs: opening time, closing time, default 09:00 and 17:00)
   - Special needs (textarea, placeholder: "E.g., Need voicemail after hours, Have sales and support teams, Queue during busy times")

2. Example cards (3 cards in a grid):
   - "Pizza Shop": onClick pre-fills form with Restaurant, 3 staff, 09:00-21:00, "need voicemail after hours"
   - "Law Office": onClick pre-fills form with Office, 5 staff, 08:00-17:00, "separate lines for lawyers"
   - "Retail Store": onClick pre-fills form with Retail, 2 staff, 10:00-18:00, "queue during busy times"

3. Submit button: "Generate My Dial Plan" (primary blue button, full width)

4. On submit: preventDefault, validate all fields, then call onSubmit prop with form data

5. Style: Clean, professional, use shadcn/ui Card, Input, Select, Textarea, Button components

6. Add loading state to submit button when generating

Export as default component with TypeScript.
```

**What you'll get:** Complete React component ready to drop into your app

**Files to create:**
- `src/components/BusinessInputForm.tsx` (paste v0.dev output)

**Test with:**
1. Fill form manually
2. Click example cards to verify pre-fill
3. Submit and check console.log output

---

### Feature 2: Dual Flowchart Display

**Complexity:** Medium (Mermaid with validation)

#### v0.dev Prompt for Simple View:
```
Create a Next.js component called "FlowchartSimple" that renders Mermaid diagrams with error handling.

Requirements:
1. Props:
   - mermaidCode: string (Mermaid syntax)
   - dialPlanJson: object (fallback data)

2. Features:
   - Use react-mermaid2 library to render Mermaid diagram
   - Wrap in try-catch for error handling
   - If Mermaid fails, show TextFlowFallback component (create this)
   - Add "View Technical Version" toggle button at top

3. TextFlowFallback component:
   - Takes dialPlanJson prop
   - Renders nodes as vertical list with arrows
   - Each step shows: Step number, simpleLabel, config details
   - Style with cards and arrows between them

4. Styling:
   - Container: white background, rounded corners, shadow
   - Mermaid: Full width, auto height
   - Error message: Yellow alert banner if fallback shown

5. Mermaid config:
   - Theme: neutral
   - Flowchart: useMaxWidth true
   - Curve: basis

Export both FlowchartSimple and FlowchartTechnical (same structure, different labels).
```

**Manual code needed (validation layer):**
```typescript
// Wrap v0.dev output with validation
import { validateMermaidSyntax } from '@/lib/mermaid-validator';

export function FlowchartSimple({ mermaidCode, dialPlanJson }) {
  const { valid, errors, sanitized } = validateMermaidSyntax(mermaidCode);
  
  if (!valid) {
    console.warn('Mermaid validation errors:', errors);
    // Continue with sanitized version
  }
  
  // ... rest of v0.dev generated component
  // Use 'sanitized' instead of 'mermaidCode'
}
```

---

### Feature 3: Voice Script Generation (ElevenLabs)

**Complexity:** Medium (API integration)

#### Implementation Strategy:

1. **Voice Script Generation (Claude handles this in main API)**
   - Already included in dialPlan JSON output
   - voiceScripts array contains text for welcome, voicemail, etc.

2. **Audio Generation (ElevenLabs API)**
```typescript
// lib/elevenlabs.ts
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Default voice (Sarah)

export async function generateVoice(text: string): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  return response.arrayBuffer();
}

// src/app/api/voice/route.ts
import { generateVoice } from '@/lib/elevenlabs';

export async function POST(request: Request) {
  const { text } = await request.json();
  
  try {
    const audioBuffer = await generateVoice(text);
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

3. **VoicePreview Component (v0.dev prompt)**
```
Create a Next.js component called "VoicePreview" with audio players.

Requirements:
1. Props:
   - voiceScripts: array of { type: string, text: string, duration: string }

2. For each script:
   - Header: Icon + Type label ("Welcome Message", "Voicemail Greeting")
   - Audio player (HTML5 audio element with controls)
   - Text transcript (collapsible, click to expand)
   - "Regenerate Voice" button (for future feature)

3. On mount:
   - Fetch audio from /api/voice with POST { text: script.text }
   - Create blob URL from response
   - Set as audio src

4. Loading states:
   - Show skeleton while audio generates
   - Show error if generation fails
   - Fallback: Show text-only if audio unavailable

5. Styling:
   - Cards with icons (🔊 for audio)
   - Blue accent color for active player
   - Expandable text with smooth animation

Use shadcn/ui Card, Collapsible components. Export as default.
```

---

### Feature 4: Feature Checklist

**Complexity:** Easy

#### v0.dev Prompt:
```
Create a component called "FeatureChecklist" showing which Voys features are used.

Requirements:
1. Props:
   - features: array of { id: string, name: string, description: string, helpUrl: string, used: boolean }

2. Display:
   - List of features with checkboxes (checked if used: true)
   - Each item: Icon + Name + Info tooltip (description)
   - Link icon that opens helpUrl in new tab
   - Group into "Active Features" and "Available Features"

3. Icons (use lucide-react):
   - opening_hours: Clock
   - call_group: Users
   - voicemail: Mic
   - queue: Clock
   - ivr: Hash (keypad)
   - call_recording: Video
   - announcements: Volume2

4. Styling:
   - Sticky sidebar (position: sticky, top: 20px)
   - Card with header "Your Phone System Will Use:"
   - Green checkmarks for active
   - Gray checkmarks for inactive
   - Hover effects on links

Use shadcn/ui Checkbox, Tooltip. Export as default.
```

---

### Feature 5: Chatbot Assistant

**Complexity:** Medium-Hard

#### v0.dev Prompt:
```
Create a component called "ChatbotAssistant" for refining dial plans.

Requirements:
1. Props:
   - currentDialPlan: object (current plan JSON)
   - onPlanUpdate: function (called with new plan JSON)

2. UI:
   - Chat bubble interface (messages list + input)
   - Message types: user, assistant, system
   - Input field with send button
   - "Refining plan..." loading state
   - Example prompts as clickable chips:
     * "Add separate line for deliveries"
     * "Make sales ring longer than support"
     * "Add queue with 2 minute timeout"

3. Behavior:
   - On submit: Call /api/refine with { message, currentDialPlan }
   - Stream response (use streaming if possible)
   - Update flowcharts in real-time when plan changes
   - Maintain conversation history

4. Styling:
   - Collapsible section (collapsed by default)
   - Title: "Refine Your Plan" with chat icon
   - User messages: Right-aligned, blue
   - Assistant messages: Left-aligned, gray
   - Smooth scroll to bottom on new messages

Use shadcn/ui Collapsible, ScrollArea. Export as default.
```

**API Route for Refinement:**
```typescript
// src/app/api/refine/route.ts
import { anthropic } from '@/lib/claude';

export async function POST(request: Request) {
  const { message, currentDialPlan } = await request.json();

  const systemPrompt = `
You are assisting a user to refine their Voys dial plan.

CURRENT DIAL PLAN:
${JSON.stringify(currentDialPlan, null, 2)}

USER REQUEST:
${message}

TASK:
1. Understand what change the user wants
2. Modify the dial plan JSON accordingly
3. Ensure the modified plan still follows all Voys rules
4. Return the updated JSON with an explanation

RESPONSE FORMAT:
{
  "explanation": "I've added a separate call group for deliveries that rings the kitchen phone...",
  "updatedDialPlan": { ... full updated JSON ... }
}

RULES:
- Maintain all existing features unless user asks to remove them
- Validate the updated plan against Voys rules
- Update both mermaidSimple and mermaidTechnical diagrams
- Keep node IDs valid (alphanumeric + underscore)
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: message
      }
    ]
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const result = JSON.parse(content.text);
  
  return Response.json(result);
}
```

---

### Feature 6: Implementation Guide

**Complexity:** Easy

#### v0.dev Prompt:
```
Create a component called "ImplementationGuide" showing step-by-step setup instructions.

Requirements:
1. Props:
   - steps: array of { step: number, title: string, description: string, actions: string[], helpUrl: string, estimatedTime: string }

2. Display:
   - Accordion component (one step open at a time)
   - Each step header: Number badge + Title + Time estimate
   - Step content:
     * Description paragraph
     * Numbered action list
     * "Learn More" link to helpUrl
     * Progress checkbox (for user tracking)

3. Features:
   - Download as PDF button at top
   - Print-friendly styles
   - Progress tracker: "3 of 7 steps completed"
   - Smooth expand/collapse animations

4. Styling:
   - Clean typography
   - Blue accent for step numbers
   - Green checkmarks for completed steps
   - Hover effects on accordion headers

Use shadcn/ui Accordion, Badge, Progress. Export as default.
```

---

## AI Assistance Strategy

### Which AI Tool for What (24hr Sprint)

| Task | Best AI Tool | Why | Example Prompt |
|------|--------------|-----|----------------|
| Generate UI | v0.dev | Instant React components | [See prompts above] |
| Write API routes | Claude (Chat) | Understands Next.js patterns | "Create Next.js API route for /api/generate that calls Claude API" |
| Debug Mermaid | Claude (Chat) | Can validate syntax | "This Mermaid code isn't rendering: [paste code]" |
| Fix bugs | Claude (Chat) | Good at error analysis | "Error: [paste]. Here's my code: [paste]" |
| Write validation logic | Claude (Chat) | Strong at business rules | "Write a function to validate Voys dial plan against these rules: [paste]" |
| Generate test data | Claude (Chat) | Quick data generation | "Generate 5 realistic business descriptions for testing" |

### Recommended Workflow

**Hour 1-2: Setup**
1. Use Claude: "Give me the exact commands to create a Next.js 14 app with TypeScript, Tailwind, shadcn/ui"
2. Follow commands exactly
3. Install dependencies: `npm install @anthropic-ai/sdk react-mermaid2 lucide-react`

**Hour 3-6: Core UI (v0.dev)**
1. Paste each v0.dev prompt into v0.dev
2. Copy generated components into your project
3. Fix any import errors (Claude helps: "I'm getting import error for Button from shadcn/ui")

**Hour 7-10: API Integration**
1. Ask Claude: "Create the /api/generate route with full Claude integration"
2. Paste code, test with `curl localhost:3000/api/generate`
3. Debug with Claude if issues

**Hour 11-14: Mermaid + Validation**
1. Implement mermaid-validator.ts (use code from this doc)
2. Test with intentionally broken Mermaid syntax
3. Verify fallback rendering works

**Hour 15-18: Polish + Testing**
1. Test full user journey 5 times with different business types
2. Fix bugs with Claude's help
3. Add error messages and loading states

**Hour 19-20: Demo Prep**
1. Pre-generate 3 example plans (cache them)
2. Create demo script document
3. Test on clean browser (no cached data)

---

## Project Setup Checklist

### Step 1: Create Accounts (30 minutes - Do Now)
- [x] Anthropic account - claude.ai (you have this)
- [ ] ElevenLabs account - elevenlabs.io → Get free API key
- [ ] v0.dev account - v0.dev → Sign in with GitHub
- [ ] GitHub account - github.com (for v0.dev)

### Step 2: Local Environment Setup (30 minutes)

```bash
# 1. Create Next.js project
npx create-next-app@latest voys-dial-plan-generator
# Choose: TypeScript ✓, Tailwind ✓, App Router ✓, src/ directory ✓

# 2. Navigate into project
cd voys-dial-plan-generator

# 3. Install dependencies
npm install @anthropic-ai/sdk
npm install react-mermaid2 mermaid
npm install lucide-react
npm install @radix-ui/react-accordion @radix-ui/react-collapsible # For shadcn/ui

# 4. Install shadcn/ui
npx shadcn-ui@latest init
# Choose: Default style, Slate color, CSS variables

# 5. Add shadcn/ui components we need
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add checkbox

# 6. Create environment file
touch .env.local
```

### Step 3: Configure Environment Variables
```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-... # Your Claude API key
ELEVENLABS_API_KEY=... # Get from elevenlabs.io/app/settings
```

### Step 4: Test Setup (10 minutes)
```bash
# Run development server
npm run dev

# Open browser: http://localhost:3000
# You should see Next.js welcome page
```

---

## 2-Day Sprint Schedule (Hour-by-Hour)

### Day 1 (Wednesday Feb 11) - 8-10 hours

**Hour 0-1: Environment Setup**
- ✓ Create Next.js project
- ✓ Install dependencies
- ✓ Configure API keys
- ✓ Test dev server runs

**Hour 1-3: Core UI Generation**
- Use v0.dev to generate BusinessInputForm
- Use v0.dev to generate FeatureChecklist
- Use v0.dev to generate VoicePreview
- Copy components into project, fix imports

**Hour 3-5: Claude API Integration**
- Create lib/claude.ts with system prompt
- Create src/app/api/generate/route.ts
- Test with curl/Postman: Business description → JSON response
- Debug any API errors

**Hour 5-7: Mermaid Implementation**
- Create lib/mermaid-validator.ts
- Use v0.dev to generate FlowchartSimple + FlowchartTechnical
- Add validation layer to components
- Test with intentionally broken Mermaid syntax

**Hour 7-8: Results Page Layout**
- Create src/app/results/page.tsx
- Wire up all components (form submit → API call → display results)
- Test end-to-end flow once

**Hour 8-10: Voys Validation**
- Create lib/voys-rules.ts with validation logic
- Add validation to Claude API route
- Test with edge cases (no voicemail, circular routing, etc.)

**END DAY 1 CHECKPOINT:**
- [ ] Can submit business description
- [ ] Gets JSON response from Claude
- [ ] Displays both flowcharts (even if rough)
- [ ] Feature checklist populates

---

### Day 2 (Thursday Feb 12) - 6-8 hours → Demo 2pm

**Hour 0-2: ElevenLabs Integration**
- Create lib/elevenlabs.ts
- Create src/app/api/voice/route.ts
- Test voice generation for one script
- Add audio players to VoicePreview component

**Hour 2-4: Chatbot Assistant**
- Use v0.dev to generate ChatbotAssistant component
- Create src/app/api/refine/route.ts
- Test one refinement cycle (add feature → plan updates)
- Fix any real-time update issues

**Hour 4-5: Implementation Guide**
- Use v0.dev to generate ImplementationGuide component
- Test accordion expand/collapse
- Add download/print functionality (basic)

**Hour 5-6: Polish & Error Handling**
- Add loading states to all async operations
- Add error messages (friendly, not technical)
- Test on mobile (basic responsiveness check)
- Fix any UI glitches

**Hour 6-7: Testing & Bug Fixes**
- Test complete flow 5 times with different business types:
  1. Pizza restaurant (simple)
  2. Law office (departments)
  3. Medical practice (after hours)
  4. Retail store (queue during busy)
  5. Service business (voicemail only)
- Fix any bugs discovered
- Verify Mermaid renders correctly for all

**Hour 7-8: Demo Preparation**
- Pre-generate 3 example plans (save JSON to files)
- Create demo script document:
  * "I'll show you a pizza shop setup..."
  * "Notice the simple vs technical views..."
  * "Here's the voice preview..."
- Test demo run-through with timer (5 minutes)
- Prepare backup: Screenshots + video recording

**DEMO TIME: 2pm GMT+1**
- Show live generation for 1 business type
- Walk through results dashboard
- Play voice previews
- Show chatbot refinement
- Discuss next steps (API integration, n8n)

---

## Cost Breakdown (Verified Free)

### Development Phase
| Service | Free Tier | You'll Use | Cost |
|---------|-----------|------------|------|
| Claude API | Included in subscription | Dial plan generation | $0 |
| ElevenLabs | 10,000 chars/month | ~20 dial plans | $0 |
| Next.js hosting | Local dev server | localhost:3000 | $0 |
| v0.dev | Free tier | UI generation | $0 |
| GitHub | Free | Code storage | $0 |
| **TOTAL** | | | **$0** |

### Demo Phase (Thursday)
- No costs (local hosting only)
- No deployment fees
- API usage well within free tiers

### If Moving to Production (Future)
| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Vercel | $20 | Pro tier for team |
| Claude API | $0-50 | Pay-as-you-go (low volume) |
| ElevenLabs | $5-22 | After free tier |
| **Total** | **$25-92** | Only if approved for production |

---

## Critical Success Factors

### 1. Mermaid Must Render (Top Priority)
**Risk:** Finicky parser breaks demo
**Mitigation:**
- Triple validation (Claude prompt + runtime + fallback)
- Test with 10 different business types before demo
- Always have TextFlow fallback ready
- Pre-generate examples as backup

### 2. Voys Logic Must Be Valid
**Risk:** Generated plans violate Voys rules
**Mitigation:**
- Load full Voys documentation into Claude context
- Run validateDialPlan() on every output
- Show validation errors in UI (debug mode)
- Manual review of first 10 generated plans

### 3. Demo Must Work Offline
**Risk:** API failures during stakeholder demo
**Mitigation:**
- Pre-generate 3 cached examples
- Test with airplane mode enabled
- Have screenshots ready
- Record backup video

### 4. Time Management
**Risk:** Running out of time
**Mitigation:**
- Follow hour-by-hour schedule strictly
- Cut features if behind (chatbot first to cut)
- Use v0.dev for ALL UI (no manual HTML/CSS)
- Don't perfect - just make it work

---

## Debugging Playbook

### Error: "Mermaid rendering failed"
```typescript
// Check 1: Validate syntax
const { valid, errors } = validateMermaidSyntax(code);
console.log('Validation:', { valid, errors });

// Check 2: Try in Mermaid Live Editor
// Go to: https://mermaid.live/
// Paste your mermaidCode
// If it fails there, it's a syntax issue

// Check 3: Simplify to minimum
const testCode = `graph TD\n    A["Test"] --> B["Test2"]`;
// If this works, your code has syntax errors

// Fix: Use sanitized version from validator
```

### Error: "Claude API timeout"
```typescript
// Solution: Add timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s

try {
  const response = await anthropic.messages.create({
    ...params,
    signal: controller.signal
  });
  clearTimeout(timeoutId);
} catch (error) {
  if (error.name === 'AbortError') {
    return { error: 'Generation timed out. Try a simpler business description.' };
  }
  throw error;
}
```

### Error: "ElevenLabs quota exceeded"
```typescript
// Solution: Check usage before generating
async function checkElevenLabsQuota() {
  const response = await fetch('https://api.elevenlabs.io/v1/user', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  });
  const data = await response.json();
  return data.subscription.character_count < data.subscription.character_limit;
}

// Use text-only fallback if quota exceeded
if (!await checkElevenLabsQuota()) {
  return { voiceAvailable: false, textOnly: true };
}
```

### Error: "Module not found: @/components/ui/button"
```bash
# Solution: Install missing shadcn/ui component
npx shadcn-ui@latest add button

# If that fails, check tsconfig.json has:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Demo Script (5 Minutes)

### Minute 1: Introduction
"Today I'm showing you the Voys Dial Plan Generator - a tool that turns a simple business description into a visual call routing plan in 30 seconds."

### Minute 2: Live Generation
- Type: "Pizza shop with 3 staff, open 9am-9pm, need voicemail after hours"
- Click "Generate My Dial Plan"
- [While generating]: "The AI is analyzing this and creating a professional routing structure..."

### Minute 3: Results Walkthrough
- Point to simple flowchart: "This is the customer-friendly view - anyone can understand this"
- Switch to technical view: "This matches exactly what they'll see in Voys admin"
- Show feature checklist: "These are the Voys features being used"

### Minute 4: Voice & Implementation
- Play welcome message audio: "Here's what callers will hear - generated in seconds"
- Open implementation guide: "Step-by-step instructions to set this up themselves"

### Minute 5: Chatbot Refinement
- Type: "Add a separate line for delivery drivers"
- Show updated flowchart in real-time
- Close: "Next steps: API integration so this actually configures their Voys account"

### Backup Plan (If Live Demo Fails)
- Show pre-generated example
- Walk through screenshots
- Play recorded video
- Explain: "Demo gods aren't with us today, but here's the full flow..."

---

## Definition of Technical Success

Your 24-hour sprint succeeds when:

### Minimum Viable Demo (Must Have)
- [ ] Form accepts business description
- [ ] Claude generates valid dial plan JSON
- [ ] At least one flowchart renders (simple OR technical)
- [ ] Feature checklist populates dynamically
- [ ] Implementation guide displays steps
- [ ] No crashes during 5-minute demo

### Ideal Demo (Should Have)
- [ ] Both flowcharts render correctly
- [ ] Voice previews play audio
- [ ] Chatbot can refine plan once
- [ ] Mermaid validation prevents errors
- [ ] 5 different business types tested successfully

### Stretch Goals (Nice to Have)
- [ ] Download PDF functionality
- [ ] Multiple refinement cycles work
- [ ] Mobile responsive layout
- [ ] Voys branding/colors applied
- [ ] Error recovery is graceful

---

## Emergency Fallback Plan

### If You're Behind Schedule (Hour 16+)

**Cut These Features First:**
1. ✂️ Chatbot Assistant (biggest complexity, least critical for demo)
2. ✂️ ElevenLabs voice generation (show text scripts only)
3. ✂️ Technical flowchart view (show simple view only)

**Keep These Non-Negotiable:**
1. ✅ Business input form
2. ✅ Claude API generation
3. ✅ Simple flowchart (with fallback)
4. ✅ Feature checklist
5. ✅ Implementation guide

**Simplest Possible MVP (If Desperate):**
- One page: Form + Results
- Claude generates JSON
- Display JSON prettified (no flowchart at all)
- List features as bullet points
- Show implementation steps as text

*This is still demonstrable value: "AI analyzes business → outputs Voys config"*

---

## Post-Demo: Next Steps

### If Demo Approved, Immediate Next Steps:
1. **Week 1:** Fix bugs discovered in demo, add cut features
2. **Week 2:** Deploy to Vercel, add user authentication
3. **Week 3:** Begin Voys API integration (read-only first)
4. **Week 4:** Build n8n automation workflows
5. **Month 2:** Beta with 10 real customers

### Technical Debt to Address:
- Add proper error logging (Sentry)
- Implement rate limiting
- Add unit tests for validation functions
- Improve Mermaid error messages
- Cache Claude responses (avoid regenerating same plan)

### Learning Resources for Next Phase:
- **Voys API:** Work with Voys tech team for API docs
- **n8n Integration:** n8n.io/integrations/anthropic
- **Advanced Mermaid:** mermaid.js.org/intro/
- **Next.js Deployment:** vercel.com/docs

---

## Final Checklist (Before Demo)

### Technical
- [ ] All dependencies installed (npm install runs clean)
- [ ] .env.local has valid API keys
- [ ] Dev server starts without errors (npm run dev)
- [ ] Can generate plan for test business description
- [ ] At least one flowchart renders
- [ ] Feature checklist populates
- [ ] Implementation guide displays

### Content
- [ ] 3 pre-generated example plans cached
- [ ] Demo script printed/ready
- [ ] Stakeholder names and titles confirmed
- [ ] Questions anticipated (API integration timeline, costs, scaling)

### Backup
- [ ] Screenshots of working demo saved
- [ ] Video recording of full flow (5 min)
- [ ] JSON examples saved to files
- [ ] Localhost accessible from presentation machine

### Environment
- [ ] Close all other apps (reduce crash risk)
- [ ] Full battery or plugged in
- [ ] Do Not Disturb mode enabled
- [ ] Backup internet connection (phone hotspot)
- [ ] Browser cache cleared (fresh load)

---

**You've got this! The key to success is following the schedule strictly and using AI tools for 80% of the work. Don't try to perfect anything - just make it work for the demo. Good luck! 🚀**

---

*Technical Design for: Voys Dial Plan Generator*
*Approach: AI-Generated Rapid Prototyping*
*Timeline: 2 days → Demo Thu Feb 12, 2pm GMT+1*
*Estimated Total Time: 16-20 hours*
*Estimated Cost: $0*
