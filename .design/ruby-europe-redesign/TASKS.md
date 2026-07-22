# Build Tasks: Ruby Europe Redesign

Generated from: `.design/ruby-europe-redesign/DESIGN_BRIEF.md`  
Architecture: `.design/ruby-europe-redesign/DESIGN_ARCHITECTURE.md`  
Tokens: `.design/ruby-europe-redesign/DESIGN_TOKENS.scss`  
Date: 2026-07-20

## Foundation

- [x] **Establish the visual system through the full-bleed hero**: Integrate `DESIGN_TOKENS.scss` into `_sass/_tokens.scss`, preserve self-hosted Kanit across body and display typography, replace placeholder global styles, and build the left-aligned full-bleed hero with responsive faceted-ruby geometry, working CTA states, readable line lengths, and reduced-motion handling. This task must establish the brand-led functionalist direction with Swiss typographic discipline clearly enough to validate before styling the rest of the page. Verify at 375px, 768px, and 1280px. _Modifies: existing tokens, font declarations, base/layout styles, hero include, and button/CTA vocabulary._

- [x] **Build the sticky responsive navigation shell**: Turn the existing header into a sticky white/paper brand surface with aligned desktop anchors and an accessible compact mobile dropdown. Add only the JavaScript required to open, close, expose `aria-expanded`, close after link selection, and preserve keyboard/focus behavior. Ensure links work from both `/` and `404.html`. Verify closed, open, hover, focus-visible, Escape, and anchor-navigation states. _Modifies: existing site header and navigation; creates: mobile-menu behavior._ _Depends on: Establish the visual system through the full-bleed hero._

## Core UI

- [x] **Establish purpose with a strong thesis**: Build Who we are around a full-width manifesto heading, concise supporting copy, and restrained community imagery. Keep the “support local communities, not replace them” message subordinate to the stronger peer-network and support-without-overhead narrative. Verify semantic heading order and mobile reading order. _Modifies: Who we are; reuses: section heading, grid, and typography tokens._ _Depends on: Establish the visual system through the full-bleed hero._

- [x] **Replace the meetup list with Community Highlights**: Rename the section and anchor to `#highlights`, adapt the existing event data into a bounded highlight model, and render the Paris, Berlin, and London Ruby + AI work as large responsive feature rows instead of cards. Use only substantiated facts and available links; do not invent outcomes. Alternate visual alignment on larger screens, preserve one content-first order on mobile, and use faceted-ruby graphics where supporting media is unavailable. Verify external link states and safe link attributes. _Modifies: existing meetups data/include and index include reference; creates: Community Highlight feature-row pattern._ _Depends on: Explain purpose and pillars without card containers._

- [x] **Build the organizer conversion section**: Recompose For organizers around concrete value, flexible participation, and the low-pressure “reach out → connect → grow” sequence. Use hierarchy, rules, and grid rather than cards; keep Reach out primary within this section and the value-pack PDF secondary. Explicitly communicate that participation does not create mandatory meetings, maintenance, or urgent response expectations. Verify the email and PDF destinations and responsive sequence. _Modifies: existing For organizers section; reuses: shared CTA, section, list, and grid patterns._ _Depends on: Replace the meetup list with Community Highlights._

- [x] **Create the accountable team card grid**: Style the four existing team entries as the page’s primary card treatment, using consistent image ratios, modest radii, thin borders, restrained elevation, legible roles, and clear LinkedIn actions. Make low-resolution stand-ins presentable without hiding that they remain replaceable data assets. Verify one-, two-, and four-column arrangements and keyboard focus. _Modifies: existing Team section and team card classes; reuses: `_data/team.yml`, surface, type, border, radius, and shadow tokens._ _Depends on: Establish the visual system through the full-bleed hero._

- [x] **Complete the Discord-led close and footer**: Build the Join section as the decisive final conversion moment with Discord dominant, email secondary, and the QR code included only if it strengthens rather than crowds the responsive composition. Rework the footer around identity, essential anchors, Discord, email, and social destinations; do not repeat the value-pack PDF. Verify external-link safety, touch targets, and mobile wrapping. _Modifies: existing Join section and site footer; reuses: CTA, link, section-shell, and faceted-ruby patterns._ _Depends on: Build the organizer conversion section._

## Supporting Views and Metadata

- [x] **Bring the 404 recovery view into the shared system**: Restyle `404.html` within the shared header/footer shell, state the error clearly, and provide a primary return-home action plus an optional secondary Join path. Confirm header anchors resolve to homepage fragments instead of nonexistent local sections. _Modifies: existing 404 page and shared navigation behavior; reuses: site shell and CTA components._ _Depends on: Build the sticky responsive navigation shell; Complete the Discord-led close and footer._

- [x] **Replace the legacy social preview**: Create a static 1200×630 OG image using the white canvas, Ruby Europe wordmark, red faceted-ruby motif, ink typography, and “A shared home for the Ruby community in Europe.” Update Jekyll metadata to use it and verify generated Open Graph and Twitter image URLs. _Modifies: existing OG asset and Jekyll metadata; creates: final static OG artwork._ _Depends on: Establish the visual system through the full-bleed hero._

## Responsive and Polish

- [x] **Run the integrated responsive and accessibility pass**: Review the complete page at 320px, 375px, 768px, 1024px, 1280px, and a wide desktop. Correct overflow, line length, source order, section rhythm, sticky-header anchor offsets, touch targets, image sizing, and visual balance. Test keyboard-only navigation, mobile-menu state, visible focus, semantic landmarks/headings, image alternatives, contrast, and reduced motion against WCAG 2.2 AA requirements. _Modifies: existing components only where verified issues are found; reuses: all completed page patterns._ _Depends on: all build tasks above._

- [ ] **Verify the production build**: Format Liquid, SCSS, YAML, and metadata with the repository’s existing Prettier setup where supported; run the Jekyll production build; inspect generated `/`, `/404.html`, sitemap, canonical metadata, and asset URLs; and resolve all build or browser-console errors without adding a new test framework. _Modifies: completed implementation only where verification fails; reuses: existing Bundler, Jekyll, and pnpm tooling._ _Depends on: Run the integrated responsive and accessibility pass._

## Review

- [ ] **Design review**: Run `/design-review` separately against the completed build and save findings and screenshots under `.design/ruby-europe-redesign/`. This is Phase 7 and does not run automatically.
