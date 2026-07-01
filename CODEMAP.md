# CODEMAP — ax10

Repo index for fast lookup. Regenerate after big structure changes. Paths from repo root.

## What
AX10 marketing site. AI-first engineering boutique, Chennai. Single-page landing + legal/contact routes.
Stack: React 19, TypeScript, Vite 8, Tailwind 3, GSAP (ScrollTrigger/ScrollTo), motion (framer). pnpm only (`preinstall` enforces).
Alias `@` → `src`. Dark theme forced (`<html class="dark">`).

## Scripts
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
- Fonts: display=Instrument Serif; body/headline/display=Geist; mono/label=Geist Mono. Loaded via CDN in index.html.
- Shadows: `brutal-*` hard offset shadows.
- Keyframes/anim: glow-drift, mesh-a/b/c/drift.

## CSS classes (src/index.css)
Component utils: `.type-display/.type-headline/.type-body/.type-label`, `.section-overlay` (edge fade), `.content-layer` (z-10), `.liquid-glass` + `.frosted-bar`/`.frosted-panel` (glassmorphism), `.custom-cursor-ring`, `.prose-legal *` (legal pages). `prefers-reduced-motion` kills anims + cursor + glass filter.

---

## Load / render flow
1. `index.html` → `src/main.tsx` — React root + `BrowserRouter`.
2. `src/App.tsx` — routes, lazy-loads 4 pages, owns `AppReadyContext`, AppLoader lifecycle, GSAP ScrollTrigger refresh.
3. `AppLoader` runs min 2200ms (waits fonts + load event) → `setLoading(false)` → `appReady=true`.
4. HomePage "/" mounts → `useAppReady` gates `HeroBlob`; `LazyMount` gates Capabilities/WhyUs/Testimonials (IntersectionObserver 240px + idle fallback).
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
| `layout/PageLayout.tsx` | legal-page wrapper: Navbar+Footer+ScrollToTopButton |
| `layout/Navbar.tsx` | sticky nav; navLinks[]; scrolled→frosted-bar; mobile drawer; Get Started CTA |
| `layout/Footer.tsx` | forwardRef emailRef; footerLinks[]; copyright |
| `layout/AppLoader.tsx` | cinematic preloader, min 2200ms, GSAP anims, lazy LanternField |
| `layout/CustomCursor.tsx` | lazy; GSAP quickSetter cursor 18→112px on card hover; gated coarse/reduced-motion |
| `layout/LazyMount.tsx` | IntersectionObserver 240px margin + requestIdleCallback/1200ms fallback |
| `layout/ScrollToTopButton.tsx` | fixed btn >480px scroll; scrollToTop() |

### Sections
| File | Role |
|------|------|
| `sections/HeroSection.tsx` | hero; GSAP stagger on mount; heroCopy |
| `sections/CapabilitiesSection.tsx` | capabilities grid + aside; LiquidGlassFilter; capabilities/capabilitiesIntro |
| `sections/capabilities/CapabilitiesAside.tsx` | pillar tabs, auto-rotate 5.2s; capabilityPillars |
| `sections/WhyUsSection.tsx` | wraps WhyUsAside + WhyUsCarousel + OurProcess |
| `sections/why-us/WhyUsAside.tsx` | single-line headline; whyUsProcess.headline |
| `sections/why-us/WhyUsCarousel.tsx` | infinite 3D deck carousel (motion); whyUsCards (5) |
| `sections/why-us/OurProcess.tsx` | 3 process cards, 3D tilt (gsap quickTo); whyUsProcess.steps |
| `sections/TestimonialsSection.tsx` | 3-col grid; DotGridCanvas bg; testimonials/testimonialsHeading |

### UI
| File | Role |
|------|------|
| `ui/BrutalButton.tsx` | link/button, 2 variants; props to/href/variant/onClick |
| `ui/BrutalCard.tsx` | card container + `SectionLabel` header badge |
| `ui/RouteFallback.tsx` | route loading spinner |

### Effects (canvas / CSS / SVG)
| File | Type | Draw fn / technique |
|------|------|---------------------|
| `effects/HeroBlob.tsx` | canvas | useCanvasSurface → `drawDitheredGlobe`; spinning dithered globe, pointer scale |
| `effects/LandingAtmosphere.tsx` | canvas | useCanvasSurface → `drawGradientField`; fixed bg, 4 washes, pointer/scroll pull |
| `effects/LanternField.tsx` | canvas | useCanvasSurface → inline; particle grid revealed by cursor lantern |
| `effects/DitherCanvas.tsx` | canvas | useCanvasLoop → inline; Bayer dither + wave field |
| `effects/DotGridCanvas.tsx` | canvas | useCanvasLoop → inline; pulsing dot lattice + vignette |
| `effects/HeatmapCanvas.tsx` | canvas | useCanvasLoop → inline; 4 radial heat blobs, additive |
| `effects/ScrollThread.tsx` | SVG | Catmull-Rom spline, scroll-driven stroke-dash; gsap.ScrollTrigger; portal to root |
| `effects/MeshGradient.tsx` | CSS | layered radial gradients, mesh-drift; intensity subtle/medium/bold |
| `effects/RadialGlow.tsx` | CSS | `RadialGlow` + `RadialMesh`; radial gradient + glow-drift |
| `effects/LiquidGlassFilter.tsx` | SVG | feTurbulence + feDisplacementMap refraction (`#liquid-glass-refract`) |
| `effects/SectionBackdrop.tsx` | wrapper | absolute z:0 container for stacking canvas layers |

### Hooks
| File | Role |
|------|------|
| `hooks/useCanvasSurface.tsx` | RAF loop sized to container ref. opts {maxBufferEdge=960, maxFps=60, pauseOnScroll, enabled}. ResizeObserver + IO(0.01) + scroll-idle 140ms. draw(ctx,w,h,t,dpr). PRIMARY |
| `hooks/useCanvasLoop.tsx` | RAF loop sized to section ancestor / `[data-section-backdrop]`. 48fps cap, 960px buffer. Reads canvasPause. Section backdrops |

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
- `CONTACT_EMAIL=enquiries@ax10.in`, `SUPPORT_EMAIL=support@ax10.in`, `siteMeta`
- `heroCopy`, `capabilitiesIntro`, `capabilities` (3), `capabilityPillars` (3)
- `whyUsProcess` (headline+body+3 steps), `whyUsCards` (5 value props)
- `testimonials` (3, PLACEHOLDER), `testimonialsHeading`

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
