// Valley Station retail flip (sold July 2026). Figures approved by Paul for
// on-screen use. On-screen rules: neighborhood only (never the street
// address), no seller name, no profit / ROI / spread anywhere.

export const deal = {
  area: "Valley Station",
  facts: "1960 ranch · 1 bath · 1,000 sq ft",
  verdict: "BUY",
  arv: 212_500,
  maxOffer: 133_400,
  offer: 132_000,
  rehabTotal: 25_831,
  rent: 1_755,
  comps: { count: 13, radiusMi: 1, months: 18, confidence: "High", score: 78 },
  strategiesScored: 6,
} as const;

// Seller prep brief, generic wording only.
export const brief = {
  ownedYears: 10.6,
  occupancy: "Vacant",
  motivation: "Tired landlord",
  portfolio: "Owns 2 properties",
  liens: "No liens on record",
  edge: "Time and carry cost are working against them.",
  openingMove:
    "It sounds like carrying this any longer is not something you want to do.",
  pitch: "Frame the offer as a clean exit, not just a price.",
} as const;

// ILLUSTRATIVE line items. No itemized estimate exists for this deal in the
// system, only the $25,831 total. Labels follow the script and deal notes
// (paint, flooring, HVAC repair); dollar splits are placeholders that sum to
// the real total. Replace with the real scope if one turns up.
export type RehabLine = {
  said: string; // what Paul says on the walkthrough
  label: string;
  amount: number;
  corrected?: { from: string; fromAmount: number; said: string }; // "I fix what it gets wrong"
};

export const rehab: RehabLine[] = [
  { said: "Roof's fine.", label: "Roof — no work", amount: 0 },
  { said: "Kitchen's shot.", label: "Kitchen — full replace", amount: 9_800 },
  {
    said: "Bathroom needs a new shower pan.",
    label: "Bath — shower pan + vanity",
    amount: 3_400,
  },
  {
    said: "Floors throughout.",
    label: "Flooring — LVP, 1,000 sq ft",
    amount: 4_600,
    corrected: {
      from: "Flooring — carpet, bedrooms",
      fromAmount: 2_900,
      said: "Not carpet. LVP everywhere.",
    },
  },
  { said: "Paint it all.", label: "Interior paint", amount: 3_200 },
  { said: "Furnace needs service.", label: "HVAC — service + repair", amount: 1_450 },
  { said: "Lights and outlets.", label: "Electrical — fixtures", amount: 1_250 },
  { said: "Gutters, trim, cleanup.", label: "Exterior + misc", amount: 2_131 },
];

// Deal board: neighborhood-level cards shaped like the live pipeline.
// ARV only; never profit.
export type BoardCard = { area: string; arv: number; tag: string; stale?: boolean };
export const board: { stage: string; count: number; cards: BoardCard[] }[] = [
  {
    stage: "Lead",
    count: 4,
    cards: [
      { area: "Vine Grove", arv: 395_000, tag: "Assignment" },
      { area: "Beechmont", arv: 224_500, tag: "Wholetail", stale: true },
      { area: "Okolona", arv: 275_000, tag: "Retail flip" },
    ],
  },
  {
    stage: "Follow-up",
    count: 41,
    cards: [
      { area: "Fern Creek", arv: 340_000, tag: "Wholetail" },
      { area: "Clarksville, IN", arv: 215_000, tag: "Retail flip" },
      { area: "New Albany, IN", arv: 215_000, tag: "Wholetail" },
      { area: "Okolona", arv: 235_000, tag: "Retail flip" },
    ],
  },
  {
    stage: "Offer",
    count: 4,
    cards: [
      { area: "Mount Washington", arv: 235_000, tag: "Assignment" },
      { area: "Jeffersonville, IN", arv: 224_754, tag: "Rental" },
      { area: "Iroquois", arv: 225_000, tag: "Retail flip", stale: true },
    ],
  },
  {
    stage: "Under contract",
    count: 2,
    cards: [
      { area: "Shively", arv: 160_000, tag: "Wholetail" },
      { area: "Beechmont", arv: 182_550, tag: "Retail flip" },
    ],
  },
  {
    stage: "Pending",
    count: 3,
    cards: [
      { area: "Mount Washington", arv: 215_000, tag: "Retail flip" },
      { area: "Lyndon", arv: 285_000, tag: "Rental" },
    ],
  },
  {
    stage: "Sold",
    count: 3,
    cards: [
      { area: "Valley Station", arv: 212_500, tag: "Retail flip" },
      { area: "Beechmont", arv: 175_000, tag: "Retail flip" },
    ],
  },
];

export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
