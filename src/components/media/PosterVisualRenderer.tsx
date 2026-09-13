import React, { useRef, useState } from "react";
import {
  Download,
  Printer,
  Edit3,
  Check,
  Sparkles,
  Droplets,
  Sun,
  Cloud,
  Leaf,
  Star,
  BookOpen,
  Zap,
  Info,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { toPng } from "html-to-image";
import { GeneratedMediaData, PosterElement } from "../../types/media";

interface PosterProps {
  data: GeneratedMediaData;
  onUpdateTitle?: (title: string) => void;
  onUpdateSubtitle?: (subtitle: string) => void;
}

export const PosterVisualRenderer: React.FC<PosterProps> = ({ data }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(data.title);
  const [customSubtitle, setCustomSubtitle] = useState(data.subtitle);
  const [customFunFact, setCustomFunFact] = useState(data.funFact || "Air adalah sumber kehidupan!");

  // Keep synced if data changes
  React.useEffect(() => {
    setCustomTitle(data.title);
    setCustomSubtitle(data.subtitle);
    if (data.funFact) setCustomFunFact(data.funFact);
  }, [data]);

  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      // Small timeout to ensure fonts and layout are ready
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Poster_${data.title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate PNG poster:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case "sun":
        return <Sun className="w-5 h-5 text-amber-500" />;
      case "cloud":
        return <Cloud className="w-5 h-5 text-sky-500" />;
      case "droplet":
      case "droplets":
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case "leaf":
        return <Leaf className="w-5 h-5 text-emerald-500" />;
      case "zap":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case "book":
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      default:
        return <Star className="w-5 h-5 text-purple-500" />;
    }
  };

  const isWaterCycle = data.topic.toLowerCase().includes("air") || data.topic.toLowerCase().includes("siklus");
  const isPlants = data.topic.toLowerCase().includes("fotosintesis") || data.topic.toLowerCase().includes("daun") || data.topic.toLowerCase().includes("tumbuhan");

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Hasil Visual Siap Pakai
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Langsung tampil tanpa perlu aplikasi lain. Siap cetak atau unduh.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isEditing
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? "Selesai Edit" : "Edit Teks Poster"}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? "Memproses..." : "Unduh Gambar (PNG)"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak (A4)</span>
          </button>
        </div>
      </div>

      {/* Main Poster Canvas (Canva-style High Resolution) */}
      <div className="flex justify-center bg-slate-100/70 p-3 sm:p-6 rounded-3xl border border-slate-200 overflow-x-auto">
        <div
          ref={posterRef}
          id="printable-poster"
          className="w-full max-w-[620px] bg-gradient-to-b from-sky-50 via-white to-blue-50/40 rounded-3xl shadow-2xl border-4 border-white p-6 sm:p-8 relative overflow-hidden transition-all text-slate-800 font-sans select-none"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-blue-400/20 via-sky-300/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-emerald-400/15 via-blue-200/10 to-transparent rounded-tr-full pointer-events-none" />

          {/* School & Curriculum Header Badge */}
          <div className="flex items-center justify-between border-b border-blue-100/80 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                G
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                  SD NEGERI 3 BANJAR RATU
                </p>
                <p className="text-[9px] font-semibold text-slate-500">
                  Media Pembelajaran Bermakna Kurikulum Merdeka
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-800 text-[10px] font-extrabold tracking-wide border border-blue-200">
              {data.badge || "POSTER EDUKASI 3D"}
            </span>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            {isEditing ? (
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full text-center text-xl sm:text-2xl font-black text-slate-900 bg-amber-50/80 border border-amber-300 rounded-xl px-2 py-1 outline-none"
              />
            ) : (
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {customTitle}
              </h2>
            )}

            {isEditing ? (
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                className="w-full text-center text-xs font-semibold text-blue-700 bg-amber-50/80 border border-amber-300 rounded-xl px-2 py-0.5 mt-1 outline-none"
              />
            ) : (
              <p className="text-xs sm:text-sm font-bold text-blue-600 mt-1">
                {customSubtitle}
              </p>
            )}
          </div>

          {/* Dynamic Visual Illustration Card (Centerpiece) */}
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-white shadow-lg relative overflow-hidden">
            {/* SVG Visual Composition representing the topic */}
            {isWaterCycle ? (
              <div className="relative h-44 w-full flex items-center justify-around overflow-hidden">
                {/* Sun */}
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/60 flex items-center justify-center text-amber-700 border-2 border-yellow-100">
                    <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-yellow-200">Panas Matahari</span>
                </div>

                {/* Evaporation Arrow */}
                <div className="text-center">
                  <div className="text-xs font-black tracking-wider text-sky-200">1. EVAPORASI ➔</div>
                  <div className="text-[10px] text-sky-100/90">Uap air naik ke atas</div>
                </div>

                {/* Cloud with Rain */}
                <div className="flex flex-col items-center">
                  <div className="px-3 py-2 rounded-2xl bg-white/90 text-blue-800 shadow-md flex items-center gap-1.5">
                    <Cloud className="w-7 h-7 text-sky-500" />
                    <span className="text-[10px] font-extrabold text-blue-900">2. KONDENSASI</span>
                  </div>
                  <div className="flex gap-1 mt-2 animate-bounce">
                    <Droplets className="w-3.5 h-3.5 text-sky-300" />
                    <Droplets className="w-3.5 h-3.5 text-blue-200" />
                    <Droplets className="w-3.5 h-3.5 text-sky-300" />
                  </div>
                  <span className="text-[9px] font-bold text-sky-200 mt-0.5">3. PRESIPITASI (Hujan)</span>
                </div>
              </div>
            ) : isPlants ? (
              <div className="relative h-44 w-full flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <Sun className="w-10 h-10 text-yellow-300" />
                  <span className="text-[10px] font-bold text-yellow-100 mt-1">Cahaya Matahari</span>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/95 text-slate-800 shadow-md text-center">
                  <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-black text-emerald-800">Dapur Fotosintesis</p>
                  <p className="text-[10px] text-slate-600">Air + CO2 ➔ Oksigen + Makanan</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Droplets className="w-7 h-7 text-sky-300" />
                  <span className="text-[10px] font-bold text-sky-200">Air Tanah (Akar)</span>
                </div>
              </div>
            ) : (
              <div className="relative h-36 w-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner">
                  <Sparkles className="w-7 h-7 text-yellow-300" />
                </div>
                <h3 className="text-base font-black text-white">{data.topic}</h3>
                <p className="text-xs text-blue-100 mt-1 max-w-md line-clamp-2">
                  {data.conceptSummary}
                </p>
              </div>
            )}

            {/* Sub-label banner */}
            <div className="mt-2 text-center text-[10px] font-medium text-blue-100 bg-black/20 py-1 px-3 rounded-lg backdrop-blur-xs">
              💡 Ilustrasi Konseptual 3D Edukatif • Berkesadaran, Bermakna, Menggembirakan
            </div>
          </div>

          {/* Concept Summary Paragraph */}
          <div className="mb-5 bg-white/95 p-3.5 rounded-2xl border border-blue-100 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-extrabold text-blue-900">Inti Pembelajaran:</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {data.conceptSummary}
            </p>
          </div>

          {/* 4 Steps / Educational Element Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {(data.posterElements || []).map((el, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                  {renderIcon(el.icon)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {el.step || idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{el.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug mt-1">{el.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fun Fact / Tahukah Kamu */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200/80 mb-5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
              ★
            </div>
            <div>
              <p className="text-[11px] font-black text-amber-900">Tahukah Kamu?</p>
              {isEditing ? (
                <textarea
                  value={customFunFact}
                  onChange={(e) => setCustomFunFact(e.target.value)}
                  className="w-full text-[11px] text-amber-950 bg-white/80 border border-amber-300 rounded-lg p-1.5 mt-1 outline-none"
                  rows={2}
                />
              ) : (
                <p className="text-[11px] text-amber-800/90 leading-snug font-medium">
                  {customFunFact}
                </p>
              )}
            </div>
          </div>

          {/* Poster Footer Branding */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Perangkat Ajar Sah Kurikulum Merdeka
            </span>
            <span>Dibuat dengan Guru AI Indonesia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
