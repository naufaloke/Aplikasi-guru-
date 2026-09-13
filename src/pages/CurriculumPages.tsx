import { useState } from "react";
import {
  BookOpen,
  Target,
  GitCommit,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Layers,
} from "lucide-react";
import { AIService } from "../services/ai";
import { ExportService } from "../services/pdf";

// 1. Kurikulum & KSP
export const KurikulumPage = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Kurikulum Satuan Pendidikan (KSP)</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Struktur Kurikulum Merdeka & Pembelajaran Mendalam
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          SD Negeri 3 Banjar Ratu mengadopsi 3 pilar Pembelajaran Mendalam: Berkesadaran (Mindful), Bermakna (Meaningful), dan Menggembirakan (Joyful).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-3xl space-y-2 border border-blue-200">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="font-bold text-sm text-slate-800">Berkesadaran (Mindful)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mendorong siswa hadir utuh secara kognitif dan emosional, membangun kesadaran diri, fokus, dan refleksi terhadap lingkungan sekitar.
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-2 border border-emerald-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="font-bold text-sm text-slate-800">Bermakna (Meaningful)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Materi pembelajaran dikaitkan langsung dengan kehidupan nyata, konteks pertanian/perkebunan Lampung, dan problem-solving autentik.
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-2 border border-purple-200">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="font-bold text-sm text-slate-800">Menggembirakan (Joyful)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Metode belajar melalui eksplorasi, eksperimen sains seru, gamifikasi, dan proyek kolaboratif tanpa tekanan berlebihan.
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. CP (Capaian Pembelajaran)
export const CPPage = () => {
  const [phase, setPhase] = useState("Fase B (Kelas 3-4 SD)");
  const [subject, setSubject] = useState("IPAS");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase mb-2">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>Standar Kompetensi Kemdikbudristek</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Capaian Pembelajaran (CP) Resmi
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Daftar CP resmi Kurikulum Merdeka yang siap diturunkan ke Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP).
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="Fase A (Kelas 1-2 SD)">Fase A (Kelas 1-2 SD)</option>
            <option value="Fase B (Kelas 3-4 SD)">Fase B (Kelas 3-4 SD)</option>
            <option value="Fase C (Kelas 5-6 SD)">Fase C (Kelas 5-6 SD)</option>
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="IPAS">IPAS</option>
            <option value="Matematika">Matematika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Pancasila">Pendidikan Pancasila</option>
          </select>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200">
        <h3 className="font-bold text-sm text-slate-800">Elemen Pemahaman IPAS (Sains & Sosial)</h3>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          Pada akhir Fase B, peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia (pancaindra) dan tumbuhan. Peserta didik dapat membuat simulasi menggunakan bagan/alat bantu sederhana tentang siklus hidup makhluk hidup. Peserta didik mengidentifikasi masalah yang berkaitan dengan pelestarian sumber daya alam di lingkungan sekitarnya dan kaitannya dengan upaya pelestarian makhluk hidup.
        </p>
      </div>
    </div>
  );
};

// 3. ATP (Alur Tujuan Pembelajaran)
export const ATPPage = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
          <GitCommit className="w-3.5 h-3.5 text-blue-600" />
          <span>Alur Tujuan Pembelajaran</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          ATP Kelas 4 SD Semester 1 & 2
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Urutan logis pencapaian kompetensi per minggu, alokasi JP, materi esensial, dan bentuk asesmen terintegrasi.
        </p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 font-bold">
            <tr>
              <th className="p-3">Minggu Ke-</th>
              <th className="p-3">Tujuan Pembelajaran (TP)</th>
              <th className="p-3">Materi Pokok</th>
              <th className="p-3">Alokasi Waktu</th>
              <th className="p-3">Asesmen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-3 font-mono">Minggu 1-2</td>
              <td className="p-3 font-semibold">4.1 Menganalisis bagian tubuh tumbuhan dan fungsinya</td>
              <td className="p-3">Akar, Batang, Daun & Xilem</td>
              <td className="p-3">4 JP</td>
              <td className="p-3">Observasi LKPD</td>
            </tr>
            <tr>
              <td className="p-3 font-mono">Minggu 3-4</td>
              <td className="p-3 font-semibold">4.2 Mengidentifikasi proses fotosintesis dan zat yang dihasilkan</td>
              <td className="p-3">Fotosintesis & Klorofil</td>
              <td className="p-3">4 JP</td>
              <td className="p-3">Tes Formatif & Diagram</td>
            </tr>
            <tr>
              <td className="p-3 font-mono">Minggu 5-6</td>
              <td className="p-3 font-semibold">4.3 Mengamati siklus hidup serangga dan metamorfosis</td>
              <td className="p-3">Metamorfosis Kupu-kupu & Katak</td>
              <td className="p-3">4 JP</td>
              <td className="p-3">Proyek Mini Poster</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 4. RPP Otomatis
export const RPPOtomatisPage = () => {
  const [topic, setTopic] = useState("IPAS Kelas 4 Bagian Tubuh Tumbuhan");
  const [rppContent, setRppContent] = useState<string>(`# RENCANA PELAKSANAAN PEMBELAJARAN (RPP) BERKESADARAN
**Sekolah:** SD Negeri 3 Banjar Ratu  
**Kelas / Semester:** 4A / 1 (Ganjil)  
**Mata Pelajaran:** IPAS  
**Alokasi Waktu:** 2 x 35 Menit (1 Pertemuan)  

---

### I. Tujuan Pembelajaran
Melalui pengamatan langsung tanaman di halaman sekolah, peserta didik mampu mengidentifikasi 4 bagian utama tumbuhan dan fungsinya dengan benar serta menunjukkan sikap peduli lingkungan.

### II. Langkah-Langkah Pembelajaran
1. **Kegiatan Awal (10 Menit) - Berkesadaran:**
   - Guru membuka dengan salam ceria dan ice breaking tepuk semangat.
   - Apersepsi: Menampilkan tanaman pot layu dan bertanya: *"Mengapa tanaman ini membutuhkan air dan sinar matahari?"*
2. **Kegiatan Inti (50 Menit) - Bermakna & Menggembirakan:**
   - Peserta didik dibagi menjadi 4 kelompok detektif sains.
   - Kelompok mengamati tanaman di taman sekolah menggunakan kaca pembesar dan mengisi lembar LKPD.
   - Perwakilan kelompok mempresentasikan bagian tanaman temuannya.
3. **Kegiatan Penutup (10 Menit) - Refleksi:**
   - Guru dan siswa menyimpulkan materi bersama.
   - Siswa melakukan refleksi 3-2-1: 3 hal baru yang dipelajari, 2 hal menarik, dan 1 pertanyaan yang masih membuat penasaran.
   - Doa penutup.

### III. Asesmen Pembelajaran
- Sikap: Observasi gotong royong dan bernalar kritis saat kerja kelompok.
- Pengetahuan: Kuis lisan 3 pertanyaan cepat di akhir sesi.`);

  const handleExportPDF = () => {
    ExportService.exportTextPDF("RPP KURIKULUM MERDEKA", rppContent, `RPP_${topic.replace(/\s+/g, "_")}.pdf`);
  };

  const handleExportWord = () => {
    ExportService.exportToWord("RPP KURIKULUM MERDEKA", rppContent, `RPP_${topic.replace(/\s+/g, "_")}.doc`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase mb-2">
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Penyusunan RPP 1-Lembar Praktis</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          RPP Otomatis Pembelajaran Mendalam
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          RPP ringkas, berbobot, langsung siap cetak atau diekspor ke format Microsoft Word dan PDF.
        </p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Pratinjau Dokumen RPP</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Word</span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white text-slate-800 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-[550px] overflow-y-auto">
          {rppContent}
        </div>
      </div>
    </div>
  );
};
