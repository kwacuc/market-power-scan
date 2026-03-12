/**
 * ルールベースのフィードバック生成。
 * 将来的に LLM（OpenAI / Claude API など）に差し替えやすいよう、
 * このファイルに生成ロジックを集約しています。
 */
import { DiagnosisResult, DiagnosisFeedback } from '@/types/diagnosis';
import {
  RANK_OPENINGS,
  MARKET_TYPE_CLOSINGS,
  AXIS_STRENGTH_SHORT,
  AXIS_NEXT_ACTIONS,
  AI_ADVICE_TEMPLATES,
  SHORT_CATCH_BY_RANK,
} from '@/constants/feedback';

export function generateFeedback(result: DiagnosisResult): DiagnosisFeedback {
  const {
    marketRank,
    marketType,
    estimatedAnnualIncome,
    growthPotentialIncome,
    aiResilienceScore,
    strengths,
    improvements,
  } = result;

  // ── summary ──────────────────────────────────────────
  const opening = RANK_OPENINGS[marketRank];

  const s1 = AXIS_STRENGTH_SHORT[strengths[0]] ?? strengths[0];
  const s2 = AXIS_STRENGTH_SHORT[strengths[1]] ?? strengths[1];
  const strengthSentence = `特に「${s1}」と「${s2}」が強みで、${marketType}として評価されやすいタイプです。`;

  const growthRatio = growthPotentialIncome / Math.max(estimatedAnnualIncome, 1);
  const growthSentence =
    growthRatio >= 1.3
      ? `今後のスキル改善・AI活用・発信強化が進めば、${growthPotentialIncome.toLocaleString()}万円台まで伸びる可能性があります。`
      : growthRatio >= 1.15
      ? `スキルを磨けば${growthPotentialIncome.toLocaleString()}万円台も十分狙えるポテンシャルがあります。`
      : '';

  const closing = MARKET_TYPE_CLOSINGS[marketType];

  const summary = [opening, strengthSentence, growthSentence, closing]
    .filter(Boolean)
    .join('');

  // ── nextActions ───────────────────────────────────────
  const nextActions = improvements
    .slice(0, 3)
    .map(imp => AXIS_NEXT_ACTIONS[imp] ?? imp);

  // ── aiAdvice ─────────────────────────────────────────
  const aiAdvice =
    aiResilienceScore < 40
      ? AI_ADVICE_TEMPLATES.low
      : aiResilienceScore < 60
      ? AI_ADVICE_TEMPLATES.medium
      : aiResilienceScore < 80
      ? AI_ADVICE_TEMPLATES.high
      : AI_ADVICE_TEMPLATES.veryHigh;

  // ── shortCatch ────────────────────────────────────────
  const shortCatch = SHORT_CATCH_BY_RANK[marketRank];

  return { summary, nextActions, aiAdvice, shortCatch };
}
