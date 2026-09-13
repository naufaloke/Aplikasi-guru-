import React, { useState } from "react";
import {
  Bookmark,
  RotateCw,
  Printer,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { GeneratedMediaData, FlashcardItem } from "../../types/media";

interface FlashcardProps {
  data: GeneratedMediaData;
}

export const FlashcardVisualRenderer: React.FC<FlashcardProps> = ({ data }) => {
  const cards: FlashcardItem[] = data.flashcards && data.flashcards.length > 0
    ? data.flashcards
    : [
        {
          id: 1,
          term: "Evaporasi",
          category: "Siklus Air",
          visualPrompt: "Matahari memanaskan air laut yang menguap ke udara",
          definition: "Proses perubahan air menjadi gas/uap air akibat pemanasan sinar matahari.",
          example: "Genangan air di halaman sekolah yang mengering terkena sinar mentari.",
          quizQuestion: "Peristiwa menguapnya air laut karena panas matahari disebut apa?",
          quizAnswer: "Evaporasi",
        },
        {
          id: 2,
          term: "Kondensasi",
          category: "Siklus Air",
          visualPrompt: "Uap air berkumpul di langit membentuk gumpalan awan",
          definition: "Proses uap air mendingin dan berubah menjadi butiran air pembentuk awan.",
          example: "Titik-titik air yang muncul di luar dinding gelas es sirup manis.",
          quizQuestion: "Awan di langit terbentuk karena proses apa?",
          quizAnswer: "Kondensasi",
        },
        {
          id: 3,
          term: "Presipitasi",
          category: "Siklus Air",
          visualPrompt: "Awan gelap menjatuhkan rintik hujan ke pegunungan",
          definition: "Peristiwa jatuhnya air dari atmosfer ke permukaan bumi dalam bentuk hujan atau salju.",
          example: "Hujan deras yang mengguyur sawah dan atap rumah kita.",
          quizQuestion: "Nama lain dari jatuhnya air hujan ke bumi adalah...",
          quizAnswer: "Presipitasi",
        },
        {
          id: 4,
          term: "Infiltrasi",
          category: "Siklus Air",
          visualPrompt: "Air meresap ke dalam akar pohon dan pori-pori tanah",
          definition: "Aliran air ke dalam tanah melalui celah-celah pori permukaan bumi.",
          example: "Air hujan di kebun yang diserap tanah dan akar pohon mangga.",
          quizQuestion: "Air hujan yang meresap ke dalam tanah disebut...",
          quizAnswer: "Infiltrasi",
        },
      ];

  // Track flipped state per card
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const flipAll = (flipTo: boolean) => {
    const newState: Record<number, boolean> = {};
    cards.forEach((c) => {
      newState[c.id] = flipTo;
    });
    setFlippedCards(newState);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">
            <Bookmark className="w-3.5 h-3.5" />
            Kartu Pintar Interaktif ({cards.length} Kartu)
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Klik kartu untuk membalik (Front: Istilah & Visual • Back: Definisi, Contoh, Kuis).
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => flipAll(true)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Balik Semua</span>
          </button>

          <button
            onClick={() => flipAll(false)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <span>Tampilan Depan</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Kartu (Siap Gunting)</span>
          </button>
        </div>
      </div>

      {/* Grid of Interactive Flashcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="cursor-pointer group relative min-h-[260px] bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                  {card.category || "Istilah Kunci"}
                </span>

                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold group-hover:text-blue-600 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{isFlipped ? "Sisi Belakang" : "Klik untuk Balik"}</span>
                </div>
              </div>

              {/* Card Body */}
              {!isFlipped ? (
                /* FRONT SIDE */
                <div className="my-auto py-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md mb-3">
                    {card.term.charAt(0)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {card.term}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 italic line-clamp-2 px-4">
                    "{card.visualPrompt}"
                  </p>
                </div>
              ) : (
                /* BACK SIDE */
                <div className="my-auto py-2 space-y-3">
                  <div>
                    <h4 className="text-sm font-black text-blue-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Definisi Mudah Dipahami:
                    </h4>
                    <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                      {card.definition}
                    </p>
                  </div>

                  {card.example && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        Contoh Sehari-hari:
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">{card.example}</p>
                    </div>
                  )}

                  {card.quizQuestion && (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                      <span className="text-[10px] font-black text-amber-800 uppercase flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> Tebak Kilat Siswa:
                      </span>
                      <p className="text-xs text-amber-950 font-semibold mt-0.5">
                        {card.quizQuestion}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">
                        ✓ Kunci: {card.quizAnswer}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Kartu #{card.id}</span>
                <span>Guru AI Indonesia • Kurikulum Merdeka</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
