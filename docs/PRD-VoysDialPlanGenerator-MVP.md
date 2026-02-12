# Product Requirements Document: Voys Dial Plan Generator MVP

## Overview

**Product Name:** Voys Dial Plan Generator
**Problem Statement:** Voys customers struggle to configure complex call routing without technical knowledge, leading to support tickets and poor phone system setup. The technical complexity of telecom terminology (IVR, call groups, queues) and inability to visualize call flows creates barriers to proper system configuration.
**MVP Goal:** Create a demo-ready prototype in 24 hours that enables 5-10 test users to successfully generate dial plans and secure stakeholder approval for next phase
**Target Launch:** 24 hours from project start

## Target Users

### Primary User Profile
**Who:** Voys telecom customers - small business owners, office managers, and non-technical staff responsible for phone system setup
**Problem:** They don't understand telecom jargon (IVR, call groups, queues) and can't visualize how calls flow through their system
**Current Solution:** Manual configuration in Voys admin panel OR calling support for help (creating support ticket burden)
**Why They'll Switch:** Instant visual understanding of call routing + AI-generated implementation guide eliminates guesswork and reduces support dependency

### User Persona: Sarah the Office Manager
- **Demographics:** 30-45 years old, South Africa, manages small business operations
- **Tech Level:** Intermediate (comfortable with web apps, not comfortable with telecom configuration)
- **Goals:** Set up professional phone system quickly without calling support every time
- **Frustrations:** 
  - Telecom jargon is confusing
  - Can't visualize how calls will actually flow
  - Afraid of misconfiguring and missing important calls
  - Too many options in admin panel, unclear what's needed

## User Journey

### The Story
Sarah's pizza shop just signed up with Voys. She needs to set up call routing so:
- Daytime calls go to staff
- After-hours calls go to voicemail
- Busy times queue callers with music
- Delivery drivers can reach kitchen directly

She opens the Voys admin panel and feels overwhelmed. Terms like "dial plan," "IVR," and "call group" mean nothing to her. She doesn't know where to start.

She discovers the Voys Dial Plan Generator. She enters: "I run a pizza shop with 3 staff. We're open 9am-9pm. Need voicemail after hours and call waiting during rush."

Within seconds, she sees:
1. A simple flowchart showing exactly how calls will flow
2. A Voys-style technical diagram (matches what she'll see in admin)
3. A checklist: "You'll use: Call Group, Opening Hours, Voicemail, Queue"
4. Step-by-step instructions to implement it herself
5. Audio previews of the greetings that will play

She can now either implement it herself (following the guide) or send this visual plan to Voys support with clear context. No more confusion.

### Key Touchpoints
1. **Discovery:** Link from Voys welcome email, or embedded in admin panel as "Need help? Try our Dial Plan Generator"
2. **First Contact:** Clean landing page with simple promise: "Describe your business, get your call routing plan in 30 seconds"
3. **Onboarding:** Single-page form (no account needed for prototype) - just describe your business
4. **Core Loop:** Submit → AI generates → View dual flowcharts → Refine with chatbot → Export guide
5. **Retention:** They return when business changes (add staff, change hours) or recommend to other Voys customers

## MVP Features

### Core Features (Must Have)

#### 1. Business Input Form
- **Description:** Simple form collecting business context: industry type, number of staff, operating hours, basic routing needs (e.g., "need voicemail," "have departments")
- **User Value:** No telecom knowledge required - just describe business in plain English
- **Success Criteria:**
  - Users can describe business in 2-3 sentences
  - Form validates basic inputs (staff count, hours format)
  - Submit triggers AI generation within 5 seconds
  - Form includes examples for common business types (retail, restaurant, office, service business)
- **Priority:** Critical (P0)

#### 2. Visual Flowchart Display (Dual View)
- **Description:** Two side-by-side visualizations:
  - **Simple View:** 8-year-old friendly flowchart (big icons, plain language: "Call comes in" → "Are we open?" → "Ring everyone")
  - **Technical View:** Voys-style diagram matching their admin panel structure (using actual Voys terminology)
- **User Value:** Simple view for understanding, technical view for implementation reference
- **Success Criteria:**
  - Both flowcharts auto-generate from same AI output (JSON structure)
  - Simple view uses no jargon, only plain language
  - Technical view matches Voys admin terminology exactly
  - Flowcharts handle common scenarios: time routing, multi-level menus, call groups, queues, voicemail
  - Visual renders in under 2 seconds after AI response
- **Priority:** Critical (P0)
- **Technical Note:** Decision between Mermaid.js (simpler, faster) vs React Flow (more interactive) - recommend Mermaid.js for 24hr timeline

#### 3. Voice Transcripts Generation (ElevenLabs)
- **Description:** AI generates realistic voice greetings and plays audio previews
  - Welcome message: "Thank you for calling [Business Name]..."
  - Menu options: "Press 1 for Sales, Press 2 for Support..."
  - Voicemail: "You've reached [Business]. We're currently closed..."
- **User Value:** Hear exactly what callers will experience, professional voice previews without recording equipment
- **Success Criteria:**
  - AI writes contextually appropriate scripts for each business type
  - ElevenLabs generates audio samples (30-60 second previews)
  - Audio player embedded in results page
  - Scripts are downloadable as text for manual recording option
- **Priority:** Critical (P0)
- **Budget Note:** ElevenLabs has free tier (10k characters/month) - sufficient for prototype

#### 4. Dynamic Feature Checklist
- **Description:** Sidebar showing which Voys features are being used in the generated plan, with checkboxes and links to Voys help docs
- **User Value:** Clear inventory of what they need to configure, educational (learn feature names)
- **Success Criteria:**
  - Checklist auto-populates based on AI-generated plan
  - Each item links to relevant Voys help article (e.g., "Call Group" → https://help.voys.co.za/callgroup)
  - Visual indicators: icon + feature name + "What this does" tooltip
  - Common features tracked: Opening Hours, Call Group, IVR, Voicemail, Queue, Call Recording, Music on Hold
- **Priority:** Critical (P0)

#### 5. Chatbot Assistant (Plan Refinement)
- **Description:** Chat interface for iterating on the plan: "Can you add a separate line for delivery drivers?" or "What if I want sales to ring longer than support?"
- **User Value:** Refine without starting over, ask questions in natural language
- **Success Criteria:**
  - Chat persists context of current dial plan
  - Can modify plan based on natural language requests
  - Updates flowcharts and checklist in real-time
  - Handles common modifications: add/remove users, change timing, add menu options, modify routing logic
  - Provides explanations: "I've added a Queue so callers hear music when staff are busy"
- **Priority:** Critical (P0)
- **Technical Note:** Uses same Claude API as initial generation, maintains conversation context

#### 6. Implementation Guide
- **Description:** Step-by-step instructions for configuring the plan in Voys admin panel
- **User Value:** DIY setup without support ticket, clear action items
- **Success Criteria:**
  - Numbered steps matching Voys admin workflow
  - Each step includes: action + screenshot reference + expected outcome
  - Links directly to relevant admin sections
  - Structured in logical order: "First set up users, then create call group, then configure dial plan..."
  - Downloadable as PDF or printable
  - Includes "Stuck? Here's how to get help" section
- **Priority:** Critical (P0)

### Future Features (Not in MVP)
| Feature | Why Wait | Planned For |
|---------|----------|-------------|
| Voys API Integration | Need to establish API access, security, testing | Version 2 (Month 2) |
| n8n Automation | Requires API integration first, adds complexity | Version 2 (Month 2) |
| User Accounts/Login | Not needed for prototype demo, adds development time | Version 2 (Month 3) |
| Save Multiple Plans | Requires user accounts and database | Version 2 (Month 3) |
| Direct Flowchart Editing | Complex interaction design, drag-drop library integration | Version 3 (Month 4+) |
| Advanced Customization | Need user feedback on what customizations matter most | Version 3 (Month 4+) |
| Multi-language Support | Focus on English for South African market first | Version 3 (Future) |
| White-label for Resellers | Business model decision needed first | Future (TBD) |

## Success Metrics

### Primary Metrics (First Week - Prototype Phase)

1. **Demo Approval:** Internal stakeholders approve prototype for next development phase
   - How to measure: Stakeholder sign-off meeting
   - Why it matters: Gates funding/resources for v2

2. **User Success Rate:** 8 out of 10 test users successfully generate a usable dial plan without assistance
   - How to measure: Task completion observation, post-test survey
   - Why it matters: Validates core value proposition

3. **Comprehension Score:** Test users can explain their dial plan flow in their own words after viewing flowcharts
   - How to measure: "Explain what happens when someone calls you" interview question
   - Why it matters: Proves visualization clarity

### Secondary Metrics (If Moving to Beta)

- **Support Ticket Reduction:** 30% fewer dial plan setup tickets in first month
- **Time to Configure:** Average setup time reduced from 45 minutes to 15 minutes
- **Chatbot Refinement Rate:** 60%+ of users refine plan at least once (shows engagement)
- **Implementation Rate:** 70%+ of generated plans are actually implemented

## UI/UX Direction

**Design Feel:** Professional, Clear, Confidence-Building, Voys-Branded

**Inspiration:** Stripe Dashboard (clean data viz), Zapier (friendly automation), Figma (dual simple/technical view toggle)

### Key Screens

1. **Landing/Input Page**
   - Purpose: Collect business context and set expectations
   - Key Elements:
     - Hero: "Turn Your Business Description Into A Professional Phone System"
     - Example inputs for common business types (click to pre-fill)
     - Simple form: Business type dropdown, staff count, hours, special needs (textarea)
     - Trust indicators: "Used by X Voys customers" (when live)
   - User Actions: Fill form, click "Generate My Dial Plan"

2. **Results Dashboard** (Main View)
   - Purpose: Display generated plan with all outputs
   - Key Elements:
     - **Left Column (30% width):**
       - Feature Checklist (sticky)
       - Chatbot Assistant (collapsible)
       - Export buttons (PDF, Email to Support)
     - **Right Column (70% width):**
       - Tab Toggle: "Simple View" | "Technical View"
       - Flowchart display (full width)
       - Voice Preview section (audio players + scripts)
       - Implementation Guide (collapsible accordion)
   - User Actions: Switch views, play audio, chat refinements, download guide

3. **Implementation Guide (Expanded View)**
   - Purpose: Step-by-step configuration instructions
   - Key Elements:
     - Progress tracker (Step 1 of 7)
     - Screenshots/visual aids for each step
     - "Where to find this in Voys Admin" links
     - Estimated time per step
     - Success checkpoints
   - User Actions: Follow steps, check off completed, print/download

### Design Principles
- **Clarity Over Cleverness:** No jargon unless explaining Voys terms, plain language default
- **Show, Don't Tell:** Visuals first (flowcharts, icons), text second (explanations)
- **Progressive Disclosure:** Simple view by default, technical details available on demand
- **Confidence Building:** Every screen reinforces "You can do this yourself" or "We'll help you"

### Simple Wireframe
```
[Results Dashboard Layout]

┌─────────────────────────────────────────────────────────┐
│  [Logo] Voys Dial Plan Generator          [Export] [Share] │
├──────────────┬──────────────────────────────────────────┤
│              │  [Simple View] | [Technical View]         │
│  FEATURES    │                                           │
│  ☑ Opening Hrs│         ┌──────────────┐               │
│  ☑ Call Group│         │ Call Arrives │                │
│  ☑ Voicemail │         └──────┬───────┘                │
│  ☑ Queue     │                │                         │
│  ☐ IVR       │         ┌──────▼────────┐               │
│              │         │ Are we open?  │               │
│  [Chat Icon] │         └──┬─────────┬──┘               │
│  Ask me to   │            │Yes      │No                │
│  refine plan │     ┌──────▼──┐  ┌───▼──────┐          │
│              │     │Ring Team│  │Voicemail │          │
│              │     └─────────┘  └──────────┘          │
│              │                                           │
│              │  VOICE PREVIEWS                          │
│              │  🔊 Welcome Message    [Play]            │
│              │  🔊 Voicemail Greeting [Play]            │
│              │                                           │
│              │  SETUP GUIDE                             │
│              │  ▼ Step 1: Create Users                  │
│              │  ▼ Step 2: Set Opening Hours             │
│              │  ▼ Step 3: Configure Call Group...       │
└──────────────┴──────────────────────────────────────────┘
```

## Technical Considerations

**Platform:** Web application (desktop-first, then mobile responsive)

**Responsive:** 
- Desktop (primary): 1920x1080, 1440x900 optimized
- Tablet (secondary): 1024x768 works acceptably
- Mobile (future): Not priority for v1 prototype

**Performance Goals:**
- Initial page load: < 3 seconds
- AI generation response: < 5 seconds (streaming response for user feedback)
- Flowchart render: < 2 seconds
- Voice generation: < 10 seconds per audio clip

**Security/Privacy:** 
- No user authentication in prototype (no stored data)
- Business descriptions are sent to Claude API (inform users)
- No PII collection required
- Local hosting (internal network only for prototype)

**Scalability:** 
- Prototype: 10-20 concurrent users max (local hosting)
- Beta (if greenlit): 100+ users (move to cloud hosting)
- API rate limits: Claude API free tier initially

**Browser/Device Support:**
- Chrome, Edge (latest versions) - primary
- Safari, Firefox (latest) - secondary
- No IE11 support

**Technology Stack Recommendations:**

| Component | Recommended Tool | Rationale |
|-----------|-----------------|-----------|
| Frontend Framework | Next.js 14 (App Router) | Fast setup, SSR for performance, Vercel deployment ready |
| UI Generation | v0.dev or Bolt.new | Fastest path to working UI in 24hrs |
| Flowchart Library | Mermaid.js | Simpler than React Flow, text-based (AI can generate), good for dual views |
| AI Integration | Claude API (Anthropic) | You have subscription, excellent at structured outputs, can generate Mermaid syntax |
| Voice Generation | ElevenLabs API | Free tier available, high-quality output, simple REST API |
| Styling | Tailwind CSS | Built into Next.js/v0 tooling, rapid styling |
| State Management | React Context or Zustand | Keep it simple for prototype |
| Deployment | Local (localhost) | No hosting cost, stakeholder demo environment |

**Alternative Considerations:**
- React Flow (if flowchart interactivity needed in future) - more complex, requires more dev time
- Supabase (if need to add database later) - free tier, easy auth
- Vercel (if need public demo) - free tier, instant deployment

## Constraints & Requirements

### Budget
- **Development tools:** $0 (using free tiers)
- **Claude API:** Covered by existing subscription
- **ElevenLabs API:** $0 (free tier: 10,000 chars/month = ~20 dial plans with voice)
- **Hosting:** $0 (local hosting for prototype)
- **Total:** $0/month for prototype phase

### Timeline
- **MVP Development:** 24 hours (sprint mode)
  - Hour 0-4: PRD finalization, technical design, prompt engineering
  - Hour 4-12: Frontend generation (v0.dev), API integration, flowchart implementation
  - Hour 12-20: Voice integration, chatbot, testing, refinement
  - Hour 20-24: Documentation, demo preparation, stakeholder presentation deck
- **Beta Testing:** Week 2 (if approved)
- **Production Launch:** Month 2 (if validated)

### Technical Constraints
- Must run locally (no cloud hosting requirement for v1)
- Zero-budget requirement (free tier APIs only)
- Must integrate with existing Voys help documentation (link structure)
- Must use Voys branding/terminology in technical view
- Output must be compatible with future n8n automation (JSON structure planning)

### Non-Technical Constraints
- Cannot make actual API calls to Voys system (no write access in prototype)
- Cannot store user data (no database in v1)
- Stakeholder demo must run offline if needed (Claude API may need caching strategy)

## Open Questions & Assumptions

### Open Questions
- Which Voys features are most commonly misunderstood? (Prioritize in simple explanations)
- Do we have access to actual Voys dial plan examples for AI training context?
- Who are the specific stakeholders for the 24hr demo? (Tailor demo scenarios)
- What's the preferred Voys brand color scheme? (Design consistency)

### Key Assumptions
- Claude API will reliably generate valid Mermaid syntax for flowcharts
- ElevenLabs voice quality is acceptable for business use (not "robotic")
- Test users have access to Voys admin panel (for implementation validation)
- Simple flowchart view genuinely helps non-technical users (hypothesis to validate)
- 24-hour timeline is achievable with v0.dev/Bolt.new code generation tools
- Stakeholders will accept prototype without Voys API integration

## Quality Standards

**Code Quality:**
- **Type Safety:** Use TypeScript for all components (catch errors during rapid development)
- **Error Handling:** Graceful failures for API timeouts (show friendly message + retry option)
- **Code Comments:** Document all AI prompt templates and JSON schemas (for future developers)

**Design Quality:**
- **Consistency:** Use Voys brand colors throughout (once obtained)
- **Accessibility Basics:** Proper color contrast, keyboard navigation for main flow
- **Visual Hierarchy:** Clear primary actions (Generate, Refine, Download)

**AI Output Quality:**
- **Dial Plan Logic:** Must be technically valid according to Voys documentation
- **Voice Scripts:** Professional tone, no placeholder text ("X" or "example business")
- **Mermaid Syntax:** Must render without errors (validate before display)

### What This Project Will NOT Accept:
- **Placeholder Content:** No "Lorem ipsum" or "Sample Business Name" in generated outputs
- **Broken Features:** If ElevenLabs fails, show text scripts only (don't hide feature)
- **Invalid Dial Plan Logic:** AI must respect Voys routing rules (e.g., can't route to non-existent feature)
- **Confusing Flowcharts:** If user can't explain flow back to you, visualization failed
- **Jargon in Simple View:** No technical terms unless explaining them

## Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| AI generates invalid Voys logic | High | Load all Voys help docs into Claude context, use structured output validation, manual review of first 10 outputs |
| Mermaid syntax errors break flowchart | High | Validate Mermaid syntax before rendering, fallback to text-based flow if render fails |
| ElevenLabs API quota exceeded | Medium | Cache generated audio for common scenarios, implement text-only fallback, add "Generate Voice" as optional feature |
| 24hr timeline too aggressive | High | Use v0.dev to generate 80% of UI instantly, focus on core flow only (drop nice-to-haves if needed), pre-write all AI prompts |
| Stakeholders want Voys API integration | Medium | Demonstrate n8n integration path in deck, show JSON export as interim solution |
| Test users still confused by flowcharts | High | A/B test Mermaid vs React Flow in first 3 users, add more icons/colors if text-heavy |
| Claude API rate limits hit during demo | Medium | Pre-generate 5 example plans, cache responses, have offline fallback demo mode |
| Voice quality sounds too robotic | Low | Test 3 ElevenLabs voices, pick most natural, add disclaimer "Preview voice - customize in Voys" |

## MVP Completion Checklist

### Development Complete
- [ ] Input form collects: business type, staff count, hours, special needs
- [ ] Claude API integration generates dial plan JSON from business description
- [ ] Mermaid.js renders simple flowchart (plain language)
- [ ] Mermaid.js renders technical flowchart (Voys terminology)
- [ ] Feature checklist dynamically populates from dial plan JSON
- [ ] ElevenLabs generates welcome, menu, and voicemail scripts with audio
- [ ] Chatbot assistant can refine plan via natural language
- [ ] Implementation guide generates step-by-step instructions with Voys admin links
- [ ] Export functionality (PDF, copy text, email option)

### Quality Assurance
- [ ] Test with 3 diverse business types (restaurant, office, retail)
- [ ] Verify dial plan logic matches Voys documentation rules
- [ ] Confirm flowcharts render correctly on Chrome and Safari
- [ ] Audio previews play without errors
- [ ] Chatbot maintains context through 3-turn conversation
- [ ] Implementation guide links point to correct Voys help pages
- [ ] Form validation prevents empty submissions
- [ ] Error messages are user-friendly (no technical jargon)

### Demo Preparation
- [ ] 5 pre-generated example plans cached (backup if API fails)
- [ ] Stakeholder demo script written (5-minute walkthrough)
- [ ] Video recording of successful user flow (backup demo)
- [ ] Comparison doc: "Before (manual setup) vs After (generator)" talking points
- [ ] Next steps slide deck (v2 roadmap with API integration)

### Documentation
- [ ] README with setup instructions for developers
- [ ] AI prompt templates documented (for reproducibility)
- [ ] JSON schema documented (dial plan structure)
- [ ] Voys feature mapping table (checklist items → help URLs)

## JSON Schema Specification (For AI Output)

The AI must generate dial plans in this structure for flowchart rendering:

```json
{
  "businessContext": {
    "name": "Bella's Pizza",
    "type": "restaurant",
    "staffCount": 3,
    "hours": "09:00-21:00",
    "timezone": "Africa/Johannesburg"
  },
  "dialPlan": {
    "nodes": [
      {
        "id": "entry",
        "type": "entryPoint",
        "label": "Call Arrives",
        "simpleLabel": "Someone calls"
      },
      {
        "id": "time_check",
        "type": "timeCondition",
        "label": "Opening Hours Check",
        "simpleLabel": "Are we open?",
        "config": {
          "openHours": "09:00-21:00",
          "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        }
      },
      {
        "id": "welcome_msg",
        "type": "announcement",
        "label": "Welcome Message",
        "simpleLabel": "Play greeting",
        "config": {
          "script": "Thank you for calling Bella's Pizza. Please hold while we connect you.",
          "voiceId": "elevenlabs_voice_id"
        }
      },
      {
        "id": "call_group",
        "type": "callGroup",
        "label": "Ring All Staff",
        "simpleLabel": "Ring everyone",
        "config": {
          "strategy": "simultaneous",
          "members": ["staff1", "staff2", "staff3"],
          "timeout": 30
        }
      },
      {
        "id": "queue",
        "type": "queue",
        "label": "Call Queue",
        "simpleLabel": "Wait with music",
        "config": {
          "maxWaitTime": 300,
          "musicOnHold": "default"
        }
      },
      {
        "id": "voicemail",
        "type": "voicemail",
        "label": "After Hours Voicemail",
        "simpleLabel": "Leave message",
        "config": {
          "greeting": "You've reached Bella's Pizza. We're currently closed. Please leave a message.",
          "emailNotify": true
        }
      }
    ],
    "edges": [
      {
        "from": "entry",
        "to": "time_check",
        "condition": null
      },
      {
        "from": "time_check",
        "to": "welcome_msg",
        "condition": "open",
        "label": "Yes (Open)"
      },
      {
        "from": "time_check",
        "to": "voicemail",
        "condition": "closed",
        "label": "No (Closed)"
      },
      {
        "from": "welcome_msg",
        "to": "call_group",
        "condition": null
      },
      {
        "from": "call_group",
        "to": "queue",
        "condition": "busy",
        "label": "All busy"
      },
      {
        "from": "call_group",
        "to": "end",
        "condition": "answered",
        "label": "Connected"
      }
    ]
  },
  "features": [
    {
      "id": "opening_hours",
      "name": "Opening Hours",
      "description": "Routes calls differently during business hours vs closed",
      "helpUrl": "https://help.voys.co.za/opening-hours-basic",
      "used": true
    },
    {
      "id": "call_group",
      "name": "Call Group",
      "description": "Rings multiple phones at once",
      "helpUrl": "https://help.voys.co.za/callgroup",
      "used": true
    },
    {
      "id": "queue",
      "name": "Queue",
      "description": "Holds callers with music when everyone is busy",
      "helpUrl": "https://help.voys.co.za/queue",
      "used": true
    },
    {
      "id": "voicemail",
      "name": "Voicemail",
      "description": "Records messages when closed",
      "helpUrl": "https://help.voys.co.za/voicemail",
      "used": true
    },
    {
      "id": "ivr",
      "name": "IVR Menu",
      "description": "Press 1 for Sales, Press 2 for Support",
      "helpUrl": "https://help.voys.co.za/ivr",
      "used": false
    }
  ],
  "voiceScripts": [
    {
      "type": "welcome",
      "text": "Thank you for calling Bella's Pizza. Please hold while we connect you to our team.",
      "duration": "5 seconds"
    },
    {
      "type": "voicemail",
      "text": "You've reached Bella's Pizza. We're currently closed. Our hours are 9 AM to 9 PM daily. Please leave your name, number, and order details, and we'll call you back. Thanks!",
      "duration": "12 seconds"
    }
  ],
  "implementationSteps": [
    {
      "step": 1,
      "title": "Create User Accounts",
      "description": "Add your 3 staff members to Voys",
      "actions": [
        "Go to Admin > Users",
        "Click 'Add User' for each staff member",
        "Assign them phone extensions (e.g., 101, 102, 103)"
      ],
      "helpUrl": "https://help.voys.co.za/admin",
      "estimatedTime": "5 minutes"
    },
    {
      "step": 2,
      "title": "Configure Opening Hours",
      "description": "Set your business hours (9 AM - 9 PM daily)",
      "actions": [
        "Go to Admin > Opening Hours",
        "Create schedule: Mon-Sun 09:00-21:00",
        "Save the schedule"
      ],
      "helpUrl": "https://help.voys.co.za/opening-hours-basic",
      "estimatedTime": "3 minutes"
    }
  ]
}
```

## System Prompt for AI (Claude Integration)

Use this exact prompt when calling Claude API:

```
You are the Voys Dial Plan Architect, an expert in telecommunications call routing for small businesses in South Africa. Your job is to analyze a business description and generate a professional, logical dial plan.

CONTEXT:
Voys is a cloud PBX provider. Their customers need to configure call routing (dial plans) but often lack technical knowledge. You must translate business needs into technical implementations.

AVAILABLE VOYS FEATURES:
- Opening Hours: Time-based routing (open vs closed)
- Call Groups: Ring multiple users simultaneously or sequentially
- IVR: Interactive Voice Response menus (Press 1 for X, Press 2 for Y)
- Voicemail: Record messages with custom greetings
- Queue: Hold callers with music when all staff busy
- Call Recording: Record conversations
- Announcements: Play messages to callers
- Filters: Route based on caller ID or number patterns
- Fixed-Mobile: Connect office and mobile numbers

VOYS DOCUMENTATION:
{context: include relevant Voys help doc content here}

INPUT FORMAT:
User will describe their business like: "I run a pizza shop with 3 staff, open 9am-9pm, need voicemail after hours"

OUTPUT FORMAT:
Return valid JSON matching this schema:
{include the JSON schema from above}

RULES:
1. Keep dial plans SIMPLE - most businesses need: time check → ring staff → voicemail/queue
2. Only use IVR if business explicitly mentions "departments" or "press 1 for..."
3. Always include voicemail for after-hours
4. Use Call Groups (not individual users) unless business specifies specific routing
5. Generate professional voice scripts in a friendly, business-appropriate tone
6. For "simpleLabel" - use plain English (no jargon): "Are we open?" not "Time Condition Check"
7. For "label" - use proper Voys terminology: "Opening Hours Check" not "Business Hours Gate"
8. Implementation steps must be actionable and reference actual Voys admin paths
9. If business needs are unclear, make reasonable assumptions based on industry type

EXAMPLE TRANSLATION:
Input: "Dental office, 2 dentists, 1 receptionist, need appointment booking"
→ Generate: Time check → Welcome msg → Ring receptionist (30s) → Queue with music → Voicemail
Features: Opening Hours, Call Group, Queue, Voicemail, Announcements

Now process the following business description:
{user input here}
```

## AI Prompt Templates for v0.dev / Bolt.new

### Prompt 1: Generate Landing Page with Input Form

```
Create a Next.js landing page for "Voys Dial Plan Generator" with:

1. Hero section:
   - Headline: "Turn Your Business Description Into A Professional Phone System"
   - Subheadline: "Generate a visual call routing plan in 30 seconds - no technical knowledge required"
   - Voys logo placeholder

2. Input form (centered, max-width 600px):
   - Business type dropdown: Restaurant, Office, Retail Store, Service Business, Medical Practice, Other
   - Business name (text input)
   - Number of staff (number input, min 1, max 50)
   - Operating hours (two time inputs: open time, close time)
   - Special needs (textarea, placeholder: "E.g., Need separate line for deliveries, Have sales and support teams, Need appointment booking")
   - Submit button: "Generate My Dial Plan" (primary CTA, blue)

3. Example cards below form (3 columns):
   - "Pizza Shop Example" (click to pre-fill: Restaurant, 3 staff, 9am-9pm, "need voicemail after hours")
   - "Law Office Example" (click to pre-fill: Office, 5 staff, 8am-5pm, "separate lines for lawyers")
   - "Retail Store Example" (click to pre-fill: Retail, 2 staff, 10am-6pm, "queue during busy times")

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui components
Style: Clean, professional, Voys brand colors (blue primary, use placeholder if unknown)
```

### Prompt 2: Generate Results Dashboard

```
Create a Next.js results dashboard with 2-column layout:

LEFT COLUMN (30% width, sticky):
1. Feature Checklist:
   - Title: "Your Phone System Will Use:"
   - List of features with checkboxes (pre-checked), icons, and info tooltips:
     * Opening Hours (clock icon)
     * Call Group (users icon)
     * Voicemail (mic icon)
     * Queue (clock icon)
     * IVR Menu (keypad icon - unchecked by default)
   - Each item links to Voys help docs (external link icon)

2. Chatbot Assistant (collapsible):
   - Chat bubble interface
   - Title: "Refine Your Plan"
   - Example prompts: "Add a separate line for deliveries", "Make sales ring longer"
   - Message input with send button

3. Export buttons:
   - "Download PDF Guide"
   - "Email to Voys Support"

RIGHT COLUMN (70% width):
1. Tab navigation:
   - "Simple View" (active)
   - "Technical View"

2. Flowchart display area:
   - Placeholder for Mermaid diagram
   - Height: 500px, scrollable if needed

3. Voice Previews section:
   - Title: "Your Voice Greetings"
   - 2-3 audio players with labels: "Welcome Message", "Voicemail Greeting"
   - Text transcript below each player (collapsible)

4. Implementation Guide (accordion):
   - Title: "How to Set This Up in Voys"
   - Expandable steps (numbered)
   - Each step has: title, description, estimated time

Tech stack: Next.js 14, Tailwind CSS, shadcn/ui (Tabs, Accordion, Card components)
Make it responsive: stack columns on mobile
```

## Next Steps

After this PRD is approved:
1. **Finalize System Prompt** - Load Voys documentation into Claude context
2. **Create Technical Design Document** (Part 3) - API integration architecture, Mermaid syntax generation strategy
3. **Generate UI with v0.dev** - Use prompts above to get 80% of frontend instantly
4. **Integrate Claude API** - Connect form submission to dial plan generation
5. **Implement Mermaid Rendering** - Convert JSON to Mermaid syntax, render both views
6. **Add ElevenLabs** - Voice script generation and audio playback
7. **Build Chatbot** - Conversational refinement with context persistence
8. **Test with 5 Users** - Iterate on flowchart clarity and instructions
9. **Prepare Demo** - Stakeholder presentation deck with before/after comparison
10. **Launch Prototype** - 24-hour sprint complete!

## Definition of Done for 24hr Prototype

The prototype is ready to demo when:
- [ ] User can submit business description and see results in < 10 seconds
- [ ] Both simple and technical flowcharts render correctly for 3 test scenarios
- [ ] At least 2 voice scripts generate with audio playback
- [ ] Feature checklist dynamically populates based on dial plan
- [ ] Chatbot can handle 1 refinement request successfully
- [ ] Implementation guide has 5+ steps with Voys admin links
- [ ] Export to PDF functionality works
- [ ] Demo runs without internet (cached examples as fallback)
- [ ] Stakeholder presentation deck complete (10 slides max)
- [ ] 3 internal team members have successfully tested it

---
*Document created: February 11, 2026*
*Status: Ready for Technical Design*
*Timeline: 24-hour sprint begins after approval*
*Owner: [Your Name]*
*Next Review: After stakeholder demo*
