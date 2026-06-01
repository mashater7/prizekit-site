export function parseEntries(text) {
  const seen = new Set();
  const out = [];
  for (const raw of String(text).split('\n')) {
    const v = raw.trim();
    if (v && !seen.has(v)) { seen.add(v); out.push(v); }
  }
  return out;
}

// rng() возвращает число [0,1). По умолчанию Math.random; в тестах подменяется.
export function pickWinners(entries, count, rng = Math.random) {
  const pool = [...entries];
  const n = Math.min(count, pool.length);
  const winners = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * pool.length);
    winners.push(pool.splice(idx, 1)[0]);
  }
  return winners;
}
