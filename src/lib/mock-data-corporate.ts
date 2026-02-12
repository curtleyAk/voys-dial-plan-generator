export const MOCK_DIAL_PLAN_CORPORATE = {
  // src/lib/mock-data.ts
  businessContext: {
    name: "Smith & Associates Law",
    type: "Law Firm",
    staffCount: 5,
    hours: "08:00-17:00",
    timezone: "Africa/Johannesburg",
  },
  dialPlan: {
    nodes: [
      {
        id: "entry",
        type: "entryPoint",
        label: "Call Arrives",
        simpleLabel: "Someone calls",
      },
      {
        id: "filter",
        type: "filter",
        label: "VIP/Emergency Filter",
        simpleLabel: "Is it a VIP?",
        config: { filterType: "whitelist" },
      },
      {
        id: "vip_user",
        type: "user",
        label: "Senior Partner Mobile",
        simpleLabel: "Ring Partner directly",
      },
      {
        id: "moh_setup",
        type: "musicOnHold",
        label: "Set Hold Music",
        simpleLabel: "Set music",
      },
      {
        id: "time_check",
        type: "timeCondition",
        label: "Opening Hours Check",
        simpleLabel: "Are we open?",
        config: { openHours: "08:00-17:00" },
      },
      {
        id: "welcome",
        type: "announcement",
        label: "Welcome Message",
        simpleLabel: "Play greeting",
      },
      {
        id: "ivr_menu",
        type: "ivr",
        label: "Main Menu",
        simpleLabel: "IVR Menu",
        config: { options: ["1", "2", "0"] },
      },
      {
        id: "var_announce_1",
        type: "variableAnnouncement",
        label: "Announce: Legal",
        simpleLabel: "Whisper 'Legal'",
      },
      {
        id: "grp_legal",
        type: "callGroup",
        label: "Legal Dept Group",
        simpleLabel: "Ring Legal Dept",
      },
      {
        id: "grp_admin",
        type: "callGroup",
        label: "Admin Dept Group",
        simpleLabel: "Ring Admin Dept",
      },
      {
        id: "user_reception",
        type: "user",
        label: "Receptionist",
        simpleLabel: "Ring Reception",
      },
      {
        id: "voicemail",
        type: "voicemail",
        label: "General Voicemail",
        simpleLabel: "Leave message",
      },
    ],
    edges: [
      { from: "entry", to: "filter", condition: null },
      {
        from: "filter",
        to: "vip_user",
        condition: "match",
        label: "VIP Number",
      },
      {
        from: "filter",
        to: "moh_setup",
        condition: "no_match",
        label: "Standard",
      },
      { from: "moh_setup", to: "time_check", condition: null },
      { from: "time_check", to: "welcome", condition: "open", label: "Yes" },
      { from: "time_check", to: "voicemail", condition: "closed", label: "No" },
      { from: "welcome", to: "ivr_menu", condition: null },

      // IVR Option 1 flow
      {
        from: "ivr_menu",
        to: "var_announce_1",
        condition: "option_1",
        label: "Press 1",
      },
      { from: "var_announce_1", to: "grp_legal", condition: null },
      {
        from: "grp_legal",
        to: "voicemail",
        condition: "no_answer",
        label: "No Answer",
      },

      // IVR Option 2 flow
      {
        from: "ivr_menu",
        to: "grp_admin",
        condition: "option_2",
        label: "Press 2",
      },
      {
        from: "grp_admin",
        to: "voicemail",
        condition: "no_answer",
        label: "No Answer",
      },

      // IVR Option 0 flow
      {
        from: "ivr_menu",
        to: "user_reception",
        condition: "option_0",
        label: "Press 0",
      },

      // Fallbacks
      {
        from: "ivr_menu",
        to: "voicemail",
        condition: "timeout",
        label: "Timeout",
      },
    ],
  },
  mermaidSimple: `graph TD
    entry["Someone calls"] --> filter{"Is it a VIP?"}
    filter -->|"Yes"| vip_user["Ring Partner directly"]
    filter -->|"No"| time_check{"Are we open?"}
    time_check -->|"No"| voicemail["Leave message"]
    time_check -->|"Yes"| welcome["Play greeting"]
    welcome --> ivr_menu{"IVR Menu"}
    ivr_menu -->|"Press 1"| grp_legal["Ring Legal Dept"]
    ivr_menu -->|"Press 2"| grp_admin["Ring Admin Dept"]
    ivr_menu -->|"Press 0"| user_reception["Ring Reception"]
    grp_legal -->|"No Answer"| voicemail`,
  mermaidTechnical: `graph TD
    entry["Call Arrives"] --> filter["Filter (VIP Check)"]
    filter -->|"Match"| vip_user["User: Senior Partner"]
    filter -->|"No Match"| moh["Set Hold Music"]
    moh --> time_check["Time Check (08:00-17:00)"]
    time_check -->|"Closed"| voicemail["Voicemail"]
    time_check -->|"Open"| welcome["Message: Welcome"]
    welcome --> ivr["IVR: Main Menu"]
    ivr -->|"Opt 1"| var_ann["Var. Caller Name"]
    var_ann --> grp_legal["Call Group: Legal"]
    ivr -->|"Opt 2"| grp_admin["Call Group: Admin"]
    ivr -->|"Opt 0"| user_recep["User: Reception"]
    grp_legal -->|"Timeout"| voicemail
    grp_admin -->|"Timeout"| voicemail`,
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
      id: "call_group",
      name: "Call Groups",
      description: "Ring multiple users simultaneously",
      helpUrl: "https://help.voys.co.za/callgroup",
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
      id: "messages",
      name: "Messages",
      description: "Manage audio messages for your dial plan",
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
    {
      id: "sounds",
      name: "Sounds",
      description: "Upload audio for IVR menus",
      helpUrl: "https://help.voys.co.za/sounds",
      used: true,
    },
    {
      id: "ivr",
      name: "IVR Menu",
      description: "Interactive voice menus (Press 1 for Legal)",
      helpUrl: "https://help.voys.co.za/ivr",
      used: true,
    },
    {
      id: "filter",
      name: "Filter",
      description: "Route calls based on caller phone number (VIP)",
      helpUrl: "https://help.voys.co.za/filter",
      used: true,
    },
    {
      id: "caller_name",
      name: "Variable Caller Name",
      description: "Announce which IVR option was selected",
      helpUrl: "https://help.voys.co.za/variable-caller-name",
      used: true,
    },
    {
      id: "queue",
      name: "Call Queue",
      description: "Hold callers with music when busy",
      helpUrl: "https://help.voys.co.za/queue",
      used: false,
    },
    {
      id: "announcements",
      name: "Variable Announcements",
      description: "Play dynamic pre-recorded messages",
      helpUrl: "https://help.voys.co.za/variable-announcement",
      used: false,
    },
    {
      id: "call_recording",
      name: "Call Recording",
      description: "Record conversations for quality assurance",
      helpUrl: "https://help.voys.co.za/call-recording",
      used: false,
    },
    {
      id: "fixed_mobile",
      name: "Fixed-Mobile",
      description: "Link office and mobile numbers",
      helpUrl: "https://help.voys.co.za/fixed-mobile",
      used: false,
    },
  ],
  voiceScripts: [
    {
      type: "welcome",
      text: "Thank you for calling Smith & Associates. Please listen carefully as our menu options have changed. Press 1 for Legal, 2 for Administration, or 0 for Reception.",
      duration: "8s",
    },
    {
      type: "ivr_timeout",
      text: "We did not receive a valid input. Please try again.",
      duration: "4s",
    },
    {
      type: "voicemail",
      text: "You have reached Smith & Associates outside of business hours. We are open Monday to Friday from 8 AM to 5 PM. Please leave a message.",
      duration: "10s",
    },
  ],
  implementationSteps: [
    {
      step: 1,
      title: "Create Users (5 Staff)",
      description:
        "Create profiles for 5 staff members (Departments + Reception). Setup internal extensions (601-605) and VoIP accounts.",
      actions: [
        "Go to Freedom Portal → Users",
        "Click 'Add' or edit existing empty profiles",
        "Enter First Name, Last Name, and Email",
        "Check 'Send email to user to create password'",
        "Select 'End-user' permission (unless Admin is required)",
        "Click Create/Save",
        "Note configuration: User 1 (601) gets VoIP 201(Phone), 202(Web), 203(App)",
        "User 2 (602) gets 204, 205, 206, and so on for all 5 users",
      ],
      helpUrl: "https://freedom.voys.co.za/redirect/User",
      estimatedTime: "5 minutes",
    },
    {
      step: 2,
      title: "Configure Call Groups",
      description:
        "Create groups for your departments (e.g., Legal, Admin) to ring relevant staff simultaneously.",
      actions: [
        "Go to Freedom Portal → Call Groups",
        "Click 'Add'",
        "Select an extension number (suggested in blue)",
        "Select 'All at the same time' strategy",
        "Add relevant user email addresses under destination",
        "Click Save",
        "Repeat for second department if needed",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/callgroup/",
      estimatedTime: "4 minutes",
    },
    {
      step: 3,
      title: "Configure Basic Opening Hours",
      description: "Set the office hours to Mon-Fri, 08:00 - 17:00.",
      actions: [
        "Go to Freedom Portal → Opening Hours (Basic)",
        "Set Mon-Fri 08:00-17:00",
        "Click Next",
        "Select all public holidays",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/openinghoursbasic/",
      estimatedTime: "2 minutes",
    },
    {
      step: 4,
      title: "Configure Messages",
      description:
        "Upload or record your Welcome Message and other announcements.",
      actions: [
        "Go to Freedom Portal → Messages",
        "Click 'Add'",
        "Enter name (e.g., 'Welcome Message')",
        "Select 'Add audio file' from dropdown",
        "Upload file or record directly in browser",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/messages/",
      estimatedTime: "3 minutes",
    },
    {
      step: 5,
      title: "Music On Hold",
      description: "Set up the audio played when callers are on hold.",
      actions: [
        "Go to Freedom Portal → Music On Hold",
        "Click 'Add'",
        "Name: 'Hold Music'",
        "Check 'Use music on hold in outgoing phone calls'",
        "Click Next",
        "Upload recorded audio file",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/musiconhold/",
      estimatedTime: "3 minutes",
    },
    {
      step: 6,
      title: "Configure Voicemail",
      description:
        "Setup the after-hours voicemail to send recordings to email.",
      actions: [
        "Go to Freedom Portal → Voicemail",
        "Click 'Add'",
        "Name: 'Out of Hours'",
        "Enter email addresses for receiving .wav files + transcription",
        "Separate multiple emails with commas",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/voicemail/",
      estimatedTime: "3 minutes",
    },
    {
      step: 7,
      title: "Configure Sounds for IVR",
      description:
        "Upload the specific audio prompts needed for the Interactive Voice Response menu.",
      actions: [
        "Go to Freedom Portal → Sounds",
        "Click 'Add', enter Name",
        "Optionally check 'Set as Message' if needed elsewhere",
        "Upload files for: Start Message (Menu Options), Incorrect Message, and Timeout Message",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/recording/sound/",
      estimatedTime: "3 minutes",
    },
    {
      step: 8,
      title: "Configure IVR",
      description:
        "Build the menu system (Press 1 for X, 2 for Y) using the sounds created.",
      actions: [
        "Go to Freedom Portal → IVR",
        "Click 'Add', enter Name",
        "Set Timeout (default 10s)",
        "Set Maximum Attempts (before routing to Failed)",
        "Select 'Start Message' (uploaded in Step 7)",
        "Select 'Incorrect Message' and 'Timeout Message'",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.co/redirect/Ivr",
      estimatedTime: "5 minutes",
    },
    {
      step: 9,
      title: "Configure Filter (VIP)",
      description:
        "Create a whitelist for VIP clients or emergencies to bypass the main menu.",
      actions: [
        "Go to Freedom Portal → Filter Group",
        "Click 'Add'",
        "Select type: 'Phone numbers' (or Anonymous)",
        "Provide Name/Description (e.g., 'Emergency Access')",
        "Click Save",
      ],
      helpUrl: "https://freedom.voys.nl/redirect/FilterGroup",
      estimatedTime: "5 minutes",
    },
    {
      step: 10,
      title: "Build Your Dial Plan",
      description: "Assemble all modules into the final flow.",
      actions: [
        "Go to Routing → Add Dial Plan → Save & Go to dial plan",
        "STEP 1: Add 'Filter' module (Route matches to User/VIP directly)",
        "STEP 2 (No Match): Add 'Music On Hold' module",
        "STEP 3: Add 'Opening Hours Basic' module",
        "Inside 'During opening hours':",
        "  → Add 'Messages' (Welcome)",
        "  → Add 'IVR Menu'",
        "Inside IVR Options:",
        "  → Option 1: Add 'Variable Caller Name' (Label: Legal) → 'Call Group' (Legal) → Fallback 'Voicemail'",
        "  → Option 2: Add 'Call Group' (Admin) → Fallback 'Voicemail'",
        "  → Option 0: Add 'User' (Reception)",
        "  → Failed/Timeout: Route to Voicemail",
        "Inside 'Outside opening hours' & 'Public Holidays':",
        "  → Add 'Voicemail' (Out of Hours)",
        "Click Save Dial Plan",
      ],
      helpUrl: "https://freedom.voys.co.za/client/redirect/routing/",
      estimatedTime: "15 minutes",
    },
  ],
};
