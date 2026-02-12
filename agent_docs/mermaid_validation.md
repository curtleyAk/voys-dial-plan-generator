# Mermaid Validation Strategy (CRITICAL)

⚠️ **THIS IS THE #1 TECHNICAL RISK** - Mermaid's parser is notoriously finicky. This document contains the 3-layer defense strategy to prevent rendering failures during the demo.

## The Problem

Mermaid syntax errors that will break rendering:

- Extra spaces in node IDs: `entry point` ❌ vs `entry_point` ✅
- Unquoted labels with spaces: `[Call Arrives]` ❌ vs `["Call Arrives"]` ✅
- Wrong arrow syntax: `->` ❌ vs `-->` ✅
- Special characters in IDs: `time-check` ❌ vs `time_check` ✅
- Unquoted edge labels: `|Open|` ❌ vs `|"Open"|` ✅

## The Solution: 3-Layer Defense

### Layer 1: Claude Prompt Rules (Prevention)

Include these rules in EVERY Claude API system prompt:

```typescript
const MERMAID_RULES = `
CRITICAL MERMAID SYNTAX RULES (MUST FOLLOW):

1. Node IDs: ONLY alphanumeric + underscore
   ✅ GOOD: entry_point, time_check_1, call_group
   ❌ BAD: "entry point", time-check, callGroup!, call.group

2. Node Labels: ALWAYS wrap in double quotes if they contain spaces
   ✅ GOOD: entry_point["Call Arrives"]
   ❌ BAD: entry_point[Call Arrives]

3. Arrows: ONLY use double dash -->
   ✅ GOOD: A --> B
   ❌ BAD: A -> B (single dash breaks parser)

4. Edge Labels: ALWAYS wrap in double quotes
   ✅ GOOD: A -->|"Open Hours"| B
   ❌ BAD: A -->|Open Hours| B

5. No Special Characters in IDs: Remove all (, ), -, /, \, spaces, dots
   Example transform:
   "Call Group (Ring All)" → call_group_ring_all
   "Time-Based Routing" → time_based_routing
   "Entry.Point" → entry_point

6. Graph Declaration: Always start with "graph TD" or "graph LR"
   ✅ GOOD: graph TD\n    A["Start"]
   ❌ BAD: flowchart TD (not supported by our version)

VALIDATION CHECKLIST BEFORE RETURNING MERMAID:
✓ All node IDs are valid (no spaces, no special chars)
✓ All labels with spaces are quoted
✓ All arrows use double dash (-->)
✓ All edge labels are quoted
✓ Graph starts with "graph TD"

Test your Mermaid syntax mentally before including it in the response.
`;
```

### Layer 2: Runtime Validation (Detection + Auto-Fix)

Create `/src/lib/mermaid-validator.ts`:

```typescript
export interface MermaidValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized: string;
}

export function validateMermaidSyntax(
  mermaidCode: string,
): MermaidValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitized = mermaidCode;

  // Check 1: Valid node ID pattern (alphanumeric + underscore only)
  const nodeIdPattern = /(\w+)\[/g;
  const invalidNodeIds = new Set<string>();

  let match;
  while ((match = nodeIdPattern.exec(mermaidCode)) !== null) {
    const nodeId = match[1];
    if (!/^[a-zA-Z0-9_]+$/.test(nodeId)) {
      invalidNodeIds.add(nodeId);
      errors.push(
        `Invalid node ID: "${nodeId}" (use only alphanumeric + underscore)`,
      );

      // Auto-sanitize: replace special chars with underscore
      const sanitizedId = nodeId.replace(/[^a-zA-Z0-9_]/g, "_");
      sanitized = sanitized.replace(
        new RegExp(`\\b${nodeId}\\b`, "g"),
        sanitizedId,
      );
    }
  }

  // Check 2: Labels must be quoted if they contain spaces
  const unquotedLabelPattern = /\[([^"\]]*\s[^"\]]*)\]/g;
  if (unquotedLabelPattern.test(sanitized)) {
    errors.push("Found unquoted labels with spaces");

    // Auto-fix: add quotes to all labels
    sanitized = sanitized.replace(/\[([^\]]+)\]/g, (match, label) => {
      // If already quoted, leave it
      if (label.startsWith('"') && label.endsWith('"')) {
        return match;
      }
      // Add quotes
      return `["${label}"]`;
    });
  }

  // Check 3: Arrow syntax (must be double dash)
  if (sanitized.includes("->") && !sanitized.includes("-->")) {
    errors.push("Invalid arrow syntax (use --> not ->)");
    sanitized = sanitized.replace(/->/g, "-->");
  }

  // Check 4: Edge labels must be quoted
  const edgeLabelPattern = /-->\|([^"]+)\|/g;
  const edgeMatches = [...sanitized.matchAll(edgeLabelPattern)];

  if (edgeMatches.length > 0) {
    edgeMatches.forEach((match) => {
      if (!match[1].startsWith('"')) {
        errors.push(`Unquoted edge label: ${match[1]}`);
        sanitized = sanitized.replace(`|${match[1]}|`, `|"${match[1]}"|`);
      }
    });
  }

  // Check 5: Graph declaration
  if (!sanitized.trim().startsWith("graph ")) {
    errors.push(
      'Missing graph declaration (should start with "graph TD" or "graph LR")',
    );
    sanitized = "graph TD\n" + sanitized;
  }

  // Check 6: Empty nodes
  if (sanitized.includes("[]")) {
    warnings.push("Found empty node labels");
  }

  // Check 7: Circular references (basic check)
  const nodeConnections = new Map<string, Set<string>>();
  const connectionPattern = /(\w+)\s*-->\s*(\w+)/g;
  let connectionMatch;

  while ((connectionMatch = connectionPattern.exec(sanitized)) !== null) {
    const from = connectionMatch[1];
    const to = connectionMatch[2];

    if (!nodeConnections.has(from)) {
      nodeConnections.set(from, new Set());
    }
    nodeConnections.get(from)!.add(to);
  }

  // Simple cycle detection
  function hasCycle(node: string, visited = new Set<string>()): boolean {
    if (visited.has(node)) return true;
    visited.add(node);

    const neighbors = nodeConnections.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor, new Set(visited))) return true;
    }
    return false;
  }

  for (const node of nodeConnections.keys()) {
    if (hasCycle(node)) {
      warnings.push(
        `Potential circular reference detected involving node: ${node}`,
      );
      break; // Only warn once
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitized,
  };
}

// Helper: Convert any string to valid node ID
export function toValidNodeId(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

// Helper: Test Mermaid syntax (for debugging)
export function testMermaidSyntax(code: string): void {
  const result = validateMermaidSyntax(code);

  console.log("=== Mermaid Validation Result ===");
  console.log("Valid:", result.valid);

  if (result.errors.length > 0) {
    console.log("\nErrors:");
    result.errors.forEach((err) => console.log("  ❌", err));
  }

  if (result.warnings.length > 0) {
    console.log("\nWarnings:");
    result.warnings.forEach((warn) => console.log("  ⚠️", warn));
  }

  if (!result.valid) {
    console.log("\nSanitized Version:");
    console.log(result.sanitized);
  }
}
```

### Layer 3: Fallback Rendering (Recovery)

Wrap Mermaid components with error boundaries and text-based fallback:

```typescript
// src/components/FlowchartSimple.tsx
import { useState, useEffect } from 'react';
import Mermaid from 'react-mermaid2';
import { validateMermaidSyntax } from '@/lib/mermaid-validator';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FlowchartProps {
  mermaidCode: string;
  dialPlanJson: any; // Fallback data
}

export function FlowchartSimple({ mermaidCode, dialPlanJson }: FlowchartProps) {
  const [renderError, setRenderError] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  useEffect(() => {
    const result = validateMermaidSyntax(mermaidCode);
    setValidationResult(result);

    if (!result.valid) {
      console.warn('Mermaid validation errors:', result.errors);
    }
  }, [mermaidCode]);

  // If validation failed or render error occurred, show fallback
  if (renderError || (validationResult && !validationResult.valid)) {
    return (
      <Card className="p-6">
        <Alert className="mb-4">
          <AlertDescription>
            Flowchart rendering unavailable. Showing simplified view:
          </AlertDescription>
        </Alert>
        <TextFlowFallback dialPlan={dialPlanJson} />
      </Card>
    );
  }

  const codeToRender = validationResult?.sanitized || mermaidCode;

  return (
    <Card className="p-6">
      <Mermaid
        chart={codeToRender}
        config={{
          theme: 'neutral',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          }
        }}
        onError={(error) => {
          console.error('Mermaid rendering error:', error);
          setRenderError(true);
        }}
      />
    </Card>
  );
}

// Fallback: Text-based flow representation
function TextFlowFallback({ dialPlan }: { dialPlan: any }) {
  const nodes = dialPlan?.dialPlan?.nodes || [];
  const edges = dialPlan?.dialPlan?.edges || [];

  return (
    <div className="space-y-4">
      {nodes.map((node: any, idx: number) => {
        const outgoingEdges = edges.filter((e: any) => e.from === node.id);

        return (
          <div key={node.id} className="border-l-4 border-blue-500 pl-4">
            <div className="font-bold text-lg">
              Step {idx + 1}: {node.simpleLabel || node.label}
            </div>
            {node.config && (
              <div className="text-sm text-gray-600 mt-1">
                {JSON.stringify(node.config, null, 2)}
              </div>
            )}
            {outgoingEdges.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                ↓ Next: {outgoingEdges.map((e: any) => {
                  const nextNode = nodes.find((n: any) => n.id === e.to);
                  return `${nextNode?.simpleLabel || e.to}${e.label ? ` (${e.label})` : ''}`;
                }).join(', ')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

## Testing Strategy

### Test Cases (Must Pass Before Demo)

Create these test Mermaid strings and verify they render:

```typescript
// Test 1: Simple linear flow
const test1 = `graph TD
    entry_point["Call Arrives"]
    entry_point --> time_check
    time_check["Are we open?"]
    time_check -->|"Yes"| call_group
    time_check -->|"No"| voicemail
    call_group["Ring Everyone"]
    voicemail["Leave Message"]`;

// Test 2: Complex with IVR
const test2 = `graph TD
    entry_point["Call Arrives"]
    entry_point --> welcome
    welcome["Welcome Message"]
    welcome --> ivr_menu
    ivr_menu["Press 1 or 2"]
    ivr_menu -->|"Option 1"| sales_group
    ivr_menu -->|"Option 2"| support_group
    sales_group["Sales Team"]
    support_group["Support Team"]`;

// Test 3: Edge case (previously broke)
const test3 = `graph TD
    entry_point_1["Someone calls"]
    entry_point_1 --> time_condition_check
    time_condition_check["Business hours?"]
    time_condition_check -->|"Open"| announcement_welcome
    time_condition_check -->|"Closed"| voicemail_after_hours
    announcement_welcome["Greeting plays"]
    announcement_welcome --> call_group_all_staff
    call_group_all_staff["Ring all staff"]
    voicemail_after_hours["Record message"]`;

// Run validation
testMermaidSyntax(test1);
testMermaidSyntax(test2);
testMermaidSyntax(test3);
```

### Manual Testing Checklist

Before demo, test with these business descriptions:

1. **Simple:** "Pizza shop with 3 staff, open 9am-9pm, need voicemail"
   - Expected: entry → time → open (call group) / closed (voicemail)

2. **Medium:** "Law office with 5 lawyers, need separate lines for each"
   - Expected: entry → ivr menu → 5 options → individual voicemails

3. **Complex:** "Medical practice, after hours emergency line, appointment booking"
   - Expected: entry → time → open (ivr: appts/emergency) / closed (emergency line + voicemail)

4. **Edge Case:** "24/7 call center with queue and overflow"
   - Expected: entry → call group → queue → overflow group → voicemail

5. **Minimal:** "Single person business, just voicemail"
   - Expected: entry → voicemail (simplest possible)

## Debugging Mermaid Issues

### If Mermaid Still Fails During Demo

**Emergency Actions:**

1. Check browser console for specific error
2. Copy Mermaid code and test at https://mermaid.live/
3. If it works there but not in app, check react-mermaid2 version
4. If it fails everywhere, use TextFlowFallback immediately

**Common Error Messages:**

```
"Lexical error on line X"
→ Usually unquoted label or invalid character
→ Solution: Run through validator, use sanitized version

"Parse error on line X"
→ Usually wrong arrow syntax or missing quotes
→ Solution: Check arrow patterns (--> not ->) and edge labels

"Maximum call stack size exceeded"
→ Usually circular reference
→ Solution: Check for loops in dial plan JSON
```

### Debug Mode

Add this to components for detailed logging:

```typescript
const DEBUG_MERMAID = true; // Set to false for production

if (DEBUG_MERMAID) {
  console.log("=== Mermaid Debug ===");
  console.log("Original:", mermaidCode);
  console.log("Validation:", validationResult);
  console.log("Rendering:", codeToRender);
}
```

## Example: Complete Validation Pipeline

```typescript
// In /src/app/api/generate/route.ts
import { validateMermaidSyntax } from "@/lib/mermaid-validator";

// After getting response from Claude
const dialPlanData = JSON.parse(claudeResponse);

// Validate both Mermaid outputs
const simpleValidation = validateMermaidSyntax(dialPlanData.mermaidSimple);
const technicalValidation = validateMermaidSyntax(
  dialPlanData.mermaidTechnical,
);

// If either failed, log errors and use sanitized versions
if (!simpleValidation.valid) {
  console.error("Simple Mermaid validation failed:", simpleValidation.errors);
  dialPlanData.mermaidSimple = simpleValidation.sanitized;
}

if (!technicalValidation.valid) {
  console.error(
    "Technical Mermaid validation failed:",
    technicalValidation.errors,
  );
  dialPlanData.mermaidTechnical = technicalValidation.sanitized;
}

// Return validated data
return NextResponse.json(dialPlanData);
```

## Pre-Demo Checklist

- [ ] mermaid-validator.ts created and tested
- [ ] MERMAID_RULES included in Claude system prompt
- [ ] FlowchartSimple has validation + fallback
- [ ] FlowchartTechnical has validation + fallback
- [ ] Tested all 5 test cases successfully
- [ ] Tested at mermaid.live to confirm syntax
- [ ] Debug mode enabled for troubleshooting
- [ ] TextFlowFallback displays correctly
- [ ] Know how to switch to fallback during demo if needed

---

**Critical Reminder:** Mermaid is the #1 risk. Test extensively. Always have fallback ready. Don't trust Claude's raw output - validate everything.
