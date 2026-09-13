import React, { useState } from "react";
import {
  Sparkles,
  Printer,
  Download,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Code,
  Layers,
  Plus,
  Trash2,
  BookOpen,
  School,
  CheckCircle2,
  Smile,
  Users,
  Palette,
  Layout,
  HelpCircle,
  FileDown,
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { AIService } from "../services/ai";
import { ExportService } from "../services/pdf";
import { LKPDData } from "../types/lkpd";
import { DEFAULT_LKPD_DATA, parseMarkdownToLKPD, generateLKPDWordDoc } from "../utils/lkpdParser";
import { LKPDDocumentRenderer } from "../components/lkpd/LKPDDocumentRenderer";

export const LKPDAIPage = () => {
  const [topic, setTopic] = useState("Bagian Tubuh Tumbuhan dan Fungsinya");
  const [subject, setSubject] = useState("Ilmu Pengetahuan Alam dan Sosial (IPAS)");
  const [gradeLevel, setGradeLevel] = useState("Fase B • Kelas IV (Empat)");
  const [theme, setTheme] = useState<"ceria" | "monokrom" | "formal">("ceria");
  const [layoutMode, setLayoutMode] = useState<"kelompok" | "individu">("kelompok");
  const [schoolName, setSchoolName] = useState("SD NEGERI 3 BANJAR RATU");
  const [showKop, setShowKop] = useState(true);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "editor" | "markdown">("preview");
  const [isEditingInline, setIsEditingInline] = useState(false);

  // Interactive student state simulation
  const [checkedTools, setCheckedTools] = useState<Record<number, boolean>>({});
  const [selectedEmoticon, setSelectedEmoticon] = useState<number | null>(1);

  // Core LKPD structured data
  const [lkpdData, setLkpdData] = useState<LKPDData>(DEFAULT_LKPD_DATA);

  // Preset topic pills
  const presets = [
    {
      label: "🌱 Bagian Tumbuhan & Xilem",
      topic: "Bagian Tubuh Tumbuhan dan Fungsinya",
      subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
      grade: "Fase B • Kelas IV (Empat)",
    },
    {
      label: "💧 Miniatur Daur Air & Hujan",
      topic: "Miniatur Siklus Air dan Pembentukan Hujan",
      subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
      grade: "Fase B • Kelas IV (Empat)",
    },
    {
      label: "🧊 Wujud Zat & Sifatnya",
      topic: "Wujud Zat dan Perubahan Bentuk Benda",
      subject: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
      grade: "Fase B • Kelas IV (Empat)",
    },
    {
      label: "📐 Pecahan Origami Konkret",
      topic: "Pecahan Senilai dengan Alat Peraga Kertas Lipat",
      subject: "Matematika",
      grade: "Fase B • Kelas IV (Empat)",
    },
    {
      label: "🇮🇩 Gotong Royong Sekolah",
      topic: "Penerapan Gotong Royong di Lingkungan Sekolah",
      subject: "Pendidikan Pancasila",
      grade: "Fase B • Kelas IV (Empat)",
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTopic(p.topic);
    setSubject(p.subject);
    setGradeLevel(p.grade);
  };

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      // Call structured generation
      const res = await AIService.generateStructuredLKPD({
        topic,
        subject,
        gradeLevel,
        theme,
        layoutMode,
        schoolName,
      });

      if (res && res.data) {
        const newData: LKPDData = {
          ...res.data,
          theme,
          layoutMode,
          headerInfo: {
            ...res.data.headerInfo,
            sekolah: schoolName,
            mataPelajaran: subject,
            faseKelas: gradeLevel,
            topik: topic,
          },
        };
        setLkpdData(newData);
        setCheckedTools({});
      }
    } catch (err) {
      console.warn("Structured generation fallback to text generator:", err);
      try {
        const prompt = `Buatkan LKPD Kurikulum Merdeka topik "${topic}" mapel "${subject}" kelas "${gradeLevel}" mode "${layoutMode}".`;
        const textRes = await AIService.generateLKPD(prompt);
        const parsed = parseMarkdownToLKPD(textRes, lkpdData);
        parsed.theme = theme;
        parsed.layoutMode = layoutMode;
        setLkpdData(parsed);
      } catch (fallbackErr) {
        console.error("All generation attempts failed:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle tool checkbox
  const handleToggleTool = (idx: number) => {
    setCheckedTools((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Print Document (Direct A4 Print)
  const handlePrint = () => {
    window.print();
  };

  // High Quality PDF Export
  const handleExportPDF = async () => {
    const element = document.getElementById("printable-lkpd");
    if (!element) return;

    setExporting(true);
    try {
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`LKPD_${lkpdData.headerInfo.topik.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.warn("Visual PDF export encountered issue, using text PDF fallback:", err);
      ExportService.exportTextPDF(
        lkpdData.title,
        lkpdData.rawMarkdown || `${lkpdData.title}\n\n${lkpdData.subTitle}`,
        `LKPD_${lkpdData.headerInfo.topik.replace(/\s+/g, "_")}.pdf`
      );
    } finally {
      setExporting(false);
    }
  };

  // Microsoft Word (.doc) Export
  const handleExportWord = () => {
    const htmlDoc = generateLKPDWordDoc(lkpdData);
    const blob = new Blob(["\ufeff" + htmlDoc], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LKPD_${lkpdData.headerInfo.topik.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy plain text / markdown
  const handleCopy = () => {
    const text = lkpdData.rawMarkdown || `${lkpdData.title}\n${lkpdData.subTitle}\n\n${lkpdData.learningGoals.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ================= HEADER HERO ================= */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>KURIKULUM MERDEKA • DOKUMEN SIAP CETAK A4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pembuat LKPD Interaktif Kurikulum Merdeka
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Rancang lembar aktivitas saintifik & investigasi kontekstual yang tertata rapi, estetik, dan siap cetak langsung pada kertas A4 standar. Dilengkapi kop resmi sekolah, checklist alat bahan, tahapan eksperimen, tabel observasi, baris bergaris untuk tulisan tangan siswa, dan asesmen formatif emotikon.
            </p>
          </div>

          {/* Quick Stats / Badge Card */}
          <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                A4
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Format Kertas</span>
                <span className="text-xs font-black text-slate-800">Standar Cetak & Fotokopi</span>
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Mode Fleksibel</span>
                <span className="text-xs font-black text-slate-800">Kelompok & Mandiri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Topic Pills */}
        <div className="mt-5 pt-4 border-t border-slate-200/80">
          <span className="text-[11px] font-black uppercase text-slate-400 block mb-2 tracking-wider">
            Inspirasi Cepat Topik Pembelajaran Mendalam:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  topic === p.topic
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generator Controls Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2">
          <div className="lg:col-span-5">
            <label className="text-[11px] font-extrabold uppercase text-slate-600 block mb-1">
              Topik Materi / Penyelidikan:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Penyelidikan Bagian Tubuh Tumbuhan..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="text-[11px] font-extrabold uppercase text-slate-600 block mb-1">
              Mata Pelajaran:
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="Ilmu Pengetahuan Alam dan Sosial (IPAS)">IPAS (Sains & Sosial)</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              <option value="Seni Rupa">Seni Rupa</option>
              <option value="Pendidikan Jasmani & Kesehatan (PJOK)">PJOK</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-[11px] font-extrabold uppercase text-slate-600 block mb-1">
              Fase & Kelas:
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="Fase A • Kelas I (Satu)">Fase A • Kelas 1 SD</option>
              <option value="Fase A • Kelas II (Dua)">Fase A • Kelas 2 SD</option>
              <option value="Fase B • Kelas III (Tiga)">Fase B • Kelas 3 SD</option>
              <option value="Fase B • Kelas IV (Empat)">Fase B • Kelas 4 SD</option>
              <option value="Fase C • Kelas V (Lima)">Fase C • Kelas 5 SD</option>
              <option value="Fase C • Kelas VI (Enam)">Fase C • Kelas 6 SD</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full h-[42px] px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>{loading ? "Menyusun..." : "Buat LKPD AI"}</span>
            </button>
          </div>
        </div>

        {/* Design Appearance Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Theme selection */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-500 uppercase text-[10px] flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Tema Desain:
            </span>
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setTheme("ceria");
                  setLkpdData((prev) => ({ ...prev, theme: "ceria" }));
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  theme === "ceria"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🌿 Ceria & Edukatif
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("formal");
                  setLkpdData((prev) => ({ ...prev, theme: "formal" }));
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  theme === "formal"
                    ? "bg-white text-blue-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🏛️ Biru Kurikulum Merdeka
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("monokrom");
                  setLkpdData((prev) => ({ ...prev, theme: "monokrom" }));
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  theme === "monokrom"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🖨️ Monokrom (Hemat Tinta)
              </button>
            </div>
          </div>

          {/* Layout Mode */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-500 uppercase text-[10px] flex items-center gap-1">
              <Layout className="w-3.5 h-3.5" /> Bentuk Siswa:
            </span>
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setLayoutMode("kelompok");
                  setLkpdData((prev) => ({ ...prev, layoutMode: "kelompok" }));
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  layoutMode === "kelompok"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                👥 Kelompok (Regu)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLayoutMode("individu");
                  setLkpdData((prev) => ({ ...prev, layoutMode: "individu" }));
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  layoutMode === "individu"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                👤 Mandiri (Individu)
              </button>
            </div>
          </div>

          {/* Toggle KOP */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKop(!showKop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                showKop
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>{showKop ? "KOP Sekolah Aktif" : "Tanpa KOP"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= WORKSPACE TOOLBAR & TABS ================= */}
      <div className="glass-card rounded-2xl p-2 sm:p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky top-4 z-20 bg-white/90 backdrop-blur-md shadow-md">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pratinjau Siap Cetak (A4)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "editor"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Sunting Form</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("markdown")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "markdown"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5 text-slate-600" />
            <span>Teks / Salin</span>
          </button>
        </div>

        {/* Action Buttons: Cetak, PDF, Word */}
        <div className="flex items-center gap-2">
          {activeTab === "preview" && (
            <button
              type="button"
              onClick={() => setIsEditingInline(!isEditingInline)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
                isEditingInline
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{isEditingInline ? "Selesai Edit Teks" : "Edit Teks Lembar"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-black bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            title="Cetak langsung ke printer atau simpan PDF melalui browser print"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cetak A4</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-3.5 py-1.5 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Unduh file dokumen PDF berkualitas tinggi"
          >
            {exporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exporting ? "Membuat PDF..." : "Unduh PDF"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportWord}
            className="px-3.5 py-1.5 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            title="Unduh dokumen format Microsoft Word (.doc) yang bisa diedit lanjut"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Word (.doc)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: PRATINJAU SIAP CETAK (A4 PRINT READY) ================= */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-xs text-slate-600 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Pratinjau Cetak Presisi:</strong> Tampilan di bawah ini dirancang proporsional sesuai tata letak kertas A4. Anda dapat langsung mengklik tombol <strong>Cetak A4</strong> atau <strong>Unduh PDF</strong>.
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 shrink-0 hidden sm:inline">
              Ukuran A4: 210 × 297 mm
            </span>
          </div>

          {/* Render Component */}
          <LKPDDocumentRenderer
            data={lkpdData}
            isEditing={isEditingInline}
            onUpdateData={setLkpdData}
            showKop={showKop}
            activeCheckedTools={checkedTools}
            onToggleTool={handleToggleTool}
            selectedEmoticon={selectedEmoticon}
            onSelectEmoticon={setSelectedEmoticon}
          />
        </div>
      )}

      {/* ================= TAB 2: MODE SUNTING FORM (STRUCTURED FORM EDITOR) ================= */}
      {activeTab === "editor" && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-black text-slate-900">Sunting Komponen LKPD</h2>
            <p className="text-slate-500 text-xs">
              Ubah rincian judul, petunjuk, alat/bahan, langkah kerja, atau pertanyaan diskusi sesuai kebutuhan spesifik kelas Anda.
            </p>
          </div>

          {/* 1. Header & Satuan Pendidikan */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
              1. Identitas Satuan Pendidikan & Judul
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Sekolah:</label>
                <input
                  type="text"
                  value={lkpdData.headerInfo.sekolah}
                  onChange={(e) =>
                    setLkpdData({
                      ...lkpdData,
                      headerInfo: { ...lkpdData.headerInfo, sekolah: e.target.value },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Sekolah:</label>
                <input
                  type="text"
                  value={lkpdData.headerInfo.alamat}
                  onChange={(e) =>
                    setLkpdData({
                      ...lkpdData,
                      headerInfo: { ...lkpdData.headerInfo, alamat: e.target.value },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Utama LKPD:</label>
                <input
                  type="text"
                  value={lkpdData.title}
                  onChange={(e) => setLkpdData({ ...lkpdData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-950"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subjudul Aktivitas:</label>
                <input
                  type="text"
                  value={lkpdData.subTitle}
                  onChange={(e) => setLkpdData({ ...lkpdData, subTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Capaian / Tujuan */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                2. Tujuan Penyelidikan & Capaian
              </h3>
              <button
                type="button"
                onClick={() =>
                  setLkpdData({
                    ...lkpdData,
                    learningGoals: [...lkpdData.learningGoals, "Tujuan pembelajaran baru..."],
                  })
                }
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Tujuan
              </button>
            </div>
            <div className="space-y-2">
              {lkpdData.learningGoals.map((goal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center font-bold text-slate-400">{idx + 1}.</span>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => {
                      const updated = [...lkpdData.learningGoals];
                      updated[idx] = e.target.value;
                      setLkpdData({ ...lkpdData, learningGoals: updated });
                    }}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = lkpdData.learningGoals.filter((_, i) => i !== idx);
                      setLkpdData({ ...lkpdData, learningGoals: updated });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Alat & Bahan */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                3. Alat dan Bahan Penyelidikan
              </h3>
              <button
                type="button"
                onClick={() =>
                  setLkpdData({
                    ...lkpdData,
                    toolsAndMaterials: [
                      ...lkpdData.toolsAndMaterials,
                      { name: "Alat baru...", note: "Keterangan" },
                    ],
                  })
                }
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Bahan
              </button>
            </div>
            <div className="space-y-2">
              {lkpdData.toolsAndMaterials.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tool.name}
                    placeholder="Nama alat/bahan..."
                    onChange={(e) => {
                      const updated = [...lkpdData.toolsAndMaterials];
                      updated[idx].name = e.target.value;
                      setLkpdData({ ...lkpdData, toolsAndMaterials: updated });
                    }}
                    className="flex-2 p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={tool.note || ""}
                    placeholder="Catatan / ukuran..."
                    onChange={(e) => {
                      const updated = [...lkpdData.toolsAndMaterials];
                      updated[idx].note = e.target.value;
                      setLkpdData({ ...lkpdData, toolsAndMaterials: updated });
                    }}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = lkpdData.toolsAndMaterials.filter((_, i) => i !== idx);
                      setLkpdData({ ...lkpdData, toolsAndMaterials: updated });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Langkah Kerja */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                4. Langkah Kerja Eksperimen
              </h3>
              <button
                type="button"
                onClick={() =>
                  setLkpdData({
                    ...lkpdData,
                    experimentSteps: [
                      ...lkpdData.experimentSteps,
                      {
                        step: lkpdData.experimentSteps.length + 1,
                        title: `Langkah ${lkpdData.experimentSteps.length + 1}`,
                        desc: "Deskripsi tindakan peserta didik...",
                      },
                    ],
                  })
                }
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Tahap
              </button>
            </div>
            <div className="space-y-3">
              {lkpdData.experimentSteps.map((s, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-900">Tahap {s.step}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = lkpdData.experimentSteps
                          .filter((_, i) => i !== idx)
                          .map((st, nIdx) => ({ ...st, step: nIdx + 1 }));
                        setLkpdData({ ...lkpdData, experimentSteps: updated });
                      }}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) => {
                      const updated = [...lkpdData.experimentSteps];
                      updated[idx].title = e.target.value;
                      setLkpdData({ ...lkpdData, experimentSteps: updated });
                    }}
                    placeholder="Judul Tahap"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                  <textarea
                    value={s.desc}
                    rows={2}
                    onChange={(e) => {
                      const updated = [...lkpdData.experimentSteps];
                      updated[idx].desc = e.target.value;
                      setLkpdData({ ...lkpdData, experimentSteps: updated });
                    }}
                    placeholder="Instruksi pelaksanaan..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 5. Pertanyaan Diskusi HOTS */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
                5. Pertanyaan Diskusi Penalaran Kritis (HOTS)
              </h3>
              <button
                type="button"
                onClick={() =>
                  setLkpdData({
                    ...lkpdData,
                    discussionQuestions: [
                      ...lkpdData.discussionQuestions,
                      {
                        number: lkpdData.discussionQuestions.length + 1,
                        question: "Pertanyaan baru penalaran...",
                        cognitiveLevel: "HOTS - C4",
                        blankLinesCount: 3,
                      },
                    ],
                  })
                }
                className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Soal
              </button>
            </div>
            <div className="space-y-3">
              {lkpdData.discussionQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800">Soal Nomor {q.number}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = lkpdData.discussionQuestions
                          .filter((_, i) => i !== idx)
                          .map((qst, nIdx) => ({ ...qst, number: nIdx + 1 }));
                        setLkpdData({ ...lkpdData, discussionQuestions: updated });
                      }}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...lkpdData.discussionQuestions];
                      updated[idx].question = e.target.value;
                      setLkpdData({ ...lkpdData, discussionQuestions: updated });
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={q.cognitiveLevel || ""}
                      placeholder="Level Kognitif (misal: HOTS - C4)"
                      onChange={(e) => {
                        const updated = [...lkpdData.discussionQuestions];
                        updated[idx].cognitiveLevel = e.target.value;
                        setLkpdData({ ...lkpdData, discussionQuestions: updated });
                      }}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-blue-700"
                    />
                    <input
                      type="text"
                      value={q.hint || ""}
                      placeholder="Petunjuk diskusi"
                      onChange={(e) => {
                        const updated = [...lkpdData.discussionQuestions];
                        updated[idx].hint = e.target.value;
                        setLkpdData({ ...lkpdData, discussionQuestions: updated });
                      }}
                      className="p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Pengesahan Tanda Tangan */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-emerald-800">
              6. Tanda Tangan Pengesahan Guru & Kepala Sekolah
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Guru Pengampu:</label>
                <input
                  type="text"
                  value={lkpdData.teacherSignature.namaGuru}
                  onChange={(e) =>
                    setLkpdData({
                      ...lkpdData,
                      teacherSignature: {
                        ...lkpdData.teacherSignature,
                        namaGuru: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP Guru:</label>
                <input
                  type="text"
                  value={lkpdData.teacherSignature.nipGuru}
                  onChange={(e) =>
                    setLkpdData({
                      ...lkpdData,
                      teacherSignature: {
                        ...lkpdData.teacherSignature,
                        nipGuru: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Kepala Sekolah:</label>
                <input
                  type="text"
                  value={lkpdData.teacherSignature.namaKepsek}
                  onChange={(e) =>
                    setLkpdData({
                      ...lkpdData,
                      teacherSignature: {
                        ...lkpdData.teacherSignature,
                        namaKepsek: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP Kepala Sekolah:</label>
                <input
                  type="text"
                  value={lkpdData.teacherSignature.nipKepsek}
                  onChange={(e) =>
                    setLkpdData({
                      ...lkpdData,
                      teacherSignature: {
                        ...lkpdData.teacherSignature,
                        nipKepsek: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TEKS MARKDOWN / SALIN ================= */}
      {activeTab === "markdown" && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Teks Dokumen LKPD (Format Standar)</span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin ke Clipboard!" : "Salin Teks"}</span>
            </button>
          </div>

          <div className="p-6 md:p-8 bg-white text-slate-800 text-xs md:text-sm leading-relaxed font-mono whitespace-pre-wrap max-h-[600px] overflow-y-auto">
            {lkpdData.rawMarkdown ||
              `# ${lkpdData.title}\n## ${lkpdData.subTitle}\n\n### Identitas\n- Sekolah: ${lkpdData.headerInfo.sekolah}\n- Mata Pelajaran: ${lkpdData.headerInfo.mataPelajaran}\n- Kelas/Fase: ${lkpdData.headerInfo.faseKelas}\n\n### A. Tujuan Penyelidikan\n${lkpdData.learningGoals.map((g, i) => `${i + 1}. ${g}`).join("\n")}\n\n### B. Alat dan Bahan\n${lkpdData.toolsAndMaterials.map((t) => `- [ ] ${t.name} (${t.note || ""})`).join("\n")}\n\n### C. Langkah Kegiatan\n${lkpdData.experimentSteps.map((s) => `${s.step}. **${s.title}**: ${s.desc}`).join("\n")}\n\n### D. Pertanyaan Diskusi HOTS\n${lkpdData.discussionQuestions.map((q) => `${q.number}. ${q.question} [${q.cognitiveLevel || ""}]`).join("\n")}\n\n### E. Kesimpulan\n${lkpdData.conclusionPrompt}`}
          </div>
        </div>
      )}
    </div>
  );
};
