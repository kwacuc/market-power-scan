'use client';

import { useState, useRef } from 'react';
import InputForm from '@/components/input-form';
import ResultCard from '@/components/result-card';
import ShareButtons from '@/components/share-buttons';
import { DiagnosisInput } from '@/types/diagnosis';
import { DiagnosisResult } from '@/types/diagnosis';
import { calculateMarketValue } from '@/utils/calculate-market-value';

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (input: DiagnosisInput) => {
    setIsLoading(true);
    setTimeout(() => {
      const r = calculateMarketValue(input);
      setResult(r);
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#020d18] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#020d18]/90 backdrop-blur border-b border-cyan-900 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-cyan-400 tracking-widest">MARKET POWER SCAN</span>
          <div className="ml-auto text-xs text-slate-600">市場価値スカウター</div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Hero */}
        {!result && (
          <div className="text-center space-y-3 mb-10">
            <div className="text-xs text-cyan-500 tracking-widest">SCAN YOUR MARKET VALUE</div>
            <h1 className="text-2xl font-black text-white">
              あなたの市場価値、<br />
              <span className="text-cyan-400">戦闘力いくつ？</span>
            </h1>
            <p className="text-sm text-slate-400">
              スキル・経験・収入から、転職・独立時の<br />
              想定市場年収と戦闘力を診断します。
            </p>
          </div>
        )}

        {/* Loading animation */}
        {isLoading && (
          <div className="fixed inset-0 bg-[#020d18]/95 z-50 flex flex-col items-center justify-center gap-6">
            <div className="text-xs text-cyan-500 tracking-widest animate-pulse">SCANNING...</div>
            <div className="text-6xl font-bold text-cyan-400 animate-pulse" style={{ textShadow: '0 0 30px #00d4ff' }}>
              ????
            </div>
            <div className="text-slate-400 text-sm">市場価値を計測中...</div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {!result && (
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}

        {/* Result */}
        {result && (
          <div id="result-section" className="space-y-6">
            <div className="text-center">
              <div className="text-xs text-cyan-500 tracking-widest mb-2">SCAN COMPLETE</div>
              <h2 className="text-lg font-bold text-white">診断結果</h2>
            </div>

            <ResultCard result={result} ref={resultCardRef} />
            <ShareButtons result={result} resultCardRef={resultCardRef} />

            <button
              onClick={handleReset}
              className="w-full py-3 text-sm text-slate-400 border border-slate-700 rounded-xl hover:border-cyan-700 hover:text-slate-200 transition-all"
            >
              もう一度診断する
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
