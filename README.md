# Ruby Europe

The Ruby Europe website — a static single-page site built with Jekyll.

Production: https://rubyeurope.com

## What this is

A low-maintenance marketing single-pager for the Ruby Europe initiative. It
highlights what Ruby Europe does, who's behind it, the Ruby + AI meetups, and
how to join — and hands off dynamic data (event listings, recordings, the full
list of European Ruby communities) to [rubyevents.org](https://www.rubyevents.org),
[Luma](https://luma.com/rubyeurope), and [YouTube](https://youtube.com/@RubyEurope).

## Development

Requires Ruby and Node (managed via [mise](https://mise.jdx.dev)).

```sh
mise install
bundle install
bundle exec jekyll serve
```

The site serves at http://localhost:4000.

## Content

Most variable content lives in `_data/`:

- `_data/team.yml` — team members
- `_data/meetups.yml` — Ruby + AI meetups and hand-off links
- `_data/partners.yml` — partner meetup logo wall

Section copy lives in `_includes/sections/`. Styles are plain SCSS in `_sass/`.

## Deployment

Pushed to `main`, built and deployed to GitHub Pages by
`.github/workflows/jekyll.yml`. The custom domain is set in `CNAME`.

## Design

The visual direction is intentionally a placeholder scaffold. See
`docs/design-direction.md` for scope and the open design decisions handled by
the design-flow pass.
