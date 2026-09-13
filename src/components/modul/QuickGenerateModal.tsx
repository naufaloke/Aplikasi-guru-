import React, { useState } from "react";
import { Zap, X, Sparkles, Clock, BookOpen, Layers, School } from "lucide-react";
import { StorageService } from "../../services/storage";
import { AIModuleGenerator, defaultStylingConfig } from "../../services/aiModuleGenerator";
import { CompleteModulePlan } from "../../types/modulePlan";
import {
  SD_CLASSES,
  SD_MAIN_SUBJECTS,
  SENI_SUB_OPTIONS,
  MULOK_DEFAULT_OPTIONS,
} from "../../constants/curriculumSD";

interface QuickGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (plan: CompleteModulePlan) => void;
}

export const QuickGenerateModal: React.FC<QuickGenerateModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const school = StorageService.getSchool();
  const user = StorageService.getUser();

  const [kelas, setKelas] = useState("Kelas 4");
  const [fase, setFase] = useState<"A" | "B" | "C" | "D" | "E" | "F">("B");
  const [mapel, setMapel] = useState("IPAS (Ilmu Pengetahuan Alam & Sosial)");
  const [topik, setTopik] = useState("Bagian Tubuh Tumbuhan dan Fungsinya");
  const [submateri, setSubmateri] = useState("Akar, Batang, Daun, dan Fotosintesis");
  const [alokasiWaktu, setAlokasiWaktu] = useState("2 JP (2 x 35 Menit)");
  const [model, setModel] = useState<any>("Problem Based Learning (PBL)");
  const [pendekatan, setPendekatan] = useState<any>("Pembelajaran Mendalam (Deep Learning)");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPresets = [
    {
      k: "Kelas 4",
      f: "B" as const,
      m: "IPAS",
      t: "Bagian Tubuh Tumbuhan dan Fungsinya",
      s: "Morfologi & Fotosintesis",
    },
    {
      k: "Kelas 4",
      f: "B" as const,
      m: "Matematika",
      t: "Pecahan Senilai dan Operasi Hitung",
      s: "Visualisasi Blok Pecahan Konkret",
    },
    {
      k: "Kelas 4",
      f: "B" as const,
      m: "Bahasa Indonesia",
      t: "Menulis Teks Deskripsi Lingkungan Sekitar",
      s: "Paragraf Runtut & Kosakata Baku",
    },
    {
      k: "Kelas 5",
      f: "C" as const,
      m: "IPAS",
      t: "Rantai Makanan dan Ekosistem Sawah",
      s: "Produsen, Konsumen, dan Pengurai",
    },
    {
      k: "Kelas 1",
      f: "A" as const,
      m: "Pendidikan Pancasila",
      t: "Aku dan Teman-temanku yang Beragam",
      s: "Saling Menghargai Perbedaan Fisik & Asal",
    },
  ];

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topik.trim()) return;

    setLoading(true);
    try {
      const plan = await AIModuleGenerator.generateCompletePlan(
        {
          namaSekolah: school.name || "SD Negeri 3 Banjar Ratu",
          npsn: school.npsn || "10803452",
          namaGuru: user.name || "Budi Santoso, S.Pd., Gr.",
          nip: user.nip || "198807142014021003",
          jenjang: "SD/MI",
          kelas,
          fase,
          semester: "1 (Ganjil)",
          tahunAjaran: school.academicYear || "2024/2025",
          mataPelajaran: mapel,
          materiPokok: topik,
          submateri: submateri || topik,
          alokasiWaktu,
          namaKepsek: school.principal || "Drs. H. Mulyono, M.Pd.",
          nipKepsek: school.nipPrincipal || "196805121992031004",
        },
        {
          model,
          pendekatan,
          tingkatKedalaman: "Lengkap",
        },
        defaultStylingConfig
      );

      onGenerated(plan);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">⚡ Mode Cepat: Buat Modul Ajar Otomatis</h2>
              <p className="text-xs text-blue-100">
                AI menyusun 23 komponen terintegrasi (CP, ATP, TP, Modul, LKPD, Soal, Rubrik) dalam sekejap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleQuickSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pilihan Cepat Materi Favorit:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setKelas(p.k);
                    setFase(p.f);
                    setMapel(p.m);
                    setTopik(p.t);
                    setSubmateri(p.s);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium transition-all"
                >
                  {p.m} ({p.k}) - {p.t.split(" ")[0]}...
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Pilihan Kelas SD/MI (Kelas 1 - 6)
              </label>
              <select
                value={kelas}
                onChange={(e) => {
                  setKelas(e.target.value);
                  if (e.target.value.includes("I –") || e.target.value.includes("II –") || e.target.value.includes("1") || e.target.value.includes("2")) setFase("A");
                  else if (e.target.value.includes("III –") || e.target.value.includes("IV –") || e.target.value.includes("3") || e.target.value.includes("4")) setFase("B");
                  else setFase("C");
                }}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
              >
                {SD_CLASSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Mata Pelajaran Utama SD
              </label>
              <select
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
              >
                {SD_MAIN_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.number}. {s.name}
                  </option>
                ))}
                <optgroup label="Seni dan Budaya (Cabang Seni)">
                  <option value="Seni dan Budaya (Seni Rupa)">7a. Seni Rupa</option>
                  <option value="Seni dan Budaya (Seni Musik)">7b. Seni Musik</option>
                  <option value="Seni dan Budaya (Seni Tari)">7c. Seni Tari</option>
                  <option value="Seni dan Budaya (Seni Teater)">7d. Seni Teater</option>
                </optgroup>
                <optgroup label="Muatan Lokal">
                  <option value="Muatan Lokal (Bahasa Daerah)">9a. Bahasa Daerah</option>
                  <option value="Muatan Lokal (Bahasa Lampung)">9b. Bahasa Lampung</option>
                  <option value="Muatan Lokal (Lainnya)">9c. Muatan Lokal lainnya</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Materi Pokok / Bab
            </label>
            <input
              type="text"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Bagian Tubuh Tumbuhan, Pecahan Senilai, Gaya Magnet..."
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Submateri / Fokus Bahasan</label>
              <input
                type="text"
                value={submateri}
                onChange={(e) => setSubmateri(e.target.value)}
                placeholder="Contoh: Akar, Batang, Daun, dan Fotosintesis"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Alokasi Waktu
              </label>
              <input
                type="text"
                value={alokasiWaktu}
                onChange={(e) => setAlokasiWaktu(e.target.value)}
                placeholder="Contoh: 2 JP (2 x 35 Menit)"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Model Pembelajaran</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                <option value="Discovery Learning">Discovery Learning</option>
                <option value="Inquiry Learning">Inquiry Learning</option>
                <option value="Cooperative Learning">Cooperative Learning</option>
                <option value="Direct Instruction">Direct Instruction</option>
                <option value="Contextual Teaching and Learning (CTL)">Contextual Teaching & Learning</option>
                <option value="Pembelajaran Berdiferensiasi">Pembelajaran Berdiferensiasi</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Pendekatan Utama</label>
              <select
                value={pendekatan}
                onChange={(e) => setPendekatan(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Pembelajaran Mendalam (Deep Learning)">Pembelajaran Mendalam (Deep Learning)</option>
                <option value="Saintifik">Saintifik (5M)</option>
                <option value="Kontekstual">Kontekstual Lingkungan Sekitar</option>
                <option value="TPACK">TPACK (Teknologi & Pedagogi)</option>
                <option value="Diferensiasi">Diferensiasi Konten, Proses, Produk</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              Sekolah: <strong>{school.name}</strong> | Guru: <strong>{user.name}</strong>
            </span>
            <span className="text-blue-700 font-semibold">T.A. {school.academicYear}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !topik.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI Menyusun Perangkat...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Buat Modul Ajar Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
