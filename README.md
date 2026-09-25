# Paul Bai | Product Portfolio

Personal portfolio for Paul Bai Kanu, a product designer, web designer, and
product manager based in Freetown, Sierra Leone.

**Live website:** [paul-bai-portfolio.vercel.app](https://paul-bai-portfolio.vercel.app)

I design financial products for the way Africa moves, and build websites and
digital services from focused landing pages to complex web applications.

The site includes Paul’s current work at Flot, co-founded work at
[Mocha](https://getmocha.io/), his product principles, an editorial portfolio
layout, 11 public repositories from
[`github.com/paulbai`](https://github.com/paulbai), and 8 public collaborator
projects. Cards open an on-site summary, not a GitHub page. Only Flot and
Mocha have live-site links; the remaining URLs can be added when supplied.
Private repository content is not published.

The portfolio is served at `/`. The old `/variant-b/` address redirects to `/`,
including on static hosting. It uses a charcoal/red editorial layout, locally hosted Satoshi and Anton,
handwritten accents, a full-color NFT avatar, scroll-driven animation,
an overlapping project carousel, and accessible native project dialogs.

## Stack

- Svelte 5, SvelteKit 2, and TypeScript
- Vite 8 and the SvelteKit static adapter
- GSAP for scroll motion and transitions
- Three.js for the desktop atmospheric background
- Lucide icons and self-hosted fonts

Touch devices receive a lightweight visual fallback. Reduced-motion preferences,
keyboard navigation, native dialogs, and manual animation controls are supported.

## Local development

Use Node.js 24 and npm.

```bash
npm ci
npm run dev
```

The local site runs at the URL printed by Vite (normally `http://localhost:5173`).

## Validation

```bash
npm run check
npm test
```

## Production

The application is built with SvelteKit and exports a static `dist/` folder.

Set `PUBLIC_SITE_URL` to the real portfolio domain before running
`npm run build`; see `.env.example`. This enables canonical and Open Graph URLs.
Deploy the resulting `dist/` folder to a static host. No server, secrets, or
form service is required: contact uses the supplied email address.

### Vercel

`vercel.json` configures a static deployment with `dist` as the output directory.
The build runs the Svelte checks and all regression tests before deployment.
Set `PUBLIC_SITE_URL` in the Vercel project to the production URL so canonical
and social metadata use the correct domain. Pushes to `main` deploy to production
when the repository is connected to Vercel.

## Editing the portfolio

- Page content and interactions: `src/routes/+page.svelte`
- Shared resets: `src/app.css`
- Design tokens and responsive styles: `src/lib/styles/variant-b.css`
- All 21 project summaries, images, and optional website links: `src/lib/data/projects.ts`
- Project carousel and visual effects: `src/lib/components/variant-b/`
- Accessible dialogs: `src/routes/+page.svelte`
- Legacy URL redirect: `src/routes/variant-b/+page.ts`
- Artwork and project previews: `static/media/`
- Social preview: `static/og-v2.jpg`

The carousel advances every three seconds when visible. It pauses on hover,
keyboard focus, open dialogs, a hidden browser tab, or the visitor's pause
control. Reduced-motion preferences disable automatic rotation. Arrow buttons,
keyboard arrows, a project picker, and horizontal touch gestures provide
manual navigation.

## Content and contact

Live website links are currently available for Flot and Mocha. The other 19
links will be added when those projects go live. The fuller Flot case study is
not yet public. Some project previews are concept illustrations.

- Email: [paulbaikanu13@gmail.com](mailto:paulbaikanu13@gmail.com)
- GitHub: [paulbai](https://github.com/paulbai)
- LinkedIn: [Paul Bai Kanu](https://www.linkedin.com/in/paul-bai-kanu-4895bb153/)

Local environment files, development notes, screenshots, old template files,
database remnants, and recovery archives are excluded from this repository
and deployment. No third-party private repository source is included.

The avatar, personal branding, and project artwork are not offered under an
open-source content license. Respective project brands belong to their owners.
