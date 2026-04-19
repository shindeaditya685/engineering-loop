"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  BarChart3,
  Zap,
  Target,
} from "lucide-react";

interface PredictionResult {
  actual_cutoff: number;
  apply: boolean;
  category: string;
  chance: "Safe" | "Moderate" | "Reach";
  college: string;
  difference: number;
  predicted_cutoff: number;
  probability: number;
  program: string;
  your_score: number;
}

interface PredictionSummary {
  safe: number;
  moderate: number;
  reach: number;
  total: number;
}

const branchOptions = [
  { value: "computer", label: "Computer Science" },
  { value: "electrical", label: "Electrical Engineering" },
  { value: "electronics", label: "Electronics & Communication" },
  { value: "mechanical", label: "Mechanical Engineering" },
  { value: "civil", label: "Civil Engineering" },
  { value: "chemical", label: "Chemical Engineering" },
];

const chanceConfig = {
  Safe: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    bar: "bg-emerald-400",
    icon: ShieldCheck,
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.1)]",
  },
  Moderate: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    bar: "bg-amber-400",
    icon: ShieldAlert,
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.1)]",
  },
  Reach: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    bar: "bg-red-400",
    icon: ShieldX,
    glow: "shadow-[0_0_20px_rgba(248,113,113,0.1)]",
  },
};

export default function PredictorTool() {
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("SC");
  const [branch, setBranch] = useState("computer");
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [summary, setSummary] = useState<PredictionSummary | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 1000) {
      setError("Please enter a valid GATE score (1-1000)");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setSummary(null);
    setSearched(true);

    try {
      const res = await fetch(
        "https://gate-college-predictor.onrender.com/api/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: scoreNum, category, branch }),
        },
      );

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      const sorted = data.results.sort(
        (a: PredictionResult, b: PredictionResult) =>
          b.probability - a.probability,
      );
      setResults(sorted);
      setSummary(data.summary);
    } catch {
      setError(
        "Unable to fetch predictions. The API server might be waking up — please try again in 10 seconds.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (c: string) => {
    const map: Record<string, string> = {
      gen: "General",
      obc: "OBC-NCL",
      sc: "SC",
      st: "ST",
      ews: "EWS",
    };
    return map[c] || c;
  };

  return (
    <div className="glass-card p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-accent-cyan" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-white">
            AI College Predictor
          </h3>
          <p className="text-xs text-gray-500">
            Powered by real cutoff data & ML prediction
          </p>
        </div>
      </div>

      {/* Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="label-text">GATE Score</label>
          <input
            type="number"
            value={score}
            onChange={(e) => {
              setScore(e.target.value);
              setError("");
            }}
            placeholder="e.g., 391"
            className="input-field"
            min={1}
            max={1000}
          />
        </div>
        <div>
          <label className="label-text">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="GEN">General</option>
            <option value="OBC">OBC-NCL</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>
        <div>
          <label className="label-text">Branch</label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="input-field"
          >
            {branchOptions.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="btn-primary w-full !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Predict
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-red-400 mb-4"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {searched && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            {results.length === 0 && !error ? (
              <div className="text-center py-10">
                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  No results found for your criteria.
                </p>
              </div>
            ) : (
              <>
                {/* Summary Bar */}
                {summary && (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="glass-card p-3 text-center">
                      <p className="font-display text-2xl font-bold text-white">
                        {summary.total}
                      </p>
                      <p className="text-[11px] text-gray-500">Total Options</p>
                    </div>
                    {(["Safe", "Moderate", "Reach"] as const).map((type) => {
                      const cfg = chanceConfig[type];
                      const Icon = cfg.icon;
                      return (
                        <div
                          key={type}
                          className={`glass-card p-3 text-center border ${cfg.border}`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                            <p
                              className={`font-display text-2xl font-bold ${cfg.color}`}
                            >
                              {
                                summary[
                                  type.toLowerCase() as keyof PredictionSummary
                                ]
                              }
                            </p>
                          </div>
                          <p className={`text-[11px] ${cfg.color} opacity-70`}>
                            {type}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Info bar */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <p className="text-sm text-gray-400">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {results.length}
                    </span>{" "}
                    colleges for{" "}
                    <span className="text-accent-cyan">
                      {getCategoryLabel(category)}
                    </span>{" "}
                    • Score:{" "}
                    <span className="text-white font-semibold">
                      {parseInt(score)}
                    </span>
                  </p>
                  <div className="hidden sm:flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />{" "}
                      Safe
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />{" "}
                      Moderate
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400" /> Reach
                    </span>
                  </div>
                </div>

                {/* Result Cards */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {results.map((r, i) => {
                    const cfg = chanceConfig[r.chance] || chanceConfig.Reach;
                    const ChanceIcon = cfg.icon;
                    const probClamped = Math.min(
                      Math.max(r.probability, 0),
                      100,
                    );

                    return (
                      <motion.div
                        key={`${r.college}-${r.program}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:bg-white/[0.03] ${cfg.border} ${cfg.glow}`}
                        style={{ background: "rgba(255,255,255,0.015)" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Left: Rank + College */}
                          <div className="flex items-center gap-3 sm:w-[45%]">
                            <div
                              className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}
                            >
                              <span
                                className={`text-xs font-bold ${cfg.color}`}
                              >
                                #{i + 1}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {r.college}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {r.program}
                              </p>
                            </div>
                          </div>

                          {/* Middle: Chance Badge + Probability */}
                          <div className="flex items-center gap-4 sm:w-[30%]">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${cfg.bg} ${cfg.border}`}
                            >
                              <ChanceIcon
                                className={`w-3.5 h-3.5 ${cfg.color}`}
                              />
                              <span
                                className={`text-xs font-bold ${cfg.color}`}
                              >
                                {r.chance}
                              </span>
                            </div>
                            <div className="flex-1 min-w-[80px]">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-gray-500">
                                  Probability
                                </span>
                                <span
                                  className={`text-xs font-bold ${cfg.color}`}
                                >
                                  {probClamped}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${probClamped}%` }}
                                  transition={{
                                    duration: 0.8,
                                    delay: i * 0.04 + 0.2,
                                    ease: "easeOut",
                                  }}
                                  className={`h-full rounded-full ${cfg.bar}`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right: Scores */}
                          <div className="flex items-center gap-4 sm:w-[25%] sm:justify-end text-right">
                            <div>
                              <p className="text-[10px] text-gray-500">
                                Actual Cutoff
                              </p>
                              <p className="text-sm font-mono font-semibold text-white">
                                {r.actual_cutoff}
                              </p>
                            </div>
                            <div className="w-px h-8 bg-white/[0.06]" />
                            <div>
                              <p className="text-[10px] text-gray-500">
                                Your Score
                              </p>
                              <p
                                className={`text-sm font-mono font-semibold ${
                                  r.difference >= 0
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                {r.your_score}
                                <span className="text-[10px] ml-1">
                                  ({r.difference >= 0 ? "+" : ""}
                                  {r.difference})
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Apply indicator */}
                        {r.apply && (
                          <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-emerald-400 font-medium">
                              Recommended to apply — You meet the cutoff
                              criteria
                            </span>
                          </div>
                        )}

                        {/* Predicted cutoff footer */}
                        <div className="mt-2 flex items-center gap-1.5">
                          <BarChart3 className="w-3 h-3 text-gray-600" />
                          <span className="text-[10px] text-gray-600">
                            ML Predicted Cutoff:{" "}
                            <span className="text-gray-400 font-mono">
                              {r.predicted_cutoff}
                            </span>
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-gray-600">
                    * Predictions use ML models on historical data. Actual
                    cutoffs may vary. Book a session for personalized analysis.
                  </p>
                  <a
                    href="/book-counseling"
                    className="btn-primary text-xs !px-5 !py-2 shrink-0"
                  >
                    Get Expert Advice <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-3"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-white/[0.04] animate-pulse"
                style={{ background: "rgba(255,255,255,0.015)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/[0.04] rounded w-2/3" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                  </div>
                  <div className="w-20 h-6 rounded-full bg-white/[0.04]" />
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-gray-600 mt-4 animate-pulse">
              Analyzing cutoff trends with AI...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
