import { useState } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Layers,
  Copy,
  Check,
  Presentation,
  Film,
  Bookmark,
  Palette,
  Eye,
  Code2,
  RefreshCw,
} from "lucide-react";
import { AIService } from "../services/ai";
import { GeneratedMediaData, MediaType } from "../types/media";
import { PosterVisualRenderer } from "../components/media/PosterVisualRenderer";
import { InfographicVisualRenderer } from "../components/media/InfographicVisualRenderer";
import { FlashcardVisualRenderer } from "../components/media/FlashcardVisualRenderer";
import { SlideVisualRenderer } from "../components/media/SlideVisualRenderer";
import { VideoStoryboardRenderer } from "../components/media/VideoStoryboardRenderer";

export const MediaAIPage = () => {
  const [mediaType, setMediaType] = useState<MediaType>("poster");
  const [topic, setTopic] = useState("Siklus Air dan Hujan untuk Siswa SD");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<"visual" | "prompt">("visual");

  // Initial rich sample data so the teacher immediately sees live, direct results
  const [mediaData, setMediaData] = useState<GeneratedMediaData>({
    mediaType: "poster",
    topic: "Siklus Air dan Hujan untuk Siswa SD",
    title: "Siklus Air & Hujan: Petualangan Tetesan Air Cilik",
    subtitle: "Fase B (Kelas 4 SD) • Kurikulum Merdeka & Pembelajaran Mendalam",
    badge: "POSTER EDUKASI 3D",
    conceptSummary:
      "Air di bumi terus berputar melalui siklus abadi yang menakjubkan: penguapan dari sinar matahari, pembentukan awan dingin, hujan yang menyuburkan tanah, hingga mengalir kembali ke laut.",
    funFact:
      "Air yang kita minum hari ini adalah air yang sama yang pernah diminum dinosaurus jutaan tahun lalu karena air terus didaur ulang secara alami oleh alam!",
    palette: [
      { name: "Biru Langit", hex: "#0284C7" },
      { name: "Hijau Zamrud", hex: "#10B981" },
      { name: "Kuning Mentari", hex: "#F59E0B" },
      { name: "Ungu Semangat", hex: "#6366F1" },
    ],
    posterElements: [
      {
        step: 1,
        title: "Evaporasi (Penguapan)",
        description: "Matahari memanaskan air laut, danau, dan sungai hingga menguap naik ke angkasa menjadi butiran uap halus tak kasat mata.",
        icon: "sun",
        tag: "Tahap 1",
      },
      {
        step: 2,
        title: "Kondensasi (Pengembunan)",
        description: "Uap air di langit tinggi yang dingin berkumpul, merapat, dan membentuk gumpalan awan putih yang semakin tebal dan gelap.",
        icon: "cloud",
        tag: "Tahap 2",
      },
      {
        step: 3,
        title: "Presipitasi (Curah Hujan)",
        description: "Awan yang sudah terlalu berat menampung air akhirnya menjatuhkan butiran-butiran hujan berkilau menyegarkan bumi.",
        icon: "droplet",
        tag: "Tahap 3",
      },
      {
        step: 4,
        title: "Infiltrasi & Aliran",
        description: "Air hujan meresap ke dalam tanah menjadi cadangan mata air, diserap akar pepohonan, dan sisanya mengalir kembali ke lautan luas.",
        icon: "leaf",
        tag: "Tahap 4",
      },
    ],
    flashcards: [
      {
        id: 1,
        term: "Evaporasi",
        category: "Kosakata Kunci",
        visualPrompt: "Matahari tersenyum menyinari danau biru berkilauan dengan uap air melayang ke atas",
        definition: "Proses perubahan air permukaan bumi menjadi uap air akibat pemanasan sinar matahari.",
        example: "Genangan air di halaman sekolah yang mengering terkena terik mentari siang.",
        quizQuestion: "Peristiwa penguapan air oleh panas matahari dinamakan apa?",
        quizAnswer: "Evaporasi",
      },
      {
        id: 2,
        term: "Kondensasi",
        category: "Fenomena Alam",
        visualPrompt: "Uap air mendingin dan berkumpul membentuk gumpalan awan putih di langit",
        definition: "Perubahan uap air menjadi titik-titik air karena suhu dingin di atmosfer sehingga membentuk awan.",
        example: "Titik-titik air embun yang menempel di luar gelas berisi es dingin.",
        quizQuestion: "Awan terbentuk karena proses pendinginan yang disebut...",
        quizAnswer: "Kondensasi",
      },
      {
        id: 3,
        term: "Presipitasi",
        category: "Klimatologi",
        visualPrompt: "Rintik hujan kristal ceria turun membasahi pegunungan dan padang rumput",
        definition: "Turunnya butiran air, salju, atau es dari awan menuju ke permukaan bumi.",
        example: "Hujan rintik di sore hari yang membasahi halaman sekolah dan kebun.",
        quizQuestion: "Peristiwa turunnya hujan dari awan ke bumi dinamakan...",
        quizAnswer: "Presipitasi",
      },
      {
        id: 4,
        term: "Infiltrasi",
        category: "Konservasi Tanah",
        visualPrompt: "Akar pohon besar memeluk butiran tanah dan menyerap air tanah segar",
        definition: "Peresapan air permukaan ke dalam pori-pori tanah melalui lapisan humus dan akar tanaman.",
        example: "Air hujan di kebun meresap ke tanah sehingga tidak terjadi genangan banjir.",
        quizQuestion: "Proses masuknya air hujan ke dalam tanah disebut...",
        quizAnswer: "Infiltrasi",
      },
    ],
    slides: [
      {
        id: 1,
        slideNumber: 1,
        title: "Siklus Air & Hujan: Petualangan Tetesan Air Cilik",
        subtitle: "Petualangan Belajar IPAS Kelas 4 SD Bersama Guru Hebat",
        bullets: [
          "Mengenal fenomena ajaib di sekitar kita setiap hari",
          "Menemukan rahasia alam ciptaan Tuhan YME yang abadi",
          "Eksplorasi ceria, kolaboratif, dan bermakna di kelas",
        ],
        visualConcept: "Cover ceria dengan ilustrasi 3D animasi karakter ramah dan pemandangan alam mempesona",
        teacherNote: "Sapa anak-anak dengan ceria, tayangkan slide ini sambil mengajak tebak gambar pemantik.",
      },
      {
        id: 2,
        slideNumber: 2,
        title: "Pertanyaan Pemantik & Misi Detektif Cilik",
        subtitle: "Mengapa Air di Bumi Tidak Pernah Habis?",
        bullets: [
          "Pernahkah kamu melihat genangan air setelah hujan yang tiba-tiba kering?",
          "Kemana perginya air genangan itu?",
          "Misi kita: Menjadi detektif penemu jejak siklus alam!",
        ],
        visualConcept: "Gambar detektif cilik memegang kaca pembesar mengamati tetesan air hujan",
        teacherNote: "Beri waktu 2 menit bagi murid untuk menjawab bebas. Apresiasi semua pendapat mereka.",
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
          "4. Infiltrasi: Air meresap dan mengalir kembali",
        ],
        visualConcept: "Diagram lingkaran 3D dengan panah estetik bercahaya menghubungkan laut, matahari, awan, dan pohon",
        teacherNote: "Jelaskan dengan gerakan tangan: naik (menguap), berkumpul (awan), turun (hujan), menyerap (tanah).",
      },
      {
        id: 4,
        slideNumber: 4,
        title: "Aktivitas Seru: Miniatur Awan dalam Toples",
        subtitle: "Penyelidikan Kelompok (Hands-On)",
        bullets: [
          "Alat: Toples kaca, air hangat, mangkuk es batu, semprotan",
          "Langkah: Tuang air hangat, letakkan es batu di atas toples",
          "Amati: Lihat kabut awan terbentuk tepat di depan matamu!",
        ],
        visualConcept: "Foto toples kaca dengan asap uap awan mini di dalamnya dan anak-anak tersenyum takjub",
        teacherNote: "Dampingi murid saat menuang air hangat. Pastikan setiap kelompok berbagi tugas.",
      },
      {
        id: 5,
        slideNumber: 5,
        title: "Refleksi & Pesan Pelajar Pancasila",
        subtitle: "Menjaga Sumber Air = Menjaga Kehidupan",
        bullets: [
          "Menutup kran air saat selesai mencuci tangan",
          "Menanam pohon agar air tanah tetap melimpah",
          "Tidak membuang sampah ke sungai dan selokan",
        ],
        visualConcept: "Anak SD bergandengan tangan di taman hijau yang asri dengan air sungai jernih",
        teacherNote: "Tutup dengan tepuk air bersih dan minta murid menyebutkan 1 komitmen hemat air di rumah.",
      },
    ],
    storyboard: [
      {
        sceneNumber: 1,
        time: "00:00 - 00:15",
        title: "Adegan Pembuka (Hook Menggembirakan)",
        visualDescription: "Kamera zoom-in dari luar angkasa menuju bumi biru, lalu mendarat di danau tenang berhutan pinus. Karakter tetesan air 3D bernama 'Tito' melambaikan tangan menyapa penonton.",
        voiceover: "Halo sahabat cilik! Namaku Tito si tetes air. Hari ini aku akan mengajakmu bertualang keliling langit dan bumi!",
        soundFx: "Musik ceria marimba lembut dan suara gemericik air jernih",
      },
      {
        sceneNumber: 2,
        time: "00:15 - 00:40",
        title: "Terbang ke Awan (Evaporasi & Kondensasi)",
        visualDescription: "Matahari bersinar ramah. Tito mulai berkilauan dan berubah menjadi uap ringan berhawa hangat, melayang riang ke angkasa, lalu bergabung dengan ribuan teman tetes air membentuk awan putih empuk.",
        voiceover: "Horeee! Saat matahari menyinari danau, tubuhku menjadi hangat dan ringan. Aku melayang ke langit tinggi. Di atas sini dingin sekali, kami saling berpelukan membentuk awan yang megah!",
        soundFx: "Efek desau angin lembut melayang ('whoosh') dan denting lonceng kristal",
      },
      {
        sceneNumber: 3,
        time: "00:40 - 01:10",
        title: "Hujan Meluncur Bebas (Presipitasi)",
        visualDescription: "Awan berubah warna menjadi abu-abu tebal. Tiba-tiba tetesan-tetesan air berseluncur ke bawah seperti bermain perosotan raksasa, jatuh ke dedaunan hijau dan diserap akar tanaman.",
        voiceover: "Waaah! Awan sudah tidak muat lagi menampung kami. Satu, dua, tiga... Meluncur! Kami turun membasahi bumi, membuat bunga-bunga tersenyum mekar dan udara kembali sejuk!",
        soundFx: "Suara rintik hujan menetes lembut di atas daun dan tawa ceria anak",
      },
      {
        sceneNumber: 4,
        time: "01:10 - 01:30",
        title: "Pesan Bijak & Penutup",
        visualDescription: "Tito kembali ke danau bersama ikan-ikan kecil, lalu memegang poster kecil: 'Hemat Air, Sayangi Bumi!'. Layar menampilkan logo sekolah dan Kurikulum Merdeka.",
        voiceover: "Begitulah petualanganku! Air selalu berputar untuk kehidupan kita. Mari kita jaga sumber air bersih dengan tidak membuang sampah sembarangan ya. Sampai jumpa di petualangan berikutnya!",
        soundFx: "Fanfare ceria gembira dan tepuk tangan meriah",
      },
    ],
    rawPrompt: `🎨 PROMPT VISUAL 3D POSTER PEMBELAJARAN
Gaya: 3D Cute Isometric Claymorphic, Pixar-style Educational Illustration
Pencahayaan: Soft cinematic warm sunbeam, vibrant cheerful studio lighting
Objek Utama:
- Karakter awan tersenyum ramah menjatuhkan rintik hujan kristal bening
- Gunung hijau mini dengan sungai berkelok berkilau menuju danau biru
- Anak panah tipis estetik bergradasi menunjukkan arah siklus:
  1. Evaporasi (Matahari menghangatkan air laut)
  2. Kondensasi (Uap air mengembun jadi awan)
  3. Presipitasi (Hujan turun menyuburkan tanah)
  4. Infiltrasi (Air meresap ke dalam akar pohon)
Warna Dominan: Biru langit (#38BDF8), Hijau emerald (#10B981), Kuning cerah matahari (#FBBF24)
Rasio Gambar: 3:4 (Vertical Poster Kelas SD)
Tipografi: Font tebal bulat ramah anak "Siklus Air: Karunia Kehidupan"`,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>(mediaData.rawPrompt || "");

  const quickTopics = [
    "Siklus Air dan Hujan untuk Siswa SD",
    "Fotosintesis & Dapur Tumbuhan",
    "Pahlawan Nasional Indonesia",
    "Tata Surya & Urutan Planet",
    "Pecahan Campuran Matematika",
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const result = await AIService.generateStructuredMedia({
        mediaType,
        topic,
        gradeLevel: "Fase B (Kelas 4 SD)",
        style: "3D Cute Isometric Claymorphic",
      });

      setMediaData(result);
      if (result.rawPrompt) {
        setGeneratedPrompt(result.rawPrompt);
      }
      setActiveView("visual");
    } catch (err: any) {
      console.error("Media generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Main Generator Configuration Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold tracking-wide uppercase">
            <Palette className="w-3.5 h-3.5 text-purple-600" />
            <span>Studio Desain & Media Digital AI • Hasil Langsung</span>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            ✓ Langsung Jadi di Aplikasi (Tanpa Perlu Buka Aplikasi Lain)
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Pembuat Media Pembelajaran AI
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Pilih format media dan ketik topik materi. Media langsung dirender secara visual, interaktif, dan siap dicetak atau diunduh seketika!
        </p>

        {/* Media Type Selector */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => {
              setMediaType("poster");
              setMediaData((prev) => ({ ...prev, mediaType: "poster" }));
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
              mediaType === "poster"
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Poster 3D</span>
          </button>

          <button
            onClick={() => {
              setMediaType("infografis");
              setMediaData((prev) => ({ ...prev, mediaType: "infografis" }));
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
              mediaType === "infografis"
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Layers className="w-5 h-5" />
            <span>Infografis</span>
          </button>

          <button
            onClick={() => {
              setMediaType("flashcard");
              setMediaData((prev) => ({ ...prev, mediaType: "flashcard" }));
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
              mediaType === "flashcard"
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>Flashcard</span>
          </button>

          <button
            onClick={() => {
              setMediaType("slide");
              setMediaData((prev) => ({ ...prev, mediaType: "slide" }));
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
              mediaType === "slide"
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Presentation className="w-5 h-5" />
            <span>Slide Deck</span>
          </button>

          <button
            onClick={() => {
              setMediaType("video");
              setMediaData((prev) => ({ ...prev, mediaType: "video" }));
            }}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
              mediaType === "video"
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Film className="w-5 h-5" />
            <span>Storyboard Video</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ketik topik materi (contoh: Siklus Air, Fotosintesis, Pahlawan Nasional)..."
            className="flex-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 text-xs md:text-sm font-semibold text-slate-800 transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? "Membuat Media Langsung..." : "Hasilkan Media AI Langsung"}</span>
          </button>
        </div>

        {/* Quick Topics Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Contoh Topik:</span>
          {quickTopics.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setTopic(t)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium transition-all shrink-0"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mode View Switcher: Hasil Visual Langsung vs Prompt Inspector */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("visual")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeView === "visual"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Hasil Visual Langsung</span>
          </button>

          <button
            onClick={() => setActiveView("prompt")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === "prompt"
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Inspektor Prompt AI</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          {activeView === "visual" ? "Media telah siap digunakan untuk pembelajaran kelas" : "Salin prompt jika ingin bereksperimen di generator lain"}
        </span>
      </div>

      {/* Render Primary View */}
      {activeView === "visual" ? (
        <div>
          {mediaType === "poster" && <PosterVisualRenderer data={mediaData} />}
          {mediaType === "infografis" && <InfographicVisualRenderer data={mediaData} />}
          {mediaType === "flashcard" && <FlashcardVisualRenderer data={mediaData} />}
          {mediaType === "slide" && <SlideVisualRenderer data={mediaData} />}
          {mediaType === "video" && <VideoStoryboardRenderer data={mediaData} />}
        </div>
      ) : (
        /* PROMPT INSPECTOR (Secondary Tab) */
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-700">
                Spesifikasi Prompt Generator AI (Midjourney / Canva / Leonardo)
              </span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Prompt Tersalin!" : "Salin Prompt Desain"}</span>
            </button>
          </div>

          <div className="p-6 md:p-8 bg-white text-slate-800 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-mono max-h-[550px] overflow-y-auto">
            {generatedPrompt || mediaData.rawPrompt}
          </div>
        </div>
      )}
    </div>
  );
};
