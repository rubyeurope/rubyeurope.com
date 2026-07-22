# Design Brief: Ruby Europe Redesign

## Problem

European Ruby meetup organizers can benefit from a broader network, but joining another initiative can sound like more work: meetings, urgent requests, administrative upkeep, or obligations they do not have capacity to accept. They need to see quickly that Ruby Europe is an active, credible peer network that stays out of the way, helps when needed, and lets organizers contribute at their own pace.

The current site exposes community information but does not clearly sell that experience or demonstrate the concrete value of joining a larger European whole.

## Solution

Create a focused single-page experience that welcomes meetup organizers, explains Ruby Europe in direct language, demonstrates real outcomes through Community Highlights, and makes participation feel useful and low-pressure. The page should move from purpose, to proof, to organizer value, to the people involved, ending with a clear invitation to join the Discord or reach out by email.

Discord is the primary path into the network. Email is the secondary path for organizers who prefer direct contact.

## Experience Principles

1. **Support without overhead** -- Ruby Europe stays out of the way and helps when needed. Participation can expand or contract with an organizer's capacity; the interface must not imply mandatory meetings, maintenance, or urgent obligations.
2. **Evidence over claims** -- Show concrete, substantiated outcomes such as speaker exchange, collaborations, CFP amplification, recordings, or community opportunities instead of relying on broad promotional language.
3. **Local roots, European connection** -- Present Ruby Europe as a larger whole made from autonomous local communities. The network amplifies local work rather than directing or replacing it.

## Aesthetic Direction

- **Philosophy**: Brand-led functionalism with Swiss typographic discipline. Functional restraint, accessibility, and consistent spacing combine with a strong grid, dramatic type scale, structural rules, and bold red geometric fields derived from the Ruby Europe mark.
- **Tone**: Warm, credible, and quietly energizing. Experienced organizers welcoming peers, not an institution recruiting members.
- **Reference points**: The current rubyeurope.com site's white/red/ink identity, direct Kanit typography, simple navigation, restrained surfaces, and community-first character. Preserve that identity while making the layout more spacious, intentional, and polished.
- **Anti-references**: Corporate nonprofit sites, SaaS landing pages, conference sites, recurring news portals, dark developer aesthetics, and generic AI-generated interfaces with gradients, blobs, floating card collections, or excessive animation.

The page uses white as its dominant canvas. Paper (`#FBF7F4`) is a subtle secondary surface. Near-black backgrounds and deep-red gradients from the value-pack deck are not part of the site direction. There is no dark mode.

The decorative language is restrained and functional: it draws on the network itself through red cartographic and typographic treatments -- maps, community names, and structural rules -- rather than decorative gem or faceted-diamond motifs. Avoid stock photography and unrelated abstract decoration.

## Existing Patterns

The current project is a static Jekyll single-page site assembled from Liquid includes. It uses plain SCSS and native CSS with no UI framework, component library, Storybook, or client-side application framework.

- **Typography**: Self-hosted Kanit throughout, matching the live site. Use Light/Regular for body copy and Regular/Semibold/Bold for hierarchy. The existing live site establishes uppercase, tracked navigation and red headings.
- **Colors**: Existing custom properties define red `#B12626`, ink `#2C2B39`, paper `#FBF7F4`, accent blue `#4D7EA8`, dark gray `#828489`, and light gray `#DCDCDC`. White, not paper, will be the dominant page canvas.
- **Spacing**: Placeholder fluid tokens currently define a `68rem` measure, responsive gutters, and responsive section gaps. Phase 4 will replace these placeholders with a complete, consistent scale.
- **Components**: Existing structural classes cover the header, anchor navigation, sections, buttons, CTA rows, highlight spreads, team entries, and footer. They are scaffold vocabulary to modify rather than finished visual components.
- **Content model**: `_data/team.yml` drives variable content. Static prose and community highlights live in `_includes/sections/`.
- **Assets**: The existing ruby-diamond wordmark, partner logos, Discord QR code, team-image placeholders, and legacy OG image are available.

## Component Inventory

| Component                          | Status | Notes                                                                                                                                        |
| ---------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Site header and desktop navigation | Modify | Make sticky, preserve the existing identity, and align it to the responsive grid.                                                            |
| Mobile navigation dropdown         | New    | Accessible hamburger and close control; full-width dropdown below the header; closes after anchor navigation.                                |
| Full-bleed hero                    | Modify | Replace the centered scaffold with a generous, left-aligned composition and faceted-ruby visual field.                                       |
| Section heading pattern            | Modify | Establish a standard section intro and a larger manifesto/bookend variant with consistent eyebrow, title, lead, rule, and spacing behavior.  |
| Primary and secondary buttons      | Modify | Preserve red-led styling, minimum 44px touch targets, visible focus, and restrained state transitions.                                       |
| Purpose layout                     | Modify | Use a strong full-width thesis followed by supporting text and restrained community imagery, without card containers.                        |
| Community Highlight feature rows   | New    | Replace the narrow Ruby + AI meetup list with alternating large feature rows containing substantiated context, outcomes, and external links. |
| Organizer value layout             | Modify | Present benefits and the reach/connect/grow sequence through hierarchy and grid, not a collection of cards.                                  |
| Team cards                         | Modify | Team is the primary card-based section; accommodate temporary low-resolution headshots and future replacements.                              |
| Join section                       | Modify | Strong final Discord-led CTA with email and social paths; retain QR code only if it supports the responsive composition.                     |
| Footer                             | Modify | Identity, essential links, and socials only. Do not repeat the value-pack PDF.                                                               |
| OG image                           | New    | Static white/red/ink image with the wordmark, ruby motif, and shared-home message.                                                           |

## Key Interactions

- Desktop navigation scrolls to the settled page anchors.
- On mobile, the hamburger opens a full-width menu directly below the sticky header. The control exposes its state accessibly, supports keyboard operation, has a visible close state, and closes after a link is selected.
- Anchor scrolling is smooth by default and immediate when reduced motion is requested.
- Buttons and text links provide clear hover, active, and focus-visible feedback without decorative movement.
- External links identify themselves through context and open safely where appropriate.
- Community Highlight links hand users to recordings on YouTube or rubyevents.org and upcoming events on Luma.
- The primary conversion is joining Discord. Email remains the direct-contact alternative.

No scroll-triggered reveals, parallax, looping decoration, or unnecessary JavaScript will be used.

## Responsive Behavior

- Build mobile-first from 320px, with 375px as the primary small-screen design target.
- Use a single content column on mobile with at least 16px body text and 44px minimum touch targets.
- Replace desktop navigation with the compact dropdown on small screens.
- Keep the hero full-bleed at every size; reduce geometric density and preserve readable copy order on narrow screens.
- Introduce the structured multi-column grid progressively. Organizer value, team entries, and highlight rows stack in a deliberate reading order before expanding.
- Community Highlight rows alternate on wider screens but use one consistent content-first order on mobile.
- The team grid progresses from one to two and then four columns only when image and copy widths remain useful.
- Maintain readable line lengths of roughly 45–75 characters for prose.

## Accessibility Requirements

- Meet WCAG 2.2 AA color-contrast requirements for text, controls, focus indicators, and meaningful graphics.
- Use semantic landmarks, headings, lists, articles, and links with a logical source and screen-reader order.
- Ensure all navigation and calls to action are keyboard operable.
- Provide persistent, high-contrast `:focus-visible` styles.
- Expose mobile-menu state with appropriate accessible naming and `aria-expanded`; manage visibility without trapping or losing focus.
- Provide descriptive image alternatives. Treat purely decorative ruby geometry as hidden from assistive technology.
- Preserve useful partner names in logo alternatives despite links being deferred.
- Respect `prefers-reduced-motion` and disable smooth scrolling and nonessential transitions.
- Do not rely on color alone to communicate state or meaning.
- Self-host Kanit with `font-display: swap` and retain a robust system sans-serif fallback stack.

## Hard Constraints

- Static Jekyll site deployed to GitHub Pages through GitHub Actions.
- Plain SCSS and native CSS; no Tailwind or frontend framework.
- No runtime service, database, or content system.
- JavaScript is limited to behavior genuinely required by the mobile menu.
- Self-hosted fonts and optimized responsive images.
- Strong performance without heavy media, animation libraries, or framework dependencies.
- One-page anchor-scroll structure plus the existing `404.html`.

## Content Status

The existing prose, team data, Ruby + AI event links, and partner logos are real starting content. Community Highlights will initially use the Paris, Berlin, and London Ruby + AI events, but claims about outcomes must be substantiated before publication.

Known placeholders or incomplete inputs:

- Team headshots are low-resolution stand-ins and will be replaced later.
- Community Highlight outcome copy and supporting visuals require real source material.
- The legacy OG image will be replaced by final artwork during the build.

## Out of Scope

- Dark mode or automatic color-scheme inversion.
- News feed, announcements archive, blog, or any recurring publishing obligation.
- Newsletter or Mailchimp integration.
- Meetup map or a maintained meetup/conference directory.
- Contact form; contact remains email-based.
- Sponsor section.
- A standalone partner-community logo wall or maintained community directory.
- Replacing the temporary team headshots.
- Database, CMS, search, accounts, authentication, or runtime backend.
- Imprint/privacy routes or additional site pages.
- Reproducing the value-pack deck's dark visual treatment.
- Repeating the value-pack PDF link in the footer.
