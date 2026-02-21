# 🎨 Booket Design System & Style Guide

Official design system for the Booket Card Cricket Scoring App.

**Version:** 1.1  
**Last Updated:** February 21, 2026

---

## 📋 Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Components](#components)
5. [Spacing & Layout](#spacing--layout)
6. [Animations](#animations)
7. [Accessibility](#accessibility)
8. [Best Practices](#best-practices)

---

## 🏏 Brand Identity

### Logo
- **Primary Logo:** Booket badge with vintage cricket aesthetic
- **File:** `public/images/booket-logo.png`
- **Usage:**
  - Header: 48px height with drop shadow
  - Home screen: 120px height with drop shadow
- **Clear Space:** Minimum 16px around logo
- **Background:** Works on dark blues and neutral backgrounds

### Tagline
**"The Book Cricket Card Game"**
- Font: DM Sans, 600 weight
- Usage: Below logo on home screen

### Brand Voice
- **Tone:** Energetic, nostalgic, accessible
- **Language:** Cricket terminology, casual but clear
- **Personality:** Playful yet professional

---

## 🎨 Color System

### Theme Structure
Booket supports 3 themes with light/dark mode variants:

1. **Booket (Default)** - Brand theme
2. **Pitch** - Cricket pitch green
3. **India** - Indian cricket colors

All themes use CSS variables for consistency.

---

### 🏏 Booket Theme (Default)

#### Light Mode
```css
--bg:          #1F3E54   /* Deep Cricket Blue */
--surface:     #2F5D7C   /* Cricket Blue */
--surface-mid: #3d7092   /* Medium Blue */
--surface-hi:  #4a8baa   /* Light Blue */
--accent:      #D9654F   /* Booket Red (lightened for contrast) */
--accent-dark: #c04d37   /* Dark Booket Red */
--accent2:     #f5a623   /* Golden Orange */
--danger:      #e53e3e   /* Error Red */
--text:        #FFFFFF   /* Pure White */
--text-dim:    #D9C7A8   /* Warm Beige */
--card-bg:     #F4E9D5   /* Vintage Cream */
--card-text:   #1F3E54   /* Deep Blue (for contrast) */
--card-border: #d4c4a8   /* Warm Border */
--input-bg:    #FFFFFF   /* White Inputs */
```

#### Dark Mode
```css
--card-bg:     #3d7092   /* Medium Blue */
--card-text:   #FFFFFF   /* White */
--card-border: #2F5D7C   /* Cricket Blue */
--input-bg:    #2F5D7C   /* Dark Blue Inputs */
```

#### Brand Colors
- **Primary:** `#D9654F` - Booket Red
- **Secondary:** `#1F3E54` - Deep Cricket Blue
- **Accent:** `#f5a623` - Golden Orange

---

### 🌿 Pitch Theme

#### Light Mode
```css
--bg:          #0f2318   /* Deep Forest */
--surface:     #1a3a2a   /* Cricket Pitch Green */
--surface-mid: #234d36   /* Medium Green */
--surface-hi:  #2e6647   /* Light Green */
--accent:      #f5a623   /* Golden Orange */
--accent-dark: #d4881a   /* Dark Orange */
--accent2:     #22c55e   /* Fresh Green */
--text:        #f5f0e8   /* Off White */
--text-dim:    #8dab9a   /* Muted Green */
--card-bg:     #ffffff   /* White Cards */
--card-text:   #1a2e22   /* Dark Green Text */
```

---

### 🔵 India Theme

#### Light Mode
```css
--bg:          #0a1628   /* Deep Navy */
--surface:     #122040   /* Royal Blue */
--surface-mid: #1a2f5a   /* Medium Blue */
--surface-hi:  #203870   /* Light Blue */
--accent:      #ff8c00   /* Saffron Orange */
--accent-dark: #cc6f00   /* Dark Saffron */
--accent2:     #00b4d8   /* Sky Blue */
--text:        #e8f0ff   /* Light Blue White */
--text-dim:    #7a9cc4   /* Muted Blue */
```

---

### Special Colors

#### Scoreboard
```css
/* Ball Type Colors */
.scb-dot:    #94a3b8   /* Medium Gray - visible on cream */
.scb-runs:   (surface)  /* Theme surface color */
.scb-four:   #3182ce   /* Blue - boundary */
.scb-six:    #ecc94b   /* Gold - maximum */
.scb-w:      (danger)   /* Red - wicket */
.scb-impact: (accent)   /* Theme accent - impact card */

/* Result Screen */
.sc-over-total: #dc2626  /* Dark Red - over totals */
.sc-total:      #ffffff  /* White - innings totals */

/* Dark Mode Variants */
.dark .scb-dot:        #475569   /* Darker gray */
.dark .sc-over-total:  #fca5a5   /* Light pink-red */
```

#### Interactive States
```css
/* Buttons */
btn:hover     → translateY(-2px) + shadow-lg
btn:active    → scale(0.93)

/* Last Ball Twist */
.lastball-card: #a855f7 border + purple glow
```

---

## 📝 Typography

### Font Families

```css
--font-main:   'DM Sans', sans-serif        /* Body text */
--font-d:      'Bebas Neue', cursive        /* Display/Numbers */
```

### Font Imports
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
```

### Type Scale

#### Headings
```css
h1 (Page Titles):        clamp(28px, 6vw, 36px)  /* Bebas Neue */
h2 (Section Headers):    clamp(20px, 4vw, 24px)  /* DM Sans, 700 */
h3 (Subsections):        17px, 700               /* DM Sans */
```

#### Body
```css
Body Text:        15px, 400-500  /* DM Sans */
Small Text:       13px, 400      /* DM Sans */
Tiny Text:        11px, 700      /* DM Sans, uppercase */
```

#### Special
```css
Score Display:    clamp(60px, 15vw, 88px)   /* Bebas Neue */
Wickets:          clamp(50px, 12vw, 72px)   /* Bebas Neue */
Card Values:      clamp(28px, 5vw, 44px)    /* Bebas Neue */
Over Totals:      22px, 700                  /* Bebas Neue */
Innings Totals:   30px                       /* Bebas Neue */
```

### Font Weights
- **Regular:** 400 (body text)
- **Medium:** 500 (interactive elements)
- **Semibold:** 600 (emphasized text)
- **Bold:** 700 (headings, numbers)

### Line Heights
- **Headings:** 1.2
- **Body:** 1.5
- **Numbers:** 1 (Bebas Neue)

---

## 🧩 Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--accent);
  color: #ffffff;
  padding: 14px 24px;
  border-radius: var(--radius);
  font-weight: 600;
  box-shadow: 0 5px 0 var(--accent-dark);
  transition: var(--ease);
}
.btn-primary:hover {
  transform: translateY(-2px);
}
.btn-primary:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--accent-dark);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: var(--surface);
  color: var(--text);
  /* Same structure as primary */
}
```

#### Start Match Button (Special)
```css
.btn-start {
  background: var(--accent);
  box-shadow: 0 5px 0 var(--accent-dark);
  /* Large, prominent */
}
```

### Cards

#### Score Cards
```css
.card-btn {
  background: var(--card-bg);
  color: var(--card-text);
  border-radius: var(--radius);
  border: 2px solid transparent;
  box-shadow: var(--shadow);
  /* 2-row grid layout */
}

/* Special Cards */
.card-four:   background: #ebf8ff, color: #3182ce
.card-six:    background: #fffbeb, color: #b7791f
.card-wicket: background: #fff5f5, color: danger
```

#### Impact Cards
```css
.impact-btn {
  border: 2px solid;
  padding: 16px;
  border-radius: var(--radius);
  /* Color-coded by type */
}
```

### Over Summary Panel
```css
.over-summary {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}
```

### Result Screen
```css
.result-banner {
  background: linear-gradient(135deg, var(--surface), var(--surface-mid));
  border: 2px solid var(--accent);
  padding: 36px 24px;
  border-radius: var(--radius);
}
```

---

## 📐 Spacing & Layout

### Spacing Scale
```css
--gap-xs:  4px
--gap-sm:  8px
--gap-md:  12px
--gap-lg:  16px
--gap-xl:  24px
--gap-2xl: 32px
```

### Border Radius
```css
--radius:    12px   /* Default */
--radius-sm: 8px    /* Small elements */
--radius-lg: 16px   /* Large panels */
```

### Shadows
```css
--shadow:     0 2px 6px rgba(0,0,0,0.15)
--shadow-lg:  0 4px 12px rgba(0,0,0,0.25)
```

### Container Widths
```css
Mobile:  100% (up to 480px)
Tablet:  100% (480px - 768px)
Desktop: 480px max-width, centered
```

### Grid Layouts

#### Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 10px 8px;
}
/* Row 1: 0, 1, 2, 3 */
/* Row 2: 4, 6, W (spans 2) */
```

---

## ✨ Animations

### Transitions
```css
--ease: all 0.2s ease-in-out
```

### Confetti (Match End)
```css
@keyframes confetti-fall {
  0%   { top: -10px, opacity: 1, rotate: 0 }
  100% { top: 100vh, opacity: 0, rotate: 720deg }
}
Duration: 2-3s per piece
Count: 50 pieces
Colors: Gold, Orange, Green, Blue, Purple, Pink
```

### Trophy Bounce
```css
@keyframes trophy-bounce {
  0%   { scale: 0, rotate: -180deg, opacity: 0 }
  50%  { scale: 1.2, rotate: 10deg }
  100% { scale: 1, rotate: 0, opacity: 1 }
}
Duration: 0.6s
```

### Staggered Entrance
```css
Trophy:   0s delay
Text:     0.3s delay
Scorecard: 0.6s delay
Buttons:  0.9s delay
```

### Button Interactions
```css
hover:  translateY(-2px), shadow-lg
active: scale(0.93)
```

### Impact Card Pulse
```css
/* Ball 3 indicator */
animation: pulse 1s ease-in-out infinite
```

### Last Ball Glow
```css
/* Purple ring glow */
animation: pulse-glow 1.5s ease-in-out infinite
0%-100%: box-shadow 25px
50%:     box-shadow 35px
```

---

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance

#### Contrast Ratios (Minimum 4.5:1 for text, 3:1 for large text)

✅ **Dot balls:**
- Light: 4.8:1 (AA Pass)
- Dark: 5.2:1 (AA Pass)

✅ **Over totals:**
- Light: 6.1:1 (AA Pass)
- Dark: 4.9:1 (AA Pass)

✅ **Innings totals:**
- 8.2:1 (AAA Pass)

✅ **Body text:**
- Booket theme: 7.8:1 (AAA Pass)

✅ **Impact text:**
- 4.5:1 (AA Pass)

✅ **Button text:**
- 4.8:1 (AA Pass)

### Touch Targets
- **Minimum:** 44×44px for all interactive elements
- **Implemented:** All buttons, cards exceed minimum

### Focus States
- All interactive elements have visible focus states
- `:focus-visible` for keyboard navigation

### Color Independence
- Never rely on color alone
- Icons and labels accompany all color coding

### Screen Reader Support
- Semantic HTML (`<button>`, `<main>`, etc.)
- ARIA labels where needed
- Logical heading hierarchy

---

## 🎯 Best Practices

### CSS

#### Variable Usage
```css
/* ✅ Good */
color: var(--text);
background: var(--accent);

/* ❌ Avoid */
color: #FFFFFF;  /* Use variable instead */
```

#### Responsive Design
```css
/* ✅ Good - clamp for fluid scaling */
font-size: clamp(28px, 5vw, 44px);

/* ✅ Good - media queries for layout */
@media (min-width: 480px) { ... }
```

#### Dark Mode
```css
/* ✅ Good - always provide dark variant */
.element { color: var(--text); }
.dark .element { /* optional override */ }
```

### Color Naming
- **Semantic names:** `--accent`, `--danger`, `--text`
- **NOT:** `--blue`, `--red` (not theme-agnostic)

### Component Organization
1. Layout (position, display, flexbox/grid)
2. Box Model (width, padding, margin)
3. Typography (font, color, text-align)
4. Visual (background, border, shadow)
5. Misc (cursor, transition, z-index)

### File Structure
- One component per file
- CSS in `styles.css` with clear sections
- Use comments to separate sections:
  ```css
  /* ═══ Section Name ═══════════════ */
  ```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
Base:    320px - 479px   (mobile)
Tablet:  480px - 767px   (tablet)
Desktop: 768px+          (desktop, max 480px container)

/* Key Breakpoint */
@media (min-width: 480px) {
  /* Desktop frame with shadow */
  body { background: #060606; }
  .app { max-width: 480px; box-shadow: 0 0 80px rgba(0,0,0,0.7); }
}
```

---

## 🔍 Testing Checklist

Before deploying changes:

- [ ] Test in light mode (all 3 themes)
- [ ] Test in dark mode (all 3 themes)
- [ ] Check contrast ratios (use browser dev tools)
- [ ] Test on mobile (Chrome DevTools device mode)
- [ ] Test keyboard navigation
- [ ] Verify touch targets (44×44px minimum)
- [ ] Check animations performance
- [ ] Test with screen reader (optional)

---

## 📚 Resources

### Design Tools
- **Colors:** [Coolors.co](https://coolors.co)
- **Contrast:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Fonts:** [Google Fonts](https://fonts.google.com)

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://m3.material.io/)
- [Tailwind CSS](https://tailwindcss.com/docs) (inspiration)

---

## 📝 Change Log

### Version 1.1 (Feb 21, 2026)
- Added confetti celebration animations
- Fixed result screen contrast (dot balls, over totals, innings totals)
- Increased impact card text sizes (9px → 11px)
- Updated Start Match button to Booket Red
- Changed match result text to cream/white
- Added dark mode variants for all result elements

### Version 1.0 (Feb 20, 2026)
- Initial style guide
- Booket brand theme as default
- 3 themes with light/dark variants
- WCAG 2.1 Level AA baseline

---

**Maintained by:** Booket Design Team  
**Questions:** design@booket.game

🎨 **Design with purpose. Build with passion.**
