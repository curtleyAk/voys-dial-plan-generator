# Product Requirements Summary

## Product Overview
**Name:** Voys Dial Plan Generator
**Purpose:** AI-powered tool that converts simple business descriptions into visual call routing plans with implementation guides
**Target Users:** Voys telecom customers (small business owners, office managers) who need to configure phone systems but lack technical expertise
**Timeline:** 24-hour MVP sprint → Demo Thursday Feb 12, 2pm GMT+1

## Core Problem
Voys customers struggle with telecom jargon and can't visualize call flows, leading to support tickets and poor phone system setup.

## Must-Have Features (Phase 1)

### 1. Business Input Form
- Simple form collecting business context
- Fields: business name, type, staff count, hours, special needs
- Example cards for common business types (pizza shop, law office, retail)
- Pre-fills form on click
- Validates before submission

### 2. Visual Flowchart Display (Dual View)
- **Simple View:** Customer-friendly with plain language ("Are we open?")
- **Technical View:** Matches Voys admin terminology ("Opening Hours Check")
- Side-by-side or toggle between views
- Must handle: time routing, multi-level menus, call groups, queues, voicemail
- Fallback to text-based flow if Mermaid fails

### 3. Voice Transcripts Generation
- AI generates realistic voice scripts
- Types: Welcome message, menu options, voicemail greeting
- ElevenLabs integration for audio previews
- Downloadable text scripts if audio unavailable

### 4. Dynamic Feature Checklist
- Shows which Voys features are used in plan
- Format: Icon + Name + Description tooltip + Help link
- Groups: Active Features vs Available Features
- Common features: Opening Hours, Call Group, IVR, Voicemail, Queue

### 5. Chatbot Assistant (Optional - Cut if Behind)
- Chat interface for refining dial plan
- Natural language requests: "Add queue", "Make sales ring longer"
- Updates flowcharts in real-time
- Maintains conversation context

### 6. Implementation Guide
- Step-by-step instructions for Voys admin setup
- Each step: Title, description, actions, help link, estimated time
- Format: Expandable accordion
- Downloadable as PDF (nice-to-have)

## Not in MVP (Future)
- Voys API integration (creating plans in their system)
- n8n automation (pushing settings to Voys)
- User accounts/login
- Saving multiple dial plans
- Direct flowchart editing
- Advanced customization

## Success Metrics (Demo)
- Internal stakeholder approval ✓
- 5-10 test users successfully generate plans ✓
- Zero confusion about flowchart visualization ✓
- Can explain dial plan in own words after viewing ✓

## User Journey
1. User lands on form → fills in business details (or clicks example)
2. Submits → AI generates dial plan in < 10 seconds
3. Views dual flowcharts → understands call routing visually
4. Checks feature list → knows what Voys features they need
5. Optionally refines via chatbot → plan updates
6. Downloads implementation guide → follows steps in Voys admin
7. OR shares plan with Voys support for assisted setup

## UI/UX Requirements

### Design Feel
- Professional
- Clean
- Confidence-building
- Voys-branded colors (blue primary)

### Layout
**Landing Page:**
- Hero: "Turn Your Business Description Into A Professional Phone System"
- Form: Centered, max 600px width
- Example cards: 3 columns below form

**Results Dashboard:**
- Left column (30%): Feature checklist + Chatbot (sticky)
- Right column (70%): Flowchart toggle + Voice previews + Implementation guide

### Key Screens
1. Landing/Input page
2. Results dashboard (main view)
3. Implementation guide (expanded accordion)

## Technical Constraints
- Zero budget (free tiers only)
- Local hosting (localhost for demo)
- Must work on desktop first (mobile nice-to-have)
- 24-hour development timeline
- No production deployment needed for demo

## Quality Standards

### What This Project Will NOT Accept
- Placeholder content in demo ("Lorem ipsum")
- Broken features (complete or cut)
- Features outside Phase 1
- Skipped Mermaid validation
- Skipped Voys rules validation
- Invalid dial plans that violate Voys logic

### What's Acceptable for MVP
- No automated tests (manual OK)
- No optimization (caching, lazy loading)
- Console.logs for debugging
- Hardcoded values
- Desktop-only (mobile responsive nice-to-have)

## Risk Mitigation

### Top Risks
1. **Mermaid parser failures** → 3-layer validation + text fallback
2. **Invalid Voys logic** → Load documentation into Claude context + validation
3. **Demo day failures** → Pre-generate backup examples + screenshots + video

### Emergency Fallback
If behind schedule, cut in this order:
1. Chatbot assistant (biggest complexity)
2. Voice generation (show text only)
3. Technical flowchart view (simple only)

Keep non-negotiable:
- Form + Claude generation
- Simple flowchart (with fallback)
- Feature checklist
- Implementation guide

## Feature Details

### Form Fields
- Business name (text)
- Business type (dropdown: Restaurant, Office, Retail, Medical, Service, Other)
- Staff count (number, 1-50)
- Operating hours (two time inputs: open, close)
- Special needs (textarea with examples)

### Flowchart Requirements
- Entry point always present
- Time-based routing for hours
- Call groups for staff ringing
- Queues for busy handling
- Voicemail for missed calls
- IVR for department routing (when needed)

### Voice Script Types
1. Welcome message: "Thank you for calling [Business]..."
2. Menu options: "Press 1 for Sales, Press 2 for Support..."
3. Voicemail: "You've reached [Business]. We're currently closed..."
4. On-hold: "Your call is important to us. Please hold..."

### Implementation Steps Example
1. Create Users → Add staff to Voys
2. Set Opening Hours → Configure schedule
3. Create Call Group → Link users
4. Configure Dial Plan → Set routing logic
5. Record Greetings → Upload audio
6. Test System → Make test call

## Voys Platform Features Reference

### Core Features
- **Opening Hours:** Time-based routing
- **Call Groups:** Ring multiple users (simultaneous or sequential)
- **IVR:** Menu system (max 9 options)
- **Voicemail:** Message recording with greeting
- **Queue:** Hold callers with music (max 10 min)
- **Call Recording:** Record conversations
- **Announcements:** Play messages
- **Filters:** Route based on caller ID
- **Fixed-Mobile:** Link office + mobile

### Common Patterns
- **Small Business (1-5 staff):** Time → Call Group → Queue → Voicemail
- **Department Routing (5+ staff):** IVR → Multiple Call Groups
- **After Hours:** Time → Closed Message → Voicemail
- **24/7 Operation:** Call Group → Queue → Overflow → Voicemail

## Validation Rules

### Mermaid Syntax
- Node IDs: Only alphanumeric + underscore
- Labels: Wrap in quotes if spaces
- Arrows: Use double dash (-->)
- Edge labels: Always quoted
- No special characters in IDs

### Voys Logic
- Must have entry point
- Call groups need members (min 1)
- Time conditions need hours defined
- IVR needs 1-9 options
- No circular routing
- Must have voicemail fallback

## Demo Script (5 Minutes)

**Minute 1:** Introduction + Problem statement
**Minute 2:** Live generation (pizza shop example)
**Minute 3:** Show dual flowcharts + features
**Minute 4:** Voice preview + Implementation guide
**Minute 5:** Next steps (API integration plan)

---

**Remember:** This is a 24-hour MVP. Focus on core value: Business description → Visual plan → DIY instructions.
