import React, { useState } from "react";
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Sparkles,
  BookOpen,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { GeneratedMediaData, SlideItem } from "../../types/media";

interface SlideProps {
  data: GeneratedMediaData;
}

export const SlideVisualRenderer: React.FC<SlideProps> = ({ data }) => {
  const slides: SlideItem[] = data.slides && data.slides.length > 0
    ? data.slides
    : [
        {
          id: 1,
          slideNumber: 1,
          title: data.title,
          subtitle: data.subtitle,
          bullets: [
            "Menjelajahi keajaiban ilmu pengetahuan di sekitar kita",
            "Membangun rasa syukur kepada Tuhan YME",
            "Belajar bersama secara aktif, gembira, dan bermakna",
          ],
          visualConcept: "Cover presentasi ceria dengan ilustrasi 3D ramah anak",
          teacherNote: "Sapa peserta didik dengan antusias, lakukan ice breaking tepuk semangat sebelum membuka slide kedua.",
        },
        {
          id: 2,
          slideNumber: 2,
          title: "Pertanyaan Pemantik & Rasa Ingin Tahu",
          subtitle: "Mari Menjadi Penyelidik Hebat!",
          bullets: [
            "Pernahkah kamu memperhatikan bagaimana alam bekerja?",
            "Mengapa fenomena ini terjadi setiap hari tanpa henti?",
            "Apa yang akan terjadi jika siklus ini terganggu?",
          ],
          visualConcept: "Ilustrasi anak SD memegang kaca pembesar dan buku catatan eksplorasi",
          teacherNote: "Minta 2-3 siswa mengemukakan pendapat awal. Tidak ada jawaban yang salah pada tahap ini.",
        },
        {
          id: 3,
          slideNumber: 3,
          title: "Konsep Kunci Pembelajaran",
          subtitle: "Inti Materi Kurikulum Merdeka",
          bullets: [
            "Memahami hubungan sebab dan akibat secara logis",
            "Menganalisis tahapan perubahan proses secara urut",
            "Menghubungkan teori buku dengan contoh nyata di lingkungan sekolah",
          ],
          visualConcept: "Diagram visual interaktif dengan panah alur bertahap",
          teacherNote: "Gunakan analogi sederhana yang dekat dengan keseharian mereka di rumah atau halaman sekolah.",
        },
        {
          id: 4,
          slideNumber: 4,
          title: "Aktivitas Kolaborasi Kelompok",
          subtitle: "Hands-on Discovery & Eksperimen",
          bullets: [
            "Bekerja sama dalam kelompok heterogen 4-5 siswa",
            "Mencatat hasil penyelidikan pada Lembar Kerja (LKPD)",
            "Menyajikan hasil karya secara percaya diri di depan kelas",
          ],
          visualConcept: "Foto kelompok belajar murid ceria sedang berdiskusi aktif",
          teacherNote: "Kelilingi setiap meja kelompok untuk memberikan scaffolding dan penguatan positif.",
        },
        {
          id: 5,
          slideNumber: 5,
          title: "Refleksi & Pesan Bermakna",
          subtitle: "Menjadi Pelajar Pancasila yang Peduli",
          bullets: [
            "Apa hal baru paling berkesan yang kita pelajari hari ini?",
            "Bagaimana kita menerapkan ilmu ini untuk kebaikan bersama?",
            "Komitmen menjaga kelestarian dan keharmonisan lingkungan",
          ],
          visualConcept: "Karakter kartun murid berseragam rapi tersenyum bangga",
          teacherNote: "Tutup sesi dengan refleksi 3-2-1 dan tepuk apresiasi untuk seluruh kelas.",
        },
      ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeSlide = slides[currentIdx] || slides[0];

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleNext = () => {
    if (currentIdx < slides.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto" : ""}`}>
      {/* Slide Toolbar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        isFullscreen ? "bg-slate-800 text-white border-slate-700" : "bg-white border-slate-200 shadow-xs text-slate-800"
      }`}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Presentation className="w-3.5 h-3.5" />
            Slide Deck Presentasi Kelas ({currentIdx + 1}/{slides.length})
          </span>
          <span className={`text-xs hidden sm:inline ${isFullscreen ? "text-slate-300" : "text-slate-500"}`}>
            Siap ditayangkan langsung ke proyektor kelas.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showNotes
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{showNotes ? "Sembunyikan Catatan Guru" : "Lihat Catatan Guru"}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? "Keluar Layar Penuh" : "Mode Proyektor"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Handout</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas 16:9 Presentation View */}
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-white via-slate-50 to-blue-50/50 rounded-3xl shadow-2xl border-4 border-white p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden text-slate-800 select-none">
          {/* Decorative shapes */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Slide Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                {activeSlide.slideNumber}
              </span>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                {data.title}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
              Fase B • SD Negeri 3 Banjar Ratu
            </span>
          </div>

          {/* Slide Center Content */}
          <div className="my-auto py-4 space-y-4">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {activeSlide.title}
              </h2>
              {activeSlide.subtitle && (
                <p className="text-xs sm:text-sm font-bold text-blue-600 mt-1">
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            {/* Bullet Points */}
            <div className="space-y-2.5 pt-2">
              {(activeSlide.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-3 bg-white/80 p-3 rounded-2xl border border-slate-200/70 shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Footer */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span>Kurikulum Merdeka • Pembelajaran Mendalam</span>
            <span>Slide {currentIdx + 1} dari {slides.length}</span>
          </div>
        </div>

        {/* Slide Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border border-slate-200 shadow-sm transition-all disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide Thumbnails Drawer */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 max-w-md">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  idx === currentIdx
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Slide {s.slideNumber || idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIdx === slides.length - 1}
            className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border border-slate-200 shadow-sm transition-all disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Teacher Presenter Notes Panel */}
      {showNotes && activeSlide.teacherNote && (
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Catatan Pedagogis Guru (Pedoman Saat Menampilkan Slide Ini):</span>
          </div>
          <p className="text-xs text-amber-950/90 leading-relaxed font-medium pl-6">
            {activeSlide.teacherNote}
          </p>
        </div>
      )}
    </div>
  );
};
