# Design Review: Ruby Europe Homepage

Reviewed against: `DESIGN_BRIEF.md`
Philosophy: Brand-led functionalism with Swiss typographic discipline
Date: 2026-07-22

> Supersedes the earlier review round. Prior structural findings (navigation
> coverage, heading system, thesis rebuild) are resolved. This pass focuses on
> the fundamentals the user asked for: alignment, whitespace, spacing, contrast,
> and consistency.

## Screenshots Captured

| Screenshot                                        | Breakpoint         | Description                         |
| ------------------------------------------------- | ------------------ | ----------------------------------- |
| `screenshots/review-homepage-desktop-1280.png`    | Desktop (1280×800) | Full homepage                       |
| `screenshots/review-homepage-tablet-768.png`      | Tablet (768×1024)  | Full homepage                       |
| `screenshots/review-homepage-mobile-375.png`      | Mobile (375×812)   | Full homepage                       |
| `screenshots/review-hero-desktop-1280.png`        | Desktop (1280×800) | Hero above the fold                 |
| `screenshots/review-who-we-are-desktop-1280.png`  | Desktop (1280×800) | Who we are section (dead-space bug) |
| `screenshots/review-team-desktop-1280.png`        | Desktop (1280×800) | Team, images resolved               |
| `screenshots/review-join-footer-desktop-1280.png` | Desktop (1280×800) | Join manifesto + footer             |
| `screenshots/review-mobile-menu-open-375.png`     | Mobile (375×812)   | Open navigation                     |

> All screenshots are in `.design/ruby-europe-redesign/screenshots/`.

## Summary

The page is credible and largely polished: hero, team cards, buttons, footer,
and the mobile menu are strong, and the palette and type ramp are faithful to
the brand. But for a design that explicitly claims _Swiss typographic
discipline_, two fundamentals are off. The header/hero/footer sit on a
different left rail than every content section (a 13px jog on every scroll),
and the "Who we are" section has a 166px dead zone from a vertical-centering
bug. Both are measured, not impressions, and both undercut the "strong grid"
promise more than any styling detail.

## Must Fix

1. **The page has two conflicting left rails — a 13px jog.** The header logo and
   hero content sit at **x=51px**; every section below (`Who we are`,
   `Highlights`, `For organizers`, `Team`) sits at **x=64px**. Measured at
   1280px. Root cause: `.hero__inner` and `.site-footer__inner` use
   `--max-width-page` (90rem) + `--gutter-page`, while `.section` uses
   `--max-width-wide` (72rem) centered. The sticky header logo therefore never
   aligns with the content beneath it, and the left edge visibly steps inward as
   you scroll from hero into "Who we are." A strong grid must share one rail. See
   `screenshots/review-hero-desktop-1280.png` and
   `review-who-we-are-desktop-1280.png`.
   _Fix: put header, hero, and footer content on the same 72rem content rail as
   `.section` (or move sections onto the 90rem rail). The header logo, hero
   title, and section eyebrows should share one vertical left edge._

2. **"Who we are" has a 166px dead zone from vertical centering.** `.who-layout`
   uses `align-items: center`, so the 179px-tall body copy is centered against
   the 384px-tall community cloud. The result: the body copy floats **102px**
   down its own column, leaving a 166px gap between the lead sentence and the
   supporting paragraphs. It reads as an unfinished or broken section — the
   single most conspicuous whitespace problem on the page. See
   `screenshots/review-who-we-are-desktop-1280.png` (the empty band between "…Ruby
   communities across Europe." and "We bring meetup organizers…"); implementation
   is `_sass/_core-ui.scss` (`.who-layout { align-items: center }`).
   _Fix: change the column alignment to `start` so the body copy top-aligns with
   the cloud and follows directly under the lead. If a small optical offset is
   wanted, use an explicit `margin-block-start`, not centering against an unequal
   column._

## Should Fix

1. **The community cloud reads as clutter, not a constellation.** Logo sizes are
   inconsistent (three size classes plus intrinsic variation), the distribution
   is uneven (denser lower-right, sparse upper-left), and several marks are too
   small to read. Against a brief that explicitly rejects "floating card
   collections" and "generic decoration," this scattered field is the least
   disciplined element on an otherwise controlled page. Twenty hand-tuned inline
   positions in `who-we-are.html` are also brittle content masquerading as
   layout. See `screenshots/review-who-we-are-desktop-1280.png`.
   _Fix: either commit to a disciplined form (an even ring or a tidy grid of
   uniform-sized marks around the mark) or reduce to a smaller, curated set. Do
   not rely on random scatter to imply "network."_

2. **Three white bands stack before the surface rhythm starts.** The page relies
   on alternating white/paper surfaces for section separation, but `hero`, `Who
we are`, and `Highlights` are all white/near-white in a row; the first real
   surface change is at `For organizers`. The `Who we are → Highlights` boundary
   is therefore nearly invisible — two large white sections with similar heading
   treatment abut with only padding between them.
   _Fix: introduce a controlled separation for the top of the page — a
   grid-aligned hairline rule at the section boundary, or shift one of the first
   sections to paper. Do not add cards or decoration to force separation._

3. **Community Highlights still make claims without evidence.** "100+ in Paris,"
   "3 cities," "2 November meetups" appear with no link to a recording, event
   page, or retrospective. This contradicts the brief's core "evidence over
   claims" principle and its explicit key interaction (highlight links to
   YouTube / rubyevents.org / Luma). The section currently reads as marketing
   copy. Implementation: `_includes/sections/highlights.html`.
   _Fix: add one contextual evidence link per highlight and verify each
   quantified claim before publication._

4. **The Join manifesto heading runs to a ~90-character measure.** At 1280px the
   heading spans the full 1152px content width, so the second sentence
   ("Connect with Rubyists across Europe and take part in the conversation at
   your own pace.") wraps well past a comfortable reading measure. Large display
   type tolerates wider lines than body copy, but this is beyond it. See
   `screenshots/review-join-footer-desktop-1280.png`;
   `.section-heading--manifesto h2` sets `max-inline-size: none`.
   _Fix: cap the manifesto heading at roughly 20–24ch so it breaks into a
   deliberate 3–4 line block instead of edge-to-edge prose._

## Could Improve

1. **Highlight metadata stacks two rows of uppercase micro-text.**
   `spread__places` ("Paris · Berlin · London — 2025") sits directly above
   `spread__stats` ("3 cities | 100+ in Paris"), both small, tracked, and
   uppercase. It reads as heavy footer plumbing. _Suggestion: merge into one
   metadata line, or differentiate weight/case so they don't compete._

2. **The two highlight rows use different media framing.** Row 1 is a full-bleed
   solid-red typographic poster; row 2 is a paper-padded map illustration. Both
   are attractive, but the framing differs enough that the "feature row" system
   feels like two one-offs rather than one pattern. _Suggestion: give both media
   the same outer frame (background/padding treatment) even if their interiors
   differ._

3. **`spread__stats` is the tightest contrast on the page.** Tertiary
   `#70717a` on white measures ~4.86:1 — it passes AA for its 14px size, but it
   is the thinnest margin anywhere. _Suggestion: nudge to the secondary ink token
   for a comfortable buffer._

4. **Team role copy varies in rhythm.** Descriptions range from one short line to
   three. _Suggestion: edit to comparable length rather than padding with fixed
   heights._

## What Works Well

- The hero is the strongest asset: faceted Europe field, masked to dissolve
  behind left-aligned copy, distinctive and on-brand with no generic gradients.
  See `screenshots/review-hero-desktop-1280.png`.
- Team cards are cohesive and credible once images resolve — consistent radius,
  border, shadow, and 6:5 crops. See `screenshots/review-team-desktop-1280.png`.
- Buttons have clear primary/ghost hierarchy, 44px+ targets, and restrained
  state transitions.
- The `For organizers` value grid (numbered 01–04 with hairline top rules) is a
  clean, disciplined Swiss treatment.
- Footer is well-resolved: identity, text nav, and socials on the dark band with
  strong contrast.
- Mobile menu opens as a readable full-width panel with dividers, a labeled
  close control, and correct `aria-expanded`. See
  `screenshots/review-mobile-menu-open-375.png`.
- No horizontal overflow at 375px, 768px, or 1280px; type ramp and spacing
  tokens are coherent and consistently applied.

## Recommended Fix Order

1. Unify the left rail across header, hero, footer, and sections.
2. Top-align the "Who we are" columns to kill the 166px dead zone.
3. Tame or restructure the community cloud.
4. Strengthen the top-of-page section boundaries.
5. Add highlight evidence links; constrain the Join heading measure.

## Fixes Applied (2026-07-22)

All design/layout findings were implemented and verified by measurement in the
running site. Refined captures: `refined-homepage-desktop-1280.png`,
`refined-homepage-tablet-768.png`, `refined-homepage-mobile-375.png`,
`refined-who-we-are-desktop-1280.png`.

- **Unified left rail (Must Fix 1).** Added a shared `--gutter-rail` token and
  applied it to `.site-header`, `.hero__inner`, `.section`, and
  `.site-footer__inner`. Verified: header logo, hero content, section eyebrows,
  and footer logo all left-align at **64px** at 1280px (was 51 vs 64) and at
  **16px** at 375px. The scroll jog is gone.
- **"Who we are" dead zone (Must Fix 2).** Changed `.who-layout` to
  `align-items: start`. Lead-to-body gap dropped from **166px → 64px**; body
  copy now sits directly under the lead.
- **Community cloud (Should Fix 1).** Replaced the hand-tuned scatter with two
  evenly spaced concentric rings (inner 8 at 30%, outer 13 at 43%) of uniform
  2.4rem marks, positions computed as percentages so the ring scales
  responsively. Dropped the three size classes and the radial halo. Verified: 21
  icons, uniform 38px, **zero container overflow**, no collision with the center
  mark, cloud stacks below copy on mobile.
- **Top-of-page surface rhythm (Should Fix 2).** Moved `Who we are` to the paper
  surface, giving clean white → paper → white → paper alternation from the first
  section. Verified section background is paper (`#fbf7f4`).
- **Join heading measure (Should Fix 4).** Capped `.section-heading--manifesto
h2` at `22ch`. Heading width dropped from **1152px → 820px**; it now wraps as
  a deliberate block.
- **Highlight stats contrast (Could Improve 3).** Bumped `.spread__stats` from
  the tertiary ink token to secondary for a comfortable AA buffer.

### Not changed (needs real content, not a design fix)

- **Highlight evidence links (Should Fix 3).** Left untouched: the brief
  requires substantiated links (recordings / event pages / retrospectives) and
  those URLs are not available. Adding placeholder links would violate the
  "evidence over claims" principle. Provide the real sources and the arrow-link
  affordance can be wired into each spread.
- **Highlight media framing (Could Improve 2).** Kept the red poster / paper-map
  variety as intentional editorial contrast; forcing identical frames (or
  rounding the red field) would weaken the Swiss, sharp-cornered treatment.

`bundle exec jekyll build` passes with all changes.
