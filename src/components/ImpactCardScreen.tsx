import React, { useState, useRef } from 'react';
import type { InningsData, ActiveEffect, ImpactCardEffect } from '../types';

interface QuickAction {
  label: string;
  runs?: number;
  wickets?: number;
  type?: 'double_over';
  color: 'green' | 'red' | 'yellow' | 'black' | 'blue';
}

interface PowerCard {
  id: string;
  icon: string;
  name: string;
  description: string;
  effect: Omit<ActiveEffect, 'id'>;
}

interface Props {
  innings: InningsData;
  onApply: (effect: ImpactCardEffect | 'active_effect', activeEffect?: Omit<ActiveEffect, 'id'>) => void;
}

export default function ImpactCardScreen({ innings, onApply }: Props) {
  const [showPowerCards, setShowPowerCards] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const customInputRef = useRef<HTMLInputElement>(null);

  // 3x3 Grid - Most common actions
  const quickActions: QuickAction[] = [
    { label: '+2', runs: 2, color: 'green' },
    { label: '+4', runs: 4, color: 'green' },
    { label: '+6', runs: 6, color: 'green' },
    { label: '-2', runs: -2, color: 'red' },
    { label: '-3', runs: -3, color: 'red' },
    { label: '-5', runs: -5, color: 'red' },
    { label: '×2', type: 'double_over', color: 'yellow' },
    { label: 'OUT', wickets: 1, color: 'black' },
    { label: 'FREE HIT', color: 'blue' }, // Free hit - handled specially
  ];

  // Power cards (expandable)
  const powerCards: PowerCard[] = [
    {
      id: 'power_play',
      icon: '🔥',
      name: 'Power Play',
      description: 'Next 2 balls count ×2',
      effect: {
        type: 'double_runs',
        ballsRemaining: 2,
        description: 'Power Play: 2 balls left',
      },
    },
    {
      id: 'boundary_boost',
      icon: '🎯',
      name: 'Boundary Boost',
      description: 'Next 4 or 6 gets +5 bonus',
      effect: {
        type: 'boundary_bonus',
        ballsRemaining: 1,
        value: 5,
        description: 'Boundary Boost active',
      },
    },
    {
      id: 'boundary_freeze',
      icon: '❄️',
      name: 'Boundary Freeze',
      description: 'Next 3 balls: No 4/6 (-5 if hit)',
      effect: {
        type: 'boundary_freeze',
        ballsRemaining: 3,
        penalty: -5,
        description: 'Boundary Freeze: 3 balls',
      },
    },
    {
      id: 'double_wicket',
      icon: '💥',
      name: 'Double Wicket',
      description: 'Next wicket counts as 2',
      effect: {
        type: 'double_wicket',
        ballsRemaining: 1,
        description: 'Double Wicket Risk',
      },
    },
  ];

  const applyQuickAction = (action: QuickAction) => {
    // Handle runs/wickets as normal impact card effects
    if (action.runs !== undefined) {
      const effect: ImpactCardEffect = action.runs >= 0 
        ? { type: 'runs_add', value: action.runs }
        : { type: 'runs_deduct', value: Math.abs(action.runs) };
      onApply(effect);
    } else if (action.wickets) {
      onApply({ type: 'wicket' });
    } else if (action.type === 'double_over') {
      onApply({ type: 'over_double' });
    } else if (action.label === 'FREE HIT') {
      // Free hit is an active effect
      onApply('active_effect', {
        type: 'free_hit',
        ballsRemaining: 1,
        description: 'Free Hit Active',
      });
    }
  };

  const applyPowerCard = (card: PowerCard) => {
    onApply('active_effect', card.effect);
  };

  const applyCustom = () => {
    const value = parseInt(customValue);
    if (!isNaN(value)) {
      const effect: ImpactCardEffect = value >= 0 
        ? { type: 'runs_add', value }
        : { type: 'runs_deduct', value: Math.abs(value) };
      onApply(effect);
    }
  };

  return (
    <div className="impact-card-modal">
      <div className="impact-card-overlay" />
      <div className="impact-card-content">
        <h2 className="impact-card-title">🎴 Impact Card</h2>

        {/* 3x3 Grid - Always Visible */}
        <div className="impact-quick-grid">
          {quickActions.map((action, i) => (
            <button
              key={i}
              className={`impact-quick-btn impact-btn-${action.color}`}
              onClick={() => applyQuickAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Custom Input - Matches expandable style */}
        <div className="impact-custom-container">
          <div className="impact-custom">
            <input
              ref={customInputRef}
              className="impact-custom-input"
              type="text"
              placeholder="Enter any value: +10, -8, +15, -20..."
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyCustom()}
              inputMode="numeric"
            />
            {customValue && (
              <button className="impact-custom-apply" onClick={applyCustom}>
                ✓
              </button>
            )}
          </div>
        </div>

        {/* Power Cards - Expandable */}
        <div className="impact-expandable">
          <button
            className="impact-expand-btn"
            onClick={() => setShowPowerCards(!showPowerCards)}
          >
            <span>{showPowerCards ? '▲' : '▼'} Power Cards</span>
          </button>
          {showPowerCards && (
            <div className="impact-expanded-content">
              {powerCards.map((card) => (
                <button
                  key={card.id}
                  className="impact-power-card"
                  onClick={() => applyPowerCard(card)}
                >
                  <span className="power-card-icon">{card.icon}</span>
                  <div className="power-card-text">
                    <div className="power-card-name">{card.name}</div>
                    <div className="power-card-desc">{card.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
