import React, { useState } from "react";
import {
  FileDown,
  Printer,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Building,
  School,
  Calendar,
  User,
  ShieldAlert,
} from "lucide-react";
import { CompleteModulePlan } from "../../types/modulePlan";
import { DocxExportService } from "../../services/docxExport";
import { AIModuleGenerator } from "../../services/aiModuleGenerator";
import { StorageService } from "../../services/storage";

interface ModulePrintPreviewProps {
  plan: CompleteModulePlan;
  onEdit: () => void;
  onUpdatePlan: (updated: CompleteModulePlan) => void;
}

export const ModulePrintPreview: React.FC<ModulePrintPreviewProps> = ({
  plan,
  onEdit,
  onUpdatePlan,
}) => {
  const school = StorageService.getSchool();
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [tidiedNotification, setTidiedNotification] = useState(false);

  const handleExportDocx = async () => {
    setDownloadingDocx(true);
    try {
      await DocxExportService.exportModuleToDocx(plan);
    } catch (err) {
      console.error("Docx error:", err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const handleTidyUp = () => {
    const tidied = AIModuleGenerator.tidyUpDocument(plan);
    onUpdatePlan(tidied);
    setTidiedNotification(true);
    setTimeout(() => setTidiedNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-6">
      {/* Top Action Header (Hidden on print) */}
      <div className="no-print max-w-5xl mx-auto mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Editor
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              Pratinjau Dokumen Siap Cetak
            </h1>
            <p className="text-[11px] text-slate-500">
              Format: {plan.styling.ukuranKertas} • Font: {plan.styling.fontFamily} {plan.styling.fontSize}pt • {plan.styling.gayaDokumen}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTidyUp}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
            title="Rapikan spasi, margin, heading, dan tata letak secara otomatis"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            ✨ Rapikan Dokumen
          </button>

          <button
            onClick={handleExportDocx}
            disabled={downloadingDocx}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm shadow-blue-500/20"
          >
            <FileDown className="w-4 h-4" />
            {downloadingDocx ? "Membuat Word..." : "Download Word (.docx)"}
          </button>

          <button
            onClick={handleDirectPrint}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {tidiedNotification && (
        <div className="no-print max-w-5xl mx-auto mb-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Dokumen telah dirapikan! Format font, margin, dan nomor urut bank soal telah dioptimasi untuk pencetakan.
        </div>
      )}

      {/* DOCUMENT PREVIEW CONTAINER (Simulates A4 Paper Layout) */}
      <div id="printable-area" className="printable-document max-w-[850px] mx-auto bg-white shadow-xl rounded-xl border border-slate-300 p-8 sm:p-14 print:p-0 print:border-none print:shadow-none print:rounded-none text-slate-900 font-sans leading-relaxed text-[12pt]">
        
        {/* ===================== COVER PAGE ===================== */}
        {plan.styling.coverStyle !== "none" && (
          <div className="min-h-[950px] flex flex-col justify-between items-center text-center border-b-2 border-dashed border-slate-300 pb-16 mb-16 print:border-none print:min-h-screen print:page-break-after-always">
            {/* Header KOP Dinas / Sekolah */}
            <div className="w-full flex items-center justify-between border-b-4 border-double border-slate-800 pb-4 mb-8">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-200 shrink-0">
                {school.logo ? (
                  <img src={school.logo} alt="Logo Sekolah" className="w-full h-full object-contain" />
                ) : (
                  <School className="w-10 h-10 text-blue-700" />
                )}
              </div>
              <div className="flex-1 text-center px-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  PEMERINTAH KABUPATEN LAMPUNG TENGAH
                </h4>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800">
                  DINAS PENDIDIKAN DAN KEBUDAYAAN
                </h3>
                <h2 className="text-lg font-black uppercase text-blue-900 tracking-tight">
                  {plan.identity.namaSekolah}
                </h2>
                <p className="text-[10px] text-slate-500">
                  NPSN: {plan.identity.npsn} | Kec. Way Pengubuan, Kab. Lampung Tengah, Prov. Lampung
                </p>
              </div>
              <div className="w-16 h-16 shrink-0" />
            </div>

            {/* Title Section */}
            <div className="space-y-4 my-auto py-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest">
                MODUL AJAR KURIKULUM MERDEKA
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {plan.identity.mataPelajaran.toUpperCase()}
              </h1>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800">
                {plan.identity.materiPokok}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {plan.identity.submateri}
              </p>
              <div className="pt-4 text-base font-bold text-slate-700">
                {plan.identity.kelas.toUpperCase()} / FASE {plan.identity.fase.toUpperCase()} – SEMESTER {plan.identity.semester.toUpperCase()}
              </div>
            </div>

            {/* Disusun Oleh & Footer Sekolah */}
            <div className="w-full space-y-8 pt-10">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 italic">Disusun Oleh Guru Pengampu:</p>
                <p className="text-base font-bold text-slate-900 underline decoration-slate-400 underline-offset-4">
                  {plan.identity.namaGuru}
                </p>
                <p className="text-xs text-slate-600">NIP. {plan.identity.nip || "-"}</p>
              </div>

              <div className="border-t border-slate-200 pt-4 text-center">
                <p className="text-sm font-bold text-slate-800 uppercase">
                  {plan.identity.namaSekolah}
                </p>
                <p className="text-xs font-semibold text-slate-600">
                  TAHUN AJARAN {plan.identity.tahunAjaran}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SECTION I: INFORMASI UMUM ===================== */}
        <div className="mb-10 space-y-6">
          <div className="border-b-2 border-slate-900 pb-1">
            <h2 className="text-base font-black text-slate-900 tracking-wide uppercase">
              I. INFORMASI UMUM
            </h2>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">A. IDENTITAS MODUL</h3>
            <table className="w-full text-xs border-collapse border border-slate-300">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-48 p-2 font-semibold bg-slate-50 border-r border-slate-300">Nama Satuan Pendidikan</td>
                  <td className="p-2 font-medium">{plan.identity.namaSekolah} (NPSN: {plan.identity.npsn})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">Penyusun / Guru</td>
                  <td className="p-2">{plan.identity.namaGuru} (NIP: {plan.identity.nip || "-"})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">Jenjang / Fase / Kelas</td>
                  <td className="p-2">{plan.identity.jenjang} / Fase {plan.identity.fase} / {plan.identity.kelas}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">Mata Pelajaran</td>
                  <td className="p-2 font-bold text-blue-900">{plan.identity.mataPelajaran}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">Materi Pokok / Submateri</td>
                  <td className="p-2">{plan.identity.materiPokok} ({plan.identity.submateri})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">Semester / Tahun Ajaran</td>
                  <td className="p-2">{plan.identity.semester} / {plan.identity.tahunAjaran}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">Alokasi Waktu</td>
                  <td className="p-2 font-semibold">{plan.identity.alokasiWaktu}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">B. KOMPETENSI AWAL</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {plan.modulCore.kompetensiAwal}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">C. PROFIL PELAJAR PANCASILA</h3>
            <ul className="text-xs text-slate-700 list-disc list-inside space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {plan.modulCore.profilPelajarPancasila.map((p, idx) => (
                <li key={idx} className="leading-relaxed">{p}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">D. SARANA DAN PRASARANA</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                {plan.modulCore.saranaPrasarana}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">E. TARGET PESERTA DIDIK</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                {plan.modulCore.targetPesertaDidik}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">F. MODEL, METODE & PENDEKATAN PEMBELAJARAN</h3>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
              <strong>Model:</strong> {plan.karakter.model} <br />
              <strong>Pendekatan:</strong> {plan.karakter.pendekatan} <br />
              <strong>Metode:</strong> {plan.modulCore.metode}
            </p>
          </div>
        </div>

        {/* ===================== SECTION II: KOMPONEN INTI ===================== */}
        <div className="mb-10 space-y-6">
          <div className="border-b-2 border-slate-900 pb-1">
            <h2 className="text-base font-black text-slate-900 tracking-wide uppercase">
              II. KOMPONEN INTI
            </h2>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">A. CAPAIAN PEMBELAJARAN (CP)</h3>
            <p className="text-xs text-slate-800 bg-blue-50/50 p-3 rounded-lg border border-blue-200 leading-relaxed">
              {plan.cp.rumusanCP}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">B. TUJUAN PEMBELAJARAN (TP)</h3>
            <div className="space-y-2">
              {plan.tp.map((t, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 text-xs flex items-start gap-2 bg-white">
                  <span className="font-bold text-blue-700 shrink-0">{t.kode}:</span>
                  <div className="flex-1">
                    <p className="text-slate-800 leading-relaxed">{t.deskripsi}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                      KKO: {t.kko} ({t.levelKognitif})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">C. PEMAHAMAN BERMAKNA</h3>
            <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
              {plan.modulCore.pemahamanBermakna}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">D. PERTANYAAN PEMANTIK</h3>
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-1.5 text-amber-950">
              {plan.modulCore.pertanyaanPemantik.map((q, idx) => (
                <p key={idx} className="italic">
                  {idx + 1}. "{q}"
                </p>
              ))}
            </div>
          </div>

          {/* SINTAKS KEGIATAN */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">E. KEGIATAN PEMBELAJARAN</h3>

            {/* Pendahuluan */}
            <div className="p-3 border border-slate-300 rounded-lg mb-3 bg-slate-50/50">
              <div className="flex justify-between items-center font-bold text-xs text-slate-900 mb-2 border-b border-slate-200 pb-1">
                <span>1. Kegiatan Pendahuluan</span>
                <span className="text-blue-700">{plan.kegiatan.pendahuluan.alokasiWaktu}</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li><strong>Salam & Doa:</strong> {plan.kegiatan.pendahuluan.salamDoa}</li>
                <li><strong>Apersepsi:</strong> {plan.kegiatan.pendahuluan.presensiApersepsi}</li>
                <li><strong>Motivasi:</strong> {plan.kegiatan.pendahuluan.motivasiTujuan}</li>
              </ul>
            </div>

            {/* Inti */}
            <div className="p-3 border border-slate-300 rounded-lg mb-3 bg-white">
              <div className="font-bold text-xs text-slate-900 mb-2 border-b border-slate-200 pb-1">
                2. Kegiatan Inti (Sintaks {plan.karakter.model})
              </div>
              <div className="space-y-3">
                {plan.kegiatan.inti.map((fase, idx) => (
                  <div key={idx} className="text-xs border-l-2 border-blue-600 pl-3">
                    <div className="flex justify-between font-bold text-blue-900 mb-1">
                      <span>{fase.fase}</span>
                      <span className="text-slate-500 font-normal">{fase.alokasiWaktu}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {fase.aktivitas.map((act, aIdx) => (
                        <li key={aIdx}>{act}</li>
                      ))}
                    </ul>
                    {fase.deepLearningCatatan && (
                      <p className="text-[10px] text-emerald-700 mt-1 italic">
                        ★ {fase.deepLearningCatatan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Penutup */}
            <div className="p-3 border border-slate-300 rounded-lg bg-slate-50/50">
              <div className="flex justify-between items-center font-bold text-xs text-slate-900 mb-2 border-b border-slate-200 pb-1">
                <span>3. Kegiatan Penutup</span>
                <span className="text-blue-700">{plan.kegiatan.penutup.alokasiWaktu}</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                <li><strong>Simpulan:</strong> {plan.kegiatan.penutup.kesimpulan}</li>
                <li><strong>Refleksi:</strong> {plan.kegiatan.penutup.refleksi}</li>
                <li><strong>Tindak Lanjut:</strong> {plan.kegiatan.penutup.evaluasiTindakLanjut}</li>
              </ul>
            </div>
          </div>

          {/* PEMBELAJARAN MENDALAM & DIFERENSIASI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase">
                F. Pembelajaran Mendalam (Deep Learning)
              </h4>
              <p className="text-[11px] text-slate-700">
                <strong>Berkesadaran (Mindful):</strong> {plan.deepLearning.berkesadaran}
              </p>
              <p className="text-[11px] text-slate-700">
                <strong>Bermakna (Meaningful):</strong> {plan.deepLearning.bermakna}
              </p>
              <p className="text-[11px] text-slate-700">
                <strong>Menggembirakan (Joyful):</strong> {plan.deepLearning.menggembirakan}
              </p>
            </div>

            <div className="p-3.5 bg-indigo-50/40 border border-indigo-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase">
                G. Diferensiasi Pembelajaran
              </h4>
              <p className="text-[11px] text-slate-700">
                <strong>Diferensiasi Konten:</strong> {plan.diferensiasi.konten}
              </p>
              <p className="text-[11px] text-slate-700">
                <strong>Diferensiasi Proses:</strong> {plan.diferensiasi.proses}
              </p>
              <p className="text-[11px] text-slate-700">
                <strong>Diferensiasi Produk:</strong> {plan.diferensiasi.produk}
              </p>
            </div>
          </div>

          {/* LEMBAR PENGESAHAN */}
          <div className="pt-8 pb-4 text-xs">
            <div className="flex justify-between text-slate-900 font-medium px-4">
              <div>
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {plan.identity.namaSekolah}</p>
                <div className="h-20" />
                <p className="font-bold underline decoration-slate-400">
                  {plan.identity.namaKepsek || "Drs. H. Mulyono, M.Pd."}
                </p>
                <p className="text-[11px] text-slate-600">
                  NIP. {plan.identity.nipKepsek || "196805121992031004"}
                </p>
              </div>

              <div>
                <p>Banjar Ratu, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="font-bold">Guru Pengampu / Wali Kelas</p>
                <div className="h-20" />
                <p className="font-bold underline decoration-slate-400">
                  {plan.identity.namaGuru}
                </p>
                <p className="text-[11px] text-slate-600">
                  NIP. {plan.identity.nip || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== LAMPIRAN 1: BAHAN AJAR ===================== */}
        {plan.styling.lampiran.bahanAjar && (
          <div className="border-t-2 border-dashed border-slate-300 pt-10 mt-10 print:border-none print:pt-0 print:page-break-before-always space-y-4">
            <div className="text-center pb-2 border-b border-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lampiran 1</span>
              <h2 className="text-base font-black text-slate-900">{plan.bahanAjar.judul}</h2>
            </div>
            <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded border border-slate-200">
              {plan.bahanAjar.pengantar}
            </p>
            <div className="text-xs space-y-2 text-slate-800 leading-relaxed whitespace-pre-line">
              <h3 className="font-bold text-sm text-slate-900">Konsep Utama:</h3>
              <p>{plan.bahanAjar.konsepUtama}</p>
              <h3 className="font-bold text-sm text-slate-900 mt-3">Uraian Materi:</h3>
              <p>{plan.bahanAjar.penjelasanMateri}</p>
              <h3 className="font-bold text-sm text-slate-900 mt-3">Penerapan Nyata:</h3>
              <p>{plan.bahanAjar.contohAplikasi}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950">
              <h4 className="font-bold mb-1">Rangkuman Materi:</h4>
              <p className="whitespace-pre-line">{plan.bahanAjar.rangkuman}</p>
            </div>
          </div>
        )}

        {/* ===================== LAMPIRAN 2: LKPD ===================== */}
        {plan.styling.lampiran.lkpd && (
          <div className="border-t-2 border-dashed border-slate-300 pt-10 mt-10 print:border-none print:pt-0 print:page-break-before-always space-y-4">
            <div className="text-center pb-2 border-b border-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lampiran 2</span>
              <h2 className="text-base font-black text-slate-900">{plan.lkpd.judul}</h2>
            </div>
            <div className="text-xs border border-slate-300 p-3 rounded space-y-1">
              <p><strong>Kelompok:</strong> ........................................ <strong>Kelas:</strong> {plan.identity.kelas}</p>
              <p><strong>Anggota:</strong> 1.................... 2.................... 3.................... 4....................</p>
            </div>
            <div className="text-xs space-y-2">
              <p><strong>Tujuan Praktik:</strong> {plan.lkpd.tujuan}</p>
              <p><strong>Alat & Bahan:</strong> {plan.lkpd.alatBahan.join(", ")}</p>
              <p><strong>Langkah Kerja:</strong></p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                {plan.lkpd.langkahKegiatan.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Tabel Pengamatan */}
            {plan.lkpd.tabelPengamatan && (
              <div className="pt-2">
                <p className="text-xs font-bold mb-1">Tabel Hasil Pengamatan:</p>
                <table className="w-full text-xs border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-100">
                      {plan.lkpd.tabelPengamatan.headers.map((h, i) => (
                        <th key={i} className="border border-slate-400 p-2 text-left font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plan.lkpd.tabelPengamatan.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border border-slate-400">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="border border-slate-400 p-2">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-xs pt-2">
              <p className="font-bold mb-1">Pertanyaan Analisis & Diskusi:</p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                {plan.lkpd.pertanyaanDiskusi.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ===================== LAMPIRAN 3: KISI-KISI ===================== */}
        {plan.styling.lampiran.kisiKisi && plan.kisiKisi.length > 0 && (
          <div className="border-t-2 border-dashed border-slate-300 pt-10 mt-10 print:border-none print:pt-0 print:page-break-before-always space-y-4">
            <div className="text-center pb-2 border-b border-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lampiran 3</span>
              <h2 className="text-base font-black text-slate-900">KISI-KISI SOAL ASESMEN SUMATIF</h2>
            </div>
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 text-slate-900">
                  <th className="border border-slate-400 p-2">No</th>
                  <th className="border border-slate-400 p-2">Materi Pokok</th>
                  <th className="border border-slate-400 p-2">Indikator Soal</th>
                  <th className="border border-slate-400 p-2">Level</th>
                  <th className="border border-slate-400 p-2">Bentuk</th>
                  <th className="border border-slate-400 p-2">No Soal</th>
                </tr>
              </thead>
              <tbody>
                {plan.kisiKisi.map((k) => (
                  <tr key={k.no} className="border border-slate-400">
                    <td className="border border-slate-400 p-2 text-center">{k.no}</td>
                    <td className="border border-slate-400 p-2">{k.materi}</td>
                    <td className="border border-slate-400 p-2">{k.indikator}</td>
                    <td className="border border-slate-400 p-2 text-center font-semibold">{k.levelKognitif}</td>
                    <td className="border border-slate-400 p-2 text-center">{k.bentukSoal}</td>
                    <td className="border border-slate-400 p-2 text-center font-bold">{k.noSoal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===================== LAMPIRAN 4: BANK SOAL ===================== */}
        {plan.styling.lampiran.soal && plan.bankSoal.length > 0 && (
          <div className="border-t-2 border-dashed border-slate-300 pt-10 mt-10 print:border-none print:pt-0 print:page-break-before-always space-y-4">
            <div className="text-center pb-2 border-b border-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lampiran 4</span>
              <h2 className="text-base font-black text-slate-900">SOAL ASESMEN BERBASIS STIMULUS & HOTS</h2>
            </div>
            <div className="space-y-4 text-xs">
              {plan.bankSoal.map((q) => (
                <div key={q.id} className="p-3 border border-slate-300 rounded-lg">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Soal No. {q.no} ({q.tipe})</span>
                    <span className="text-blue-700 text-[11px]">Level: {q.levelKognitif} | Skor: {q.skorMaks}</span>
                  </div>
                  {q.stimulus && (
                    <p className="italic text-slate-600 bg-slate-50 p-2 rounded mb-2 border border-slate-200">
                      <strong>Stimulus:</strong> {q.stimulus}
                    </p>
                  )}
                  <p className="text-slate-900 font-medium mb-2">{q.pertanyaan}</p>
                  {q.pilihanJawaban && (
                    <div className="space-y-1 pl-2">
                      {q.pilihanJawaban.map((opt, oIdx) => (
                        <div key={oIdx} className="text-slate-700">{opt}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== LAMPIRAN 5: KUNCI JAWABAN ===================== */}
        {plan.styling.lampiran.kunciJawaban && (
          <div className="border-t-2 border-dashed border-slate-300 pt-10 mt-10 print:border-none print:pt-0 print:page-break-before-always space-y-4">
            <div className="text-center pb-2 border-b border-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lampiran 5</span>
              <h2 className="text-base font-black text-slate-900">KUNCI JAWABAN & PEDOMAN PENSKORAN</h2>
            </div>
            <div className="space-y-2 text-xs">
              {plan.bankSoal.map((q) => (
                <div key={q.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <p className="font-bold text-slate-900">No. {q.no}: Kunci = <span className="text-emerald-700">{q.kunciJawaban}</span> (Skor Maks: {q.skorMaks})</p>
                  {q.pembahasan && (
                    <p className="text-slate-600 italic text-[11px] mt-0.5">Pembahasan: {q.pembahasan}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== LAMPIRAN 6: RUBRIK PENILAIAN ===================== */}
        {plan.styling.lampiran.rubrik && plan.rubrik.length > 0 && (
          <div className="border-t-2 border-dashed border-slate-300 pt-10 mt-10 print:border-none print:pt-0 print:page-break-before-always space-y-4">
            <div className="text-center pb-2 border-b border-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Lampiran 6</span>
              <h2 className="text-base font-black text-slate-900">RUBRIK PENILAIAN PROSES (SKALA 1 - 4)</h2>
            </div>
            <table className="w-full text-xs border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-100 text-slate-900">
                  <th className="border border-slate-400 p-2">Aspek Penilaian</th>
                  <th className="border border-slate-400 p-2">Sangat Baik (4)</th>
                  <th className="border border-slate-400 p-2">Baik (3)</th>
                  <th className="border border-slate-400 p-2">Cukup (2)</th>
                  <th className="border border-slate-400 p-2">Perlu Bimbingan (1)</th>
                </tr>
              </thead>
              <tbody>
                {plan.rubrik.map((r, i) => (
                  <tr key={i} className="border border-slate-400">
                    <td className="border border-slate-400 p-2 font-bold">{r.aspek}</td>
                    <td className="border border-slate-400 p-2">{r.skor4}</td>
                    <td className="border border-slate-400 p-2">{r.skor3}</td>
                    <td className="border border-slate-400 p-2">{r.skor2}</td>
                    <td className="border border-slate-400 p-2">{r.skor1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
