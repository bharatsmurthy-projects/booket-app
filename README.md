# 🃏 Booket — Card Cricket Scoring App

A mobile-first web app for scoring Booket (Card Cricket) matches.  
Built with React 19 + TypeScript + Supabase.

---

## Quick Start

### 1. Set up Supabase

1. Go to your Supabase project → **SQL Editor**
2. Run the contents of `supabase-schema.sql`
3. Copy your **Project URL** and **anon public key** from:  
   Settings → API → Project API keys

### 2. Configure credentials

```bash
cp .env.example .env
# Edit .env and fill in your Supabase URL and anon key
```

### 3. Install dependencies & run

```bash
npm install        # install Vite, React, Supabase, etc.
npm run dev        # starts dev server at http://localhost:3000
```

### 4. Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Project Structure

```
booket-app/
├── src/
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── lib/
│   │   ├── gameEngine.ts    # Core scoring logic
│   │   ├── persistence.ts   # Supabase + localStorage
│   │   └── supabase.ts      # Supabase client setup
│   ├── pages/
│   │   ├── HomeScreen.tsx   # Landing + recent matches
│   │   ├── MatchSetup.tsx   # Match creation wizard
│   │   ├── ScoringScreen.tsx # Live scoring UI
│   │   └── ResultScreen.tsx  # Full scorecard
│   ├── components/
│   │   ├── ScoreHeader.tsx      # Live score display
│   │   ├── BallTracker.tsx      # Current over balls
│   │   ├── OverSummaryPanel.tsx # End-of-over modal
│   │   └── AnimationOverlay.tsx # 4/6/W animations
│   ├── App.tsx          # Main app + routing
│   ├── main.tsx         # React entry point
│   └── styles.css       # Full CSS (mobile-first)
├── public/
│   └── index.html
├── dist/                # Built output (after build.mjs)
├── build.mjs            # esbuild build script
├── supabase-schema.sql  # DB setup SQL
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Game Flow

```
Home → Match Setup (3 steps) → Scoring → Result
         ↓                        ↓
    Team names               Ball-by-ball:
    Overs/Wickets/Reviews     • Normal card (0-6 or W)
    Toss                      • Impact Card (after ball 3)
                              • Last Ball Twist (ball 6)
                              • Review system (on wicket)
                              • Over summary
                    → Innings 2 → Chase → Result
```

---

## Supabase Schema

| Table    | Key Columns |
|----------|-------------|
| `matches` | `id`, `config` (JSONB), `innings1` (JSONB), `innings2` (JSONB), `phase`, `batting_team` |

The full match state is stored as JSONB — no migrations needed as the game evolves.

---

## Deploying

The `dist/` folder is a pure static site — deploy anywhere:

- **Vercel**: `vercel --prod dist/`
- **Netlify**: drag-drop the `dist/` folder
- **GitHub Pages**: push `dist/` contents to gh-pages branch

---

## Phase Roadmap

| Phase | Status | Features |
|-------|--------|----------|
| 1 — MVP | ✅ Built | Match creation, scoring, scorecards, Supabase save |
| 2 — Leagues | 🔜 Next | Private leagues, leaderboards, NRR |
| 3 — Experience | 🔜 Future | AI match reports, social sharing, animations |
| 4 — Scale | 🔜 Future | Global tournaments, premium packs |
