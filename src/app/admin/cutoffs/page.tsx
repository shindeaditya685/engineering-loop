'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, X, ChevronLeft, ChevronRight, Loader2, Database,Upload } from 'lucide-react';

interface CutoffEntry {
  id: string;
  college: string;
  type: string;
  program: string;
  category: string;
  cutoff: number;
  year: number;
}

const COLLEGE_LIST: Record<string, string> = {
  'IIT Bombay': 'IIT',
  'IIT Delhi': 'IIT',
  'IIT Madras': 'IIT',
  'IIT Kanpur': 'IIT',
  'IIT Kharagpur': 'IIT',
  'IIT Roorkee': 'IIT',
  'IIT Guwahati': 'IIT',
  'IIT Hyderabad': 'IIT',
  'IIT (BHU) Varanasi': 'IIT',
  'IIT Indore': 'IIT',
  'IIT Gandhinagar': 'IIT',
  'IIT Bhubaneswar': 'IIT',
  'IIT Jodhpur': 'IIT',
  'IIT Patna': 'IIT',
  'IIT Ropar': 'IIT',
  'IIT Mandi': 'IIT',
  'IIT Dhanbad': 'IIT',
  'IIT Palakkad': 'IIT',
  'IIT Tirupati': 'IIT',
  'IIT Dharwad': 'IIT',
  'IIT Bhilai': 'IIT',
  'IIT Jammu': 'IIT',
  'IIT Goa': 'IIT',
  'NIT Trichy': 'NIT',
  'NIT Surathkal': 'NIT',
  'NIT Warangal': 'NIT',
  'NIT Rourkela': 'NIT',
  'NIT Calicut': 'NIT',
  'NIT Hamirpur': 'NIT',
  'NIT Durgapur': 'NIT',
  'NIT Jamshedpur': 'NIT',
  'NIT Kurukshetra': 'NIT',
  'NIT Silchar': 'NIT',
  'NIT Agartala': 'NIT',
  'NIT Raipur': 'NIT',
  'NIT Manipur': 'NIT',
  'NIT Meghalaya': 'NIT',
  'NIT Mizoram': 'NIT',
  'NIT Nagaland': 'NIT',
  'NIT Arunachal Pradesh': 'NIT',
  'NIT Sikkim': 'NIT',
    'IIIT Hyderabad': 'IIIT',
  'IIIT Delhi': 'IIIT',
  'IIIT Bangalore': 'IIIT',
  'IIIT Allahabad': 'IIIT',
  'IIIT Gwalior': 'IIIT',
  'IIIT Jabalpur': 'IIIT',
  'IIIT Kancheepuram': 'IIIT',
  'IIIT Kota': 'IIIT',
  'IIIT Pune': 'IIIT',
  'IIIT Sri City': 'IIIT',
  'IIIT Dharwad': 'IIIT',
  'IIIT Kottayam': 'IIIT',
  'IIIT Manipur': 'IIIT',
  'IIIT Nagpur': 'IIIT',
  'IIIT Ranchi': 'IIIT',
  'IIIT Surat': 'IIIT',
  'IIIT Bhagalpur': 'IIIT',
  'IIIT Bhopal': 'IIIT',
  'IIIT Agartala': 'IIIT',
};

const emptyForm = { college: '', type: 'IIT', program: '', category: 'General', cutoff: '', year: '2025' };

export default function AdminCutoffsPage() {
  const [data, setData] = useState<CutoffEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [filterCollege, setFilterCollege] = useState('All');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  const [colleges, setColleges] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filterCollege !== 'All') params.set('college', filterCollege);
      if (filterProgram !== 'All') params.set('program', filterProgram);
      if (filterCategory !== 'All') params.set('category', filterCategory);
      if (filterType !== 'All') params.set('type', filterType);
      if (filterYear !== 'All') params.set('year', filterYear);

      const res = await fetch(`/api/admin/cutoffs?${params}`);
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);

      const allRes = await fetch('/api/admin/cutoffs?limit=10000');
      const allJson = await allRes.json();
      const all = allJson.data || [];
      setColleges([...new Set(all.map((d: CutoffEntry) => d.college))].sort());
      setPrograms([...new Set(all.map((d: CutoffEntry) => d.program))].sort());
      setCategories([...new Set(all.map((d: CutoffEntry) => d.category))].sort());
      setYears([...new Set(all.map((d: CutoffEntry) => String(d.year)))].sort((a, b) => Number(b) - Number(a)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, filterCollege, filterProgram, filterCategory, filterType, filterYear]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); setSelected(new Set()); }, [filterCollege, filterProgram, filterCategory, filterType, filterYear]);

  const totalPages = Math.ceil(total / 20);

  const handleSave = async () => {
    if (!form.college || !form.program || !form.category || !form.cutoff || !form.year) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch('/api/admin/cutoffs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) });
      } else {
        await fetch('/api/admin/cutoffs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      setShowModal(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: CutoffEntry) => {
    setEditingId(item.id);
    setForm({ college: item.college, type: item.type, program: item.program, category: item.category, cutoff: String(item.cutoff), year: String(item.year) });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await fetch(`/api/admin/cutoffs?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} entries?`)) return;
    await fetch(`/api/admin/cutoffs?ids=${JSON.stringify([...selected])}`, { method: 'DELETE' });
    setSelected(new Set());
    fetchData();
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === data.length) setSelected(new Set());
    else setSelected(new Set(data.map(d => d.id)));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportJson(text);
      setImportResult('');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importJson);
      if (!Array.isArray(parsed)) {
        setImportResult('Error: JSON must be an array [...]');
        return;
      }
      setImporting(true);
      setImportResult('');
      const res = await fetch('/api/admin/cutoffs/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(`Successfully imported ${data.imported} entries!`);
        setImportJson('');
        setTimeout(() => {
          setShowImportModal(false);
          setImportResult('');
          fetchData();
        }, 1500);
      } else {
        setImportResult(`Error: ${data.error}`);
      }
    } catch {
      setImportResult('Error: Invalid JSON format');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-accent-cyan" /> Cutoff Data
          </h1>
          <p className="text-sm text-gray-500 mt-1">{total} total entries</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete ({selected.size})
            </button>
          )}
          <button onClick={() => { setShowImportModal(true); setImportJson(''); setImportResult(''); }} className="btn-secondary text-sm !px-5 !py-2.5">
            <Upload className="w-4 h-4" /> Import JSON
          </button>
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowModal(true); }} className="btn-primary text-sm !px-5 !py-2.5">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field pl-10 text-sm" />
          </div>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="input-field text-sm">
            <option value="All">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)} className="input-field text-sm">
            <option value="All">All Colleges</option>
            {colleges.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)} className="input-field text-sm">
            <option value="All">All Programs</option>
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field text-sm">
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field text-sm">
            <option value="All">All Types</option>
            <option value="IIT">IIT</option>
            <option value="NIT">NIT</option>
            <option value="IIIT">IIIT</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                <th className="px-3 py-3 w-10">
                  <input type="checkbox" checked={data.length > 0 && selected.size === data.length} onChange={toggleAll} className="rounded border-gray-600" />
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Year</th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">College</th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Program</th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Category</th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase">Cutoff</th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-400 uppercase w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12"><Loader2 className="w-6 h-6 text-accent-cyan animate-spin mx-auto" /></td></tr>
              ) : data.filter(d =>
                !search || d.college.toLowerCase().includes(search.toLowerCase()) || d.program.toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-600">No data found</td></tr>
              ) : (
                data.filter(d =>
                  !search || d.college.toLowerCase().includes(search.toLowerCase()) || d.program.toLowerCase().includes(search.toLowerCase())
                ).map((d) => (
                  <tr key={d.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selected.has(d.id)} onChange={() => toggleSelect(d.id)} className="rounded border-gray-600" />
                    </td>
                    <td className="px-3 py-3 text-sm font-mono font-semibold text-accent-purple">{d.year}</td>
                    <td className="px-3 py-3 text-sm text-white font-medium">{d.college}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${d.type === 'IIT' ? 'bg-accent-cyan/10 text-accent-cyan' : d.type === 'NIT' ? 'bg-accent-purple/10 text-accent-purple' : 'bg-accent-blue/10 text-accent-blue'}`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-300 max-w-[200px] truncate">{d.program}</td>
                    <td className="px-3 py-3 text-sm text-gray-300">{d.category}</td>
                    <td className="px-3 py-3 text-sm font-mono font-semibold text-white">{d.cutoff}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(d)} className="p-1.5 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
            <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === pageNum ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-lg border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-white">{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04]"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Year *</label>
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025" className="input-field text-sm" />
              </div>
              <div>
                <label className="label-text">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                  <option value="General">General</option>
                  <option value="OBC-NCL">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="PWD">PWD</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="label-text">College *</label>
                <select
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value, type: COLLEGE_LIST[e.target.value] || 'IIT' })}
                  className="input-field text-sm"
                >
                  <option value="">Select College</option>
                  <optgroup label="--- IITs ---">
                    {Object.entries(COLLEGE_LIST).filter(([, t]) => t === 'IIT').map(([name]) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="--- NITs ---">
                    {Object.entries(COLLEGE_LIST).filter(([, t]) => t === 'NIT').map(([name]) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="--- IIITs ---">
                    {Object.entries(COLLEGE_LIST).filter(([, t]) => t === 'IIIT').map(([name]) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="label-text">Type</label>
                <input type="text" value={form.type} readOnly className="input-field text-sm bg-white/[0.02] cursor-not-allowed text-gray-400" />
              </div>
              <div className="col-span-2">
                <label className="label-text">Program *</label>
                <input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="e.g., Computer Science & Engineering" className="input-field text-sm" />
              </div>
              <div className="col-span-2">
                <label className="label-text">Cutoff Score *</label>
                <input type="number" value={form.cutoff} onChange={(e) => setForm({ ...form, cutoff: e.target.value })} placeholder="e.g., 350" className="input-field text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary text-sm !px-5 !py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm !px-5 !py-2.5">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? 'Update' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowImportModal(false)}>
          <div className="glass-card p-6 w-full max-w-2xl border border-white/[0.08] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">Bulk Import JSON</h2>
                  <p className="text-xs text-gray-500">Each item must include &quot;year&quot; field</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04]"><X className="w-5 h-5" /></button>
            </div>

            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/[0.08] hover:border-accent-cyan/30 hover:bg-accent-cyan/[0.02] transition-all cursor-pointer mb-3">
              <Upload className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-white font-medium">Select JSON file</p>
                <p className="text-xs text-gray-500">Supports .json files</p>
              </div>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='[&#10;  {&#10;    "college": "IIT Bombay",&#10;    "type": "IIT",&#10;    "program": "Computer Science",&#10;    "category": "GEN",&#10;    "cutoff": 880,&#10;    "year": 2025&#10;  }&#10;]'
              className="flex-1 min-h-[250px] bg-dark-700 border border-white/[0.06] rounded-xl p-4 text-sm text-gray-300 font-mono placeholder:text-gray-600 focus:outline-none focus:border-accent-cyan/30 focus:ring-1 focus:ring-accent-cyan/20 resize-none"
            />

            {importResult && (
              <div className={`mt-3 px-4 py-2 rounded-lg text-sm ${importResult.includes('Error') ? 'bg-red-400/10 text-red-400 border border-red-400/20' : 'bg-green-400/10 text-green-400 border border-green-400/20'}`}>
                {importResult}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
              <p className="text-xs text-gray-500">
                {importJson ? (() => { try { return `${JSON.parse(importJson).length} entries detected`; } catch { return 'Invalid JSON'; } })() : 'No data'}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowImportModal(false)} className="btn-secondary text-sm !px-5 !py-2.5">Cancel</button>
                <button
                  onClick={handleImport}
                  disabled={importing || !importJson}
                  className="btn-primary text-sm !px-5 !py-2.5 disabled:opacity-50"
                >
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4" /> Import All</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}