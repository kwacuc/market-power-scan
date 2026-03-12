'use client';

import { useState } from 'react';
import { DiagnosisInput, WorkStyle, Region, JobCategory, ExperienceYears, IncomeGrowthRate, ManagementCount, IndependenceExperience, IncomeSources, SNSFollowers, AIUsageLevel, SkillSet } from '@/types/diagnosis';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const WORK_STYLES: WorkStyle[] = ['会社員', 'フリーランス', '経営者', '副業中', '求職中'];
const REGIONS: Region[] = ['関東', '関西', '東海', 'その他'];
const JOB_CATEGORIES: JobCategory[] = [
  '営業', 'マーケティング', 'コンサル', '事務', 'デザイン', 'カスタマーサポート',
  'エンジニア（Web/アプリ）', 'AIエンジニア / データ', 'インフラ / SRE / DevOps',
  '社内SE / 情シス', 'EC / 物販', 'プロジェクトマネジメント', 'その他'
];
const EXPERIENCE_YEARS: ExperienceYears[] = ['0〜1年', '2〜3年', '4〜6年', '7〜10年', '11年以上'];
const INCOME_GROWTH_RATES: IncomeGrowthRate[] = ['横ばい', '1.1倍', '1.3倍', '1.5倍以上'];
const MANAGEMENT_COUNTS: ManagementCount[] = ['なし', '1〜3人', '4〜10人', '11人以上'];
const INDEPENDENCE_EXPERIENCES: IndependenceExperience[] = ['なし', '過去にあり', '現在あり'];
const INCOME_SOURCES: IncomeSources[] = ['1つ', '2つ', '3つ以上'];
const SNS_FOLLOWERS: SNSFollowers[] = ['0〜999', '1000〜4999', '5000〜9999', '10000以上'];
const AI_USAGE_LEVELS: AIUsageLevel[] = [
  '使っていない',
  'ChatGPTなどをたまに使う',
  '日常業務の効率化に使っている',
  '自動化やワークフロー構築に使っている',
  'AIを組み込んだ成果物 / プロダクトを作っている',
];

const SKILL_LABELS: { key: keyof SkillSet; label: string }[] = [
  { key: 'sales', label: '営業' },
  { key: 'marketing', label: 'マーケティング' },
  { key: 'writing', label: 'ライティング' },
  { key: 'design', label: 'デザイン' },
  { key: 'programming', label: 'プログラミング' },
  { key: 'aiUsage', label: 'AI活用' },
  { key: 'videoEditing', label: '動画編集' },
  { key: 'management', label: 'マネジメント' },
  { key: 'english', label: '英語' },
  { key: 'accounting', label: '会計 / 財務' },
  { key: 'snsOperation', label: 'SNS運用' },
  { key: 'ecBusiness', label: 'EC / 物販' },
  { key: 'projectMgmt', label: 'プロジェクト管理' },
];

const defaultInput: DiagnosisInput = {
  age: 30,
  region: '関東',
  workStyle: '会社員',
  industry: '',
  jobCategory: 'エンジニア（Web/アプリ）',
  experienceYears: '4〜6年',
  annualIncome: 500,
  sideJobMonthlyIncome: 0,
  businessMonthlyRevenue: 0,
  incomeGrowthRate: '横ばい',
  skills: {
    sales: 2, marketing: 2, writing: 2, design: 2, programming: 2,
    aiUsage: 2, videoEditing: 1, management: 1, english: 2, accounting: 1,
    snsOperation: 1, ecBusiness: 1, projectMgmt: 2,
  },
  managementCount: 'なし',
  sideJobExperienceYears: 0,
  independenceExperience: 'なし',
  hasCorporateExperience: false,
  incomeSources: '1つ',
  hasDirectClientExperience: false,
  hasProductSalesExperience: false,
  snsFollowers: '0〜999',
  aiUsageLevel: '使っていない',
  aiReplaceabilityScore: 3,
  trendAwarenessScore: 3,
};

interface Props {
  onSubmit: (input: DiagnosisInput) => void;
  isLoading: boolean;
}

function SelectGroup<T extends string>({
  label, value, options, onChange, vertical = false
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  vertical?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-cyan-500 tracking-widest">{label}</label>
      <div className={vertical ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}>
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-2 rounded-lg text-xs border transition-all text-left ${
              value === opt
                ? 'bg-cyan-500 border-cyan-500 text-black font-bold'
                : 'bg-transparent border-slate-700 text-slate-400 hover:border-cyan-700 hover:text-slate-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [input, setInput] = useState<DiagnosisInput>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('marketValueInput');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return defaultInput;
  });

  const update = <K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const updateSkill = (key: keyof SkillSet, value: number) => {
    setInput(prev => ({ ...prev, skills: { ...prev.skills, [key]: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('marketValueInput', JSON.stringify(input));
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Intro */}
      <div className="bg-[#040e1a] border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-lg">⚡</span>
        <div>
          <div className="text-xs text-slate-300 font-bold">約2〜3分で完了します</div>
          <div className="text-xs text-slate-500">入力内容はブラウザに自動保存されます</div>
        </div>
      </div>

      {/* 基本情報 */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-cyan-400 border-b border-cyan-900 pb-2 tracking-widest">◆ 基本情報</h2>

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">年齢</label>
          <input
            type="number"
            value={input.age}
            onChange={e => update('age', Number(e.target.value))}
            min={18} max={80}
            className="w-24 bg-[#040e1a] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <SelectGroup label="地域" value={input.region} options={REGIONS} onChange={v => update('region', v)} />
        <SelectGroup label="働き方" value={input.workStyle} options={WORK_STYLES} onChange={v => update('workStyle', v)} />

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">業種（任意）</label>
          <input
            type="text"
            value={input.industry}
            onChange={e => update('industry', e.target.value)}
            placeholder="例: IT、金融、製造、医療..."
            className="w-full bg-[#040e1a] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
          />
        </div>

        <SelectGroup label="職種カテゴリ" value={input.jobCategory} options={JOB_CATEGORIES} onChange={v => update('jobCategory', v)} />
        <SelectGroup label="経験年数" value={input.experienceYears} options={EXPERIENCE_YEARS} onChange={v => update('experienceYears', v)} />
      </section>

      {/* 年収・収入 */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-cyan-400 border-b border-cyan-900 pb-2 tracking-widest">◆ 年収・収入</h2>

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">現在の年収（万円）</label>
          <input
            type="number"
            value={input.annualIncome}
            onChange={e => update('annualIncome', Number(e.target.value))}
            min={0} max={9999}
            className="w-32 bg-[#040e1a] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">副業月収（万円）</label>
          <input
            type="number"
            value={input.sideJobMonthlyIncome}
            onChange={e => update('sideJobMonthlyIncome', Number(e.target.value))}
            min={0} max={999}
            className="w-32 bg-[#040e1a] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <SelectGroup label="直近1年の収入成長率" value={input.incomeGrowthRate} options={INCOME_GROWTH_RATES} onChange={v => update('incomeGrowthRate', v)} />
      </section>

      {/* スキル */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-cyan-400 border-b border-cyan-900 pb-2 tracking-widest">◆ スキル（0〜5で自己評価）</h2>
        <div className="space-y-4">
          {SKILL_LABELS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-300">{label}</label>
                <span className="text-cyan-400 text-sm font-bold">{input.skills[key]}</span>
              </div>
              <Slider
                value={[input.skills[key]]}
                onValueChange={(v) => updateSkill(key, Array.isArray(v) ? v[0] : v)}
                min={0} max={5} step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>0 未経験</span>
                <span>5 エキスパート</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 実績・再現性 */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-cyan-400 border-b border-cyan-900 pb-2 tracking-widest">◆ 実績・再現性</h2>

        <SelectGroup label="マネジメント人数" value={input.managementCount} options={MANAGEMENT_COUNTS} onChange={v => update('managementCount', v)} />

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">副業経験年数</label>
          <input
            type="number"
            value={input.sideJobExperienceYears}
            onChange={e => update('sideJobExperienceYears', Number(e.target.value))}
            min={0} max={30}
            className="w-24 bg-[#040e1a] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        <SelectGroup label="独立経験" value={input.independenceExperience} options={INDEPENDENCE_EXPERIENCES} onChange={v => update('independenceExperience', v)} />

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">法人化経験</label>
          <div className="flex gap-2">
            {[{ v: false, l: 'なし' }, { v: true, l: 'あり' }].map(({ v, l }) => (
              <button
                key={l}
                type="button"
                onClick={() => update('hasCorporateExperience', v)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  input.hasCorporateExperience === v
                    ? 'bg-cyan-500 border-cyan-500 text-black font-bold'
                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-cyan-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <SelectGroup label="収入源の数" value={input.incomeSources} options={INCOME_SOURCES} onChange={v => update('incomeSources', v)} />

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">顧客から直接お金をもらった経験</label>
          <div className="flex gap-2">
            {[{ v: false, l: 'なし' }, { v: true, l: 'あり' }].map(({ v, l }) => (
              <button
                key={l}
                type="button"
                onClick={() => update('hasDirectClientExperience', v)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  input.hasDirectClientExperience === v
                    ? 'bg-cyan-500 border-cyan-500 text-black font-bold'
                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-cyan-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-cyan-500 tracking-widest">自分の商品 / サービスを売った経験</label>
          <div className="flex gap-2">
            {[{ v: false, l: 'なし' }, { v: true, l: 'あり' }].map(({ v, l }) => (
              <button
                key={l}
                type="button"
                onClick={() => update('hasProductSalesExperience', v)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  input.hasProductSalesExperience === v
                    ? 'bg-cyan-500 border-cyan-500 text-black font-bold'
                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-cyan-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <SelectGroup label="SNSフォロワー規模" value={input.snsFollowers} options={SNS_FOLLOWERS} onChange={v => update('snsFollowers', v)} />
      </section>

      {/* AI時代の適応度 */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-cyan-400 border-b border-cyan-900 pb-2 tracking-widest">◆ AI時代の適応度</h2>

        <SelectGroup label="AIをどう使っているか" value={input.aiUsageLevel} options={AI_USAGE_LEVELS} onChange={v => update('aiUsageLevel', v)} vertical />

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-300">自分の仕事はAIで代替されにくいと思うか</label>
            <span className="text-cyan-400 text-sm font-bold">{input.aiReplaceabilityScore}</span>
          </div>
          <Slider
            value={[input.aiReplaceabilityScore]}
            onValueChange={(v) => update('aiReplaceabilityScore', Array.isArray(v) ? v[0] : v)}
            min={1} max={5} step={1}
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>1 代替されやすい</span>
            <span>5 代替されにくい</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-300">今後伸びる分野の知識を追っているか</label>
            <span className="text-cyan-400 text-sm font-bold">{input.trendAwarenessScore}</span>
          </div>
          <Slider
            value={[input.trendAwarenessScore]}
            onValueChange={(v) => update('trendAwarenessScore', Array.isArray(v) ? v[0] : v)}
            min={1} max={5} step={1}
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>1 あまり追っていない</span>
            <span>5 積極的に追っている</span>
          </div>
        </div>
      </section>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-6 text-lg font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-all"
        style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}
      >
        {isLoading ? '診断中...' : '戦闘力を計測する'}
      </Button>
    </form>
  );
}
