import React, { useMemo } from 'react';

const COLORS = ['#7c3aed', '#059669', '#0284c7', '#d97706', '#db2777'];

export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const distance = 26 + Math.random() * 26;
        return {
          id: i,
          color: COLORS[i % COLORS.length],
          tx: `${Math.cos(angle) * distance}px`,
          ty: `${Math.sin(angle) * distance}px`,
          delay: `${Math.random() * 60}ms`,
        };
      }),
    []
  );

  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{ backgroundColor: p.color, '--tx': p.tx, '--ty': p.ty, animationDelay: p.delay }}
        />
      ))}
    </span>
  );
}
