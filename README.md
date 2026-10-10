# Marina Rav — Interactive Portfolio

A multilingual personal portfolio with cinematic editorial design, scroll-driven project showcases and five selected projects.

## Languages
- Ukrainian (default): `/ua`
- English: `/en`
- Italian: `/it`

Project pages use `/:lang/projects/:id`.

## Development

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Visit the local URL displayed by Vite. To build:

```bash
npm run build
npm run preview
```

## Stack

React, TypeScript, Vite, Tailwind CSS, Motion, Lucide. No database, auth, Stripe or Lovable is required for this portfolio.

## Deployment (Cloudflare Pages)

1. Connect this GitHub repository in Cloudflare Workers & Pages.
2. Choose the Vite framework preset.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Root directory: `/`

The project is a client-side SPA. Cloudflare Pages' default SPA fallback should serve `index.html` for paths such as `/it/projects/mav8`. Confirm direct-link refresh works after deployment.

## How to edit

- All three language versions, project data and descriptions: `src/content.ts`
- Layout and animations: `src/App.tsx`
- Chocolate/cream design tokens, responsive layouts and visual placeholders: `src/styles.css`

Important: Preview images in `ProjectArt` are original **conceptual placeholders**, not actual screenshots. Replace these with consented real project assets before final launch. Do not invent client metrics, features or testimonials.

Contact CTA currently uses the known business mailbox `info@mav8.site`. Confirm whether to retain it or use a personal address.

This project is inspired by editorial interactive portfolios including https://kris-portfolio-gamma.vercel.app/ , but does not copy their branding, code or assets.

## Scope of v1

- Responsive single-page portfolio with hero, about, expertise, work, process, MAV8, tech stack and contact sections.
- Five case-study routes with multilingual descriptions.
- Sticky scroll-linked selected-project preview on desktop; mobile card layout.
- Scroll progress, section reveals, animated typography, and reduced-motion support.
- Language switch that retains project page context.
- Client-side SEO metadata; prerendering/static generation recommended later for stronger multilingual SEO.
