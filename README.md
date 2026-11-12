# Chavan Srikar — Portfolio

An animated, fully responsive developer portfolio built from the public
GitHub profile (`github.com/chavansrikar`) and LinkedIn profile
(`linkedin.com/in/chavansrikar`).

**Live site:** https://chavansrikar.github.io/portfolio/

---

## Highlights

| Feature | Detail |
|---|---|
| **ASCII art engine** | Custom 5×6 block font renders the name, headings and decorative panels as real characters. |
| **ASCII skill tiles** | Every technology has its own hand-drawn ASCII illustration. Hovering scrambles the glyphs, draws a progress arc and sprays characters outward — driven by `anime.js`. |
| **ASCII photo portrait** | The profile photo is sampled into a character grid on a `<canvas>`. Hovering the portrait desaturates the photo and sweeps a live ASCII rendering over it, with a scan bar and a character trail following the cursor. |
| **ASCII hover panels** | Decorative panels glitch-scramble their glyphs on hover, driven by `anime.js`. |
| **Anime.js** | Every counter, reveal, cross-fade and hover tween runs through `anime.js` v4. |
| **Framer Motion** | Scroll-linked reveals, layout animations, spring physics and 3D tilt. |
| **Lenis** | Smooth inertial scrolling. |
| **Canvas backgrounds** | A drifting particle constellation with mouse repulsion, plus a scrolling ASCII rain. |
| **Live GitHub feed** | The open-source section fetches the GitHub REST API at runtime and falls back to a bundled snapshot when offline. |
| **Theme** | Molten palette — amber → coral → violet, with lime signal accents. |
| **Accessibility** | Semantic landmarks, focus-visible rings, `prefers-reduced-motion` support, ARIA labels and a keyboard-friendly mobile drawer. |

---

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite 8** — build tooling
- **Tailwind CSS v4** — styling, via the `@tailwindcss/vite` plugin
- **Framer Motion** — animation
- **anime.js v4** — imperative tweens, counters, glitch effects
- **Lenis** — smooth scroll

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
npm run typecheck  # TypeScript only
```

---

## Deploying to GitHub Pages (free)

Deployment is automated with **GitHub Actions** — push to `main` and the
site goes live. No paid hosting involved.

### 1. Create the repository

```bash
git init -b main
git remote add origin https://github.com/chavansrikar/portfolio.git
git add .
git commit -m "Initial commit — animated portfolio"
git push -u origin main
```

### 2. Enable Pages

In the repository:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

### 3. Set the base path

The workflow reads the `VITE_BASE_PATH` repository variable:

| Repository type | `VITE_BASE_PATH` |
|---|---|
| Project page — `chavansrikar.github.io/portfolio/` | `/portfolio/` |
| User page — `chavansrikar.github.io/` | `/` |

Add it under **Settings → Secrets and variables → Actions → Variables**.
If it is not set the workflow defaults to `/`, so add it when using a
project page.

The workflow file lives at `.github/workflows/deploy.yml` and:

1. checks out the repo,
2. installs dependencies with `npm ci`,
3. runs `npm run build`,
4. uploads `dist/` as the Pages artifact,
5. deploys it to GitHub Pages.

Every push to `main` triggers a fresh deploy — the live URL stays
`https://chavansrikar.github.io/portfolio/`.

> A `404.html` is bundled so deep links fall back gracefully on GitHub
> Pages. To attach a custom domain, add a `public/CNAME` file containing
> your domain and point your DNS at GitHub Pages.

---

## Project structure

```
portfolio/
├── public/
│   ├── avatar.jpg          # square crop (social / fallback)
│   ├── profile-full.jpg    # main portrait (3:4)
│   ├── portrait-alt.jpg    # outdoor shot used in the About section
│   ├── og-image.jpg        # social share card
│   ├── 404.html            # GitHub Pages fallback
│   └── favicon.svg
├── src/
│   ├── data/site.ts        # ALL content — edit this to update the site
│   ├── lib/ascii.ts        # ASCII block font + decorative art
│   ├── hooks/
│   ├── components/
│   │   ├── AsciiPortrait.tsx   # photo → ASCII on hover
│   │   ├── AsciiHoverPanel.tsx # glitching ASCII panels
│   │   ├── AsciiRain.tsx       # matrix rain canvas
│   │   ├── ParticleField.tsx   # constellation canvas
│   │   ├── ProfileCard.tsx     # portrait + orbit tags
│   │   ├── Hero / About / Skills / Projects / Journey / Github / Contact / Footer
│   │   └── ui/                 # Button, Marquee, TiltCard, Counter, Section, …
│   └── index.css          # design tokens + custom utilities
└── .github/workflows/deploy.yml
```

---

## Updating the content

Everything editable lives in **`src/data/site.ts`** — profile, roles, stats,
skills, projects, timeline, achievements and the GitHub fallback snapshot.
No component edits are needed for routine updates.

To swap the profile photo, replace `public/avatar.jpg` (square) and
`public/profile-full.jpg` (3:4 portrait). The ASCII portrait effect reads
whatever image is in place, so it needs no code change.

---

## Licence

MIT
