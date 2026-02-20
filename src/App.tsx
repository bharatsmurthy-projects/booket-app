import React, { useState } from 'react';
import type { MatchState, MatchConfig } from './types';
import { createMatch } from './lib/gameEngine';
import { saveMatch, setCurrentMatchId } from './lib/persistence';
import HomeScreen from './pages/HomeScreen';
import MatchSetup from './pages/MatchSetup';
import ScoringScreen from './pages/ScoringScreen';
import ResultScreen from './pages/ResultScreen';

type AppView  = 'home' | 'setup' | 'scoring' | 'result';
export type ThemeColor = 'booket' | 'green' | 'blue';

const THEME_OPTIONS: { id: ThemeColor; label: string; emoji: string }[] = [
  { id: 'booket', label: 'Booket', emoji: '🏏' },
  { id: 'green',  label: 'Pitch',  emoji: '🌿' },
  { id: 'blue',   label: 'India',  emoji: '🔵' },
];

export default function App() {
  const [view,      setView]      = useState<AppView>('home');
  const [match,     setMatch]     = useState<MatchState | null>(null);
  const [darkMode,  setDarkMode]  = useState(false);
  const [theme,     setTheme]     = useState<ThemeColor>('booket');

  function handleStartMatch(config: MatchConfig) {
    const newMatch = createMatch(config);
    setMatch(newMatch);
    setCurrentMatchId(newMatch.id);
    saveMatch(newMatch);
    setView('scoring');
  }

  function handleMatchUpdate(updated: MatchState) { setMatch(updated); }
  function handleMatchEnd(ended: MatchState)       { setMatch(ended); setView('result'); }
  function handleResumeMatch(m: MatchState)        { setMatch(m); setView(m.phase === 'result' ? 'result' : 'scoring'); }
  function handleNewMatch()                         { setMatch(null); setView('setup'); }
  function handleHome()                             { setMatch(null); setView('home'); }

  return (
    <div className={`app theme-${theme} ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <button className="header-home-btn" onClick={handleHome}>
          <img src="/images/booket-logo.png" alt="BOOKET" className="header-logo" />
        </button>
        <div className="header-controls">
          {/* Theme picker */}
          <div className="theme-pills">
            {THEME_OPTIONS.map(t => (
              <button
                key={t.id}
                className={`theme-pill theme-pill-${t.id} ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
                title={t.label}
              >
                {t.emoji}
              </button>
            ))}
          </div>
          {/* Dark mode */}
          <button className="theme-toggle" onClick={() => setDarkMode(d => !d)} title="Dark/light mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {view === 'home'    && <HomeScreen    onNewMatch={handleNewMatch} onResumeMatch={handleResumeMatch} />}
        {view === 'setup'   && <MatchSetup    onStart={handleStartMatch} />}
        {view === 'scoring' && match && <ScoringScreen match={match} onMatchUpdate={handleMatchUpdate} onMatchEnd={handleMatchEnd} />}
        {view === 'result'  && match && <ResultScreen  match={match} onNewMatch={handleNewMatch} onHome={handleHome} />}
      </main>
    </div>
  );
}
