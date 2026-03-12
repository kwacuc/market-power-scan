'use client';

import { forwardRef } from 'react';
import { DiagnosisResult } from '@/types/diagnosis';
import MarketRadarChart from './radar-chart';
import { RANK_THRESHOLDS } from '@/constants/scoring';

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

      {/* Battle Power + Rank */}
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

      {/* Estimated Income */}
      <div className="bg-[#040e1a] border border-cyan-900 rounded-xl p-4 text-center space-y-1">
        <div className="text-xs text-slate-500 tracking-widest">想定市場年収</div>
        <div className="text-4xl font-bold text-white">
          <span className="text-cyan-400">{estimatedAnnualIncome.toLocaleString()}</span>
          <span className="text-lg text-slate-400 ml-1">万円</span>
        </div>
        <div className="text-xs text-slate-500">
          レンジ: {estimatedIncomeRange.min.toLocaleString()}万〜{estimatedIncomeRange.max.toLocaleString()}万円
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <span className="text-slate-400">日本平均の <span className="text-cyan-400 font-bold">{averageMultiple}倍</span></span>
          <span className="text-slate-400">上位 <span className="text-cyan-400 font-bold">{topPercentile}%</span> クラス</span>
        </div>
      </div>

      {/* Type + AI */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">市場価値タイプ</div>
          <div className="text-sm font-bold text-purple-400">{marketType}</div>
        </div>
        <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">AI耐性スコア</div>
          <div className="text-sm font-bold text-green-400">{aiResilienceScore} / 100</div>
          <div className="text-xs text-slate-500">{aiResilienceLabel}</div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-[#040e1a] border border-slate-800 rounded-xl p-3">
        <div className="text-xs text-slate-500 text-center mb-2">6軸スコア</div>
        <MarketRadarChart axisScores={axisScores} />
      </div>

      {/* Strengths */}
      <div className="space-y-2">
        <div className="text-xs text-cyan-500 tracking-widest">◆ 強みTOP3</div>
        {strengths.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-cyan-400">▸</span>
            <span className="text-slate-200">{s}</span>
          </div>
        ))}
      </div>

      {/* Improvements */}
      <div className="space-y-2">
        <div className="text-xs text-orange-500 tracking-widest">◆ 改善ポイントTOP3</div>
        {improvements.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-orange-400">▸</span>
            <span className="text-slate-200">{s}</span>
          </div>
        ))}
      </div>

      {/* Growth Potential */}
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
