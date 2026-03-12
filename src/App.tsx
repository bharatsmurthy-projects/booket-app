import React, { useState, useEffect } from 'react';
import type { MatchState, MatchConfig } from './types';
import { createMatch } from './lib/gameEngine';
import { saveMatch, setCurrentMatchId } from './lib/persistence';
import HomeScreen from './pages/HomeScreen';
import MatchSetup from './pages/MatchSetup';
import ScoringScreen from './pages/ScoringScreen';
import ResultScreen from './pages/ResultScreen';
import ConfirmDialog from './components/ConfirmDialog';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Smooth transition helper
  function transitionToView(newView: AppView, delay = 300) {
    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setTimeout(() => setIsTransitioning(false), 50);
    }, delay);
  }

  // Prevent accidental navigation away from match in progress
  useEffect(() => {
    if (view === 'scoring' && match) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [view, match]);

  function handleStartMatch(config: MatchConfig) {
    const newMatch = createMatch(config);
    setMatch(newMatch);
    setCurrentMatchId(newMatch.id);
    saveMatch(newMatch);
    transitionToView('scoring');
  }

  function handleMatchUpdate(updated: MatchState) { setMatch(updated); }
  
  function handleMatchEnd(ended: MatchState) { 
    setMatch(ended); 
    transitionToView('result');
  }
  
  function handleResumeMatch(m: MatchState) { 
    setMatch(m); 
    transitionToView(m.phase === 'result' ? 'result' : 'scoring');
  }
  
  function handleNewMatch() {
    // If there's a match in progress, confirm before creating new one
    if (match && view === 'scoring') {
      setConfirmDialog({
        isOpen: true,
        title: 'Start New Match?',
        message: 'Your current match is in progress. Starting a new match will end the current one. Continue?',
        onConfirm: () => {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setMatch(null);
          transitionToView('setup');
        },
      });
    } else {
      setMatch(null); 
      transitionToView('setup');
    }
  }
  
  function handleHome() {
    // If scoring a match, confirm before going home
    if (view === 'scoring' && match) {
      setConfirmDialog({
        isOpen: true,
        title: 'Leave Match?',
        message: 'Your match is in progress and will be saved. You can resume it from the home screen.',
        onConfirm: () => {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          // Save the match before leaving
          if (match) {
            saveMatch(match);
          }
          setMatch(null);
          transitionToView('home');
        },
      });
    } else {
      setMatch(null); 
      transitionToView('home');
    }
  }

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

      <main className={`app-main ${isTransitioning ? 'transitioning' : ''}`}>
        {view === 'home'    && <HomeScreen    onNewMatch={handleNewMatch} onResumeMatch={handleResumeMatch} />}
        {view === 'setup'   && <MatchSetup    onStart={handleStartMatch} />}
        {view === 'scoring' && match && <ScoringScreen match={match} onMatchUpdate={handleMatchUpdate} onMatchEnd={handleMatchEnd} />}
        {view === 'result'  && match && <ResultScreen  match={match} onNewMatch={handleNewMatch} onHome={handleHome} />}
      </main>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Continue"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
