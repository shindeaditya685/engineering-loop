"use client";

import { useMemo, useState } from "react";
import {
  Award,
  Eye,
  Loader2,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type Achievement = {
  id: string;
  studentName: string;
  institute: string;
  branch: string;
  headline: string;
  rank: string;
  category: string;
  story: string;
  year: string;
  featured?: boolean;
  isVisible?: boolean;
};

const emptyForm = {
  studentName: "",
  institute: "",
  branch: "",
  headline: "",
  rank: "",
  category: "",
  story: "",
  year: "",
  featured: false,
  isVisible: true,
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const stats = useMemo(
    () => ({
      total: achievements.length,
      featured: achievements.filter((item) => item.featured).length,
      visible: achievements.filter((item) => item.isVisible !== false).length,
    }),
    [achievements],
  );

  async function fetchAchievements() {
    try {
      const response = await fetch("/api/admin/achievements", { cache: "no-store" });
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Admin achievements fetch error:", error);
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  }

  useAutoRefresh(fetchAchievements);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/achievements", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to save achievement");
      }

      resetForm();
      await fetchAchievements();
    } catch (error) {
      console.error("Admin achievements save error:", error);
      alert(error instanceof Error ? error.message : "Failed to save achievement");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingId(achievement.id);
    setForm({
      studentName: achievement.studentName || "",
      institute: achievement.institute || "",
      branch: achievement.branch || "",
      headline: achievement.headline || "",
      rank: achievement.rank || "",
      category: achievement.category || "",
      story: achievement.story || "",
      year: achievement.year || "",
      featured: Boolean(achievement.featured),
      isVisible: achievement.isVisible !== false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) {
      return;
    }

    try {
      await fetch(`/api/admin/achievements?id=${id}`, { method: "DELETE" });
      if (editingId === id) {
        resetForm();
      }
      await fetchAchievements();
    } catch (error) {
      console.error("Admin achievements delete error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
          <Award className="h-6 w-6 text-accent-cyan" />
          Student Achievements
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Showcase student outcomes and control which stories appear publicly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">
            {stats.total}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Visible</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent-cyan">
            {stats.visible}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500">Featured</p>
          <p className="mt-2 font-display text-3xl font-bold text-accent-purple">
            {stats.featured}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="glass-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingId ? "Update achievement" : "Add achievement"}
              </h2>
              <p className="text-sm text-gray-500">
                Publish ranks, institutes, and outcome stories.
              </p>
            </div>
            {editingId && (
              <button onClick={resetForm} className="btn-secondary !px-4 !py-2 text-sm">
                New entry
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="label-text">Student name</label>
                <input
                  value={form.studentName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, studentName: event.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-text">Institute</label>
                <input
                  value={form.institute}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, institute: event.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-text">Headline</label>
              <input
                value={form.headline}
                onChange={(event) =>
                  setForm((current) => ({ ...current, headline: event.target.value }))
                }
                className="input-field"
                placeholder="Cracked IIT Bombay CSE with a focused CCMT strategy"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-text">Branch</label>
                <input
                  value={form.branch}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, branch: event.target.value }))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Rank / result</label>
                <input
                  value={form.rank}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, rank: event.target.value }))
                  }
                  className="input-field"
                  placeholder="AIR 243"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-text">Category</label>
                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="input-field"
                  placeholder="General / OBC / EWS"
                />
              </div>
              <div>
                <label className="label-text">Year</label>
                <input
                  value={form.year}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, year: event.target.value }))
                  }
                  className="input-field"
                  placeholder="2026"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Story</label>
              <textarea
                value={form.story}
                onChange={(event) =>
                  setForm((current) => ({ ...current, story: event.target.value }))
                }
                className="input-field min-h-[140px] resize-none"
                placeholder="Summarize how Engineering Loop helped and what the outcome was."
              />
            </div>

            <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, featured: event.target.checked }))
                  }
                />
                Mark this as a featured story
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isVisible: event.target.checked }))
                  }
                />
                Show this on the public website
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <PencilLine className="h-4 w-4" />
                  Update achievement
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add achievement
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="glass-card flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
            </div>
          ) : achievements.length === 0 ? (
            <div className="glass-card p-12 text-center text-sm text-gray-500">
              No achievements added yet.
            </div>
          ) : (
            achievements.map((achievement) => (
              <div key={achievement.id} className="glass-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {achievement.studentName}
                      </p>
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-gray-400">
                        {achievement.institute}
                      </span>
                      {achievement.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-accent-cyan">
                          <Sparkles className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          achievement.isVisible !== false
                            ? "bg-green-400/10 text-green-400"
                            : "bg-amber-400/10 text-amber-400"
                        }`}
                      >
                        {achievement.isVisible !== false ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white">
                      {achievement.headline}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      {achievement.branch || "Branch not added"}
                      {achievement.rank ? ` | ${achievement.rank}` : ""}
                      {achievement.year ? ` | ${achievement.year}` : ""}
                    </p>
                    {achievement.story && (
                      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300">
                        {achievement.story}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:w-[220px] lg:flex-col">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await fetch("/api/admin/achievements", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ...achievement,
                            featured: !achievement.featured,
                          }),
                        });
                        await fetchAchievements();
                      }}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      {achievement.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={async () => {
                        await fetch("/api/admin/achievements", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ...achievement,
                            isVisible: achievement.isVisible === false,
                          }),
                        });
                        await fetchAchievements();
                      }}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      {achievement.isVisible !== false ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => void handleDelete(achievement.id)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
