import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

export function BiomarkerRadar({ data }) {
  if (!data) return null;

  const formattedData = data.map(d => ({
    subject: d.name,
    A: d.value,
    B: d.normal,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formattedData}>
        <PolarGrid stroke="var(--color-surface-elevated)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
        <Radar name="Child's Profile" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.5} animationDuration={1500} />
        <Radar name="Typical Baseline" dataKey="B" stroke="var(--color-text-muted)" fill="var(--color-text-muted)" fillOpacity={0.2} animationDuration={1500} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: 'none', borderRadius: '8px', color: 'var(--color-white)' }}
          itemStyle={{ color: 'var(--color-primary)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
