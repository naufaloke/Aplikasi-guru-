import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side Gemini AI Client with lazy initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// AI Generation endpoint for Kurikulum Merdeka (Modul Ajar, CP, ATP, RPP, LKPD, Soal, Jurnal, Rapor)
app.post("/api/ai/generate", async (req, res) => {
  const { prompt, systemInstruction, taskType } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ||
            "Anda adalah Pakar Asisten Digital Guru Sekolah Dasar (SD) di Indonesia, spesialis Kurikulum Merdeka dan Pembelajaran Mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan). Berikan respon dalam Bahasa Indonesia yang formal, terstruktur, aplikatif, lengkap, dan pedagogis.",
        },
      });

      const text = response.text || "";
      return res.json({ text, success: true, source: "gemini" });
    } catch (error: any) {
      console.error("Gemini API error, using smart educational generator:", error?.message);
    }
  }

  // Fallback intelligent generator if Gemini key is missing or quota reached
  const fallbackText = generateEducationalFallback(prompt, taskType);
  return res.json({ text: fallbackText, success: true, source: "curriculum-engine" });
});

// Dedicated Media AI Generation endpoint that produces structured direct visual content
app.post("/api/ai/generate-media", async (req, res) => {
  const { mediaType = "poster", topic = "Siklus Air dan Hujan", gradeLevel = "Fase B (Kelas 4 SD)", style = "3D Cute Isometric Claymorphic" } = req.body;

  const ai = getAIClient();
  if (ai) {
    try {
      const systemPrompt = `Anda adalah Desainer Grafis Edukasi Senior dan Spesialis Media Pembelajaran SD Kurikulum Merdeka.
Tugas Anda adalah merancang media pembelajaran visual lengkap berjenis "${mediaType}" untuk topik: "${topic}" tingkat "${gradeLevel}".
PENTING: Output WAJIB berupa JSON murni (valid JSON) tanpa teks pengantar atau backtick markdown, dengan struktur:
{
  "title": "Judul Menarik Ceria untuk Anak SD",
  "subtitle": "Subjudul / Fase Pembelajaran",
  "theme": "Gaya visual dan nuansa",
  "category": "Kategori Mapel (IPAS/Matematika/Bahasa/dll)",
  "badge": "Label Singkat (misal: Deep Learning, Edu-Poster, Kartu Konsep)",
  "conceptSummary": "Ringkasan konsep pedagogis dalam 2-3 kalimat ramah anak",
  "funFact": "Tahukah Kamu? Fakta unik menyenangkan untuk murid",
  "palette": [
    {"name": "Warna 1", "hex": "#38BDF8"},
    {"name": "Warna 2", "hex": "#10B981"},
    {"name": "Warna 3", "hex": "#FBBF24"},
    {"name": "Warna 4", "hex": "#6366F1"}
  ],
  "posterElements": [
    {
      "step": 1,
      "title": "Nama Tahap / Elemen",
      "description": "Penjelasan singkat mudah dipahami anak SD",
      "icon": "droplet / sun / cloud / leaf / star / zap / book",
      "tag": "Kata Kunci"
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "term": "Istilah Utama",
      "category": "Sub-topik",
      "visualPrompt": "Deskripsi visual untuk kartu",
      "definition": "Pengertian sederhana dan jelas",
      "example": "Contoh nyata di kehidupan sehari-hari",
      "quizQuestion": "Pertanyaan kilat untuk tebak kartu",
      "quizAnswer": "Jawaban kuis"
    }
  ],
  "slides": [
    {
      "id": 1,
      "slideNumber": 1,
      "title": "Judul Slide",
      "subtitle": "Tujuan atau arahan",
      "bullets": ["Poin 1", "Poin 2", "Poin 3"],
      "visualConcept": "Rekomendasi visual/grafis slide",
      "teacherNote": "Catatan interaktif guru saat menerangkan di kelas"
    }
  ],
  "storyboard": [
    {
      "sceneNumber": 1,
      "time": "00:00 - 00:15",
      "title": "Adegan 1",
      "visualDescription": "Visual aksi animasi anak SD",
      "voiceover": "Teks narasi suara guru / karakter animasi",
      "soundFx": "Efek suara pendukung"
    }
  ],
  "rawPrompt": "Prompt komprehensif gaya Midjourney/Canva AI untuk keperluan cadangan"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Rancang media ${mediaType} topik: "${topic}", fase: "${gradeLevel}", gaya: "${style}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
      const parsedData = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsedData, source: "gemini" });
    } catch (err: any) {
      console.warn("Gemini media structured generation failed, using intelligent fallback:", err?.message);
    }
  }

  // Smart fallback
  const fallbackMedia = generateMediaFallback(mediaType, topic);
  return res.json({ success: true, data: fallbackMedia, source: "media-engine" });
});

// Dedicated Structured LKPD AI endpoint for Kurikulum Merdeka
app.post("/api/ai/generate-lkpd", async (req, res) => {
  const {
    topic = "Bagian Tubuh Tumbuhan dan Fungsinya",
    gradeLevel = "Fase B • Kelas IV (Empat)",
    subject = "IPAS",
    theme = "ceria",
    layoutMode = "kelompok",
    schoolName = "SD NEGERI 3 BANJAR RATU",
    questionCount = 5,
    difficultyLevel = "Campuran Bertingkat (LOTS, MOTS & HOTS)",
  } = req.body;

  const count = Number(questionCount) || 5;

  const ai = getAIClient();
  if (ai) {
    try {
      const systemPrompt = `Anda adalah Pakar Pengembang Kurikulum Merdeka dan Desainer LKPD (Lembar Kerja Peserta Didik) Interaktif Sekolah Dasar Indonesia.
Tugas Anda adalah merancang LKPD yang komprehensif, menarik, terstruktur, ramah anak, berbasis inkuiri sains/proyek mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan), dan SIAP CETAK pada kertas A4 standar.

Topik: "${topic}"
Mata Pelajaran: "${subject}"
Fase/Kelas: "${gradeLevel}"
Mode Pengerjaan: "${layoutMode}"
JUMLAH SOAL DISKUSI: Persis ${count} butir soal (nomor 1 sampai ${count}).
TINGKAT KESULITAN SOAL: "${difficultyLevel}".

Panduan Kesulitan:
- Jika LOTS (C1-C2): Menghafal fakta, menyebutkan nama/bagian, mengidentifikasi hasil pengamatan fisik.
- Jika MOTS (C3): Mengaplikasikan pemahaman konsep, membedakan, menjelaskan alur secara runut.
- Jika HOTS (C4-C6): Menganalisis sebab-akibat data amatan, memprediksi jika variabel diubah, merumuskan hipotesis & solusi inovatif.
- Jika Campuran Bertingkat: Soal nomor awal LOTS (C1-C2), nomor pertengahan MOTS (C3), dan nomor akhir HOTS (C4-C6).

PENTING: Output WAJIB berupa JSON murni tanpa pembuka Markdown atau backtick, dengan struktur persis:
{
  "title": "LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF",
  "subTitle": "Subjudul aktivitas ceria ramah anak",
  "theme": "${theme}",
  "layoutMode": "${layoutMode}",
  "headerInfo": {
    "sekolah": "${schoolName}",
    "dinas": "PEMERINTAH KABUPATEN LAMPUNG TENGAH\\nDINAS PENDIDIKAN DAN KEBUDAYAAN",
    "alamat": "Jl. Raya Lintas Sumatra No. 45, Banjar Ratu, Kec. Way Pengubuan",
    "mataPelajaran": "${subject}",
    "faseKelas": "${gradeLevel}",
    "alokasiWaktu": "2 × 35 Menit (1 Pertemuan)",
    "semester": "1 (Ganjil)",
    "tahunAjaran": "2024/2025",
    "topik": "${topic}"
  },
  "studentIdentity": {
    "type": "${layoutMode}",
    "namaKelompokDefault": "Regu Peneliti Cilik",
    "anggotaCount": 5,
    "showNilaiBox": true,
    "showCatatanGuru": true
  },
  "learningGoals": [
    "Capaian/Tujuan 1 terukur taksonomi Bloom",
    "Capaian/Tujuan 2 berbasis pengalaman nyata",
    "Capaian/Tujuan 3 pembentukan karakter gotong royong & nalar kritis"
  ],
  "instructions": [
    "Petunjuk 1 (Berdoa & persiapkan kelompok)",
    "Petunjuk 2 (Pembagian peran tugas anggota)",
    "Petunjuk 3 (Keselamatan kerja)",
    "Petunjuk 4 (Pencatatan data jujur objektif)",
    "Petunjuk 5 (Kebersihan meja belajar)"
  ],
  "toolsAndMaterials": [
    { "name": "Alat/Bahan 1", "note": "Keterangan ukuran/kondisi" },
    { "name": "Alat/Bahan 2", "note": "Keterangan" },
    { "name": "Alat/Bahan 3", "note": "Keterangan" },
    { "name": "Alat/Bahan 4", "note": "Keterangan" }
  ],
  "experimentSteps": [
    { "step": 1, "title": "Nama Tahap 1", "desc": "Penjelasan rinci tindakan murid" },
    { "step": 2, "title": "Nama Tahap 2", "desc": "Penjelasan rinci tindakan murid" },
    { "step": 3, "title": "Nama Tahap 3", "desc": "Penjelasan rinci tindakan murid" },
    { "step": 4, "title": "Nama Tahap 4", "desc": "Penjelasan rinci tindakan murid" }
  ],
  "observationTable": {
    "title": "Tabel Data Hasil Pengamatan Kelompok",
    "columns": ["No", "Objek / Parameter Uji", "Hasil Amatan Kondisi Awal", "Hasil Amatan Kondisi Akhir", "Keterangan Fakta"],
    "rows": [
      ["1", "Sampel 1", "Deskripsi", "Deskripsi perubahan", "Catatan"],
      ["2", "Sampel 2", "Deskripsi", "Deskripsi perubahan", "Catatan"],
      ["3", "Sampel 3", "Deskripsi", "Deskripsi perubahan", "Catatan"]
    ]
  },
  "discussionQuestions": [
    {
      "number": 1,
      "question": "Pertanyaan diskusi sesuai nomor dan tingkat kesulitan yang diminta",
      "cognitiveLevel": "HOTS - C4 (Menganalisis)",
      "hint": "Petunjuk bimbingan berpikir guru",
      "blankLinesCount": 3
    }
  ],
  "conclusionPrompt": "Berdasarkan hasil uji coba dan diskusi kelompokmu, rumuskan intisari kesimpulan bersama:",
  "rubricReflection": {
    "enableEmoticon": true,
    "attitudeMetrics": [
      { "aspect": "Gotong Royong & Kerja Sama", "scale": ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Kompak"] },
      { "aspect": "Bernalar Kritis & Keaktifan Diskusi", "scale": ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Aktif"] }
    ]
  },
  "teacherSignature": {
    "namaGuru": "Budi Santoso, S.Pd., Gr.",
    "nipGuru": "198807142014021003",
    "namaKepsek": "Drs. H. Mulyono, M.Pd.",
    "nipKepsek": "196805121992031004",
    "tanggal": "Banjar Ratu, ........................ 2024"
  }
}
WAJIB: Hasilkan persis ${count} butir soal di array discussionQuestions!`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Buatkan LKPD Kurikulum Merdeka siap cetak materi: "${topic}", mapel: "${subject}", kelas: "${gradeLevel}", mode: "${layoutMode}", jumlah soal: ${count}, tingkat kesulitan: "${difficultyLevel}". Pastikan array discussionQuestions berisi tepat ${count} soal!`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const cleanJson = responseText.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
      const parsedData = JSON.parse(cleanJson);
      return res.json({ success: true, data: parsedData, source: "gemini" });
    } catch (err: any) {
      console.warn("Gemini LKPD structured generation failed, using intelligent fallback:", err?.message);
    }
  }

  // Smart fallback
  const fallbackLKPD = generateLKPDFallback(topic, gradeLevel, subject, layoutMode, theme, schoolName, count, difficultyLevel);
  return res.json({ success: true, data: fallbackLKPD, source: "curriculum-engine" });
});

// Image Generation endpoint using Gemini Image model if available
app.post("/api/ai/generate-media-image", async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;
  const ai = getAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: prompt || "Cute 3D educational isometric illustration for children" }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          return res.json({ success: true, imageUrl, source: "gemini-image" });
        }
      }
    } catch (e: any) {
      console.warn("AI Image generation skipped (falling back to visual canvas):", e?.message);
    }
  }
  return res.json({ success: false, fallback: true });
});

// AI Chat Guru Assistant
app.post("/api/ai/chat", async (req, res) => {
  const { messages, context } = req.body;
  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "";

  const ai = getAIClient();
  if (ai) {
    try {
      const chat = ai.chats.create({
        model: "gemini-3.8-flash",
        config: {
          systemInstruction:
            "Anda adalah 'Guru AI Indonesia' - Asisten Digital Guru SD berkarakter ramah, cerdas, bersahabat, dan ahli Kurikulum Merdeka serta Pembelajaran Mendalam. Anda siap membantu membuat modul ajar, rubrik, soal HOTS, analisis rapor, jurnal, hingga surat dinas. Format jawaban dengan rapi menggunakan Markdown, bullet point, dan tabel jika relevan.",
        },
      });

      const chatPrompt = context
        ? `[Konteks Sekolah: ${JSON.stringify(context)}]\nPertanyaan Guru: ${lastMessage}`
        : lastMessage;

      const response = await chat.sendMessage({ message: chatPrompt });
      return res.json({ text: response.text || "", success: true });
    } catch (err: any) {
      console.error("Chat error:", err?.message);
    }
  }

  // Chat fallback
  return res.json({
    text: `Halo Bapak/Ibu Guru Hebat! 😊\n\nSaya siap mendampingi perencanaan pembelajaran Kurikulum Merdeka dan Pembelajaran Mendalam di kelas Anda. Mengenai "${lastMessage}", berikut rekomendasi praktis:\n\n1. **Tujuan Pembelajaran**: Pastikan terukur dengan kata kerja operasional (KKO) Taksonomi Bloom.\n2. **Diferensiasi**: Siapkan konten visual untuk peserta didik kinestetik dan pengayaan bertahap.\n3. **Asesmen Otomatis**: Gunakan menu 'Modul AI' atau 'Bank Soal AI' di sidebar untuk mengunduh versi cetak LKPD dan kisi-kisi.\n\nAda administrasi atau lembar kerja khusus yang ingin saya buatkan sekarang?`,
    success: true,
  });
});

function generateEducationalFallback(prompt: string, taskType?: string): string {
  const lower = prompt.toLowerCase();
  
  if (taskType === "cp" || lower.includes("capaian pembelajaran") || lower.includes("cp")) {
    return `# CAPAIAN PEMBELAJARAN (CP) RESMI & TUJUAN PEMBELAJARAN
**Fase / Kelas:** B / Kelas 4 SD
**Mata Pelajaran:** IPAS / Bahasa Indonesia / Matematika
**Prinsip:** Pembelajaran Mendalam (Bermakna, Berkesadaran, Menggembirakan)

### 1. Rumusan Capaian Pembelajaran (Elemen Pemahaman)
Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh tumbuhan (akar, batang, daun, bunga, dan buah) melalui eksplorasi lingkungan secara kolaboratif. Peserta didik menunjukkan rasa ingin tahu dan kepedulian terhadap kelestarian ekosistem sekitar sekolah.

### 2. Kata Kunci Utama
- Morfologi Tumbuhan
- Fotosintesis & Transportasi Nutrisi
- Siklus Hidup & Keseimbangan Lingkungan
- Profil Pelajar Pancasila: Bernalar Kritis & Bergotong Royong

### 3. Tujuan Pembelajaran (TP) Teridentifikasi
1. **TP.1**: Mengidentifikasi 5 bagian utama tumbuhan serta fungsinya dengan benar melalui observasi langsung di halaman sekolah.
2. **TP.2**: Menjelaskan proses fotosintesis secara sederhana menggunakan media diagram alir visual.
3. **TP.3**: Menyajikan laporan investigasi fungsi daun dan akar dalam kelompok secara komunikatif dan percaya diri.`;
  }

  if (taskType === "modul" || lower.includes("modul") || lower.includes("rpp")) {
    return `# MODUL AJAR KURIKULUM MERDEKA & PEMBELAJARAN MENDALAM
**Satuan Pendidikan:** SD Negeri 3 Banjar Ratu
**Fase / Kelas / Semester:** B / Kelas IV / Semester Ganjil
**Mata Pelajaran:** IPAS (Ilmu Pengetahuan Alam dan Sosial)
**Materi Pokok:** Bagian Tubuh Tumbuhan dan Fungsinya
**Alokasi Waktu:** 2 x 35 Menit (1 Pertemuan)
**Model Pembelajaran:** Problem-Based Learning (PBL) terintegrasi TPACK

---

### I. INFORMASI UMUM
- **Kompetensi Awal:** Peserta didik mengenal nama-nama tanaman di pekarangan rumah.
- **Profil Pelajar Pancasila:** Beriman & Bertakwa, Bernalar Kritis, Bergotong Royong, Kreatif.
- **Sarana & Prasarana:** Tanaman asli dengan akar utuh, proyektor/slide interaktif, LKPD bergambar, kaca pembesar.
- **Target Peserta Didik:** Reguler (Terdiferensiasi: Auditori, Visual, Kinestetik).

### II. KOMPONEN INTI
#### A. Tujuan Pembelajaran
1. Melalui kegiatan observasi specimen tumbuhan nyata, murid dapat menganalisis fungsi akar, batang, dan daun dengan akurasi 90%.
2. Melalui diskusi kelompok, murid mampu merumuskan kesimpulan pentingnya fotosintesis bagi kehidupan makhluk hidup.

#### B. Pemahaman Bermakna (Deep Learning)
Tumbuhan adalah paru-paru bumi dan produsen utama kehidupan. Menjaga tanaman adalah wujud nyata rasa syukur kepada Tuhan YME.

#### C. Pertanyaan Pemantik
- Mengapa pohon besar tidak roboh saat diterpa angin kencang?
- Bagaimana air dari dalam tanah bisa sampai ke pucuk daun yang tinggi?

#### D. Langkah-Langkah Pembelajaran (Bermakna & Menggembirakan)
1. **Kegiatan Awal (10 Menit):**
   - Salam pembuka ceria, doa bersama, dan ice breaking tepuk semangat.
   - Apersepsi: Guru menunjukkan sebatang seledri yang direndam pewarna makanan.
   - Menyampaikan tujuan dan kesepakatan belajar kelas.
2. **Kegiatan Inti (50 Menit - Sintaks PBL):**
   - *Fase 1 - Orientasi Masalah:* Menayangkan video singkat pohon layu kekurangan air.
   - *Fase 2 - Mengorganisasi Peserta Didik:* Murid berkelompok 4-5 orang heterogen.
   - *Fase 3 - Penyelidikan Terbimbing (Diferensiasi):* Murid meneliti akar serabut & tunggang menggunakan kaca pembesar dan mengisi LKPD.
   - *Fase 4 - Mengembangkan Hasil Karya:* Tiap kelompok menempel puzzle anatomi tumbuhan di kertas plano mini.
   - *Fase 5 - Analisis & Evaluasi:* Presentasi kilat (Gallery Walk) dengan tepuk apresiasi.
3. **Kegiatan Penutup (10 Menit):**
   - Guru bersama murid menyimpulkan pembelajaran.
   - Refleksi 3-2-1: (3 hal baru, 2 hal disukai, 1 hal yang ingin dipelajari lagi).
   - Tindak lanjut dan doa penutup.

### III. RUBRIK ASESMEN FORMATIF
- **Sangat Mahir (4):** Mampu menguraikan fungsi 5 bagian tumbuhan beserta analogi transportasinya.
- **Mahir (3):** Mampu menyebutkan 4-5 bagian tumbuhan beserta fungsi dasarnya.
- **Cukup (2):** Menyebutkan 3 bagian tumbuhan dengan bimbingan guru.
- **Perlu Pendampingan (1):** Belum mampu membedakan akar dan batang tanpa bimbingan intensif.`;
  }

  if (taskType === "soal" || lower.includes("soal") || lower.includes("hots")) {
    return `# BANK SOAL ASESMEN FORMATIF & SUMATIF (HOTS)
**Mata Pelajaran:** IPAS / Matematika SD
**Kelas:** IV (Empat) Kurikulum Merdeka
**Penyusun:** Asisten Guru AI Indonesia

---

### A. Pilihan Ganda (HOTS)
1. **Stimulus:** Petani di desa Banjar Ratu mendapati tanaman jagungnya mudah roboh setelah diterjang hujan deras. Setelah dicek, struktur akarnya tidak berkembang dengan baik ke dalam tanah.
   **Pertanyaan:** Berdasarkan fungsi biologisnya, gangguan apa yang dialami oleh tanaman jagung tersebut?
   A. Akar gagal menyerap sinar matahari untuk fotosintesis
   B. Akar tidak mampu menopang berdirinya batang tumbuhan di tanah
   C. Daun tidak dapat mengeluarkan gas oksigen
   D. Bunga tidak dapat melakukan penyerbukan alami
   *Kunci Jawaban:* **B** | *Tingkat Kognitif:* C4 (Analisis)

2. **Pertanyaan:** Suatu hari Dina memotong batang bunga mawar lalu mencelupkannya ke air berisi tinta merah. Dua jam kemudian kelopak bunga berubah agak kemerahan. Bagian tanaman manakah yang berperan dalam peristiwa tersebut?
   A. Xilem pada batang tanaman
   B. Stomata pada helaian daun
   C. Tudung akar pada ujung akar
   D. Serbuk sari pada mahkota bunga
   *Kunci Jawaban:* **A** | *Tingkat Kognitif:* C4 (Penerapan Konsep)

### B. Soal Isian Singkat & Benar/Salah
3. *[Benar/Salah]* Klorofil merupakan zat hijau daun yang bertugas menangkap energi cahaya matahari saat proses memasak makanan tumbuhan. **(BENAR)**
4. Bagian tumbuhan yang umumnya mengalami perubahan menjadi buah dan menyimpan biji untuk regenerasi adalah .... *(Kunci: Bunga / Bakal Buah)*

### C. Soal Uraian Reflektif
5. **Soal:** Mengapa kita tidak disarankan menebang pepohonan di perbukitan secara liar jika dikaitkan dengan fungsi akar tumbuhan terhadap bencana tanah longsor?
   *Kunci & Rubrik:* Akar tumbuhan berfungsi mencengkeram partikel tanah dan menyerap cadangan air hujan. Jika ditebang, tanah menjadi gembur dan mudah terbawa aliran air sehingga menyebabkan longsor.`;
  }

  if (taskType === "lkpd" || lower.includes("lkpd") || lower.includes("lembar kerja")) {
    return `# LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF
**Topik:** Penyelidikan Bagian Tubuh Tumbuhan & Pembuluh Xilem
**Fase / Kelas:** B / Kelas IV SD
**Alokasi Waktu:** 2 × 35 Menit (1 Pertemuan)
**Mata Pelajaran:** IPAS (Ilmu Pengetahuan Alam dan Sosial)

### A. Capaian & Tujuan Penyelidikan
1. Peserta didik dapat menganalisis fungsi bagian-bagian tubuh tumbuhan melalui pengamatan spesimen nyata.
2. Peserta didik dapat membuktikan daya kapilaritas pembuluh xilem dalam mengalirkan zat cair berwarna ke helai daun.
3. Menumbuhkan nilai gotong royong dan penalaran kritis dalam mencatat fakta data saintifik.

### B. Petunjuk Kerja & Keselamatan
1. Berdoalah bersama teman sekelompokmu sebelum melakukan kegiatan.
2. Lakukan pembagian tugas secara adil: ketua, pengambil alat, pencatat data, dan pelapor.
3. Berhati-hatilah saat menggunakan gunting atau alat potong, selalu di bawah pengawasan guru.
4. Catat perubahan warna pada batang tanaman secara jujur pada tabel pengamatan.
5. Rapikan dan bersihkan kembali meja kerja setelah selesai eksperimen.

### C. Alat dan Bahan Penyelidikan
- 2 tangkai seledri segar berdaun lebat (atau sawi putih)
- 2 buah gelas plastik transparan (diberi label Merah dan Biru)
- Pewarna makanan cair merah dan biru
- Air bersih secukupnya (± 150 ml per gelas)
- Cutter / pisau plastik tumpul & sendok pengaduk
- Kaca pembesar (lup) dan penggaris

### D. Langkah Kerja Eksperimen (Hands-on)
1. Siapkan dua gelas plastik dan isi masing-masing dengan air hingga setengahnya.
2. Teteskan 5 tetes pewarna makanan merah pada Gelas A dan pewarna biru pada Gelas B, aduk hingga rata.
3. Potong miring bagian pangkal batang seledri sepanjang 1 cm dengan bantuan guru.
4. Celupkan tangkai seledri ke dalam masing-masing gelas berwarna tersebut.
5. Amati dan catat kondisi batang dan tulang daun pada menit ke-0, 15, dan 30.

### E. Tabel Data Pengamatan
| No | Waktu Pengamatan | Kondisi Batang Bawah | Kondisi Urat/Tulang Daun | Keterangan |
|---|---|---|---|---|
| 1 | Menit ke-0 | Hijau normal, belum tampak perubahan | Hijau segar | Air pewarna masih di dasar gelas |
| 2 | Menit ke-15 | Pangkal batang mulai merona warna | Garis tipis warna mulai terlihat | Zat cair mulai terserap ke atas |
| 3 | Menit ke-30 | Batang jelas berwarna pekat | Seluruh tulang daun berubah warna | Xilem berhasil mengangkut cairan |

### F. Pertanyaan Diskusi Kritis (HOTS)
1. Berdasarkan pengamatanmu, mengapa tulang daun seledri dapat berubah warna menjadi merah atau biru padahal daunnya tidak dicelupkan ke air?
2. Jaringan pembuluh apakah pada tumbuhan yang bekerja seperti sedotan ajaib mengalirkan cairan dari akar ke daun?
3. Jika tanah di sekitar pohon tercemar zat kimia beracun, ramalkan apa dampaknya bagi kesehatan buah yang kita konsumsi dari pohon tersebut!

### G. Kesimpulan
Tuliskan kesimpulan kelompokmu mengenai fungsi batang dan jaringan pengangkut bagi kelangsungan hidup tumbuhan.`;
  }

  // Default response
  return `# REKOMENDASI ADMINISTRASI PEMBELAJARAN
**Analisis Kebutuhan Guru SD Kurikulum Merdeka:**
1. **Perencanaan Kontekstual:** Menyesuaikan materi dengan kearifan lokal lingkungan sekolah siswa.
2. **Keterlibatan Aktif:** Mengutamakan eksperimen hands-on dan pengamatan langsung.
3. **Asesmen Berkelanjutan:** Menggunakan asesmen formatif harian untuk memantau kemajuan belajar murid.

*Disusun secara otomatis oleh Guru AI Indonesia (Enterprise Edition).*`;
}

function generateMediaFallback(mediaType: string, topic: string) {
  const isWaterCycle = topic.toLowerCase().includes("air") || topic.toLowerCase().includes("siklus");
  const isPhotosynthesis = topic.toLowerCase().includes("fotosintesis") || topic.toLowerCase().includes("tumbuhan") || topic.toLowerCase().includes("daun");
  const isHero = topic.toLowerCase().includes("pahlawan") || topic.toLowerCase().includes("sejarah") || topic.toLowerCase().includes("kemerdekaan");

  const title = isWaterCycle
    ? "Siklus Air & Hujan: Petualangan Tetesan Air Cilik"
    : isPhotosynthesis
    ? "Dapur Ajaib Daun: Rahasia Fotosintesis Tumbuhan"
    : isHero
    ? "Ksatria Bangsa: Meneladani Semangat Pahlawan Indonesia"
    : `Media Edukasi Ceria: ${topic}`;

  const subtitle = "Fase B (Kelas 4 SD) • Kurikulum Merdeka & Pembelajaran Mendalam";
  const theme = "3D Cute Isometric Educational Illustration, Vibrant Colors, Child-friendly";
  const category = "IPAS & Karakter Pancasila";
  const badge = mediaType === "poster" ? "Edu-Poster 3D Siap Cetak" : mediaType === "infografis" ? "Infografis Alur Edukasi" : mediaType === "flashcard" ? "Kartu Pintar Interaktif" : mediaType === "slide" ? "Slide Presentasi Interaktif" : "Storyboard Animasi Edukasi";

  const palette = [
    { name: "Biru Langit", hex: "#0284C7" },
    { name: "Hijau Zamrud", hex: "#10B981" },
    { name: "Kuning Ceria", hex: "#F59E0B" },
    { name: "Ungu Semangat", hex: "#6366F1" },
  ];

  const conceptSummary = isWaterCycle
    ? "Air di bumi tidak pernah habis karena terus berputar melalui siklus alami: penguapan dari sinar matahari, pembentukan awan dingin, hujan yang menyuburkan tanah, hingga mengalir kembali ke laut."
    : isPhotosynthesis
    ? "Tumbuhan memasak makanannya sendiri di daun menggunakan air dari tanah, gas karbon dioksida dari udara, dan energi cahaya matahari untuk menghasilkan glukosa dan oksigen bersih bagi manusia."
    : `Memahami konsep "${topic}" secara visual, kontekstual, dan bermakna melalui penyelidikan terarah di kelas.`;

  const funFact = isWaterCycle
    ? "Air yang kamu minum hari ini mungkin adalah air yang sama yang pernah diminum dinosaurus jutaan tahun lalu!"
    : isPhotosynthesis
    ? "Satu pohon rindang berdaun lebat mampu menghasilkan oksigen harian yang cukup untuk bernapas 4 orang manusia dewasa!"
    : "Belajar hal baru dengan rasa ingin tahu tinggi membuat sel-sel otak kita semakin kuat terhubung seperti jaring laba-laba!";

  const posterElements = isWaterCycle
    ? [
        { step: 1, title: "Evaporasi (Penguapan)", description: "Matahari memanaskan air laut, danau, dan sungai hingga menguap naik ke angkasa menjadi butiran uap halus tak kasat mata.", icon: "sun", tag: "Pemanasan" },
        { step: 2, title: "Kondensasi (Pengembunan)", description: "Uap air di langit tinggi yang dingin berkumpul, merapat, dan membentuk gumpalan awan putih yang semakin tebal dan gelap.", icon: "cloud", tag: "Pendinginan" },
        { step: 3, title: "Presipitasi (Curah Hujan)", description: "Awan yang sudah terlalu berat menampung air akhirnya menjatuhkan butiran-butiran hujan berkilau menyegarkan bumi.", icon: "droplet", tag: "Hujan Turun" },
        { step: 4, title: "Infiltrasi & Aliran", description: "Air hujan meresap ke dalam tanah menjadi cadangan mata air, diserap akar pepohonan, dan sisanya mengalir kembali ke lautan luas.", icon: "leaf", tag: "Penyerapan" },
      ]
    : [
        { step: 1, title: "Pengamatan Awal", description: `Menemukan fenomena nyata terkait "${topic}" di lingkungan sekitar sekolah.`, icon: "search", tag: "Apersepsi" },
        { step: 2, title: "Penyelidikan Kritis", description: "Mendiskusikan hubungan sebab-akibat dengan alat dan bahan sederhana.", icon: "zap", tag: "Eksplorasi" },
        { step: 3, title: "Pemahaman Konsep", description: "Merumuskan kesimpulan bermakna bersama teman kelompok dan guru.", icon: "book", tag: "Konseptual" },
        { step: 4, title: "Aksi Nyata & Refleksi", description: "Menerapkan nilai kebaikan dan kepedulian dalam kehidupan sehari-hari.", icon: "star", tag: "Aplikasi" },
      ];

  const flashcards = [
    {
      id: 1,
      term: isWaterCycle ? "Evaporasi" : "Stomata",
      category: "Kosakata Kunci",
      visualPrompt: "Matahari tersenyum menyinari danau biru berkilauan dengan uap air melayang ke atas",
      definition: isWaterCycle ? "Proses penguapan air permukaan bumi akibat pemanasan sinar matahari." : "Mulut daun berukuran mikroskopis yang berfungsi sebagai tempat keluar masuknya gas oksigen dan karbon dioksida.",
      example: isWaterCycle ? "Baju basah yang dijemur di bawah terik matahari lama-kelamaan menjadi kering." : "Saat siang hari, stomata terbuka untuk menyerap karbon dioksida.",
      quizQuestion: isWaterCycle ? "Apa nama peristiwa saat air danau berubah menjadi uap karena panas matahari?" : "Apa nama celah kecil pada daun untuk pertukaran gas?",
      quizAnswer: isWaterCycle ? "Evaporasi" : "Stomata"
    },
    {
      id: 2,
      term: isWaterCycle ? "Kondensasi" : "Klorofil",
      category: "Fenomena Alam",
      visualPrompt: "Awan putih mengembang menjadi awan abu-abu dingin di langit biru",
      definition: isWaterCycle ? "Perubahan wujud uap air menjadi titik-titik air karena suhu dingin di atmosfer." : "Zat pigmen hijau pada daun yang bertugas menangkap energi cahaya matahari.",
      example: isWaterCycle ? "Titik-titik air embun yang menempel pada dinding luar gelas berisi es dingin." : "Warna hijau segar pada daun bayam atau rumput di halaman.",
      quizQuestion: isWaterCycle ? "Apa sebutan untuk uap air yang mendingin dan membentuk awan?" : "Apa zat hijau daun yang membantu fotosintesis?",
      quizAnswer: isWaterCycle ? "Kondensasi" : "Klorofil"
    },
    {
      id: 3,
      term: isWaterCycle ? "Presipitasi" : "Glukosa",
      category: "Klimatologi",
      visualPrompt: "Rintik hujan kristal ceria turun membasahi pegunungan dan padang rumput",
      definition: isWaterCycle ? "Turunnya butiran air, salju, atau es dari awan menuju ke permukaan bumi." : "Zat gula sederhana hasil proses fotosintesis yang menjadi sumber makanan dan energi bagi tumbuhan.",
      example: isWaterCycle ? "Hujan rintik di sore hari yang membasahi halaman sekolah." : "Rasa manis alami pada buah mangga yang matang.",
      quizQuestion: isWaterCycle ? "Peristiwa turunnya hujan dari awan ke bumi dinamakan..." : "Apa zat makanan manis yang dihasilkan daun saat memasak makanan?",
      quizAnswer: isWaterCycle ? "Presipitasi" : "Glukosa"
    },
    {
      id: 4,
      term: isWaterCycle ? "Infiltrasi" : "Xilem",
      category: "Konservasi Tanah",
      visualPrompt: "Akar pohon besar memeluk butiran tanah dan menyerap air tanah segar",
      definition: isWaterCycle ? "Peresapan air permukaan ke dalam pori-pori tanah melalui lapisan humus dan akar tanaman." : "Pembuluh kayu pada batang tanaman yang mengangkut air dan mineral dari akar ke daun.",
      example: isWaterCycle ? "Air hujan di kebun meresap ke tanah sehingga tidak terjadi genangan banjir." : "Batang seledri yang direndam air pewarna merah berubah warna sampai ke daunnya.",
      quizQuestion: isWaterCycle ? "Proses masuknya air hujan ke dalam tanah disebut..." : "Pembuluh yang mengangkut air dari akar ke daun bernama...",
      quizAnswer: isWaterCycle ? "Infiltrasi" : "Xilem"
    }
  ];

  const slides = [
    {
      id: 1,
      slideNumber: 1,
      title: title,
      subtitle: "Petualangan Belajar IPAS Kelas 4 SD Bersama Guru Hebat",
      bullets: [
        "Mengenal fenomena ajaib di sekitar kita",
        "Menemukan rahasia alam ciptaan Tuhan YME",
        "Eksplorasi ceria, kolaboratif, dan bermakna"
      ],
      visualConcept: "Cover ceria dengan ilustrasi 3D animasi karakter ramah dan pemandangan alam mempesona",
      teacherNote: "Sapa anak-anak dengan ceria, tayangkan slide ini sambil mengajak tebak gambar pemantik."
    },
    {
      id: 2,
      slideNumber: 2,
      title: "Pertanyaan Pemantik & Misi Detektif Cilik",
      subtitle: "Mengapa Air di Bumi Tidak Pernah Habis?",
      bullets: [
        "Pernahkah kamu melihat genangan air setelah hujan yang tiba-tiba kering?",
        "Kemana perginya air genangan itu?",
        "Misi kita: Menjadi detektif penemu jejak siklus alam!"
      ],
      visualConcept: "Gambar detektif cilik memegang kaca pembesar mengamati tetesan air hujan",
      teacherNote: "Beri waktu 2 menit bagi murid untuk menjawab bebas. Apresiasi semua pendapat mereka."
    },
    {
      id: 3,
      slideNumber: 3,
      title: "4 Langkah Siklus Alam",
      subtitle: "Perjalanan Lingkaran Abadi",
      bullets: [
        "1. Evaporasi: Panas matahari menguapkan air",
        "2. Kondensasi: Uap air mendingin membentuk awan",
        "3. Presipitasi: Hujan turun membasahi bumi",
        "4. Infiltrasi: Air meresap dan mengalir kembali"
      ],
      visualConcept: "Diagram lingkaran 3D dengan panah estetik bercahaya menghubungkan laut, matahari, awan, dan pohon",
      teacherNote: "Jelaskan dengan gerakan tangan: naik (menguap), berkumpul (awan), turun (hujan), menyerap (tanah)."
    },
    {
      id: 4,
      slideNumber: 4,
      title: "Aktivitas Seru: Miniatur Awan dalam Toples",
      subtitle: "Penyelidikan Kelompok (Hands-On)",
      bullets: [
        "Alat: Toples kaca, air hangat, mangkuk es batu, semprotan",
        "Langkah: Tuang air hangat, letakkan es batu di atas toples",
        "Amati: Lihat kabut awan terbentuk tepat di depan matamu!"
      ],
      visualConcept: "Foto toples kaca dengan asap uap awan mini di dalamnya dan anak-anak tersenyum takjub",
      teacherNote: "Dampingi murid saat menuang air hangat. Pastikan setiap kelompok berbagi tugas."
    },
    {
      id: 5,
      slideNumber: 5,
      title: "Refleksi & Pesan Pelajar Pancasila",
      subtitle: "Menjaga Sumber Air = Menjaga Kehidupan",
      bullets: [
        "Menutup kran air saat selesai mencuci tangan",
        "Menanam pohon agar air tanah tetap melimpah",
        "Tidak membuang sampah ke sungai dan selokan"
      ],
      visualConcept: "Anak SD bergandengan tangan di taman hijau yang asri dengan air sungai jernih",
      teacherNote: "Tutup dengan tepuk air bersih dan minta murid menyebutkan 1 komitmen hemat air di rumah."
    }
  ];

  const storyboard = [
    {
      sceneNumber: 1,
      time: "00:00 - 00:15",
      title: "Adegan Pembuka (Hook Menggembirakan)",
      visualDescription: "Kamera zoom-in dari luar angkasa menuju bumi biru, lalu mendarat di danau tenang berhutan pinus. Karakter tetesan air 3D bernama 'Tito' melambaikan tangan menyapa penonton.",
      voiceover: "Halo sahabat cilik! Namaku Tito si tetes air. Hari ini aku akan mengajakmu bertualang keliling langit dan bumi!",
      soundFx: "Musik ceria marimba lembut dan suara gemericik air jernih"
    },
    {
      sceneNumber: 2,
      time: "00:15 - 00:40",
      title: "Terbang ke Awan (Evaporasi & Kondensasi)",
      visualDescription: "Matahari bersinar ramah. Tito mulai berkilauan dan berubah menjadi uap ringan berhawa hangat, melayang riang ke angkasa, lalu bergabung dengan ribuan teman tetes air membentuk awan putih empuk.",
      voiceover: "Horeee! Saat matahari menyinari danau, tubuhku menjadi hangat dan ringan. Aku melayang ke langit tinggi. Di atas sini dingin sekali, kami saling berpelukan membentuk awan yang megah!",
      soundFx: "Efek desau angin lembut melayang ('whoosh') dan denting lonceng kristal"
    },
    {
      sceneNumber: 3,
      time: "00:40 - 01:10",
      title: "Hujan Meluncur Bebas (Presipitasi)",
      visualDescription: "Awan berubah warna menjadi abu-abu tebal. Tiba-tiba tetesan-tetesan air berseluncur ke bawah seperti bermain perosotan raksasa, jatuh ke dedaunan hijau dan diserap akar tanaman.",
      voiceover: "Waaah! Awan sudah tidak muat lagi menampung kami. Satu, dua, tiga... Meluncur! Kami turun membasahi bumi, membuat bunga-bunga tersenyum mekar dan udara kembali sejuk!",
      soundFx: "Suara rintik hujan menetes lembut di atas daun dan tawa ceria anak"
    },
    {
      sceneNumber: 4,
      time: "01:10 - 01:30",
      title: "Pesan Bijak & Penutup",
      visualDescription: "Tito kembali ke danau bersama ikan-ikan kecil, lalu memegang poster kecil: 'Hemat Air, Sayangi Bumi!'. Layar menampilkan logo sekolah dan Kurikulum Merdeka.",
      voiceover: "Begitulah petualanganku! Air selalu berputar untuk kehidupan kita. Mari kita jaga sumber air bersih dengan tidak membuang sampah sembarangan ya. Sampai jumpa di petualangan berikutnya!",
      soundFx: "Fanfare ceria gembira dan tepuk tangan meriah"
    }
  ];

  const rawPrompt = `🎨 PROMPT VISUAL 3D UNTUK GENERATOR AI:
Topic: ${topic}
Style: 3D Cute Isometric Claymorphic, Pixar-style Educational Illustration
Lighting: Soft cinematic warm sunbeam, vibrant cheerful studio lighting
Objects: Karakter visual interaktif ceria untuk materi anak SD ${topic}
Palette: Biru langit (#0284C7), Hijau zamrud (#10B981), Kuning cerah (#F59E0B)
Resolution: High detail 4K educational poster format with clear hierarchy`;

  return {
    mediaType,
    topic,
    title,
    subtitle,
    theme,
    category,
    badge,
    conceptSummary,
    funFact,
    palette,
    posterElements,
    flashcards,
    slides,
    storyboard,
    rawPrompt,
  };
}

function generateLKPDFallback(
  topic: string,
  gradeLevel: string,
  subject: string,
  layoutMode: string,
  theme = "ceria",
  schoolName = "SD NEGERI 3 BANJAR RATU",
  questionCount = 5,
  difficultyLevel = "Campuran Bertingkat (LOTS, MOTS & HOTS)"
) {
  const isWaterCycle = topic.toLowerCase().includes("air") || topic.toLowerCase().includes("siklus");
  const isMath = subject.toLowerCase().includes("matematika") || topic.toLowerCase().includes("pecahan") || topic.toLowerCase().includes("hitung");

  const count = Math.max(1, Math.min(15, Number(questionCount) || 5));

  const title = "LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF";
  const subTitle = isWaterCycle
    ? "Penyelidikan Saintifik: Miniatur Siklus Air & Terjadinya Hujan"
    : isMath
    ? "Eksplorasi Kontekstual: Pecahan Senilai dengan Benda Konkret"
    : `Penyelidikan Saintifik: ${topic}`;

  const goals = isWaterCycle
    ? [
        "Peserta didik dapat membuktikan tahapan penguapan (evaporasi) dan pengembunan (kondensasi) melalui model siklus air sederhana.",
        "Peserta didik dapat menghubungkan peranan energi matahari terhadap keberlangsungan daur air di bumi.",
        "Mengembangkan sikap gotong royong dan bernalar kritis dalam mencatat perubahan volume air.",
      ]
    : isMath
    ? [
        "Peserta didik mampu menemukan konsep pecahan senilai menggunakan alat peraga kertas lipat origami.",
        "Peserta didik dapat menyelesaikan permasalahan kontekstual pembagian kue secara adil.",
        "Menumbuhkan ketelitian dan kerjasama dalam memverifikasi kesamaan nilai pecahan.",
      ]
    : [
        `Peserta didik dapat mengidentifikasi konsep kunci materi ${topic} melalui pengamatan langsung.`,
        `Peserta didik dapat menguji hubungan sebab-akibat fenomena ${topic} secara berkelompok.`,
        "Mengembangkan karakter Profil Pelajar Pancasila: Bernalar Kritis dan Bergotong Royong.",
      ];

  const tools = isWaterCycle
    ? [
        { name: "1 toples kaca transparan bening berpenutup", note: "Bisa toples bekas selai yang bersih" },
        { name: "Air hangat suam-suam kuku (± 100 ml)", note: "Dituangkan dengan bantuan guru" },
        { name: "4-5 butir es batu segar", note: "Diletakkan di atas penutup toples" },
        { name: "Pewarna makanan biru (2 tetes)", note: "Agar air terlihat jelas" },
        { name: "Kaca pembesar (lup) & stopwatch", note: "Untuk mengamati tetesan embun" },
      ]
    : isMath
    ? [
        { name: "4 lembar kertas origami aneka warna", note: "Ukuran 15 × 15 cm" },
        { name: "Gunting anak berujung bulat", note: "Gunakan dengan aman" },
        { name: "Penggaris 30 cm & pensil warna", note: "Untuk membuat garis lipatan" },
        { name: "Lem kertas batangan", note: "Untuk menempelkan potongan" },
      ]
    : [
        { name: "2 tangkai seledri segar berdaun lebat (atau sawi putih)", note: "Pilih yang segar tanpa layu" },
        { name: "2 buah gelas plastik transparan", note: "Beri label A (merah) dan B (biru)" },
        { name: "Pewarna makanan cair merah & biru", note: "Masing-masing 5 tetes" },
        { name: "Air bersih secukupnya (± 150 ml per gelas)", note: "Setengah gelas" },
        { name: "Cutter / pisau plastik tumpul & kaca pembesar", note: "Didampingi guru" },
      ];

  const steps = isWaterCycle
    ? [
        { step: 1, title: "Persiapan Air Hangat", desc: "Mintalah guru menuangkan air hangat ke dalam toples kaca hingga seperempat tinggi toples, lalu teteskan sedikit pewarna biru." },
        { step: 2, title: "Penutupan Rapat", desc: "Tutup toples toples secara terbalik atau rapat agar uap air hangat tidak keluar ke udara bebas." },
        { step: 3, title: "Pemberian Es Batu (Pendinginan)", desc: "Letakkan 4 butir es batu tepat di atas tutup toples logam/kaca. Amati bagian langit-langit dalam toples." },
        { step: 4, title: "Pengamatan Hujan Miniatur", desc: "Amati uap yang naik mendingin dan membentuk tetesan air yang mulai menitik jatuh kembali ke dasar toples." },
      ]
    : [
        { step: 1, title: "Persiapan Larutan Warna", desc: "Tuang air ke dalam gelas A dan B, teteskan pewarna merah dan biru, aduk hingga larut merata." },
        { step: 2, title: "Pemotongan Batang", desc: "Potong miring bagian pangkal batang tanaman uji sepanjang 1 cm agar pembuluh angkut terbuka leluasa." },
        { step: 3, title: "Pencelupan Batang Uji", desc: "Masukkan batang seledri ke dalam masing-masing larutan warna. Letakkan di dekat jendela kelas yang terang." },
        { step: 4, title: "Pencatatan Berkala", desc: "Amati naiknya warna pada batang dan tulang daun setiap 15 menit. Catat data pada tabel pengamatan." },
      ];

  const observationTable = isWaterCycle
    ? {
        title: "Tabel Pengamatan Model Miniatur Siklus Air",
        columns: ["No", "Menit Ke-", "Kondisi Permukaan Air Bawah", "Kondisi Dinding & Tutup Atas", "Fenomena yang Terjadi"],
        rows: [
          ["1", "Menit ke-2", "Air hangat tenang berwarna biru", "Mulai terlihat uap kabur tipis", "Evaporasi (Penguapan)"],
          ["2", "Menit ke-5", "Terdapat uap naik ke atas", "Muncul bulir-bulir air kecil di bawah es", "Kondensasi (Pengembunan)"],
          ["3", "Menit ke-10", "Uap semakin padat", "Bulir air membesar lalu menetes ke bawah", "Presipitasi (Hujan Miniatur)"],
        ],
      }
    : {
        title: "Tabel Data Hasil Penyelidikan Saintifik",
        columns: ["No", "Waktu / Objek Uji", "Kondisi Pangkal Batang", "Kondisi Urat Daun", "Keterangan Perubahan"],
        rows: [
          ["1", "Menit ke-0", "Hijau segar alami", "Hijau cerah normal", "Cairan warna belum naik"],
          ["2", "Menit ke-15", "Bagian bawah mulai merona", "Garis halus warna terlihat di tangkai", "Air warna mulai terisap ke atas"],
          ["3", "Menit ke-30", "Batang berwarna sangat pekat", "Urat daun jelas berubah warna", "Xilem berhasil mengalirkan nutrisi"],
        ],
      };

  // Build question pool based on topic and difficulty
  const isLotsOnly = difficultyLevel.toLowerCase().includes("lots") || difficultyLevel.toLowerCase().includes("mudah");
  const isMotsOnly = difficultyLevel.toLowerCase().includes("mots") || difficultyLevel.toLowerCase().includes("sedang");
  const isHotsOnly = difficultyLevel.toLowerCase().includes("hots") || difficultyLevel.toLowerCase().includes("sukar");

  // Rich Question Pool
  const questionPool = isWaterCycle
    ? [
        {
          q: "Sebutkan nama-nama tahapan perubahan wujud air yang terjadi di dalam model toples!",
          level: "LOTS - C1 (Menyebutkan)",
          hint: "Perhatikan saat air menguap, mengembun, dan menetes kembali.",
        },
        {
          q: "Apa yang terlihat menempel pada dinding dalam toples setelah didiamkan beberapa menit?",
          level: "LOTS - C2 (Mengidentifikasi)",
          hint: "Amati bentuk butiran embun di dekat tutup toples.",
        },
        {
          q: "Jelaskan peran es batu di atas tutup toples terhadap uap air hangat di dalamnya!",
          level: "MOTS - C3 (Menjelaskan)",
          hint: "Hubungkan perubahan suhu dingin dengan perubahan wujud gas menjadi cair.",
        },
        {
          q: "Bandingkan apa yang terjadi jika air di dalam toples adalah air es dingin bukan air hangat!",
          level: "MOTS - C3 (Membedakan)",
          hint: "Apakah penguapan tetap berlangsung cepat tanpa adanya energi kalor panas?",
        },
        {
          q: "Mengapa bulir-bulir air dapat terbentuk di bawah tutup toples setelah es diletakkan di atasnya? Konsep daur air apa yang dibuktikan?",
          level: "HOTS - C4 (Menganalisis)",
          hint: "Ingat pengaruh suhu dingin terhadap uap air panas (kondensasi).",
        },
        {
          q: "Dalam kehidupan nyata di alam semesta, benda atau fenomena apakah yang fungsinya sama seperti es batu pada percobaan toples ini?",
          level: "HOTS - C4 (Mengaitkan Realitas)",
          hint: "Pikirkan lapisan atmosfer langit tinggi yang bersuhu sangat dingin.",
        },
        {
          q: "Jika di suatu wilayah perkotaan semua pohon ditebang dan tanah tertutup beton semen, ramalkan dampak yang terjadi terhadap siklus air tanah dan cadangan sumur warga!",
          level: "HOTS - C5 (Memprediksi Dampak)",
          hint: "Pikirkan tahapan penyerapan (infiltrasi) air hujan ke dalam lapisan pori-pori tanah.",
        },
        {
          q: "Rancanglah sebuah gagasan aksi nyata sederhana bagi warga sekolahmu untuk menghemat dan menjaga kejernihan sumber air!",
          level: "HOTS - C6 (Merancang Solusi)",
          hint: "Tuliskan ide praktis yang bisa diterapkan di lingkungan kantin atau wastafel sekolah.",
        },
        {
          q: "Mengapa air laut yang mengalami penguapan saat turun menjadi hujan terasa tawar bukan asin?",
          level: "HOTS - C4 (Menganalisis)",
          hint: "Apakah garam ikut menguap bersama uap air ke angkasa?",
        },
        {
          q: "Buatlah bagan alur sederhana daur air lengkap dengan panah siklus berdasarkan hasil pengamatan kelompokmu!",
          level: "MOTS - C3 (Menggambarkan)",
          hint: "Mulai dari air laut/sungai -> uap -> awan -> hujan -> kembali ke laut.",
        },
      ]
    : isMath
    ? [
        {
          q: "Sebutkan pecahan senilai dari 1/2 yang berhasil kelompokmu buktikan menggunakan kertas lipat!",
          level: "LOTS - C1 (Menyebutkan)",
          hint: "Lihat hasil lipatan kertas origami yang memiliki luas sama persis.",
        },
        {
          q: "Berapa banyak bagian yang terbentuk jika satu lembar kertas dilipat menjadi 4 bagian sama besar?",
          level: "LOTS - C2 (Mengidentifikasi)",
          hint: "Hitung kotak-kotak yang dibatasi oleh garis lipatan.",
        },
        {
          q: "Tunjukkan bagaimana pecahan 2/4 memiliki nilai yang setara dengan pecahan 4/8!",
          level: "MOTS - C3 (Menerapkan)",
          hint: "Buktikan dengan menumpuk kedua kertas lipat tersebut.",
        },
        {
          q: "Jika sebuah kue bolu dipotong menjadi 8 bagian sama besar, dan kamu memakan 2 potong, berapa pecahan bagian kue yang kamu makan?",
          level: "MOTS - C3 (Menghitung Kontekstual)",
          hint: "Tuliskan pecahan awal lalu sederhanakan nilainya.",
        },
        {
          q: "Dua orang anak membagi semangka. Anak pertama mendapat 2/6 bagian, anak kedua mendapat 1/3 bagian. Siapakah yang mendapat bagian lebih besar? Berikan analisismu!",
          level: "HOTS - C4 (Menganalisis & Membandingkan)",
          hint: "Samakan penyebut kedua pecahan tersebut untuk membuktikannya.",
        },
        {
          q: "Temukan pola perkalian atau pembagian pembilang dan penyebut pada deretan pecahan senilai yang kalian temukan!",
          level: "HOTS - C5 (Menyimpulkan Pola)",
          hint: "Jika pembilang dikalikan 2, apa yang terjadi pada penyebutnya?",
        },
        {
          q: "Buatlah sebuah soal cerita pembagian adil benda konkret untuk kelompok lain menggunakan pecahan senilai!",
          level: "HOTS - C6 (Menciptakan)",
          hint: "Gunakan konteks makanan ringan atau alat tulis di kelas.",
        },
        {
          q: "Mengapa penting memastikan bahwa setiap bagian potongan kue harus sama besar saat membicarakan pecahan?",
          level: "HOTS - C4 (Penalaran Kritis)",
          hint: "Apa syarat utama sebuah bagian disebut sebagai pecahan?",
        },
      ]
    : [
        {
          q: `Sebutkan 3 hal penting yang kalian amati secara langsung selama penyelidikan materi ${topic}!`,
          level: "LOTS - C1 (Menyebutkan Fakta)",
          hint: "Catat bukti fisik yang terlihat oleh indra penglihatan kelompok.",
        },
        {
          q: `Komponen apa yang mengalami perubahan paling jelas setelah aktivitas ${topic} dilakukan?`,
          level: "LOTS - C2 (Mengidentifikasi)",
          hint: "Bandingkan kondisi awal dengan kondisi akhir.",
        },
        {
          q: `Jelaskan fungsi dari alat dan bahan utama yang kalian gunakan dalam pembuktian ${topic}!`,
          level: "MOTS - C3 (Menjelaskan Fungsi)",
          hint: "Bagaimana alat tersebut membantu penyelidikan kalian?",
        },
        {
          q: `Bagaimana kalian menghubungkan hasil amatan ini dengan peristiwa yang sering kalian jumpai sehari-hari di rumah atau sekolah?`,
          level: "MOTS - C3 (Mengaitkan)",
          hint: "Berikan 1 contoh nyata di lingkungan terdekatmu.",
        },
        {
          q: `Mengapa perubahan tersebut dapat terjadi? Uraikan hubungan sebab-akibat yang kalian temukan!`,
          level: "HOTS - C4 (Menganalisis Sebab-Akibat)",
          hint: "Gunakan konsep ilmiah yang baru saja kalian pelajari.",
        },
        {
          q: `Jika salah satu langkah percobaan diubah atau ditiadakan, ramalkan apa yang akan terjadi pada hasil akhirnya!`,
          level: "HOTS - C5 (Memprediksi & Menguji)",
          hint: "Apakah fenomena tersebut akan tetap berhasil dibuktikan?",
        },
        {
          q: `Rumuskan ide kreatif atau solusi nyata yang dapat kalian terapkan di lingkungan sekitarmu berdasarkan pelajaran hari ini!`,
          level: "HOTS - C6 (Merumuskan Solusi)",
          hint: "Gagas tindakan yang bermanfaat bagi teman atau lingkungan alam.",
        },
        {
          q: `Bagaimana sikap gotong royong dan ketelitian membantumu menyelesaikan lembar kerja ini bersama rekan kelompok?`,
          level: "HOTS - C5 (Refleksi Sikap)",
          hint: "Renungkan pembagian tugas dan kerja sama tim kalian.",
        },
        {
          q: `Apa tantangan terbesar yang dihadapi kelompok saat melakukan penyelidikan dan bagaimana cara mengatasinya?`,
          level: "HOTS - C5 (Evaluasi Masalah)",
          hint: "Tuliskan solusi yang kelompok kalian putuskan bersama.",
        },
        {
          q: `Buatlah rangkuman satu kalimat intisari penemuan kelompokmu yang paling mengejutkan dan berharga hari ini!`,
          level: "MOTS - C3 (Menyimpulkan)",
          hint: "Tuliskan dengan kalimat bangga dan penuh semangat belajar.",
        },
      ];

  // Filter or sort questions by requested difficulty
  let selectedPool = [...questionPool];
  if (isLotsOnly) {
    selectedPool.sort((a, b) => (a.level.includes("LOTS") ? -1 : 1));
  } else if (isMotsOnly) {
    selectedPool.sort((a, b) => (a.level.includes("MOTS") ? -1 : 1));
  } else if (isHotsOnly) {
    selectedPool.sort((a, b) => (a.level.includes("HOTS") ? -1 : 1));
  }

  // Ensure exact count requested
  const discussionQuestions = [];
  for (let i = 0; i < count; i++) {
    const item = selectedPool[i % selectedPool.length];
    discussionQuestions.push({
      number: i + 1,
      question: item.q,
      cognitiveLevel: item.level,
      hint: item.hint,
      blankLinesCount: i % 2 === 0 ? 3 : 4,
    });
  }

  return {
    title,
    subTitle,
    theme,
    layoutMode,
    headerInfo: {
      sekolah: schoolName,
      dinas: "PEMERINTAH KABUPATEN LAMPUNG TENGAH\nDINAS PENDIDIKAN DAN KEBUDAYAAN",
      alamat: "Jl. Raya Lintas Sumatra No. 45, Banjar Ratu, Kec. Way Pengubuan",
      mataPelajaran: subject,
      faseKelas: gradeLevel,
      alokasiWaktu: "2 × 35 Menit (1 Pertemuan)",
      semester: "1 (Ganjil)",
      tahunAjaran: "2024/2025",
      topik: topic,
    },
    studentIdentity: {
      type: layoutMode,
      namaKelompokDefault: "Regu Garuda Pelajar Pancasila",
      anggotaCount: 5,
      showNilaiBox: true,
      showCatatanGuru: true,
    },
    learningGoals: goals,
    instructions: [
      "Berdoalah bersama anggota kelompok sebelum memulai percobaan.",
      "Bagi tugas anggota: Ketua, Notulis data, Penyiap bahan, dan Presenter.",
      "Gunakan alat eksperimen dengan hati-hati serta ikuti arahan guru pendamping.",
      "Catatlah data pengamatan secara jujur sesuai fakta yang tampak di meja uji.",
      "Jaga kebersihan meja kerja dan buang sampah sisa ke tempat yang telah disiapkan.",
    ],
    toolsAndMaterials: tools,
    experimentSteps: steps,
    observationTable,
    discussionQuestions,
    conclusionPrompt: "Tuliskan intisari kesimpulan kelompokmu mengenai fenomena yang diselidiki hari ini:",
    rubricReflection: {
      enableEmoticon: true,
      attitudeMetrics: [
        { aspect: "Gotong Royong & Pembagian Tugas", scale: ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Kompak"] },
        { aspect: "Bernalar Kritis & Kejelian Data", scale: ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Cermat"] },
      ],
    },
    teacherSignature: {
      namaGuru: "Budi Santoso, S.Pd., Gr.",
      nipGuru: "198807142014021003",
      namaKepsek: "Drs. H. Mulyono, M.Pd.",
      nipKepsek: "196805121992031004",
      tanggal: "Banjar Ratu, ........................ 2024",
    },
  };
}

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Guru AI Indonesia] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
