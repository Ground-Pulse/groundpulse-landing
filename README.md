# GroundPulse — landing page

The public marketing page for GroundPulse. Static HTML, CSS and vanilla JS — no
build step, no dependencies, no framework.

```
.
├── index.html    # page structure and all copy
├── styles.css    # design tokens + layout
├── script.js     # the hero record's approve/decline interaction
└── vercel.json   # clean URLs on deploy
```

## Run it

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

## Design notes

**The hero is the product.** Instead of a headline over feature cards, the hero
renders a real inspection record for a Pune flat. Two items are flagged; opening
one shows the inspector's note, the attached photos and the owner's
approve/decline decision. Approving walks the repair through the same four
stages the product's real tracker uses (`Requested → Assigned → In progress →
Completed`). This is Priya's journey from the BRD in [GroundPulse-App/GroundPulse](https://github.com/GroundPulse-App/GroundPulse), playable in about
five seconds.

**The accent colours are the product's own statuses.** Nothing is coloured
decoratively:

| Token      | Value     | Meaning                            |
| ---------- | --------- | ---------------------------------- |
| `--pass`   | `#2c6a50` | `PASS` checklist status, and CTAs  |
| `--attn`   | `#b5761f` | `ATTENTION` checklist status       |
| `--fail`   | `#9e3325` | `FAIL` checklist status            |
| `--leak`   | `#2f6d8c` | `LEAK` issue category              |
| `--ink`    | `#13202c` | structure — hero, proof, footer    |
| `--paper`  | `#fbfaf8` | page                               |

**Type.** Archivo for display and interface, Source Serif 4 for body copy —
inverting the usual serif-headline pairing. Timestamps and record IDs use
Archivo Narrow with tabular figures rather than a monospace face.

**Motion** only ever answers a click. There are no scroll-triggered entrances.
`prefers-reduced-motion` skips straight to the resolved state.

## Placeholders to replace

- Inspector photos in the hero record are CSS gradients, deliberately abstract
  rather than fake stock imagery. Swap `.photo-a` through `.photo-d` for real
  media once the S3 upload path is live.
- Every CTA points at `#start`. Wire them to the auth routes once the app frontend exists.

## Accessibility

Flagged rows are real `<button>`s with `aria-expanded` and `aria-controls`.
Focus is visible throughout, the roles table degrades to labelled blocks under
720px, and colour is never the only carrier of a status — each one is also
written out.
