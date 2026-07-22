# Design Architecture: Ruby Europe

## Site Map

- Home `/`
  - Hero `/#top`
  - Who we are `/#who-we-are`
  - Community Highlights `/#highlights`
  - For organizers `/#for-organizers`
  - Team `/#team`
  - Join `/#join`
- Not found `/404.html`

The anchor fragments identify sections within the homepage; they are not separate pages or navigation levels.

## Navigation Model

- **Primary navigation**: Five items: Who we are, Highlights, For organizers, Team, and Join. The logo returns to the top. Every main content section is directly reachable from the header.
- **Secondary navigation**: None. Contextual links inside Community Highlights lead to supporting recordings or event pages. The For organizers section links to the value-pack PDF.
- **Utility navigation**: The footer provides essential anchor links, Discord, email, and social destinations. It does not repeat the value-pack PDF.
- **Mobile navigation**: An accessible hamburger opens a full-width dropdown immediately below the sticky header. The menu contains the same five links, exposes open/closed state, provides a visible close control, and closes after anchor selection.

Navigation depth is one level. There are no dropdown hierarchies, sidebars, breadcrumbs, tabs, or audience-specific routes.

## Content Hierarchy

### Home `/`

1. **Hero** -- State “Grow your Ruby meetup” and “A shared home for the Ruby community in Europe” immediately. Offer Join the Discord as the primary action and Reach out as the secondary action. The full-bleed composition establishes confidence and brand identity without delaying comprehension.
2. **Who we are** -- State the peer-led, non-profit thesis with enough visual force to establish that Ruby Europe connects and supports autonomous local communities.
3. **Community Highlights** -- Demonstrate concrete value through a bounded set of substantiated outcomes and supporting evidence links.
4. **For organizers** -- Explain practical value and explicitly lower the perceived cost of participation: no mandatory meetings, urgent responses, or fixed contribution level.
5. **Team** -- Show accountable people and provide LinkedIn paths after the initiative has established its purpose and value.
6. **Join** -- Close with belonging and contribution. Discord is the dominant action; email is the direct-contact alternative. Social links are tertiary.
7. **Footer** -- Reinforce identity and expose essential navigation and contact destinations without introducing new content.

### Not Found `/404.html`

1. **Clear error state** -- Explain that the requested page does not exist.
2. **Recovery action** -- Return to the homepage as the primary action.
3. **Community action** -- Optionally provide a secondary route to `/#join`; do not recreate full homepage content.

## User Flows

### Organizer evaluates and joins the network

1. Organizer lands on `/` from a referral, social post, event link, or search result.
2. Hero communicates the organizer-focused proposition and offers Discord immediately.
   - If already convinced, the organizer selects **Join the Discord** and arrives at Discord.
   - If more context is needed, the organizer continues down the page.
3. Who we are establishes purpose, scope, and the autonomy of local communities.
4. Community Highlights provide concrete evidence of speaker exchange, collaboration, amplification, or other substantiated outcomes.
5. For organizers explains practical value and low-overhead participation.
6. Organizer chooses a contact path:
   - **Join the Discord** → enters the primary community space.
   - **Reach out** → opens an email to `contact@rubyeurope.com` for direct discussion.
7. External Discord or mail software owns the completion state; the site does not require an account or form submission.

### Community participant joins directly

1. Developer, speaker, mentor, or learner lands on `/`.
2. Hero establishes that the network is a shared home for the European Ruby community.
3. User chooses **Join the Discord** immediately or uses the Join anchor in navigation.
4. User arrives at Discord and participates according to interest and capacity.

### Visitor verifies credibility

1. Visitor lands on `/` and scans purpose and pillars.
2. Visitor reviews Community Highlights for proof of activity.
3. Visitor reviews the community constellation and Team for European breadth and accountable people.
4. Visitor returns to Join through the sticky navigation or continues to the final CTA.

### Visitor follows supporting evidence

1. Visitor encounters a relevant Community Highlight.
2. Visitor follows a contextual recording or event link.
3. The supporting resource opens externally on YouTube, rubyevents.org, or Luma.
4. Ruby Europe remains a concise introduction and proof layer rather than reproducing maintained external content.

### Invalid URL recovery

1. Visitor reaches `/404.html` after following an invalid or obsolete URL.
2. The page clearly identifies the missing destination.
3. Visitor chooses **Return home** or a secondary **Join Ruby Europe** path.
4. Visitor arrives at `/` or `/#join`.

## Naming Conventions

| Concept                       | Label in UI              | Notes                                                                                                           |
| ----------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| The organization/network      | Ruby Europe              | Use consistently; do not shorten to “RE.”                                                                       |
| Primary community action      | Join the Discord         | Specific destination and lower-friction than a vague “Join us.”                                                 |
| Direct contact action         | Reach out                | Opens email; use consistently in hero and organizer contexts.                                                   |
| Proof of activity             | Community Highlights     | Replaces “Ruby + AI Meetups” and avoids the maintenance expectations of “News.”                                 |
| Primary audience section      | For organizers           | Direct and familiar; avoid “Membership” because participation has no formal obligation.                         |
| Local groups                  | Local communities        | Prefer community language over chapters, affiliates, or members.                                                |
| Network participation         | Join the network         | Describes belonging, not formal enrollment. The CTA itself remains “Join the Discord.”                          |
| Organizer participation model | Support without overhead | Internal guiding phrase; public copy should express the idea plainly rather than use it as a slogan everywhere. |
| External event archive        | rubyevents.org           | Lowercase according to the destination’s brand.                                                                 |
| Supporting PDF                | Value pack               | Use “Read the value pack (PDF)” so format and purpose are clear.                                                |

## Component Reuse Map

| Component                     | Used on                          | Behavior differences                                                                                                         |
| ----------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Root Jekyll layout            | `/`, `/404.html`                 | Homepage renders the full narrative; 404 renders a short recovery view within the same brand shell.                          |
| Site header                   | `/`, `/404.html`                 | Sticky on both. Homepage links target local anchors; 404 links resolve to `/#anchor`.                                        |
| Site navigation               | `/`, `/404.html`                 | Desktop shows four inline links; mobile uses the same links in the accessible dropdown.                                      |
| Full-bleed section shell      | Hero, selected emphasis sections | Hero uses maximum vertical presence and ruby geometry; other uses remain restrained and content-led.                         |
| Constrained content container | All homepage sections, 404       | Width and internal grid vary by section while maintaining shared gutters and alignment lines.                                |
| Section heading pattern       | Who we are through Join          | Provides a standard section intro and a larger manifesto/bookend variant without changing semantic hierarchy.                |
| CTA group                     | Hero, For organizers, Join, 404  | Action priority and destination differ; button vocabulary and focus behavior stay consistent.                                |
| Community Highlight row       | Community Highlights             | Repeats for a bounded curated set; alternates visual alignment on larger screens and uses one content-first order on mobile. |
| Team card                     | Team                             | Repeats from `_data/team.yml`; supports current placeholder images and future high-resolution replacements.                  |
| Site footer                   | `/`, `/404.html`                 | Same essential identity, navigation, email, Discord, and social destinations.                                                |

## Content Growth Plan

- **Community Highlights**: A bounded, manually curated set of approximately three entries. Existing entries may be replaced when stronger examples emerge. The section does not accumulate into an archive and does not add pagination, filtering, dates-as-navigation, categories, or detail pages.
- **Team**: Occasional additions or edits through `_data/team.yml`. The responsive grid must tolerate a non-multiple-of-four count without empty visual placeholders.
- **Core narrative**: Hero, Who we are, For organizers, and Join are stable editorial content with infrequent manual updates.
- **External resources**: Recordings, event discovery, and maintained community listings continue to live on YouTube, Luma, and rubyevents.org.

No section requires search, filtering, pagination, CMS behavior, or archive architecture.

## URL Strategy

- **Canonical site URL**: `https://rubyeurope.com/`
- **Page pattern**: `/` for the complete experience and `/404.html` for recovery.
- **Anchor pattern**: lowercase kebab-case IDs describing stable concepts: `#who-we-are`, `#highlights`, `#for-organizers`, `#team`, and `#join`.
- **Dynamic segments**: None.
- **Query parameters**: None.
- **External destinations**: Use direct canonical HTTPS URLs. Open third-party resources in a new browsing context only where the existing interaction convention calls for it, with safe `rel` attributes.
- **Legacy routes**: No new internal replacements or archive routes are introduced. Invalid paths resolve through the static 404 recovery experience.
