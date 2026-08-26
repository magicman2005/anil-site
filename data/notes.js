/* ---------------------------------------------------------------------------
   FIELD NOTES
   Observations from deploying Copilot & agents in real tenants.

   To add one, copy a block and put it at the top of the array.
   product: "M365 Copilot" | "Cowork" | "Microsoft Scout" | "Copilot Studio"
            | "Agent 365" | "Governance"
--------------------------------------------------------------------------- */

window.NOTES = [
  {
    product: "M365 Copilot",
    date: "2026-08",
    title: "Entitlement is not adoption, and the admin centre won't tell you",
    body:
      "The usage reports answer 'who has a licence' far better than they answer 'who is getting value'. " +
      "The honest signal sits in the audit log: distinct users, interactions per user, which surface they " +
      "came in through. I've seen a tenant look almost dormant in one view and show four figures of real " +
      "interactions in another — same tenant, same week.",
    takeaway:
      "Instrument at the interaction layer before you write the adoption story. Reports for trends, audit logs for truth.",
  },
  {
    product: "M365 Copilot",
    date: "2026-07",
    title: "Grounding quality is a content-hygiene problem wearing an AI costume",
    body:
      "Nearly every 'Copilot gave a bad answer' escalation I've worked ended somewhere unglamorous: a " +
      "site with broken permissions, a decade of duplicate decks, a label applied to the wrong library. " +
      "The model is doing exactly what it was told with exactly what it can see.",
    takeaway:
      "Oversharing and stale content are now user-facing defects. Fix the estate before you tune the prompt.",
  },
  {
    product: "M365 Copilot",
    date: "2026-06",
    title: "The first ninety days are a habit problem, not a capability problem",
    body:
      "Capability lands on day one. Habit doesn't. The teams that stick are the ones who attached Copilot " +
      "to something they already do every week — the status update, the meeting recap, the bid response — " +
      "rather than waiting for a moment of inspiration.",
    takeaway:
      "Pick three recurring rituals per team and make Copilot the default way to do them. Breadth later.",
  },
  {
    product: "Cowork",
    date: "2026-08",
    title: "Agentic sessions produce artifacts, not transcripts — and that changes review",
    body:
      "A long Cowork session doesn't end with an answer you skim. It ends with files: a deck, a working " +
      "prototype, a set of reports. That's genuinely more useful, and it quietly moves the bottleneck from " +
      "'can it do the work' to 'can a human review the volume of work it just did'.",
    takeaway:
      "Budget review capacity, not just seats. Ask what the acceptance check is before you start the session.",
  },
  {
    product: "Cowork",
    date: "2026-07",
    title: "Output outruns your ability to find it again",
    body:
      "After a few weeks of real use I had hundreds of generated artifacts across dozens of session folders " +
      "and no index. The work was good. Locating the right version of it three weeks later was the problem.",
    takeaway:
      "Add a librarian step from day one: one page that indexes what was produced, when, and why it exists.",
  },
  {
    product: "Microsoft Scout",
    date: "2026-08",
    title: "The unit of automation moves from 'prompt' to 'recurring job'",
    body:
      "Once an agent sits on the desktop with real tools — files, shell, browser, Graph — the interesting " +
      "question stops being 'what can I ask it' and becomes 'what should it do every morning at seven " +
      "without me'. Inbox triage, account refreshes, dashboard rebuilds. That's a different design exercise.",
    takeaway:
      "Design for unattended runs: explicit inputs, idempotent output, and a clear failure mode when a source is unavailable.",
  },
  {
    product: "Microsoft Scout",
    date: "2026-07",
    title: "Skills beat prompts, because context shouldn't be retyped",
    body:
      "Re-explaining how you work at the start of every session is a tax. Encoding it once — the folder " +
      "conventions, the tone, the approval steps, the people who matter — turns a capable assistant into " +
      "one that's actually yours. The gains compound in a way single prompts never do.",
    takeaway:
      "Write the skill the second time you explain something. Version it like code, because it is code.",
  },
  {
    product: "Copilot Studio",
    date: "2026-06",
    title: "Most 'we need an agent' requests are retrieval plus a workflow",
    body:
      "Strip the ask back and it's usually: find the right document, apply a rule, update a system of record, " +
      "tell someone. That's a very solvable shape — but it's a different build depending on whether it belongs " +
      "in the Copilot front door, in Studio, or in neither.",
    takeaway:
      "Choose the surface before you build. A declarative agent you ship in a week beats a custom engine you demo in a quarter.",
  },
  {
    product: "Copilot Studio",
    date: "2026-05",
    title: "Knowledge sources are where these projects are won or lost",
    body:
      "Topics, orchestration and prompt engineering get the attention. In practice the delta between a " +
      "convincing agent and an embarrassing one is almost always the quality, scoping and freshness of what " +
      "it was pointed at.",
    takeaway:
      "Spend the first sprint on the knowledge boundary. Curate a small, correct corpus over a large, plausible one.",
  },
  {
    product: "Agent 365",
    date: "2026-08",
    title: "Treat agents as workforce, not features",
    body:
      "The moment an agent can act on your behalf, the questions become HR questions: who owns it, what is it " +
      "allowed to touch, how do we see what it did, and how do we retire it. Those aren't answerable from a " +
      "maker portal — they need identity, lifecycle and supervision.",
    takeaway:
      "Give every agent an owner, an identity and an off-switch on day one. Retrofitting governance is far more expensive.",
  },
  {
    product: "Governance",
    date: "2026-07",
    title: "Knowing which model answered is becoming a compliance question",
    body:
      "As routing spreads across model families and providers, 'the AI said so' stops being a sufficient audit " +
      "trail. Regulated customers increasingly want the same answer they'd expect of any other processor: which " +
      "system handled this, under what terms, and can you show me.",
    takeaway:
      "Capture model attribution alongside the interaction. It's a five-minute report today and a mandatory one soon.",
  },
  {
    product: "Governance",
    date: "2026-06",
    title: "The AI control plane most rollouts skip",
    body:
      "Purview's AI posture and risk tooling tends to get scheduled for 'phase two'. Then phase one goes well, " +
      "usage grows, and someone senior asks a question about sensitive-data exposure that nobody can answer " +
      "with evidence.",
    takeaway:
      "Stand up AI posture management in the pilot, while the estate is small enough to actually remediate.",
  },
];
