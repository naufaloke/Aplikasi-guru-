import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  Packer,
} from "docx";
import { CompleteModulePlan } from "../types/modulePlan";

export const DocxExportService = {
  async exportModuleToDocx(plan: CompleteModulePlan, customFilename?: string): Promise<void> {
    const filename =
      customFilename ||
      `Modul_Ajar_${plan.identity.mataPelajaran.replace(/\s+/g, "_")}_${plan.identity.kelas.replace(
        /\s+/g,
        "_"
      )}_${plan.identity.materiPokok.replace(/\s+/g, "_")}.docx`;

    const children: any[] = [];

    // 1. COVER PAGE
    if (plan.styling.coverStyle !== "none") {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: "MODUL AJAR KURIKULUM MERDEKA",
              bold: true,
              size: 32, // 16pt
              color: "1E3A8A",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "PEMBELAJARAN MENDALAM (DEEP LEARNING)",
              size: 24, // 12pt
              bold: true,
              color: "047857",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 800, after: 100 },
          children: [
            new TextRun({
              text: plan.identity.mataPelajaran.toUpperCase(),
              bold: true,
              size: 36, // 18pt
              color: "1E40AF",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: `TOPIK: ${plan.identity.materiPokok.toUpperCase()}`,
              bold: true,
              size: 28, // 14pt
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
          children: [
            new TextRun({
              text: `${plan.identity.kelas.toUpperCase()} / FASE ${plan.identity.fase.toUpperCase()}`,
              bold: true,
              size: 24,
              color: "475569",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200, after: 80 },
          children: [
            new TextRun({
              text: "Disusun Oleh:",
              size: 22,
              italics: true,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: plan.identity.namaGuru,
              bold: true,
              size: 26,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
            new TextRun({
              text: `NIP. ${plan.identity.nip || "-"}`,
              size: 22,
              color: "475569",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600, after: 60 },
          children: [
            new TextRun({
              text: plan.identity.namaSekolah.toUpperCase(),
              bold: true,
              size: 28,
              color: "1E3A8A",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [
            new TextRun({
              text: `TAHUN AJARAN ${plan.identity.tahunAjaran}`,
              bold: true,
              size: 22,
            }),
          ],
        }),
        // Page break after cover
        new Paragraph({
          pageBreakBefore: true,
        })
      );
    }

    // 2. IDENTITAS MODUL
    children.push(
      new Paragraph({
        text: "I. INFORMASI UMUM",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 120 },
      }),
      createFieldParagraph("A. Identitas Modul", ""),
      createBulletParagraph("Nama Sekolah", plan.identity.namaSekolah),
      createBulletParagraph("Nama Penyusun", plan.identity.namaGuru),
      createBulletParagraph("NIP / NUPTK", plan.identity.nip || "-"),
      createBulletParagraph("Jenjang / Fase / Kelas", `${plan.identity.jenjang} / Fase ${plan.identity.fase} / ${plan.identity.kelas}`),
      createBulletParagraph("Mata Pelajaran", plan.identity.mataPelajaran),
      createBulletParagraph("Materi Pokok / Submateri", `${plan.identity.materiPokok} (${plan.identity.submateri || "-"})`),
      createBulletParagraph("Semester / Tahun Ajaran", `${plan.identity.semester} / ${plan.identity.tahunAjaran}`),
      createBulletParagraph("Alokasi Waktu", plan.identity.alokasiWaktu),

      createFieldParagraph("B. Kompetensi Awal", plan.modulCore.kompetensiAwal),
      createFieldParagraph("C. Profil Pelajar Pancasila", plan.modulCore.profilPelajarPancasila.join("; ")),
      createFieldParagraph("D. Sarana dan Prasarana", plan.modulCore.saranaPrasarana),
      createFieldParagraph("E. Target Peserta Didik", plan.modulCore.targetPesertaDidik),
      createFieldParagraph("F. Model Pembelajaran", `${plan.karakter.model} dengan Pendekatan ${plan.karakter.pendekatan}`),

      // II. KOMPONEN INTI
      new Paragraph({
        text: "II. KOMPONEN INTI",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 120 },
      }),
      createFieldParagraph("A. Capaian Pembelajaran (CP)", plan.cp.rumusanCP),
      createFieldParagraph("B. Tujuan Pembelajaran (TP)", ""),
      ...plan.tp.map(
        (t, idx) =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${t.kode}: `, bold: true }),
              new TextRun({ text: t.deskripsi }),
              new TextRun({ text: ` [KKO: ${t.kko} - ${t.levelKognitif}]`, italics: true, color: "047857" }),
            ],
          })
      ),
      createFieldParagraph("C. Pemahaman Bermakna (Meaningful Learning)", plan.modulCore.pemahamanBermakna),
      createFieldParagraph("D. Pertanyaan Pemantik", ""),
      ...plan.modulCore.pertanyaanPemantik.map(
        (q) =>
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: q, italics: true })],
          })
      ),

      // KEGIATAN PEMBELAJARAN
      createFieldParagraph("E. Kegiatan Pembelajaran", ""),
      new Paragraph({
        text: `1. Kegiatan Pendahuluan (${plan.kegiatan.pendahuluan.alokasiWaktu})`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 100, after: 50 },
      }),
      createBulletParagraph("Salam & Doa", plan.kegiatan.pendahuluan.salamDoa),
      createBulletParagraph("Apersepsi & Presensi", plan.kegiatan.pendahuluan.presensiApersepsi),
      createBulletParagraph("Motivasi & Tujuan", plan.kegiatan.pendahuluan.motivasiTujuan),

      new Paragraph({
        text: "2. Kegiatan Inti (Sintaks Pembelajaran Terpadu)",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 50 },
      }),
      ...plan.kegiatan.inti.flatMap((fase) => [
        new Paragraph({
          children: [
            new TextRun({ text: `• ${fase.fase} (${fase.alokasiWaktu})`, bold: true, color: "1E40AF" }),
          ],
          spacing: { before: 80, after: 40 },
        }),
        ...fase.aktivitas.map(
          (act) =>
            new Paragraph({
              indent: { left: 400 },
              children: [new TextRun({ text: `- ${act}` })],
            })
        ),
      ]),

      new Paragraph({
        text: `3. Kegiatan Penutup (${plan.kegiatan.penutup.alokasiWaktu})`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 50 },
      }),
      createBulletParagraph("Rangkuman & Kesimpulan", plan.kegiatan.penutup.kesimpulan),
      createBulletParagraph("Refleksi 3-2-1", plan.kegiatan.penutup.refleksi),
      createBulletParagraph("Evaluasi & Tindak Lanjut", plan.kegiatan.penutup.evaluasiTindakLanjut),

      // PEMBELAJARAN MENDALAM & DIFERENSIASI
      createFieldParagraph("F. Pembelajaran Mendalam (Deep Learning)", ""),
      createBulletParagraph("Berkesadaran (Mindful)", plan.deepLearning.berkesadaran),
      createBulletParagraph("Bermakna (Meaningful)", plan.deepLearning.bermakna),
      createBulletParagraph("Menggembirakan (Joyful)", plan.deepLearning.menggembirakan),

      createFieldParagraph("G. Diferensiasi Pembelajaran", ""),
      createBulletParagraph("Diferensiasi Konten", plan.diferensiasi.konten),
      createBulletParagraph("Diferensiasi Proses", plan.diferensiasi.proses),
      createBulletParagraph("Diferensiasi Produk", plan.diferensiasi.produk),

      // ASESMEN & LEMBAR PENGESAHAN
      createFieldParagraph("H. Rancangan Asesmen", ""),
      createBulletParagraph("Asesmen Diagnostik", `${plan.asesmen.diagnostik.kognitif} (${plan.asesmen.diagnostik.teknik})`),
      createBulletParagraph("Asesmen Formatif", `${plan.asesmen.formatif.teknik} - ${plan.asesmen.formatif.instrumen}`),
      createBulletParagraph("Asesmen Sumatif", `${plan.asesmen.sumatif.teknik} (${plan.asesmen.sumatif.bentuk})`),

      // LEMBAR PENGESAHAN
      new Paragraph({
        spacing: { before: 600, after: 100 },
        children: [
          new TextRun({
            text: `Mengetahui,\t\t${plan.identity.namaSekolah.includes("Banjar") ? "Banjar Ratu" : "Tempat"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
            bold: true,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Kepala Sekolah,\t\tGuru Kelas / Mata Pelajaran" }),
        ],
        spacing: { after: 800 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `${plan.identity.namaKepsek || "Drs. H. Mulyono, M.Pd."}\t\t${plan.identity.namaGuru}`, bold: true }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `NIP. ${plan.identity.nipKepsek || "196805121992031004"}\t\tNIP. ${plan.identity.nip || "-"}` }),
        ],
        spacing: { after: 400 },
      })
    );

    // 39. LAMPIRAN 1 - BAHAN AJAR
    if (plan.styling.lampiran.bahanAjar) {
      children.push(
        new Paragraph({ text: "LAMPIRAN 1 – BAHAN AJAR SISWA", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        new Paragraph({ text: plan.bahanAjar.judul, heading: HeadingLevel.HEADING_2, spacing: { after: 120 } }),
        createFieldParagraph("Pengantar", plan.bahanAjar.pengantar),
        createFieldParagraph("Konsep Utama", plan.bahanAjar.konsepUtama),
        createFieldParagraph("Uraian Materi", plan.bahanAjar.penjelasanMateri),
        createFieldParagraph("Aplikasi Nyata", plan.bahanAjar.contohAplikasi),
        createFieldParagraph("Rangkuman", plan.bahanAjar.rangkuman)
      );
    }

    // LAMPIRAN 2 - LKPD
    if (plan.styling.lampiran.lkpd) {
      children.push(
        new Paragraph({ text: "LAMPIRAN 2 – LEMBAR KERJA PESERTA DIDIK (LKPD)", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        new Paragraph({ text: plan.lkpd.judul, heading: HeadingLevel.HEADING_2, spacing: { after: 120 } }),
        createFieldParagraph("Tujuan Kegiatan", plan.lkpd.tujuan),
        createFieldParagraph("Alat dan Bahan", plan.lkpd.alatBahan.join(", ")),
        createFieldParagraph("Petunjuk Pengerjaan", plan.lkpd.petunjuk.join("; ")),
        createFieldParagraph("Langkah Kerja", plan.lkpd.langkahKegiatan.join("; "))
      );

      // LKPD Table
      if (plan.lkpd.tabelPengamatan && plan.lkpd.tabelPengamatan.headers) {
        const tableRows = [
          new TableRow({
            children: plan.lkpd.tabelPengamatan.headers.map(
              (h) =>
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                  width: { size: 2000, type: WidthType.DXA },
                })
            ),
          }),
          ...plan.lkpd.tabelPengamatan.rows.map(
            (row) =>
              new TableRow({
                children: row.map(
                  (cell) =>
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: cell })] })],
                      width: { size: 2000, type: WidthType.DXA },
                    })
                ),
              })
          ),
        ];

        children.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          createFieldParagraph("Kesimpulan LKPD", plan.lkpd.kesimpulan)
        );
      }
    }

    // LAMPIRAN 3 - KISI-KISI
    if (plan.styling.lampiran.kisiKisi && plan.kisiKisi.length > 0) {
      children.push(
        new Paragraph({ text: "LAMPIRAN 3 – KISI-KISI ASESMEN", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: ["No", "Materi", "Indikator Soal", "Level Kognitif", "Bentuk Soal", "No Soal"].map(
                (h) =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                  })
              ),
            }),
            ...plan.kisiKisi.map(
              (k) =>
                new TableRow({
                  children: [k.no.toString(), k.materi, k.indikator, k.levelKognitif, k.bentukSoal, k.noSoal.toString()].map(
                    (val) =>
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: val })] })],
                      })
                  ),
                })
            ),
          ],
        })
      );
    }

    // LAMPIRAN 4 & 5 - SOAL & KUNCI JAWABAN
    if (plan.styling.lampiran.soal && plan.bankSoal.length > 0) {
      children.push(
        new Paragraph({ text: "LAMPIRAN 4 – SOAL ASESMEN (HOTS & BERSTIMULUS)", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        ...plan.bankSoal.flatMap((q) => [
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: `Soal No. ${q.no} [${q.tipe} - Level ${q.levelKognitif}]: `, bold: true }),
              new TextRun({ text: q.stimulus ? `(Stimulus: ${q.stimulus}) ` : "", italics: true }),
              new TextRun({ text: q.pertanyaan }),
            ],
          }),
          ...(q.pilihanJawaban || []).map(
            (opt) =>
              new Paragraph({
                indent: { left: 400 },
                children: [new TextRun({ text: opt })],
              })
          ),
        ])
      );

      if (plan.styling.lampiran.kunciJawaban) {
        children.push(
          new Paragraph({ text: "LAMPIRAN 5 – KUNCI JAWABAN & PEDOMAN PENSKORAN", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
          ...plan.bankSoal.map(
            (q) =>
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({ text: `Kunci No. ${q.no}: `, bold: true }),
                  new TextRun({ text: q.kunciJawaban, bold: true, color: "047857" }),
                  new TextRun({ text: ` | Skor Maks: ${q.skorMaks}` }),
                  new TextRun({ text: q.pembahasan ? `\n(Pembahasan: ${q.pembahasan})` : "", italics: true }),
                ],
              })
          )
        );
      }
    }

    // LAMPIRAN 6 - RUBRIK PENILAIAN
    if (plan.styling.lampiran.rubrik && plan.rubrik.length > 0) {
      children.push(
        new Paragraph({ text: "LAMPIRAN 6 – RUBRIK PENILAIAN AUTENTIK", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: ["Aspek Penilaian", "Sangat Baik (4)", "Baik (3)", "Cukup (2)", "Perlu Bimbingan (1)"].map(
                (h) =>
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                  })
              ),
            }),
            ...plan.rubrik.map(
              (r) =>
                new TableRow({
                  children: [r.aspek, r.skor4, r.skor3, r.skor2, r.skor1].map(
                    (v) =>
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: v })] })],
                      })
                  ),
                })
            ),
          ],
        })
      );
    }

    // Create Document with Header and Footer (Page Numbers)
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: plan.styling.customMargin.top * 56.7,
                bottom: plan.styling.customMargin.bottom * 56.7,
                left: plan.styling.customMargin.left * 56.7,
                right: plan.styling.customMargin.right * 56.7,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${plan.identity.namaSekolah} | Modul Ajar | ${plan.identity.mataPelajaran}`,
                      size: 18, // 9pt
                      color: "94A3B8",
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `T.A. ${plan.identity.tahunAjaran} | Guru: ${plan.identity.namaGuru}`,
                      size: 18,
                      color: "94A3B8",
                    }),
                    new TextRun({
                      text: " | Hal. ",
                      size: 18,
                      color: "94A3B8",
                    }),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 18,
                      color: "94A3B8",
                    }),
                  ],
                }),
              ],
            }),
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

function createFieldParagraph(title: string, content: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: "1E3A8A" }),
      new TextRun({ text: content }),
    ],
  });
}

function createBulletParagraph(label: string, content: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: content }),
    ],
  });
}
