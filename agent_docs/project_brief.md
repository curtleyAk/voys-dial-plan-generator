# Project Brief (Persistent Rules)

## Product Vision
AI-powered tool that converts simple business descriptions into visual call routing plans for Voys telecom customers, reducing support tickets and enabling self-service phone system configuration.

## Coding Conventions

### File Naming
- Components: PascalCase (e.g., `BusinessInputForm.tsx`)
- Utilities: camelCase (e.g., `mermaid-validator.ts`)
- Types: camelCase (e.g., `dialplan.ts`)
- API routes: lowercase with hyphens (e.g., `generate/route.ts`)

### Component Structure
```typescript
// 1. Imports (React, external libs, internal components)
import { useState } from 'react';
import { Card } from '@/components/ui/card';

// 2. Types/Interfaces
interface ComponentProps {
  data: string;
}

// 3. Component function
export function ComponentName({ data }: ComponentProps) {
  // 4. State
  const [loading, setLoading] = useState(false);
  
  // 5. Handlers
  const handleAction = async () => {
    // implementation
  };
  
  // 6. Render
  return <div>{/* JSX */}</div>;
}
```

### Naming Conventions
- Variables: camelCase (`businessData`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINT`, `MAX_TIMEOUT`)
- Functions: camelCase (`validateInput`, `generateDialPlan`)
- Components: PascalCase (`FlowchartSimple`, `VoicePreview`)
- Types: PascalCase (`DialPlan`, `ValidationResult`)

### Import Organization
```typescript
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import Anthropic from '@anthropic-ai/sdk';
import Mermaid from 'react-mermaid2';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Utils and types
import { validateMermaidSyntax } from '@/lib/mermaid-validator';
import type { DialPlan } from '@/types/dialplan';

// 5. Styles (if any)
import './styles.css';
```

### Error Handling Standard
```typescript
// Always wrap async operations in try-catch
try {
  const result = await riskyOperation();
  // handle success
} catch (error) {
  // Log technical error
  console.error('Operation failed:', error);
  
  // Show user-friendly message
  setError('Something went wrong. Please try again.');
}
```

## Quality Gates

### Before Committing
- [ ] Code runs without errors (`npm run dev`)
- [ ] TypeScript has no errors (check IDE)
- [ ] All imports resolve correctly
- [ ] Component renders in browser
- [ ] Feature works as expected

### Before Moving to Next Feature
- [ ] Current feature fully works
- [ ] No console errors
- [ ] Manual testing passed
- [ ] Validation (if applicable) works

### Before Demo
- [ ] All 5 test cases pass
- [ ] No errors in console
- [ ] Works on clean browser (no cache)
- [ ] Backup examples pre-generated
- [ ] Demo script practiced

## Key Commands

### Development
```bash
npm run dev           # Start dev server (http://localhost:3000)
npm run build         # Build (not needed for demo)
npm run type-check    # Check TypeScript (if configured)
```

### Testing (Manual)
1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Fill form with test data
4. Click "Generate My Dial Plan"
5. Verify: JSON logged? Flowchart renders? Features listed?

### Environment
```bash
# Check API keys are set
echo $ANTHROPIC_API_KEY
echo $ELEVENLABS_API_KEY

# If empty, add to .env.local
```

## Architectural Principles

### Keep It Simple
- MVP focus: Working > Perfect
- No premature optimization
- No complex state management (Context/Zustand only if needed)
- No testing framework (manual testing is fine)

### Component Responsibility
- Components handle UI only
- API routes handle business logic
- Lib files handle utilities
- Keep components small and focused

### Data Flow
```
User Input (Form)
  ↓
API Route (generate)
  ↓
Claude API (AI processing)
  ↓
Validation (Mermaid + Voys)
  ↓
Component Display (Results)
```

### Error Philosophy
- Fail gracefully (show fallback, not crash)
- Log technical errors to console
- Show user-friendly messages in UI
- Always provide next action ("Try again", "Simplify description")

## Tech Debt Management

### Allowed for MVP
- No automated tests
- No optimization (caching, lazy loading)
- Inline styles if needed quickly
- Console.logs for debugging
- Hardcoded values (max timeout, etc.)

### Not Allowed (Even for MVP)
- Exposed API keys in client code
- Broken features in production
- Features not in PRD Phase 1
- Skipping validation (Mermaid or Voys)

## Update Cadence

### After Each Session
- [ ] Update AGENTS.md "Current State" section
- [ ] Update roadmap checkboxes
- [ ] Note any blockers discovered
- [ ] Log hours remaining

### When Adding New Feature
- [ ] Add to roadmap if not there
- [ ] Check dependencies
- [ ] Verify it's in current phase
- [ ] Test after implementation

### When Encountering Issues
- [ ] Document in AGENTS.md "Blocked By"
- [ ] Try 2-3 solutions
- [ ] If still stuck, ask for help or cut feature
- [ ] Update timeline if needed

## Communication Standards

### With AI Assistant
- Be specific: "Create FlowchartSimple component" not "make flowchart"
- Provide context: "Following the Tech Design, using v0.dev pattern"
- Ask for plan first: "How would you implement this?"
- Verify understanding: "Does this match the PRD requirement?"

### With User/Stakeholder
- Focus on working demo
- Explain trade-offs made
- Highlight next steps
- Be honest about limitations

## Success Criteria Reminder

### Minimum Viable Demo
- Form accepts business description ✓
- Claude generates JSON ✓
- At least one flowchart renders ✓
- Feature checklist shows ✓
- Implementation guide displays ✓
- No crashes during demo ✓

### Stretch Goals
- Both flowcharts work
- Voice audio plays
- Chatbot refines once
- Mobile responsive

---

**Philosophy:** Speed with quality. Working beats perfect. Test everything. Ask when unsure.
