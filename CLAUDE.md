# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page static site: "Practical Guide to LHIRES III Spectroscopy at NTU Observatory" — a student-written field manual for the LHIRES III spectrograph setup. The site is the deliverable; the PDFs in the root (`FYP full report ...`, `PURS report ...`, `report (6) (1).pdf`) are background source material the guide is distilled from, not assets the page loads.

## Stack & tooling

Plain HTML/CSS/JS — no framework, no build step, no package manager, no tests. To preview, open `index.html` directly in a browser, or serve the directory (e.g. `python -m http.server` from this folder) so relative paths resolve cleanly.

## Architecture

Three files plus a figure directory form the entire site:

- **`index.html`** — all content. Structured as a `<aside id="sidebar">` table of contents plus a `<main>` containing one `<section id="...">` per numbered chapter (1. Setup Overview … 9. Troubleshooting). Sidebar anchors and section IDs must stay in sync — `script.js` joins them by `href="#id"`. §2 is an `<iframe>` embed of the companion three.js simulator hosted at `https://iqsr.github.io/LHIRES-III-simulator/` (source: `iqsr/LHIRES-III-simulator`); its `src` carries a `?v=N` cache-buster — bump the number when the simulator upstream is updated and the iframe needs to skip cached HTML.
- **`styles.css`** — single stylesheet, dark theme. All colors and fonts come from CSS custom properties on `:root` (`--bg`, `--accent`, `--warn`, `--danger`, `--tip`, `--info`, plus matching `*-soft` background tints). Reusable component classes: `.callout` (with `.info` / `.warn` / `.danger` / `.tip` / `.pull-quote` variants), `.chain` (horizontal node+arrow flow), `.flow` (vertical step flow), `.timeline`, `.check-list`, `.ts-grid` (troubleshooting cards), `.hero-card`, `.compare-pair` (two-column good/bad image pairs with `.compare-cell.good` / `.bad` accent), `.fig-single` (standalone figure). The mobile breakpoint is `max-width: 900px` — below that the sidebar slides off-screen, the ts-grid and compare-pair collapse to single column, and `#navToggle` becomes visible.
- **`script.js`** — two responsibilities only: (1) toggle `.open` on `#sidebar` for the mobile hamburger, auto-closing on link click below 900 px; (2) highlight the current section's sidebar link via an `IntersectionObserver` with `rootMargin: '-10% 0px -70% 0px'`, toggling `.active`.
- **`figs/`** — cropped PNGs extracted from the source PDFs (report 6 and the FYP report) for the good/bad image comparisons. Filenames are semantic (e.g. `focus_good.png`, `lamp_bad_window.png`). When swapping in a fresh photo, keep the same filename or the `<img>` src in `index.html` needs to change.

## Editing conventions specific to this project

- When adding a new chapter section, update **three places**: the `<ol>` in `#sidebar`, a new `<section id="...">` in `<main>`, and (if it warrants promotion) a `.hero-card` linking to it. The IntersectionObserver picks up new `section[id]` automatically.
- Use the existing callout/flow/timeline/ts-card components rather than inventing new ones — they share the CSS variables and stay visually consistent.
- The case-study section (§7) and the wavelength-verification warnings (§4, §5, quick-start steps 3–4) are the editorial heart of the guide. Preserve the emphasis if rewriting them; the whole document exists to prevent the wavelength-window mistake described there.
