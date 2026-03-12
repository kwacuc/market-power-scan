export type WorkStyle = '会社員' | 'フリーランス' | '経営者' | '副業中' | '求職中';
export type Region = '関東' | '関西' | '東海' | 'その他';
export type JobCategory =
  | '営業'
  | 'マーケティング'
  | 'コンサル'
  | '事務'
  | 'デザイン'
  | 'カスタマーサポート'
  | 'エンジニア（Web/アプリ）'
  | 'AIエンジニア / データ'
  | 'インフラ / SRE / DevOps'
  | '社内SE / 情シス'
  | 'EC / 物販'
  | 'プロジェクトマネジメント'
  | 'その他';
export type ExperienceYears = '0〜1年' | '2〜3年' | '4〜6年' | '7〜10年' | '11年以上';
export type IncomeGrowthRate = '横ばい' | '1.1倍' | '1.3倍' | '1.5倍以上';
export type ManagementCount = 'なし' | '1〜3人' | '4〜10人' | '11人以上';
export type IndependenceExperience = 'なし' | '過去にあり' | '現在あり';
export type IncomeSources = '1つ' | '2つ' | '3つ以上';
export type SNSFollowers = '0〜999' | '1000〜4999' | '5000〜9999' | '10000以上';
export type AIUsageLevel =
  | '使っていない'
  | 'ChatGPTなどをたまに使う'
  | '日常業務の効率化に使っている'
  | '自動化やワークフロー構築に使っている'
  | 'AIを組み込んだ成果物 / プロダクトを作っている';

export interface SkillSet {
  sales: number;         // 営業
  marketing: number;    // マーケティング
  writing: number;      // ライティング
  design: number;       // デザイン
  programming: number;  // プログラミング
  aiUsage: number;      // AI活用
  videoEditing: number; // 動画編集
  management: number;   // マネジメント
  english: number;      // 英語
  accounting: number;   // 会計/財務
  snsOperation: number; // SNS運用
  ecBusiness: number;   // EC/物販
  projectMgmt: number;  // プロジェクト管理
}

export interface DiagnosisInput {
  // Basic
  age: number;
  region: Region;
  workStyle: WorkStyle;
  industry: string;
  jobCategory: JobCategory;
  experienceYears: ExperienceYears;
  // Income
  annualIncome: number;
  sideJobMonthlyIncome: number;
  businessMonthlyRevenue: number;
  incomeGrowthRate: IncomeGrowthRate;
  // Skills
  skills: SkillSet;
  // Achievements
  managementCount: ManagementCount;
  sideJobExperienceYears: number;
  independenceExperience: IndependenceExperience;
  hasCorporateExperience: boolean;
  incomeSources: IncomeSources;
  hasDirectClientExperience: boolean;
  hasProductSalesExperience: boolean;
  snsFollowers: SNSFollowers;
  // AI
  aiUsageLevel: AIUsageLevel;
  aiReplaceabilityScore: number; // 1〜5 (代替されにくさ)
  trendAwarenessScore: number;   // 1〜5 (伸びる分野の知識)
}

export type MarketRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
export type MarketType =
  | '自走型プレイヤー'
  | '専門職ハイスキル型'
  | '経営 / マネジメント型'
  | '安定成長型'
  | '伸びしろ特化型';

export interface AxisScores {
  earningPower: number;     // 収益力
  rarity: number;           // 希少性
  reproducibility: number;  // 再現性
  selfDrive: number;        // 自走力
  scalability: number;      // 拡張性
  stability: number;        // 安定性
}

export interface DiagnosisResult {
  marketScore: number;
  estimatedAnnualIncome: number;
  estimatedIncomeRange: { min: number; max: number };
  battlePower: number;
  marketRank: MarketRank;
  growthPotentialIncome: number;
  aiResilienceScore: number;
  aiResilienceLabel: string;
  marketType: MarketType;
  axisScores: AxisScores;
  strengths: string[];
  improvements: string[];
  averageMultiple: number;
  topPercentile: number;
}

export interface DiagnosisFeedback {
  summary: string;
  nextActions: string[];
  aiAdvice: string;
  shortCatch: string;
}
