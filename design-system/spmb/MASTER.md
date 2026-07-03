# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** SPMB SD Plus 3 Al-Muhajirin
**Generated:** 2026-07-03
**Category:** Education (SaaS)
**Style:** Modern Minimalism (Warm Teal)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#0D9488` | `--color-primary-600` | CTA Utama, Active states |
| Primary Light | `#14B8A6` | `--color-primary-500` | Hover states, Progress bar |
| Accent | `#D97706` | `--color-accent-600` | Badge, Notifications, Secondary CTA |
| Success | `#16A34A` | `--color-success-600` | Valid, Approved status |
| Warning | `#EA580C` | `--color-warning-600` | Pending, Action required |
| Danger | `#DC2626` | `--color-danger-600` | Rejected, Error |
| Background | `#FAFBFC` | `--color-bg` | Main body background (clean, no gradient) |
| Surface | `#FFFFFF` | `--color-surface` | Cards (solid white) |
| Text | `#1A2B3C` | `--color-text` | Headings |
| Text Secondary | `#5A6B7C` | `--color-text-secondary`| Body text, labels |

### Typography

- **Heading Font:** Plus Jakarta Sans
- **Body Font:** Plus Jakarta Sans
- **Mono Font:** JetBrains Mono (For registration numbers only)
- **Mood:** Modern, friendly, professional, clean
- **Google Fonts:** Plus Jakarta Sans, JetBrains Mono

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |

### Shadow Depths (Clean/Solid)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | Subtle 1px | Inputs, small buttons |
| `--shadow-sm` | Small soft | Cards (default), dropdowns |
| `--shadow-md` | Medium soft | Cards (elevated/hover), modals |
| `--shadow-lg` | Large soft | Popovers, major layered UI |

---

## Style Guidelines

**Style:** Modern Minimalism (Warm Teal)

**Keywords:** Clean, solid surfaces, ample whitespace, warm accents, accessible contrast, friendly typography.

**Best For:** Education platforms, modern SaaS, consumer-facing admin dashboards.

**Key Effects:** Clean solid borders, subtle soft shadows, rounded corners (radius-lg to radius-xl), spring animations for interactions.

### Page Pattern

**Pattern Name:** Clean Admin Dashboard

- **Conversion Strategy:** Clear visual hierarchy, action-oriented.
- **CTA Placement:** Top right headers, inline table actions.
- **Section Order:** 1. Sidebar (white + active teal), 2. Top Header (clean), 3. KPI Cards (solid), 4. Main content (tables/forms in solid cards).

---

## Anti-Patterns (Do NOT Use)

- ❌ **Glassmorphism / Blurs:** No backdrop-filter blurs, no transparent surface backgrounds. Use solid `#FFFFFF` cards.
- ❌ **Gradient Mesh Backgrounds:** Use solid clean background `#FAFBFC`.
- ❌ **Emojis as icons:** Use SVG icons (Phosphor Icons preferred).
- ❌ **Missing cursor:pointer:** All clickable elements must have cursor:pointer.
- ❌ **Layout-shifting hovers:** Avoid scale transforms that shift layout. Use subtle shadows or small `translateY(-1px)`.
- ❌ **Low contrast text:** Maintain 4.5:1 minimum contrast ratio.
- ❌ **Instant state changes:** Always use transitions (150-300ms).

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] Background is clean and solid (no gradient meshes).
- [ ] Cards have solid white backgrounds and subtle borders/shadows.
- [ ] Typography uses Plus Jakarta Sans.
- [ ] Emojis have been replaced with Phosphor Icons.
- [ ] `cursor-pointer` on all clickable elements.
- [ ] Hover states with smooth transitions.
- [ ] Text contrast meets minimum standards.
