import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ComplaintChartProps {
  data: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export function ComplaintChart({ data }: ComplaintChartProps) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group">
      <h3 className="text-xl font-medium text-white tracking-wide mb-6">Complaint Categories</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="category" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
              width={110}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', color: '#f8fafc' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} className="hover:opacity-80 transition-opacity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
