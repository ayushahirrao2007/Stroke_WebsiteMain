# Professional Code Review — StrokeAware Education Platform

**Reviewer:** Senior Frontend Engineer  
**Date:** February 23, 2026  
**Scope:** Full project analysis (Vanilla HTML/CSS/JS + React/Vite)

---

## Executive Summary

The project has **two parallel implementations** (vanilla and React) that are not properly integrated. The React app cannot run from the project root because the main `index.html` does not include the React mount point or script. There are critical bugs (broken buttons, wrong function names), navigation mismatches, and significant bloat. The codebase would not pass production readiness review at a typical software company.

---

## 1. UI/UX Problems

### 1.1 Broken VideoCard Button (Critical Bug)

**File:** `src/app/components/VideoCard.tsx` (lines 131-135)

```tsx
<button className="Brain Awareness Info Page\index.html">
  know more
</button>
```

**Problem:** The `className` is a file path, not CSS classes. This button has no styling and appears broken. It looks like a copy-paste error.

**Fix:** Replace with proper button styling, e.g.:
```tsx
<button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold transition-all">
  <Play size={16} />
  Know more
</button>
```

### 1.2 Missing Section IDs — Navigation Broken

**Files:** `src/app/components/Header.tsx`, `src/app/App.tsx`

**Problem:** Header links point to `#home`, `#courses`, `#resources`, `#about`, but **none of the React section components have `id` attributes**. Smooth scroll navigation will not work.

**Current:** `<a href="#home">`, `<a href="#resources">`, `<a href="#about">` — no targets exist.

**Fix:** Add `id` props to sections in `App.tsx`:
```tsx
<HeroSection id="home" />
<TrendingSection id="courses" />
<CategoriesSection id="categories" />
<TestimonialsSection id="testimonials" />
<ReasonsSection id="resources" />  // or create an About section
```

Also, `#resources` and `#about` have no corresponding sections. Either add sections or change nav links.

### 1.3 Inconsistent Header Nav Between Vanilla and React

**Vanilla** (`index.html`): Home, Courses, Categories, Testimonials  
**React** (`Header.tsx`): Home, Courses, Resources, About  

The React nav does not match section IDs or content. Categories and Testimonials exist in the app but are not in the React header.

### 1.4 Accessibility Issues

- **SignInModal**: When open, focus is not trapped inside the modal. Tab can escape to background content.
- **VideoCard**: Play/Pause/Add buttons lack `aria-label`. Screen readers get no context.
- **HeroSection**: 24 identical `<img>` elements with `alt=""` — decorative images should use `role="presentation"` or `aria-hidden="true"` and proper `alt` if meaningful.
- **TestimonialsSection**: Dot indicators have `aria-label` but carousel container has no `role="region"` or `aria-roledescription="carousel"`.
- **Skip to content**: No skip link for keyboard users.

### 1.5 Typography and Color

- Good use of CSS variables in vanilla styles.
- React relies heavily on Tailwind arbitrary values; no shared design tokens between components.
- Some text (e.g. `text-purple-900` on `purple-50` backgrounds) may not meet WCAG contrast ratios.

### 1.6 Footer Contact Info

**File:** `Footer.tsx` (line 71)

```tsx
<span>Medical Education Center<br />123 Health Street, Suite 456</span>
```

Using `<br />` inside a `<span>` works but is brittle. Consider a proper block element or separate lines.

---

## 2. Responsiveness Issues

### 2.1 VideoCard Hover on Touch Devices

**File:** `src/app/components/VideoCard.tsx`

**Problem:** Hover states (`onMouseEnter`/`onMouseLeave`) don’t work well on touch. On mobile, “Know more” and other controls may never appear.

**Fix:** Add touch handlers or use `@media (hover: hover)` so desktop gets hover behavior and touch gets tap-to-toggle.

### 2.2 TrendingSection Arrows Hidden on Mobile

**File:** `src/app/components/TrendingSection.tsx` (lines 91-95, 124-129)

```tsx
className="... opacity-0 group-hover:opacity-100 ..."
```

**Problem:** Arrows only show on `group-hover`. On touch devices there is no hover, so arrows stay invisible and horizontal scroll is not discoverable.

**Fix:** Show arrows on touch (`@media (pointer: coarse)`) or always show them on smaller screens.

### 2.3 HeroSection Grid Performance on Mobile

**File:** `src/app/components/HeroSection.tsx` (lines 17-31)

Renders **24 `<img>` elements** in a grid. On slow mobile connections this can cause layout shifts and slow load.

**Fix:** Use CSS `background-image`, a single image, or lazy-load images with `loading="lazy"`.

### 2.4 CategoriesSection Fixed Height

**File:** `src/app/components/CategoriesSection.tsx`

Cards use `h-48` (fixed height). On very small screens or with long titles, content can overflow.

### 2.5 Modal on Small Screens

**File:** `src/app/components/SignInModal.tsx`

Uses `max-w-md w-full p-4`. On very narrow viewports the modal can feel cramped. The vanilla `responsive.css` uses `width: 95%` at 480px; the React modal does not.

---

## 3. Code Quality Problems

### 3.1 Vanilla: Broken Function Name (Critical)

**File:** `scripts/main.js` (line 177)

```javascript
onclick="Playvideo('${card.title}')"
```

**Defined as:** `function playVideo(title)` (line 240)

**Problem:** `Playvideo` ≠ `playVideo`. JavaScript is case-sensitive. Clicking “know More” throws `Playvideo is not defined` and does nothing.

### 3.2 Vanilla: Corrupted SVG in Template

**File:** `scripts/main.js` (lines 176-224)

The `viewBox` attribute has dozens of blank lines:

```javascript
viewBox="0 0 24 24
                        
                        
                        
... (50+ blank lines)
                        
                    "
```

**Problem:** Invalid SVG, potential layout/rendering issues. Likely accidental paste/merge.

**Fix:** Use `viewBox="0 0 24 24"` only.

### 3.3 Duplicate Data

Video cards, categories, testimonials, and progress data exist in:

- `scripts/data.js` (vanilla)
- `src/app/components/TrendingSection.tsx` (courses)
- `src/app/components/CategoriesSection.tsx` (categories)
- `src/app/components/TestimonialsSection.tsx` (testimonials)
- `src/app/components/ProgressDashboard.tsx` (progress)

**Problem:** No single source of truth. Changes must be made in multiple places, increasing bugs and maintenance.

**Fix:** Centralize in `src/data/` (e.g. `courses.ts`, `categories.ts`) and import where needed. Vanilla can use a build step or shared JSON.

### 3.4 Inline Styles and Hardcoded Values

**Examples:**

- `scripts/main.js` line 137: `left: -340` — magic number, should be derived from card width.
- `ProgressDashboard.tsx` line 71: `progress += 2` and `setInterval(..., 20)` — magic numbers.
- `VideoCard.tsx` line 80: `style={{ WebkitTextStroke: '3px white' }}` — could live in CSS.

### 3.5 Unused/Orphaned Code

**File:** `scripts/main.js` (lines 421-436)

`initScrollAnimations()` is defined and called via `setTimeout(initScrollAnimations, 100)`, but it observes `.video-card`, `.category-card`, etc. These are rendered by `renderVideoCards()` and `initCategories()`, which run on `DOMContentLoaded`. The timing may work by luck but is fragile.

### 3.6 ProgressDashboard useEffect Stale Closure

**File:** `src/app/components/ProgressDashboard.tsx` (lines 62-87)

The `useEffect` uses `courses` and `setAnimatedProgress` but does not list `courses` in the dependency array. If `courses` ever becomes dynamic, this will use stale data. Add `courses` to the dependency array or memoize.

### 3.7 global Functions in Vanilla JS

**File:** `scripts/main.js`

`playVideo`, `addToList`, `continueCourse`, `goToTestimonial` are global. This pollutes `window` and risks conflicts.

**Fix:** Attach handlers via `addEventListener` instead of `onclick` in templates.

---

## 4. Performance Problems

### 4.1 All VideoCards Load the Same Video

**File:** `src/app/components/VideoCard.tsx` (line 64)

```tsx
<source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
```

**Problem:** Every card loads the same 10MB+ video. With 5 cards that’s 50MB+ downloaded on hover.

**Fix:** Use per-course video URLs, or use poster/thumbnail only and load video on click.

### 4.2 HeroSection: 24 Full-Size Images

**File:** `src/app/components/HeroSection.tsx`

24 Unsplash images at `w=1080` are requested immediately. Even with caching, this is heavy.

**Fix:** Use a single background image, lower resolution, or CSS gradients/patterns.

### 4.3 No Image Optimization

Images use raw Unsplash URLs. No `srcset`, `sizes`, or responsive variants.

**Fix:** Use responsive images or an image CDN (e.g. Unsplash with `w=400` for thumbnails).

### 4.4 Heavy Dependency Set

**File:** `package.json`

Includes MUI, Emotion, recharts, react-slick, react-dnd, cmdk, vaul, and many Radix components. Only a subset (e.g. vaul, cmdk, recharts) appear in `src/`. MUI and Emotion are unused.

**Impact:** Larger bundle, slower installs, more security surface.

**Fix:** Remove unused deps: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `react-slick`, `react-dnd`, `react-dnd-html5-backend` if not used.

### 4.5 Testimonials Auto-Rotate Without Cleanup

**File:** `scripts/main.js` (lines 341-346)

```javascript
setInterval(() => { ... }, 5000);
```

**Problem:** Interval is never cleared. If the component were ever destroyed (e.g. SPA navigation), it would keep running.

---

## 5. Maintainability Issues

### 5.1 Two Implementations, No Clear Entry Point

The repo has:

- **Vanilla:** `index.html` + `styles/` + `scripts/`
- **React:** `src/` + Vite + Tailwind

The root `index.html` does **not** include `<div id="root">` or `<script type="module" src="/src/main.tsx"></script>`. So `npm run dev` serves the vanilla site only. The React app is only wired up in `Brain Awareness Info Page (1)/index.html`, which is a separate sub-project.

**Impact:** The React implementation cannot be run from the main project root. This is a critical architectural flaw.

**Fix:** Either:

1. Make the React app the primary: add `#root` and the script to root `index.html`, or
2. Use a separate `react.html` entry and routing, or
3. Remove one implementation and consolidate.

### 5.2 Inconsistent Naming

- `Playvideo` vs `playVideo` (bug)
- "know More" vs "Know more" (inconsistent casing)
- `stroke-width` vs `strokeWidth` in SVG (HTML attribute vs React prop)

### 5.3 Shadcn UI Usage

`src/app/components/ui/` contains 45+ shadcn components. The main app uses only a few (e.g. from `lucide-react`). Many are unused.

**Fix:** Audit usage and remove unused components to simplify maintenance.

### 5.4 No Shared Constants

 URLs like `https://images.unsplash.com/...` and `https://commondatastorage.googleapis.com/...` are repeated. No env or config for API/image base URLs.

### 5.5 Folder Structure

```
src/app/components/
  - Header.tsx, HeroSection.tsx, ...
  - figma/ImageWithFallback.tsx   # "figma" folder is unclear
  - ui/  # 45+ shadcn components
```

`figma/` is ambiguous. Consider `shared/` or `common/` for reusable utilities.

---

## 6. Security Concerns

### 6.1 innerHTML / XSS Risk (Low Current, Bad Practice)

**File:** `scripts/main.js`

- `renderVideoCards()`: `innerHTML` with template literals and `card.title`, `card.description`, `card.image`.
- `initCategories()`, `renderTestimonial()`, `initProgress()`: same pattern.

**Current risk:** Data comes from `data.js`, so it’s controlled. If this data ever comes from users or an API, it becomes an XSS vector.

**Fix:** Prefer `createElement`/`appendChild` or React’s JSX. If HTML is required, sanitize (e.g. DOMPurify).

### 6.2 Form Handling

**Files:** `SignInModal.tsx`, `HeroSection.tsx`, vanilla sign-in form

- No CSRF tokens (acceptable for demo).
- No rate limiting on client (would be server-side).
- Passwords sent in memory only; no `autocomplete` guidance for password managers.

### 6.3 External Resources

Unsplash and Google Cloud Storage URLs are hardcoded. If domains change or are compromised, the app has no central place to update.

---

## 7. Missing Real-World Features

### 7.1 Loading States

- No skeletons or spinners for images or sections.
- Video load is invisible; users get no feedback.

### 7.2 Error States

- No 404 or error boundary.
- No error UI for failed image load (e.g. `ImageWithFallback` exists but is not used in `VideoCard`).
- No handling for video load failure.

### 7.3 Form Validation

- HeroSection and SignInModal: HTML5 `required` and `type="email"` only.
- No inline validation messages, strength indicator, or API validation feedback.

### 7.4 SEO

**File:** `index.html` (vanilla)

- Has `<meta name="description">`.
- Missing: `og:image`, `og:title`, `og:description`, `twitter:card`, canonical URL, structured data.

**React:** Single-page app with no SSR. Title/description are static. Consider React Helmet or similar for dynamic meta.

### 7.5 Analytics / Tracking

No placeholders for analytics (e.g. page views, CTA clicks).

### 7.6 Favicon

`public/favicon.svg` exists but is not referenced in the React entry. Vanilla `index.html` has no favicon link.

### 7.7 Focus Management (Modals)

SignInModal does not trap focus. Users can tab out of the modal to the page behind it.

### 7.8 Keyboard Navigation

Carousels and video cards are not keyboard-navigable (arrow keys, Enter to activate).

---

## Top 10 Priority Fixes

| # | Priority | Issue | File(s) | Effort |
|---|----------|-------|---------|--------|
| 1 | P0 | React app cannot run from root — add `#root` + script to `index.html` | `index.html` | 5 min |
| 2 | P0 | Fix VideoCard broken button className | `VideoCard.tsx:132` | 2 min |
| 3 | P0 | Fix `Playvideo` → `playVideo` in vanilla template | `scripts/main.js:177` | 1 min |
| 4 | P0 | Fix corrupted SVG viewBox in main.js | `scripts/main.js:176-224` | 2 min |
| 5 | P1 | Add section `id`s and fix header nav links | `App.tsx`, `Header.tsx`, section components | 15 min |
| 6 | P1 | Fix SignInModal focus trap + Escape to close | `SignInModal.tsx` | 20 min |
| 7 | P1 | Replace innerHTML with DOM APIs or sanitize | `scripts/main.js` | 30 min |
| 8 | P1 | Remove duplicate video loading (one video per card) | `VideoCard.tsx` | 20 min |
| 9 | P2 | Add loading/error states for images and forms | Multiple components | 1–2 hrs |
| 10 | P2 | Remove unused dependencies (MUI, Emotion, etc.) | `package.json` | 10 min |

---

## Action Plan for Junior Developer

### Week 1: Critical Fixes (Must Do)

1. **Enable React app (Day 1)**  
   - In root `index.html`, add `<div id="root"></div>` before `</body>`.  
   - Add `<script type="module" src="/src/main.tsx"></script>`.  
   - Decide whether vanilla or React is primary. If React is primary, you may need to move/merge content.

2. **Fix VideoCard button (Day 1)**  
   - In `VideoCard.tsx`, replace `className="Brain Awareness Info Page\index.html"` with proper button classes.  
   - Add `<Play>` icon and an `onClick` handler.

3. **Fix vanilla JS bugs (Day 1)**  
   - In `scripts/main.js`: change `Playvideo` to `playVideo` in the template.  
   - Fix the SVG `viewBox` (remove extra whitespace, use `viewBox="0 0 24 24"`).

4. **Fix navigation (Day 2)**  
   - Add `id="home"`, `id="courses"`, `id="categories"`, `id="testimonials"` to the corresponding section components.  
   - Update `Header.tsx` so links match these IDs (e.g. add Categories and Testimonials, fix Resources/About).

### Week 2: UX and Accessibility

5. **Modal improvements (Day 3)**  
   - Trap focus in SignInModal when open.  
   - Close on Escape (if not already).  
   - Restore focus to trigger when closed.

6. **Touch-friendly carousel (Day 4)**  
   - Make TrendingSection arrows visible on touch devices.  
   - Ensure VideoCard controls are reachable without hover.

7. **Basic loading/error states (Day 5)**  
   - Use `ImageWithFallback` in `VideoCard` for failed images.  
   - Add a simple loading state for the hero/form submit.

### Week 3: Code Quality and Performance

8. **Centralize data (Day 6)**  
   - Create `src/data/courses.ts`, `categories.ts`, etc.  
   - Import in components.  
   - For vanilla, consider a shared JSON or build step.

9. **Reduce bundle size (Day 7)**  
   - Run `npm run build` and analyze bundle.  
   - Remove MUI, Emotion, react-slick, react-dnd if unused.  
   - Uninstall and verify the app still works.

10. **Video performance (Day 8)**  
    - Remove auto-loading of the same video in every VideoCard.  
    - Use poster/thumbnail only, and load video on explicit play click.

### Week 4: Polish

11. Add basic SEO meta tags (Open Graph, Twitter).  
12. Add favicon link to the HTML.  
13. Run a Lighthouse audit and fix obvious issues.  
14. Document which version (vanilla vs React) is the primary app and how to run each.

---

## Conclusion

The project has a solid visual direction and component structure, but there are critical bugs (broken buttons, wrong function names, React not runnable from root), duplication (vanilla + React), and missing production concerns (loading, errors, accessibility, SEO). Addressing the top 10 fixes and following the 4-week action plan will bring it much closer to production quality.
