# v0.dev / Lovable Prompts

## Instructions for Using These Prompts

1. Go to v0.dev or Lovable.dev
2. Copy the entire prompt (including context section)
3. Paste into the platform
4. Generate component
5. Copy generated code into your Next.js project
6. Adjust imports if needed (v0 uses `@/components/ui/`, you might need to install shadcn components)

---

## Prompt 1: Business Input Form

```
Create a Next.js 14 component called "BusinessInputForm" with TypeScript, Tailwind CSS, and shadcn/ui components.

CONTEXT:
This is for a Voys telecom dial plan generator. Users describe their business, and AI creates a phone routing plan.

REQUIREMENTS:

1. Form Fields:
   - Business name (text input, placeholder: "e.g., Bella's Pizza", required)
   - Business type (select dropdown with options: Restaurant, Office, Retail Store, Service Business, Medical Practice, Other)
   - Number of staff (number input, min 1, max 50, default 3)
   - Operating hours:
     * Opening time (time input, default "09:00")
     * Closing time (time input, default "17:00")
   - Special needs (textarea, 3 rows, placeholder: "E.g., Need voicemail after hours, Have sales and support teams, Queue during busy times")

2. Example Cards (3 cards in responsive grid):
   Card 1 - "Pizza Shop Example":
   - Icon: 🍕
   - On click: Pre-fill form with:
     * Type: Restaurant
     * Staff: 3
     * Hours: 09:00 - 21:00
     * Needs: "need voicemail after hours"

   Card 2 - "Law Office Example":
   - Icon: ⚖️
   - On click: Pre-fill form with:
     * Type: Office
     * Staff: 5
     * Hours: 08:00 - 17:00
     * Needs: "separate lines for lawyers"

   Card 3 - "Retail Store Example":
   - Icon: 🛍️
   - On click: Pre-fill form with:
     * Type: Retail Store
     * Staff: 2
     * Hours: 10:00 - 18:00
     * Needs: "queue during busy times"

3. Submit Button:
   - Text: "Generate My Dial Plan"
   - Full width
   - Primary blue color
   - Shows loading spinner when submitting (loading prop)
   - Disabled when loading

4. Validation:
   - All fields required except special needs
   - Business name min 2 chars
   - Staff count 1-50
   - Show error messages below fields

5. Props Interface:
   ```typescript
   interface BusinessInputFormProps {
     onSubmit: (data: FormData) => void;
     loading: boolean;
   }

   interface FormData {
     businessName: string;
     businessType: string;
     staffCount: number;
     openingTime: string;
     closingTime: string;
     specialNeeds: string;
   }
   ```

6. Styling:
   - Use shadcn/ui: Card, Input, Select, Textarea, Button
   - Clean, professional look
   - Blue accent color for primary actions
   - Proper spacing and typography
   - Example cards with hover effects

7. Behavior:
   - On submit: preventDefault, validate, call onSubmit with data
   - Example cards: onClick updates form state
   - Form resets after successful submission (optional)

Export as default component. Include all TypeScript types.
```

---

## Prompt 2: Feature Checklist Component

```
Create a Next.js 14 component called "FeatureChecklist" with TypeScript, Tailwind CSS, and shadcn/ui.

CONTEXT:
Shows which Voys telecom features are used in a generated dial plan. Sidebar component for results dashboard.

REQUIREMENTS:

1. Props Interface:
   ```typescript
   interface Feature {
     id: string;
     name: string;
     description: string;
     helpUrl: string;
     used: boolean;
   }

   interface FeatureChecklistProps {
     features: Feature[];
   }
   ```

2. Layout:
   - Sticky sidebar (position: sticky, top: 20px)
   - Card with header: "Your Phone System Will Use:"
   - Two sections:
     * "Active Features" (used: true)
     * "Available Features" (used: false, collapsed by default)

3. Feature Item Display:
   - Checkbox (checked if used === true, disabled/readonly)
   - Icon (use lucide-react):
     * opening_hours → Clock
     * call_group → Users
     * voicemail → Mic
     * queue → Clock
     * ivr → Hash
     * call_recording → Video
     * announcements → Volume2
     * filter → Filter
     * fixed_mobile → Smartphone
   - Feature name (bold if used)
   - Info tooltip with description (on hover)
   - External link icon → opens helpUrl in new tab

4. Styling:
   - Use shadcn/ui: Card, Checkbox, Tooltip
   - Green checkmarks for active (used: true)
   - Gray checkmarks for inactive (used: false)
   - Hover effects on help links
   - Smooth transitions

5. Behavior:
   - Checkboxes are display-only (not interactive)
   - Help links open in new tab with rel="noopener noreferrer"
   - Collapsible "Available Features" section

6. Example Features Data (for testing):
   ```typescript
   const exampleFeatures = [
     { id: 'opening_hours', name: 'Opening Hours', description: 'Routes calls differently during business hours vs closed', helpUrl: 'https://help.voys.co.za/opening-hours-basic', used: true },
     { id: 'call_group', name: 'Call Group', description: 'Rings multiple phones at once', helpUrl: 'https://help.voys.co.za/callgroup', used: true },
     { id: 'voicemail', name: 'Voicemail', description: 'Records messages when closed', helpUrl: 'https://help.voys.co.za/voicemail', used: true },
     { id: 'ivr', name: 'IVR Menu', description: 'Press 1 for Sales, Press 2 for Support', helpUrl: 'https://help.voys.co.za/ivr', used: false }
   ];
   ```

Export as default component. Use TypeScript throughout.
```

---

## Prompt 3: Flowchart Component (Simple View)

```
Create a Next.js 14 component called "FlowchartSimple" with TypeScript, Tailwind CSS, react-mermaid2, and shadcn/ui.

CONTEXT:
Renders Mermaid diagrams showing call routing flow. Must handle errors gracefully with text fallback.

REQUIREMENTS:

1. Props Interface:
   ```typescript
   interface DialPlanNode {
     id: string;
     simpleLabel: string;
     config?: Record<string, any>;
   }

   interface DialPlanEdge {
     from: string;
     to: string;
     label?: string;
   }

   interface FlowchartSimpleProps {
     mermaidCode: string;
     dialPlanJson: {
       nodes: DialPlanNode[];
       edges: DialPlanEdge[];
     };
   }
   ```

2. Main Flowchart:
   - Use react-mermaid2 library
   - Render mermaidCode prop
   - Config: { theme: 'neutral', flowchart: { useMaxWidth: true } }
   - Catch errors with onError callback

3. Error Handling:
   - If Mermaid fails to render, show TextFlowFallback
   - Warning banner: "Flowchart rendering unavailable. Showing simplified view:"
   - Yellow/amber alert styling

4. TextFlowFallback Component:
   - Takes dialPlanJson prop
   - Renders nodes as vertical list with blue left border
   - Each step:
     * Step number: "Step 1:"
     * Node label (bold, large)
     * Config details (small, gray, JSON.stringify if exists)
     * "↓ Next:" arrow showing outgoing edges
   - Card styling for each step

5. Toggle Button (Top Right):
   - "View Technical Version" button
   - Opens technical flowchart (handled by parent)
   - Secondary button style

6. Container:
   - White Card with shadow
   - Padding: 6 (p-6)
   - Rounded corners
   - Full width

7. Loading State:
   - Show skeleton or spinner while Mermaid initializes
   - "Loading flowchart..." text

8. Styling:
   - Use shadcn/ui: Card, Alert, Button
   - Blue accent for active elements
   - Clean typography
   - Proper spacing

Export both FlowchartSimple and TextFlowFallback as named exports. Use TypeScript.

IMPORTANT: Wrap Mermaid component in error boundary to catch render failures.
```

---

## Prompt 4: Voice Preview Component

```
Create a Next.js 14 component called "VoicePreview" with TypeScript, Tailwind CSS, and shadcn/ui.

CONTEXT:
Displays AI-generated voice scripts with audio players. For Voys dial plan voice greetings.

REQUIREMENTS:

1. Props Interface:
   ```typescript
   interface VoiceScript {
     type: 'welcome' | 'voicemail' | 'menu' | 'announcement';
     text: string;
     duration?: string;
   }

   interface VoicePreviewProps {
     voiceScripts: VoiceScript[];
     onRegenerateVoice?: (scriptType: string) => void;
   }
   ```

2. Layout:
   - Section title: "Your Voice Greetings"
   - List of voice script cards (vertical stack, gap-4)

3. Voice Script Card (for each script):
   - Header with icon + type label:
     * welcome → "Welcome Message" (🔊 icon)
     * voicemail → "Voicemail Greeting" (📞 icon)
     * menu → "Menu Options" (🎛️ icon)
     * announcement → "Announcement" (📢 icon)
   - HTML5 audio player with controls
   - Text transcript (collapsible):
     * "Show transcript" button
     * On click: Expand to show full text
     * Smooth animation
   - "Regenerate Voice" button (optional, secondary style)
     * Calls onRegenerateVoice if provided
     * Show only if handler exists

4. Audio Loading:
   - Initially show skeleton/spinner
   - On mount: Fetch audio from /api/voice endpoint
   - Create blob URL from response
   - Set as audio src
   - Handle errors: Show "Audio unavailable" message

5. Error States:
   - If audio fails to load: Show text-only with warning icon
   - Message: "Audio preview unavailable. Text script shown below."
   - Display full transcript automatically

6. Styling:
   - Use shadcn/ui: Card, Collapsible, Button
   - Blue accent for active player
   - Icons from lucide-react
   - Smooth expand/collapse animations
   - Audio player with custom styling (optional)

7. Example Data:
   ```typescript
   const exampleScripts = [
     { type: 'welcome', text: 'Thank you for calling Bella\'s Pizza. Please hold while we connect you.', duration: '5 seconds' },
     { type: 'voicemail', text: 'You\'ve reached Bella\'s Pizza. We\'re currently closed. Our hours are 9 AM to 9 PM daily. Please leave a message.', duration: '12 seconds' }
   ];
   ```

Export as default component. TypeScript types required.
```

---

## Prompt 5: Implementation Guide Component

```
Create a Next.js 14 component called "ImplementationGuide" with TypeScript, Tailwind CSS, and shadcn/ui.

CONTEXT:
Shows step-by-step instructions for setting up dial plan in Voys admin panel.

REQUIREMENTS:

1. Props Interface:
   ```typescript
   interface ImplementationStep {
     step: number;
     title: string;
     description: string;
     actions: string[];
     helpUrl: string;
     estimatedTime: string;
   }

   interface ImplementationGuideProps {
     steps: ImplementationStep[];
   }
   ```

2. Header Section:
   - Title: "How to Set This Up in Voys"
   - Subtitle: "Follow these steps in your Voys admin panel"
   - Progress tracker: "Step 3 of 7 completed" (based on checkboxes)
   - Download PDF button (placeholder, secondary style)

3. Accordion Component:
   - Use shadcn/ui Accordion
   - One step open at a time (type="single")
   - Each step is collapsible

4. Step Header (Accordion Trigger):
   - Badge with step number (blue, rounded)
   - Step title (bold)
   - Estimated time (gray, right-aligned)
   - Expand/collapse icon

5. Step Content (Accordion Content):
   - Description paragraph
   - Numbered action list:
     * Each action on new line
     * Monospace font for technical terms
     * Proper spacing
   - "Learn More" link to helpUrl
     * Opens in new tab
     * External link icon
   - Checkbox: "Mark as complete"
     * Saves to local state
     * Shows progress in header

6. Styling:
   - Use shadcn/ui: Accordion, Badge, Button, Checkbox
   - Blue accent for step numbers
   - Green checkmarks for completed steps
   - Hover effects on accordion headers
   - Smooth animations

7. Print-Friendly:
   - @media print styles (optional)
   - Expands all steps when printing
   - Removes interactive elements

8. Example Data:
   ```typescript
   const exampleSteps = [
     {
       step: 1,
       title: 'Create User Accounts',
       description: 'Add your staff members to Voys',
       actions: [
         'Go to Admin > Users',
         'Click "Add User" for each staff member',
         'Assign them phone extensions (e.g., 101, 102, 103)'
       ],
       helpUrl: 'https://help.voys.co.za/admin',
       estimatedTime: '5 minutes'
     },
     {
       step: 2,
       title: 'Configure Opening Hours',
       description: 'Set your business hours',
       actions: [
         'Go to Admin > Opening Hours',
         'Create schedule: Mon-Sun 09:00-21:00',
         'Save the schedule'
       ],
       helpUrl: 'https://help.voys.co.za/opening-hours-basic',
       estimatedTime: '3 minutes'
     }
   ];
   ```

Export as default component. Full TypeScript typing required.
```

---

## Prompt 6: Chatbot Assistant (Optional)

```
Create a Next.js 14 component called "ChatbotAssistant" with TypeScript, Tailwind CSS, and shadcn/ui.

CONTEXT:
Chat interface for users to refine their dial plan in natural language. "Add queue", "Make sales ring longer", etc.

REQUIREMENTS:

1. Props Interface:
   ```typescript
   interface Message {
     id: string;
     role: 'user' | 'assistant' | 'system';
     content: string;
     timestamp: Date;
   }

   interface ChatbotAssistantProps {
     currentDialPlan: any;
     onPlanUpdate: (updatedPlan: any, explanation: string) => void;
   }
   ```

2. Layout:
   - Collapsible section (collapsed by default)
   - Header: "Refine Your Plan" with chat icon (💬)
   - Expand button shows badge with "Ask me anything"

3. Chat Interface (When Expanded):
   - Messages list (max height 400px, scrollable)
   - Message bubbles:
     * User: Right-aligned, blue background
     * Assistant: Left-aligned, gray background
     * System: Center-aligned, small text
   - Auto-scroll to bottom on new messages

4. Example Prompts (Clickable Chips):
   - "Add separate line for deliveries"
   - "Make sales ring longer than support"
   - "Add queue with 2 minute timeout"
   - On click: Adds to input field

5. Input Section:
   - Text input with placeholder: "Ask me to refine your plan..."
   - Send button (paper plane icon)
   - Shows "Refining..." when loading
   - Disabled during API call

6. Behavior:
   - On submit:
     * Add user message to chat
     * Call /api/refine with { message, currentDialPlan }
     * Stream response if possible (optional)
     * Parse JSON response: { explanation, updatedDialPlan }
     * Add assistant message with explanation
     * Call onPlanUpdate with new plan
   - Maintain conversation history
   - Clear input after sending

7. Styling:
   - Use shadcn/ui: Collapsible, ScrollArea, Input, Button
   - Smooth animations
   - Message bubbles with rounded corners
   - Proper spacing and typography
   - Loading spinner for "thinking"

8. Example Messages:
   ```typescript
   const exampleConversation = [
     { id: '1', role: 'assistant', content: 'Hi! I can help refine your dial plan. Try asking me to add features or change routing.', timestamp: new Date() },
     { id: '2', role: 'user', content: 'Add a queue with 2 minute timeout', timestamp: new Date() },
     { id: '3', role: 'assistant', content: 'I\'ve added a call queue with a 2-minute timeout after your call group. This will hold callers with music when everyone is busy.', timestamp: new Date() }
   ];
   ```

Export as default component. TypeScript required. Handle async API calls properly.
```

---

## Integration Instructions

After generating components with v0.dev/Lovable:

1. **Copy Code:**
   - Copy entire component code
   - Save to correct location in your project
   - Example: `src/components/BusinessInputForm.tsx`

2. **Install Dependencies:**
   ```bash
   # If using shadcn/ui components not yet installed
   npx shadcn-ui@latest add [component-name]
   
   # Example:
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add button
   ```

3. **Fix Imports:**
   - v0.dev uses `@/components/ui/` path
   - Ensure your tsconfig.json has path alias configured
   - Or adjust imports manually

4. **Test Component:**
   ```bash
   npm run dev
   # Open browser to localhost:3000
   # Import and render component in page
   ```

5. **Add Validation (If Needed):**
   - Mermaid components need validation wrapper
   - See agent_docs/mermaid_validation.md

6. **Connect to API:**
   - Wire up onSubmit handlers
   - Create API routes if needed
   - Test with actual data

---

## Tips for Best Results

### When Generating with v0.dev:
1. Copy prompt EXACTLY (including context)
2. If output is incomplete, say: "Continue" or "Show remaining code"
3. If something is wrong, say: "Fix X by doing Y"
4. Always specify: Next.js 14, TypeScript, Tailwind, shadcn/ui

### After Generation:
1. Read through code before saving
2. Check for TypeScript errors in IDE
3. Test component in isolation first
4. Then integrate into full page

### Common Issues:
- **Missing imports:** Install shadcn component
- **TypeScript errors:** Check interface matches props
- **Styling broken:** Verify Tailwind classes valid
- **Component not rendering:** Check export statement

---

**Ready to generate?** Pick a prompt, paste it into v0.dev or Lovable, and get your component!
