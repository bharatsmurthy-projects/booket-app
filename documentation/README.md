# 🏏 Booket - Card Cricket Scoring App

The official digital companion to the Booket card cricket game. Score matches, track statistics, and experience the thrill of card cricket with beautiful animations and intuitive interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Booket is a Progressive Web App (PWA) that digitizes the popular card cricket game. Players draw cards to score runs, trigger impact cards for game-changing moments, and compete in exciting matches with full scorekeeping and match summaries.

**Current Version:** MVP-v1.1  
**Release Date:** February 21, 2026  
**Status:** Production Ready ✅

---

## ✨ Features

### Core Gameplay
- ⚾ **Card Drawing System** - Tap cards to score runs (0-6) or wickets
- ⚡ **Impact Cards** - Game-changing cards on ball 3 of each over
- 🎲 **Last Ball Twist** - Random bonus card on final ball of match
- 📊 **Live Scoring** - Real-time score updates and ball-by-ball tracking
- 🔄 **Review System** - Challenge wicket decisions with limited reviews
- 🏆 **Match Results** - Detailed scorecards with over-by-over breakdown

### User Experience
- 🎨 **3 Beautiful Themes** - Booket (brand), Pitch (green), India (blue)
- 🌓 **Dark Mode** - Full dark mode support across all themes
- 🎉 **Celebration Animations** - Confetti and trophy animations on match end
- 📱 **Responsive Design** - Works on all devices (mobile, tablet, desktop)
- ♿ **Accessible** - WCAG 2.1 Level AA compliant
- 💾 **Local Storage** - Matches saved automatically

### Technical Features
- ⚡ **Fast Performance** - Built with React 19 and Vite
- 📦 **Offline Support** - Works without internet connection
- 🎯 **Type Safety** - Full TypeScript implementation
- 🎨 **Professional Design** - Custom Booket branding and logo

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom variables

### Storage
- **localStorage** - Match persistence
- **Supabase** (optional) - Cloud sync capability

### Development
- **ESLint** - Code linting
- **Git** - Version control

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/booket-app.git
cd booket-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173` (or the port shown in terminal).

---

## 🎮 Usage

### Starting a Match

1. **Launch App** - Open Booket in your browser
2. **New Match** - Tap "New Match" on home screen
3. **Toss** - Both teams draw a card, higher card wins toss
4. **Team Names** - Enter names for both teams
5. **Match Settings** - Choose overs (1-6) and wickets (1-3)
6. **Play!** - Start scoring

### During Match

- **Tap Cards** - Select the card drawn to record runs/wickets
- **Impact Cards** - Appear on ball 3 of each over (choose effect)
- **Reviews** - Challenge wickets if reviews available
- **Last Ball** - Final ball shows twist options
- **Live Stats** - Track score, wickets, overs in real-time

### After Match

- **Results** - View detailed scorecard
- **Confetti** - Enjoy celebration animation
- **New Match** - Start another game
- **Home** - Return to main menu

---

## 📖 Game Rules

### Basic Rules

1. **Card Values** - 0 (dot), 1, 2, 3, 4 (boundary), 6 (maximum), W (wicket)
2. **Overs** - Each over has 6 balls (not counting impact cards)
3. **Wickets** - Match ends when batting team loses all wickets
4. **Target** - Chase innings 1 score + 1 run to win

### Special Features

#### Impact Cards (Ball 3)
Triggered on the 3rd ball of every over. Choose from:
- **+5 Runs** - Add 5 runs to score
- **-3 Runs** - Deduct 3 runs (minimum 0)
- **×2 Over** - Double the over runs so far
- **Wicket** - Lose a wicket
- **Custom** - Enter any positive or negative value

#### Last Ball Twist (Final Ball)
On the last ball of the match, draw from 3 random options for dramatic finish.

#### Reviews
- Each team gets reviews (based on match settings)
- Use to challenge wicket decisions
- Out/Not Out decision made by opponent
- Reviews don't regenerate

---

## 📁 Project Structure

```
booket-app/
├── public/
│   └── images/
│       └── booket-logo.png          # Official Booket logo
├── src/
│   ├── components/
│   │   └── (future components)
│   ├── lib/
│   │   ├── gameEngine.ts            # Core game logic
│   │   └── supabase.ts              # Storage layer
│   ├── pages/
│   │   ├── HomeScreen.tsx           # Main menu
│   │   ├── TossScreen.tsx           # Toss phase
│   │   ├── SetupScreen.tsx          # Match configuration
│   │   ├── ScoringScreen.tsx        # Main gameplay
│   │   ├── ResultScreen.tsx         # Match results
│   │   └── OverSummaryPanel.tsx     # Over summary overlay
│   ├── types.ts                     # TypeScript type definitions
│   ├── styles.css                   # Global styles and themes
│   ├── App.tsx                      # Root component
│   └── main.tsx                     # Entry point
├── documentation/                    # Project documentation
│   ├── README.md                    # This file
│   ├── STYLE_GUIDE.md               # Design system
│   ├── ARCHITECTURE.md              # Technical architecture
│   ├── CHANGELOG.md                 # Version history
│   └── API.md                       # Component API docs
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- **TypeScript** - Strict mode enabled
- **React** - Functional components with hooks
- **CSS** - BEM-like naming, CSS variables for theming
- **Formatting** - 2-space indentation, semicolons

### Making Changes

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make your changes
3. Test thoroughly in both light and dark modes
4. Commit with descriptive message
5. Push and create pull request

---

## 🎨 Theming

Booket supports 3 themes with light/dark variants:

1. **Booket (Default)** - Deep cricket blue + Booket red
2. **Pitch** - Cricket pitch green + orange
3. **India** - Royal blue + saffron orange

All themes maintain WCAG 2.1 Level AA accessibility standards.

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for detailed color specifications.

---

## 🐛 Known Issues

None currently. Report issues on GitHub.

---

## 🗺 Roadmap

### Future Enhancements
- 🔊 Sound effects (ball hit, wicket fall, applause)
- 📊 Statistics and leaderboards
- 👥 Multiplayer mode
- 🌐 Online tournaments
- 📤 Share scorecards on social media
- 🎯 Achievements and badges
- 📱 Native mobile apps (iOS/Android)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Test your changes
5. Submit a pull request

---

## 📄 License

Copyright © 2026 Booket. All rights reserved.

---

## 📞 Contact

- **Website:** booket.game
- **Email:** support@booket.game
- **GitHub:** github.com/booket/booket-app

---

## 🙏 Acknowledgments

- Claude AI for development assistance
- React team for the amazing framework
- Vite team for blazing-fast tooling
- Booket community for feedback and testing

---

**Made with ❤️ for cricket and card game enthusiasts worldwide**

🏏 Play Booket. Score Legendary.
