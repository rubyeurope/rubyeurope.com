# Ruby Europe

The Ruby Europe website: two pages, built with Jekyll and deployed to GitHub
Pages.

Production: https://rubyeurope.com

- `/` — who we are, the communities on the map, what Ruby Europe does, the
  people behind it, Discord and the newsletter.
- `/support/` — community support for meetups, with the request form.

Dynamic data (event listings, recordings, the full list of European Ruby
communities) lives elsewhere: [rubyevents.org](https://www.rubyevents.org),
[Luma](https://luma.com/rubyeurope) and [YouTube](https://youtube.com/@RubyEurope).

## Development

Requires Ruby and Node (managed via [mise](https://mise.jdx.dev)).

```sh
mise install
bundle install
bundle exec jekyll serve
```

The site serves at http://localhost:4000.

## Content

Everything that changes lives in `_data/` and `_config.yml`:

- `_data/communities.yml` — the cities on the map and in the list, in ring order.
- `_data/map.yml` — the map frame and the dashed "your city?" marker.
- `_data/team.yml` — the people section. Photos in `assets/images/team/`.
- `_config.yml` — Discord and conference links, the support amounts
  (`support.pool`, `support.max_per_meetup`), the form endpoint and the
  Mailchimp list.

Page copy is in `index.html` and `support.html`. Styles are plain CSS in
`assets/css/site.css`; fonts (Bricolage Grotesque, DM Mono, SIL OFL) are
self-hosted in `assets/fonts/`, so visitors' browsers never call Google.

### Adding a city

1. `bin/map-position LAT LON` prints its `x` and `y`.
2. Add an entry to `_data/communities.yml` between its two nearest neighbours
   in the current order, so the ring stays a simple loop. Pick the `label`
   side that does not collide with a neighbour on a phone.
3. If it lands where the open marker rests, move `open_seat` in
   `_data/map.yml`, and update `links` if its nearest cities changed.
4. Update the "Five cities" heading.

## Forms

- **Support requests** go to a Google Apps Script web app that writes to a
  Google Sheet and Notion and emails the team. Setup: `docs/support-form.md`.
  Until `support_form_endpoint` is set, the form asks people to email
  contact@rubyeurope.com.
- **Newsletter** sign-ups go straight to the existing Mailchimp list.

## Social cards

`og/` and `og/support/` are the 1200×630 cards for link previews.
`bin/og-image` builds the site and exports them to `assets/images/og.png` and
`assets/images/og-support.png`.

## Deployment

Pushing to `main` builds and deploys to GitHub Pages
(`.github/workflows/jekyll.yml`). One-time repository setup:

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain: rubyeurope.com**, then **Enforce HTTPS**
   once the certificate is issued.
3. DNS (Cloudflare): point `rubyeurope.com` and `www` at GitHub Pages
   (`CNAME` to `rubyeurope.github.io`, DNS only until the certificate is issued).

Old URLs from the Rails site (`/contact`, `/about`, `/news/…`, …) are sent to
their new place by `404.html`.
