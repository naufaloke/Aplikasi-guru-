export interface LKPDToolItem {
  name: string;
  checked?: boolean;
  note?: string;
}

export interface LKPDExperimentStep {
  step: number;
  title: string;
  desc: string;
  icon?: string;
}

export interface LKPDObservationTable {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface LKPDQuestion {
  number: number;
  question: string;
  cognitiveLevel?: string; // HOTS - C4 / C5 / C6
  hint?: string;
  blankLinesCount?: number;
}

export interface LKPDAttitudeMetric {
  aspect: string;
  scale: string[];
}

export interface LKPDData {
  title: string;
  subTitle: string;
  theme: "ceria" | "monokrom" | "formal";
  layoutMode: "kelompok" | "individu";
  headerInfo: {
    sekolah: string;
    dinas: string;
    alamat: string;
    mataPelajaran: string;
    faseKelas: string;
    alokasiWaktu: string;
    semester: string;
    tahunAjaran: string;
    topik: string;
  };
  studentIdentity: {
    type: "kelompok" | "individu";
    namaKelompokDefault: string;
    anggotaCount: number;
    showNilaiBox: boolean;
    showCatatanGuru: boolean;
  };
  learningGoals: string[];
  instructions: string[];
  toolsAndMaterials: LKPDToolItem[];
  experimentSteps: LKPDExperimentStep[];
  observationTable: LKPDObservationTable;
  discussionQuestions: LKPDQuestion[];
  conclusionPrompt: string;
  rubricReflection: {
    enableEmoticon: boolean;
    attitudeMetrics: LKPDAttitudeMetric[];
  };
  teacherSignature: {
    namaGuru: string;
    nipGuru: string;
    namaKepsek: string;
    nipKepsek: string;
    tanggal: string;
  };
  rawMarkdown?: string;
}
