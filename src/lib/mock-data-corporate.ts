export const MOCK_DIAL_PLAN_CORPORATE = {
  businessContext: {
    name: "TechCorp Solutions",
    type: "Office",
    staffCount: 45,
    hours: "08:00-17:00",
    timezone: "Africa/Johannesburg",
  },
  dialPlan: {
    nodes: [
      {
        id: "entry",
        type: "entryPoint",
        label: "010 555 9999",
        simpleLabel: "Head Office",
      },
      {
        id: "welcome",
        type: "announcement",
        label: "Welcome Msg",
        simpleLabel: "Greeting",
      },
      {
        id: "main_ivr",
        type: "ivr",
        label: "IVR | Main",
        simpleLabel: "Main Menu",
        config: { options: ["1: Sales", "2: Support", "3: Finance"] },
      },

      // Sales Branch
      {
        id: "queue_sales",
        type: "queue",
        label: "Q | Sales",
        simpleLabel: "Sales Queue",
      },
      {
        id: "group_sales",
        type: "callGroup",
        label: "Grp | Sales Team",
        simpleLabel: "Ring Sales",
      },

      // Support Branch
      {
        id: "queue_support",
        type: "queue",
        label: "Q | Support",
        simpleLabel: "Support Queue",
      },
      {
        id: "group_support_t1",
        type: "callGroup",
        label: "Grp | Tier 1",
        simpleLabel: "Ring Tier 1",
      },
      {
        id: "group_support_t2",
        type: "callGroup",
        label: "Grp | Tier 2",
        simpleLabel: "Escalate to Tier 2",
      },

      // Fallbacks
      {
        id: "vm_general",
        type: "voicemail",
        label: "VM | General",
        simpleLabel: "General VM",
      },
    ],
    edges: [
      { from: "entry", to: "welcome" },
      { from: "welcome", to: "main_ivr" },
      { from: "main_ivr", to: "queue_sales", label: "1" },
      { from: "main_ivr", to: "queue_support", label: "2" },
      { from: "queue_sales", to: "group_sales" },
      { from: "queue_support", to: "group_support_t1" },
      {
        from: "group_support_t1",
        to: "group_support_t2",
        condition: "no_answer",
      }, // Escalation!
      { from: "group_sales", to: "vm_general", condition: "timeout" },
    ],
  },
  mermaidSimple: `graph TD
    entry["Head Office"] --> welcome["Greeting"]
    welcome --> ivr["Main Menu"]
    ivr -->|"1"| sales["Sales Queue"]
    ivr -->|"2"| support["Support Queue"]
    sales --> sales_team["Ring Sales Team"]
    support --> tier1["Ring Tier 1"]
    tier1 -->|"Busy?"| tier2["Escalate to Tier 2"]
    sales_team -->|"Busy?"| vm["Leave Message"]`,
  mermaidTechnical: `graph TD
    entry["DID: 010 555 9999"] --> msg["Announcement | Welcome"]
    msg --> ivr["IVR | Main"]
    ivr -->|"1"| q_sales["Queue | Sales"]
    ivr -->|"2"| q_support["Queue | Support"]
    q_sales --> grp_sales["Call Group | Sales"]
    q_support --> grp_t1["Call Group | Tier 1"]
    grp_t1 -->|"Timeout"| grp_t2["Call Group | Tier 2"]`,
  features: [
    {
      id: "ivr",
      name: "Multi-Level IVR",
      description: "Department routing",
      helpUrl: "#",
      used: true,
    },
    {
      id: "queue",
      name: "Multiple Queues",
      description: "Sales & Support queues",
      helpUrl: "#",
      used: true,
    },
    {
      id: "hunting",
      name: "Hunt Groups",
      description: "Tier 1 to Tier 2 escalation",
      helpUrl: "#",
      used: true,
    },
  ],
  voiceScripts: [
    {
      type: "welcome",
      text: "Thank you for calling TechCorp. Please listen carefully as our menu options have changed.",
      duration: "6s",
    },
  ],
  implementationSteps: [
    {
      step: 1,
      title: "Define Departments",
      description: "Create separate call groups for Sales, Tier 1, and Tier 2",
      actions: ["Admin > Call Groups"],
      helpUrl: "#",
      estimatedTime: "15 min",
    },
  ],
};
