export const VOYS_DOCUMENTATION = `
VOYS PLATFORM RULES & CONSTRAINTS:

1. AVAILABLE FEATURES:
   - Opening Hours (Basic & Advanced)
   - Call Groups (Simultaneous or Sequential ringing)
   - IVR (Interactive Voice Response menus - max 9 options)
   - Voicemail (REQUIRES a greeting script)
   - Queue (with music on hold, max timeout 600s)
   - Announcements (pre-recorded messages)

2. ROUTING LOGIC RULES:
   - Every dial plan MUST start with a phone number entry point
   - Opening Hours MUST be defined before time-based routing
   - Call Groups REQUIRE at least 1 user to be configured first
   - IVR menus can have max 9 options (0-9 keys)
   - Queue timeout max: 600 seconds (10 minutes)

3. VALID ROUTING PATHS:
   ✅ Entry → Time Check → Open (Welcome) → Call Group → Queue → Voicemail
   ✅ Entry → Time Check → Closed → After Hours Voicemail
   ✅ Entry → IVR → Option 1 (Sales) / Option 2 (Support)
   ❌ INVALID: Routing to non-existent users
   ❌ INVALID: Circular loops (Queue → Call Group → Queue)

4. COMMON PATTERNS:
   - Small Business: Entry → Time Check → Call Group → Voicemail
   - Department Routing: Entry → IVR → Dept Call Groups
   - After Hours: Entry → Time Check → Closed Message → Voicemail
`;
