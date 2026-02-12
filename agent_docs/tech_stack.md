# Tech Stack & Tools

## Core Stack
- **Frontend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Visualization:** Mermaid.js (via react-mermaid2)
- **AI Integration:** Claude API (Anthropic SDK)
- **Voice Generation:** ElevenLabs API
- **Deployment:** Local (localhost:3000 for demo)

## Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@anthropic-ai/sdk": "latest",
    "react-mermaid2": "latest",
    "mermaid": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0"
  }
}
```

## Project Structure
```
voys-dial-plan-generator/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page with input form
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── results/
│   │   │   └── page.tsx          # Results dashboard
│   │   └── api/
│   │       ├── generate/route.ts # Claude API integration
│   │       ├── voice/route.ts    # ElevenLabs integration
│   │       └── refine/route.ts   # Chatbot refinement
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── BusinessInputForm.tsx  # Main input form
│   │   ├── FlowchartSimple.tsx    # Simple view flowchart
│   │   ├── FlowchartTechnical.tsx # Technical view flowchart
│   │   ├── FeatureChecklist.tsx   # Dynamic checklist
│   │   ├── ChatbotAssistant.tsx   # Refinement chat
│   │   ├── VoicePreview.tsx       # Audio players
│   │   └── ImplementationGuide.tsx # Step-by-step guide
│   ├── lib/
│   │   ├── claude.ts              # Claude API client
│   │   ├── mermaid-validator.ts   # Mermaid syntax validator
│   │   ├── elevenlabs.ts          # Voice generation
│   │   ├── voys-rules.ts          # Voys logic validation
│   │   └── utils.ts               # Helper functions
│   └── types/
│       └── dialplan.ts            # TypeScript interfaces
├── public/
│   └── voys-logo.svg              # Branding assets
├── .env.local                      # API keys (not in git)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Setup Commands

### Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest voys-dial-plan-generator
# Choose: TypeScript ✓, Tailwind ✓, App Router ✓, src/ directory ✓

# Navigate into project
cd voys-dial-plan-generator

# Install core dependencies
npm install @anthropic-ai/sdk
npm install react-mermaid2 mermaid
npm install lucide-react

# Initialize shadcn/ui
npx shadcn-ui@latest init
# Choose: Default style, Slate color, CSS variables

# Add shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add collapsible
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add badge
```

### Environment Configuration
```bash
# Create environment file
touch .env.local

# Add these variables (get keys from respective services)
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
```

### Development Commands
```bash
# Start development server
npm run dev
# Opens at http://localhost:3000

# Build for production (not needed for demo)
npm run build

# Check TypeScript types
npm run type-check

# Format code (if needed)
npx prettier --write .
```

## Component Architecture Pattern

### Example Component Structure
```typescript
// src/components/ExampleComponent.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExampleComponentProps {
  data: string;
  onAction: (value: string) => void;
}

export function ExampleComponent({ data, onAction }: ExampleComponentProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onAction(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">{data}</h2>
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </Card>
  );
}
```

## API Route Pattern

### Example API Route
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process request
    const result = await processData(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## TypeScript Interfaces

### Core Types
```typescript
// src/types/dialplan.ts
export interface BusinessContext {
  name: string;
  type: 'restaurant' | 'office' | 'retail' | 'medical' | 'service' | 'other';
  staffCount: number;
  hours: string;
  timezone: string;
}

export interface DialPlanNode {
  id: string;
  type: 'entryPoint' | 'timeCondition' | 'announcement' | 'callGroup' | 'queue' | 'voicemail' | 'ivr';
  label: string;
  simpleLabel: string;
  config?: Record<string, any>;
}

export interface DialPlanEdge {
  from: string;
  to: string;
  condition?: string | null;
  label?: string;
}

export interface DialPlan {
  businessContext: BusinessContext;
  dialPlan: {
    nodes: DialPlanNode[];
    edges: DialPlanEdge[];
  };
  mermaidSimple: string;
  mermaidTechnical: string;
  features: VoysFeature[];
  voiceScripts: VoiceScript[];
  implementationSteps: ImplementationStep[];
}

export interface VoysFeature {
  id: string;
  name: string;
  description: string;
  helpUrl: string;
  used: boolean;
}

export interface VoiceScript {
  type: 'welcome' | 'voicemail' | 'menu' | 'announcement';
  text: string;
  duration?: string;
}

export interface ImplementationStep {
  step: number;
  title: string;
  description: string;
  actions: string[];
  helpUrl: string;
  estimatedTime: string;
}
```

## Styling Guidelines

### Tailwind Conventions
```typescript
// Component styling pattern
<div className="container mx-auto max-w-7xl px-4">
  <Card className="p-6 shadow-lg">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">
      Title
    </h1>
    <p className="text-gray-600 mb-6">
      Description text
    </p>
    <Button className="w-full bg-blue-600 hover:bg-blue-700">
      Action
    </Button>
  </Card>
</div>
```

### Color Scheme (Voys Branding)
```css
/* Use these Tailwind classes for consistency */
primary: blue-600 (buttons, accents)
secondary: gray-600 (text, borders)
success: green-600 (checkmarks, success states)
warning: yellow-600 (alerts, warnings)
error: red-600 (errors, validation)
background: white / gray-50
text: gray-900 (headings) / gray-600 (body)
```

## Error Handling Pattern

### Client-Side Error Handling
```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const handleSubmit = async (data: FormData) => {
  setError(null);
  setLoading(true);
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    // Handle success
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};

// Display error
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

## Loading States Pattern

### Component Loading State
```typescript
{loading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    <span className="ml-3 text-gray-600">Generating dial plan...</span>
  </div>
) : (
  <div>Content here</div>
)}
```

## Key Libraries Documentation

### Mermaid.js Usage
```typescript
import Mermaid from 'react-mermaid2';

<Mermaid
  chart={mermaidCode}
  config={{
    theme: 'neutral',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    }
  }}
  onError={(error) => {
    console.error('Mermaid error:', error);
    setRenderError(true);
  }}
/>
```

### Claude API Usage
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4000,
  system: systemPrompt,
  messages: [
    { role: 'user', content: userMessage }
  ]
});

const content = response.content[0];
if (content.type === 'text') {
  const result = JSON.parse(content.text);
}
```

### ElevenLabs API Usage
```typescript
const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text: scriptText,
      model_id: 'eleven_monolingual_v1'
    })
  }
);

const audioBuffer = await response.arrayBuffer();
```

## Debugging Tips

### Check Environment Variables
```bash
# In terminal
echo $ANTHROPIC_API_KEY
# Should show your key (if set)

# In code
console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
```

### Test API Routes with curl
```bash
# Test generate endpoint
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Pizza shop with 3 staff"}'
```

### Common Errors

**Error: Module not found '@/components/ui/button'**
```bash
# Solution: Install missing shadcn component
npx shadcn-ui@latest add button
```

**Error: ANTHROPIC_API_KEY is not defined**
```bash
# Solution: Check .env.local exists and has correct format
# Restart dev server after adding environment variables
```

**Error: Mermaid rendering failed**
```typescript
// Solution: Use validator first
import { validateMermaidSyntax } from '@/lib/mermaid-validator';
const { valid, sanitized } = validateMermaidSyntax(mermaidCode);
// Use 'sanitized' version
```

## Performance Considerations

### Optimize for Demo (Not Production)
- Don't worry about caching yet
- Don't optimize bundle size
- Focus on functionality over performance
- Manual testing is enough (no automated tests needed)

### Simple Optimizations
```typescript
// Lazy load heavy components
const ChatbotAssistant = dynamic(() => import('./ChatbotAssistant'), {
  loading: () => <div>Loading chat...</div>
});

// Prevent unnecessary re-renders
const MemoizedFlowchart = React.memo(FlowchartSimple);
```

---

**Remember:** This is a 24-hour MVP sprint. Use the simplest approach that works. Don't over-engineer.
