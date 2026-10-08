# investor-day-video

Production repo for the **AI Investor Day** short: one real day of Paul's
(seller call → underwrite → walkthrough → kitchen-table offer → office →
home by 5:30), told through the tools he actually uses. It is not a product ad.

This repo holds everything that is **built, not generated**: the readvise
screen recreations, the text overlays, and a 75-second animatic at script
timing. AI footage (Veo / Runway / Grok Imagine) is generated elsewhere and
composited over the green screens in the edit.

Built with [Remotion](https://www.remotion.dev) (React → video).

## Commands

```bash
npm i
npm run dev              # Remotion Studio, scrub every composition
npm run lint             # eslint + tsc
npm run render:animatic  # out/Animatic.mp4 (1080×1920, 75 s)
npm run render:plates    # out/plates/*.mp4 (screen replacements)
npm run render:overlays  # out/overlays/*.mov (ProRes 4444, transparent)
npm run render:all
```

Fonts (Geist, OFL) are bundled in `public/fonts`, so renders need no network.

## What's in here

| Composition | Size | Script beat | Use in the edit |
| --- | --- | --- | --- |
| `Animatic` | 1080×1920 | whole piece, 0:00–1:15 | Timing review with burned-in VO captions. Truck photos stand in for 1A/7A, labelled panels for AI shots not made yet. |
| `S2-Underwrite` | 1080×2340 | 2A/2B, 0:05–0:14 | Phone plate: "Underwrite this address." → ARV, max offer, BUY |
| `S3-Brief` | 1080×2340 | 3A, 0:14–0:22 | Phone plate: seller brief read in the driveway |
| `S4-Rehab` | 1080×2340 | 4C, 0:22–0:40 | Phone plate: rehab builds line by line from what Paul says; one line gets corrected |
| `S6A-DealBoard` | 1920×1080 | 6A, 0:52–0:58 | Monitor plate: pipeline board, one card moves to Under contract |
| `S6B-FollowUp` | 1080×2340 | 6B, 0:58–1:04 | Phone plate: one instruction → text sent + plumber on the calendar |
| `O1-TimeAM`, `O7-TimePM` | 1080×1920 α | 1, 7 | "7:40 AM" / "5:30 PM" chapter stamps |
| `O5-Offer` / `O5-Offer-NoDollars` | 1080×1920 α | 5A, 0:40–0:52 | The offer over the kitchen-table shot, with or without the number |
| `O7-CTA` | 1080×1920 α | 7A, 1:04–1:15 | "What would you hand off first?" |

Phone plates are 19.5:9 (iPhone screen ratio) so they corner-pin straight onto
the flat-green phone screens in the generated shots.

## Data rules (read before editing `src/data/valleyStation.ts`)

- Deal: **Valley Station** retail flip, sold July 2026. Paul approved dollar
  figures on screen: ARV $212,500, max offer $133,400, rehab $25,831,
  offer $132,000.
- **Never on screen:** street address, seller name, lead source, deal ids,
  profit / ROI / spread / cash flow.
- **Rehab line items are illustrative.** The system holds only the $25,831
  total for this deal, not an itemized scope. Labels follow the script and the
  deal notes (paint, flooring, HVAC); the dollar split is a placeholder that
  sums to the real total. Swap in the real scope if one turns up.
- Deal-board cards are neighborhood-level and shaped like the live pipeline
  (ARV and strategy only).

## The truck (real, not generated)

Paul's truck is a signature, so use real footage or real photos as references
rather than letting a model invent it. Reference photos are in `public/truck/`
(EXIF/GPS stripped; house number and dumpster lettering cropped out of
`front-driveway-crop.jpg`).

What it actually looks like, for every prompt that includes it:

> **TRUCK:** Tesla Cybertruck with a **matte dark navy / charcoal wrap**, flat
> angular panels, thin full-width light bar across the front, black octagonal
> aero wheel covers on all-terrain tires, small dark US-flag decal behind the
> front wheel, no visible license plate. Lived-in, a little road dust, not
> showroom.

Corrections to the draft shot list:

- **No stainless.** It's wrapped matte dark. Prompts that say "brushed
  steel" will produce the wrong truck.
- **Badging:** add "except the vehicle's own badging" to the no-logos
  negative, or frame away from the tailgate.
- **Interior (1A, 2A, 2B):** there is no instrument cluster, just one large
  center touchscreen and a squared-off yoke-style wheel. Put the phone in a
  mount near the center screen.
- **7A:** there's no key fob. Paul walks up and the light bar wakes as he
  approaches.
- **Shoot these for real on a phone (cheap, best-looking shots in the
  piece):** dawn light-bar wake, rolling past at morning light, parked in a
  driveway, golden-hour lot (the `golden-hour-lot.jpg` setup is perfect for
  7A), and the **frunk full of tools** (`frunk-tools.jpg`), which tells the
  "I still walk every house" story with no words.
- Watch for house numbers in real driveway shots; the original driveway photo
  had one on the siding.
