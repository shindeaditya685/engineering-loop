/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, Clock, Eye, Loader2, Search, ShieldCheck, AlertTriangle, ArrowRight, Trash2, Download, X } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';

const DOCUMENT_TYPES = [
  { value: 'GATE Score Card', description: 'Official GATE 2025 score card from GOAPS', icon: '📊' },
  { value: 'GATE Admit Card', description: 'GATE 2025 admit card with photo', icon: '🪪' },
  { value: 'Degree Certificate', description: 'B.Tech/B.E final or provisional degree', icon: '🎓' },
  { value: 'All Semester Mark Sheets', description: 'Semester 1-8 mark sheets', icon: '📝' },
  { value: 'Transfer Certificate', description: 'TC from your undergraduate institute', icon: '📜' },
  { value: 'Migration Certificate', description: 'Migration certificate if applicable', icon: '📋' },
  { value: 'Category Certificate', description: 'SC/ST/OBC/EWS/PWD category certificate', icon: '🏷️' },
  { value: 'Income Certificate', description: 'For EWS category or scholarship', icon: '💰' },
  { value: 'Aadhaar Card', description: 'Aadhaar card for identity verification', icon: '🪪' },
  { value: 'Medical Certificate', description: 'Medical fitness certificate', icon: '🏥' },
  { value: 'Passport Photo', description: 'Stamp-size photographs (8 copies needed)', icon: '📷' },
  { value: 'Demand Draft', description: 'DD for admission fee payment', icon: '🏦' },
];

export default function DocumentVerificationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'check'>('upload');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gateYear, setGateYear] = useState('2025');
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Check status tab
  const [checkEmail, setCheckEmail] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [statusError, setStatusError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    setName((current) => current || user.name || '');
    setEmail((current) => current || user.email || '');
    setPhone((current) => current || user.phone || '');
    setCheckEmail((current) => current || user.email || '');
  }, [user]);

  const handleFileSelect = useCallback((f: File) => {
    if (f.size > 500000) {
      setUploadResult({ success: false, message: 'File too large! Maximum 500KB allowed.' });
      return;
    }
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      setUploadResult({ success: false, message: 'Only PNG, JPEG, WEBP images and PDF files allowed.' });
      return;
    }
    setFile(f);
    setUploadResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }, [handleFileSelect]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !email || !docType) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('gateYear', gateYear);
      formData.append('documentType', docType);
      formData.append('file', file);

      const res = await fetch('/api/documents', { method: 'POST', body: formData });
      const data = await res.json();
      setUploadResult(data);
      if (data.success) {
        setFile(null);
        setFilePreview(null);
        setDocType('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch {
      setUploadResult({ success: false, message: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!checkEmail) return;
    setLoadingSubmissions(true);
    try {
      const res = await fetch(`/api/documents/mine?email=${encodeURIComponent(checkEmail)}`);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setSubmissions([]);
        setStatusError(typeof data?.error === 'string' ? data.error : 'Unable to read document status right now.');
        return;
      }

      setSubmissions(Array.isArray(data) ? data : []);
      setStatusError('');
    } catch {
      setSubmissions([]);
      setStatusError('Unable to read document status right now.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig = {
    pending: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Clock, label: 'Pending Review' },
    valid: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle2, label: 'Verified ✓' },
    invalid: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle, label: 'Issues Found' },
  };

  return (
    <div>
      {/* Hero */}
      <section className="section-padding relative">
        <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-accent-purple/[0.04] rounded-full blur-[120px]" />
        <div className="container-max relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/[0.06] border border-accent-cyan/20 mb-6">
              <ShieldCheck className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm text-accent-cyan font-medium">Document Verification Service</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Get Your Documents <span className="gradient-text">Verified</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Upload your documents and get them verified by our experts before counseling day.
              Avoid last-minute rejection — get confirmed beforehand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setActiveTab('upload')} className={activeTab === 'upload' ? 'btn-primary text-base' : 'btn-secondary text-base'}>
                <Upload className="w-5 h-5" /> Upload Document
              </button>
              <button onClick={() => setActiveTab('check')} className={activeTab === 'check' ? 'btn-purple text-base' : 'btn-secondary text-base'}>
                <Search className="w-5 h-5" /> Check Status
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <section className="section-padding !pt-0">
          <div className="container-max">
            {/* Document Types */}
            <AnimatedSection className="mb-10">
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent-cyan" /> Required Documents
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DOCUMENT_TYPES.map((doc) => (
                  <button
                    key={doc.value}
                    onClick={() => setDocType(doc.value)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      docType === doc.value
                        ? 'border-accent-cyan/30 bg-accent-cyan/[0.06] shadow-[0_0_20px_rgba(0,212,255,0.05)]'
                        : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08]'
                    }`}
                  >
                    <span className="text-lg mb-1">{doc.icon}</span>
                    <p className="text-sm font-semibold text-white">{doc.value}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{doc.description}</p>
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Upload Form */}
            <AnimatedSection>
              <div className="glass-card p-6 lg:p-8 max-w-2xl mx-auto">
                <h3 className="font-display text-xl font-bold text-white mb-6">Upload Your Document</h3>

                {uploadResult && (
                  <div className={`mb-6 p-4 rounded-xl border ${uploadResult.success ? 'bg-green-400/10 border-green-400/20' : 'bg-red-400/10 border-red-400/20'}`}>
                    <div className="flex items-start gap-3">
                      {uploadResult.success
                        ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                      <div>
                        <p className={`text-sm font-semibold ${uploadResult.success ? 'text-green-400' : 'text-red-400'}`}>
                          {uploadResult.success ? 'Submitted Successfully!' : 'Submission Failed'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{uploadResult.message}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Full Name *</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input-field text-sm" required />
                    </div>
                    <div>
                      <label className="label-text">Email *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input-field text-sm" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">Phone</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="label-text">GATE Year</label>
                      <select value={gateYear} onChange={(e) => setGateYear(e.target.value)} className="input-field text-sm">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <label className="label-text">Document Type *</label>
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="input-field text-sm mb-3" required>
                      <option value="">Select document type above ↓</option>
                      {DOCUMENT_TYPES.map(d => <option key={d.value} value={d.value}>{d.icon} {d.value}</option>)}
                    </select>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                        dragOver
                          ? 'border-accent-cyan bg-accent-cyan/[0.04]'
                          : file
                            ? 'border-green-400/30 bg-green-400/[0.03]'
                            : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) handleFileSelect(selectedFile);
                        }}
                        className="hidden"
                      />
                      {filePreview ? (
                        <div className="space-y-4">
                          {file?.type === 'application/pdf' ? (
                            <div className="bg-white rounded-lg p-2 inline-block shadow-lg max-h-[200px]">
                              <iframe src={filePreview} className="w-48 h-48 rounded" title={file?.name || 'Document preview'} />
                            </div>
                          ) : (
                            <Image src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-lg" width={320} height={320} />
                          )}
                          <div className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2 max-w-xs mx-auto">
                            <p className="text-xs text-gray-600 truncate">{file?.name || 'Selected file'}</p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setFilePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-gray-500 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-12 h-12 text-gray-600 mx-auto" />
                          <div>
                            <p className="text-sm text-white font-medium">
                              {dragOver ? 'Drop your file here' : 'Click or drag file here'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPEG, WEBP or PDF • Max 500KB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" disabled={uploading || !file || !name || !email || !docType} className="btn-primary w-full text-base disabled:opacity-50">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /> Submit for Verification</>}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Check Status Tab */}
      {activeTab === 'check' && (
        <section className="section-padding !pt-0">
          <div className="container-max max-w-3xl">
            <AnimatedSection>
              <div className="glass-card p-6 lg:p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-2">Check Submission Status</h2>
                <p className="text-sm text-gray-400 mb-6">Enter the email you used during upload to see verification status.</p>

                <div className="flex gap-3">
                  <input
                    type="email"
                    value={checkEmail}
                    onChange={(e) => setCheckEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field text-sm flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckStatus()}
                  />
                  <button onClick={handleCheckStatus} disabled={loadingSubmissions || !checkEmail} className="btn-primary text-sm !px-6 !py-3 disabled:opacity-50">
                    {loadingSubmissions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>

                {statusError && (
                  <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                    <p className="text-sm text-red-300">{statusError}</p>
                  </div>
                )}

                {submissions.length === 0 && !loadingSubmissions && checkEmail && !statusError && (
                  <div className="text-center py-10 text-gray-600">
                    <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No submissions found for this email.</p>
                  </div>
                )}

                {submissions.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-gray-500">{submissions.length} document(s) found</p>
                    {submissions.map((sub, i) => {
                      const sc = statusConfig[sub.status as keyof typeof statusConfig] || statusConfig.pending;
                      const StatusIcon = sc.icon;
                      return (
                        <div key={sub.id} className="p-4 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="text-sm font-semibold text-white">{sub.documentType}</p>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {sc.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{sub.fileName} • {formatSize(sub.fileSize)} • {formatDate(sub.createdAt)}</p>
                            </div>
                            <button
                              onClick={() => setPreviewDoc(previewDoc?.id === sub.id ? null : sub)}
                              className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/[0.06] transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          {sub.adminComment && (
                            <div className="mt-2 pl-1 border-l-2 border-accent-cyan/20">
                              <p className="text-xs text-gray-400"><span className="text-accent-cyan font-medium">Expert Note:</span> {sub.adminComment}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewDoc(null)}>
          <div className="glass-card p-4 w-full max-w-lg border border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white truncate">{previewDoc.fileName}</p>
              <button onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white rounded-lg overflow-hidden">
              {previewDoc.fileType === 'application/pdf' ? (
                <iframe src={previewDoc.fileData} className="w-full h-[70vh]" title={previewDoc.fileName} />
              ) : (
                <Image src={previewDoc.fileData} alt="Document" className="w-full" width={600} height={800} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/[0.03] to-transparent" />
        <div className="container-max relative text-center">
          <AnimatedSection>
            <p className="text-sm text-gray-500 mb-4">Not sure which documents you need?</p>
            <h2 className="font-display text-3xl font-bold mb-4">Get Expert <span className="gradient-text">Guidance</span></h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">Book a counseling session and our experts will walk you through every document you need for a smooth admission.</p>
            <Link href="/book-counseling" className="btn-primary text-base">
              Book Counseling <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
