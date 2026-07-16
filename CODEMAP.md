# CODEMAP — ax10

Repo index for fast lookup. Regenerate after big structure changes.

## Monorepo (pnpm workspace)
Root is a pnpm workspace (`pnpm-workspace.yaml` → `packages/*`). Two apps:
- `packages/marketing/` — **@ax10/marketing**, the www.ax10.in site. All paths under "Marketing" below are relative to `packages/marketing/`.
- `packages/apps/` — **@ax10/apps**, apps.ax10.in demo showcase. Multi-demo hub at `/`; first live demo: Support triage (`/support`), built from the AX10-Support Figma mock (fileKey `tfaGsKnwEINRLjF36qX0g4`). Other demos (ecommerce, analytics, booking, orders) still "Soon" cards. Own vite/tailwind/tsconfig (tokens copied from marketing; shared `ui` package not yet extracted). Paths under "Apps" below are relative to `packages/apps/`.

Root scripts: `dev:www`/`dev:apps`, `build:www`/`build:apps`, `build` (`pnpm -r build`), `lint`. Each package has `vercel.json` SPA rewrite → deploy one host project per subdomain.

## Marketing — what
AX10 marketing site. AI-first engineering boutique, Chennai. Single-page landing + legal/contact routes.
Stack: React 19, TypeScript, Vite 8, Tailwind 3, GSAP (ScrollTrigger/ScrollTo), motion (framer). pnpm only (`preinstall` enforces).
Alias `@` → `src`. Dark theme forced (`<html class="dark">`).
Component tree lives under `src/components/{layout,sections,effects,ui}/`.

## Scripts (per-package, run from that package dir, or via root `dev:www`/`dev:apps` etc.)
- `pnpm dev` — vite dev (5173)
- `pnpm build` — `tsc -b && vite build` → `dist/`
- `pnpm preview`
- `pnpm lint` — eslint

## Build config (vite.config.ts)
- Plugins: react, gzip + brotli compression.
- Manual chunks: `gsap`, `motion`, `icons` (lucide), `react-vendor` (react/react-dom/react-router), `vendor`.
- target es2020, cssMinify.

## Design tokens (tailwind.config.ts)
- Colors: primary `#69C991`, mint-bright `#9FFFB0`, surface-deep `#08090A` (bg), surface `#121415`, surface-raised `#16191B`, border-subtle `#24282B`, text-primary `#F5F2EB`, text-secondary `#ADB5BC`, text-muted `#8E979F`, brutal `#000`.
- Radius near-0 (brutalist): DEFAULT 0, lg 2px, xl 4px.
- Fonts: display=Instrument Serif; body/headline/display=Geist; mono/label=Geist Mono. Loaded via CDN in index.html. Material Symbols Outlined is icon-subset via `icon_names=` (only 10 icons shipped).
- Shadows: `brutal-*` hard offset shadows.
- Keyframes/anim: glow-drift, mesh-a/b/c/drift.

## CSS classes (src/index.css)
Component utils: `.type-display/.type-headline/.type-body/.type-label`, `.section-overlay` (edge fade), `.content-layer` (z-10), `.liquid-glass` + `.frosted-bar`/`.frosted-panel` (glassmorphism), `.custom-cursor-ring`, `.prose-legal *` (legal pages). `prefers-reduced-motion` kills anims + cursor + glass filter.

---

## Load / render flow
1. `index.html` → `src/main.tsx` — React root + `BrowserRouter`.
2. `src/App.tsx` — routes, lazy-loads 4 pages, owns `AppReadyContext`, AppLoader lifecycle, GSAP ScrollTrigger refresh.
3. `AppLoader` runs min 1200ms (`MIN_LOADER_MS`, waits fonts + load event) → `setLoading(false)` → `appReady=true`.
4. HomePage "/" mounts → `useAppReady` gates `HeroBlob`; `useCoarsePointer` gates the hero effect variant (skips heavy path on mobile); `LazyMount` gates Capabilities/WhyUs/Testimonials (IntersectionObserver 240px + idle fallback).
5. `ScrollThread` runs only after appReady on homepage.
6. Navbar/Footer/ScrollToTopButton on all routes (legal via PageLayout).

## Routes (src/App.tsx)
- `/` → `pages/HomePage.tsx`
- `/contact` → `pages/ContactPage.tsx` (form → formsubmit.co)
- `/privacy` → `pages/PrivacyPage.tsx`
- `/terms` → `pages/TermsPage.tsx`
All lazy. Fallback: `components/ui/RouteFallback.tsx`.

---

## File index

### Entry / context
| File | Role |
|------|------|
| `src/main.tsx` | React root + BrowserRouter |
| `src/App.tsx` | Routes, lazy pages, AppReady + loader lifecycle, ScrollTrigger refresh |
| `src/context/AppReadyContext.tsx` | bool ctx; true after loader; gates heavy canvas. `useAppReady` |

### Pages
| File | Role |
|------|------|
| `pages/HomePage.tsx` | "/"; lazy sections + CustomCursor; appReady gates HeroBlob |
| `pages/ContactPage.tsx` | contact form via formsubmit.co; uses CONTACT_EMAIL/SUPPORT_EMAIL |
| `pages/PrivacyPage.tsx` | legal content (prose-legal) |
| `pages/TermsPage.tsx` | legal content (prose-legal) |

### Layout
| File | Role |
|------|------|
| `components/layout/PageLayout.tsx` | legal-page wrapper: Navbar+Footer+ScrollToTopButton |
| `components/layout/Navbar.tsx` | sticky nav; navLinks[]; scrolled→frosted-bar; mobile drawer; Get Started CTA |
| `components/layout/Footer.tsx` | forwardRef emailRef; footerLinks[]; copyright |
| `components/layout/AppLoader.tsx` | cinematic preloader, min 1200ms (`MIN_LOADER_MS`), GSAP anims, `<LanternField enabled={visible} />` |
| `components/layout/CustomCursor.tsx` | lazy; GSAP quickSetter cursor 18→112px on card hover; gated coarse/reduced-motion |
| `components/layout/LazyMount.tsx` | IntersectionObserver 240px margin + requestIdleCallback/1200ms fallback |
| `components/layout/ScrollToTopButton.tsx` | fixed btn >480px scroll; scrollToTop() |

### Sections
| File | Role |
|------|------|
| `components/sections/HeroSection.tsx` | hero; GSAP stagger on mount; heroCopy |
| `components/sections/CapabilitiesSection.tsx` | capabilities grid + aside; LiquidGlassFilter; capabilities/capabilitiesIntro |
| `components/sections/capabilities/CapabilitiesAside.tsx` | pillar tabs, auto-rotate 5.2s; capabilityPillars |
| `components/sections/WhyUsSection.tsx` | wraps WhyUsAside + WhyUsCarousel + OurProcess |
| `components/sections/why-us/WhyUsAside.tsx` | single-line headline; whyUsProcess.headline |
| `components/sections/why-us/WhyUsCarousel.tsx` | infinite 3D deck carousel (motion); whyUsCards (5) |
| `components/sections/why-us/OurProcess.tsx` | 3 process cards, 3D tilt (gsap quickTo); whyUsProcess.steps |
| `components/sections/TestimonialsSection.tsx` | 3-col grid; DotGridCanvas bg; testimonials/testimonialsHeading |

### UI
| File | Role |
|------|------|
| `components/ui/BrutalButton.tsx` | link/button, 2 variants; props to/href/variant/onClick |
| `components/ui/BrutalCard.tsx` | card container + `SectionLabel` header badge |
| `components/ui/RouteFallback.tsx` | route loading spinner |

### Effects (canvas / CSS / SVG)
| File | Type | Draw fn / technique |
|------|------|---------------------|
| `components/effects/HeroBlob.tsx` | canvas | useCanvasSurface → `drawDitheredGlobe`; spinning dithered globe, pointer scale. `useCoarsePointer` caps buffer edge→440 + COARSE_FPS on mobile |
| `components/effects/LandingAtmosphere.tsx` | canvas | useCanvasSurface → `drawGradientField`; fixed bg, 4 washes, pointer/scroll pull |
| `components/effects/LanternField.tsx` | canvas | useCanvasSurface → inline; particle grid revealed by cursor lantern; `enabled` prop |
| `components/effects/DitherCanvas.tsx` | canvas | useCanvasLoop → inline; Bayer dither + wave field |
| `components/effects/DotGridCanvas.tsx` | canvas | useCanvasLoop → inline; pulsing dot lattice + vignette |
| `components/effects/HeatmapCanvas.tsx` | canvas | useCanvasLoop → inline; 4 radial heat blobs, additive |
| `components/effects/ScrollThread.tsx` | SVG | Catmull-Rom spline, scroll-driven stroke-dash; gsap.ScrollTrigger; portal to root |
| `components/effects/MeshGradient.tsx` | CSS | layered radial gradients, mesh-drift; intensity subtle/medium/bold |
| `components/effects/RadialGlow.tsx` | CSS | `RadialGlow` + `RadialMesh`; radial gradient + glow-drift |
| `components/effects/LiquidGlassFilter.tsx` | SVG | feTurbulence + feDisplacementMap refraction (`#liquid-glass-refract`) |
| `components/effects/SectionBackdrop.tsx` | wrapper | absolute z:0 container for stacking canvas layers |

### Hooks
| File | Role |
|------|------|
| `hooks/useCanvasSurface.tsx` | RAF loop sized to container ref. opts {maxBufferEdge=960, maxFps=60, pauseOnScroll, enabled}. ResizeObserver + IO(0.01) + scroll-idle 140ms. draw(ctx,w,h,t,dpr). PRIMARY |
| `hooks/useCanvasLoop.tsx` | RAF loop sized to section ancestor / `[data-section-backdrop]`. 48fps cap, 960px buffer. Reads canvasPause. Section backdrops |
| `hooks/useCoarsePointer.tsx` | `useCoarsePointer()` → bool; `matchMedia('(pointer: coarse)')` live. Gates expensive canvas on mobile (HeroBlob buffer/fps, HomePage hero variant) |

### Lib
| File | Role |
|------|------|
| `lib/gsap.ts` | exports {gsap, ScrollTrigger, ScrollToPlugin}; config limitCallbacks/ignoreMobileResize |
| `lib/scroll.ts` | `NAV_HEIGHT=64`, `scrollToSection`, `scrollToTop`; gsap scrollTo, disables/enables ScrollTrigger |
| `lib/canvasPause.ts` | global pause: `setCanvasPaused/isCanvasPaused/subscribeCanvasPause`; observer pattern |
| `lib/ditheredGlobe.ts` | `drawDitheredGlobe`; sphere projection + Bayer dither + precomputed graticule + FBM edge warp |
| `lib/gradientField.ts` | `drawGradientField`; 4 washes + vignette + film grain; pointer/scroll affinity |
| `lib/organicBlob.ts` | `drawOrganicAtmosphere/drawAtmosphereScene/drawGlassSphere/drawFilmGrain/drawOrganicScene`; fbm noise |

### Content (single source of copy)
`src/data/content.ts` — all marketing copy + nav:
- `navLinks` (What We Do/Why Us/Stories → #anchors), `footerLinks` (Privacy/Terms/Contact)
- `CONTACT_EMAIL=enquiries@ax10.in`, `SUPPORT_EMAIL=support@ax10.in`, `GENERAL_EMAIL=build@ax10.in` (footer inbox), `siteMeta`
- `heroCopy`, `capabilitiesIntro`, `capabilities` (3), `capabilityPillars` (3)
- `whyUsProcess` (headline+body+3 steps), `whyUsCards` (5 value props)
- `testimonials` (3, PLACEHOLDER), `testimonialsHeading`

---

## Apps package (`packages/apps/`)
Demo showcase for apps.ax10.in. Same design tokens as marketing (own `tailwind.config.ts` copy), no GSAP/canvas — plain React + Tailwind + `lucide-react`.

### Routes (`src/App.tsx`)
- `/` → `pages/Hub.tsx` — demo picker grid; live demos link out, pending ones show "Soon" and render inert.
- `/support` → `pages/SupportDemo.tsx` — AI-triage ticket workspace ("Themis Intel"), 4-column layout.
- `*` → `pages/ComingSoon.tsx` — legacy fallback (pre-Hub placeholder).

### Support demo (`/support`)
Source: Figma "AX10 Support" (fileKey `tfaGsKnwEINRLjF36qX0g4`, node `1:2`), pulled via Figma MCP `get_design_context`. Terminal/brutalist palette distinct from marketing tokens — literal Figma hexes used via Tailwind arbitrary values (`#0f1511`/`#181d19`/`#1c211d` surfaces, `#3e4941` borders, `#85e5ab`/`#69c991` mint accent, `#ffb4ab` danger, `#dfe4dd`/`#becabf` text). Static mock data only, no backend.

| File | Role |
|------|------|
| `data/tickets.ts` | mock `ticket` (active ticket + thread + AI panel data) + `queue` (4 tickets) + `queueNav` (sidebar filters) |
| `components/support/AppTopNav.tsx` | AX10 logo + Dashboard/Triage/Analytics/Team tabs (Triage active) + bell/settings/avatar |
| `components/support/QueueSidebar.tsx` | queue filters (All/My Queue/Urgent/Bugs/Feature Requests), NEW TICKET button, Help/Docs footer |
| `components/support/TicketQueuePanel.tsx` | LIVE_QUEUE list, priority badges (urgent/medium/low/resolved), active-ticket left-accent row |
| `components/support/ConversationThread.tsx` | ticket header (THEMIS_INTEL toggle), customer/agent message bubbles w/ inline code+danger token styling, dashed AI-suggestion card (APPLY_REPLY/REFINE), disabled command input footer |
| `components/support/ThemisIntelPanel.tsx` | AI aside: confidence bar, sentiment badge, automated summary (highlighted spans), recommended actions (danger-styled rollback), telemetry bar chart |

### Hub (`/`)
`pages/Hub.tsx` — card grid over `demos[]` (name/description/href/icon/live). Live demos wrapped in `<Link>`; pending ones plain `<div>` at 50% opacity with "Soon" tag.

---

## Canvas pipeline
`draw(ctx,width,height,time,dpr)` fn → hook (useCanvasSurface for containers / useCanvasLoop for sections) → RAF gated by visible (IO 0.01) + fps cap + pause.
- Global `setCanvasPaused()` kills useCanvasLoop draws during high-motion pins.
- `pauseOnScroll`: true on HeroBlob + LandingAtmosphere; false on LanternField.
- FPS: HeroBlob 60 (responsive buffer 520–720), LandingAtmosphere 20 (640), LanternField 40 (1000), section backdrops 48 (960).

## Notes / gotchas
- `dist/` is committed-in-tree but gitignored; build output, don't hand-edit.
- `Plan.md`, `.agents/`, `.cursor/`, `skills-lock.json`, `stitch-assets/` gitignored (IP/design refs).
- Testimonials are placeholders — replace before launch.
- SEO: og/twitter/JSON-LD in index.html; robots.txt + sitemap.xml in public/.
- Fonts CDN-loaded (Plan.md flags self-hosting as TODO).
