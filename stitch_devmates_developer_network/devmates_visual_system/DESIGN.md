---
name: DevMates Visual System
colors:
  surface: '#0e1511'
  surface-dim: '#0e1511'
  surface-bright: '#343b36'
  surface-container-lowest: '#09100c'
  surface-container-low: '#161d19'
  surface-container: '#1a211d'
  surface-container-high: '#242c27'
  surface-container-highest: '#2f3632'
  on-surface: '#dde4dd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dde4dd'
  inverse-on-surface: '#2b322d'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#89ceff'
  on-secondary: '#00344d'
  secondary-container: '#00a2e6'
  on-secondary-container: '#00344e'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#0e1511'
  on-background: '#dde4dd'
  surface-variant: '#2f3632'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for a high-performance developer environment, prioritizing utility, clarity, and technical precision. The brand personality is grounded, professional, and growth-oriented, avoiding the over-saturated tropes of "gaming" aesthetics in favor of a refined "Integrated Development Environment" (IDE) feel.

The style is a hybrid of **Minimalism** and **Technical Professionalism**. It utilizes a dark-first color strategy to reduce eye strain during long sessions. The aesthetic leverages subtle terminal-inspired cues—such as monospaced metadata and crisp borders—to evoke a sense of productivity and technical mastery. The visual language should feel like an extension of a developer's favorite code editor: predictable, efficient, and sophisticated.

## Colors
The palette is rooted in a deep "GitHub-inspired" dark mode. The **Primary Emerald** represents growth and successful builds, while the **Secondary Cyan** provides technical contrast for interactive elements and navigation. 

- **Backgrounds:** Use the deep navy-black for the main canvas to create maximum depth.
- **Surfaces:** Use the lighter surface hex for cards, modals, and navigation bars to create a layered hierarchy.
- **Borders:** Every container must use the defined border hex to maintain structural clarity without high-contrast distractions.
- **Status:** Use semantic colors (success, error, warning) sparingly for git-inspired indicators like commit statuses, build alerts, or accountability streaks.

## Typography
The typography system distinguishes between UI interaction and technical context.

- **Headlines (Geist):** Used for page titles and section headers. The tight letter-spacing and geometric clarity provide a modern, technical feel.
- **Body (Inter):** Used for all primary reading experiences. It is chosen for its exceptional legibility in dark mode and high-density layouts.
- **Technical Metadata (JetBrains Mono):** Reserved for tags, timestamps, code snippets, git hashes, and "system" labels. This differentiates static UI from dynamic, developer-generated data.
- **Scale:** Maintain a strict vertical rhythm. Large headlines should scale down by roughly 20% on mobile devices to preserve screen real estate.

## Layout & Spacing
The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout is inspired by high-density IDEs, where information density is prioritized over excessive white space.

- **Grid Logic:** Use a 16px gutter as the standard separator for grid items. 
- **Rhythm:** All margins and paddings must be multiples of 4px. 
- **Density:** Provide "Comfortable" (16px padding) and "Compact" (8px padding) variants for components like lists and tables to accommodate data-heavy views.
- **Reflow:** On mobile, sidebars collapse into a bottom navigation bar or a drawer, and multi-column dashboards stack vertically.

## Elevation & Depth
In this dark-themed system, elevation is conveyed through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.

- **Layers:** The background is the lowest level. Surface containers (cards, sidebars) sit one level above. Modals and dropdowns sit at the highest level and use a slightly lighter background (#1C2128) to signify prominence.
- **Borders:** Every elevated element must have a 1px border (#30363D). This replaces shadows as the primary method of separation, echoing the structured look of a code editor.
- **State Changes:** On hover, surfaces may transition to a slightly lighter border color (#444C56) rather than increasing shadow depth.
- **Overlays:** Use a 60% opacity black backdrop for modals to maintain focus on the technical task at hand.

## Shapes
The shape language is **Soft (0.25rem)**. This provides just enough rounding to feel modern and polished while maintaining the "sharp" and disciplined aesthetic of a professional tool.

- **Buttons & Inputs:** Use the standard `rounded` (0.25rem).
- **Cards & Modals:** Use `rounded-lg` (0.5rem) to provide a clear container hierarchy.
- **Status Indicators:** Small pips or status dots (e.g., online status, build status) should be fully circular.

## Components
- **Buttons:** 
  - *Primary:* Emerald background, black text. No gradients.
  - *Secondary:* Transparent background, Cyan border, Cyan text.
  - *Ghost:* Monospaced text, no background, appears on hover with a subtle surface highlight.
- **Inputs:** Darker than the surface background (#0D1117). Use monospaced font for the cursor and value. The focus state uses a 1px Emerald border.
- **Cards:** Surface background, 1px border. No shadows. Use a monospaced "Label" in the top right for card categories.
- **Chips/Tags:** Use JetBrains Mono. Success chips use Emerald text with a 10% opacity Emerald fill.
- **Status Indicators:** Use a "Blinking Cursor" animation (1s pulse) for active accountability sessions or live coding states. 
- **Lists:** Use subtle dividers (#30363D). Interactive list items should have a "left-border accent" (Emerald) on hover, similar to a selected line in a code editor.
- **Progress Bars:** Thin (4px), using the Secondary Cyan for progress and the Border color for the track.