import React from 'react';
import type { MatchState } from '../types';

interface Props {
  match: MatchState;
  onClose: () => void;
}

export default function MatchInfoModal({ match, onClose }: Props) {
  const c = match.config;
  const battedFirst = match.innings1.teamName;
  const fieldedFirst = battedFirst === c.team1Name ? c.team2Name : c.team1Name;

  const rows: [string, string][] = [
    ['Teams',               `${c.team1Name}  vs  ${c.team2Name}`],
    ['Overs',               String(c.totalOvers)],
    ['Wickets',             String(c.totalWickets)],
    ['Reviews per side',    String(c.totalReviews)],
    ['Impact Card after',   `Ball ${c.impactCardAfterBall}`],
    ['Toss won by',         c.tossWinner],
    ['Toss choice',         c.tossWinner + ' chose to ' + c.tossChoice],
    ['Batting first',       battedFirst],
    ['Bowling first',       fieldedFirst],
    ['Date',                new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">📋 Match Info</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-rows">
          {rows.map(([label, val]) => (
            <div key={label} className="modal-row">
              <span className="modal-label">{label}</span>
              <span className="modal-value">{val}</span>
            </div>
          ))}
        </div>

        {/* Current match status */}
        <div className="modal-status-header">Live Status</div>
        <div className="modal-rows">
          <div className="modal-row">
            <span className="modal-label">Innings</span>
            <span className="modal-value">{match.currentInnings === 1 ? '1st' : '2nd'}</span>
          </div>
          <div className="modal-row">
            <span className="modal-label">Batting</span>
            <span className="modal-value">{match.battingTeam}</span>
          </div>
          {match.innings2?.target && (
            <div className="modal-row">
              <span className="modal-label">Target</span>
              <span className="modal-value">{match.innings2.target}</span>
            </div>
          )}
        </div>

        <button className="modal-dismiss" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
