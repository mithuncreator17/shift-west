# ShiftWest Design System

## Purpose & Direction
Brutalist streetwear e-commerce. High-contrast black/white grid aesthetic with sharp typography. SVG text branding. No images—placeholder boxes as intentional design choice.

## Tone
Minimalist, industrial, typographic. Strong cultural edge. Authentic streetwear aesthetic via negative space and grid discipline.

## Color Palette (Achromatic)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `0.98 0 0` (near-white) | `0.08 0 0` (deep black) | Page background |
| Foreground | `0.12 0 0` (pure black) | `0.95 0 0` (near-white) | Body text |
| Primary | `0.12 0 0` (black) | `0.92 0 0` (light gray) | Buttons, CTAs, active states |
| Secondary | `0.92 0 0` (light gray) | `0.16 0 0` (dark gray) | Inactive tabs, secondary UI |
| Muted | `0.88 0 0` (medium gray) | `0.16 0 0` (dark gray) | Borders, placeholders |
| Accent | `0.12 0 0` (black) | `0.92 0 0` (light gray) | Highlights, focus states |
| Border | `0.92 0 0` (light gray) | `0.18 0 0` (charcoal) | Dividers, card edges |

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | General Sans | 700–900 | Logo, headings, CTAs |
| Body | DM Sans | 400–600 | Product names, descriptions |
| Mono | Geist Mono | 400–500 | Prices, technical detail |

## Shape Language
- Cards: `border-radius: 0` (sharp, brutalist)
- Buttons: `border-radius: full` (circular add-to-cart icon)
- Spacing density: Tight grid, high contrast

## Structural Zones

| Zone | Background | Border | Purpose |
|------|------------|--------|---------|
| Header | `bg-background` | `border-b border-muted` | Logo, tagline, location |
| Navigation | `bg-background` | None | Category tabs with hover states |
| Product Grid | `bg-background` | None | Borderless cards in grid |
| Card | `bg-card` | `border border-border` | Product container, image, name, price |
| Footer | `bg-background` | `border-t border-muted` | Form inputs, WhatsApp CTA |
| Admin Panel | `bg-background` | None | Hidden modal, password-gated |

## Component Patterns
- **Category Tabs**: Inactive `bg-secondary text-foreground`, active `bg-primary text-primary-foreground`
- **Product Card**: Sharp edges, light gray placeholder image, bold product name, gray price, black circular `+` button bottom-right
- **Buttons**: Black background, white text, hover opacity 90%
- **Inputs**: Light gray background, dark border, no border-radius
- **Admin Modal**: Full-screen, centered form, password input, logout button

## Spacing & Rhythm
- Header margin-top: 2rem, margin-bottom: 1rem
- Card padding: 1rem, margin-bottom: 1.5rem
- Category scroll horizontal padding: 1rem
- Footer padding: 1.5rem top/bottom

## Motion
- **Transition Default**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` on interactive elements
- **Hover States**: Button opacity fade (90%), no scale or skew

## Signature Detail
SVG text logo 'SHIFT WEST' that doubles as easter egg—5 clicks on logo reveals hidden admin panel. No animation, pure typographic interaction.

## Differentiation
Pure achromatic palette (no color) in an e-commerce context. Placeholder boxes instead of real product images. Sharp grid, zero border-radius on cards. Grid-based categorization mimics streetwear lookbook layout.
