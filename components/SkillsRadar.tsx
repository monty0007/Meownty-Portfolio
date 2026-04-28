import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface Props {
  data: { subject: string; A: number; fullMark: number }[];
  radius: string;
  fontSize: number;
}

const SkillsRadar: React.FC<Props> = ({ data, radius, fontSize }) => (
  <ResponsiveContainer width="100%" height="100%" minHeight={300}>
    <RadarChart cx="50%" cy="50%" outerRadius={radius} data={data}>
      <PolarGrid stroke="#000" strokeWidth={1} strokeDasharray="3 3" />
      <PolarAngleAxis
        dataKey="subject"
        tick={{ fill: '#000', fontWeight: '900', fontSize }}
      />
      <Radar
        name="Stats"
        dataKey="A"
        stroke="#FF4B4B"
        strokeWidth={4}
        fill="#FF4B4B"
        fillOpacity={0.6}
        animationDuration={600}
      />
    </RadarChart>
  </ResponsiveContainer>
);

export default SkillsRadar;
