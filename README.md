# clokki.de — Marketing landing page

Static landing page for [clokki.de](https://clokki.de), the public-facing site of the Clokki time-tracking app. Built with Astro + Vue islands + Tailwind CSS v4.

Design tokens (colors, typography, spacing, components) mirror the Clockin Vue 3 app so the marketing and product experience feel continuous.

## Stack

| Piece | Tool | Why |
|---|---|---|
| Framework | [Astro 6](https://astro.build) | Ships ~0 KB JS by default — static HTML + partial hydration |
| Components | Mostly `.astro`, 1 Vue island (`ThemeToggle.vue`) | Vue only where interactivity actually needs Vue |
| Styling | Tailwind CSS v4 (CSS-first config) | Same tokens as the Clockin app; `@custom-variant dark` |
| Fonts | Inter 300–700 via `@fontsource/inter` | Self-hosted, no Google Fonts request |
| Icons | Inline SVG (Lucide paths) | Zero runtime JS for icons |
| i18n | Plain JSON dicts + tiny `createT` helper | No library runtime; strings live in `src/i18n/{de,en}.json` |
| Sitemap | `@astrojs/sitemap` | i18n-aware sitemap with `hreflang` alternates |

## Pages

| Path | Language | Purpose |
|---|---|---|
| `/` | DE (default) | Main landing |
| `/en/` | EN | English variant |
| `/soon` · `/en/soon` | DE · EN | Waitlist page with pre-filled `mailto:` |
| `/impressum` | DE only | §5 TMG Anbieterkennung (German legal requirement) |
| `/datenschutz` | DE only | Minimal DSGVO notice |

## Development

```sh
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # static output → dist/
npm run preview   # preview the built output
```

## Theme handling

Dark mode uses the same pattern as the Clockin app:

- `ThemeToggle.vue` (hydrated with `client:load`) writes `light | dark | system` to `localStorage` under the key `theme`
- `BaseLayout.astro` includes an **inline pre-paint script** that reads `localStorage.theme` before first paint and toggles `<html class="dark">` accordingly — no FOUC
- Because the `theme` localStorage key is shared with the Clockin app, users who set dark mode on the marketing site will see the app in dark mode too (same origin)

## i18n

German is the default at `/` (the domain is `.de` after all). English lives under `/en/…`.

- Copy for the structural landing page lives in `src/i18n/de.json` and `src/i18n/en.json`
- Dashboard mockup content (`src/components/preview/*`) stays in German in both locales — the preview shows the actual German product UI, and staying in German is more authentic than translating the mock labels
- Legal pages (Impressum, Datenschutz) are DE-only by design: German legal requirements dictate the language

To add a new string:

1. Add the key to both `de.json` and `en.json` (dotted paths map to nested objects)
2. In a component, `import { createT } from '../lib/i18n'` and call `const t = createT(lang)`; use `{t('section.key')}`

## Accessibility & SEO

- Skip-to-content link as first `<body>` child, targets `#main`
- One `<h1>` per page, `h2 → h3` structural order
- `aria-label`s on icon-only buttons, `aria-hidden` on decorative SVGs
- `<link rel="alternate" hreflang>` plus `x-default` in `<head>` of every localized page
- `application/ld+json` Organization schema in `BaseLayout`
- Generated `sitemap-index.xml` + `sitemap-0.xml` with per-URL hreflang alternates
- `robots.txt` points crawlers at the sitemap

## Extending the site

- **`/pricing`, `/blog`, deeper feature pages**: add under `src/pages/` (and `src/pages/en/` for the EN variant). The layout + header + footer are i18n-aware, so new pages inherit the design and language handling.
- **Analytics / forms**: currently none. Any addition needs a corresponding update to `src/pages/datenschutz.astro`.
- **A real waitlist signup** (vs. `mailto:`): swap the `/soon` CTA to a Formspree / Plausible / API endpoint and add the processing to the Datenschutz page.

## Deployment

Static output in `dist/` — deploys to any static host (Cloudflare Pages, Vercel, Netlify, S3+CloudFront). No runtime needed.

Suggested: Cloudflare Pages with automatic preview deployments per branch. Build command: `npm run build`. Output directory: `dist`.

## Legal

Impressum data in `src/pages/impressum.astro` points at the current operator. Update before any ownership change.
