/* ---------------------------------------------------------------------------
   BUILDS — things shipped, not slideware.
   Keep these public-safe: no customer names, no tenant specifics.
--------------------------------------------------------------------------- */

window.BUILDS = [
  {
    name: "Copilot model transparency reporting",
    kind: "Governance tooling",
    body:
      "A weekly report that answers a question regulated customers keep asking: which model, from which " +
      "provider, handled each Copilot prompt. Built on audit-log model attribution and paired with Purview " +
      "AI posture, communication compliance and retention.",
    stack: ["Purview", "Audit logs", "M365 Copilot"],
  },
  {
    name: "Modern workforce dashboard",
    kind: "Analytics",
    body:
      "An interactive view for an IT leader in an all-Microsoft estate: service health, active users, licence " +
      "utilisation, Copilot and agent usage, and the consumption costs that arrive with them — in one place " +
      "rather than five portals.",
    stack: ["Graph", "Power BI", "Sentinel"],
  },
  {
    name: "Agent-refreshed account intelligence",
    kind: "Agentic automation",
    body:
      "A dashboard that rebuilds itself every morning. An agent sweeps mail, meetings, chat and CRM signals, " +
      "writes deltas into a single page, and flags what changed since yesterday — so preparation stops being " +
      "a manual archaeology exercise.",
    stack: ["Microsoft Scout", "Graph", "Dynamics"],
  },
  {
    name: "Mission control",
    kind: "Internal tooling",
    body:
      "One page that indexes every automation, dashboard, demo and shortcut I run. Built after realising the " +
      "real cost of agentic output isn't producing it — it's finding it again three weeks later.",
    stack: ["Microsoft Scout", "HTML"],
  },
  {
    name: "Copilot usage simulation harness",
    kind: "Demo engineering",
    body:
      "A generator that drives realistic Copilot and agent traffic through a demo tenant, so usage analytics, " +
      "audit trails and governance tooling can be demonstrated against data that behaves like the real thing.",
    stack: ["Graph", "Copilot", "Automation"],
  },
];
