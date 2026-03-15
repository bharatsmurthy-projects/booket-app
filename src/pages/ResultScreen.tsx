import React, { useEffect, useState } from 'react';
import type { MatchState, InningsData, OverSummary, BallEvent } from '../types';

interface Props {
  match: MatchState;
  onNewMatch: () => void;
  onHome: () => void;
}

interface MatchStats {
  totalBalls: number;
  totalFours: number;
  totalSixes: number;
  totalWickets: number;
  highestOver: { overNum: number; runs: number };
  topScorer: { team: string; runs: number };
  impactCardsUsed: number;
  powerCardsUsed: number;
}

export default function ResultScreen({ match, onNewMatch, onHome }: Props) {
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const result = match.innings2?.wonBy ?? 'Match Complete';
  const inn1 = match.innings1;
  const inn2 = match.innings2;
  
  const stats = calculateMatchStats(match);

  const handleCopyMatchSummary = () => {
    const summary = generateMatchSummaryText(match);
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareMatch = async () => {
    const summary = generateMatchSummaryText(match);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booket Match Result',
          text: summary,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy
      handleCopyMatchSummary();
    }
  };

  return (
    <div className="result-screen">
      {/* Confetti animation */}
      <Confetti />
      
      {/* Winner banner */}
      <div className="result-banner">
        <div className="result-trophy">🏆</div>
        <h1 className="result-text">{result}</h1>
      </div>

      {/* Match Summary Cards */}
      <div className="result-summary-cards">
        <div className="summary-card">
          <div className="summary-card-label">1st Innings</div>
          <div className="summary-card-team">{inn1.teamName}</div>
          <div className="summary-card-score">{inn1.totalRuns}/{inn1.totalWickets}</div>
          <div className="summary-card-overs">({inn1.overs.length}.{inn1.currentOver?.balls.filter(b => !b.isImpactCard).length || 0} overs)</div>
        </div>
        
        {inn2 && (
          <div className="summary-card">
            <div className="summary-card-label">2nd Innings</div>
            <div className="summary-card-team">{inn2.teamName}</div>
            <div className="summary-card-score">{inn2.totalRuns}/{inn2.totalWickets}</div>
            <div className="summary-card-overs">({inn2.overs.length}.{inn2.currentOver?.balls.filter(b => !b.isImpactCard).length || 0} overs)</div>
          </div>
        )}
      </div>

      {/* Match Highlights */}
      <div className="result-highlights">
        <h3 className="highlights-title">Match Highlights</h3>
        <div className="highlights-grid">
          <div className="highlight-item">
            <span className="highlight-icon">🏏</span>
            <span className="highlight-value">{stats.totalFours}</span>
            <span className="highlight-label">Fours</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">💥</span>
            <span className="highlight-value">{stats.totalSixes}</span>
            <span className="highlight-label">Sixes</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🎯</span>
            <span className="highlight-value">{stats.totalWickets}</span>
            <span className="highlight-label">Wickets</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🔥</span>
            <span className="highlight-value">{stats.highestOver.runs}</span>
            <span className="highlight-label">Best Over</span>
          </div>
        </div>
      </div>

      {/* Statistics Toggle */}
      <button 
        className="stats-toggle-btn"
        onClick={() => setShowStats(!showStats)}
      >
        {showStats ? '▲' : '▼'} {showStats ? 'Hide' : 'Show'} Detailed Scorecard
      </button>

      {/* Detailed Scorecard */}
      {showStats && (
        <div className="scorecard">
          <InningsSummary innings={inn1} label="1st Innings" />
          {inn2 && <InningsSummary innings={inn2} label="2nd Innings" />}
        </div>
      )}

      {/* Action buttons - 2x2 Grid */}
      <div className="result-actions-grid">
        <button className="btn-share" onClick={handleShareMatch}>
          📤 Share
        </button>
        <button className="btn-copy" onClick={handleCopyMatchSummary}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
        <button className="btn-primary" onClick={onNewMatch}>
          🏏 New Match
        </button>
        <button className="btn-secondary" onClick={onHome}>
          🏠 Home
        </button>
      </div>
    </div>
  );
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function calculateMatchStats(match: MatchState): MatchStats {
  const allBalls: BallEvent[] = [];
  let totalFours = 0;
  let totalSixes = 0;
  let totalWickets = 0;
  let impactCardsUsed = 0;
  let powerCardsUsed = 0;
  let highestOver = { overNum: 0, runs: 0 };

  // Collect all balls from both innings
  [match.innings1, match.innings2].forEach(innings => {
    if (!innings) return;
    
    const allOvers = [...innings.overs, ...(innings.currentOver ? [innings.currentOver] : [])];
    
    allOvers.forEach(over => {
      // Track highest scoring over
      if (over.overRuns > highestOver.runs) {
        highestOver = { overNum: over.overNumber, runs: over.overRuns };
      }

      over.balls.forEach(ball => {
        allBalls.push(ball);
        
        if (ball.isImpactCard) {
          impactCardsUsed++;
        }
        
        if (!ball.isImpactCard) {
          if (ball.runs === 4) totalFours++;
          if (ball.runs === 6) totalSixes++;
          if (ball.isWicket) totalWickets++;
        }
      });
    });

    // Count power cards from active effects
    if (innings.activeEffects) {
      powerCardsUsed += innings.activeEffects.length;
    }
  });

  return {
    totalBalls: allBalls.filter(b => !b.isImpactCard).length,
    totalFours,
    totalSixes,
    totalWickets,
    highestOver,
    topScorer: { team: match.innings1.teamName, runs: match.innings1.totalRuns },
    impactCardsUsed,
    powerCardsUsed,
  };
}

function generateMatchSummaryText(match: MatchState): string {
  const inn1 = match.innings1;
  const inn2 = match.innings2;
  const result = match.innings2?.wonBy ?? 'Match Complete';
  
  const stats = calculateMatchStats(match);
  
  // Format date and time
  const matchDate = new Date(match.config.date || match.createdAt);
  const dayOfWeek = matchDate.toLocaleDateString('en-US', { weekday: 'short' });
  const dateFormatted = matchDate.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).replace(/ /g, '-');
  const time = matchDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }).toLowerCase();
  
  let summary = `🏏 BOOKET MATCH RESULT 🏆\n\n`;
  summary += `${inn1.teamName} vs ${inn2?.teamName || 'TBD'}\n`;
  summary += `${dayOfWeek} ${dateFormatted} ${time} IST\n\n`;
  summary += `${result}\n\n`;
  summary += `📊 SCORECARD\n`;
  summary += `${inn1.teamName}: ${inn1.totalRuns}/${inn1.totalWickets} (${inn1.overs.length}.${inn1.currentOver?.balls.filter(b => !b.isImpactCard).length || 0} overs)\n`;
  
  if (inn2) {
    summary += `${inn2.teamName}: ${inn2.totalRuns}/${inn2.totalWickets} (${inn2.overs.length}.${inn2.currentOver?.balls.filter(b => !b.isImpactCard).length || 0} overs)\n`;
  }
  
  summary += `\n✨ HIGHLIGHTS\n`;
  summary += `Fours: ${stats.totalFours} | Sixes: ${stats.totalSixes}\n`;
  summary += `Wickets: ${stats.totalWickets}\n`;
  summary += `Best Over: Over ${stats.highestOver.overNum} (${stats.highestOver.runs} runs)\n`;
  summary += `\n🎮 Online scorecard at score.booketgame.com`;
  
  return summary;
}

// ─── Confetti Component ───────────────────────────────────────────────────────
function Confetti() {
  const [pieces, setPieces] = useState<Array<{id: number; left: number; delay: number; duration: number; color: string}>>([]);

  useEffect(() => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      color: ['#ffd700', '#ff8c00', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)]
    }));
    
    setPieces(confettiPieces);
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color
          }}
        />
      ))}
    </div>
  );
}

// ─── Innings Summary ──────────────────────────────────────────────────────────
function InningsSummary({ innings, label }: { innings: InningsData; label: string }) {
  const allOvers = [
    ...innings.overs,
    ...(innings.currentOver ? [innings.currentOver] : []),
  ];

  return (
    <div className="sc-innings">
      <div className="sc-innings-header">
        <span className="sc-innings-label">{label}</span>
        <span className="sc-team">{innings.teamName}</span>
        <span className="sc-total">{innings.totalRuns}/{innings.totalWickets}</span>
      </div>

      {allOvers.map(over => (
        <OverRow key={over.overNumber} over={over} />
      ))}

      {innings.target && (
        <div className="sc-target">Target was: {innings.target}</div>
      )}
    </div>
  );
}

function OverRow({ over }: { over: OverSummary }) {
  const realBalls = over.balls.filter(b => !b.isImpactCard);
  const impactBalls = over.balls.filter(b => b.isImpactCard);

  return (
    <div className="sc-over-row">
      <span className="sc-over-num">Ov {over.overNumber}</span>
      <div className="sc-over-balls">
        {realBalls.map((b, i) => (
          <span
            key={i}
            className={`sc-ball ${b.isWicket ? 'scb-w' : b.runs === 6 ? 'scb-six' : b.runs === 4 ? 'scb-four' : b.runs === 0 ? 'scb-dot' : 'scb-runs'}`}
          >
            {b.isWicket ? 'W' : b.runs === 0 ? '·' : b.runs}
          </span>
        ))}
        {impactBalls.map((b, i) => (
          <span key={`ic-${i}`} className="sc-ball scb-impact">
            {b.displayLabel || '⚡'}
          </span>
        ))}
      </div>
      <span className="sc-over-total">{over.overRuns}</span>
    </div>
  );
}
