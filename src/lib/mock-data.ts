// src/lib/mock-data.ts
export const MOCK_DIAL_PLAN = {
  businessContext: {
    name: "Bella's Pizza",
    type: "Restaurant",
    staffCount: 3,
    hours: "11:00-21:00",
    timezone: "Africa/Johannesburg",
  },
  dialPlan: {
    nodes: [
      {
        id: "entry",
        type: "entryPoint",
        label: "Incoming Call",
        data: { label: "Main Number" },
        position: { x: 300, y: 0 },
      },
      {
        id: "moh",
        type: "musicOnHold",
        label: "Step 1: Hold Music",
        data: { label: "Set Hold Music", description: "Sets background music" },
        position: { x: 300, y: 100 },
      },
      {
        id: "time_check",
        type: "timeCondition",
        label: "Step 2: Opening Hours",
        data: { label: "Check Hours", description: "11:00 - 21:00" },
        position: { x: 300, y: 200 },
      },
      // --- OPEN BRANCH (LEFT SIDE) ---
      {
        id: "welcome",
        type: "announcement",
        label: "Welcome Message",
        data: { label: "Play Welcome", description: "Inside: Open Hours" },
        position: { x: 100, y: 350 },
      },
      {
        id: "call_group",
        type: "callGroup",
        label: "Ring Staff",
        data: { label: "Ring Pizza Staff", description: "20s Ring Time" },
        position: { x: 100, y: 450 },
      },
      {
        id: "vm_no_answer",
        type: "voicemail",
        label: "Voicemail (Busy)",
        data: { label: "Voicemail", description: "Fallback if no answer" },
        position: { x: 100, y: 550 },
      },
      // --- CLOSED BRANCH (RIGHT SIDE) ---
      {
        id: "vm_closed",
        type: "voicemail",
        label: "Voicemail (Closed)",
        data: { label: "Voicemail", description: "Inside: Closed/Holiday" },
        position: { x: 500, y: 350 },
      },
    ],
    edges: [
      // Entry -> Music
      { id: "e1", source: "entry", target: "moh", label: null },

      // Music -> Time Check
      { id: "e2", source: "moh", target: "time_check", label: "Next Step" },

      // Time Check -> Open (Left)
      { id: "e3", source: "time_check", target: "welcome", label: "Open" },

      // Time Check -> Closed (Right)
      {
        id: "e4",
        source: "time_check",
        target: "vm_closed",
        label: "Closed/Holiday",
      },

      // Welcome -> Call Group
      { id: "e5", source: "welcome", target: "call_group", label: null },

      // Call Group -> Voicemail (Fallback)
      {
        id: "e6",
        source: "call_group",
        target: "vm_no_answer",
        label: "No Answer",
      },
    ],
  },
  mermaidSimple: "", // Deprecated
  mermaidTechnical: "", // Deprecated
  features: [
    {
      id: "voip_account",
      name: "VoIP Account",
      description: "VoIP account enables seamless connectivity",
      helpUrl: "https://help.voys.co.za/voip-account",
      used: true,
    },
    {
      id: "users",
      name: "Users",
      description: "Configure how and where users can be reached",
      helpUrl: "https://help.voys.co.za/user-reachability",
      used: true,
    },
    {
      id: "opening_hours_basic",
      name: "Opening Hours Basic",
      description: "Set your business operating hours",
      helpUrl: "https://help.voys.co.za/opening-hours-basic",
      used: true,
    },
    {
      id: "call_group",
      name: "Call Groups",
      description: "Ring multiple users simultaneously",
      helpUrl: "https://help.voys.co.za/callgroup",
      used: true,
    },
    {
      id: "messages",
      name: "Messages",
      description: "Manage and create audio messages",
      helpUrl: "https://help.voys.co.za/messages",
      used: true,
    },
    {
      id: "music_on_hold",
      name: "Hold Music",
      description: "Transform waiting time into a pleasant experience",
      helpUrl: "https://help.voys.co.za/music-on-hold",
      used: true,
    },
    {
      id: "voicemail",
      name: "Voicemail",
      description: "Record messages when unavailable",
      helpUrl: "https://help.voys.co.za/voicemail",
      used: true,
    },
  ],
  voiceScripts: [
    {
      type: "welcome",
      text: "Thank you for calling Bella's Pizza. Please hold while we connect you.",
      duration: "5s",
    },
    {
      type: "voicemail",
      text: "You've reached Bella's Pizza. We are currently closed. Our hours are 11am to 9pm daily. Please leave a message.",
      duration: "12s",
    },
  ],
  implementationSteps: [
    {
      step: 1,
      title: "Set Hold Music",
      description: "Configure the background music for the call.",
      actions: ["Add 'Music On Hold' module", "Select your audio file", "Save"],
      helpUrl: "https://freedom.voys.co.za/client/redirect/musiconhold/",
      estimatedTime: "2 minutes",
    },
    {
      step: 2,
      title: "Opening Hours",
      description: "Check if the business is open.",
      actions: [
        "Add 'Opening Hours Basic' module",
        "Select your hours (11:00-21:00)",
        "Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/openinghoursbasic/",
      estimatedTime: "2 minutes",
    },
    {
      step: 3,
      title: "Welcome Message (During Hours)",
      description: "Play greeting inside the 'Open' branch.",
      actions: [
        "Inside 'During opening hours'",
        "Add 'Messages' module",
        "Select Welcome Message",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/messages/",
      estimatedTime: "2 minutes",
    },
    {
      step: 4,
      title: "Call Group (During Hours)",
      description: "Ring staff after the message plays.",
      actions: [
        "Add 'Call Group' module below Message",
        "Select Staff Group",
        "Set Ring Time to 20s",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/callgroup/",
      estimatedTime: "2 minutes",
    },
    {
      step: 5,
      title: "Voicemail Fallback",
      description: "Handle no-answers and closed hours.",
      actions: [
        "Add 'Voicemail' below Call Group (No Answer)",
        "Add 'Voicemail' inside 'Outside opening hours'",
        "Add 'Voicemail' inside 'Public Holidays'",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/voicemail/",
      estimatedTime: "3 minutes",
    },
  ],
};
