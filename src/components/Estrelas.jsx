"use client";

import { useState } from "react";

// estrelas clicáveis (avaliar)
export function EstrelasNota({ valor = 0, onChange, disabled = false }) {
  const [hover, setHover] = useState(0);
  const ativo = hover || valor;

  return (
    <div className="estrelas-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          className={n <= ativo ? "estrela cheia" : "estrela"}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange?.(n)}
          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// estrelas só de exibição (aceita valores quebrados, como 3.6)
export function EstrelasFixas({ valor = 0 }) {
  const pct = Math.max(0, Math.min(100, (valor / 5) * 100));

  return (
    <span className="estrelas-fixas" title={`${Number(valor).toFixed(1)} de 5`}>
      <span className="base">★★★★★</span>
      <span className="fill" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}