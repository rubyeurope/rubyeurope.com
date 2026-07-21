# Ruby Europe — Design Direction

Starting point for the design-flow pass. The Jekyll scaffold, content, and data
model are settled (below). The **visual design is intentionally unresolved** —
that's what design-flow decides.

## Why we rebuilt

The old site was a Rails app with a Google-map meetup browser, conference data,
a news/announcements section, a Mailchimp newsletter, and a contact form. All of
it needed ongoing data upkeep, and it didn't actually sell the initiative.

This rebuild is a **static Jekyll single-pager**: no database, no data to keep
current. It sells what Ruby Europe _is_, shows who's behind it, highlights the
Ruby + AI meetups, and points people to Discord — while handing off anything
that needs curation to rubyevents.org, Luma, and YouTube.

## Scope (settled)

- **Host:** GitHub Pages via GitHub Actions. `CNAME` → `rubyeurope.com`.
- **Structure:** one page (`index.html`) with anchor-scroll nav, plus `404.html`.
  No imprint/privacy (the old site had none either), no other routes.
- **Dropped:** newsletter/Mailchimp, meetup map + meetup data, conference data,
  news/announcements, sponsors, contact form.
- **Hand-offs:** talks/recordings → YouTube + rubyevents.org; what's-next →
  Luma; full community list → rubyevents.org.
- **CTAs:** "Reach out" → `mailto:contact@rubyeurope.com`; Discord as the main
  community entry point. No form.
- **Tooling:** mise, pnpm + prettier, Bundler (`jekyll`, `jekyll-seo-tag`,
  `jekyll-sitemap`, `jekyll_picture_tag`, `jekyll-og-image`), plain SCSS +
  native CSS. No Tailwind.

## Section lineup (settled, in order)

1. **Hero** — "Grow your Ruby meetup" / "A shared home for the Ruby community in
   Europe" + CTAs (Join the Discord, Reach out).
2. **Who we are** — a strong non-profit thesis; connect local meetups while
   supporting local autonomy.
3. **Community Highlights** — bounded, evidence-linked examples of the network
   in practice.
4. **For organizers** — practical value, flexible participation, Discord, and
   the value-pack PDF.
5. **The Team** — Mariusz, Paweł, Hans, Dawid, with LinkedIn links.
6. **Join / CTA** — Discord + email.
7. **Footer** — essential anchors and social destinations.

Nav exposes every main section: Who we are · Highlights · For organizers · Team
· Join.

## Content model (settled)

- `_data/team.yml` drives the variable content.
- Socials are inline in the markup (Discord, email, and the social accounts each
  get distinct treatment) rather than in a data file.
- Static prose and community highlights live in `_includes/sections/`.

## Brand tokens (carry over — keep the vibe)

- **Colors:** red `#B12626`, ink `#2C2B39`, paper `#FBF7F4`, accent `#4D7EA8`,
  grays `#828489` / `#DCDCDC`. (In `_sass/_tokens.scss` as CSS custom properties.)
- **Logo:** existing ruby-diamond wordmark (`assets/images/ruby-europe-logo.svg`).
- **Type:** Kanit for display (self-hosted), Inter for body.

## Open design decisions (for design-flow)

- **Dark vs light.** The current placeholder is light (paper background). The
  value-pack deck is dark (near-black with deep-red radial gradients, white/grey
  text). "Fresher look, same vibes" — pick the direction and build the system.
- Layout, spacing, and rhythm for each section (the scaffold is minimal).
- Motion / scroll behavior, if any.
- Whether the value-pack PDF link also belongs in the footer.
- Nav treatment on mobile (the old site had a hamburger; scaffold has none yet).
- OG image treatment (currently reuses the old `og.jpg`; can regenerate per-page
  via `jekyll-og-image`).

## Asset TODOs

- **Team headshots** in `assets/images/team/` are low-res crops from the
  value-pack PDF as stand-ins — replace with high-res PNGs.
- **OG image:** regenerate a fresh one once the visual direction lands.
- Reference material: value-pack deck at `assets/ruby-europe-value-pack.pdf`.
