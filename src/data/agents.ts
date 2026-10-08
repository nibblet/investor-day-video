// Agent beats for script v2, taken from the real readvise ledger
// (readvise_list_agent_actions, the suggested-task lane and notes,
// 2026-09-24 → 10-08). Rewritten only to strip names, addresses, title and
// brokerage names. Never put a buyer, seller or tenant name here.

import type { TaskState } from "../components/readvise";

export type AgentCard = {
  agent: string;
  label: string;
  state: TaskState;
  place?: string;
  note?: string;
};

// Scene 0 · 6:40 AM morning brief.
export const morningBrief: AgentCard[] = [
  { agent: "CMO", label: "Newsletter scheduled through the 19th", state: "done", note: "3 issues queued in Beehiiv" },
  { agent: "COO", label: "Electrician booked for punch items 4, 6, 7", state: "done", place: "North Vernon, IN" },
  { agent: "Chief of Staff", label: "Follow up on at-risk deal", state: "suggested", place: "Shively", note: "Under contract, no contract date recorded" },
  { agent: "Chief of Staff", label: "Follow up on at-risk deal", state: "suggested", place: "Beechmont", note: "No activity in 10 days (lead limit is 7)" },
  { agent: "Chief of Staff", label: "Follow up on at-risk deal", state: "suggested", place: "South Louisville", note: "Under contract, no contract date recorded" },
];

// Scene 4 · background tray while Paul walks the house.
export const backgroundTray: { agent: string; working: string; done: string }[] = [
  { agent: "Project Manager", working: "Reading site notes…", done: "2 punch items closed from site notes" },
  { agent: "Rental Manager", working: "Reading the rent roll…", done: "Rent roll read · 3 balances to review" },
  { agent: "CFO", working: "Checking payables…", done: "Autopay card on file checked" },
];

// Scene 6 · 1:00 PM, one message from Paul updates five tasks.
export const oneMessage = {
  said: "Buyer's earnest money is in, loan approval's started. Keep the 20th.",
  place: "Mount Washington",
  changes: [
    { label: "Confirm buyer's earnest money received", from: "pending", to: "done", note: "Evidence: Paul, 1:00 PM" },
    { label: "Confirm buyer's loan application filed", from: "pending", to: "done", note: "Evidence: Paul, 1:00 PM" },
    { label: "Lock closing for Tue 10/20", from: "pending", to: "pending", note: "Updated: target kept at 10/20" },
    { label: "Crawlspace contractor: schedule + quote", from: "pending", to: "pending", note: "Updated: site visit done, quote pending" },
    { label: "Follow up on contractor quote", from: "pending", to: "pending", note: "Updated: kept open" },
  ] as { label: string; from: TaskState; to: TaskState; note: string }[],
  summary: { closed: 2, updated: 3 },
};

// Scene 8 · 5:30 PM. Nine is 10/8's real count: 5 task closes/updates,
// 3 at-risk flags, 1 Chief of Staff check.
export const endOfDay = {
  handled: 9,
  neededYou: 1,
  breakdown: [
    { n: 5, what: "tasks closed or updated, each with evidence" },
    { n: 3, what: "at-risk deals flagged for you" },
    { n: 1, what: "buyer paperwork check" },
  ],
  approval: { agent: "Social", label: "Drafted a post about today. Approve?" },
};
