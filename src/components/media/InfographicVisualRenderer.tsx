import React, { useRef, useState } from "react";
import {
  Download,
  Printer,
  Sparkles,
  ArrowDown,
  Layers,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { toPng } from "html-to-image";
import { GeneratedMediaData } from "../../types/media";

interface InfographicProps {
  data: GeneratedMediaData;
}

export const InfographicVisualRenderer: React.FC<InfographicProps> = ({ data }) => {
  const infoRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPng = async () => {
    if (!infoRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(infoRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Infografis_${data.title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export infographic PNG:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const elements = data.posterElements && data.posterElements.length > 0
    ? data.posterElements
    : [
        { step: 1, title: "Tahap 1: Pengenalan Fenomena", description: "Mengamati lingkungan sekitar dan mengidentifikasi masalah nyata.", icon: "sun", tag: "Apersepsi" },
        { step: 2, title: "Tahap 2: Eksplorasi Saintifik", description: "Melakukan penyelidikan kelompok menggunakan panduan LKPD berjenjang.", icon: "zap", tag: "Hands-on" },
        { step: 3, title: "Tahap 3: Konstruksi Konsep", description: "Menghubungkan fakta eksperimen dengan teori Kurikulum Merdeka.", icon: "book", tag: "Diskusi" },
        { step: 4, title: "Tahap 4: Aksi dan Refleksi", description: "Merumuskan solusi berkelanjutan dan komitmen bersama di kelas.", icon: "star", tag: "Aplikasi" },
      ];

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            Infografis Alur Pembelajaran (Langsung Tampil)
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Didesain vertikal berurutan dengan diagram langkah pedagogis.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "Menyiapkan..." : "Unduh Infografis (PNG)"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar</span>
          </button>
        </div>
      </div>

      {/* Main Infographic Canvas */}
      <div className="flex justify-center bg-slate-100/70 p-3 sm:p-6 rounded-3xl border border-slate-200 overflow-x-auto">
        <div
          ref={infoRef}
          id="printable-infographic"
          className="w-full max-w-[650px] bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-800 select-none"
        >
          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-6 text-white text-center shadow-md relative overflow-hidden">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-2 backdrop-blur-xs">
              INFOGRAFIS EDUKASI KURIKULUM MERDEKA
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{data.title}</h2>
            <p className="text-xs text-emerald-100 mt-1 font-medium">{data.subtitle}</p>
          </div>

          {/* Quick Context Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Peta Pemikiran & Ringkasan Materi
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {data.conceptSummary}
            </p>
          </div>

          {/* Step-by-Step Flow Roadmap */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-purple-500">
            {elements.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white border-2 border-emerald-500 shadow-md flex items-center justify-center font-black text-[10px] text-emerald-700">
                  {idx + 1}
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.tag || `Langkah 0${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Fase Terpadu
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Metric / Fun Fact Section */}
          {data.funFact && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                💡
              </div>
              <div>
                <h5 className="text-xs font-black text-amber-900">Poin Penting untuk Siswa:</h5>
                <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed font-medium">
                  {data.funFact}
                </p>
              </div>
            </div>
          )}

          {/* Color Palette Display */}
          {data.palette && data.palette.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-600">Palet Warna Visual:</span>
              <div className="flex items-center gap-1.5">
                {data.palette.map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-md shadow-2xs border border-slate-300"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <span>SD Negeri 3 Banjar Ratu • Kelas 4 SD</span>
            <span>Kurikulum Merdeka 2024/2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};
