import {
  READINESS_BANDS,
  READINESS_KEYS,
  READINESS_WEIGHTS,
  type ReadinessKey,
} from './config';

export type ReadinessAnswers = Partial<Record<ReadinessKey, boolean>>;
export type ReadinessBand = 'ready' | 'mostly' | 'gaps' | 'costly';

export interface ReadinessGap {
  key: ReadinessKey;
  weight: number;
}

export interface ReadinessResult {
  /** Out of 100. */
  score: number;
  answered: number;
  total: number;
  complete: boolean;
  band: ReadinessBand;
  /** Answered "no", heaviest first — so the reader starts where it pays. */
  gaps: ReadinessGap[];
}

export function runReadiness(answers: ReadinessAnswers): ReadinessResult {
  let score = 0;
  let answered = 0;
  const gaps: ReadinessGap[] = [];

  for (const key of READINESS_KEYS) {
    const value = answers[key];
    if (value === undefined) continue;
    answered += 1;
    if (value) score += READINESS_WEIGHTS[key];
    else gaps.push({ key, weight: READINESS_WEIGHTS[key] });
  }

  gaps.sort((a, b) => b.weight - a.weight);

  const band: ReadinessBand =
    score >= READINESS_BANDS.ready
      ? 'ready'
      : score >= READINESS_BANDS.mostly
        ? 'mostly'
        : score >= READINESS_BANDS.gaps
          ? 'gaps'
          : 'costly';

  return {
    score,
    answered,
    total: READINESS_KEYS.length,
    complete: answered === READINESS_KEYS.length,
    band,
    gaps,
  };
}
