export const MOCK_DIAL_PLAN_MEDICAL = {
  businessContext: {
    name: "City Care Medical",
    type: "Medical",
    staffCount: 12,
    hours: "08:00-18:00",
    timezone: "Africa/Johannesburg",
  },
  dialPlan: {
    nodes: [
      {
        id: "entry",
        type: "entryPoint",
        label: "021 555 1234",
        simpleLabel: "Main Line",
      },
      {
        id: "time_check",
        type: "timeCondition",
        label: "Opening hours",
        simpleLabel: "Check Time",
        config: { openHours: "08:00-18:00" },
      },
      {
        id: "emergency_ivr",
        type: "ivr",
        label: "IVR | Emergency",
        simpleLabel: "Press 1 for Emergency",
        config: { options: ["1: Emergency", "2: Appointments", "3: Accounts"] },
      },

      // Branch 1: Emergency (goes to mobile)
      {
        id: "mobile_route",
        type: "external",
        label: "Dr. On Call (Mobile)",
        simpleLabel: "Transfer to Mobile",
        config: { number: "082 123 4567" },
      },

      // Branch 2: Appointments
      {
        id: "queue_appt",
        type: "queue",
        label: "Queue | Appointments",
        simpleLabel: "Hold for Reception",
        config: { timeout: "120s" },
      },
      {
        id: "group_reception",
        type: "callGroup",
        label: "Grp | Reception",
        simpleLabel: "Ring Receptionists",
      },

      // Branch 3: Accounts
      {
        id: "group_admin",
        type: "callGroup",
        label: "Grp | Accounts",
        simpleLabel: "Ring Accounts Team",
      },

      // Fallbacks
      {
        id: "voicemail",
        type: "voicemail",
        label: "VM | General",
        simpleLabel: "Leave message",
      },
    ],
    edges: [
      { from: "entry", to: "time_check" },
      { from: "time_check", to: "emergency_ivr", condition: "open" },
      { from: "time_check", to: "mobile_route", condition: "closed" }, // After hours -> Doctor Mobile
      { from: "emergency_ivr", to: "mobile_route", label: "Option 1" },
      { from: "emergency_ivr", to: "queue_appt", label: "Option 2" },
      { from: "emergency_ivr", to: "group_admin", label: "Option 3" },
      { from: "queue_appt", to: "group_reception" },
      { from: "group_reception", to: "voicemail", condition: "no_answer" },
      { from: "group_admin", to: "voicemail", condition: "no_answer" },
    ],
  },
  mermaidSimple: `graph TD
    entry["Main Line"] --> time_check["Check Time"]
    time_check -->|"Open"| ivr["Press 1: Emergency<br/>Press 2: Appt<br/>Press 3: Accounts"]
    time_check -->|"Closed"| mobile["Transfer to Dr. Mobile"]
    ivr -->|"1"| mobile
    ivr -->|"2"| queue["Hold for Reception"]
    ivr -->|"3"| admin["Ring Accounts"]
    queue --> reception["Ring Receptionists"]
    reception -->|"No Answer"| vm["Leave Message"]
    admin -->|"No Answer"| vm`,
  mermaidTechnical: `graph TD
    entry["Inbound: 021 555 1234"] --> time["Opening Hours | 08:00-18:00"]
    time -->|"During"| ivr["IVR | Main Menu"]
    time -->|"Outside"| mobile["External | 082 123 4567"]
    ivr -->|"Opt 1"| mobile
    ivr -->|"Opt 2"| queue["Queue | Appointments"]
    ivr -->|"Opt 3"| group_admin["Call Group | Accounts"]
    queue --> group_rec["Call Group | Reception"]
    group_rec -->|"Timeout"| vm["Voicemail | General"]`,
  features: [
    {
      id: "ivr",
      name: "IVR Menu",
      description: "Press 1, 2, 3...",
      helpUrl: "#",
      used: true,
    },
    {
      id: "queue",
      name: "Call Queue",
      description: "Hold music while waiting",
      helpUrl: "#",
      used: true,
    },
    {
      id: "mobile",
      name: "Mobile Routing",
      description: "Forward to cell phones",
      helpUrl: "#",
      used: true,
    },
    {
      id: "time",
      name: "Time Conditions",
      description: "Different routing day/night",
      helpUrl: "#",
      used: true,
    },
  ],
  voiceScripts: [
    {
      type: "ivr",
      text: "Welcome to City Care. For medical emergencies, press 1. For appointments, press 2. For accounts, press 3.",
      duration: "8s",
    },
    {
      type: "on_hold",
      text: "All our receptionists are busy helping other patients. Please hold.",
      duration: "5s",
    },
  ],
  implementationSteps: [
    {
      step: 1,
      title: "Create External Number",
      description: "Add the Doctor's mobile number as a destination",
      actions: ["Admin > External Numbers"],
      helpUrl: "#",
      estimatedTime: "2 min",
    },
    {
      step: 2,
      title: "Setup IVR",
      description: "Upload greeting and link keys 1, 2, 3",
      actions: ["Admin > IVR"],
      helpUrl: "#",
      estimatedTime: "10 min",
    },
  ],
};
