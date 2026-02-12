# Testing Strategy (Manual)

## Testing Philosophy for 24hr MVP
- Manual testing is sufficient (no automated tests needed)
- Test after each feature implementation
- Fix bugs immediately before moving on
- Pre-generate backup examples for demo safety

## Manual Testing Checklist

### After Each Feature Implementation

#### 1. Form Component Test
- [ ] Form displays correctly
- [ ] All fields are editable
- [ ] Example cards pre-fill form on click
- [ ] Validation prevents empty submission
- [ ] Submit button shows loading state
- [ ] Form data logs to console

#### 2. Claude API Integration Test
```bash
# Terminal test
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Pizza shop with 3 staff, open 9am-9pm, need voicemail"}'

# Should return: JSON with dial plan structure
```

- [ ] API responds in < 10 seconds
- [ ] Returns valid JSON
- [ ] JSON has all required fields (nodes, edges, features, etc.)
- [ ] Console shows no errors

#### 3. Mermaid Validation Test
```typescript
// Add to component temporarily
console.log('Original Mermaid:', mermaidCode);
const result = validateMermaidSyntax(mermaidCode);
console.log('Validation result:', result);
console.log('Sanitized:', result.sanitized);
```

- [ ] Validator detects syntax errors
- [ ] Auto-sanitization fixes common issues
- [ ] Sanitized version renders correctly
- [ ] No errors in browser console

#### 4. Flowchart Rendering Test
- [ ] Simple flowchart displays
- [ ] Technical flowchart displays
- [ ] Toggle between views works
- [ ] Fallback shows if Mermaid fails
- [ ] Text flow is readable
- [ ] No layout breaking

#### 5. Feature Checklist Test
- [ ] All features marked correctly (checked/unchecked)
- [ ] Tooltips show on hover
- [ ] Help links open in new tab
- [ ] Icons display correctly
- [ ] Sticky positioning works

#### 6. Voice Preview Test (If Implemented)
- [ ] Audio players display
- [ ] Play button works
- [ ] Audio actually plays
- [ ] Transcripts expand/collapse
- [ ] Loading state shows while generating

#### 7. Results Page Test
- [ ] All components visible
- [ ] Layout not broken
- [ ] Mobile view acceptable
- [ ] No horizontal scroll
- [ ] Colors match Voys branding

### End-to-End Flow Test (Critical)

**Test 5 Different Business Types:**

#### Test 1: Simple Restaurant
```
Input:
- Name: "Bella's Pizza"
- Type: Restaurant
- Staff: 3
- Hours: 09:00 - 21:00
- Special: "need voicemail after hours"

Expected Output:
- Entry → Time Check → Open (Ring All) / Closed (Voicemail)
- Features: Opening Hours, Call Group, Voicemail
- Implementation: 3-5 steps
```

✅ **Checklist:**
- [ ] Form submission works
- [ ] Generates in < 10 seconds
- [ ] Simple flowchart renders
- [ ] Technical flowchart renders
- [ ] Feature checklist shows 3 items checked
- [ ] Voice scripts generated (if enabled)
- [ ] Implementation guide shows steps
- [ ] No errors in console

#### Test 2: Law Office (Complex)
```
Input:
- Name: "Smith & Associates"
- Type: Office
- Staff: 5
- Hours: 08:00 - 17:00
- Special: "separate lines for each lawyer, after hours emergency"

Expected Output:
- Entry → Time → Open (IVR Menu) / Closed (Emergency + Voicemail)
- Features: Opening Hours, IVR, Call Groups, Voicemail
- Implementation: 7-10 steps
```

✅ **Checklist:**
- [ ] IVR menu created
- [ ] Multiple call groups
- [ ] Emergency handling
- [ ] All flowcharts render
- [ ] More complex than Test 1

#### Test 3: Medical Practice
```
Input:
- Name: "City Medical"
- Type: Medical
- Staff: 4
- Hours: 08:00 - 18:00
- Special: "appointment booking, after hours emergency line"

Expected Output:
- Entry → Time → Open (IVR: Appointments/Emergency) / Closed (Emergency + VM)
- Features: Opening Hours, IVR, Call Groups, Voicemail
- Special: Emergency line always available
```

✅ **Checklist:**
- [ ] Appointment routing works
- [ ] Emergency always available
- [ ] Medical-specific language
- [ ] Flowcharts clear

#### Test 4: Retail Store
```
Input:
- Name: "Fashion Boutique"
- Type: Retail
- Staff: 2
- Hours: 10:00 - 18:00
- Special: "queue during busy times"

Expected Output:
- Entry → Time → Open (Call Group → Queue) / Closed (Voicemail)
- Features: Opening Hours, Call Group, Queue, Voicemail
```

✅ **Checklist:**
- [ ] Queue configured
- [ ] Music on hold mentioned
- [ ] Reasonable timeout
- [ ] Fallback to voicemail

#### Test 5: Solo Service Business
```
Input:
- Name: "John's Consulting"
- Type: Service
- Staff: 1
- Hours: 09:00 - 17:00
- Special: "just need voicemail, very simple"

Expected Output:
- Entry → Time → Open (Direct Call) / Closed (Voicemail)
- Features: Opening Hours, Voicemail
- Simplest possible plan
```

✅ **Checklist:**
- [ ] Super simple structure
- [ ] No unnecessary features
- [ ] Clear for non-technical user
- [ ] Works perfectly

## Edge Case Testing

### Edge Case 1: Extremely Long Description
```
Input: 300+ words describing complex business
Expected: Generates reasonable plan, doesn't crash
```

### Edge Case 2: Minimal Description
```
Input: "Pizza shop"
Expected: Makes reasonable assumptions, asks for more details in chatbot?
```

### Edge Case 3: Unusual Hours
```
Input: 24/7 business
Expected: No time-based routing OR always-open path
```

### Edge Case 4: Many Staff
```
Input: 20 staff members
Expected: Handles gracefully, maybe suggests departments
```

## Validation Testing

### Mermaid Validation Test Cases
```typescript
// Test 1: Invalid node ID
const bad1 = `graph TD
    entry-point["Start"]  // Should fail (hyphen in ID)
`;

// Test 2: Unquoted label
const bad2 = `graph TD
    entry[Call Arrives]  // Should fail (no quotes)
`;

// Test 3: Wrong arrow
const bad3 = `graph TD
    A -> B  // Should fail (single dash)
`;

// Run validator
testMermaidSyntax(bad1); // Should show errors
testMermaidSyntax(bad2);
testMermaidSyntax(bad3);
```

### Voys Logic Validation Test Cases
```typescript
// Test 1: No entry point
const invalidPlan1 = {
  dialPlan: {
    nodes: [{ id: 'vm', type: 'voicemail' }],
    edges: []
  }
};
validateDialPlan(invalidPlan1); // Should error

// Test 2: Empty call group
const invalidPlan2 = {
  dialPlan: {
    nodes: [
      { id: 'entry', type: 'entryPoint' },
      { id: 'group', type: 'callGroup', config: { members: [] } }
    ],
    edges: [{ from: 'entry', to: 'group' }]
  }
};
validateDialPlan(invalidPlan2); // Should error

// Test 3: Circular routing
const invalidPlan3 = {
  dialPlan: {
    nodes: [
      { id: 'A', type: 'callGroup', config: { members: ['user1'] } },
      { id: 'B', type: 'queue' }
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' } // Loop!
    ]
  }
};
validateDialPlan(invalidPlan3); // Should error
```

## Demo Preparation Testing

### 1 Week Before Demo
- [ ] Test all 5 business types
- [ ] Pre-generate backup examples
- [ ] Save JSON to files
- [ ] Test loading from cache

### 1 Day Before Demo
- [ ] Fresh browser test (clear cache)
- [ ] Test on presentation machine
- [ ] Verify internet connection works
- [ ] Test with airplane mode (should fail gracefully)
- [ ] Check API key quotas

### Morning of Demo
- [ ] Start dev server
- [ ] Load http://localhost:3000
- [ ] Run through demo script once
- [ ] Check console for errors
- [ ] Verify backup examples load

## Pre-Demo Checklist

### Environment
- [ ] Dev server starts without errors
- [ ] localhost:3000 accessible
- [ ] API keys valid and working
- [ ] No rate limits hit
- [ ] Browser cache cleared

### Functionality
- [ ] Form works
- [ ] Claude API responds
- [ ] Mermaid renders
- [ ] Fallback works
- [ ] All components visible

### Backup Plan
- [ ] 3 examples pre-generated
- [ ] JSON files saved
- [ ] Screenshots taken
- [ ] Video recorded
- [ ] Demo script printed

## Error Recovery Testing

### Scenario 1: Claude API Timeout
**Trigger:** Set timeout to 1ms, test
**Expected:** Error message shown, user can retry
**Fix:** Show "Generation taking longer than expected. Try again?"

### Scenario 2: Mermaid Render Failure
**Trigger:** Pass invalid Mermaid syntax
**Expected:** Text fallback displays
**Fix:** Already handled in FlowchartSimple component

### Scenario 3: ElevenLabs Quota Exceeded
**Trigger:** Generate 20+ voices in a row
**Expected:** Show text scripts only, no audio
**Fix:** Check quota before generating

### Scenario 4: Network Failure
**Trigger:** Disconnect internet
**Expected:** Clear error message
**Fix:** Catch fetch errors, show "No internet connection"

## Performance Testing (Light)

### Timing Benchmarks
- [ ] Form to results: < 15 seconds
- [ ] Flowchart render: < 3 seconds
- [ ] Page load: < 2 seconds
- [ ] Voice generation: < 10 seconds

**If any exceed limits:**
- Add loading indicators
- Show progress messages
- Consider caching

## Browser Compatibility

### Must Work On:
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Safari (latest) - if Mac available

### Nice to Work On:
- Firefox (latest)

### Don't Worry About:
- Internet Explorer
- Mobile browsers (for MVP demo)

## Debugging Checklist

### If Something Breaks:

**Step 1: Check Console**
```javascript
// Look for:
- Red errors
- Failed network requests
- Validation failures
```

**Step 2: Check Network Tab**
```
- API calls succeeding?
- Response status 200?
- Response body valid JSON?
```

**Step 3: Check State**
```javascript
// Add temporarily:
console.log('State:', state);
console.log('Props:', props);
console.log('Data:', data);
```

**Step 4: Simplify**
```
- Remove chatbot (if enabled)
- Remove voice (if enabled)
- Test just form → JSON → display
```

**Step 5: Ask AI**
```
"I'm getting error: [error message]
Here's my code: [paste relevant code]
What's wrong and how do I fix it?"
```

## Success Metrics

### Minimum Success (Demo Ready)
- [ ] 3 of 5 test cases pass
- [ ] No console errors
- [ ] At least one flowchart renders
- [ ] Can complete one full flow

### Full Success (Ideal)
- [ ] All 5 test cases pass
- [ ] Both flowcharts render
- [ ] Voice previews work
- [ ] Zero console errors
- [ ] Mobile works acceptably

---

**Testing Mantra:** Test early, test often, fix immediately, have backups ready.
