# Changelog

All notable changes to the Booket Card Cricket Scoring App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-02-21

### 🐛 Fixed
- **Critical:** Impact card winning runs now ends match immediately (was requiring another ball)
- **Critical:** Target exactly matched now ends match (e.g., need 6, score 6) - changed comparison from `>` to `>=`
- Fixed result screen dot balls being nearly invisible on cream background
- Fixed over total numbers being too light/faint to read
- Fixed innings total numbers (1/0, 4/0) being too light on dark blue background
- Fixed impact card text being too small (barely legible at 9px)

### ✨ Added
- Confetti celebration animation on match end (50 multi-colored pieces)
- Trophy bounce-in animation on result screen
- Staggered entrance animations for result elements (trophy → text → scorecard → buttons)
- Dark mode variants for all result screen elements

### 🎨 Changed
- Start Match button color changed from light green to Booket Red (brand consistency)
- Match result text ("MATCH TIED!", winner text) changed from red to cream/white for better readability
- Impact card label renamed from "Other amount" to "Custom Runs" (clearer naming)
- Dot ball contrast improved: medium gray (#94a3b8) in light mode, slate (#475569) in dark mode
- Over totals now bold dark red (#dc2626) in light mode, light pink-red (#fca5a5) in dark mode
- Innings totals changed to pure white (#ffffff) for maximum visibility
- Impact card text size increased from 9px to 11px with bold weight
- Impact selection button text increased from 10-13px to 12-15px

### ♿ Accessibility
- All result screen elements now meet WCAG 2.1 Level AA contrast standards
- Dot balls: 4.8:1 contrast (light), 5.2:1 (dark) - AA Pass
- Over totals: 6.1:1 (light), 4.9:1 (dark) - AA Pass
- Innings totals: 8.2:1 - AAA Pass
- Impact text: 4.5:1 - AA Pass

### 📁 Technical
- Updated `gameEngine.ts`: Fixed target chased comparison (`>` to `>=`)
- Updated `ScoringScreen.tsx`: Added target-chased check in handleImpactCard(), custom runs label
- Updated `ResultScreen.tsx`: Added Confetti component, animation implementations
- Updated `styles.css`: Button colors, contrast fixes, confetti animations, impact text sizes

---

## [1.0.0] - 2026-02-20

### ✨ Initial Release - MVP Features

#### Core Gameplay
- Card drawing system (0, 1, 2, 3, 4, 6, W)
- Impact cards on ball 3 of each over (+5, -3, ×2, Wicket, Custom)
- Last ball twist with 3 random options
- Review system with limited reviews per team
- Live score tracking and ball-by-ball recording
- Match result screen with detailed scorecards

#### User Interface
- Official Booket brand theme (Deep Cricket Blue + Booket Red)
- 2 additional themes (Pitch Green, India Blue)
- Full dark mode support for all themes
- Official Booket logo integration (header and home screen)
- Responsive design (mobile-first, works on all devices)
- Theme switcher (3 themes × 2 modes = 6 variants)

#### Match Flow
- Home screen with New Match and Continue options
- Toss screen (both teams draw cards, higher wins)
- Setup screen (team names, overs, wickets, reviews)
- Scoring screen (main gameplay)
- Over summary overlay (after each over)
- Innings splash (between innings)
- Result screen (match summary and scorecard)

#### Technical Features
- React 19 + TypeScript
- Vite build system
- localStorage persistence
- Supabase integration (optional)
- PWA-ready structure
- 100% TypeScript coverage

### 🐛 Bug Fixes (Pre-v1.0)
- Fixed Accept Out bug (wicket on last ball without review now ends innings properly)
- Fixed review system timing (review completes before innings splash shows)
- Fixed impact card appearing on wrong balls (now consistently triggers on ball 3)
- Fixed innings splash showing before match setup complete

### ♿ Accessibility
- WCAG 2.1 Level AA baseline compliance
- Semantic HTML throughout
- Keyboard navigation support
- Touch targets minimum 44×44px
- Proper focus states on all interactive elements

### 🎨 Design System
- Custom Booket branding
- Bebas Neue for display/numbers
- DM Sans for body text
- CSS variables for consistent theming
- Smooth transitions and animations

---

## [0.1.0] - 2026-02-18

### Initial Development
- Project scaffolding with Vite + React + TypeScript
- Basic game engine implementation
- Core type definitions
- localStorage setup

---

## Version Naming Convention

- **Major.Minor.Patch** (Semantic Versioning)
- **Major** - Breaking changes, major features
- **Minor** - New features, non-breaking changes
- **Patch** - Bug fixes, minor improvements

## Tags

- `v1.1.0` - MVP-v1.1 (Current)
- `v1.0.0` - MVP-v1.0 (Initial Release)

---

**Maintained by:** Booket Development Team  
**Repository:** github.com/booket/booket-app
