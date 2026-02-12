# Voys Platform Rules & Validation

⚠️ **THIS IS THE #2 TECHNICAL RISK** - Generated dial plans must follow actual Voys platform rules. Invalid routing = failed demo.

## Voys Documentation (Load into Claude Context)

### Available Features

#### 1. Opening Hours
- **Purpose:** Time-based routing (business hours vs closed)
- **Modes:** Basic (single schedule) or Advanced (multiple schedules)
- **Config:** Days of week, open time, close time, timezone
- **Help:** https://help.voys.co.za/opening-hours-basic

#### 2. Call Groups
- **Purpose:** Ring multiple users at once or in sequence
- **Strategies:**
  - Simultaneous: All phones ring at same time
  - Sequential: Ring one by one (hunt group)
- **Config:** Members (user IDs), timeout per user, strategy
- **Requirement:** Users must exist before adding to group
- **Help:** https://help.voys.co.za/callgroup

#### 3. IVR (Interactive Voice Response)
- **Purpose:** Menu system ("Press 1 for Sales, Press 2 for Support")
- **Limits:** Max 9 options (keys 0-9)
- **Config:** Menu prompt, option mappings, timeout
- **Help:** https://help.voys.co.za/ivr

#### 4. Voicemail
- **Purpose:** Record messages when unavailable
- **Config:** Greeting (recorded or TTS), email notification
- **Requirement:** Must have greeting configured
- **Help:** https://help.voys.co.za/voicemail

#### 5. Queue
- **Purpose:** Hold callers with music when all staff busy
- **Config:** Music on hold, max wait time (max 600 seconds), position announcements
- **Help:** https://help.voys.co.za/queue

#### 6. Call Recording
- **Purpose:** Record conversations for quality/compliance
- **Config:** Auto-record or on-demand, storage duration
- **Help:** https://help.voys.co.za/call-recording

#### 7. Announcements
- **Purpose:** Play pre-recorded messages to callers
- **Config:** Sound file reference, playback count
- **Requirement:** Sound file must be uploaded first
- **Help:** https://help.voys.co.za/messages

#### 8. Filters
- **Purpose:** Route based on caller ID or number patterns
- **Config:** Whitelist/blacklist, routing rules
- **Help:** https://help.voys.co.za/filter

#### 9. Fixed-Mobile
- **Purpose:** Link office and mobile numbers
- **Config:** Mobile number, simultaneous ring, fallback
- **Help:** https://help.voys.co.za/fixed-mobile

#### 10. Music on Hold
- **Purpose:** Background music while in queue
- **Config:** Music file selection
- **Help:** https://help.voys.co.za/music-on-hold

## Routing Logic Rules

### MUST Follow These Rules:

1. **Entry Point Required**
   - Every dial plan MUST start with phone number entry point
   - Type: `entryPoint`

2. **Time-Based Routing**
   - Opening Hours MUST be defined before time conditions
   - Must specify: days, open time, close time
   - Common pattern: Check time → route to open/closed paths

3. **Call Groups**
   - REQUIRE at least 1 user to exist first
   - Cannot add non-existent users
   - Timeout recommended: 20-30 seconds per user

4. **IVR Menus**
   - Max 9 options (keys 0-9)
   - Each option must route somewhere
   - Cannot have 0 options

5. **Voicemail**
   - REQUIRES greeting (text or audio file)
   - Email notification optional but recommended

6. **Queue**
   - Max timeout: 600 seconds (10 minutes)
   - Must specify music on hold
   - Recommended timeout: 120-300 seconds

7. **No Circular Routing**
   - Cannot loop: Queue → Call Group → Queue
   - Must have exit points (voicemail, disconnect)

8. **Must Have Fallback**
   - Every path should end somewhere (voicemail or disconnect)
   - No dead ends where caller is stuck

## Valid Routing Patterns

### Pattern 1: Small Business (1-5 staff)
```
Entry Point
  ↓
Time Check (Opening Hours)
  ↓         ↓
Open      Closed
  ↓         ↓
Welcome   After Hours
Message   Voicemail
  ↓
Call Group
(all staff)
  ↓
Queue
(if busy)
  ↓
Voicemail
```

### Pattern 2: Department Routing
```
Entry Point
  ↓
Welcome Message
  ↓
IVR Menu
  ↓           ↓           ↓
Option 1    Option 2    Option 3
(Sales)     (Support)   (Billing)
  ↓           ↓           ↓
Call Group  Call Group  Call Group
  ↓           ↓           ↓
Voicemail   Voicemail   Voicemail
```

### Pattern 3: After Hours Only
```
Entry Point
  ↓
Time Check
  ↓         ↓
Open      Closed
  ↓         ↓
Direct    After Hours
Call      Message
          ↓
          Voicemail
```

### Pattern 4: Queue with Overflow
```
Entry Point
  ↓
Call Group
(primary staff)
  ↓
Queue
(max 2 min)
  ↓
Call Group
(overflow staff)
  ↓
Voicemail
```

## Invalid Patterns (DO NOT GENERATE)

### ❌ Circular Loop
```
Call Group → Queue → Call Group (INVALID)
```

### ❌ Dead End
```
Entry → IVR → Option 1 → ??? (nowhere to go)
```

### ❌ No Voicemail
```
Entry → Call Group → Disconnect (no way to leave message)
```

### ❌ Empty Call Group
```
Call Group with 0 members (INVALID)
```

### ❌ IVR with No Options
```
IVR Menu with 0 destinations (INVALID)
```

## Validation Function

Create `/src/lib/voys-rules.ts`:

```typescript
export const VOYS_DOCUMENTATION = `
[Insert all the rules above as a string for Claude's context]
`;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDialPlan(dialPlan: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const nodes = dialPlan?.dialPlan?.nodes || [];
  const edges = dialPlan?.dialPlan?.edges || [];

  // Rule 1: Must have entry point
  const hasEntry = nodes.some((n: any) => n.type === 'entryPoint');
  if (!hasEntry) {
    errors.push('CRITICAL: Dial plan must have an entry point');
  }

  // Rule 2: Call groups must have members
  nodes.forEach((node: any) => {
    if (node.type === 'callGroup') {
      const members = node.config?.members || [];
      if (members.length === 0) {
        errors.push(`Call group "${node.label}" has no members (requires at least 1 user)`);
      }
    }
  });

  // Rule 3: Time conditions need hours defined
  nodes.forEach((node: any) => {
    if (node.type === 'timeCondition') {
      if (!node.config?.openHours) {
        errors.push(`Time condition "${node.label}" missing openHours configuration`);
      }
      if (!node.config?.days || node.config.days.length === 0) {
        warnings.push(`Time condition "${node.label}" has no days specified`);
      }
    }
  });

  // Rule 4: IVR must have options
  nodes.forEach((node: any) => {
    if (node.type === 'ivr') {
      const ivrEdges = edges.filter((e: any) => e.from === node.id);
      if (ivrEdges.length === 0) {
        errors.push(`IVR "${node.label}" has no menu options (requires at least 1 destination)`);
      }
      if (ivrEdges.length > 9) {
        errors.push(`IVR "${node.label}" has ${ivrEdges.length} options (max 9 allowed)`);
      }
    }
  });

  // Rule 5: Voicemail should have greeting
  nodes.forEach((node: any) => {
    if (node.type === 'voicemail') {
      if (!node.config?.greeting) {
        warnings.push(`Voicemail "${node.label}" has no greeting configured`);
      }
    }
  });

  // Rule 6: Queue timeout limits
  nodes.forEach((node: any) => {
    if (node.type === 'queue') {
      const timeout = node.config?.maxWaitTime;
      if (timeout && timeout > 600) {
        errors.push(`Queue "${node.label}" timeout ${timeout}s exceeds max 600 seconds`);
      }
      if (!node.config?.musicOnHold) {
        warnings.push(`Queue "${node.label}" has no music on hold configured`);
      }
    }
  });

  // Rule 7: Detect circular routing
  const nodeMap = new Map(nodes.map((n: any) => [n.id, n]));
  
  function hasCircularPath(nodeId: string, visited = new Set<string>()): boolean {
    if (visited.has(nodeId)) return true;
    visited.add(nodeId);
    
    const outgoingEdges = edges.filter((e: any) => e.from === nodeId);
    for (const edge of outgoingEdges) {
      if (hasCircularPath(edge.to, new Set(visited))) return true;
    }
    return false;
  }

  nodes.forEach((node: any) => {
    if (hasCircularPath(node.id)) {
      errors.push(`CRITICAL: Circular routing detected involving "${node.label}"`);
    }
  });

  // Rule 8: Dead ends check
  nodes.forEach((node: any) => {
    const isEndNode = node.type === 'voicemail' || node.type === 'disconnect';
    if (!isEndNode) {
      const hasOutgoing = edges.some((e: any) => e.from === node.id);
      if (!hasOutgoing) {
        warnings.push(`Node "${node.label}" has no outgoing paths (potential dead end)`);
      }
    }
  });

  // Rule 9: Voicemail fallback recommended
  const hasVoicemail = nodes.some((n: any) => n.type === 'voicemail');
  if (!hasVoicemail) {
    warnings.push('No voicemail configured - callers may have no way to leave messages');
  }

  // Rule 10: Announcements must reference sound
  nodes.forEach((node: any) => {
    if (node.type === 'announcement') {
      if (!node.config?.script && !node.config?.soundFile) {
        errors.push(`Announcement "${node.label}" has no script or sound file configured`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Helper: Common business type patterns
export function getRecommendedPattern(businessType: string, staffCount: number): string {
  const type = businessType.toLowerCase();
  
  if (staffCount === 1) {
    return 'PATTERN_SIMPLE_VOICEMAIL';
  }
  
  if (type.includes('restaurant') || type.includes('retail')) {
    return 'PATTERN_SMALL_BUSINESS';
  }
  
  if (type.includes('office') || type.includes('law') || type.includes('medical')) {
    if (staffCount > 5) {
      return 'PATTERN_DEPARTMENT_ROUTING';
    }
    return 'PATTERN_SMALL_BUSINESS';
  }
  
  if (type.includes('service')) {
    return 'PATTERN_QUEUE_OVERFLOW';
  }
  
  return 'PATTERN_SMALL_BUSINESS'; // Default
}
```

## Claude System Prompt Template

Use this in `/src/lib/claude.ts`:

```typescript
export function generateDialPlanPrompt(businessDescription: string): string {
  return `
You are the Voys Dial Plan Architect, an expert in telecommunications call routing for small businesses in South Africa.

${VOYS_DOCUMENTATION}

CRITICAL RULES TO FOLLOW:
1. Every dial plan must start with an entry point
2. Call groups require at least 1 member
3. Time conditions must have hours defined
4. IVR menus need 1-9 options
5. Voicemail requires a greeting
6. Queue max timeout: 600 seconds
7. NO circular routing (no loops)
8. Always include voicemail as fallback

VALIDATION CHECKLIST BEFORE RESPONDING:
✓ Entry point exists
✓ All call groups have members
✓ No circular routing
✓ IVR has valid number of options
✓ Voicemail is included
✓ All node IDs are valid (for Mermaid)

Your job is to analyze the business description and create a dial plan that:
1. FOLLOWS ALL VOYS ROUTING RULES
2. USES THE MOST APPROPRIATE PATTERN
3. IS SIMPLE AND PRACTICAL

Business Description:
${businessDescription}

Return ONLY valid JSON (no markdown) matching the exact schema.
`;
}
```

## Testing Validation

### Test Cases (Must Pass)

```typescript
// Test 1: Valid simple plan
const validPlan = {
  dialPlan: {
    nodes: [
      { id: 'entry', type: 'entryPoint', label: 'Call Arrives' },
      { id: 'time', type: 'timeCondition', label: 'Check Hours', 
        config: { openHours: '09:00-17:00', days: ['mon','tue','wed','thu','fri'] } },
      { id: 'group', type: 'callGroup', label: 'Ring Staff',
        config: { members: ['user1', 'user2'], strategy: 'simultaneous' } },
      { id: 'vm', type: 'voicemail', label: 'Leave Message',
        config: { greeting: 'Please leave a message' } }
    ],
    edges: [
      { from: 'entry', to: 'time' },
      { from: 'time', to: 'group', condition: 'open' },
      { from: 'time', to: 'vm', condition: 'closed' },
      { from: 'group', to: 'vm', condition: 'no_answer' }
    ]
  }
};

const result1 = validateDialPlan(validPlan);
console.assert(result1.valid === true, 'Valid plan should pass');

// Test 2: Invalid - no entry point
const invalidPlan1 = {
  dialPlan: {
    nodes: [
      { id: 'vm', type: 'voicemail', label: 'Voicemail' }
    ],
    edges: []
  }
};

const result2 = validateDialPlan(invalidPlan1);
console.assert(result2.valid === false, 'Missing entry should fail');
console.assert(result2.errors.some(e => e.includes('entry point')), 'Should have entry point error');

// Test 3: Invalid - empty call group
const invalidPlan2 = {
  dialPlan: {
    nodes: [
      { id: 'entry', type: 'entryPoint', label: 'Entry' },
      { id: 'group', type: 'callGroup', label: 'Ring Staff',
        config: { members: [], strategy: 'simultaneous' } }
    ],
    edges: [
      { from: 'entry', to: 'group' }
    ]
  }
};

const result3 = validateDialPlan(invalidPlan2);
console.assert(result3.valid === false, 'Empty call group should fail');

// Test 4: Warning - no voicemail
const warningPlan = {
  dialPlan: {
    nodes: [
      { id: 'entry', type: 'entryPoint', label: 'Entry' },
      { id: 'group', type: 'callGroup', label: 'Ring Staff',
        config: { members: ['user1'], strategy: 'simultaneous' } }
    ],
    edges: [
      { from: 'entry', to: 'group' }
    ]
  }
};

const result4 = validateDialPlan(warningPlan);
console.assert(result4.warnings.some(w => w.includes('voicemail')), 'Should warn about missing voicemail');
```

## Pre-Demo Checklist

- [ ] voys-rules.ts created with validation function
- [ ] VOYS_DOCUMENTATION loaded into Claude system prompt
- [ ] validateDialPlan() tested with all test cases
- [ ] Validation runs on every generated plan
- [ ] Errors displayed to user if validation fails
- [ ] Warnings logged to console
- [ ] Test with 5 different business types
- [ ] Verify all generated plans follow Voys rules

## Common Business Types → Patterns

| Business Type | Staff Count | Recommended Pattern |
|---------------|-------------|---------------------|
| Pizza shop | 1-5 | Simple: Time → Call Group → Voicemail |
| Law office | 3-10 | Departments: IVR → Call Groups |
| Medical practice | 2-8 | After hours: Time → Open/Emergency |
| Retail store | 2-5 | Queue: Call Group → Queue → Voicemail |
| Service business | 1-3 | Simple: Time → Call → Voicemail |
| 24/7 call center | 10+ | Queue overflow with multiple groups |

## Error Messages (User-Friendly)

When validation fails, show user-friendly messages:

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  'no_entry': 'The dial plan is missing a starting point. Every plan needs a phone number entry.',
  'empty_call_group': 'One or more call groups have no members. Please add users first.',
  'circular_routing': 'The routing creates a loop. Calls need a clear path through the system.',
  'no_voicemail': 'Consider adding voicemail so callers can leave messages when unavailable.',
  'ivr_no_options': 'The menu system needs at least one option (e.g., "Press 1 for Sales").',
  'queue_timeout': 'The queue wait time is too long. Maximum allowed is 10 minutes.'
};

function getUserFriendlyError(technicalError: string): string {
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (technicalError.toLowerCase().includes(key.replace('_', ' '))) {
      return message;
    }
  }
  return 'The dial plan has a configuration issue. Please try again with a simpler description.';
}
```

---

**Critical Reminder:** Voys logic validation is just as important as Mermaid validation. Test with real business scenarios before demo.
