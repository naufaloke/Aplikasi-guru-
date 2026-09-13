export interface SDClassOption {
  id: string;
  name: string; // e.g. "Kelas I – Fase A"
  romanNumber: string; // "I", "II", "III", etc.
  level: number;
  fase: "A" | "B" | "C";
  description: string;
}

export const SD_CLASSES: SDClassOption[] = [
  {
    id: "sd-1",
    name: "Kelas I – Fase A",
    romanNumber: "I",
    level: 1,
    fase: "A",
    description: "Fondasi literasi, numerasi awal, dan pembentukan karakter (Usia 6-7 tahun)",
  },
  {
    id: "sd-2",
    name: "Kelas II – Fase A",
    romanNumber: "II",
    level: 2,
    fase: "A",
    description: "Penguatan literasi, numerasi dasar, dan kemandirian belajar (Usia 7-8 tahun)",
  },
  {
    id: "sd-3",
    name: "Kelas III – Fase B",
    romanNumber: "III",
    level: 3,
    fase: "B",
    description: "Awal pengenalan IPAS terpadu dan eksplorasi lingkungan konkret (Usia 8-9 tahun)",
  },
  {
    id: "sd-4",
    name: "Kelas IV – Fase B",
    romanNumber: "IV",
    level: 4,
    fase: "B",
    description: "Pengembangan penyelidikan sains, penalaran matematika, dan literasi kritis (Usia 9-10 tahun)",
  },
  {
    id: "sd-5",
    name: "Kelas V – Fase C",
    romanNumber: "V",
    level: 5,
    fase: "C",
    description: "Penalaran abstrak, proyek ilmiah, analisis sosial, dan berpikir kritis (Usia 10-11 tahun)",
  },
  {
    id: "sd-6",
    name: "Kelas VI – Fase C",
    romanNumber: "VI",
    level: 6,
    fase: "C",
    description: "Konsolidasi kompetensi dasar, kesiapan jenjang lanjutan, dan kepemimpinan (Usia 11-12 tahun)",
  },
];

export interface SDSubjectItem {
  id: string;
  number: number;
  name: string;
  shortName: string;
  category: "utama" | "seni" | "bahasa" | "mulok" | "custom";
  hasSubOptions?: boolean;
  subOptions?: string[];
  description?: string;
}

export const SD_MAIN_SUBJECTS: SDSubjectItem[] = [
  {
    id: "pai",
    number: 1,
    name: "Pendidikan Agama Islam dan Budi Pekerti",
    shortName: "PAI & BP",
    category: "utama",
    description: "Akidah, akhlak mulia, ibadah, dan pengamalan nilai keagamaan",
  },
  {
    id: "pancasila",
    number: 2,
    name: "Pendidikan Pancasila",
    shortName: "Pancasila",
    category: "utama",
    description: "Pancasila, UUD 1945, Bhinneka Tunggal Ika, dan NKRI",
  },
  {
    id: "bindo",
    number: 3,
    name: "Bahasa Indonesia",
    shortName: "B. Indonesia",
    category: "utama",
    description: "Menyimak, membaca dan memirsa, berbicara, serta menulis",
  },
  {
    id: "matematika",
    number: 4,
    name: "Matematika",
    shortName: "Matematika",
    category: "utama",
    description: "Bilangan, aljabar, pengukuran, geometri, analisis data & peluang",
  },
  {
    id: "ipas",
    number: 5,
    name: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
    shortName: "IPAS",
    category: "utama",
    description: "Pemahaman sains alam dan kehidupan sosial kemasyarakatan",
  },
  {
    id: "pjok",
    number: 6,
    name: "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
    shortName: "PJOK",
    category: "utama",
    description: "Keterampilan gerak, kebugaran jasmani, dan pola hidup sehat",
  },
  {
    id: "seni",
    number: 7,
    name: "Seni dan Budaya",
    shortName: "Seni Budaya",
    category: "seni",
    hasSubOptions: true,
    subOptions: ["Seni Rupa", "Seni Musik", "Seni Tari", "Seni Teater"],
    description: "Ekspresi kreatif, apresiasi budaya, dan eksplorasi karya estetika",
  },
  {
    id: "binggris",
    number: 8,
    name: "Bahasa Inggris",
    shortName: "B. Inggris",
    category: "bahasa",
    description: "Komunikasi dasar lisan dan tulisan kontekstual sehari-hari",
  },
  {
    id: "mulok",
    number: 9,
    name: "Muatan Lokal",
    shortName: "Muatan Lokal",
    category: "mulok",
    hasSubOptions: true,
    subOptions: ["Bahasa Daerah", "Bahasa Lampung", "Muatan Lokal lainnya"],
    description: "Pelestarian kearifan lokal, budaya daerah, dan bahasa daerah setempat",
  },
];

export const SENI_SUB_OPTIONS = [
  "Seni Rupa",
  "Seni Musik",
  "Seni Tari",
  "Seni Teater",
];

export const MULOK_DEFAULT_OPTIONS = [
  "Bahasa Daerah",
  "Bahasa Lampung",
  "Muatan Lokal lainnya",
];
