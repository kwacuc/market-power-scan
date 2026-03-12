import {
  DiagnosisInput,
  DiagnosisResult,
  AxisScores,
  MarketRank,
  MarketType,
} from '@/types/diagnosis';
import {
  JAPAN_AVERAGE_INCOME,
  JOB_BASE_INCOME,
  EXPERIENCE_MULTIPLIER,
  JOB_TREND_MULTIPLIER,
  AI_USAGE_MULTIPLIER,
  REGION_MULTIPLIER,
  INCOME_GROWTH_MULTIPLIER,
  MARKET_SCORE_MULTIPLIER,
  INCOME_RANGE_RATIO,
  RANK_THRESHOLDS,
  AXIS_WEIGHTS,
} from '@/constants/scoring';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateAxisScores(input: DiagnosisInput): AxisScores {
  const { skills, sideJobMonthlyIncome, independenceExperience, hasCorporateExperience,
    hasDirectClientExperience, hasProductSalesExperience, incomeSources,
    managementCount, sideJobExperienceYears } = input;

  // Skill combo bonuses
  let comboBonus = 0;
  if (skills.sales >= 4 && skills.marketing >= 4) comboBonus += 3;
  if (skills.programming >= 4 && skills.aiUsage >= 4) comboBonus += 5;
  if (skills.snsOperation >= 4 && skills.marketing >= 4) comboBonus += 3;
  if (skills.management >= 4 && skills.projectMgmt >= 4) comboBonus += 4;
  if (skills.ecBusiness >= 4 && skills.marketing >= 4) comboBonus += 3;

  // earningPower (収益力) 0〜100
  let earningPower = 0;
  earningPower += skills.sales * 5;           // max 25
  earningPower += skills.marketing * 4;       // max 20
  earningPower += skills.snsOperation * 3;    // max 15
  earningPower += skills.ecBusiness * 3;      // max 15
  if (sideJobMonthlyIncome >= 30) earningPower += 15;
  else if (sideJobMonthlyIncome >= 10) earningPower += 10;
  else if (sideJobMonthlyIncome > 0) earningPower += 5;
  earningPower += comboBonus / 2;
  earningPower = clamp(earningPower, 0, 100);

  // rarity (希少性) 0〜100
  let rarity = 0;
  rarity += skills.programming * 5;   // max 25
  rarity += skills.aiUsage * 6;       // max 30
  rarity += skills.english * 4;       // max 20
  rarity += skills.marketing * 2;     // max 10
  rarity += skills.design * 2;        // max 10
  rarity += comboBonus;
  rarity = clamp(rarity, 0, 100);

  // reproducibility (再現性) 0〜100
  let reproducibility = 0;
  reproducibility += skills.programming * 4;  // max 20
  reproducibility += skills.aiUsage * 4;      // max 20
  reproducibility += skills.projectMgmt * 4;  // max 20
  if (hasDirectClientExperience) reproducibility += 15;
  if (hasProductSalesExperience) reproducibility += 15;
  reproducibility += comboBonus / 2;
  reproducibility = clamp(reproducibility, 0, 100);

  // selfDrive (自走力) 0〜100
  let selfDrive = 0;
  selfDrive += skills.sales * 4;        // max 20
  selfDrive += skills.snsOperation * 3; // max 15
  selfDrive += skills.ecBusiness * 3;   // max 15
  selfDrive += skills.accounting * 3;   // max 15
  if (independenceExperience === '現在あり') selfDrive += 20;
  else if (independenceExperience === '過去にあり') selfDrive += 10;
  if (sideJobExperienceYears >= 3) selfDrive += 10;
  else if (sideJobExperienceYears >= 1) selfDrive += 5;
  selfDrive = clamp(selfDrive, 0, 100);

  // scalability (拡張性) 0〜100
  let scalability = 0;
  scalability += skills.management * 8;   // max 40
  scalability += skills.projectMgmt * 5;  // max 25
  const mgmtBonus = managementCount === '11人以上' ? 20 :
    managementCount === '4〜10人' ? 12 :
    managementCount === '1〜3人' ? 6 : 0;
  scalability += mgmtBonus;
  if (hasCorporateExperience) scalability += 10;
  scalability += comboBonus / 2;
  scalability = clamp(scalability, 0, 100);

  // stability (安定性) 0〜100
  let stability = 0;
  stability += skills.accounting * 4;    // max 20
  const incomeSourceBonus = incomeSources === '3つ以上' ? 30 :
    incomeSources === '2つ' ? 15 : 0;
  stability += incomeSourceBonus;
  if (hasDirectClientExperience) stability += 10;
  if (sideJobMonthlyIncome > 0) stability += 10;
  stability += skills.projectMgmt * 2;   // max 10
  stability += skills.management * 2;    // max 10
  stability = clamp(stability, 0, 100);

  return { earningPower, rarity, reproducibility, selfDrive, scalability, stability };
}

function calculateMarketScore(axisScores: AxisScores): number {
  const { earningPower, rarity, reproducibility, selfDrive, scalability, stability } = axisScores;
  const weighted =
    earningPower * AXIS_WEIGHTS.earningPower +
    rarity * AXIS_WEIGHTS.rarity +
    reproducibility * AXIS_WEIGHTS.reproducibility +
    selfDrive * AXIS_WEIGHTS.selfDrive +
    scalability * AXIS_WEIGHTS.scalability +
    stability * AXIS_WEIGHTS.stability;
  return Math.round(weighted / 100);
}

function getMarketScoreMultiplier(score: number): number {
  const entry = MARKET_SCORE_MULTIPLIER.find(e => score >= e.min && score <= e.max);
  return entry?.multiplier ?? 1.0;
}

function calculateSideJobBonus(input: DiagnosisInput): number {
  const { sideJobMonthlyIncome, independenceExperience, hasCorporateExperience,
    hasDirectClientExperience, hasProductSalesExperience, incomeSources } = input;

  let totalBonus = 0;
  if (sideJobMonthlyIncome >= 30) totalBonus += 10;
  else if (sideJobMonthlyIncome >= 10) totalBonus += 7;
  else if (sideJobMonthlyIncome > 0) totalBonus += 3;

  if (independenceExperience === '現在あり') totalBonus += 8;
  else if (independenceExperience === '過去にあり') totalBonus += 5;

  if (hasCorporateExperience) totalBonus += 7;
  if (hasDirectClientExperience) totalBonus += 7;
  if (hasProductSalesExperience) totalBonus += 7;

  if (incomeSources === '3つ以上') totalBonus += 8;
  else if (incomeSources === '2つ') totalBonus += 4;

  // Cap at 25%
  totalBonus = Math.min(totalBonus, 25);
  const bonus = 1 + totalBonus / 100;
  return bonus;
}

function calculateAIResilienceScore(input: DiagnosisInput): number {
  const { aiUsageLevel, aiReplaceabilityScore, trendAwarenessScore, jobCategory } = input;

  const aiUsageScore = {
    '使っていない': 0,
    'ChatGPTなどをたまに使う': 15,
    '日常業務の効率化に使っている': 35,
    '自動化やワークフロー構築に使っている': 55,
    'AIを組み込んだ成果物 / プロダクトを作っている': 70,
  }[aiUsageLevel];

  const trendMultiplier = JOB_TREND_MULTIPLIER[jobCategory];
  const trendScore = Math.round((trendMultiplier - 0.85) / (1.30 - 0.85) * 30);

  const score = aiUsageScore +
    (aiReplaceabilityScore - 1) * 4 +
    (trendAwarenessScore - 1) * 4 +
    trendScore;

  return clamp(score, 0, 100);
}

function getAIResilienceLabel(score: number): string {
  if (score >= 80) return '非常に高い';
  if (score >= 60) return '高い';
  if (score >= 40) return 'ふつう';
  return '低い';
}

function determineMarketType(axisScores: AxisScores): MarketType {
  const { earningPower, rarity, reproducibility, selfDrive, scalability, stability } = axisScores;
  const maxAxis = Math.max(earningPower, rarity, reproducibility, selfDrive, scalability, stability);

  if (scalability === maxAxis && scalability >= 60) return '経営 / マネジメント型';
  if (rarity === maxAxis && rarity >= 60) return '専門職ハイスキル型';
  if (selfDrive === maxAxis && selfDrive >= 60) return '自走型プレイヤー';
  if (stability === maxAxis) return '安定成長型';
  return '伸びしろ特化型';
}

function getRankFromIncome(income: number): MarketRank {
  const entry = RANK_THRESHOLDS.find(r => income >= r.min && income <= r.max);
  return entry?.rank ?? 'E';
}

function calculateBattlePower(marketScore: number, income: number, jobCategory: string): number {
  const base = marketScore * 99;
  const trendBonus = (JOB_TREND_MULTIPLIER[jobCategory as keyof typeof JOB_TREND_MULTIPLIER] - 1) * 500;
  const incomeBonus = Math.min(income / 2000 * 500, 500);
  return Math.round(clamp(base + trendBonus + incomeBonus, 0, 9999));
}

function getStrengthsAndImprovements(axisScores: AxisScores): { strengths: string[]; improvements: string[] } {
  const axes = Object.entries(axisScores) as [keyof AxisScores, number][];
  const sorted = [...axes].sort((a, b) => b[1] - a[1]);

  const strengthKeys = sorted.slice(0, 3).map(([k]) => k);
  const improvementKeys = sorted.slice(-3).reverse().map(([k]) => k);

  const axisToLabel: Record<keyof AxisScores, string> = {
    earningPower: '収益力（稼ぐ力）',
    rarity: '希少性（差別化力）',
    reproducibility: '再現性（実績の説明力）',
    selfDrive: '自走力（独力で動く力）',
    scalability: '拡張性（チームを動かす力）',
    stability: '安定性（収入の安定度）',
  };

  return {
    strengths: strengthKeys.map(k => axisToLabel[k]),
    improvements: improvementKeys.map(k => axisToLabel[k]),
  };
}

function calculateGrowthPotential(
  centralEstimate: number,
  axisScores: AxisScores,
  input: DiagnosisInput
): number {
  let growthMultiplier = 1.0;
  const { earningPower, rarity, selfDrive } = axisScores;

  if (earningPower < 40) growthMultiplier += 0.10;
  if (rarity < 40) growthMultiplier += 0.10;
  if (selfDrive < 40) growthMultiplier += 0.10;

  const aiUsageLevels: (typeof input.aiUsageLevel)[] = ['使っていない', 'ChatGPTなどをたまに使う'];
  if (aiUsageLevels.includes(input.aiUsageLevel)) growthMultiplier += 0.10;

  if (input.skills.snsOperation < 3) growthMultiplier += 0.05;
  if (input.skills.marketing < 3) growthMultiplier += 0.05;

  growthMultiplier = Math.min(growthMultiplier, 1.5);
  return Math.round(centralEstimate * growthMultiplier / 10) * 10;
}

function estimateTopPercentile(income: number): number {
  if (income >= 2000) return 1;
  if (income >= 1500) return 3;
  if (income >= 1200) return 6;
  if (income >= 1000) return 10;
  if (income >= 800) return 20;
  if (income >= 600) return 35;
  if (income >= 460) return 50;
  return 70;
}

export function calculateMarketValue(input: DiagnosisInput): DiagnosisResult {
  const axisScores = calculateAxisScores(input);
  const marketScore = calculateMarketScore(axisScores);

  const baseIncome = JOB_BASE_INCOME[input.jobCategory];
  const expMultiplier = EXPERIENCE_MULTIPLIER[input.experienceYears];
  const trendMultiplier = JOB_TREND_MULTIPLIER[input.jobCategory];
  const regionMultiplier = REGION_MULTIPLIER[input.region];
  const aiMultiplier = AI_USAGE_MULTIPLIER[input.aiUsageLevel];
  const sideJobBonus = calculateSideJobBonus(input);
  const growthRateMultiplier = INCOME_GROWTH_MULTIPLIER[input.incomeGrowthRate];
  const scoreMultiplier = getMarketScoreMultiplier(marketScore);

  const estimatedAnnualIncome = Math.round(
    baseIncome * expMultiplier * trendMultiplier * regionMultiplier *
    aiMultiplier * sideJobBonus * growthRateMultiplier * scoreMultiplier / 10
  ) * 10;

  const rangeMin = Math.round(estimatedAnnualIncome * (1 - INCOME_RANGE_RATIO) / 10) * 10;
  const rangeMax = Math.round(estimatedAnnualIncome * (1 + INCOME_RANGE_RATIO) / 10) * 10;

  const marketRank = getRankFromIncome(estimatedAnnualIncome);
  const battlePower = calculateBattlePower(marketScore, estimatedAnnualIncome, input.jobCategory);

  const aiResilienceScore = calculateAIResilienceScore(input);
  const aiResilienceLabel = getAIResilienceLabel(aiResilienceScore);

  const marketType = determineMarketType(axisScores);
  const { strengths, improvements } = getStrengthsAndImprovements(axisScores);

  const growthPotentialIncome = calculateGrowthPotential(estimatedAnnualIncome, axisScores, input);

  const averageMultiple = Math.round((estimatedAnnualIncome / JAPAN_AVERAGE_INCOME) * 10) / 10;
  const topPercentile = estimateTopPercentile(estimatedAnnualIncome);

  return {
    marketScore,
    estimatedAnnualIncome,
    estimatedIncomeRange: { min: rangeMin, max: rangeMax },
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
  };
}
