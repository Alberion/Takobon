# Takobon — Design System

## Art Direction Statement

> Takobon is a collector's archive, not a fan site. It feels like the quiet atmosphere of a Tokyo bookshop at dusk — shelves of spines you know by heart, the weight of a well-kept volume in your hands. The interface should recede so the covers lead. Every interaction should feel considered, calm, and slightly ceremonial.

---

## Design Language

**Atmospheric.** The UI has depth — layers of dark surfaces that feel like they exist in space, not on a flat screen.

**Archival.** Precise, structured, typographically respectful. Information is organized like a well-kept collection, not dumped like a feed.

**Cover-first.** Artwork is the hero. The UI is the frame, not the painting.

**Restrained premium.** Gold appears sparingly — like an embossed spine, not a Bitcoin ad. Indigo is the interaction language, never decorative noise.

**Quiet Japanese influence.** Expressed through spacing, hierarchy, and breathing room — not motifs or decorations.

---

## Color Palette — Primary

### Backgrounds
| Token | Hex | Role |
|---|---|---|
| `bg-base` | `#0C0D14` | Deepest canvas — main app background |
| `bg-surface` | `#13141F` | Cards, panels, list items |
| `bg-elevated` | `#1C1D2E` | Modals, drawers, popovers |
| `bg-subtle` | `#252641` | Hover fills, selected rows, subtle zones |

### Borders
| Token | Hex | Role |
|---|---|---|
| `border-subtle` | `#1E1F30` | Dividers, quiet separators |
| `border-default` | `#2A2B3D` | Standard card/panel borders |
| `border-strong` | `#3D3E5C` | Focus rings base, prominent separators |

### Indigo — Brand & Interaction
| Token | Hex | Role |
|---|---|---|
| `indigo-300` | `#A5B4FC` | Text links, secondary labels on dark |
| `indigo-400` | `#818CF8` | Icons, secondary interactive elements |
| `indigo-500` | `#6366F1` | **Primary CTA, active states, focus rings** |
| `indigo-600` | `#4F46E5` | Pressed/active variant |
| `indigo-700` | `#4338CA` | Deep tint, backgrounds behind indigo text |
| `indigo-glow` | `rgba(99,102,241,0.20)` | Box shadows, card glows on hover |

### Gold — Premium & Value
| Token | Hex | Role |
|---|---|---|
| `gold-300` | `#D4B896` | Subtle warm text, secondary premium label |
| `gold-400` | `#C9A96E` | **Primary gold** — collection value, special badges |
| `gold-500` | `#A67C45` | Deep gold, pressed state |
| `gold-muted` | `rgba(201,169,110,0.12)` | Background tint behind gold elements |

### Text
| Token | Hex | Role |
|---|---|---|
| `text-primary` | `#F0EDE8` | Body, headings — warm off-white |
| `text-secondary` | `#A8A5B0` | Metadata, subtitles, secondary info |
| `text-tertiary` | `#6B6878` | Placeholders, disabled, timestamps |
| `text-brand` | `#818CF8` | Inline brand text, links |
| `text-inverse` | `#0C0D14` | Text on light/filled surfaces |

---

## Semantic Color System

| Role | Token | Hex | Usage |
|---|---|---|---|
| **Owned** | `state-owned` | `#34D399` | Item in collection |
| **Missing** | `state-missing` | `#FBBF24` | Gap in a series |
| **Wished** | `state-wished` | `#818CF8` | On wishlist |
| **Success** | `semantic-success` | `#34D399` | Confirmations, completed |
| **Warning** | `semantic-warning` | `#FBBF24` | Alerts, upcoming |
| **Error / Destructive** | `semantic-error` | `#F87171` | Delete, remove — red is ONLY here |
| **Info** | `semantic-info` | `#60A5FA` | Tooltips, info banners |

**Rule:** Red (`#F87171`) appears exclusively in destructive confirmations, error toasts, and form validation. Never as a button color, badge, or brand moment.

---

## When to Use Each Color

- **Indigo** — every interactive element: buttons, checkboxes, active tabs, focus rings, progress bars, links
- **Gold** — collection value total, completion badges, verified entries, value label. Max 1–2 times per screen
- **Green** — item status chips, checkmarks, series completion, "in your collection" indicators
- **Amber** — gap indicators, missing issue counts, incomplete series warnings
- **Warm off-white** — all primary reading. Never pure `#FFFFFF` on dark backgrounds

---

## Surfaces, Gradients & Glow

### Card surface
```css
background: #13141F;
border: 1px solid #2A2B3D;
border-radius: 12px;
```

### Card hover / focus glow
```css
box-shadow: 0 0 0 1px #4F46E5, 0 4px 24px rgba(99,102,241,0.18);
```

### Gold value surface
```css
background: rgba(201,169,110,0.08);
border: 1px solid rgba(201,169,110,0.20);
```

### Dashboard hero gradient
```css
background: linear-gradient(135deg, #13141F 0%, #1C1D2E 60%, #1E1F35 100%);
```

### Cover card image scrim
```css
background: linear-gradient(to top, rgba(12,13,20,0.92) 0%, transparent 55%);
```

Glow is used for interactive moments (hover, selected) — not decoration. Gradients are surface depth, not light shows.

---

## Japanese Aesthetic — Subtle & Non-Stereotypical

**Do:**
- Use generous negative space (the Japanese concept of *ma* — the meaningful pause)
- Let covers breathe in grids — never tight, never cluttered
- Use thin, precise borders (`1px`) — restraint over boldness
- Strict typographic hierarchy — importance via weight and size, not color
- Monospaced issue numbers (`#003`) — archival, precise
- Treat the grid like a physical shelf — ordered, intentional

**Don't:**
- Cherry blossoms, kanji, rising sun motifs, anime references
- Red circles or red accents as decoration
- Busy pattern backgrounds
- Playful or bouncy animations

---

## Component Principles

### Collection cards
- Cover art fills the card — no padding around image
- Minimal overlay: title + issue number via gradient scrim
- Status chip bottom-left: pill-shaped, colored dot + label
- Indigo glow on hover/selected

### Dashboard modules
- Clean bordered cards, single metric in large type
- Supporting label in `text-secondary`
- Gold used only for the value module
- No decorative icons — data speaks

### Tags / badges
```css
border-radius: 999px;
padding: 2px 10px;
font-size: 11px;
```
- Owned: green fill at 15% opacity + green text
- Missing: amber fill at 15% opacity + amber text
- Wished: indigo fill at 15% opacity + indigo-300 text
- Publisher: `bg-subtle` + `text-secondary` — neutral

### Item state indicators
```
● Owned    — #34D399
○ Missing  — #FBBF24
♡ Wished   — #818CF8
```

---

## Typography

### Font stack
- **Display / Headers:** `Geist` or `DM Sans` — modern, geometric, not cold. Fallback: `Inter`
- **Body:** `Inter` — excellent readability at small sizes on dark backgrounds
- **Monospace:** `Geist Mono` or `JetBrains Mono` — for issue numbers, counts, stats

### Type scale (mobile-first)
| Name | Size | Weight | Letter-spacing | Usage |
|---|---|---|---|---|
| `display-lg` | 32px | 700 | -0.02em | Hero stats, big numbers |
| `display-sm` | 24px | 600 | -0.01em | Section headers |
| `body-lg` | 16px | 400 | 0 | Primary reading |
| `body-sm` | 14px | 400 | 0 | Secondary content |
| `label` | 12px | 500 | +0.02em | Uppercase tags, metadata |
| `mono` | 13px | 400 | 0 | Issue numbers, counts |

### Spacing
- **Base unit:** 4px
- **Key values:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Minimum horizontal card padding on mobile: 16px
- **Line height:** 1.5 body, 1.2 display

---

## Dos and Don'ts

**Do:**
- Let cover artwork carry the visual weight
- Use indigo for every interactive signal
- Reserve gold for genuine premium moments
- Give every screen generous breathing room
- Use dark backgrounds with surface layering (not flat black)
- Animations: `duration: 150–200ms`, `easing: ease-out`
- Use `text-primary` (`#F0EDE8`) — never pure `#FFFFFF`

**Don't:**
- Use red anywhere except destructive/error states
- Saturate the interface with bright colors
- Use gradients as decoration
- Mix too many accent colors on one screen
- Use shadows for decoration — only for elevation and interaction
- Animate layout — only opacity and transform

---

## Alternative Palette Directions

### Alt A — Violet Night
Shift accent from indigo toward violet. More mysterious, less corporate.
- Primary CTA: `#7C3AED`
- Hover: `#6D28D9`
- Text brand: `#A78BFA`
- Glow: `rgba(124,58,237,0.20)`

### Alt B — Slate Ink
Cool slate-blue accent. More editorial, feels like a printed magazine.
- Primary CTA: `#3B82F6`
- Hover: `#2563EB`
- Text brand: `#93C5FD`
- Glow: `rgba(59,130,246,0.18)`

All backgrounds, gold, and semantic colors remain identical across all alternatives.

---

## Visual Identity Summary

> Dark, atmospheric, cover-first. Indigo drives interaction. Gold marks value. Space is intentional. The app feels like a private archive — calm, intelligent, and quietly proud of what it holds. Japanese restraint without Japanese decoration. Premium without showing off.

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Backgrounds */
  --bg-base:          #0C0D14;
  --bg-surface:       #13141F;
  --bg-elevated:      #1C1D2E;
  --bg-subtle:        #252641;

  /* Borders */
  --border-subtle:    #1E1F30;
  --border-default:   #2A2B3D;
  --border-strong:    #3D3E5C;

  /* Indigo — Brand & Interaction */
  --indigo-300:       #A5B4FC;
  --indigo-400:       #818CF8;
  --indigo-500:       #6366F1;
  --indigo-600:       #4F46E5;
  --indigo-700:       #4338CA;
  --indigo-glow:      rgba(99, 102, 241, 0.20);

  /* Gold — Premium */
  --gold-300:         #D4B896;
  --gold-400:         #C9A96E;
  --gold-500:         #A67C45;
  --gold-muted:       rgba(201, 169, 110, 0.12);

  /* Text */
  --text-primary:     #F0EDE8;
  --text-secondary:   #A8A5B0;
  --text-tertiary:    #6B6878;
  --text-brand:       #818CF8;
  --text-inverse:     #0C0D14;

  /* Item States */
  --state-owned:      #34D399;
  --state-missing:    #FBBF24;
  --state-wished:     #818CF8;

  /* Semantic */
  --semantic-success: #34D399;
  --semantic-warning: #FBBF24;
  --semantic-error:   #F87171;
  --semantic-info:    #60A5FA;

  /* Typography */
  --font-sans:        'Inter', system-ui, sans-serif;
  --font-mono:        'Geist Mono', 'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm:        6px;
  --radius-md:        12px;
  --radius-lg:        16px;
  --radius-pill:      999px;
}
```
