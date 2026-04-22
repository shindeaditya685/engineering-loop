"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  MessageSquareText,
  PencilLine,
  RefreshCcw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import useAutoRefresh from "@/hooks/useAutoRefresh";

type ReviewStatus = "pending" | "valid" | "invalid";

interface VerificationDocument {
  id: string;
  name: string;
  email: string;
  phone: string;
  gateYear: string;
  documentType: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData: string;
  status: ReviewStatus;
  adminComment: string;
  createdAt: string;
  reviewedAt?: string;
}

const statusConfig = {
  pending: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    icon: Clock,
    label: "Pending",
  },
  valid: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    icon: CheckCircle2,
    label: "Verified",
  },
  invalid: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    icon: XCircle,
    label: "Needs Fix",
  },
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"All" | ReviewStatus>("All");
  const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState<ReviewStatus | "delete" | null>(null);
  const [notice, setNotice] = useState<string>("");

  useAutoRefresh(fetchDocs);

  const filteredDocuments = useMemo(() => {
    if (filterStatus === "All") {
      return documents;
    }

    return documents.filter((doc) => doc.status === filterStatus);
  }, [documents, filterStatus]);

  const counts = useMemo(
    () => ({
      All: documents.length,
      pending: documents.filter((d) => d.status === "pending").length,
      valid: documents.filter((d) => d.status === "valid").length,
      invalid: documents.filter((d) => d.status === "invalid").length,
    }),
    [documents],
  );

  async function fetchDocs() {
    try {
      const res = await fetch("/api/documents", { cache: "no-store" });
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  function startReview(doc: VerificationDocument) {
    setReviewing(doc.id);
    setComment(doc.adminComment || "");
    setNotice("");
  }

  function cancelReview() {
    setReviewing(null);
    setComment("");
    setNotice("");
  }

  async function handleStatusUpdate(id: string, status: ReviewStatus) {
    setActionLoading(status);
    setNotice("");

    try {
      const response = await fetch("/api/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          adminComment: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review status");
      }

      setNotice(
        status === "valid"
          ? "Document marked as valid. The student can now see your note."
          : status === "invalid"
            ? "Document marked as invalid. The student can now see your correction note."
            : "Document moved back to pending.",
      );
      setReviewing(null);
      setComment("");
      await fetchDocs();
    } catch (error) {
      console.error("Status update error:", error);
      setNotice("Unable to save this review right now. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document submission?")) {
      return;
    }

    setActionLoading("delete");

    try {
      const response = await fetch(`/api/documents?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      if (previewDoc?.id === id) {
        setPreviewDoc(null);
      }

      await fetchDocs();
    } catch (error) {
      console.error("Delete error:", error);
      setNotice("Unable to delete this submission right now.");
    } finally {
      setActionLoading(null);
    }
  }

  function formatDate(ts?: string) {
    if (!ts) return "N/A";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatSize(bytes?: number) {
    if (!bytes || Number.isNaN(bytes)) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent-cyan" />
            Document Verifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review each submission, mark it valid or invalid, and leave a note for the student.
          </p>
        </div>
        <button
          onClick={() => void fetchDocs()}
          className="btn-secondary text-sm self-start sm:self-auto"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {notice && (
        <div className="rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.06] px-4 py-3 text-sm text-accent-cyan">
          {notice}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as "All" | ReviewStatus)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                : "text-gray-400 border border-white/[0.04] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {status !== "All" && (
              <span
                className={`w-2 h-2 rounded-full mr-2 inline-block ${
                  status === "pending"
                    ? "bg-amber-400"
                    : status === "valid"
                      ? "bg-green-400"
                      : "bg-red-400"
                }`}
              />
            )}
            {status} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-6 h-6 text-accent-cyan animate-spin mx-auto" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-600">
          No documents found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => {
            const sc = statusConfig[doc.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            const isReviewing = reviewing === doc.id;

            return (
              <div key={doc.id} className="glass-card p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="w-11 h-11 rounded-xl bg-accent-cyan/10 flex items-center justify-center shrink-0 text-accent-cyan hover:bg-accent-cyan/20 transition-colors"
                        aria-label={`Preview ${doc.fileName}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">
                            {doc.documentType}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {doc.name} • {doc.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => startReview(doc)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-2 text-xs font-semibold text-accent-cyan hover:bg-accent-cyan/15 transition-colors"
                      >
                        {doc.status === "pending" ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <PencilLine className="w-3.5 h-3.5" />
                        )}
                        {doc.status === "pending" ? "Review" : "Update Review"}
                      </button>
                      <button
                        onClick={() => void handleDelete(doc.id)}
                        disabled={actionLoading === "delete"}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
                        aria-label={`Delete ${doc.fileName}`}
                      >
                        {actionLoading === "delete" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-[56px] text-xs text-gray-500">
                    <span>{doc.fileName}</span>
                    <span>{formatSize(doc.fileSize)}</span>
                    <span>GATE {doc.gateYear || "N/A"}</span>
                    <span>{doc.phone || "No phone"}</span>
                    <span>Submitted {formatDate(doc.createdAt)}</span>
                    {doc.reviewedAt && <span>Reviewed {formatDate(doc.reviewedAt)}</span>}
                  </div>

                  {isReviewing ? (
                    <div className="pl-[56px]">
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-white flex items-center gap-2">
                            <MessageSquareText className="w-4 h-4 text-accent-cyan" />
                            Message shown to the student
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Explain clearly whether the document is accepted or what needs to be fixed.
                          </p>
                        </div>

                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Example: Your scorecard is valid and matches the required format."
                          className="input-field text-sm !min-h-[110px] resize-none"
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => void handleStatusUpdate(doc.id, "valid")}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-2 rounded-lg border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs font-semibold text-green-400 hover:bg-green-400/20 disabled:opacity-50"
                          >
                            {actionLoading === "valid" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            Mark Valid
                          </button>

                          <button
                            onClick={() => void handleStatusUpdate(doc.id, "invalid")}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/20 disabled:opacity-50"
                          >
                            {actionLoading === "invalid" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            Mark Invalid
                          </button>

                          <button
                            onClick={() => void handleStatusUpdate(doc.id, "pending")}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-400/20 disabled:opacity-50"
                          >
                            {actionLoading === "pending" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            Keep Pending
                          </button>

                          <button
                            onClick={cancelReview}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/[0.04]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : doc.adminComment ? (
                    <div className="pl-[56px] rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="text-xs text-gray-400">
                        <span className="text-accent-cyan font-medium">
                          Student note:
                        </span>{" "}
                        {doc.adminComment}
                      </p>
                    </div>
                  ) : (
                    <div className="pl-[56px] text-xs text-gray-600">
                      No message has been sent to the student yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="glass-card p-4 w-full max-w-4xl border border-white/[0.08]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {previewDoc.documentType} - {previewDoc.fileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {previewDoc.name} • {previewDoc.email}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              {previewDoc.fileType === "application/pdf" ? (
                <iframe
                  src={previewDoc.fileData}
                  className="w-full h-[75vh]"
                  title={previewDoc.fileName}
                />
              ) : (
                <Image
                  src={previewDoc.fileData}
                  alt="Document"
                  className="w-full h-auto"
                  width={1200}
                  height={1600}
                />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-xs text-gray-500">
              <span>
                {formatSize(previewDoc.fileSize)} • Submitted {formatDate(previewDoc.createdAt)}
              </span>
              <a
                href={previewDoc.fileData}
                download={previewDoc.fileName}
                className="inline-flex items-center gap-1 text-accent-cyan hover:underline"
              >
                <Download className="w-3 h-3" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
