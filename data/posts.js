/* ---------------------------------------------------------------------------
   LINKEDIN POSTS
   ---------------------------------------------------------------------------
   HOW TO ADD A POST (30 seconds):
     1. Open your post on LinkedIn, click the "..." menu, choose "Copy link".
     2. Copy a block below, paste it at the TOP of the array.
     3. Fill in: date, hook, excerpt, tags, url.
     4. Save. Refresh the page. Done.

   Fields
     date     "YYYY-MM-DD"  — used for sorting and display
     hook     one strong line; this is the card headline
     excerpt  2–4 sentences from the post
     tags     any of: "M365 Copilot" "Cowork" "Microsoft Scout"
                      "Copilot Studio" "Agent 365" "Governance" "Adoption"
     url      the LinkedIn post permalink
     featured true on ONE post to pin it to the top (optional)

   NOTE: the entries below are structural placeholders so the layout is real.
   Replace them with your actual posts.
--------------------------------------------------------------------------- */

window.LINKEDIN_PROFILE = "https://www.linkedin.com/in/"; // ← paste your profile URL

window.POSTS = [
  {
    date: "2026-08-18",
    hook: "Your Copilot usage report and your audit log disagree. Only one of them is right.",
    excerpt:
      "Spent a week reconciling two views of the same tenant. One suggested almost nobody was using Copilot. " +
      "The other showed a thousand-plus interactions and a healthy spread of agent traffic. Here's how to tell " +
      "which number to put in front of your leadership team.",
    tags: ["M365 Copilot", "Governance", "Adoption"],
    url: "",
    featured: true,
  },
  {
    date: "2026-08-04",
    hook: "I let an agent run my mornings for a month. Here's what actually stuck.",
    excerpt:
      "Inbox triage, account refreshes, a dashboard rebuild at 7am. Some of it was transformative, some of it " +
      "I switched off within a week. The pattern in what survived was clearer than I expected.",
    tags: ["Microsoft Scout", "Adoption"],
    url: "",
  },
  {
    date: "2026-07-21",
    hook: "Nobody's blocker is the model. It's the SharePoint estate.",
    excerpt:
      "Every 'Copilot gave a bad answer' conversation I've had this year ended in permissions, duplicates or " +
      "labels. Grounding quality is content hygiene, and content hygiene has finally become visible to end users.",
    tags: ["M365 Copilot", "Governance"],
    url: "",
  },
  {
    date: "2026-07-07",
    hook: "Declarative agent or custom engine? A decision tree that takes four questions.",
    excerpt:
      "Most teams start building before they've picked a surface, then spend a quarter discovering they chose " +
      "wrong. Four questions get you to the right answer in an afternoon.",
    tags: ["Copilot Studio", "M365 Copilot"],
    url: "",
  },
  {
    date: "2026-06-23",
    hook: "Cowork doesn't give you answers. It gives you a folder full of work.",
    excerpt:
      "That's a bigger shift than it sounds. The bottleneck stops being generation and becomes review — and " +
      "almost nobody is staffing for that.",
    tags: ["Cowork"],
    url: "",
  },
  {
    date: "2026-06-09",
    hook: "The moment an agent can act for you, it becomes an HR problem.",
    excerpt:
      "Who owns it, what can it touch, how do we see what it did, how do we retire it. These aren't maker-portal " +
      "questions. They're identity, lifecycle and supervision questions.",
    tags: ["Agent 365", "Governance"],
    url: "",
  },
];
