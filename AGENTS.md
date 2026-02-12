# AGENTS.md — Master Plan for Voys Dial Plan Generator

## Project Overview

**App:** Voys Dial Plan Generator
**Goal:** AI-powered tool that converts simple business descriptions into visual call routing plans with implementation guides
**Stack:** Next.js 14 + TypeScript + Tailwind CSS + Mermaid.js + Claude API + ElevenLabs
**Current Phase:** Phase 1 — 24-Hour MVP Sprint
**Timeline:** Demo Thursday Feb 12, 2pm GMT+1
**User Level:** Vibe-coder (AI writes all code, human guides and tests)

## How I Should Think

1. **Understand Intent First**: Before answering, identify what the user actually needs
2. **Ask If Unsure**: If critical information is missing, ask before proceeding
3. **Plan Before Coding**: Propose a plan, ask for approval, then implement
4. **Verify After Changes**: Run tests or manual checks after each change
5. **Explain Trade-offs**: When recommending something, mention alternatives
6. **Time-Sensitive**: We have 24 hours total - prioritize working over perfect

## Plan → Execute → Verify Workflow

1. **Plan:** Outline a brief approach and ask for approval before coding
2. **Execute:** Implement one feature at a time, focusing on getting it working
3. **Verify:** Test the feature manually (run the dev server, try the flow)
4. **Fix:** If broken, fix immediately before moving to next feature

## Critical Success Factors

⚠️ **TOP PRIORITY ISSUES:**

1. **Mermaid Parser is Finicky** - Use 3-layer validation (see agent_docs/mermaid_validation.md)
2. **Voys Logic Must Be Valid** - Load full Voys docs into Claude context (see agent_docs/voys_rules.md)
3. **Demo Must Work** - Pre-generate backup examples, test thoroughly

## Context Files (Load Only When Needed)

Refer to these for detailed implementation:

- `agent_docs/tech_stack.md`: Complete tech stack, libraries, setup commands
- `agent_docs/code_patterns.md`: Code style, patterns, component structure
- `agent_docs/project_brief.md`: Persistent project rules and workflow
- `agent_docs/product_requirements.md`: Full PRD with all features
- `agent_docs/mermaid_validation.md`: Critical validation strategy for Mermaid
- `agent_docs/voys_rules.md`: Voys platform rules and dial plan validation
- `agent_docs/testing.md`: Manual testing checklist and verification steps

## Current State (Update This After Each Session!)

**Last Updated:** [Date - Update Me!]
**Working On:** Project initialization
**Recently Completed:** Documentation setup
**Blocked By:** None
**Hours Remaining:** ~20 hours to demo
**Next Milestone:** Get basic form + Claude API working

## Development Strategy (24-Hour Sprint)

### Hour-by-Hour Schedule

**Day 1 (Wednesday):**

- Hour 0-1: Environment setup ✓
- Hour 1-3: UI generation with v0.dev (form, checklist, voice preview)
- Hour 3-5: Claude API integration (generate dial plan JSON)
- Hour 5-7: Mermaid implementation with validation
- Hour 7-8: Results page layout, wire everything together
- Hour 8-10: Voys validation logic

**Day 2 (Thursday):**

- Hour 0-2: ElevenLabs integration (voice generation)
- Hour 2-4: Chatbot assistant (optional, cut if behind)
- Hour 4-5: Implementation guide component
- Hour 5-6: Polish, error handling, loading states
- Hour 6-7: Testing with 5 business types
- Hour 7-8: Demo prep, backup examples
- **2pm: DEMO TIME**

## Roadmap

### Phase 1: Foundation (Hour 0-1) ✓

- [x] PRD Created
- [x] Technical Design Created
- [x] AGENTS.md Created
- [ ] Next.js project initialized
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Dev server runs successfully

### Phase 2: Core UI (Hour 1-3)

- [ ] BusinessInputForm component (v0.dev generated)
- [ ] FeatureChecklist component (v0.dev generated)
- [ ] VoicePreview component (v0.dev generated)
- [ ] Components integrated into Next.js app
- [ ] Form submission works (console.log data)

### Phase 3: AI Integration (Hour 3-5)

- [ ] lib/claude.ts created with system prompt
- [ ] src/app/api/generate/route.ts created
- [ ] Test: Business description → JSON response
- [ ] Voys documentation loaded into Claude context
- [ ] Basic validation working

### Phase 4: Visualization (Hour 5-7)

- [ ] lib/mermaid-validator.ts created (3-layer validation)
- [ ] FlowchartSimple component (v0.dev + validation wrapper)
- [ ] FlowchartTechnical component (v0.dev + validation wrapper)
- [ ] Test: JSON → Mermaid renders correctly
- [ ] Fallback rendering works when Mermaid fails

### Phase 5: Results Page (Hour 7-8)

- [ ] src/app/results/page.tsx created
- [ ] All components wired together
- [ ] Test: Full flow from form to results
- [ ] Basic styling applied

### Phase 6: Voice Integration (Day 2, Hour 0-2)

- [ ] lib/elevenlabs.ts created
- [ ] src/app/api/voice/route.ts created
- [ ] Audio players work in VoicePreview
- [ ] Test: Script → Audio generation

### Phase 7: Polish (Day 2, Hour 5-7)

- [ ] Loading states added to all async operations
- [ ] Error messages user-friendly
- [ ] Mobile responsiveness check
- [ ] All UI glitches fixed

### Phase 8: Testing & Demo Prep (Day 2, Hour 7-8)

- [ ] Test 5 business types (pizza, law office, medical, retail, service)
- [ ] Pre-generate 3 backup examples
- [ ] Create demo script
- [ ] Test demo run-through
- [ ] Screenshots + video backup

## What I MUST Do

- ✅ Read AGENTS.md before starting any task
- ✅ Validate ALL Mermaid syntax before rendering (use validator)
- ✅ Load Voys documentation into every Claude API call
- ✅ Test after every feature implementation
- ✅ Keep implementations SIMPLE (MVP, not production)
- ✅ Use v0.dev for ALL UI components (don't hand-code)
- ✅ Focus on working over perfect
- ✅ Update "Current State" section after each session

## What NOT To Do

- ❌ Do NOT skip Mermaid validation (parser is finicky!)
- ❌ Do NOT generate dial plans without Voys rules in context
- ❌ Do NOT add features not in current phase
- ❌ Do NOT perfect code - just make it work for demo
- ❌ Do NOT manually write HTML/CSS (use v0.dev)
- ❌ Do NOT proceed to next feature if current one is broken
- ❌ Do NOT forget to test on the actual dev server
- ❌ Do NOT skip pre-generating backup examples

## Emergency Fallback Plan

### If Behind Schedule (Hour 16+):

**Cut these features first:**

1. ✂️ Chatbot Assistant (biggest complexity)
2. ✂️ ElevenLabs voice (show text scripts only)
3. ✂️ Technical flowchart view (simple view only)

**Keep these non-negotiable:**

1. ✅ Business input form
2. ✅ Claude API generation
3. ✅ Simple flowchart (with text fallback)
4. ✅ Feature checklist
5. ✅ Implementation guide

### Simplest Possible Demo (If Desperate):

- One page: Form + Results
- Claude generates JSON
- Display JSON prettified (no flowchart)
- List features as bullet points
- Show implementation steps as text

## Commands Reference

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build for production
npm run lint            # Check code style

# Testing (Manual)
# 1. Fill form with test business
# 2. Click "Generate My Dial Plan"
# 3. Check: JSON in console? Flowchart renders? Features listed?

# Environment Variables Needed
ANTHROPIC_API_KEY=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
ELEVENLABS_API_KEY=sk_6b4103cec29b269e0baaf9d31c6000fd849426e830e5ad45
```

## Success Metrics (Demo Ready)

### Minimum Viable Demo ✅

- [ ] Form accepts business description
- [ ] Claude generates valid dial plan JSON
- [ ] At least one flowchart renders
- [ ] Feature checklist populates
- [ ] Implementation guide displays
- [ ] No crashes during 5-minute demo

### Ideal Demo 🎯

- [ ] Both flowcharts render correctly
- [ ] Voice previews play audio
- [ ] Chatbot can refine plan once
- [ ] 5 business types tested successfully

## Communication Style

- Be concise and direct
- Explain what you're about to do in 1-2 sentences
- Ask for approval before big changes
- Show me the code you'll create BEFORE creating it
- If stuck, explain the issue and suggest 2-3 solutions

## When I'm Stuck

If encountering errors or blockers:

1. Read the specific agent_docs file for that area
2. Check the debugging playbook in TechDesign doc
3. Ask: "I'm stuck on X because Y. Should I try approach A or B?"
4. If truly blocked, propose cutting the feature and moving on

---

**Remember:** We have 20 hours to build a working demo. Working > Perfect. Test > Assume. Simple > Complex.

**Next Step:** Tell me you've read this file, then start with Phase 1 setup commands.
