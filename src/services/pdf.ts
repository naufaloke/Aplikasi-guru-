import { jsPDF } from "jspdf";

export const ExportService = {
  // Export Text/Markdown content as PDF
  exportTextPDF: (title: string, content: string, filename = "Dokumen_Guru_AI.pdf") => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - margin * 2;

    // Header KOP Surat
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("PEMERINTAH KABUPATEN LAMPUNG TENGAH", pageWidth / 2, 16, { align: "center" });
    doc.setFontSize(16);
    doc.text("SD NEGERI 3 BANJAR RATU", pageWidth / 2, 23, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Alamat: Jl. Raya Lintas Sumatra No. 45, Banjar Ratu, Kec. Way Pengubuan", pageWidth / 2, 28, { align: "center" });
    doc.setLineWidth(0.7);
    doc.line(margin, 31, pageWidth - margin, 31);
    doc.setLineWidth(0.2);
    doc.line(margin, 32, pageWidth - margin, 32);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title.toUpperCase(), pageWidth / 2, 40, { align: "center" });

    // Body content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Clean markdown hashes/stars
    const cleanLines = content
      .replace(/#/g, "")
      .replace(/\*\*/g, "")
      .split("\n");

    let y = 48;
    for (const line of cleanLines) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      if (line.trim() === "") {
        y += 4;
        continue;
      }

      const splitText = doc.splitTextToSize(line, maxLineWidth);
      doc.text(splitText, margin, y);
      y += splitText.length * 5;
    }

    // Signatures
    if (y > 240) {
      doc.addPage();
      y = 30;
    } else {
      y += 15;
    }

    doc.setFont("helvetica", "normal");
    doc.text("Mengetahui,", margin + 10, y);
    doc.text("Banjar Ratu, " + new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), pageWidth - margin - 60, y);
    doc.text("Kepala SD Negeri 3 Banjar Ratu", margin + 10, y + 5);
    doc.text("Guru Kelas / Mata Pelajaran", pageWidth - margin - 60, y + 5);

    y += 25;
    doc.setFont("helvetica", "bold");
    doc.text("Drs. H. Mulyono, M.Pd.", margin + 10, y);
    doc.text("Budi Santoso, S.Pd., Gr.", pageWidth - margin - 60, y);
    doc.setFont("helvetica", "normal");
    doc.text("NIP. 196805121992031004", margin + 10, y + 4);
    doc.text("NIP. 198807142014021003", pageWidth - margin - 60, y + 4);

    doc.save(filename);
  },

  // Export content to Microsoft Word (.doc format readable by Word & Docs)
  exportToWord: (title: string, content: string, filename = "Dokumen_Guru_AI.doc") => {
    const formattedHtml = content
      .replace(/\n\n/g, "<p></p>")
      .replace(/\n/g, "<br/>")
      .replace(/### (.*?)(<br\/>|<\/p>|$)/g, "<h3>$1</h3>")
      .replace(/## (.*?)(<br\/>|<\/p>|$)/g, "<h2>$1</h2>")
      .replace(/# (.*?)(<br\/>|<\/p>|$)/g, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; }
          h1 { font-size: 16pt; color: #1e3a8a; text-align: center; }
          h2 { font-size: 13pt; color: #1e40af; border-bottom: 1px solid #93c5fd; padding-bottom: 4px; margin-top: 18px; }
          h3 { font-size: 11pt; color: #047857; margin-top: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="kop">
          <strong>PEMERINTAH KABUPATEN LAMPUNG TENGAH<br>DINAS PENDIDIKAN DAN KEBUDAYAAN</strong><br>
          <strong style="font-size: 14pt;">SD NEGERI 3 BANJAR RATU</strong><br>
          <span style="font-size: 9pt;">Alamat: Jl. Raya Lintas Sumatra No. 45, Banjar Ratu, Kec. Way Pengubuan</span>
        </div>
        <h1>${title}</h1>
        <div>${formattedHtml}</div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlContent], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export content to PowerPoint (.html formatted presentation slide deck)
  exportToPPT: (title: string, slides: { heading: string; points: string[] }[], filename = "Slide_Presentasi_Guru_AI.html") => {
    const slideCards = slides
      .map(
        (s, idx) => `
        <div class="slide">
          <div class="slide-num">Slide ${idx + 1} / ${slides.length}</div>
          <h2 class="slide-title">${s.heading}</h2>
          <ul class="slide-list">
            ${s.points.map((p) => `<li>${p}</li>`).join("")}
          </ul>
        </div>
      `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title} - Slide Presentasi</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 30px; }
          h1 { text-align: center; color: #38bdf8; margin-bottom: 30px; font-size: 28px; }
          .slide-container { display: flex; flex-direction: column; gap: 30px; max-width: 900px; margin: 0 auto; }
          .slide { background: linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid #3b82f6; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); min-height: 380px; position: relative; }
          .slide-num { position: absolute; top: 20px; right: 25px; font-size: 13px; color: #94a3b8; }
          .slide-title { font-size: 24px; color: #60a5fa; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-top: 0; }
          .slide-list { font-size: 18px; line-height: 1.8; color: #e2e8f0; margin-top: 25px; padding-left: 25px; }
          .slide-list li { margin-bottom: 12px; }
          @media print {
            body { background: #fff; color: #000; padding: 0; }
            .slide { page-break-after: always; border: 1px solid #ccc; background: #fff; color: #000; box-shadow: none; }
            .slide-title { color: #1e3a8a; }
            .slide-list { color: #333; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="slide-container">
          ${slideCards}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
