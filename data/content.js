/* ===========================================================================
   DECK CONTENT
   ---------------------------------------------------------------------------
   Everything on screen comes from this file. You never edit markup.

   A slide looks like:
     {
       id:    "cowork",              // used for the #hash and digit jump
       kind:  "cards",               // home | statement | cards | connect
       label: "Cowork",              // progress-dot tooltip
       hue:   192,                   // signature colour, 0-360. Drives DOM + 3D scene.
       scene: "helix",               // sphere | grid | helix | wave | ring | scatter
       kicker / title / lede         // slide headline block
       cards: [ ... ]                // each card opens a modal
     }

   A card looks like:
     {
       meta:    "Aug 2026",          // small monospace line
       title:   "Card headline",
       teaser:  "One or two lines shown on the card face.",
       body:    ["Paragraph one.", "Paragraph two."],   // modal body
       takeaway:"The so-what line.",                     // optional
       tags:    ["Governance"],                          // optional
       link:    { href:"https://...", label:"Read on LinkedIn" }  // optional
     }
   =========================================================================== */

window.DECK = {

  profile: {
    name: "Anil Madhok",
    role: "Solution Engineer",
    org: "AI Business Solutions · Microsoft",
    email: "anilh@microsoft.com",
    linkedin: "", // ← paste your LinkedIn profile URL
  },

  slides: [

    /* ── 0 ───────────────────────────────────────────────── */
    {
      id: "home",
      kind: "home",
      label: "Home",
      hue: 210,
      scene: "sphere",
      kicker: "Microsoft 365 Copilot · Cowork · Scout · Copilot Studio",
      title: "What actually happens\nafter you turn it on.",
      lede:
        "I put Copilot and agents into real tenants, then write down the part that isn't " +
        "in the deck — what worked, what broke, and what the demo quietly skipped.",
      cards: [
        {
          meta: "01",
          title: "Microsoft 365 Copilot",
          teaser: "Rollout, grounding quality, and why entitlement is not adoption.",
          body: [
            "The surface most people mean when they say 'Copilot' — and the one where the gap between a " +
            "successful pilot and a successful rollout is widest.",
            "Three patterns dominate: measurement that flatters, content estates that quietly sabotage " +
            "grounding, and the ninety-day window where a capability either becomes a habit or becomes shelfware.",
          ],
          takeaway: "Instrument honestly, fix the estate, and attach it to rituals people already have.",
          go: "m365",
          hue: 210,
        },
        {
          meta: "02",
          title: "Cowork",
          teaser: "Agentic sessions produce artifacts, not transcripts. Review is the new bottleneck.",
          body: [
            "Cowork changes the shape of the output. You don't get an answer to skim, you get files — a deck, " +
            "a prototype, a set of reports.",
            "That's a genuine step change in usefulness, and it relocates the constraint. Generation stops " +
            "being the hard part; reviewing and finding the output becomes it.",
          ],
          takeaway: "Plan for review capacity and an index, not just licences.",
          go: "cowork",
          hue: 186,
        },
        {
          meta: "03",
          title: "Microsoft Scout",
          teaser: "When the unit of automation moves from a prompt to a recurring job.",
          body: [
            "An agent with real tools on the desktop — files, shell, browser, Graph — stops being a better " +
            "chat window and starts being a scheduled worker.",
            "The design discipline it demands borrows far more from unattended jobs than from prompting: " +
            "stable inputs, idempotent output, and a sane failure mode.",
          ],
          takeaway: "Durable skills beat clever prompts, because context shouldn't be retyped.",
          go: "scout",
          hue: 28,
        },
        {
          meta: "04",
          title: "Copilot Studio",
          teaser: "Surface selection and knowledge boundaries decide these projects.",
          body: [
            "Most agent requirements turn out to be retrieval plus a workflow. That's a solvable shape — but " +
            "it isn't surface-neutral, and choosing the surface late is expensive.",
            "Once you're building, the quality delta is almost never orchestration. It's the corpus.",
          ],
          takeaway: "Decide the surface in an afternoon; spend the first sprint on the knowledge boundary.",
          go: "studio",
          hue: 272,
        },
        {
          meta: "05",
          title: "Written in public",
          teaser: "Posts on rollout reality, agent governance, and capability versus habit.",
          body: [
            "Longer-form thinking, published as it happens. Usually something that surprised me during a " +
            "deployment, written down before I forget why it was surprising.",
            "Open the Posts slide to read them in full.",
          ],
          go: "posts",
          hue: 160,
        },
      ],
    },

    /* ── 1 ───────────────────────────────────────────────── */
    {
      id: "m365",
      kind: "cards",
      label: "M365 Copilot",
      hue: 210,
      scene: "grid",
      kicker: "Field notes",
      title: "Microsoft 365 Copilot",
      lede: "Three things I keep having to say twice.",
      cards: [
        {
          meta: "Aug 2026",
          title: "Entitlement is not adoption, and the admin centre won't tell you",
          teaser: "The honest signal isn't in the usage report. It's in the audit log.",
          body: [
            "The usage reports answer 'who has a licence' far better than they answer 'who is getting value'. " +
            "The honest signal sits in the audit log: distinct users, interactions per user, and which surface " +
            "people actually came in through.",
            "I've seen a tenant look almost dormant in one view and show four figures of real interactions in " +
            "another — same tenant, same week. Both numbers were technically correct. Only one of them described " +
            "what was happening.",
          ],
          takeaway:
            "Instrument at the interaction layer before you write the adoption story. Reports for trends, audit logs for truth.",
          tags: ["Measurement", "Adoption"],
        },
        {
          meta: "Jul 2026",
          title: "Grounding quality is a content-hygiene problem wearing an AI costume",
          teaser: "Every bad-answer escalation I've worked ended somewhere unglamorous.",
          body: [
            "Nearly every 'Copilot gave a bad answer' escalation ends in the same places: a site with broken " +
            "permissions, a decade of duplicate decks, a sensitivity label applied to the wrong library.",
            "The model is doing exactly what it was told with exactly what it can see. Oversharing and stale " +
            "content used to be an abstract governance concern. They are now a user-facing defect that anyone " +
            "in the business can trip over in a single prompt.",
          ],
          takeaway: "Fix the estate before you tune the prompt. Content hygiene is now product quality.",
          tags: ["Grounding", "Purview"],
        },
        {
          meta: "Jun 2026",
          title: "The first ninety days are a habit problem, not a capability problem",
          teaser: "The teams that stick attached Copilot to something they already did weekly.",
          body: [
            "Capability lands on day one. Habit doesn't. The teams where it stuck were the ones who attached " +
            "Copilot to a ritual they already had — the status update, the meeting recap, the bid response — " +
            "rather than waiting for a moment of inspiration to strike.",
            "Breadth-first rollouts generate impressive licence numbers and disappointing usage curves. " +
            "Depth-first rollouts look slower on the slide and compound in a way the other never does.",
          ],
          takeaway: "Pick three recurring rituals per team and make Copilot the default way to do them. Breadth later.",
          tags: ["Adoption", "Change"],
        },
      ],
    },

    /* ── 2 ───────────────────────────────────────────────── */
    {
      id: "cowork",
      kind: "cards",
      label: "Cowork",
      hue: 186,
      scene: "helix",
      kicker: "Field notes",
      title: "Cowork",
      lede: "What changes when the output is a folder, not an answer.",
      cards: [
        {
          meta: "Aug 2026",
          title: "Agentic sessions produce artifacts, not transcripts",
          teaser: "Which quietly moves the bottleneck from generation to review.",
          body: [
            "A long Cowork session doesn't end with an answer you skim. It ends with files: a deck, a working " +
            "prototype, a set of reports. That's genuinely more useful than a chat log.",
            "It also moves the bottleneck. The question stops being 'can it do the work' and becomes 'can a " +
            "human credibly review the volume of work it just did'. Almost nobody is staffing for that second one.",
          ],
          takeaway: "Budget review capacity, not just seats. Agree the acceptance check before you start the session.",
          tags: ["Review", "Operating model"],
        },
        {
          meta: "Jul 2026",
          title: "Output outruns your ability to find it again",
          teaser: "The work was good. Locating it three weeks later was the problem.",
          body: [
            "After a few weeks of real use I had hundreds of generated artifacts across dozens of session " +
            "folders and no index. Every one of them was useful at the moment it was made.",
            "The failure mode of agentic work isn't bad output. It's unfindable output — and it arrives much " +
            "faster than the filing habits of the person receiving it.",
          ],
          takeaway: "Add a librarian step on day one: one page indexing what was produced, when, and why it exists.",
          tags: ["Knowledge", "Practice"],
        },
      ],
    },

    /* ── 3 ───────────────────────────────────────────────── */
    {
      id: "scout",
      kind: "cards",
      label: "Scout",
      hue: 28,
      scene: "ring",
      kicker: "Field notes",
      title: "Microsoft Scout",
      lede: "Desktop agents, durable skills, and unattended work.",
      cards: [
        {
          meta: "Aug 2026",
          title: "The unit of automation moves from 'prompt' to 'recurring job'",
          teaser: "Not 'what can I ask it' but 'what should it do at 7am without me'.",
          body: [
            "Once an agent sits on the desktop with real tools — files, shell, browser, Graph — the interesting " +
            "question stops being 'what can I ask it' and becomes 'what should it do every morning at seven " +
            "without me'.",
            "Inbox triage, account refreshes, dashboard rebuilds. That's a genuinely different design exercise " +
            "from prompting, and it borrows far more from scheduled jobs than from chat.",
          ],
          takeaway:
            "Design for unattended runs: explicit inputs, idempotent output, and a clear failure mode when a source is unavailable.",
          tags: ["Automation", "Design"],
        },
        {
          meta: "Jul 2026",
          title: "Skills beat prompts, because context shouldn't be retyped",
          teaser: "Encode it once and a capable assistant becomes one that's actually yours.",
          body: [
            "Re-explaining how you work at the start of every session is a tax you pay forever. Encoding it " +
            "once — folder conventions, tone, approval steps, the people who matter — changes the character " +
            "of the thing entirely.",
            "The gains compound in a way single prompts never do, which is exactly why they deserve the same " +
            "treatment as code: versioned, reviewed, and improved when they're wrong.",
          ],
          takeaway: "Write the skill the second time you explain something. Version it like code, because it is code.",
          tags: ["Skills", "Practice"],
        },
      ],
    },

    /* ── 4 ───────────────────────────────────────────────── */
    {
      id: "studio",
      kind: "cards",
      label: "Copilot Studio",
      hue: 272,
      scene: "scatter",
      kicker: "Field notes",
      title: "Copilot Studio",
      lede: "Where these builds are actually won and lost.",
      cards: [
        {
          meta: "Jun 2026",
          title: "Most 'we need an agent' requests are retrieval plus a workflow",
          teaser: "A very solvable shape — but a different build depending on the surface.",
          body: [
            "Strip the ask back and it's usually: find the right document, apply a rule, update a system of " +
            "record, tell someone. That's a well-understood shape.",
            "What it isn't is surface-neutral. The same requirement belongs in the Copilot front door, in " +
            "Studio, or in neither — and teams routinely start building before they've made that call, then " +
            "spend a quarter discovering they chose wrong.",
          ],
          takeaway:
            "Choose the surface before you build. A declarative agent you ship in a week beats a custom engine you demo in a quarter.",
          tags: ["Architecture", "Delivery"],
        },
        {
          meta: "May 2026",
          title: "Knowledge sources are where these projects are won or lost",
          teaser: "The delta is almost never orchestration. It's what you pointed it at.",
          body: [
            "Topics, orchestration and prompt engineering get the attention in every design session. In " +
            "practice, the difference between a convincing agent and an embarrassing one is the quality, " +
            "scoping and freshness of its knowledge.",
            "A small correct corpus beats a large plausible one every time, and it's far cheaper to defend " +
            "when someone senior asks where an answer came from.",
          ],
          takeaway: "Spend the first sprint on the knowledge boundary, not the orchestration graph.",
          tags: ["Knowledge", "Quality"],
        },
        {
          meta: "Aug 2026",
          title: "The moment an agent can act for you, it becomes an HR question",
          teaser: "Who owns it, what can it touch, how do we see what it did, how do we retire it.",
          body: [
            "The questions that matter about an acting agent are not maker-portal questions. They're identity, " +
            "lifecycle and supervision questions — the same ones any organisation already asks about people " +
            "with system access.",
            "Retrofitting that after a successful pilot is dramatically more expensive than building it in " +
            "while the estate is small — and it's the difference between a governance team saying 'yes' and " +
            "saying 'not yet'.",
          ],
          takeaway: "Give every agent an owner, an identity and an off-switch on day one.",
          tags: ["Agent 365", "Governance"],
        },
      ],
    },

    /* ── 5 ───────────────────────────────────────────────── */
    {
      id: "posts",
      kind: "cards",
      label: "Posts",
      hue: 160,
      scene: "wave",
      kicker: "From LinkedIn",
      title: "Written in public",
      lede: "Open a card to read the full post.",
      /* ---------------------------------------------------------------
         TO ADD A POST: copy a block, paste at the top, fill in the
         fields. Set link.href to the LinkedIn permalink — until you do,
         the card shows "Link coming soon" instead of a dead link.
      --------------------------------------------------------------- */
      cards: [
        {
          meta: "18 Aug 2026",
          title: "Your Copilot usage report and your audit log disagree",
          teaser: "Only one of them is right. Here's how to tell which.",
          body: [
            "Spent a week reconciling two views of the same tenant. One suggested almost nobody was using " +
            "Copilot. The other showed a thousand-plus interactions and a healthy spread of agent traffic.",
            "Here's how to work out which number belongs in front of your leadership team — and why the " +
            "difference isn't a data quality bug, it's two tools answering two different questions.",
          ],
          tags: ["M365 Copilot", "Governance"],
          link: { href: "", label: "Read on LinkedIn" },
        },
        {
          meta: "4 Aug 2026",
          title: "I let an agent run my mornings for a month",
          teaser: "Some of it was transformative. Some I switched off within a week.",
          body: [
            "Inbox triage, account refreshes, a dashboard rebuild at 7am, unattended. A month in, the pattern " +
            "in what survived was clearer than I expected.",
            "The jobs that stuck had a stable input and an obvious failure mode. The ones I killed needed me " +
            "to check them, which meant they'd never really been automated at all.",
          ],
          tags: ["Microsoft Scout", "Adoption"],
          link: { href: "", label: "Read on LinkedIn" },
        },
        {
          meta: "21 Jul 2026",
          title: "Nobody's blocker is the model. It's the SharePoint estate.",
          teaser: "Grounding quality is content hygiene, and it's finally visible to end users.",
          body: [
            "Every 'Copilot gave a bad answer' conversation I've had this year ended in permissions, duplicates " +
            "or labels.",
            "The uncomfortable part is that none of this is new. It's just that the consequences used to be " +
            "invisible, and now anyone in the business can surface them in a single prompt.",
          ],
          tags: ["M365 Copilot", "Governance"],
          link: { href: "", label: "Read on LinkedIn" },
        },
        {
          meta: "7 Jul 2026",
          title: "Declarative agent or custom engine? Four questions.",
          teaser: "Most teams build before they've picked a surface, then discover they chose wrong.",
          body: [
            "Four questions get you to the right surface in an afternoon instead of a quarter: where does the " +
            "user already are, who owns the knowledge, does it need to act, and what has to be auditable.",
            "None of them are about the technology. All of them determine it.",
          ],
          tags: ["Copilot Studio", "M365 Copilot"],
          link: { href: "", label: "Read on LinkedIn" },
        },
        {
          meta: "23 Jun 2026",
          title: "Cowork doesn't give you answers. It gives you a folder full of work.",
          teaser: "A bigger shift than it sounds, and almost nobody is staffing for it.",
          body: [
            "The bottleneck stops being generation and becomes review. That's a genuinely good problem, but " +
            "it's still a problem, and it lands on people who weren't warned it was coming.",
            "Teams that plan the acceptance check up front get value immediately. Teams that don't end up with " +
            "an impressive backlog of unread output.",
          ],
          tags: ["Cowork"],
          link: { href: "", label: "Read on LinkedIn" },
        },
        {
          meta: "9 Jun 2026",
          title: "The moment an agent can act for you, it becomes an HR problem",
          teaser: "Identity, lifecycle and supervision questions — not maker-portal questions.",
          body: [
            "Who owns it, what can it touch, how do we see what it did, how do we retire it.",
            "Every organisation already has answers to these questions for people. Very few have noticed they " +
            "now need the same answers for software that acts on someone's behalf.",
          ],
          tags: ["Agent 365", "Governance"],
          link: { href: "", label: "Read on LinkedIn" },
        },
      ],
    },

    /* ── 6 ───────────────────────────────────────────────── */
    {
      id: "connect",
      kind: "connect",
      label: "Connect",
      hue: 210,
      scene: "sphere",
      kicker: "Connect",
      title: "I'd rather show you\nthan tell you.",
      lede:
        "I work in AI Business Solutions at Microsoft, helping enterprise customers move Copilot and " +
        "agents from an impressive demo to something that runs every day and holds up under scrutiny.",
      note: "Views are my own and do not represent Microsoft. Nothing here contains customer or tenant-specific information.",
    },

  ],
};
