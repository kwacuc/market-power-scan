import { DiagnosisResult } from '@/types/diagnosis';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://market-power-scan.vercel.app';

export function generateShareText(result: DiagnosisResult): string {
  const { estimatedIncomeRange, marketRank, battlePower, averageMultiple, marketType } = result;
  const rangeText = `${estimatedIncomeRange.min}万〜${estimatedIncomeRange.max}万円`;

  return `市場価値診断をやってみたら…

想定年収：${rangeText}
ランク：【${marketRank}】
戦闘力：【${battlePower}】
タイプ：${marketType}

日本平均の${averageMultiple}倍でした。

あなたも試してみて👇
${APP_URL}

#市場価値診断 #戦闘力診断 #転職 #副業`;
}
