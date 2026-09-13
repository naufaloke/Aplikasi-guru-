import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  Sliders,
  FileText,
  Palette,
  Printer,
  FileCheck,
  Building,
  User,
  Clock,
  BookOpen,
} from "lucide-react";
import { StorageService } from "../../services/storage";
import { AIModuleGenerator, defaultStylingConfig } from "../../services/aiModuleGenerator";
import {
  CompleteModulePlan,
  FormatDokumenType,
  GayaDokumen,
  UkuranKertas,
  OrientasiKertas,
  JenisMargin,
  JenisFont,
  CoverStyle,
  HeaderFooterStyle,
  ModuleIdentity,
  ModuleKarakter,
  ModuleStylingConfig,
} from "../../types/modulePlan";
import {
  SD_CLASSES,
  SD_MAIN_SUBJECTS,
} from "../../constants/curriculumSD";

interface ModuleWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (plan: CompleteModulePlan) => void;
}

export const ModuleWizardModal: React.FC<ModuleWizardModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const school = StorageService.getSchool();
  const user = StorageService.getUser();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // STEP 1 - IDENTITAS
  const [identity, setIdentity] = useState<ModuleIdentity>({
    namaSekolah: school.name || "SD Negeri 3 Banjar Ratu",
    npsn: school.npsn || "10803452",
    namaGuru: user.name || "Budi Santoso, S.Pd., Gr.",
    nip: user.nip || "198807142014021003",
    jenjang: "SD/MI",
    kelas: "Kelas 4",
    fase: "B",
    semester: "1 (Ganjil)",
    tahunAjaran: school.academicYear || "2024/2025",
    mataPelajaran: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    materiPokok: "Bagian Tubuh Tumbuhan dan Fungsinya",
    submateri: "Morfologi Bagian Tumbuhan & Fotosintesis",
    alokasiWaktu: "2 JP (2 x 35 Menit)",
    namaKepsek: school.principal || "Drs. H. Mulyono, M.Pd.",
    nipKepsek: school.nipPrincipal || "196805121992031004",
  });

  // STEP 2 - KARAKTER PEMBELAJARAN
  const [karakter, setKarakter] = useState<ModuleKarakter>({
    model: "Problem Based Learning (PBL)",
    pendekatan: "Pembelajaran Mendalam (Deep Learning)",
    tingkatKedalaman: "Lengkap",
  });

  // STEP 3 - FORMAT DOKUMEN
  const [formatDokumen, setFormatDokumen] = useState<FormatDokumenType>("lengkap");

  // STEP 4 - GAYA DOKUMEN
  const [gayaDokumen, setGayaDokumen] = useState<GayaDokumen>("Formal Administratif");

  // STEP 5 - TATA LETAK & KERTAS
  const [ukuranKertas, setUkuranKertas] = useState<UkuranKertas>("A4");
  const [orientasi, setOrientasi] = useState<OrientasiKertas>("Otomatis");
  const [margin, setMargin] = useState<JenisMargin>("Normal");
  const [fontFamily, setFontFamily] = useState<JenisFont>("Arial");
  const [fontSize, setFontSize] = useState<number>(11);

  // STEP 6 - COVER, HEADER/FOOTER, LAMPIRAN & SOAL
  const [coverStyle, setCoverStyle] = useState<CoverStyle>("formal");
  const [headerFooterStyle, setHeaderFooterStyle] = useState<HeaderFooterStyle>("sekolah-modul");
  const [lampiran, setLampiran] = useState(defaultStylingConfig.lampiran);
  const [soalConfig, setSoalConfig] = useState(defaultStylingConfig.soalConfig);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const fullStyling: ModuleStylingConfig = {
        formatDokumen,
        gayaDokumen,
        ukuranKertas,
        orientasi,
        margin,
        customMargin: { top: 25, bottom: 25, left: 30, right: 20 },
        fontFamily,
        fontSize,
        coverStyle,
        headerFooterStyle,
        lampiran,
        soalConfig,
      };

      const generated = await AIModuleGenerator.generateCompletePlan(identity, karakter, fullStyling);
      onGenerated(generated);
      onClose();
    } catch (err) {
      console.error("Wizard generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatsList: { id: FormatDokumenType; title: string; desc: string }[] = [
    {
      id: "lengkap",
      title: "Format 1 – Modul Ajar Lengkap (Resmi)",
      desc: "Memuat 27+ komponen penuh: Cover, CP, ATP, TP, Pemahaman Bermakna, LKPD, Asesmen, Bank Soal, Rubrik, dan Remedial/Pengayaan.",
    },
    {
      id: "ringkas",
      title: "Format 2 – Modul Ajar Ringkas",
      desc: "Komponen inti terfokus untuk pelaksanaan praktis harian dan supervisi cepat.",
    },
    {
      id: "deep-learning",
      title: "Format 3 – Pembelajaran Mendalam",
      desc: "Menekankan 3 pilar: Berkesadaran (Mindful), Bermakna (Meaningful), dan Menggembirakan (Joyful).",
    },
    {
      id: "diferensiasi",
      title: "Format 4 – Berdiferensiasi",
      desc: "Dirancang berdasarkan kesiapan belajar, minat, serta pemetaan profil belajar siswa.",
    },
    {
      id: "pbl",
      title: "Format 5 – Problem Based Learning (PBL)",
      desc: "Menggunakan 5 sintaks penyelidikan masalah nyata dan penarikan kesimpulan ilmiah.",
    },
    {
      id: "pjbl",
      title: "Format 6 – Project Based Learning (PjBL)",
      desc: "Berorientasi produk dan tahapan proyek kolaboratif bermakna.",
    },
    {
      id: "inquiry",
      title: "Format 7 – Inquiry Learning",
      desc: "Menekankan penemuan konsep secara mandiri lewat pembuktian eksperimen.",
    },
    {
      id: "tpack",
      title: "Format 8 – TPACK Digital",
      desc: "Mengintegrasikan muatan teknologi digital, pedagogi, dan konten materi.",
    },
  ];

  const gayaList: { id: GayaDokumen; title: string; desc: string }[] = [
    { id: "Formal Administratif", title: "Formal Administratif", desc: "Resmi, sederhana, dan memenuhi seluruh standar inspeksi dinas pendidikan." },
    { id: "Profesional Modern", title: "Profesional Modern", desc: "Tampilan modern, elegan, dengan hierarki tipografi kontras tinggi." },
    { id: "Minimalis", title: "Minimalis", desc: "Bersih, ringkas, dan hemat halaman tanpa mengurangi substansi." },
    { id: "Akademik", title: "Akademik", desc: "Sangat sistematis dan terperinci untuk dokumentasi portofolio sertifikasi guru." },
    { id: "Ramah Guru", title: "Ramah Guru", desc: "Sangat mudah dibaca, praktis digunakan langsung saat mengajar di kelas." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Wizard Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Wizard Pembuatan Modul Ajar Terintegrasi</h2>
              <p className="text-xs text-blue-100">Langkah {step} dari {totalSteps} – Konfigurasi Terarah & Siap Cetak</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Identitas" },
              { num: 2, label: "Karakter" },
              { num: 3, label: "Format" },
              { num: 4, label: "Gaya" },
              { num: 5, label: "Tata Letak" },
              { num: 6, label: "Cover & Lampiran" },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-1.5 cursor-pointer text-xs font-semibold transition-all ${
                  step === s.num
                    ? "text-blue-700 font-bold"
                    : step > s.num
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === s.num
                      ? "bg-blue-600 text-white shadow-sm"
                      : step > s.num
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </span>
                <span className="hidden md:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body per Step */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1 - IDENTITAS */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Building className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">STEP 1 – IDENTITAS MODUL & SATUAN PENDIDIKAN</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Sekolah</label>
                  <input
                    type="text"
                    value={identity.namaSekolah}
                    onChange={(e) => setIdentity({ ...identity, namaSekolah: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">NPSN</label>
                  <input
                    type="text"
                    value={identity.npsn}
                    onChange={(e) => setIdentity({ ...identity, npsn: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Guru Penyusun</label>
                  <input
                    type="text"
                    value={identity.namaGuru}
                    onChange={(e) => setIdentity({ ...identity, namaGuru: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">NIP / NUPTK</label>
                  <input
                    type="text"
                    value={identity.nip}
                    onChange={(e) => setIdentity({ ...identity, nip: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Jenjang</label>
                  <select
                    value={identity.jenjang}
                    onChange={(e) => setIdentity({ ...identity, jenjang: e.target.value as any })}
                    className="w-full text-sm px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="PAUD">PAUD</option>
                    <option value="SD/MI">SD/MI</option>
                    <option value="SMP/MTs">SMP/MTs</option>
                    <option value="SMA/MA">SMA/MA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Fase</label>
                  <select
                    value={identity.fase}
                    onChange={(e) => setIdentity({ ...identity, fase: e.target.value as any })}
                    className="w-full text-sm px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-blue-700 bg-blue-50/50"
                  >
                    <option value="A">Fase A (Kelas 1-2)</option>
                    <option value="B">Fase B (Kelas 3-4)</option>
                    <option value="C">Fase C (Kelas 5-6)</option>
                    <option value="D">Fase D (Kelas 7-9)</option>
                    <option value="E">Fase E (Kelas 10)</option>
                    <option value="F">Fase F (Kelas 11-12)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Kelas (Pilih SD/MI 1-6)</label>
                  <select
                    value={identity.kelas}
                    onChange={(e) => {
                      const val = e.target.value;
                      let f: any = identity.fase;
                      if (val.includes("I –") || val.includes("II –") || val.includes("1") || val.includes("2")) f = "A";
                      else if (val.includes("III –") || val.includes("IV –") || val.includes("3") || val.includes("4")) f = "B";
                      else if (val.includes("V –") || val.includes("VI –") || val.includes("5") || val.includes("6")) f = "C";
                      setIdentity({ ...identity, kelas: val, fase: f });
                    }}
                    className="w-full text-sm px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                  >
                    {SD_CLASSES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={identity.semester}
                    onChange={(e) => setIdentity({ ...identity, semester: e.target.value as any })}
                    className="w-full text-sm px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="1 (Ganjil)">1 (Ganjil)</option>
                    <option value="2 (Genap)">2 (Genap)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mata Pelajaran Utama SD</label>
                  <select
                    value={identity.mataPelajaran}
                    onChange={(e) => setIdentity({ ...identity, mataPelajaran: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 mb-1.5"
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
                  <input
                    type="text"
                    value={identity.mataPelajaran}
                    onChange={(e) => setIdentity({ ...identity, mataPelajaran: e.target.value })}
                    placeholder="Atau ketik nama mapel kustom..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-slate-50 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Alokasi Waktu</label>
                  <input
                    type="text"
                    value={identity.alokasiWaktu}
                    onChange={(e) => setIdentity({ ...identity, alokasiWaktu: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Materi / Topik Pokok</label>
                  <input
                    type="text"
                    value={identity.materiPokok}
                    onChange={(e) => setIdentity({ ...identity, materiPokok: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Submateri</label>
                  <input
                    type="text"
                    value={identity.submateri}
                    onChange={(e) => setIdentity({ ...identity, submateri: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 - KARAKTER PEMBELAJARAN */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">STEP 2 – KARAKTER & MODEL PEMBELAJARAN</h3>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Pilihan Model Pembelajaran</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { val: "Problem Based Learning (PBL)", label: "Problem Based Learning (PBL)", desc: "Sintaks penyelidikan masalah nyata & investigasi kelompok." },
                    { val: "Project Based Learning (PjBL)", label: "Project Based Learning (PjBL)", desc: "Tahapan perancangan proyek dan produk karya nyata." },
                    { val: "Discovery Learning", label: "Discovery Learning", desc: "Stimulasi, identifikasi masalah, dan pembuktian konsep mandiri." },
                    { val: "Inquiry Learning", label: "Inquiry Learning", desc: "Pengamatan, merumuskan hipotesis, dan eksperimen ilmiah." },
                    { val: "Cooperative Learning", label: "Cooperative Learning", desc: "Struktur kerja sama tim gotong royong terencana." },
                    { val: "Direct Instruction", label: "Direct Instruction", desc: "Demonstrasi bertahap dan latihan terbimbing terarah." },
                    { val: "Contextual Teaching and Learning (CTL)", label: "Contextual Teaching & Learning (CTL)", desc: "Mengaitkan materi langsung dengan kehidupan sehari-hari." },
                    { val: "Pembelajaran Berdiferensiasi", label: "Pembelajaran Berdiferensiasi", desc: "Menyesuaikan kesiapan, minat, dan profil gaya belajar murid." },
                  ].map((m) => (
                    <div
                      key={m.val}
                      onClick={() => setKarakter({ ...karakter, model: m.val as any })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        karakter.model === m.val
                          ? "border-blue-600 bg-blue-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{m.label}</span>
                        {karakter.model === m.val && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pendekatan Pembelajaran</label>
                  <select
                    value={karakter.pendekatan}
                    onChange={(e) => setKarakter({ ...karakter, pendekatan: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Pembelajaran Mendalam (Deep Learning)">Pembelajaran Mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan)</option>
                    <option value="Saintifik">Saintifik (5M: Mengamati, Menanya, Mengumpulkan, Mengasosiasi, Mengomunikasikan)</option>
                    <option value="Kontekstual">Kontekstual (Kearifan Lingkungan Lokal)</option>
                    <option value="TPACK">TPACK (Technological Pedagogical Content Knowledge)</option>
                    <option value="Diferensiasi">Diferensiasi (Konten, Proses, Produk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tingkat Kedalaman Dokumen</label>
                  <select
                    value={karakter.tingkatKedalaman}
                    onChange={(e) => setKarakter({ ...karakter, tingkatKedalaman: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Ringkas">Ringkas (Fokus Inti)</option>
                    <option value="Sedang">Sedang (Standar Praktis)</option>
                    <option value="Lengkap">Lengkap (Rekomendasi Dinas & Pengawas)</option>
                    <option value="Sangat Lengkap">Sangat Lengkap (Portofolio Guru Penggerak)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 - PILIHAN FORMAT DOKUMEN */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">STEP 3 – PILIHAN FORMAT STRUKTUR DOKUMEN</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formatsList.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setFormatDokumen(f.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formatDokumen === f.id
                        ? "border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{f.title}</span>
                      {formatDokumen === f.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 - GAYA DOKUMEN */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Palette className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">STEP 4 – PILIHAN GAYA DOKUMEN</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gayaList.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setGayaDokumen(g.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      gayaDokumen === g.id
                        ? "border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{g.title}</span>
                      {gayaDokumen === g.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <p className="text-[11px] text-slate-600">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 - PILIHAN KERTAS & TATA LETAK */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Printer className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">STEP 5 – UKURAN KERTAS, ORIENTASI, MARGIN & FONT</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ukuran Kertas</label>
                  <select
                    value={ukuranKertas}
                    onChange={(e) => setUkuranKertas(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="A4">A4 (210 x 297 mm) - Standar Default</option>
                    <option value="F4/Folio">F4 / Folio (215 x 330 mm)</option>
                    <option value="Letter">Letter (8.5 x 11 in)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Orientasi</label>
                  <select
                    value={orientasi}
                    onChange={(e) => setOrientasi(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Portrait">Portrait (Tegak)</option>
                    <option value="Landscape">Landscape (Mendatar)</option>
                    <option value="Otomatis">Otomatis (Portrait untuk Narasi, Landscape untuk Tabel Lebar)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Margin Dokumen</label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Normal">Normal (Atas 2.5cm, Kiri 3cm, Kanan 2cm, Bawah 2.5cm)</option>
                    <option value="Sempit">Sempit (1.5 cm di semua sisi)</option>
                    <option value="Lebar">Lebar (3 cm di semua sisi)</option>
                    <option value="Custom">Custom Margin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pilihan Tipografi Font</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option value="Arial">Arial (Standar Jelas & Rapi)</option>
                    <option value="Calibri">Calibri (Modern Soft)</option>
                    <option value="Times New Roman">Times New Roman (Klasik Akademik)</option>
                    <option value="Aptos">Aptos (Keluarga Microsoft Modern)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ukuran Font Body Teks</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={10}>10 pt (Padat)</option>
                    <option value={11}>11 pt (Default Standar Resmi)</option>
                    <option value={12}>12 pt (Lebih Besar & Nyaman Dibaca)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 - COVER, HEADER/FOOTER, LAMPIRAN & SOAL */}
          {step === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">STEP 6 – COVER, HEADER/FOOTER, LAMPIRAN & SOAL</h3>
              </div>

              {/* Cover & Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Desain Cover Dokumen</label>
                  <select
                    value={coverStyle}
                    onChange={(e) => setCoverStyle(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="formal">Formal (KOP Dinas & Judul Tengah)</option>
                    <option value="modern">Modern (Aksen Bar Vertikal Biru & Elegan)</option>
                    <option value="minimalis">Minimalis (Header Cover Ringkas)</option>
                    <option value="sekolah">Khas Sekolah (Logo Besar & Teks Khusus)</option>
                    <option value="none">Tanpa Cover (Langsung Identitas Bab 1)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Format Header & Footer</label>
                  <select
                    value={headerFooterStyle}
                    onChange={(e) => setHeaderFooterStyle(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="sekolah-modul">Nama Sekolah | Modul Ajar | Mata Pelajaran</option>
                    <option value="guru-mapel-kelas">Nama Guru | Mata Pelajaran | Kelas</option>
                    <option value="sekolah-tahun">Nama Sekolah | Tahun Ajaran</option>
                    <option value="none">Tanpa Header</option>
                  </select>
                </div>
              </div>

              {/* Lampiran Checklist */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Daftar Lampiran yang Disertakan (Checklist):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries({
                    bahanAjar: "Lampiran 1: Bahan Ajar",
                    lkpd: "Lampiran 2: LKPD Interaktif",
                    kisiKisi: "Lampiran 3: Kisi-Kisi Soal",
                    soal: "Lampiran 4: Bank Soal (HOTS)",
                    kunciJawaban: "Lampiran 5: Kunci & Pedoman",
                    rubrik: "Lampiran 6: Rubrik 4-3-2-1",
                    instrumenObservasi: "Instrumen Observasi Sikap",
                    remedial: "Program Remedial",
                    pengayaan: "Program Pengayaan",
                    refleksiPesertaDidik: "Refleksi Peserta Didik",
                    refleksiGuru: "Refleksi Guru",
                  }).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(lampiran as any)[key]}
                        onChange={(e) => setLampiran({ ...lampiran, [key]: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-slate-700 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Soal Distribution */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Konfigurasi Soal Asesmen (Jumlah Butir):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-600 block mb-1">Pilihan Ganda (PG)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={soalConfig.pgCount}
                      onChange={(e) => setSoalConfig({ ...soalConfig, pgCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Isian Singkat</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={soalConfig.isianCount}
                      onChange={(e) => setSoalConfig({ ...soalConfig, isianCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Uraian Reflektif</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={soalConfig.uraianCount}
                      onChange={(e) => setSoalConfig({ ...soalConfig, uraianCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Praktik / Proyek</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={soalConfig.praktikCount}
                      onChange={(e) => setSoalConfig({ ...soalConfig, praktikCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            type="button"
            disabled={step === 1 || loading}
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <div className="flex items-center gap-3">
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Langkah Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghasilkan 23 Komponen...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Modul Ajar Lengkap</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
