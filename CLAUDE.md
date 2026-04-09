# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio site for Ravi Kiran Mekala. Jekyll-based single-page site hosted on GitHub Pages. Live at https://ravikiran-mekala.github.io/

## Build & Serve

```bash
bundle install          # first time only (requires Ruby 3.0+)
bundle exec jekyll serve  # local dev server at http://localhost:4000
```

No test suite, linter, or build pipeline beyond Jekyll. System Ruby (2.6) on this Mac is too old — the site builds on GitHub Pages. Verify changes by pushing and checking the live site.

## Design System

**Inspiration:** charmiekapoor.com — warm minimalism, editorial, content-first with generous whitespace.

### Color Palette (CSS custom properties in `:root`)
- **Light mode:** `--bg-page: #fafafa`, `--bg-surface: #f0ede7`, `--text-primary: #1D1D1D`, `--text-body: #41403F`, `--text-muted: #918E89`
- **Dark mode** (`[data-theme="dark"]`): `--bg-page: #0f1113`, `--bg-surface: #1a1c1e`, `--text-primary: #f5f3ef`, `--text-body: #bdb7b0`
- **Accent gradient** (avatar ring): `linear-gradient(135deg, #cbd5f5, #f3d4c0)` (lavender → peach)

### Typography
- **Headings:** Manrope (500, 600, 700) — loaded from Google Fonts
- **Body:** Inter (400, 500, 600)
- **Mono/labels:** JetBrains Mono (400, 500) — used for section labels, nav, footer, tooltips, all uppercase labels
- **Tight letter-spacing:** headings `-0.03em`, body `-0.02em`

### Layout
- **Max-width:** 816px centered single-column
- **Responsive breakpoint:** 768px
- **Sections separated by:** `border-top: 1px solid var(--border-light)`
- **Section labels:** Monospace uppercase (`.section-label`)

### Interaction Patterns
- **Tooltips:** CSS-only, position absolute, dark bg (`var(--text-primary)`) with light text (`var(--bg-page)`), `opacity` transition. Used on interest cards, trek badges (`data-tooltip`), and state items.
- **Hover dimming:** On Beyond Code cards — siblings fade to `opacity: 0.4`, hovered card stays at 1.
- **No hover dimming** on experience/education (user explicitly removed it).
- **Dark mode toggle:** LIGHT MODE / DARK MODE pill switcher. Persists via `localStorage`. JS in `main.js`.
- **Header easter egg:** Name changes to "HEY THERE!" on hover.

### Dark Mode Considerations
- Table icons (company logos) get `background: rgba(255,255,255,0.9); padding: 2px; border-radius: 6px` in dark mode so dark logos stay visible.
- State SVGs have colors baked into the files directly (not via CSS `color`), so they look the same in both modes.
- All CSS transitions include `transition: color/background 0.3s ease` for smooth mode switching.

## Architecture

- **`index.html`** — The entire page. Sections: Header, Intro, Experience, Education, Beyond Code, Trails & Parks, Footer.
- **`_layouts/default.html`** — Shell: head (fonts, CSS) + body (content + JS).
- **`_data/experience.yml`** — Work history. Fields: `company`, `role`, `period` (start year only), `icon` (path to logo PNG).
- **`_data/education.yml`** — Degrees. Fields: `institution`, `degree`, `period`, `icon`.
- **`_data/skills.yml`** — Exists but not currently rendered (Skills section was removed in favor of personal sections).
- **`_config.yml`** — Site metadata: name, description, email, LinkedIn, GitHub, location.
- **`assets/css/style.css`** — All styles in one file. ~680 lines.
- **`assets/js/main.js`** — ~57 lines. Three features: dark mode toggle, smooth scroll, header easter egg.

### Asset Directories
- **`assets/img/logos/`** — Company/school favicon PNGs (microsoft, surlatable, blackberry, vyntelligence, delhivery, utdallas, iitg).
- **`assets/img/states/`** — 9 colored state outline SVGs (ut, ca, wa, tx, nm, az, co, or, fl). Colors are baked into each SVG's `fill` attribute.
- **`assets/img/flags/`** — State flag PNGs (downloaded but not currently used — Option C was rejected).
- **`assets/img/onepiece.png`** — Straw Hat Jolly Roger for Anime interest card.
- **`assets/img/headshot_circle.png`** — Profile photo.

## Content & Section Details

### Experience (table layout)
- Grid: `240px 1fr auto` — icon+company | role | start year
- Only show start year (not ranges) for each job
- Delhivery role is "Software Engineer" (not Senior)
- Company logos sourced via Google S2 favicon service at 64px

### Education (same table layout)
- "IIT Guwahati" (not full "Indian Institute of Technology, Guwahati")
- Degrees: "Master in Computer Science", "Bachelor in Electrical Engineering"
- No GPA displayed

### Beyond Code (interest cards)
- 4 cards in a grid: Gym, Hiking, Concerts, Anime
- Detail text shown as floating tooltip on hover (not inline — avoids layout jitter)
- Hover dims siblings to 0.4 opacity
- Anime card uses `.interest-logo` (PNG image, 40px) instead of emoji

### Trails & Parks
- Intro paragraph: casual tone, no hyphens, say "trek or hike" not "Himalayan trek"
- **Treks · India:** pill badges with `data-tooltip` for hover messages
  - Kedarkantha: "12,500 ft — First trek. Instant addiction."
  - Rupin: "15,350 ft — Of questioning life choices"
- **Treks · USA:** "Coming soon" (muted)
- **National Parks:** State outline silhouettes (Option B — colored) in a flex grid
  - Each state: colored SVG in circle + abbreviation below + hover tooltip with state name + parks list
  - Colors: UT rust red, CA gold, WA forest green, TX navy, NM gold, AZ rust red, CO sage green, OR teal, FL blue

## Git Workflow

All changes go through feature branches → PR → merge to main. Commit messages include `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`.

## User Preferences

- Prefers warm minimalist aesthetic inspired by charmiekapoor.com
- Likes hover tooltips over inline text reveals (no layout jitter)
- Prefers self-deprecating humor in personal content
- Wants experience/education kept simple (no bullet points, just company | role | year)
- No hover dimming on experience/education rows
- Hover dimming is fine on Beyond Code interest cards
- State outlines with baked-in colors preferred over flags or abbreviation circles
- Resume links to Google Drive PDF
