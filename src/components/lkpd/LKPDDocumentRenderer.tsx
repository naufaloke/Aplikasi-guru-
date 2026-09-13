import React, { useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Calendar,
  Users,
  User,
  Clock,
  BookOpen,
  FlaskConical,
  ListOrdered,
  FileCheck,
  Smile,
  Meh,
  Frown,
  Edit3,
  CheckSquare,
  Square,
  ShieldAlert,
} from "lucide-react";
import { LKPDData } from "../../types/lkpd";

interface LKPDDocumentRendererProps {
  data: LKPDData;
  isEditing?: boolean;
  onUpdateData?: (updated: LKPDData) => void;
  showKop?: boolean;
  activeCheckedTools?: Record<number, boolean>;
  onToggleTool?: (index: number) => void;
  selectedEmoticon?: number | null;
  onSelectEmoticon?: (val: number) => void;
}

export const LKPDDocumentRenderer: React.FC<LKPDDocumentRendererProps> = ({
  data,
  isEditing = false,
  onUpdateData,
  showKop = true,
  activeCheckedTools = {},
  onToggleTool,
  selectedEmoticon = null,
  onSelectEmoticon,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Theme-specific styling classes
  const getThemeHeaderBg = () => {
    switch (data.theme) {
      case "monokrom":
        return "bg-zinc-100 text-zinc-900 border-zinc-900";
      case "formal":
        return "bg-slate-900 text-white border-blue-900";
      case "ceria":
      default:
        return "bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white border-emerald-600";
    }
  };

  const getSectionBadgeClass = () => {
    switch (data.theme) {
      case "monokrom":
        return "bg-zinc-800 text-white";
      case "formal":
        return "bg-blue-900 text-white";
      case "ceria":
      default:
        return "bg-emerald-700 text-white";
    }
  };

  const getSectionBorderClass = () => {
    switch (data.theme) {
      case "monokrom":
        return "border-zinc-800";
      case "formal":
        return "border-blue-800";
      case "ceria":
      default:
        return "border-emerald-600";
    }
  };

  // Inline edit helper
  const handleFieldChange = (path: string, value: any) => {
    if (!onUpdateData) return;
    const clone: LKPDData = JSON.parse(JSON.stringify(data));
    const parts = path.split(".");
    let curr: any = clone;
    for (let i = 0; i < parts.length - 1; i++) {
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
    onUpdateData(clone);
  };

  return (
    <div className="flex justify-center w-full">
      {/* Printable Sheet Container */}
      <div
        id="printable-lkpd"
        ref={containerRef}
        className="w-full max-w-[820px] bg-white text-slate-900 rounded-2xl shadow-xl print:shadow-none border border-slate-200 print:border-none p-6 sm:p-10 md:p-12 space-y-6 text-sm select-text font-sans relative transition-all"
        style={{ minHeight: "1120px" }}
      >
        {/* ================= 1. KOP SURAT RESMI SEKOLAH ================= */}
        {showKop && (
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-5">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Tut Wuri Handayani */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-blue-900"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="4" />
                  <path
                    d="M50 15 L62 38 L87 40 L68 56 L74 81 L50 67 L26 81 L32 56 L13 40 L38 38 Z"
                    fill="#2563eb"
                  />
                  <circle cx="50" cy="50" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <path d="M46 44 L54 44 L54 56 L46 56 Z" fill="#b45309" />
                </svg>
              </div>

              {/* Text Kop */}
              <div className="text-center flex-1">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-800 leading-tight">
                  {data.headerInfo.dinas.split("\n").map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <h1 className="text-base sm:text-xl font-black uppercase text-blue-950 tracking-tight mt-0.5">
                  {data.headerInfo.sekolah}
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5 leading-snug">
                  {data.headerInfo.alamat}
                </p>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium mt-0.5">
                  NPSN: 10802087 • Email: sdn3banjarratu@gmail.com • Website: sdn3banjarratu.sch.id
                </div>
              </div>

              {/* Logo Kurikulum Merdeka */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 hidden sm:flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex flex-col items-center justify-center font-black text-center shadow-xs border border-amber-300">
                  <span className="text-[8px] tracking-tighter uppercase font-bold">KURIKULUM</span>
                  <span className="text-[12px] leading-tight">MERDEKA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. TITLE BANNER ================= */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${getThemeHeaderBg()} text-center shadow-xs relative overflow-hidden`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-1 backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>KURIKULUM MERDEKA • PEMBELAJARAN MENDALAM</span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full text-center text-base sm:text-xl font-black tracking-tight bg-white/30 border border-white/50 rounded-lg px-2 py-1 text-white placeholder-white/70 outline-none"
            />
          ) : (
            <h2 className="text-base sm:text-xl font-black tracking-tight leading-snug">
              {data.title}
            </h2>
          )}

          {isEditing ? (
            <input
              type="text"
              value={data.subTitle}
              onChange={(e) => handleFieldChange("subTitle", e.target.value)}
              className="w-full text-center text-xs font-semibold mt-1 bg-white/20 border border-white/40 rounded px-2 py-0.5 text-white outline-none"
            />
          ) : (
            <p className="text-xs sm:text-sm font-semibold opacity-90 mt-0.5">
              {data.subTitle}
            </p>
          )}
        </div>

        {/* ================= 3. KOTAK IDENTITAS PESERTA DIDIK ================= */}
        <div className="rounded-2xl border-2 border-slate-900/90 overflow-hidden bg-white shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-slate-900/90">
            {/* Left: Info Anggota Kelompok / Nama Siswa */}
            <div className="md:col-span-7 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wide text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-700" />
                  {data.layoutMode === "kelompok" ? "Identitas Kelompok:" : "Identitas Peserta Didik:"}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {data.layoutMode === "kelompok" ? "Mode Regu Kolaboratif" : "Mode Mandiri"}
                </span>
              </div>

              {data.layoutMode === "kelompok" ? (
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 shrink-0 w-28">Nama Kelompok:</span>
                    <span className="border-b border-dotted border-slate-700 flex-1 h-5 flex items-center font-medium text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={data.studentIdentity.namaKelompokDefault}
                          onChange={(e) =>
                            handleFieldChange("studentIdentity.namaKelompokDefault", e.target.value)
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded px-1 text-xs"
                        />
                      ) : (
                        data.studentIdentity.namaKelompokDefault || "..........................................................."
                      )}
                    </span>
                  </div>

                  <div className="pt-1 space-y-1 text-[11px] text-slate-700">
                    <span className="font-bold block text-slate-800">Daftar Anggota & Peran:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pl-1">
                      <div>1. ............................................... (Ketua)</div>
                      <div>2. ............................................... (Notulis)</div>
                      <div>3. ............................................... (Eksplorer)</div>
                      <div>4. ............................................... (Pengamat)</div>
                      <div className="sm:col-span-2">5. ............................................... (Pelapor)</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 shrink-0 w-28">Nama Lengkap:</span>
                    <span className="border-b border-dotted border-slate-700 flex-1 h-5"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 shrink-0 w-28">Nomor Presensi:</span>
                    <span className="border-b border-dotted border-slate-700 w-24 h-5"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Center: Metadata Kelas, Mapel & Waktu */}
            <div className="md:col-span-3 p-3.5 space-y-2 text-xs bg-slate-50/70">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Mata Pelajaran:</span>
                <span className="font-black text-slate-900">{data.headerInfo.mataPelajaran}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Fase & Kelas:</span>
                <span className="font-extrabold text-blue-900">{data.headerInfo.faseKelas}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Alokasi:</span>
                  <span className="font-semibold text-slate-800">{data.headerInfo.alokasiWaktu}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Tanggal:</span>
                  <span className="font-semibold text-slate-800">..../..../2024</span>
                </div>
              </div>
            </div>

            {/* Right: Kotak Nilai & Paraf Guru */}
            <div className="md:col-span-2 p-3 flex flex-col items-center justify-between text-center bg-white">
              <span className="text-[10px] font-black uppercase text-slate-900 tracking-wider">
                NILAI / PARAF
              </span>
              <div className="w-16 h-14 sm:w-20 sm:h-16 border-2 border-dashed border-slate-400 rounded-xl my-1 flex items-center justify-center text-slate-300 font-bold text-xs">
                Cap / Skor
              </div>
              <span className="text-[9px] text-slate-500 font-semibold">
                Paraf Guru Kelas
              </span>
            </div>
          </div>
        </div>

        {/* ================= BAGIAN A: CAPAIAN & TUJUAN PENYELIDIKAN ================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
              A
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
              Tujuan Eksplorasi Cilik & Capaian Pembelajaran
            </h3>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs text-slate-700">
            {data.learningGoals.map((goal, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BAGIAN B: PETUNJUK BELAJAR & KESELAMATAN ================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
              B
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
              Petunjuk Pengerjaan & Panduan Keselamatan
            </h3>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-950 space-y-1.5">
            {data.instructions.map((ins, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{ins}</span>
              </div>
            ))}
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Peringatan: Berhati-hatilah saat menggunakan benda tajam atau pewarna. Selalu minta izin guru pendamping.</span>
            </div>
          </div>
        </div>

        {/* ================= BAGIAN C: ALAT & BAHAN (CHECKLIST SIAP CENTANG) ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
                C
              </span>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
                Alat dan Bahan Penyelidikan
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 italic">
              (Beri tanda centang [✓] saat bahan telah siap di meja)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {data.toolsAndMaterials.map((tool, idx) => {
              const isChecked = !!activeCheckedTools[idx];
              return (
                <div
                  key={idx}
                  onClick={() => onToggleTool && onToggleTool(idx)}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                    isChecked
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold"
                      : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-slate-500 print:text-slate-800">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 print:text-slate-900" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 print:text-slate-900" />
                    )}
                  </div>
                  <div className="leading-tight">
                    <span className="font-bold">{tool.name}</span>
                    {tool.note && (
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        Catatan: {tool.note}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= BAGIAN D: LANGKAH KERJA & INVESTIGASI ================= */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
              D
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
              Langkah Penyelidikan Ilmiah (Hands-on Inquiry)
            </h3>
          </div>

          <div className="space-y-2">
            {data.experimentSteps.map((step) => (
              <div
                key={step.step}
                className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {step.step}
                </div>
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-black text-slate-900">{step.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BAGIAN E: TABEL OBSERVASI PENGAMATAN ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
                E
              </span>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
                {data.observationTable.title}
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 italic">
              (Catat fakta sesungguhnya di kolom bawah ini)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-slate-900/90">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-900/90 font-black">
                  {data.observationTable.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`p-2.5 border-r border-slate-300 last:border-r-0 ${
                        idx === 0 ? "w-12 text-center" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-medium">
                {data.observationTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-2.5 border-r border-slate-300 last:border-r-0 text-slate-800 ${
                          cIdx === 0 ? "text-center font-bold" : ""
                        }`}
                        style={{ minHeight: "45px" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= BAGIAN F: PERTANYAAN DISKUSI & PENALARAN HOTS ================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
                F
              </span>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
                Pertanyaan Diskusi & Penalaran Kritis (HOTS)
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Bernalar Kritis & Komunikasi
            </span>
          </div>

          <div className="space-y-4">
            {data.discussionQuestions.map((q) => (
              <div
                key={q.number}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {q.number}
                    </span>
                    <p className="font-bold text-slate-900 leading-relaxed">{q.question}</p>
                  </div>
                  {q.cognitiveLevel && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                      {q.cognitiveLevel}
                    </span>
                  )}
                </div>

                {q.hint && (
                  <p className="text-[10px] text-slate-500 italic pl-7">
                    💡 Petunjuk Diskusi: {q.hint}
                  </p>
                )}

                {/* Ruled Notebook Writing Lines for Student Answers */}
                <div className="pl-7 pt-1 space-y-2.5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Ruang Jawaban Kelompok:
                  </span>
                  {Array.from({ length: q.blankLinesCount || 3 }).map((_, lineIdx) => (
                    <div
                      key={lineIdx}
                      className="w-full border-b border-dashed border-slate-400 h-5"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BAGIAN G: KESIMPULAN KELOMPOK ================= */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
              G
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
              Kesimpulan Bersama Penyelidikan
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-slate-900/90 space-y-2 text-xs">
            <p className="font-semibold text-slate-700 leading-relaxed">
              {data.conclusionPrompt}
            </p>
            {/* 3 writing lines */}
            <div className="space-y-3 pt-1">
              <div className="w-full border-b border-dashed border-slate-500 h-6 flex items-end text-xs text-slate-600 font-medium">
                ........................................................................................................................................................................
              </div>
              <div className="w-full border-b border-dashed border-slate-500 h-6 flex items-end text-xs text-slate-600 font-medium">
                ........................................................................................................................................................................
              </div>
            </div>
          </div>
        </div>

        {/* ================= BAGIAN H: ASESMEN FORMATIF & REFLEKSI EMOTIKON ================= */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${getSectionBadgeClass()}`}>
              H
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
              Refleksi Diri Emotikon & Asesmen Sikap Pelajar Pancasila
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Emoticon Selector */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-950 block text-xs">
                Bagaimana perasaanmu setelah melakukan penyelidikan hari ini?
              </span>

              <div className="flex items-center justify-around pt-1">
                <button
                  type="button"
                  onClick={() => onSelectEmoticon && onSelectEmoticon(1)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    selectedEmoticon === 1
                      ? "bg-amber-400 text-white shadow-md scale-110"
                      : "bg-white text-slate-700 hover:bg-amber-100"
                  }`}
                >
                  <Smile className="w-6 h-6 text-emerald-600" />
                  <span className="text-[10px] font-black">Sangat Senang (Paham)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectEmoticon && onSelectEmoticon(2)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    selectedEmoticon === 2
                      ? "bg-amber-400 text-white shadow-md scale-110"
                      : "bg-white text-slate-700 hover:bg-amber-100"
                  }`}
                >
                  <Meh className="w-6 h-6 text-amber-600" />
                  <span className="text-[10px] font-black">Cukup Paham</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectEmoticon && onSelectEmoticon(3)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    selectedEmoticon === 3
                      ? "bg-amber-400 text-white shadow-md scale-110"
                      : "bg-white text-slate-700 hover:bg-amber-100"
                  }`}
                >
                  <Frown className="w-6 h-6 text-rose-600" />
                  <span className="text-[10px] font-black">Butuh Bantuan</span>
                </button>
              </div>
            </div>

            {/* Rubrik Sikap Checklist */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">
                Penilaian Karakter Kelompok (Centang salah satu):
              </span>

              <div className="space-y-1 text-[11px] text-slate-700">
                <div className="flex items-center justify-between py-0.5 border-b border-slate-200">
                  <span>1. Gotong Royong / Kerjasama</span>
                  <span className="font-semibold text-slate-500">[ ] Kurang &nbsp; [ ] Baik &nbsp; [✓] Sangat Kompak</span>
                </div>
                <div className="flex items-center justify-between py-0.5 border-b border-slate-200">
                  <span>2. Bernalar Kritis & Analisis</span>
                  <span className="font-semibold text-slate-500">[ ] Kurang &nbsp; [✓] Cermat &nbsp; [ ] Sangat Cermat</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span>3. Tanggung Jawab & Kebersihan</span>
                  <span className="font-semibold text-slate-500">[ ] Kurang &nbsp; [ ] Cukup &nbsp; [✓] Bersih & Rapi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PENGESAHAN GURU & KEPALA SEKOLAH ================= */}
        <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 text-center text-xs text-slate-800">
          <div>
            <span>Mengetahui,</span>
            <br />
            <span className="font-semibold">Kepala SD Negeri 3 Banjar Ratu</span>
            <div className="h-16 sm:h-20 flex items-center justify-center text-slate-300 italic text-[10px]">
              (Tanda Tangan & Cap)
            </div>
            <span className="font-black underline block">{data.teacherSignature.namaKepsek}</span>
            <span className="text-[11px] text-slate-600">NIP. {data.teacherSignature.nipKepsek}</span>
          </div>

          <div>
            <span>{data.teacherSignature.tanggal}</span>
            <br />
            <span className="font-semibold">Guru Kelas IV / Guru Pendamping</span>
            <div className="h-16 sm:h-20 flex items-center justify-center text-slate-300 italic text-[10px]">
              (Tanda Tangan Guru)
            </div>
            <span className="font-black underline block">{data.teacherSignature.namaGuru}</span>
            <span className="text-[11px] text-slate-600">NIP. {data.teacherSignature.nipGuru}</span>
          </div>
        </div>

        {/* Footer info note */}
        <div className="pt-2 text-center text-[10px] text-slate-400 font-medium print:text-slate-500">
          Dokumen Lembar Kerja Peserta Didik (LKPD) Sah • Kurikulum Merdeka 2024/2025 • SDN 3 Banjar Ratu
        </div>
      </div>
    </div>
  );
};
