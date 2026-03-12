'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { AxisScores } from '@/types/diagnosis';
import { AXIS_LABELS } from '@/constants/scoring';

interface Props {
  axisScores: AxisScores;
}

export default function MarketRadarChart({ axisScores }: Props) {
  const data = [
    { axis: AXIS_LABELS.earningPower, value: axisScores.earningPower },
    { axis: AXIS_LABELS.rarity, value: axisScores.rarity },
    { axis: AXIS_LABELS.reproducibility, value: axisScores.reproducibility },
    { axis: AXIS_LABELS.selfDrive, value: axisScores.selfDrive },
    { axis: AXIS_LABELS.scalability, value: axisScores.scalability },
    { axis: AXIS_LABELS.stability, value: axisScores.stability },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#1e3a4a" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
        />
        <Radar
          name="market"
          dataKey="value"
          stroke="#00d4ff"
          fill="#00d4ff"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
