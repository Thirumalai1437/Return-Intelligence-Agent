import { Lightbulb, Target } from "lucide-react";

interface RecommendationsProps {
  insights: string[];
  recommendations: string[];
}

export function Recommendations({ insights, recommendations }: RecommendationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Insights */}
      <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium text-white tracking-wide">Key Insights</h3>
        </div>
        <ul className="space-y-6">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-4 group/item">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-medium text-indigo-300 mt-0.5 group-hover/item:bg-indigo-500/20 group-hover/item:border-indigo-500/30 transition-colors">
                {idx + 1}
              </span>
              <p className="text-slate-400 text-base leading-relaxed group-hover/item:text-slate-200 transition-colors">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-medium text-white tracking-wide">Actionable Recommendations</h3>
        </div>
        <ul className="space-y-6">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-4 group/item">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-medium text-emerald-300 mt-0.5 group-hover/item:bg-emerald-500/20 group-hover/item:border-emerald-500/30 transition-colors">
                {idx + 1}
              </span>
              <p className="text-slate-400 text-base leading-relaxed group-hover/item:text-slate-200 transition-colors">{rec}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
