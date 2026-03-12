import { DiagnosisResult } from '@/types/diagnosis';
import { generateFeedback } from '@/utils/generate-feedback';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://market-power-scan.vercel.app';

export function generateShareText(result: DiagnosisResult): string {
  const { estimatedIncomeRange, marketRank, battlePower, averageMultiple } = result;
  const { shortCatch } = generateFeedback(result);
  const rangeText = `${estimatedIncomeRange.min}万〜${estimatedIncomeRange.max}万円`;

  return `市場価値診断をやってみたら、
想定市場年収は${rangeText}、ランクは【${marketRank}】、戦闘力は【${battlePower}】でした。

${shortCatch}

日本平均の${averageMultiple}倍。

あなたも試してみて👇
${APP_URL}

#市場価値診断 #戦闘力診断 #転職 #副業`;
}
