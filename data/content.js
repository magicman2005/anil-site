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
    linkedin: "https://www.linkedin.com/in/anilmadhok/",
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
      lede: "Open a card to read the post. Every one links back to the original.",
      /* ---------------------------------------------------------------
         TO ADD A POST
         1. Open the post on LinkedIn, "..." menu, Copy link.
         2. Copy a block below, paste it at the top of this array.
         3. Fill in meta (date), title, teaser, body, tags, stat, link.
         Keep this list to SIX. Beyond that the slide stops fitting one
         viewport — retire the weakest instead of adding a seventh.
      --------------------------------------------------------------- */
      cards: [
        {
          meta: "4 Aug 2026",
          title: "I asked an agent to run a two-week content series, start to finish",
          teaser: "Not 'AI writes your posts'. An honest split of what it did well and where I still had to do the work.",
          body: [
            "I'm a Copilot Solution Engineer, not a marketer, so I wanted to see what an AI assistant could " +
            "actually do with a real piece of work — not a demo prompt, the full thing. Research it, write it, " +
            "design it, get it scheduled, then go back and check whether it worked. Ten posts, two weeks.",
            "What it did: pulled from Microsoft's actual Learn docs so the content was grounded in real " +
            "features; went through several rounds of edits with me on tone and length until it sounded like " +
            "something I'd post; built the carousel decks and checked its own work for overlapping text before " +
            "showing me; and afterwards pulled the real per-post numbers — 3,091 impressions and 56 reactions " +
            "across the ten.",
            "What stood out: when I asked it to add the Microsoft and Copilot logos, it stopped and told me it " +
            "couldn't just take them off the internet — they're protected assets. It asked me to pull them from " +
            "Brand Central myself. Small thing, but that's the bit that made me trust it more than the writing did.",
            "Where I still did the work: tone, humour, and whether something would land was on me every time. " +
            "It executes direction well; it doesn't set direction. And nothing went out without me hitting the " +
            "button.",
            "Bottom line — not 'AI writes your LinkedIn posts'. More like having someone useful do the research, " +
            "drafting, design and reporting while I stayed in charge of tone, brand and anything published. That " +
            "split is what made it worth using rather than just a good demo.",
          ],
          takeaway:
            "The useful division of labour isn't human-or-agent. It's agent executes, human sets direction and owns what ships.",
          tags: ["Microsoft Scout", "Agentic AI"],
          stat: "23 reactions · 2 comments · 2 reposts",
          link: { href: "https://www.linkedin.com/feed/update/urn:li:activity:7490319123776745472/", label: "Read on LinkedIn" },
        },
        {
          meta: "27 Feb 2026",
          title: "A week at the Microsoft AI Tour",
          teaser: "Demos and leadership conversations around the Copilot Control System and Agent 365.",
          body: [
            "An amazing week began with the Microsoft AI Tour, featuring discussions and demos centred on the " +
            "M365 Copilot Control System and Agent 365 — followed by leadership conversations with customers.",
            "The Control System and Agent 365 were the two things people kept coming back to, which tracks: " +
            "once agents are real, the questions stop being about capability and start being about control.",
          ],
          tags: ["Agent 365", "M365 Copilot"],
          stat: "90 reactions · 3 comments",
          link: { href: "https://www.linkedin.com/feed/update/urn:li:activity:7433092328434712576/", label: "Read on LinkedIn" },
        },
        {
          meta: "30 Jan 2026",
          title: "Agents aren't features — they're a workforce",
          teaser: "AI everywhere doesn't equal an AI platform. Without design you get patchwork agents and shadow AI.",
          body: [
            "Four points worth repeating: AI everywhere doesn't equal an AI platform. Without design, you get " +
            "patchwork agents, accidental shadow AI and growing risk.",
            "The shift we need is from impressive demos to durable, governable digital labour. Agents aren't " +
            "features — they're a workforce. And workforces need identity, controls, intelligence and lifecycle " +
            "management by design.",
          ],
          takeaway: "If you wouldn't give a new starter system access without identity and a leaver process, don't give an agent one either.",
          tags: ["Governance", "Agent 365"],
          stat: "7 reactions · 1 repost",
          link: { href: "https://www.linkedin.com/feed/update/urn:li:activity:7422951931943239680/", label: "Read on LinkedIn" },
        },
        {
          meta: "5 Jan 2026",
          title: "Three months in as a Copilot Solution Engineer",
          teaser: "Adoption initiatives, executive workshops and governance frameworks — going beyond the licence.",
          body: [
            "Three months focused on driving customer success through AI-powered transformation: partnering " +
            "with financial services clients to accelerate M365 Copilot and Copilot Studio use cases; executive " +
            "workshops aligning priorities, shaping deployment strategies and enabling enterprise-grade " +
            "governance frameworks.",
            "Plus thought leadership on prompt engineering, governance models and reusable libraries — and " +
            "working through 150-plus Ignite announcements.",
            "Going into 2026 the theme is the same one that keeps proving itself: going beyond the licence.",
          ],
          takeaway: "Deployment is the easy half. Adoption, governance and demonstrated value are the half that decides whether it lasts.",
          tags: ["M365 Copilot", "Financial Services"],
          stat: "61 reactions · 2 comments",
          link: { href: "https://www.linkedin.com/feed/update/urn:li:activity:7413880568569942017/", label: "Read on LinkedIn" },
        },
        {
          meta: "1 Oct 2025",
          title: "Seven years in banking, and a new chapter",
          teaser: "Moving from seven years embedded at a UK bank to Copilot Solution Engineer at Microsoft.",
          body: [
            "After seven years supporting Barclays Bank, I moved into a new role as a Copilot Solution Engineer " +
            "at Microsoft.",
            "Driving Microsoft solutions across the bank over those years was genuinely rewarding, and it's the " +
            "grounding I bring to this work now — what regulated enterprise adoption actually looks like from " +
            "the inside, rather than from a deck.",
          ],
          takeaway: "Time spent inside a regulated customer is the difference between advising on governance and having lived it.",
          tags: ["Career", "Financial Services"],
          stat: "200 reactions · 29 comments",
          link: { href: "https://www.linkedin.com/feed/update/urn:li:activity:7379062526048677888/", label: "Read on LinkedIn" },
        },
        {
          meta: "25 Jul 2025",
          title: "Moments that matter",
          teaser: "Ten years at Microsoft, a 100,000-seat Copilot rollout, and a Circle of Excellence Gold Club award.",
          body: [
            "Twelve months of pivotal moments: a ten-year anniversary at Microsoft, a 100,000-colleague " +
            "Microsoft 365 Copilot implementation, a 25th wedding anniversary — and Liverpool securing the " +
            "Premier League title for the 20th time.",
            "And being named a Circle of Excellence Gold Club winner at Microsoft. That recognition is a " +
            "professional milestone, but mostly it highlights the team I get to work alongside every day.",
            "Thanks to the leadership and sponsors, and to the people who shaped the journey — Dean for taking " +
            "me under his wing when I joined, Simon and Gerry for being outstanding managers, and Jacqui for " +
            "continued mentorship.",
          ],
          tags: ["Milestones", "Adoption at scale"],
          stat: "216 reactions · 70 comments",
          link: { href: "https://www.linkedin.com/feed/update/urn:li:activity:7354479208389087233/", label: "Read on LinkedIn" },
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
      note: "Views are my own and do not represent Microsoft. Everything here is drawn from my own public posts and published material — nothing confidential, and no non-public customer or tenant detail.",
    },

  ],
};
