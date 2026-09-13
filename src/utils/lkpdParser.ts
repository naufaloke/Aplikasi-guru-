import { LKPDData } from "../types/lkpd";

export const DEFAULT_LKPD_DATA: LKPDData = {
  title: "LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF",
  subTitle: "Eksplorasi Saintifik: Bagian Tubuh Tumbuhan & Daya Angkut Xilem",
  theme: "ceria",
  layoutMode: "kelompok",
  headerInfo: {
    sekolah: "SD NEGERI 3 BANJAR RATU",
    dinas: "PEMERINTAH KABUPATEN LAMPUNG TENGAH\nDINAS PENDIDIKAN DAN KEBUDAYAAN",
    alamat: "Jl. Raya Lintas Sumatra No. 45, Banjar Ratu, Kec. Way Pengubuan",
    mataPelajaran: "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
    faseKelas: "Fase B • Kelas IV (Empat)",
    alokasiWaktu: "2 × 35 Menit (1 Pertemuan)",
    semester: "1 (Ganjil)",
    tahunAjaran: "2024/2025",
    topik: "Bagian Tubuh Tumbuhan dan Fungsinya",
  },
  studentIdentity: {
    type: "kelompok",
    namaKelompokDefault: "Kelompok Cilik Pelajar Pancasila",
    anggotaCount: 5,
    showNilaiBox: true,
    showCatatanGuru: true,
  },
  learningGoals: [
    "Peserta didik mampu mengidentifikasi bagian tubuh tumbuhan (akar, batang, daun) serta fungsinya.",
    "Peserta didik mampu membuktikan proses pengangkutan air dan zat hara melalui jaringan xilem batang melalui penyelidikan langsung.",
    "Menumbuhkan karakter bernalar kritis dan gotong royong dalam menganalisis data observasi nyata.",
  ],
  instructions: [
    "Berdoalah bersama kelompok sebelum memulai langkah penyelidikan.",
    "Bagi tugas secara adil: ada pencatat waktu, peracik cairan warna, pemotong batang, dan pelapor hasil.",
    "Gunakan alat cutter/gunting dengan hati-hati dan selalu dalam pengawasan guru.",
    "Catat setiap perubahan warna pada tabel pengamatan secara jujur sesuai fakta yang terlihat.",
    "Jaga kebersihan meja kerja dan buang sampah sisa bahan ke tempat yang disediakan.",
  ],
  toolsAndMaterials: [
    { name: "2 tangkai seledri segar berdaun lebat (atau sawi putih)", note: "Pastikan batang masih segar" },
    { name: "2 buah gelas plastik transparan / bening", note: "Beri label A dan B" },
    { name: "Pewarna makanan cair (Merah dan Biru)", note: "Masing-masing 5 tetes" },
    { name: "Air bersih secukupnya (± 150 ml per gelas)", note: "Isi hingga separuh gelas" },
    { name: "Cutter / pisau plastik tumpul / sendok pengaduk", note: "Didampingi guru" },
    { name: "Stopwatch / jam dinding kelas", note: "Pengukur waktu pengamatan" },
  ],
  experimentSteps: [
    {
      step: 1,
      title: "Persiapan Larutan Warna",
      desc: "Isilah kedua gelas dengan air hingga separuh gelas. Teteskan pewarna merah pada Gelas A dan pewarna biru pada Gelas B, lalu aduk merata menggunakan sendok.",
    },
    {
      step: 2,
      title: "Pemotongan Batang Uji",
      desc: "Mintalah bantuan guru untuk memotong miring bagian pangkal batang seledri sepanjang ± 1 cm agar pori-pori pembuluh air terbuka maksimal.",
    },
    {
      step: 3,
      title: "Pencelupan Spesimen",
      desc: "Masukkan satu batang seledri ke dalam Gelas A (merah) dan satu batang lainnya ke dalam Gelas B (biru). Pastikan daun tidak terendam air.",
    },
    {
      step: 4,
      title: "Observasi Berkala",
      desc: "Letakkan gelas di dekat jendela kelas yang terang. Amati pergerakan warna pada batang dan tulang daun pada menit ke-0, 15, dan 30.",
    },
    {
      step: 5,
      title: "Irisan Melintang Batang",
      desc: "Setelah 30 menit, potong melintang bagian tengah batang seledri. Amati titik-titik warna pembuluh xilem menggunakan kaca pembesar (lup).",
    },
  ],
  observationTable: {
    title: "Tabel Hasil Pengamatan Transportasi Xilem",
    columns: ["No", "Waktu Pengamatan", "Kondisi Pangkal Batang", "Kondisi Tulang Daun", "Perubahan Warna Cairan"],
    rows: [
      ["1", "Menit ke-0", "Hijau segar normal, belum ada warna", "Hijau segar alami", "Warna merah/biru pekat"],
      ["2", "Menit ke-15", "Bagian bawah mulai kemerahan/kebiruan", "Mulai muncul rona tipis di urat daun", "Permukaan air berkurang sedikit"],
      ["3", "Menit ke-30", "Batang sangat jelas menyerap warna", "Tulang daun jelas berubah warna", "Cairan terserap menuju daun"],
    ],
  },
  discussionQuestions: [
    {
      number: 1,
      question: "Berdasarkan pengamatanmu, apa yang terjadi pada air berwarna di dalam gelas setelah didiamkan selama 30 menit? Mengapa hal tersebut dapat terjadi?",
      cognitiveLevel: "HOTS - C4 (Menganalisis)",
      hint: "Hubungkan dengan kebutuhan tumbuhan terhadap air tanah.",
      blankLinesCount: 3,
    },
    {
      number: 2,
      question: "Bagian jaringan tumbuhan apa di dalam batang yang bertugas mengalirkan cairan dari bawah ke atas hingga ke helai daun? Jelaskan cara kerjanya secara sederhana!",
      cognitiveLevel: "HOTS - C4 (Mengaitkan Konsep)",
      hint: "Ingat istilah jaringan pembuluh angkut pengisap air.",
      blankLinesCount: 3,
    },
    {
      number: 3,
      question: "Jika sebuah pohon mangga di kebun sekolah disiram menggunakan air selokan yang tercemar limbah minyak berbahaya, ramalkan apa yang akan terjadi pada kesehatan daun dan kualitas buah mangga tersebut!",
      cognitiveLevel: "HOTS - C5 (Mengevaluasi & Memprediksi)",
      hint: "Bagaimana sifat pembuluh xilem dalam menyerap zat terlarut?",
      blankLinesCount: 4,
    },
  ],
  conclusionPrompt: "Tuliskan intisari penting penyelidikan kelompokmu mengenai fungsi batang dan jaringan pengangkut bagi kelangsungan hidup tumbuhan:",
  rubricReflection: {
    enableEmoticon: true,
    attitudeMetrics: [
      { aspect: "Gotong Royong & Pembagian Peran", scale: ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Aktif"] },
      { aspect: "Bernalar Kritis & Kejujuran Data", scale: ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Cermat"] },
      { aspect: "Kebersihan & Ketertiban Kerja", scale: ["Perlu Bimbingan", "Cukup", "Baik", "Sangat Rapi"] },
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

export function parseMarkdownToLKPD(markdown: string, baseData = DEFAULT_LKPD_DATA): LKPDData {
  if (!markdown || markdown.trim() === "") return baseData;

  const data: LKPDData = JSON.parse(JSON.stringify(baseData));
  data.rawMarkdown = markdown;

  const lines = markdown.split("\n");

  // Extract Title
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      data.title = trimmed.replace(/^#\s*/, "").replace(/\*\*/g, "").trim();
      break;
    }
  }

  // Extract metadata
  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes("topik") || l.includes("materi")) {
      const match = line.split(/:\s*/);
      if (match.length > 1) {
        data.headerInfo.topik = match[1].replace(/\*\*/g, "").trim();
        data.subTitle = data.headerInfo.topik;
      }
    }
    if (l.includes("kelas") || l.includes("fase")) {
      const match = line.split(/:\s*/);
      if (match.length > 1) {
        data.headerInfo.faseKelas = match[1].replace(/\*\*/g, "").trim();
      }
    }
    if (l.includes("alokasi")) {
      const match = line.split(/:\s*/);
      if (match.length > 1) {
        data.headerInfo.alokasiWaktu = match[1].replace(/\*\*/g, "").trim();
      }
    }
  }

  // Sections extraction
  let currentSection = "";
  const questions: string[] = [];
  const instructions: string[] = [];
  const steps: { title: string; desc: string }[] = [];
  const tools: string[] = [];
  const tableRows: string[][] = [];
  let tableHeaderCols: string[] = [];
  let readingTable = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith("### ") || line.startsWith("## ")) {
      currentSection = line.replace(/^#{2,3}\s+/, "").toLowerCase();
      readingTable = false;
      continue;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      
      // Skip markdown separator row |---|---|
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        continue;
      }

      if (!readingTable) {
        readingTable = true;
        tableHeaderCols = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      readingTable = false;
    }

    // Capture numbered or bulleted items
    if (/^\d+\.\s+/.test(line) || /^-\s+/.test(line)) {
      const cleanItem = line.replace(/^\d+\.\s+/, "").replace(/^-\s+/, "").replace(/\*\*/g, "").trim();

      if (currentSection.includes("petunjuk") || currentSection.includes("instruksi")) {
        instructions.push(cleanItem);
      } else if (currentSection.includes("alat") || currentSection.includes("bahan")) {
        tools.push(cleanItem);
      } else if (currentSection.includes("langkah") || currentSection.includes("kegiatan") || currentSection.includes("investigasi")) {
        steps.push({
          title: `Langkah ${steps.length + 1}`,
          desc: cleanItem,
        });
      } else if (currentSection.includes("pertanyaan") || currentSection.includes("diskusi") || currentSection.includes("soal")) {
        questions.push(cleanItem);
      }
    }
  }

  if (instructions.length > 0) {
    data.instructions = instructions;
  }

  if (tools.length > 0) {
    data.toolsAndMaterials = tools.map((t) => ({ name: t }));
  }

  if (steps.length > 0) {
    data.experimentSteps = steps.map((s, idx) => ({
      step: idx + 1,
      title: s.title,
      desc: s.desc,
    }));
  }

  if (tableHeaderCols.length > 0 && tableRows.length > 0) {
    data.observationTable = {
      title: "Tabel Data Pengamatan Kelompok",
      columns: tableHeaderCols,
      rows: tableRows,
    };
  }

  if (questions.length > 0) {
    data.discussionQuestions = questions.map((q, idx) => ({
      number: idx + 1,
      question: q,
      cognitiveLevel: idx === 0 ? "HOTS - C4 (Analisis)" : idx === 1 ? "HOTS - C4 (Penerapan)" : "HOTS - C5 (Evaluasi & Solusi)",
      blankLinesCount: 3,
    }));
  }

  return data;
}

export function generateLKPDWordDoc(lkpd: LKPDData): string {
  const toolsHtml = lkpd.toolsAndMaterials
    .map((t) => `<li>[ &nbsp; ] <strong>${t.name}</strong> ${t.note ? `<em>(${t.note})</em>` : ""}</li>`)
    .join("");

  const stepsHtml = lkpd.experimentSteps
    .map(
      (s) => `
      <div style="margin-bottom: 8px;">
        <strong>Langkah ${s.step}: ${s.title}</strong><br/>
        <span style="font-size: 10pt; color: #333;">${s.desc}</span>
      </div>`
    )
    .join("");

  const tableHeaderTh = lkpd.observationTable.columns
    .map((c) => `<th style="border: 1px solid #333; padding: 6px; background-color: #f1f5f9; text-align: center;">${c}</th>`)
    .join("");

  const tableRowsTd = lkpd.observationTable.rows
    .map(
      (row) => `
      <tr>
        ${row
          .map(
            (c, i) =>
              `<td style="border: 1px solid #333; padding: 8px; text-align: ${i === 0 ? "center" : "left"};">${c}</td>`
          )
          .join("")}
      </tr>`
    )
    .join("");

  const questionsHtml = lkpd.discussionQuestions
    .map(
      (q) => `
      <div style="margin-bottom: 15px;">
        <strong>${q.number}. ${q.question}</strong> 
        ${q.cognitiveLevel ? `<span style="font-size: 9pt; color: #0284c7;">[${q.cognitiveLevel}]</span>` : ""}<br/>
        <div style="margin-top: 6px; line-height: 25px; border-bottom: 1px dashed #999;">&nbsp;</div>
        <div style="line-height: 25px; border-bottom: 1px dashed #999;">&nbsp;</div>
        <div style="line-height: 25px; border-bottom: 1px dashed #999;">&nbsp;</div>
      </div>`
    )
    .join("");

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${lkpd.title}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #111; line-height: 1.35; padding: 20px; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 15px; }
        .kop h2 { margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold; }
        .kop h1 { margin: 2px 0; font-size: 16pt; text-transform: uppercase; font-weight: bold; }
        .kop p { margin: 0; font-size: 9pt; }
        .doc-title { text-align: center; font-size: 14pt; font-weight: bold; color: #1e3a8a; margin: 10px 0 4px 0; text-transform: uppercase; }
        .doc-subtitle { text-align: center; font-size: 11pt; font-weight: bold; color: #047857; margin-bottom: 15px; }
        .identity-box { width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1.5px solid #000; }
        .identity-box td { padding: 5px 8px; font-size: 10pt; vertical-align: top; }
        .section-header { background-color: #f1f5f9; padding: 5px 8px; font-size: 11pt; font-weight: bold; border-left: 4px solid #1e3a8a; margin-top: 15px; margin-bottom: 8px; }
        table.obs-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .box-ruled { border: 1px solid #666; padding: 10px; margin: 8px 0; min-height: 60px; line-height: 24px; }
        .signature-table { width: 100%; border-collapse: collapse; margin-top: 25px; }
        .signature-table td { text-align: center; font-size: 10pt; vertical-align: top; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${lkpd.headerInfo.dinas.replace("\n", "<br/>")}</h2>
        <h1>${lkpd.headerInfo.sekolah}</h1>
        <p>${lkpd.headerInfo.alamat}</p>
      </div>

      <div class="doc-title">${lkpd.title}</div>
      <div class="doc-subtitle">${lkpd.subTitle}</div>

      <!-- Identity Box -->
      <table class="identity-box">
        <tr>
          <td style="width: 55%; border-right: 1px solid #000;">
            <strong>Nama Kelompok:</strong> ....................................................<br/>
            <strong>Anggota:</strong><br/>
            1. ............................................................ &nbsp; (Ketua)<br/>
            2. ............................................................<br/>
            3. ............................................................<br/>
            4. ............................................................<br/>
            5. ............................................................
          </td>
          <td style="width: 25%; border-right: 1px solid #000;">
            <strong>Mata Pelajaran:</strong><br/>${lkpd.headerInfo.mataPelajaran}<br/><br/>
            <strong>Kelas / Fase:</strong> ${lkpd.headerInfo.faseKelas}<br/>
            <strong>Hari/Tanggal:</strong> .................................
          </td>
          <td style="width: 20%; text-align: center;">
            <strong>NILAI & PARAF GURU</strong>
            <div style="height: 55px; border: 1px dashed #666; margin: 6px 4px 4px 4px; display: flex; align-items: center; justify-content: center; font-size: 16pt; font-weight: bold; color: #999;">
              &nbsp;
            </div>
            <span style="font-size: 8pt; color: #666;">Catatan: ....................</span>
          </td>
        </tr>
      </table>

      <!-- Section A: Tujuan -->
      <div class="section-header">A. CAPAIAN & TUJUAN PENYELIDIKAN</div>
      <ul style="margin-top: 4px; padding-left: 20px; font-size: 10pt;">
        ${lkpd.learningGoals.map((g) => `<li>${g}</li>`).join("")}
      </ul>

      <!-- Section B: Petunjuk Belajar -->
      <div class="section-header">B. PETUNJUK KERJA & KESELAMATAN</div>
      <ol style="margin-top: 4px; padding-left: 20px; font-size: 10pt;">
        ${lkpd.instructions.map((ins) => `<li>${ins}</li>`).join("")}
      </ol>

      <!-- Section C: Alat dan Bahan -->
      <div class="section-header">C. ALAT DAN BAHAN PENYELIDIKAN (Centang saat persiapan)</div>
      <ul style="list-style-type: none; padding-left: 5px; font-size: 10pt;">
        ${toolsHtml}
      </ul>

      <!-- Section D: Langkah Kerja -->
      <div class="section-header">D. LANGKAH-LANGKAH PENYELIDIKAN ILMIAH</div>
      ${stepsHtml}

      <!-- Section E: Tabel Pengamatan -->
      <div class="section-header">E. TABEL HASIL PENGAMATAN OBSERVASI</div>
      <p style="font-size: 9.5pt; color: #444; margin: 2px 0;">Catatlah data perubahan yang teramati secara cermat:</p>
      <table class="obs-table">
        <thead><tr>${tableHeaderTh}</tr></thead>
        <tbody>${tableRowsTd}</tbody>
      </table>

      <!-- Section F: Pertanyaan Diskusi -->
      <div class="section-header">F. PERTANYAAN DISKUSI & PENALARAN KRITIS (HOTS)</div>
      ${questionsHtml}

      <!-- Section G: Kesimpulan -->
      <div class="section-header">G. KESIMPULAN KELOMPOK</div>
      <p style="font-size: 10pt;">${lkpd.conclusionPrompt}</p>
      <div class="box-ruled">
        <div style="line-height: 26px; border-bottom: 1px dashed #999;">&nbsp;</div>
        <div style="line-height: 26px; border-bottom: 1px dashed #999;">&nbsp;</div>
      </div>

      <!-- Section H: Refleksi & Rubrik -->
      <div class="section-header">H. REFLEKSI DIRI & EMOTIKON BELAJAR</div>
      <table style="width: 100%; border: 1px solid #cbd5e1; font-size: 9.5pt; text-align: center; margin-top: 5px;">
        <tr style="background-color: #f8fafc;">
          <th style="border: 1px solid #cbd5e1; padding: 6px;">Perasaan Belajar Hari Ini</th>
          <th style="border: 1px solid #cbd5e1; padding: 6px;">Kerjasama Kelompok</th>
          <th style="border: 1px solid #cbd5e1; padding: 6px;">Keaktifan Berpendapat</th>
        </tr>
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">
            [ &nbsp; ] Sangat Senang (😃)<br/>
            [ &nbsp; ] Cukup Paham (🙂)<br/>
            [ &nbsp; ] Butuh Bantuan (🤔)
          </td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">
            [ &nbsp; ] Sangat Kompak<br/>
            [ &nbsp; ] Cukup Membantu<br/>
            [ &nbsp; ] Masih Perlu Diingatkan
          </td>
          <td style="border: 1px solid #cbd5e1; padding: 8px;">
            [ &nbsp; ] Selalu Bertanya/Menjawab<br/>
            [ &nbsp; ] Kadang Berpendapat<br/>
            [ &nbsp; ] Lebih Banyak Mendengar
          </td>
        </tr>
      </table>

      <!-- Signatures -->
      <table class="signature-table">
        <tr>
          <td style="width: 50%;">
            Mengetahui,<br/>
            Kepala SD Negeri 3 Banjar Ratu<br/><br/><br/><br/>
            <strong>${lkpd.teacherSignature.namaKepsek}</strong><br/>
            NIP. ${lkpd.teacherSignature.nipKepsek}
          </td>
          <td style="width: 50%;">
            Banjar Ratu, ......................... 2024<br/>
            Guru Kelas IV / Guru Pendamping<br/><br/><br/><br/>
            <strong>${lkpd.teacherSignature.namaGuru}</strong><br/>
            NIP. ${lkpd.teacherSignature.nipGuru}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
