import React, { useState } from 'react';
import type { MatchConfig } from '../types';

interface Props {
  onStart: (config: MatchConfig) => void;
}

export default function MatchSetup({ onStart }: Props) {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [overs, setOvers] = useState(5);
  const [wickets, setWickets] = useState(3);
  const [reviews, setReviews] = useState(3);
  const [impactAfter, setImpactAfter] = useState(3);
  const [tossWinner, setTossWinner] = useState('');
  const [tossChoice, setTossChoice] = useState<'bat' | 'bowl'>('bat');
  const [step, setStep] = useState<'teams' | 'rules' | 'toss'>('teams');

  const canProceedTeams = team1.trim().length >= 2 && team2.trim().length >= 2;
  const canProceedToss = tossWinner !== '';

  function handleStart() {
    if (!canProceedTeams || !canProceedToss) return;
    onStart({
      team1Name: team1.trim(),
      team2Name: team2.trim(),
      totalOvers: overs,
      totalWickets: wickets,
      totalReviews: reviews,
      impactCardAfterBall: impactAfter,
      tossWinner,
      tossChoice,
      date: new Date().toISOString(),
    });
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">

        {/* Step indicator */}
        <div className="step-dots">
          {['teams', 'rules', 'toss'].map((s, i) => (
            <div
              key={s}
              className={`step-dot ${step === s ? 'active' : ''} ${
                ['teams', 'rules', 'toss'].indexOf(step) > i ? 'done' : ''
              }`}
            />
          ))}
        </div>

        {/* Step: Teams */}
        {step === 'teams' && (
          <div className="step-content">
            <h2 className="step-title">⚔️ Set Your Teams</h2>
            <div className="team-inputs">
              <div className="input-group">
                <label>Team 1</label>
                <input
                  className="big-input"
                  type="text"
                  placeholder="e.g. Blasters"
                  value={team1}
                  onChange={e => setTeam1(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
              </div>
              <div className="vs-badge">VS</div>
              <div className="input-group">
                <label>Team 2</label>
                <input
                  className="big-input"
                  type="text"
                  placeholder="e.g. Strikers"
                  value={team2}
                  onChange={e => setTeam2(e.target.value)}
                  maxLength={20}
                />
              </div>
            </div>
            <button
              className="btn-primary"
              disabled={!canProceedTeams}
              onClick={() => setStep('rules')}
            >
              Next →
            </button>
          </div>
        )}

        {/* Step: Rules */}
        {step === 'rules' && (
          <div className="step-content">
            <h2 className="step-title">📋 Match Rules</h2>
            <div className="rules-grid">
              <Stepper label="Overs" value={overs} min={1} max={20} onChange={setOvers} />
              <Stepper label="Wickets" value={wickets} min={1} max={10} onChange={setWickets} />
              <Stepper label="Reviews" value={reviews} min={0} max={5} onChange={setReviews} />
              <Stepper label="Impact Card after ball" value={impactAfter} min={1} max={5} onChange={setImpactAfter} />
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep('teams')}>← Back</button>
              <button className="btn-primary" onClick={() => setStep('toss')}>Next →</button>
            </div>
          </div>
        )}

        {/* Step: Toss */}
        {step === 'toss' && (
          <div className="step-content">
            <h2 className="step-title">🪙 Toss Time</h2>
            <p className="step-hint">Each team draws one card. Higher card wins.</p>

            <div className="toss-section">
              <p className="toss-label">Who won the toss?</p>
              <div className="toss-team-btns">
                {[team1, team2].map(t => (
                  <button
                    key={t}
                    className={`toss-team-btn ${tossWinner === t ? 'selected' : ''}`}
                    onClick={() => setTossWinner(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {tossWinner && (
                <>
                  <p className="toss-label">
                    <strong>{tossWinner}</strong> chose to…
                  </p>
                  <div className="toss-choice-btns">
                    {(['bat', 'bowl'] as const).map(c => (
                      <button
                        key={c}
                        className={`toss-choice-btn ${tossChoice === c ? 'selected' : ''}`}
                        onClick={() => setTossChoice(c)}
                      >
                        {c === 'bat' ? '🏏 Bat' : '🎳 Bowl'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {tossWinner && (
              <div className="toss-summary">
                <span className="toss-summary-text">
                  {tossWinner} will {tossChoice} first
                </span>
              </div>
            )}

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep('rules')}>← Back</button>
              <button
                className="btn-primary btn-start"
                disabled={!canProceedToss}
                onClick={handleStart}
              >
                🏏 Start Match!
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Stepper Component ────────────────────────────────────────────────────────
function Stepper({
  label, value, min, max, onChange
}: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button
          className="stepper-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >−</button>
        <span className="stepper-value">{value}</span>
        <button
          className="stepper-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >+</button>
      </div>
    </div>
  );
}
