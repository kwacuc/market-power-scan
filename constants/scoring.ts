import { JobCategory, ExperienceYears, IncomeGrowthRate, AIUsageLevel, Region, MarketRank } from '@/types/diagnosis';

export const JAPAN_AVERAGE_INCOME = 460; // 万円

export const JOB_BASE_INCOME: Record<JobCategory, number> = {
  '営業': 500,
  'マーケティング': 550,
  'コンサル': 750,
  '事務': 380,
  'デザイン': 500,
  'カスタマーサポート': 420,
  'エンジニア（Web/アプリ）': 650,
  'AIエンジニア / データ': 850,
  'インフラ / SRE / DevOps': 750,
  '社内SE / 情シス': 560,
  'EC / 物販': 520,
  'プロジェクトマネジメント': 700,
  'その他': 500,
};

export const EXPERIENCE_MULTIPLIER: Record<ExperienceYears, number> = {
  '0〜1年': 0.75,
  '2〜3年': 0.90,
  '4〜6年': 1.05,
  '7〜10年': 1.20,
  '11年以上': 1.35,
};

export const JOB_TREND_MULTIPLIER: Record<JobCategory, number> = {
  '営業': 1.05,
  'マーケティング': 1.10,
  'コンサル': 1.20,
  '事務': 0.85,
  'デザイン': 1.00,
  'カスタマーサポート': 0.92,
  'エンジニア（Web/アプリ）': 1.10,
  'AIエンジニア / データ': 1.30,
  'インフラ / SRE / DevOps': 1.15,
  '社内SE / 情シス': 1.00,
  'EC / 物販': 1.05,
  'プロジェクトマネジメント': 1.10,
  'その他': 1.00,
};

export const AI_USAGE_MULTIPLIER: Record<AIUsageLevel, number> = {
  '使っていない': 1.00,
  'ChatGPTなどをたまに使う': 1.03,
  '日常業務の効率化に使っている': 1.07,
  '自動化やワークフロー構築に使っている': 1.12,
  'AIを組み込んだ成果物 / プロダクトを作っている': 1.20,
};

export const REGION_MULTIPLIER: Record<Region, number> = {
  '関東': 1.05,
  '関西': 1.00,
  '東海': 0.98,
  'その他': 0.95,
};

export const INCOME_GROWTH_MULTIPLIER: Record<IncomeGrowthRate, number> = {
  '横ばい': 1.00,
  '1.1倍': 1.03,
  '1.3倍': 1.06,
  '1.5倍以上': 1.10,
};

export const MARKET_SCORE_MULTIPLIER = [
  { min: 0, max: 29, multiplier: 0.90 },
  { min: 30, max: 44, multiplier: 0.97 },
  { min: 45, max: 59, multiplier: 1.00 },
  { min: 60, max: 74, multiplier: 1.08 },
  { min: 75, max: 84, multiplier: 1.18 },
  { min: 85, max: 94, multiplier: 1.30 },
  { min: 95, max: 100, multiplier: 1.45 },
];

export const INCOME_RANGE_RATIO = 0.12; // ±12%

export const RANK_THRESHOLDS: { min: number; max: number; rank: MarketRank; label: string }[] = [
  { min: 0, max: 299, rank: 'E', label: 'まだ覚醒前。でも伸びしろは最大級' },
  { min: 300, max: 399, rank: 'D', label: '市場価値はこれから。武器を1つ持てば跳ねる' },
  { min: 400, max: 599, rank: 'C', label: '平均以上。ここから掛け算で強くなる' },
  { min: 600, max: 899, rank: 'B', label: '十分強い。副業・転職で戦える水準' },
  { min: 900, max: 1199, rank: 'A', label: '市場価値高め。かなり有利に立ち回れる' },
  { min: 1200, max: 1499, rank: 'S', label: '希少人材クラス。条件交渉でも優位' },
  { min: 1500, max: 1999, rank: 'SS', label: '上位人材。収入の伸び代が非常に大きい' },
  { min: 2000, max: Infinity, rank: 'SSS', label: '規格外。個人で稼ぐ力もかなり強い' },
];

export const AXIS_WEIGHTS = {
  earningPower: 25,
  rarity: 20,
  reproducibility: 15,
  selfDrive: 15,
  scalability: 15,
  stability: 10,
};

export const AXIS_LABELS = {
  earningPower: '収益力',
  rarity: '希少性',
  reproducibility: '再現性',
  selfDrive: '自走力',
  scalability: '拡張性',
  stability: '安定性',
};
