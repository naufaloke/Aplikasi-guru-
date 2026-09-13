import React, { useState, useEffect } from "react";
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Clapperboard,
  Clock,
  Copy,
  Check,
  Printer,
} from "lucide-react";
import { GeneratedMediaData, StoryboardScene } from "../../types/media";

interface VideoStoryboardProps {
  data: GeneratedMediaData;
}

export const VideoStoryboardRenderer: React.FC<VideoStoryboardProps> = ({ data }) => {
  const scenes: StoryboardScene[] = data.storyboard && data.storyboard.length > 0
    ? data.storyboard
    : [
        {
          sceneNumber: 1,
          time: "00:00 - 00:15",
          title: "Adegan 1: Hook Ceria & Apersepsi",
          visualDescription: "Karakter animasi 3D tersenyum melambaikan tangan dengan latar pemandangan alam mempesona.",
          voiceover: "Halo sahabat cilik di seluruh Indonesia! Hari ini kita akan menjelajahi petualangan sains yang luar biasa!",
          soundFx: "Musik ceria marimba lembut dan denting lonceng",
        },
        {
          sceneNumber: 2,
          time: "00:15 - 00:45",
          title: "Adegan 2: Penjelasan Konsep Visual",
          visualDescription: "Kamera memperbesar elemen kunci dengan diagram alur bercahaya dan efek partikel interaktif.",
          voiceover: "Lihatlah bagaimana proses ajaib ini berlangsung! Setiap tetes dan partikel bekerja sama menjaga bumi kita.",
          soundFx: "Suara desau angin halus dan efek kilau kristal",
        },
        {
          sceneNumber: 3,
          time: "00:45 - 01:10",
          title: "Adegan 3: Contoh Nyata di Kehidupan",
          visualDescription: "Anak-anak SD sedang melakukan pengamatan langsung di halaman sekolah dengan rasa gembira.",
          voiceover: "Fenomena ini terjadi tepat di sekitar kita setiap hari. Hebat sekali, bukan?",
          soundFx: "Suara riang tawa anak-anak dan kicauan burung",
        },
        {
          sceneNumber: 4,
          time: "01:10 - 01:30",
          title: "Adegan 4: Call to Action & Refleksi",
          visualDescription: "Karakter utama memegang plakat ajakan peduli lingkungan dan logo Kurikulum Merdeka.",
          voiceover: "Mari kita rawat bumi kita dengan penuh cinta. Sampai jumpa di episode petualangan belajar berikutnya!",
          soundFx: "Musik penutup gembira dan tepuk tangan meriah",
        },
      ];

  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const activeScene = scenes[activeSceneIdx] || scenes[0];

  // Simulated scene playback loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      // Optional speech synthesis
      if (speechEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activeScene.voiceover);
        utterance.lang = "id-ID";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      timer = setTimeout(() => {
        if (activeSceneIdx < scenes.length - 1) {
          setActiveSceneIdx((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 7000);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeSceneIdx, speechEnabled]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveSceneIdx(0);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleCopyScript = () => {
    const scriptText = scenes
      .map(
        (s) =>
          `[${s.time}] ${s.title}\nVisual: ${s.visualDescription}\nNarasi: "${s.voiceover}"\nSound FX: ${s.soundFx}\n`
      )
      .join("\n---\n\n");
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold">
            <Film className="w-3.5 h-3.5" />
            Storyboard & Naskah Video Animasi Interaktif
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Putar simulasi animasi dengan narasi suara otomatis di dalam aplikasi.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              speechEnabled
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{speechEnabled ? "Suara Narasi Aktif" : "Suara Senyap"}</span>
          </button>

          <button
            onClick={handleCopyScript}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Naskah Tersalin!" : "Salin Naskah Video"}</span>
          </button>
        </div>
      </div>

      {/* Simulated Interactive Video Screen Player */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border-4 border-slate-800 relative overflow-hidden">
        {/* Screen Background Animation Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 opacity-90" />
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full bg-red-600/80 text-white text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {isPlaying ? "SIMULASI MEMUTAR" : "PREVIEW ANIMASI"}
          </span>
          <span className="text-xs font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded-md">
            {activeScene.time}
          </span>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative z-10 min-h-[260px] sm:min-h-[300px] flex flex-col justify-between py-4">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Clapperboard className="w-4 h-4" />
            <span>{activeScene.title}</span>
          </div>

          {/* Visual Scene Graphic Simulation */}
          <div className="my-auto text-center py-6 px-4 max-w-2xl mx-auto space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-500/20">
              🎬
            </div>
            <p className="text-xs sm:text-sm text-sky-200 font-semibold italic">
              "{activeScene.visualDescription}"
            </p>

            {/* Narration Subtitle Box */}
            <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white max-w-xl mx-auto shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                🗣️ Narasi Suara (Voiceover):
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                "{activeScene.voiceover}"
              </p>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              🎵 SFX: {activeScene.soundFx}
            </p>
          </div>

          {/* Video Player Controls Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? "Jeda" : "Putar Adegan"}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Mulai Ulang dari Adegan 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Scene Selector Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {scenes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSceneIdx(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    idx === activeSceneIdx
                      ? "bg-sky-500 text-white shadow-md scale-105"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Scene {s.sceneNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Scene Timeline List */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Rincian Storyboard & Script Lengkap
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenes.map((scene, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSceneIdx(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                idx === activeSceneIdx
                  ? "bg-blue-50/70 border-blue-400 shadow-sm"
                  : "bg-white border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                  Adegan {scene.sceneNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{scene.time}</span>
              </div>

              <h5 className="text-xs font-black text-slate-900 mb-1">{scene.title}</h5>
              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                <strong className="text-slate-800">Visual:</strong> {scene.visualDescription}
              </p>
              <p className="text-[11px] text-blue-800 bg-white p-2 rounded-xl border border-blue-100 italic">
                "{scene.voiceover}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
