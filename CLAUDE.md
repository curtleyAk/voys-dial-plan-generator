# CLAUDE.md — Claude Code Configuration

## Project Context
**App:** Voys Dial Plan Generator
**Stack:** Next.js 14 + TypeScript + Tailwind + Mermaid.js + Claude API + ElevenLabs
**Stage:** 24-Hour MVP Sprint (Demo Thursday Feb 12, 2pm GMT+1)
**User Level:** Vibe-coder (AI writes code, human guides and tests)

## Primary Directive
⚠️ **READ `AGENTS.md` FIRST** — It contains the master plan, current phase, and active state.

## How to Work With Me

### 1. Start Every Session
```
Step 1: Read AGENTS.md completely
Step 2: Check "Current State" section for context
Step 3: Identify current phase and next task
Step 4: Ask: "I see we're working on [task]. Should I proceed?"
```

### 2. Before Implementing Features
```
Step 1: Propose a plan: "Here's how I'll implement X: [brief outline]"
Step 2: Wait for approval
Step 3: Implement incrementally (one small piece at a time)
Step 4: Test after each piece
Step 5: Fix issues before moving on
```

### 3. When Creating Components
```
Step 1: Check if v0.dev should generate it (most UI components)
Step 2: If hand-coding, show the component structure first
Step 3: Get approval before creating file
Step 4: Create file with proper imports and types
Step 5: Test in dev server immediately
```

### 4. When Stuck or Encountering Errors
```
Step 1: Read relevant agent_docs file (tech_stack, mermaid_validation, voys_rules)
Step 2: Check TechDesign doc for debugging playbook
Step 3: Try 2-3 different approaches
Step 4: If still stuck after 15 min, say: "I'm blocked on X because Y. Options: A, B, or cut feature?"
```

## Documentation Reference System

### When to Read Each File
- **AGENTS.md:** Every session start, before every major task
- **agent_docs/tech_stack.md:** Setting up project, adding dependencies, debugging imports
- **agent_docs/mermaid_validation.md:** Implementing flowchart components, debugging Mermaid
- **agent_docs/voys_rules.md:** Creating Claude prompts, validating dial plans
- **agent_docs/project_brief.md:** Questions about conventions, architecture, standards
- **agent_docs/testing.md:** After implementing features, before demo
- **agent_docs/product_requirements.md:** Questions about features, requirements, scope

### Load On Demand (Not All at Once)
```
DON'T: Read all agent_docs files at session start
DO: Read specific file when needed for current task

Example: 
Task: "Implement Mermaid flowchart"
Action: Read agent_docs/mermaid_validation.md now
```

## Critical Success Factors

### Top Priorities (Never Skip)
1. ✅ **Mermaid Validation** — Use 3-layer validation ALWAYS
2. ✅ **Voys Rules** — Load documentation into every Claude API call
3. ✅ **Testing** — Test after every feature, fix before moving on
4. ✅ **Fallbacks** — Always have Plan B (text flow, cached examples)

### Time Management
- **Have:** ~20 hours total to demo
- **Spend wisely:** Get features working, don't perfect them
- **Cut if behind:** Chatbot > Voice > Technical flowchart

## Commands I'll Use

### Development
```bash
npm run dev              # Start dev server (I'll use this often)
cd voys-dial-plan-generator  # Navigate to project
ls -la                   # Check file structure
cat src/components/X.tsx # Read file contents
```

### Testing
```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Pizza shop with 3 staff"}'

# Check environment
echo $ANTHROPIC_API_KEY
```

### File Operations
```bash
# Create component
cat > src/components/NewComponent.tsx << 'EOF'
[component code]
EOF

# Check if file exists
test -f src/lib/mermaid-validator.ts && echo "exists" || echo "missing"
```

## Communication Style

### How I Should Communicate
- **Concise:** 1-2 sentences explaining what I'll do
- **Action-oriented:** "I'll create X by doing Y" not "I could maybe..."
- **Ask when unsure:** "Should I implement A or B?" not assumptions
- **Show before doing:** "Here's the component I'll create: [code]"

### What I Should Avoid
- Long explanations before showing code
- Apologizing for errors (just fix them)
- Creating files without showing structure first
- Implementing features not in current phase
- Over-engineering solutions

## Error Handling Protocol

### When Errors Occur
1. **Don't panic** — Check console first
2. **Don't apologize** — Just explain and fix
3. **Don't guess** — Read error message carefully
4. **Do ask** — If unclear, ask: "This error means X. Should I try Y?"

### Common Errors & Solutions

**"Module not found: @/components/ui/button"**
```bash
npx shadcn-ui@latest add button
```

**"ANTHROPIC_API_KEY is not defined"**
```bash
# Check .env.local exists and has key
# Restart dev server after adding
```

**"Mermaid rendering failed"**
```typescript
// Use validator first
const { sanitized } = validateMermaidSyntax(code);
// Render sanitized version
```

## What NOT To Do (Critical)

### Absolutely Forbidden
- ❌ Skip Mermaid validation (parser WILL break)
- ❌ Generate dial plans without Voys rules in context
- ❌ Delete files without confirmation
- ❌ Add features not in AGENTS.md current phase
- ❌ Move to next feature while current one is broken
- ❌ Bypass failing tests or validation

### Discouraged But Not Forbidden
- ⚠️ Hand-coding UI (prefer v0.dev for speed)
- ⚠️ Complex state management (keep simple)
- ⚠️ Premature optimization (working > fast)

## Workflow Pattern

### Typical Feature Implementation
```
1. Read AGENTS.md → Check current phase
2. Read relevant agent_docs → Get implementation details
3. Propose plan → "I'll implement X by: [steps]"
4. Wait for approval → Get go-ahead
5. Create minimal version → One file/component at a time
6. Test immediately → npm run dev, check browser
7. Fix any issues → Before moving on
8. Update AGENTS.md → Mark task complete
9. Ask what's next → "Feature X done. Next: Y or Z?"
```

### Typical Debugging Session
```
1. User reports error → Get exact error message
2. Check console → Look for red errors
3. Read error carefully → Understand what broke
4. Check file structure → Verify paths correct
5. Try fix → Make smallest change possible
6. Test fix → See if error gone
7. If still broken → Try different approach
8. If stuck after 3 tries → Ask for guidance
```

## Session Management

### At Start of Each Session
```
Me: [Reads AGENTS.md]
Me: "I see we're in [Phase X], working on [Task Y]. 
     Last session completed [Z]. 
     Should I continue with [next task]?"
```

### At End of Each Session
```
Me: "Completed: [list what was done]
     Tested: [what was tested]
     Working: [current state]
     Next: [what's next]
     Should I update AGENTS.md?"
```

### When Blocked
```
Me: "I'm stuck on [problem] because [reason].
     I've tried: [approach A, approach B]
     Options: [C, D, or cut feature]
     What should I do?"
```

## Quality Standards

### Before Saying "Done"
- [ ] Feature works in browser
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] Manual test passed
- [ ] AGENTS.md updated

### Before Moving to Next Feature
- [ ] Current feature fully functional
- [ ] Validation working (if applicable)
- [ ] Fallback working (if applicable)
- [ ] No blockers remaining

## Integration with Other Tools

### When Using v0.dev
```
Me: "I'll use v0.dev to generate [component].
     Here's the prompt I'll use: [show prompt]
     Then I'll integrate it by: [integration plan]"
```

### When Using External APIs
```
Me: "I'll integrate [API] by:
     1. Creating lib/[name].ts with client
     2. Creating API route at /api/[endpoint]
     3. Testing with curl first
     4. Then connecting to UI"
```

## Success Indicators

### I'm Doing Well When:
- Features work after first implementation
- No errors in console after each commit
- User says "great, what's next?" frequently
- Demo preparation is ahead of schedule

### I Need to Adjust When:
- Same error appearing repeatedly
- Features breaking after "completion"
- Behind on hour-by-hour schedule
- User saying "that's not what I meant"

---

**My Prime Directive:** Read AGENTS.md first. Plan before coding. Test after every change. Fix issues immediately. Keep it simple. Make it work.

**I am ready to:** Build the Voys Dial Plan Generator MVP in 24 hours. Let's ship it! 🚀
