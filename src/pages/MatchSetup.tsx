import React, { useState, useMemo } from 'react';
import type { MatchConfig } from '../types';
import { truncateTeamName, TEAM_NAME_LIMITS } from '../lib/teamNameUtils';

interface Props {
  onStart: (config: MatchConfig) => void;
}

interface ValidationErrors {
  team1?: string;
  team2?: string;
  duplicate?: string;
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
  const [touched, setTouched] = useState({ team1: false, team2: false });

  // Validation logic
  const errors = useMemo<ValidationErrors>(() => {
    const errs: ValidationErrors = {};
    
    const trimmed1 = team1.trim();
    const trimmed2 = team2.trim();
    
    // Team 1 validation
    if (touched.team1 && trimmed1.length === 0) {
      errs.team1 = 'Team name is required';
    } else if (touched.team1 && trimmed1.length < 2) {
      errs.team1 = 'Team name must be at least 2 characters';
    }
    
    // Team 2 validation
    if (touched.team2 && trimmed2.length === 0) {
      errs.team2 = 'Team name is required';
    } else if (touched.team2 && trimmed2.length < 2) {
      errs.team2 = 'Team name must be at least 2 characters';
    }
    
    // Duplicate check
    if (trimmed1.length >= 2 && trimmed2.length >= 2 && 
        trimmed1.toLowerCase() === trimmed2.toLowerCase()) {
      errs.duplicate = 'Team names must be different';
    }
    
    return errs;
  }, [team1, team2, touched]);

  const canProceedTeams = team1.trim().length >= 2 && 
                          team2.trim().length >= 2 && 
                          !errors.duplicate;
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
                  className={`big-input ${errors.team1 ? 'input-error' : ''} ${!errors.team1 && team1.trim().length >= 2 ? 'input-success' : ''}`}
                  type="text"
                  placeholder="e.g. Blasters"
                  value={team1}
                  onChange={e => setTeam1(e.target.value)}
                  onBlur={() => setTouched({ ...touched, team1: true })}
                  maxLength={TEAM_NAME_LIMITS.INPUT_MAX}
                  autoFocus
                />
                {errors.team1 && <span className="input-error-message">{errors.team1}</span>}
                <span className="input-char-count">{team1.length}/{TEAM_NAME_LIMITS.INPUT_MAX}</span>
              </div>
              <div className="vs-badge">VS</div>
              <div className="input-group">
                <label>Team 2</label>
                <input
                  className={`big-input ${errors.team2 ? 'input-error' : ''} ${!errors.team2 && team2.trim().length >= 2 ? 'input-success' : ''}`}
                  type="text"
                  placeholder="e.g. Strikers"
                  value={team2}
                  onChange={e => setTeam2(e.target.value)}
                  onBlur={() => setTouched({ ...touched, team2: true })}
                  maxLength={TEAM_NAME_LIMITS.INPUT_MAX}
                />
                {errors.team2 && <span className="input-error-message">{errors.team2}</span>}
                <span className="input-char-count">{team2.length}/{TEAM_NAME_LIMITS.INPUT_MAX}</span>
              </div>
            </div>
            
            {/* Duplicate error message */}
            {errors.duplicate && (
              <div className="validation-error-banner">
                ⚠️ {errors.duplicate}
              </div>
            )}
            
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
                    title={t} 
                  >
                    {truncateTeamName(t, TEAM_NAME_LIMITS.TOSS_BUTTON)}
                  </button>
                ))}
              </div>

              {tossWinner && (
                <div className="toss-choice">
                  <p className="toss-label">
                    {truncateTeamName(tossWinner, TEAM_NAME_LIMITS.TOSS_BUTTON)} chooses to:
                  </p>
                  <div className="toss-choice-btns">
                    <button
                      className={`toss-choice-btn ${tossChoice === 'bat' ? 'selected' : ''}`}
                      onClick={() => setTossChoice('bat')}
                    >
                      🏏 Bat First
                    </button>
                    <button
                      className={`toss-choice-btn ${tossChoice === 'bowl' ? 'selected' : ''}`}
                      onClick={() => setTossChoice('bowl')}
                    >
                      ⚾ Bowl First
                    </button>
                  </div>
                </div>
              )}
              
              {tossWinner && (
                <div className="toss-summary">
                  <strong>{truncateTeamName(tossWinner, TEAM_NAME_LIMITS.TOSS_BUTTON)}</strong> will {tossChoice} first
                </div>
              )}
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep('rules')}>← Back</button>
              <button
                className="btn-primary btn-start"
                disabled={!canProceedToss}
                onClick={handleStart}
              >
                🏏 Start Match
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
function Stepper({ label, value, min, max, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const canDec = value > min;
  const canInc = value < max;

  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button className="stepper-btn" onClick={() => canDec && onChange(value - 1)} disabled={!canDec}>−</button>
        <span className="stepper-value">{value}</span>
        <button className="stepper-btn" onClick={() => canInc && onChange(value + 1)} disabled={!canInc}>+</button>
      </div>
    </div>
  );
}
