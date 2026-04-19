'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter, TrendingUp, Info, Database, Building2, GraduationCap, Hash, ChevronDown, Loader2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import PredictorTool from '@/components/PredictorTool';
import type { CutoffData, CutoffFilters, CutoffStats } from '@/data/cutoffs';

const ITEMS_PER_PAGE = 20;

const programDescriptions: Record<string, { careers: string[]; avgPackage: string }> = {
  'Computer Science & Engineering': {
    careers: ['Software Engineer', 'Data Scientist', 'AI/ML Engineer', 'Research Scientist', 'Product Manager'],
    avgPackage: '₹18-35 LPA',
  },
  'Computer Science (AI)': {
    careers: ['AI Researcher', 'ML Engineer', 'NLP Engineer', 'Computer Vision Engineer'],
    avgPackage: '₹20-40 LPA',
  },
  'Computer Science (IoT)': {
    careers: ['IoT Architect', 'Embedded Developer', 'Edge Computing Engineer'],
    avgPackage: '₹15-28 LPA',
  },
  'Data Science and AI': {
    careers: ['Data Scientist', 'AI Engineer', 'ML Researcher', 'Analytics Engineer'],
    avgPackage: '₹20-40 LPA',
  },
  'Artificial Intelligence': {
    careers: ['AI Researcher', 'ML Engineer', 'Deep Learning Engineer', 'AI Consultant'],
    avgPackage: '₹22-45 LPA',
  },
  'Electrical Engineering': {
    careers: ['VLSI Design Engineer', 'Embedded Systems Engineer', 'Power Systems Engineer', 'Signal Processing Engineer'],
    avgPackage: '₹12-25 LPA',
  },
  'Electronics & Communication Engineering': {
    careers: ['VLSI Engineer', 'RF Engineer', 'Communication Engineer', 'Semiconductor Engineer'],
    avgPackage: '₹14-28 LPA',
  },
  'Mechanical Engineering': {
    careers: ['Design Engineer', 'Manufacturing Engineer', 'Robotics Engineer', 'Automotive Engineer'],
    avgPackage: '₹10-20 LPA',
  },
  'Civil Engineering': {
    careers: ['Structural Engineer', 'Construction Manager', 'Geotechnical Engineer', 'Urban Planner'],
    avgPackage: '₹8-18 LPA',
  },
  'Chemical Engineering': {
    careers: ['Process Engineer', 'Pharma Consultant', 'R&D Scientist', 'Environmental Engineer'],
    avgPackage: '₹9-18 LPA',
  },
};

export default function CutoffsPage() {
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [showProgramInfo, setShowProgramInfo] = useState<string | null>(null);

  const [data, setData] = useState<CutoffData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filters, setFilters] = useState<CutoffFilters>({ colleges: [], programs: [], categories: [], types: [], years: [] });
  const [stats, setStats] = useState<CutoffStats>({ total: 0, colleges: 0, programs: 0 });

  const fetchData = useCallback(async (pageNum: number, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(ITEMS_PER_PAGE),
      });
      if (selectedCollege !== 'All') params.set('college', selectedCollege);
      if (selectedProgram !== 'All') params.set('program', selectedProgram);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedType !== 'All') params.set('type', selectedType);
      if (selectedYear !== 'All') params.set('year', selectedYear);

      const res = await fetch(`/api/cutoffs?${params}`);
      const json = await res.json();

      if (json.data) {
        setData(append ? (prev) => [...prev, ...json.data] : json.data);
        setTotal(json.total || 0);
      }
      if (json.filters) setFilters(json.filters);
      if (json.stats) setStats(json.stats);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCollege, selectedProgram, selectedCategory, selectedType, selectedYear]);

  useEffect(() => {
    setPage(1);
    setData([]);
    fetchData(1, false);
  }, [fetchData]);

  const availablePrograms = filters.programs;

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  const hasMore = data.length < total;
  const remaining = total - data.length;

  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent-cyan/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium text-accent-cyan tracking-widest uppercase mb-3">Data & Analytics</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              IIT <span className="gradient-text">Cutoffs & Data</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Explore real GATE cutoff data, use our AI predictor, and find your best options.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="!py-0">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="glass-card p-5 grid grid-cols-2 lg:grid-cols-4 gap-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <Building2 className="w-5 h-5 text-accent-cyan" />
                <div className="text-left">
                  <p className="font-display text-xl font-bold text-white">{stats.colleges}</p>
                  <p className="text-[11px] text-gray-500">Colleges</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <GraduationCap className="w-5 h-5 text-accent-purple" />
                <div className="text-left">
                  <p className="font-display text-xl font-bold text-white">{stats.programs}</p>
                  <p className="text-[11px] text-gray-500">Programs</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Hash className="w-5 h-5 text-accent-blue" />
                <div className="text-left">
                  <p className="font-display text-xl font-bold text-white">{stats.total}</p>
                  <p className="text-[11px] text-gray-500">Data Points</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Database className="w-5 h-5 text-accent-pink" />
                <div className="text-left">
                  <p className="font-display text-xl font-bold text-white">{filters.years?.length || 0}</p>
                  <p className="text-[11px] text-gray-500">Years</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Predictor Tool */}
      <section className="section-padding !pt-8">
        <div className="container-max">
          <AnimatedSection>
            <PredictorTool />
          </AnimatedSection>
        </div>
      </section>

      {/* Cutoff Table */}
      <section className="section-padding !pt-0" id="table">
        <div className="container-max">
          <AnimatedSection className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5 text-accent-cyan" />
              <h2 className="font-display text-2xl font-bold text-white">Cutoff Data Explorer</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="label-text">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="All">All Years</option>
                  {filters.years?.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">College</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="All">All Colleges</option>
                  {filters.colleges?.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Program</label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="All">All Programs</option>
                  {availablePrograms?.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="All">All Categories</option>
                  {filters.categories?.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="All">All Types</option>
                  {filters.types?.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <p className="text-xs text-gray-500 pb-1">
                  Showing <span className="text-white font-semibold">{data.length}</span> of <span className="text-white font-semibold">{total}</span>
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="glass-card overflow-hidden">
              {loading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                  <p className="text-sm text-gray-500">Loading cutoff data from database...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="cutoff-table">
                      <thead>
                        <tr className="bg-white/[0.02]">
                          <th>#</th>
                          <th>Year</th>
                          <th>College</th>
                          <th>Type</th>
                          <th>Program</th>
                          <th>Category</th>
                          <th>Cutoff</th>
                          <th>Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-10 text-gray-500">
                              No data found. Add cutoff entries from the{' '}
                              <a href="/admin/cutoffs" className="text-accent-cyan hover:underline">Admin Panel</a>.
                            </td>
                          </tr>
                        ) : (
                          data.map((d, i) => (
                            <tr key={d.id || `${d.college}-${d.program}-${d.category}-${d.year}-${i}`}>
                              <td className="text-gray-500 font-mono text-xs">{i + 1}</td>
                              <td className="text-sm font-mono font-semibold text-accent-purple">{d.year}</td>
                              <td className="font-medium text-white">{d.college}</td>
                              <td>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  d.type === 'IIT' ? 'bg-accent-cyan/10 text-accent-cyan' :
                                  d.type === 'NIT' ? 'bg-accent-purple/10 text-accent-purple' :
                                  'bg-accent-blue/10 text-accent-blue'
                                }`}>
                                  {d.type}
                                </span>
                              </td>
                              <td className="text-accent-cyan text-sm max-w-[200px] truncate">{d.program}</td>
                              <td>
                                <span className="text-xs font-medium text-gray-300 bg-white/[0.04] px-2 py-0.5 rounded">{d.category}</span>
                              </td>
                              <td>
                                <span className="font-mono font-semibold text-white text-base">{d.cutoff}</span>
                              </td>
                              <td>
                                {programDescriptions[d.program] && (
                                  <button
                                    onClick={() => setShowProgramInfo(showProgramInfo === d.program ? null : d.program)}
                                    className="text-gray-500 hover:text-accent-cyan transition-colors"
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {hasMore && (
                    <div className="border-t border-white/[0.04] p-4 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                                   border border-white/[0.08] text-gray-300
                                   hover:border-accent-cyan/30 hover:text-accent-cyan hover:bg-accent-cyan/[0.04]
                                   active:scale-[0.98] transition-all duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-300 rounded-full animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Load {Math.min(ITEMS_PER_PAGE, remaining)} More
                            <span className="text-gray-600 font-normal">({remaining} remaining)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!hasMore && data.length > ITEMS_PER_PAGE && (
                    <div className="border-t border-white/[0.04] p-4 text-center">
                      <p className="text-xs text-gray-600">All {total} results loaded</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </AnimatedSection>

          {showProgramInfo && programDescriptions[showProgramInfo] && (
            <AnimatedSection className="mt-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-bold text-xl text-white mb-3">{showProgramInfo}</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-accent-cyan mb-2">Career Opportunities</h4>
                    <ul className="space-y-1.5">
                      {programDescriptions[showProgramInfo].careers.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-sm text-gray-300">
                          <TrendingUp className="w-3 h-3 text-accent-cyan" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-accent-cyan mb-2">Average Package (Top Institutes)</h4>
                    <p className="text-2xl font-display font-bold gradient-text">{programDescriptions[showProgramInfo].avgPackage}</p>
                    <p className="text-xs text-gray-500 mt-1">*Varies by institute and profile</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}