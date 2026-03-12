import React, { useState } from "react";
import { Search, Loader2, AlertCircle, Package, TrendingDown, MessageSquare } from "lucide-react";
import { SentimentChart } from "./components/SentimentChart";
import { ComplaintChart } from "./components/ComplaintChart";
import { Recommendations } from "./components/Recommendations";
import { analyzeProduct as analyzeProductService } from "./services/geminiService";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<any>(null);

  const analyzeProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const data = await analyzeProductService(url);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-zinc-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">Return Intelligence</h1>
          </div>
          <div className="text-sm text-indigo-300/60 font-medium px-3 py-1 bg-white/5 rounded-full border border-white/5">AI Agent System</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 p-8 mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h2 className="text-xl font-medium mb-6 text-slate-100 relative z-10">Analyze Product Returns</h2>
          <form onSubmit={analyzeProduct} className="flex flex-col sm:flex-row gap-4 relative z-10">
            <div className="relative flex-1 group/input">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Amazon or Flipkart product URL..."
                className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl leading-5 bg-black/50 placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 shadow-inner"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-sm font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/40"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Analyzing...
                </>
              ) : (
                "Analyze Product"
              )}
            </button>
          </form>
          {error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-300 backdrop-blur-md animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-indigo-300 font-medium animate-pulse tracking-wide">
              AI Agents are scraping reviews and analyzing patterns...
            </p>
          </div>
        )}

        {/* Dashboard */}
        {report && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between bg-white/[0.02] backdrop-blur-lg border border-white/5 p-6 rounded-3xl">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{report.productName}</h2>
                <a 
                  href={report.productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline break-all inline-flex items-center gap-1 transition-colors"
                >
                  {report.productUrl}
                </a>
                <p className="text-slate-400 mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Analyzed <strong className="text-slate-200">{report.totalReviews.toLocaleString()}</strong> reviews to identify return patterns.
                </p>
              </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 group">
                <div className="flex items-center gap-3 text-slate-400 mb-4">
                  <div className="p-2.5 bg-rose-500/10 rounded-xl group-hover:bg-rose-500/20 transition-colors">
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                  </div>
                  <h3 className="font-medium tracking-wide">Negative Sentiment</h3>
                </div>
                <p className="text-5xl font-bold text-white tracking-tight">
                  {Math.round((report.sentimentBreakdown.negative / report.totalReviews) * 100)}<span className="text-2xl text-slate-500">%</span>
                </p>
              </div>
              <div className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-3xl border border-white/5 md:col-span-2 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 group">
                <div className="flex items-center gap-3 text-slate-400 mb-6">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="font-medium tracking-wide">Top Complaint Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {report.topKeywords.map((keyword: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-sm font-medium border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/20 hover:text-indigo-100 transition-all duration-300 cursor-default shadow-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentChart data={report.sentimentBreakdown} />
              <ComplaintChart data={report.complaintCategories} />
            </div>

            {/* Insights & Recommendations */}
            <Recommendations insights={report.insights} recommendations={report.recommendations} />
          </div>
        )}
      </main>
    </div>
  );
}
