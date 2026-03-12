'use client';

import { forwardRef } from 'react';
import { DiagnosisResult } from '@/types/diagnosis';
import MarketRadarChart from './radar-chart';
import { JAPAN_AVERAGE_INCOME, RANK_THRESHOLDS } from '@/constants/scoring';
import { generateFeedback } from '@/utils/generate-feedback';

interface Props {
  result: DiagnosisResult;
}

const RANK_COLORS: Record<string, string> = {
  E: 'text-gray-400',
  D: 'text-green-400',
  C: 'text-blue-400',
  B: 'text-purple-400',
  A: 'text-yellow-400',
  S: 'text-orange-400',
  SS: 'text-red-400',
  SSS: 'text-pink-400',
};

const RANK_GLOW: Record<string, string> = {
  E: '',
  D: 'drop-shadow-[0_0_8px_#4ade80]',
  C: 'drop-shadow-[0_0_8px_#60a5fa]',
  B: 'drop-shadow-[0_0_8px_#c084fc]',
  A: 'drop-shadow-[0_0_8px_#facc15]',
  S: 'drop-shadow-[0_0_12px_#fb923c]',
  SS: 'drop-shadow-[0_0_16px_#f87171]',
  SSS: 'drop-shadow-[0_0_20px_#f472b6]',
};

const ResultCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const {
    estimatedAnnualIncome,
    estimatedIncomeRange,
    battlePower,
    marketRank,
    growthPotentialIncome,
    aiResilienceScore,
    aiResilienceLabel,
    marketType,
    axisScores,
    strengths,
    improvements,
    averageMultiple,
    topPercentile,
  } = result;

  const rankLabel = RANK_THRESHOLDS.find(r => r.rank === marketRank)?.label ?? '';
  const rankColor = RANK_COLORS[marketRank] ?? 'text-white';
  const rankGlow = RANK_GLOW[marketRank] ?? '';
  const feedback = generateFeedback(result);

  return (
    <div
      ref={ref}
      className="bg-[#020d18] border border-cyan-900 rounded-2xl p-6 space-y-6 text-white"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="text-xs text-cyan-500 tracking-widest uppercase">Market Power Scan</div>
        <div className="text-xs text-slate-500">市場価値診断</div>
      </div>

      {/* 1. Battle Power + Rank */}
      <div className="text-center space-y-2">
        <div className="text-slate-400 text-xs tracking-widest">BATTLE POWER</div>
        <div className="text-6xl font-bold text-cyan-400 tabular-nums" style={{ textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff' }}>
          {battlePower.toLocaleString()}
        </div>
        <div className={`text-5xl font-black ${rankColor} ${rankGlow}`}>
          RANK {marketRank}
        </div>
        <div className="text-slate-400 text-sm">{rankLabel}</div>
      </div>

      {/* 2. Estimated Income */}
      <div className="bg-[#040e1a] border border-cyan-900 rounded-xl p-4 text-center space-y-3">
        <div className="text-xs text-slate-500 tracking-widest">想定市場年収</div>
        <div className="text-4xl font-bold text-white">
          <span className="text-cyan-400">{estimatedAnnualIncome.toLocaleString()}</span>
          <span className="text-lg text-slate-400 ml-1">万円</span>
        </div>
        <div className="text-xs text-slate-500">
          レンジ: {estimatedIncomeRange.min.toLocaleString()}万〜{estimatedIncomeRange.max.toLocaleString()}万円
        </div>

        {/* 平均との差を強調 */}
        <div className="grid grid-cols-3 gap-2 items-center pt-1">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">日本平均</div>
            <div className="text-lg font-bold text-slate-400">{JAPAN_AVERAGE_INCOME}<span className="text-xs ml-0.5">万</span></div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-cyan-400" style={{ textShadow: '0 0 10px #00d4ff' }}>{averageMultiple}倍</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">あなた</div>
            <div className="text-lg font-bold text-cyan-400">{estimatedAnnualIncome.toLocaleString()}<span className="text-xs ml-0.5">万</span></div>
          </div>
        </div>

        {/* 上位%のゲーム化 */}
        <div className="bg-[#020d18] border border-cyan-800 rounded-lg py-2 px-3 text-center">
          <div className="text-xs text-slate-500">市場価値ランキング</div>
          <div className="text-xl font-black text-cyan-400">上位 {topPercentile}% クラス</div>
        </div>
      </div>

      {/* 3. Type + AI耐性 */}
      <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-3 text-center">
        <div className="text-xs text-slate-500 mb-1">市場価値タイプ</div>
        <div className="text-base font-bold text-purple-400">{marketType}</div>
      </div>

      <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-xs text-slate-500">AI耐性スコア</div>
            <div className="text-2xl font-bold text-green-400">{aiResilienceScore} <span className="text-sm text-slate-500">/ 100</span></div>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${
            aiResilienceScore >= 80 ? 'bg-green-900 text-green-400' :
            aiResilienceScore >= 60 ? 'bg-cyan-900 text-cyan-400' :
            aiResilienceScore >= 40 ? 'bg-yellow-900 text-yellow-400' :
            'bg-red-900 text-red-400'
          }`}>{aiResilienceLabel}</div>
        </div>
      </div>

      {/* 4. 6軸グラフ */}
      <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-3">
        <div className="text-xs text-slate-500 text-center mb-2">6軸スコア</div>
        <MarketRadarChart axisScores={axisScores} />
      </div>

      {/* 5. 総評コメント */}
      <div className="bg-[#040e1a] border border-cyan-900 rounded-xl p-4 space-y-3">
        <div className="text-xs text-cyan-500 tracking-widest">◆ 総評</div>
        {/* 一言まとめバッジ */}
        <div className="inline-block bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs px-3 py-1 rounded-full">
          {feedback.shortCatch}
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{feedback.summary}</p>
      </div>

      {/* 6. 次に伸ばすべきポイント */}
      <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="text-xs text-cyan-500 tracking-widest">◆ 次に伸ばすべきポイント</div>
        {feedback.nextActions.map((action, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-cyan-400 font-bold mt-0.5">{i + 1}.</span>
            <span className="text-slate-200">{action}</span>
          </div>
        ))}
      </div>

      {/* 7. AI時代のアドバイス */}
      <div className="bg-[#040e1a] border border-green-900 rounded-xl p-4 space-y-2">
        <div className="text-xs text-green-500 tracking-widest">◆ AI時代のアドバイス</div>
        <p className="text-sm text-slate-200 leading-relaxed">{feedback.aiAdvice}</p>
      </div>

      {/* 8. 強みTOP3 */}
      <div className="space-y-2">
        <div className="text-xs text-cyan-500 tracking-widest">◆ 強みTOP3</div>
        {strengths.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-cyan-400">▸</span>
            <span className="text-slate-200">{s}</span>
          </div>
        ))}
      </div>

      {/* 9. 改善ポイントTOP3 */}
      <div className="space-y-2">
        <div className="text-xs text-orange-500 tracking-widest">◆ 改善ポイントTOP3</div>
        {improvements.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-orange-400">▸</span>
            <span className="text-slate-200">{s}</span>
          </div>
        ))}
      </div>

      {/* 10. 伸びしろ年収 */}
      <div className="bg-[#040e1a] border border-purple-900 rounded-xl p-4 text-center">
        <div className="text-xs text-slate-500 mb-1">伸びしろ年収（ポテンシャル上限）</div>
        <div className="text-2xl font-bold text-purple-400">{growthPotentialIncome.toLocaleString()}万円</div>
        <div className="text-xs text-slate-500 mt-1">スキル改善・AI活用・発信強化が進んだ場合の目安</div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-800">
        市場価値スカウター | Market Power Scan
      </div>
    </div>
  );
});

ResultCard.displayName = 'ResultCard';
export default ResultCard;
