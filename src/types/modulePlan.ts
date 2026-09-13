export type JenjangPendidikan = "PAUD" | "SD/MI" | "SMP/MTs" | "SMA/MA" | "SMK";
export type FaseKurikulum = "A" | "B" | "C" | "D" | "E" | "F";
export type ModelPembelajaran =
  | "Problem Based Learning (PBL)"
  | "Project Based Learning (PjBL)"
  | "Discovery Learning"
  | "Inquiry Learning"
  | "Cooperative Learning"
  | "Direct Instruction"
  | "Contextual Teaching and Learning (CTL)"
  | "Pembelajaran Berdiferensiasi"
  | "Model Lainnya";

export type PendekatanPembelajaran =
  | "Pembelajaran Mendalam (Deep Learning)"
  | "Saintifik"
  | "Kontekstual"
  | "TPACK"
  | "Diferensiasi";

export type TingkatKedalaman = "Ringkas" | "Sedang" | "Lengkap" | "Sangat Lengkap";

export type FormatDokumenType =
  | "lengkap" // Format 1 - Modul Ajar Lengkap (27+ komponen)
  | "ringkas" // Format 2 - Ringkas
  | "deep-learning" // Format 3 - Pembelajaran Mendalam
  | "diferensiasi" // Format 4 - Berdiferensiasi
  | "pbl" // Format 5 - PBL
  | "pjbl" // Format 6 - PjBL
  | "inquiry" // Format 7 - Inquiry
  | "tpack"; // Format 8 - TPACK

export type GayaDokumen =
  | "Formal Administratif"
  | "Profesional Modern"
  | "Minimalis"
  | "Akademik"
  | "Ramah Guru";

export type UkuranKertas = "A4" | "F4/Folio" | "Letter";
export type OrientasiKertas = "Portrait" | "Landscape" | "Otomatis";
export type JenisMargin = "Normal" | "Sempit" | "Lebar" | "Custom";
export type JenisFont = "Arial" | "Calibri" | "Times New Roman" | "Aptos";
export type CoverStyle = "formal" | "modern" | "minimalis" | "sekolah" | "none";
export type HeaderFooterStyle =
  | "sekolah-modul" // Nama Sekolah | Modul Ajar | Mata Pelajaran
  | "guru-mapel-kelas" // Nama Guru | Mata Pelajaran | Kelas
  | "sekolah-tahun" // Nama Sekolah | Tahun Ajaran
  | "none"; // Tanpa Header

export interface CustomMargin {
  top: number; // mm
  bottom: number; // mm
  left: number; // mm
  right: number; // mm
}

export interface LampiranSelection {
  bahanAjar: boolean;
  lkpd: boolean;
  kisiKisi: boolean;
  soal: boolean;
  kunciJawaban: boolean;
  rubrik: boolean;
  instrumenObservasi: boolean;
  remedial: boolean;
  pengayaan: boolean;
  refleksiPesertaDidik: boolean;
  refleksiGuru: boolean;
}

export interface SoalDistribution {
  pgCount: number; // 0-50
  isianCount: number; // 0-20
  uraianCount: number; // 0-20
  praktikCount: number; // 0-10
  c1Pct: number;
  c2Pct: number;
  c3Pct: number;
  c4Pct: number;
  c5Pct: number;
  c6Pct: number;
}

export interface ModuleIdentity {
  namaSekolah: string;
  npsn: string;
  namaGuru: string;
  nip: string;
  jenjang: JenjangPendidikan;
  kelas: string;
  fase: FaseKurikulum;
  semester: "1 (Ganjil)" | "2 (Genap)";
  tahunAjaran: string;
  mataPelajaran: string;
  materiPokok: string;
  submateri: string;
  alokasiWaktu: string;
  logoSekolah?: string;
  namaKepsek?: string;
  nipKepsek?: string;
}

export interface ModuleKarakter {
  model: ModelPembelajaran;
  pendekatan: PendekatanPembelajaran;
  tingkatKedalaman: TingkatKedalaman;
}

export interface ModuleStylingConfig {
  formatDokumen: FormatDokumenType;
  gayaDokumen: GayaDokumen;
  ukuranKertas: UkuranKertas;
  orientasi: OrientasiKertas;
  margin: JenisMargin;
  customMargin: CustomMargin;
  fontFamily: JenisFont;
  fontSize: number; // default 11 pt
  coverStyle: CoverStyle;
  headerFooterStyle: HeaderFooterStyle;
  lampiran: LampiranSelection;
  soalConfig: SoalDistribution;
}

// 1 & 2. CP & Analisis CP
export interface AnalisisCPRow {
  no: number;
  elemen: string;
  cp: string;
  kompetensi: string;
  materi: string;
  indikator: string;
}

export interface CPData {
  rumusanCP: string;
  elemen: string;
  kompetensi: string;
  pengetahuan: string;
  keterampilan: string;
  karakter: string;
  analisisTable: AnalisisCPRow[];
}

// 3. ATP
export interface ATPRow {
  no: number;
  tujuanPembelajaran: string;
  materi: string;
  aktivitas: string;
  alokasiWaktu: string;
}

// 4. TP
export interface TPItem {
  id: string;
  kode: string;
  deskripsi: string;
  kko: string;
  levelKognitif: string;
}

// 5. Modul Ajar Core
export interface ModulAjarCore {
  kompetensiAwal: string;
  profilPelajarPancasila: string[];
  saranaPrasarana: string;
  targetPesertaDidik: string;
  modelPembelajaran: string;
  metode: string;
  pendekatan: string;
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  persiapanPembelajaran: string[];
}

// Kegiatan Pembelajaran
export interface KegiatanTahap {
  fase: string;
  aktivitas: string[];
  alokasiWaktu: string;
  deepLearningCatatan?: string;
}

export interface KegiatanPembelajaran {
  pendahuluan: {
    salamDoa: string;
    presensiApersepsi: string;
    motivasiTujuan: string;
    alokasiWaktu: string;
  };
  inti: KegiatanTahap[];
  penutup: {
    kesimpulan: string;
    refleksi: string;
    evaluasiTindakLanjut: string;
    alokasiWaktu: string;
  };
}

// Pembelajaran Mendalam
export interface PembelajaranMendalamData {
  berkesadaran: string; // Mindful
  bermakna: string; // Meaningful
  menggembirakan: string; // Joyful
  aspekOlah: {
    olahPikir: string;
    olahHati: string;
    olahRasa: string;
    olahRaga: string;
  };
}

// Diferensiasi
export interface DiferensiasiData {
  konten: string;
  proses: string;
  produk: string;
  analisisKesiapan: string;
  analisisMinat: string;
  analisisProfilBelajar: string;
}

// Bahan Ajar
export interface BahanAjarData {
  judul: string;
  tujuan: string;
  pengantar: string;
  konsepUtama: string;
  penjelasanMateri: string;
  contohAplikasi: string;
  aktivitasSiswa: string;
  faktaMenarik: string;
  rangkuman: string;
  pertanyaanPemahaman: string[];
}

// LKPD
export interface LKPDData {
  judul: string;
  tujuan: string;
  alatBahan: string[];
  petunjuk: string[];
  langkahKegiatan: string[];
  tabelPengamatan: {
    headers: string[];
    rows: string[][];
  };
  pertanyaanDiskusi: string[];
  kesimpulan: string;
  refleksiSiswa: string;
}

// Asesmen & Bank Soal
export interface AsesmenData {
  diagnostik: {
    kognitif: string;
    nonKognitif: string;
    teknik: string;
  };
  formatif: {
    teknik: string;
    instrumen: string;
    rubrikSingkat: string;
  };
  sumatif: {
    teknik: string;
    bentuk: string;
    keterangan: string;
  };
}

export interface SoalItem {
  id: string;
  no: number;
  tipe: "PG" | "Isian" | "Uraian" | "Praktik/Proyek";
  levelKognitif: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  stimulus?: string;
  pertanyaan: string;
  pilihanJawaban?: string[]; // Untuk PG (A, B, C, D)
  kunciJawaban: string;
  pembahasan?: string;
  skorMaks: number;
}

export interface KisiKisiRow {
  no: number;
  cp: string;
  materi: string;
  indikator: string;
  levelKognitif: string;
  bentukSoal: string;
  noSoal: number;
}

export interface RubrikRow {
  aspek: string;
  skor4: string; // Sangat Baik
  skor3: string; // Baik
  skor2: string; // Cukup
  skor1: string; // Perlu Bimbingan
}

export interface RefleksiData {
  pesertaDidik: {
    apaYangDipelajari: string;
    apaYangPalingDisukai: string;
    apaYangBelumDipahami: string;
    apaYangInginDipelajariSelanjutnya: string;
  };
  guru: {
    keberhasilan: string;
    kendala: string;
    responsPesertaDidik: string;
    perbaikan: string;
    tindakLanjut: string;
  };
}

export interface RemedialPengayaanData {
  remedial: {
    sasaran: string;
    bentukKegiatan: string;
    materiUlang: string;
    waktuDanTempat: string;
  };
  pengayaan: {
    sasaran: string;
    bentukKegiatan: string;
    materiPengayaan: string;
    tugasTantangan: string;
  };
}

export interface QualityCheckItem {
  id: string;
  criterion: string;
  status: "pass" | "warning" | "fail";
  details: string;
  autoFixAvailable: boolean;
}

export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  styling: ModuleStylingConfig;
  createdAt: string;
  isDefault?: boolean;
}

// Complete Master Modul Ajar Record
export interface CompleteModulePlan {
  id: string;
  title: string;
  identity: ModuleIdentity;
  karakter: ModuleKarakter;
  styling: ModuleStylingConfig;

  // 23 Interconnected Components
  cp: CPData;
  atp: ATPRow[];
  tp: TPItem[];
  modulCore: ModulAjarCore;
  kegiatan: KegiatanPembelajaran;
  deepLearning: PembelajaranMendalamData;
  diferensiasi: DiferensiasiData;
  bahanAjar: BahanAjarData;
  lkpd: LKPDData;
  asesmen: AsesmenData;
  kisiKisi: KisiKisiRow[];
  bankSoal: SoalItem[];
  rubrik: RubrikRow[];
  refleksi: RefleksiData;
  remedialPengayaan: RemedialPengayaanData;

  // QC & Status
  qcResult: {
    isValid: boolean;
    checks: QualityCheckItem[];
    lastChecked: string;
  };
  status: "draft" | "selesai";
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
