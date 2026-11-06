---
name: Academic Session & Advisory Portal
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#45464d'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#525e7d'
  primary: '#000a24'
  on-primary: '#ffffff'
  primary-container: '#14213d'
  on-primary-container: '#7c89aa'
  inverse-primary: '#b9c6ea'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000e02'
  on-tertiary: '#ffffff'
  tertiary-container: '#00280c'
  on-tertiary-container: '#079e46'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b9c6ea'
  on-primary-fixed: '#0d1b36'
  on-primary-fixed-variant: '#3a4664'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: '0'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a dignified, authoritative, and frictionless environment tailored to high-level academic advisory, engineering mentorship, and student-faculty engagement. Drawing inspiration from classical collegiate rigor, elite research institutions, and modern executive consulting portals, the interface projects professional mastery and intellectual clarity.

### Aesthetic Principles
- **Scholarly Authority:** Balanced structural grids, deliberate typographic hierarchy, and refined micro-details project competence and institutional respect.
- **Architectural Minimalism:** Functional elegance takes precedence over ornamental noise. Generous negative space, precise alignment, and quiet framing reduce cognitive load for students and visiting researchers alike.
- **Academic Warmth & Legibility:** Crisp contrast and considered proportions ensure long reading sessions, schedule management, and detailed research reviews remain effortless.

## Colors

The palette grounds the interface in intellectual rigor and executive professionalism, paired with accessible functional accents.

### Color Tokens & Roles
- **Primary Deep Navy (`#14213D`):** Primary branding, master navigation bars, high-prominence headers, and executive action states. Communicates gravitas and institutional stability.
- **Secondary Academic Blue (`#2563EB`):** Interactive highlights, active appointment slots, text links, selected states, and progressive disclosure indicators.
- **Tertiary Forest Green (`#16A34A`):** Confirmation banners, confirmed session tags, approved peer reviews, and positive institutional statuses.
- **Neutral Slate Text (`#1E293B`):** Body typography, subheadings, and structural lines, providing high-contrast readability without the harshness of pure black.
- **Surface Canvas (`#F8FAFC`):** Soft, non-glare institutional background that softens optical fatigue over extended working sessions.
- **Card Surface (`#FFFFFF`):** Pure crisp white for elevated cards, schedule modals, consultation notes, and form sheets.
- **Critical / Error Crimson (`#DC2626`):** Conflict notices, cancelled advisory sessions, and validation alerts.
- **Subtle Border Rule (`#E2E8F0`):** Hairline boundary framing for cards, calendar grids, and tabular rosters.

## Typography

The typographic strategy balances academic heritage with modern technical utility.

- **Editorial Headings (`Newsreader`):** Used for institutional headers, page titles, professor biographies, and primary session categories. The serif structure evokes university publications, published theses, and classic textbooks.
- **System Interface & Data (`Inter`):** Applied across administrative forms, scheduling modules, data tables, labels, and timestamps. It guarantees extreme precision and legibility at micro sizes.
- **Typographic Discipline:** Never italicize sans-serif metadata. Reserve italics solely for scholarly book titles, paper excerpts, or formal quotes within serif text blocks.

## Layout & Spacing

The portal adheres to a structured 12-column responsive layout system that balances dense technical agendas with clear breathing room.

### Layout Mechanics
- **Desktop (1280px and above):** 12-column grid, max-width `1280px`, centered with `3rem` margins and `1.5rem` gutters. Asymmetric splits (e.g., 4 columns for Professor profile/office hours schedule, 8 columns for session booking and case review logs) maintain clear contextual orientation.
- **Tablet (768px – 1024px):** 8-column grid with `2rem` margins. Side panels collapse into contextual collapsible headers or top tabs.
- **Mobile (Below 768px):** Single-column stack with `1.25rem` outer margins. Slot pickers and weekly calendar views switch to sequential agenda carousels or vertical day-blocks.
- **Rhythm:** Spacing follows strict multiples of 4px/8px, prioritizing vertical alignment between calendar slots, advisory subject rows, and student identity tiles.

## Elevation & Depth

Visual hierarchy relies primarily on structural line boundaries paired with delicate, high-diffusion ambient shadows. This keeps the environment grounded, avoiding distracting artificial glow.

### Tonal Tiers
- **Tier 0 (Base Canvas):** Light Slate Canvas (`#F8FAFC`). Flat, unshadowed.
- **Tier 1 (Resting Cards & Dividers):** Pure White (`#FFFFFF`) with a 1px crisp border (`#E2E8F0`) and an ambient micro-shadow: `0 1px 3px rgba(20, 33, 61, 0.04), 0 1px 2px rgba(20, 33, 61, 0.02)`.
- **Tier 2 (Interactive Hover & Session Slots):** Raised card state on hover or selection: `0 4px 12px -2px rgba(20, 33, 61, 0.08), 0 2px 6px -1px rgba(20, 33, 61, 0.04)`. Border shifts subtly toward Academic Blue tint (`#CBD5E1`).
- **Tier 3 (Floating Overlays & Dialog Sheets):** Booking confirmation dialogs, quick message modals, and schedule overrides: `0 20px 25px -5px rgba(20, 33, 61, 0.1), 0 8px 10px -6px rgba(20, 33, 61, 0.06)`, framed in a `#E2E8F0` border.

## Shapes

The design system employs a soft, restrained geometry (`roundedness: 1`). 

- Standard inputs, session cards, action buttons, and calendar day cells use `0.25rem` (4px) radii.
- Modals, popovers, and primary dashboard hero containers utilize `0.5rem` (8px) radii.
- Circular treatment is strictly limited to avatar badges, status indicators, and notification pips.
- This controlled angularity reinforces precision, engineering accuracy, and traditional print geometry over informal consumer styling.

## Components

### Buttons
- **Primary Button:** Background Deep Navy (`#14213D`), text White (`#FFFFFF`), border radius `4px`, padding `10px 20px`, typography `label-md`. Hover state shifts to a refined navy tint (`#1F2F52`).
- **Secondary Button:** Surface White (`#FFFFFF`), 1px solid border (`#CBD5E1`), text Slate (`#1E293B`). On hover, background shifts to `#F1F5F9` with border `#94A3B8`.
- **Accent Action:** Academic Blue (`#2563EB`) filled button reserved specifically for immediate appointment confirmations and meeting dispatch actions.

### Cards & Session Tiles
- White canvas bounded by 1px `#E2E8F0`. 
- Header areas feature `headline-md` or `title-md` paired with a categorical badge.
- Interactive calendar tiles feature a left-accent status bar: 3px solid striping in Academic Blue (scheduled), Forest Green (completed), or Crimson (cancelled).

### Status Chips & Badges
- Compact pills using `label-sm` with upper/sentence casing.
- **Approved / Completed:** Background `#F0FDF4`, border `#BBF7D0`, text `#16A34A`.
- **Upcoming / Confirmed:** Background `#EFF6FF`, border `#BFDBFE`, text `#2563EB`.
- **Office Hour Slot / Pending:** Background `#F8FAFC`, border `#E2E8F0`, text `#475569`.
- **Cancelled / Rescheduled:** Background `#FEF2F2`, border `#FECACA`, text `#DC2626`.

### Form Fields & Inputs
- Height 42px, background `#FFFFFF`, border 1px `#CBD5E1`, text `#1E293B`, radius `4px`.
- Placeholder text in `#94A3B8`. Focus state applies a crisp 1px ring in Academic Blue (`#2563EB`) with a subtle matching offset, maintaining high contrast without blurring.

### Lists & Rosters
- Structured rows separated by hairline `#F1F5F9` borders.
- Hover states transition the row background to `#F8FAFC`.
- Student metadata (Roll No, Capstone Group, Subject Matter) arranged in monospaced or structured tabular `Inter` layout.

### Academic Appointment Scheduler
- Segmented grid showing 30-minute and 60-minute time intervals.
- Unavailable slots: `#F1F5F9` background with subdued slash pattern or low-contrast `#94A3B8` strike.
- Active slot selection: Deep Navy border with soft `#EFF6FF` wash.