import React from 'react';
import type { AnimationType } from '../types';

interface Props {
  type: AnimationType | null;
}

const ANIM_CONFIG: Record<AnimationType, { emoji?: string; image?: string; text: string; className: string }> = {
  four:   { image: '/images/Booket-4.png',   text: 'FOUR!',   className: 'anim-four' },
  six:    { image: '/images/Booket-6.png',   text: 'SIX!',    className: 'anim-six' },
  wicket: { image: '/images/Booket-out.png', text: 'WICKET!', className: 'anim-wicket' },
  impact: { emoji: '⚡',                     text: 'IMPACT!', className: 'anim-impact' },
  over:   { emoji: '🔔',                     text: 'OVER!',   className: 'anim-over' },
};

export default function AnimationOverlay({ type }: Props) {
  if (!type) return null;
  const cfg = ANIM_CONFIG[type];

  return (
    <div className={`anim-overlay ${cfg.className}`}>
      <div className="anim-content">
        {cfg.image
          ? <img src={cfg.image} alt={cfg.text} className="anim-image" />
          : <div className="anim-emoji">{cfg.emoji}</div>
        }
        <div className="anim-text">{cfg.text}</div>
      </div>
    </div>
  );
}
