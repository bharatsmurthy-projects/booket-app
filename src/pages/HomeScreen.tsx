import React, { useEffect, useState } from 'react';
import type { MatchState } from '../types';
import { loadMatches } from '../lib/persistence';

interface Props {
  onNewMatch: () => void;
  onResumeMatch: (match: MatchState) => void;
}

export default function HomeScreen({ onNewMatch, onResumeMatch }: Props) {
  const [recentMatches, setRecentMatches] = useState<MatchState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches().then(matches => {
      setRecentMatches(matches);
      setLoading(false);
    });
  }, []);

  const activeMatches = recentMatches.filter(m => m.phase !== 'result');
  const completedMatches = recentMatches.filter(m => m.phase === 'result');

  return (
    <div className="home-screen">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-logo">
          <img src="/images/booket-logo.png" alt="BOOKET" className="home-logo-img" />
        </div>
        <p className="home-tagline">The Book Cricket Card Game</p>
        <button className="btn-primary btn-xl" onClick={onNewMatch}>
          🏏 New Match
        </button>
      </div>

      {/* Recent matches */}
      {!loading && activeMatches.length > 0 && (
        <div className="matches-section">
          <h3 className="section-title">📍 Continue Playing</h3>
          {activeMatches.map(m => (
            <MatchCard key={m.id} match={m} onResume={() => onResumeMatch(m)} />
          ))}
        </div>
      )}

      {!loading && completedMatches.length > 0 && (
        <div className="matches-section">
          <h3 className="section-title">📜 Recent Results</h3>
          {completedMatches.slice(0, 5).map(m => (
            <MatchCard key={m.id} match={m} onResume={() => onResumeMatch(m)} />
          ))}
        </div>
      )}

      {loading && (
        <div className="loading-state">Loading matches…</div>
      )}
    </div>
  );
}

function MatchCard({ match, onResume }: { match: MatchState; onResume: () => void }) {
  const cfg = match.config;
  const inn1 = match.innings1;
  const inn2 = match.innings2;
  const isComplete = match.phase === 'result';
  const date = new Date(match.createdAt).toLocaleDateString();

  return (
    <div className="match-card" onClick={onResume}>
      <div className="mc-teams">
        <span className="mc-team">{cfg.team1Name}</span>
        <span className="mc-vs">vs</span>
        <span className="mc-team">{cfg.team2Name}</span>
      </div>
      <div className="mc-scores">
        <span>{inn1.totalRuns}/{inn1.totalWickets}</span>
        {inn2 && <span>— {inn2.totalRuns}/{inn2.totalWickets}</span>}
      </div>
      <div className="mc-meta">
        <span>{cfg.totalOvers} overs</span>
        <span>{date}</span>
        <span className={`mc-status ${isComplete ? 'complete' : 'live'}`}>
          {isComplete ? '✓ Complete' : '● Live'}
        </span>
      </div>
      {isComplete && inn2?.wonBy && (
        <div className="mc-result">{inn2.wonBy}</div>
      )}
    </div>
  );
}
