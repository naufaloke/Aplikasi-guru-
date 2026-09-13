import { GeneratedMediaData, MediaType } from "../types/media";
import { LKPDData } from "../types/lkpd";

export interface AIGenerateParams {
  prompt: string;
  systemInstruction?: string;
  taskType?: "cp" | "atp" | "modul" | "rpp" | "soal" | "lkpd" | "media" | "jurnal" | "rapor" | "analisis";
}

export const AIService = {
  async generate(params: AIGenerateParams): Promise<string> {
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      return data.text || "Tidak ada respon dari sistem AI.";
    } catch (err: any) {
      console.warn("AI generation failed, fallback applied:", err?.message);
      return "Sistem AI sedang offline. Silakan pastikan server backend berjalan dengan baik.";
    }
  },

  async chat(messages: { role: string; content: string }[], context?: any): Promise<string> {
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, context }),
      });

      if (!res.ok) {
        throw new Error(`Chat error: ${res.status}`);
      }

      const data = await res.json();
      return data.text || "Halo! Ada yang bisa saya bantu terkait administrasi Kurikulum Merdeka?";
    } catch (err: any) {
      console.error("AI Chat error:", err?.message);
      return "Mohon maaf, asisten AI sedang mengalami gangguan koneksi. Anda tetap dapat menggunakan seluruh template dan fitur administrasi manual.";
    }
  },

  // Capaian Pembelajaran AI
  async generateCP(subject: string, gradeLevel: string, semester: string): Promise<string> {
    const prompt = `Buatkan Capaian Pembelajaran (CP) Resmi, Ringkasan, Kata Kunci, dan Tujuan Pembelajaran (TP) untuk:
Mata Pelajaran: ${subject}
Kelas/Fase: ${gradeLevel} (Fase ${gradeLevel.includes("1") || gradeLevel.includes("2") ? "A" : gradeLevel.includes("3") || gradeLevel.includes("4") ? "B" : "C"})
Semester: ${semester}
Prinsip: Kurikulum Merdeka & Pembelajaran Mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan).
Sertakan rumusan elemen pemahaman, kata kerja operasional (KKO), dan indikator ketercapaian tujuan pembelajaran.`;
    return AIService.generate({ prompt, taskType: "cp" });
  },

  // Alur Tujuan Pembelajaran (ATP)
  async generateATP(subject: string, gradeLevel: string, topic: string): Promise<string> {
    const prompt = `Buatkan tabel Alur Tujuan Pembelajaran (ATP) semester ganjil untuk:
Mata Pelajaran: ${subject}
Kelas: ${gradeLevel}
Materi Inti: ${topic}
Formatkan dalam bentuk tabel Markdown dengan kolom:
| Minggu ke- | Alur Tujuan Pembelajaran (ATP) | Ruang Lingkup Materi | Rencana Aktivitas Bermakna | Rencana Asesmen (Formatif/Sumatif) | Alokasi JP |`;
    return AIService.generate({ prompt, taskType: "atp" });
  },

  // Modul Ajar AI Unggulan
  async generateModulAjar(topicQuery: string, schoolName = "SD Negeri 3 Banjar Ratu"): Promise<string> {
    const prompt = `Buatkan Modul Ajar Kurikulum Merdeka Lengkap dan Siap Pakai untuk SD dengan topik: "${topicQuery}".
Satuan Pendidikan: ${schoolName}

Struktur Wajib yang Harus Dimuat:
1. IDENTITAS MODUL (Satuan Pendidikan, Fase/Kelas, Semester, Mapel, Alokasi Waktu, Model Pembelajaran)
2. PROFIL PELAJAR PANCASILA & PRINSIP DEEP LEARNING (Berkesadaran, Bermakna, Menggembirakan)
3. CAPAIAN PEMBELAJARAN (CP) & TUJUAN PEMBELAJARAN (TP)
4. PEMAHAMAN BERMAKNA & PERTANYAAN PEMANTIK
5. KEGIATAN PEMBELAJARAN LENGKAP (Pendahuluan, Kegiatan Inti dengan Sintaks PBL/PjBL + TPACK + Diferensiasi Konten/Proses/Produk, Penutup)
6. ASESMEN & RUBRIK PENILAIAN (Asesmen Diagnostik, Formatif, dan Sumatif)
7. REFLEKSI GURU & PESERTA DIDIK
8. LAMPIRAN LKPD (Lembar Kerja Peserta Didik) & BAHAN BACAAN GURU/SISWA`;
    return AIService.generate({ prompt, taskType: "modul" });
  },

  // RPP Otomatis
  async generateRPP(subject: string, gradeLevel: string, jp: string, model: string, topic: string): Promise<string> {
    const prompt = `Buatkan Rencana Pelaksanaan Pembelajaran (RPP) Otomatis Berkesadaran, Bermakna, dan Menggembirakan untuk:
Kelas: ${gradeLevel}
Mapel: ${subject}
Alokasi Waktu: ${jp}
Model Pembelajaran: ${model}
Materi: ${topic}
Gunakan format ringkas, padat, aplikatif sesuai standar Kurikulum Merdeka.`;
    return AIService.generate({ prompt, taskType: "rpp" });
  },

  // Bank Soal AI (HOTS)
  async generateSoal(subject: string, gradeLevel = "Kelas 4 SD", topic = "IPAS", total = 10): Promise<string> {
    const prompt = subject.length > 50
      ? subject
      : `Buatkan Bank Soal Asesmen SD Kurikulum Merdeka berbasis HOTS (Higher Order Thinking Skills) sebanyak ${total} soal untuk:
Mapel: ${subject}
Kelas: ${gradeLevel}
Bab/Materi: ${topic}
Format variasi soal:
- Pilihan Ganda (ada stimulus kasus nyata/gambar deskriptif, 4 opsi A/B/C/D, kunci jawaban & pembahasan kognitif C4-C6)
- Soal Isian Singkat
- Soal Benar / Salah
- Soal Menjodohkan
- Soal Uraian Reflektif dengan Rubrik Penskoran`;
    return AIService.generate({ prompt, taskType: "soal" });
  },

  // LKPD AI (Raw text)
  async generateLKPD(subjectOrPrompt: string, gradeLevel = "Kelas 4 SD", topic = "Sains"): Promise<string> {
    const prompt = subjectOrPrompt.length > 50
      ? subjectOrPrompt
      : `Buatkan LKPD (Lembar Kerja Peserta Didik) yang menarik, penuh warna, dan interaktif untuk anak SD:
Mapel: ${subjectOrPrompt}
Kelas: ${gradeLevel}
Materi: ${topic}
Format:
- Judul Aktivitas yang Ceria
- Identitas Siswa / Kelompok
- Tujuan Penyelidikan Cilik
- Alat & Bahan Sederhana
- Langkah Aktivitas Menggembirakan (Hands-on)
- Kolom Pengamatan / Tabel Catatan Hasil
- Pertanyaan Diskusi Kritis
- Kotak Refleksi Emotikon (Senang, Cukup, Butuh Bantuan)`;
    return AIService.generate({ prompt, taskType: "lkpd" });
  },

  // LKPD AI Structured (Siap Cetak Kurikulum Merdeka)
  async generateStructuredLKPD(params: {
    topic: string;
    gradeLevel?: string;
    subject?: string;
    theme?: "ceria" | "monokrom" | "formal";
    layoutMode?: "kelompok" | "individu";
    schoolName?: string;
    questionCount?: number;
    difficultyLevel?: string;
  }): Promise<{ success: boolean; data: LKPDData; source: string }> {
    try {
      const res = await fetch("/api/ai/generate-lkpd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();
      return json;
    } catch (err: any) {
      console.warn("Structured LKPD generation failed, falling back:", err?.message);
      throw err;
    }
  },

  // Analisis Nilai Otomatis & Rekomendasi Remedial
  async generateGradeAnalysis(subject: string, className: string, stats: { avg: number; min: number; max: number; passRate: number; remedialStudents: string[] }): Promise<string> {
    const prompt = `Sebagai konsultan pedagogis guru SD, berikan analisis hasil penilaian dan rencana tindak lanjut:
Mata Pelajaran: ${subject}
Kelas: ${className}
Rata-rata Kelas: ${stats.avg}
Nilai Tertinggi: ${stats.max}
Nilai Terendah: ${stats.min}
Tingkat Ketuntasan: ${stats.passRate}%
Daftar Siswa Perlu Remedial: ${stats.remedialStudents.join(", ") || "Tidak ada"}

Berikan:
1. Diagnosis Kendala Pembelajaran
2. Desain Program Remedial Kontekstual (Aktivitas terfokus)
3. Desain Program Pengayaan bagi Siswa Nilai Tinggi (Tantangan kreatif)
4. Rekomendasi Perbaikan Metode Guru untuk Bab Selanjutnya`;
    return AIService.generate({ prompt, taskType: "analisis" });
  },

  // Media AI
  async generateMediaConcept(prompt: string): Promise<string> {
    return AIService.generate({ prompt, taskType: "media" });
  },

  async generateMediaPrompt(mediaType: string, topic: string, gradeLevel: string): Promise<string> {
    const prompt = `Buatkan rancangan dan deskripsi visual detail untuk ${mediaType} bertema "${topic}" untuk siswa ${gradeLevel}.
Sertakan:
- Konsep Visual 3D / Ilustrasi Penuh Warna
- Tata Letak & Elemen Grafis
- Teks Kunci / Poin Infografis / Isi Flashcard
- Palet Warna Rekomendasi (Ramah Anak)
- Prompt Video / Generator Gambar AI yang bisa langsung disalin`;
    return AIService.generate({ prompt, taskType: "media" });
  },

  async generateStructuredMedia(params: {
    mediaType: MediaType;
    topic: string;
    gradeLevel?: string;
    style?: string;
  }): Promise<GeneratedMediaData> {
    try {
      const res = await fetch("/api/ai/generate-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }
      const data = await res.json();
      return data.data;
    } catch (err: any) {
      console.warn("Failed to generate structured media from server, using fallback:", err?.message);
      // Client-side fallback if network error
      return {
        mediaType: params.mediaType,
        topic: params.topic,
        title: `Media Interaktif: ${params.topic}`,
        subtitle: params.gradeLevel || "Fase B (Kelas 4 SD)",
        badge: "Kurikulum Merdeka",
        conceptSummary: `Eksplorasi konsep ${params.topic} untuk memfasilitasi deep learning yang bermakna bagi peserta didik.`,
        funFact: "Eksplorasi visual meningkatkan retensi memori anak hingga 65%!",
        palette: [
          { name: "Biru Langit", hex: "#0284C7" },
          { name: "Hijau Segar", hex: "#10B981" },
          { name: "Kuning Hangat", hex: "#F59E0B" },
        ],
        posterElements: [
          { step: 1, title: "Apersepsi", description: "Pengenalan materi kontekstual", icon: "sun", tag: "Langkah 1" },
          { step: 2, title: "Eksplorasi", description: "Penyelidikan bersama guru dan teman", icon: "search", tag: "Langkah 2" },
          { step: 3, title: "Refleksi", description: "Menyimpulkan pemahaman bermakna", icon: "star", tag: "Langkah 3" },
        ],
      };
    }
  },

  async generateMediaImage(prompt: string, aspectRatio = "1:1"): Promise<string | null> {
    try {
      const res = await fetch("/api/ai/generate-media-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.imageUrl) {
        return data.imageUrl;
      }
      return null;
    } catch (e) {
      return null;
    }
  },
};
