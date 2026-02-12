export const MOCK_DIAL_PLAN_HARDWARE = {
  businessContext: {
    name: "BuildIt Hardware",
    type: "Retail",
    staffCount: 15,
    hours: "M-F 08:00-17:00, Sat 09:00-13:00",
    timezone: "Africa/Johannesburg",
  },
  dialPlan: {
    nodes: [
      // Entry & High Level Checks
      {
        id: "entry",
        type: "entryPoint",
        label: "010 123 4567",
        simpleLabel: "Main Line",
      },
      {
        id: "holiday_check",
        type: "timeCondition",
        label: "Public Holidays",
        simpleLabel: "Holiday Check",
        config: { type: "holiday" },
      },
      {
        id: "hours_check",
        type: "timeCondition",
        label: "Opening Hours",
        simpleLabel: "Time Check",
        config: { hours: "M-F 8-5, Sat 9-1" },
      },

      // Messages & IVR
      {
        id: "vm_holiday",
        type: "voicemail",
        label: "VM | Holiday",
        simpleLabel: "Holiday Message",
      },
      {
        id: "vm_closed",
        type: "voicemail",
        label: "VM | Closed",
        simpleLabel: "Closed Message",
      },
      {
        id: "ivr_main",
        type: "ivr",
        label: "IVR | Main Menu",
        simpleLabel: "Main Menu",
        config: { options: ["1: Sales", "2: Warehouse", "3: Accounts"] },
      },

      // --- OPTION 1: SALES CHAIN ---
      {
        id: "grp_sales_main",
        type: "callGroup",
        label: "Grp | Sales Main",
        simpleLabel: "Ring Sales",
      },
      {
        id: "grp_sales_back",
        type: "callGroup",
        label: "Grp | Sales Backup",
        simpleLabel: "Ring Backup",
      },
      {
        id: "mobile_sales",
        type: "external",
        label: "Mobile | Sales Mgr",
        simpleLabel: "Forward to 082...",
      },

      // --- OPTION 2: WAREHOUSE CHAIN ---
      {
        id: "user_warehouse",
        type: "callGroup",
        label: "User | Warehouse Mgr",
        simpleLabel: "Ring Manager",
      },
      {
        id: "grp_warehouse_back",
        type: "callGroup",
        label: "Grp | Warehouse",
        simpleLabel: "Ring Team",
      },
      {
        id: "mobile_warehouse",
        type: "external",
        label: "Mobile | Standby",
        simpleLabel: "Forward to 083...",
      },

      // --- OPTION 3: ACCOUNTS CHAIN ---
      {
        id: "user_accounts",
        type: "callGroup",
        label: "User | Accounts",
        simpleLabel: "Ring Accountant",
      },
      {
        id: "grp_accounts_back",
        type: "callGroup",
        label: "Grp | Admin Team",
        simpleLabel: "Ring Admin",
      },
      {
        id: "mobile_accounts",
        type: "external",
        label: "Mobile | Director",
        simpleLabel: "Forward to 082...",
      },
    ],
    edges: [
      // Top Level Flow
      { from: "entry", to: "holiday_check" },
      {
        from: "holiday_check",
        to: "vm_holiday",
        condition: "match",
        label: "Yes",
      },
      {
        from: "holiday_check",
        to: "hours_check",
        condition: "no_match",
        label: "No",
      },

      {
        from: "hours_check",
        to: "vm_closed",
        condition: "closed",
        label: "Closed",
      },
      { from: "hours_check", to: "ivr_main", condition: "open", label: "Open" },

      // IVR Routing
      { from: "ivr_main", to: "grp_sales_main", label: "1" },
      { from: "ivr_main", to: "user_warehouse", label: "2" },
      { from: "ivr_main", to: "user_accounts", label: "3" },
      { from: "ivr_main", to: "ivr_main", label: "Timeout", condition: "loop" },

      // Option 1 Chain (Sales)
      { from: "grp_sales_main", to: "grp_sales_back", condition: "no_answer" },
      { from: "grp_sales_back", to: "mobile_sales", condition: "no_answer" },

      // Option 2 Chain (Warehouse)
      {
        from: "user_warehouse",
        to: "grp_warehouse_back",
        condition: "no_answer",
      },
      {
        from: "grp_warehouse_back",
        to: "mobile_warehouse",
        condition: "no_answer",
      },

      // Option 3 Chain (Accounts)
      {
        from: "user_accounts",
        to: "grp_accounts_back",
        condition: "no_answer",
      },
      {
        from: "grp_accounts_back",
        to: "mobile_accounts",
        condition: "no_answer",
      },
    ],
  },
  // FIXED: Now includes actual mermaid syntax for the Customer View
  mermaidSimple: `graph TD
    entry["Main Line"] --> holiday_check["Public Holiday?"]
    holiday_check -->|"Yes"| vm_holiday["Holiday Message"]
    holiday_check -->|"No"| hours_check["Are we open?"]
    
    hours_check -->|"Closed"| vm_closed["Closed Message"]
    hours_check -->|"Open"| ivr_main["Main Menu"]
    
    ivr_main -->|"1: Sales"| grp_sales_main["Ring Sales"]
    grp_sales_main -->|"No Answer"| grp_sales_back["Ring Backup"]
    grp_sales_back -->|"No Answer"| mobile_sales["Forward to Mobile"]
    
    ivr_main -->|"2: Warehouse"| user_warehouse["Ring Manager"]
    user_warehouse -->|"No Answer"| grp_warehouse_back["Ring Team"]
    grp_warehouse_back -->|"No Answer"| mobile_warehouse["Forward to Mobile"]
    
    ivr_main -->|"3: Accounts"| user_accounts["Ring Accountant"]
    user_accounts -->|"No Answer"| grp_accounts_back["Ring Admin"]
    grp_accounts_back -->|"No Answer"| mobile_accounts["Forward to Mobile"]
    
    ivr_main -.->|"Timeout"| ivr_main`,

  mermaidTechnical: "graph TD\n...", // Not used since we use VoysAdminView
  features: [
    {
      id: "ivr",
      name: "Multi-Level IVR",
      description: "Department routing",
      helpUrl: "#",
      used: true,
    },
    {
      id: "time",
      name: "Advanced Hours",
      description: "Holidays & Weekends",
      helpUrl: "#",
      used: true,
    },
    {
      id: "fallback",
      name: "Fallback Logic",
      description: "Group -> Group -> Mobile",
      helpUrl: "#",
      used: true,
    },
  ],
  voiceScripts: [
    {
      type: "ivr",
      text: "Welcome to BuildIt. Press 1 for Sales, 2 for Warehouse, or 3 for Accounts. If you know your party's extension, dial it now.",
      duration: "10s",
    },
    {
      type: "closed",
      text: "You have reached BuildIt. We are currently closed. Our hours are 8am to 5pm Monday to Friday, and 9am to 1pm on Saturdays.",
      duration: "12s",
    },
  ],
  implementationSteps: [
    {
      step: 1,
      title: "Create Fallback Groups",
      description:
        "Set up your 'Backup' call groups first so they are ready to be linked.",
      actions: ["Admin > Call Groups"],
      helpUrl: "#",
      estimatedTime: "10 min",
    },
    {
      step: 2,
      title: "Create External Numbers",
      description: "Add the mobile numbers (082...) as 'Fixed Destinations'.",
      actions: ["Admin > Fixed Destinations"],
      helpUrl: "#",
      estimatedTime: "5 min",
    },
    {
      step: 3,
      title: "Build IVR",
      description:
        "Create the menu and link the options to your primary groups.",
      actions: ["Admin > IVR"],
      helpUrl: "#",
      estimatedTime: "15 min",
    },
  ],
};
