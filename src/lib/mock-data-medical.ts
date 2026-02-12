// src/lib/mock-data-medical.ts
export const MOCK_DIAL_PLAN_MEDICAL = {
  businessContext: {
    name: "City Medical Centre",
    type: "Medical Practice",
    staffCount: 2,
    hours: "08:00-16:00",
    timezone: "Africa/Johannesburg",
  },
  dialPlan: {
    nodes: [
      {
        id: "entry",
        type: "entryPoint",
        label: "Incoming Call",
        data: { label: "Main Line" },
        position: { x: 300, y: 0 },
      },
      {
        id: "moh",
        type: "musicOnHold",
        label: "Step 1: Hold Music",
        data: { label: "Set Hold Music", description: "Background music" },
        position: { x: 300, y: 100 },
      },
      {
        id: "time_basic",
        type: "timeCondition",
        label: "Step 2: Basic Hours",
        data: { label: "Opening Hours", description: "Mon-Fri 08:00-16:00" },
        position: { x: 300, y: 200 },
      },
      // --- OPEN BRANCH (LEFT) ---
      {
        id: "welcome",
        type: "announcement",
        label: "Welcome Message",
        data: { label: "Play Welcome", description: "During Open Hours" },
        position: { x: 100, y: 350 },
      },
      {
        id: "user_reception",
        type: "user",
        label: "Reception User",
        data: { label: "Ring Reception", description: "User 1 (Ext 601)" },
        position: { x: 100, y: 450 },
      },
      {
        id: "user_emergency",
        type: "user",
        label: "Emergency User",
        data: { label: "Ring Emergency", description: "User 2 (Ext 602)" },
        position: { x: 100, y: 550 },
      },
      {
        id: "vm_busy",
        type: "voicemail",
        label: "Voicemail (Busy)",
        data: { label: "Voicemail", description: "Fallback if busy" },
        position: { x: 100, y: 650 },
      },
      // --- CLOSED BRANCH (RIGHT) ---
      {
        id: "time_advanced",
        type: "timeCondition",
        label: "Step 3: Adv. Hours",
        data: { label: "After Hours Check", description: "Emergency Logic" },
        position: { x: 500, y: 350 },
      },
      {
        id: "user_oncall",
        type: "user",
        label: "On-Call Doctor",
        data: { label: "Ring On-Call", description: "User Module" },
        position: { x: 400, y: 450 },
      },
      {
        id: "fixed_mobile",
        type: "external",
        label: "Forward to Mobile",
        data: { label: "Mobile Forward", description: "Fixed Destination" },
        position: { x: 400, y: 550 },
      },
      {
        id: "vm_closed",
        type: "voicemail",
        label: "Voicemail (Closed)",
        data: { label: "Voicemail", description: "Night/Holiday" },
        position: { x: 600, y: 450 },
      },
    ],
    edges: [
      // Entry -> Music
      { id: "e1", source: "entry", target: "moh", label: null },

      // Music -> Basic Hours
      { id: "e2", source: "moh", target: "time_basic", label: "Next" },

      // --- OPEN FLOW ---
      { id: "e3", source: "time_basic", target: "welcome", label: "Open" },
      { id: "e4", source: "welcome", target: "user_reception", label: null },
      {
        id: "e5",
        source: "user_reception",
        target: "user_emergency",
        label: "No Answer",
      },
      {
        id: "e6",
        source: "user_emergency",
        target: "vm_busy",
        label: "No Answer",
      },

      // --- CLOSED FLOW ---
      {
        id: "e7",
        source: "time_basic",
        target: "time_advanced",
        label: "Closed",
      },

      // Advanced Hours Logic
      {
        id: "e8",
        source: "time_advanced",
        target: "user_oncall",
        label: "Emergency Time",
      },
      {
        id: "e9",
        source: "user_oncall",
        target: "fixed_mobile",
        label: "No Answer",
      },

      // Fallback/Holidays
      {
        id: "e10",
        source: "time_advanced",
        target: "vm_closed",
        label: "Other Times",
      },
      {
        id: "e11",
        source: "time_basic",
        target: "vm_closed",
        label: "Public Holiday",
      },
    ],
  },
  features: [
    {
      id: "users",
      name: "Users (Staff)",
      description: "2 Staff members (Reception + Emergency)",
      helpUrl: "https://freedom.voys.co.za/redirect/User",
      used: true,
    },
    {
      id: "opening_hours_basic",
      name: "Opening Hours",
      description: "Mon-Fri 08:00-16:00",
      helpUrl: "https://freedom.voys.co.za/client/redirect/openinghoursbasic/",
      used: true,
    },
    {
      id: "messages",
      name: "Messages",
      description: "Welcome and informational audio",
      helpUrl: "https://freedom.voys.co.za/messages",
      used: true,
    },
    {
      id: "music_on_hold",
      name: "Hold Music",
      description: "Comforting background audio",
      helpUrl: "https://freedom.voys.co.za/music-on-hold",
      used: true,
    },
    {
      id: "voicemail",
      name: "Voicemail",
      description: "Email-to-audio recordings",
      helpUrl: "https://freedom.voys.co.za/voicemail",
      used: true,
    },
    {
      id: "fixed_destination",
      name: "Fixed Mobile",
      description: "Forwarding to external mobile numbers",
      helpUrl: "https://freedom.voys.nl/redirect/FixedDestination",
      used: true,
    },
    {
      id: "advanced_opening_hours",
      name: "Adv. Opening Hours",
      description: "Complex routing for emergency shifts",
      helpUrl: "https://help.voys.co.za/opening-hours-advanced",
      used: true,
    },
  ],
  voiceScripts: [
    {
      type: "welcome",
      text: "Thank you for calling City Medical. If this is a medical emergency, please hang up and dial 112.",
      duration: "8s",
    },
    {
      type: "voicemail",
      text: "You have reached City Medical after hours. Please leave a detailed message or contact our emergency line.",
      duration: "10s",
    },
  ],
  implementationSteps: [
    {
      step: 1,
      title: "Create Users (2 Staff)",
      description:
        "Create profiles for Reception and Emergency staff with internal extensions (601, 602).",
      actions: [
        "Go to Users",
        "Add User 1 (Reception) -> Ext 601 (VoIP 201-203)",
        "Add User 2 (Emergency) -> Ext 602 (VoIP 204-206)",
        "Check 'Send email to create password'",
        "Select 'End-user' permission",
      ],
      helpUrl: "https://freedom.voys.co.za/redirect/User",
      estimatedTime: "5 minutes",
    },
    {
      step: 2,
      title: "Configure Basic Hours",
      description: "Set practice hours to Mon-Fri 08:00-16:00.",
      actions: [
        "Go to Opening Hours Basic",
        "Set Mon-Fri 08:00-16:00",
        "Select all public holidays",
        "Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/openinghoursbasic/",
      estimatedTime: "2 minutes",
    },
    {
      step: 3,
      title: "Configure Messages",
      description: "Upload your Welcome Message audio.",
      actions: [
        "Go to Messages -> Add",
        "Name: 'Welcome Message'",
        "Upload/Record audio file",
        "Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/messages/",
      estimatedTime: "3 minutes",
    },
    {
      step: 4,
      title: "Music On Hold",
      description: "Set background music for hold/transfer.",
      actions: [
        "Go to Music On Hold -> Add",
        "Check 'Use in outgoing calls'",
        "Upload audio file",
        "Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/musiconhold/",
      estimatedTime: "3 minutes",
    },
    {
      step: 5,
      title: "Voice Mail",
      description: "Setup 'Out of Hours' voicemail to email.",
      actions: [
        "Go to Voicemail -> Add",
        "Name: 'Out of Hours'",
        "Enter email addresses for .wav attachments",
        "Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/voicemail/",
      estimatedTime: "3 minutes",
    },
    {
      step: 6,
      title: "Fixed Mobile (Forwarding)",
      description: "Add external number for emergency forwarding.",
      actions: [
        "Go to Fixed Destination -> Add",
        "Enter mobile number",
        "Add description (e.g., Doctor Mobile)",
        "Save",
      ],
      helpUrl: "https://freedom.voys.nl/redirect/FixedDestination",
      estimatedTime: "3 minutes",
    },
    {
      step: 7,
      title: "Build Dial Plan",
      description:
        "Connect modules: Music -> Hours -> Message -> User -> Fallbacks.",
      actions: [
        "Add 'Music on Hold' module",
        "Add 'Opening Hours Basic' module",
        "Inside 'During Hours': Message -> User (Reception) -> User (Emergency) -> Voicemail",
        "Inside 'Outside Hours': Adv. Opening Hours -> User (On-Call) -> Fixed Mobile",
        "Conditions not met/Holidays: Voicemail",
        "Save Dial Plan",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/routing/",
      estimatedTime: "10 minutes",
    },
  ],
};
