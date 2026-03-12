import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SentimentChartProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const COLORS = ["#10b981", "#64748b", "#f43f5e"]; // emerald-500, slate-500, rose-500

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData = [
    { name: "Positive", value: data.positive },
    { name: "Neutral", value: data.neutral },
    { name: "Negative", value: data.negative },
  ];

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group">
      <h3 className="text-xl font-medium text-white tracking-wide mb-6">Sentiment Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', color: '#f8fafc' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
