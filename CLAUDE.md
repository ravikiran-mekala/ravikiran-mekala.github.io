# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio site for Ravi Kiran Mekala. Jekyll-based single-page site hosted on GitHub Pages.

## Build & Serve

```bash
bundle install          # first time only (requires Ruby 3.0+)
bundle exec jekyll serve  # local dev server at http://localhost:4000
```

No test suite, linter, or build pipeline beyond Jekyll.

## Architecture

Single-page site with no frontend framework — vanilla HTML/CSS/JS. Design follows a warm minimalist aesthetic (cream/beige palette, Manrope headings, centered single-column layout).

- **`index.html`** — The entire page. Uses Liquid templates to loop over data files. Sections: Header, Intro, Stats, Experience, Skills, Education, Achievement, Footer/Contact.
- **`_layouts/default.html`** — Minimal shell (head + body wrapper). Loads Manrope, Inter, and JetBrains Mono fonts.
- **`_data/`** — Content lives here as YAML, rendered via Liquid loops in `index.html`:
  - `skills.yml` — categorized skill groups
  - `experience.yml` — work history (company, role, period, tech, bullets)
  - `education.yml` — degrees
- **`_config.yml`** — Site metadata (name, description, email, social links, location).
- **`assets/css/style.css`** — All styles in one file. Uses CSS custom properties (`--text-*`, `--bg-*`, `--font-*`). Centered 680px max-width layout. Responsive breakpoint at 768px. `prefers-reduced-motion` support. Hover dimming effect on experience/education lists.
- **`assets/js/main.js`** — Minimal JS (~88 lines). Features:
  - Animated stat counters (IntersectionObserver-triggered)
  - Active nav highlighting based on scroll position
  - Smooth scroll for anchor links
  - Header name hover easter egg

## Content Updates

To update resume content, edit the YAML files in `_data/`. The templates handle rendering. Site metadata (email, LinkedIn, GitHub URLs) is in `_config.yml`.
