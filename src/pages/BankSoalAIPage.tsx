import { useState } from "react";
import {
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Download,
  FileText,
  RefreshCw,
  Plus,
  BookOpen,
} from "lucide-react";
import { AIService } from "../services/ai";
import { ExportService } from "../services/pdf";

export const BankSoalAIPage = () => {
  const [topic, setTopic] = useState("IPAS Kelas 4 Bagian Tubuh Tumbuhan");
  const [soalType, setSoalType] = useState<"PG" | "Essay" | "Isian" | "Campuran">("Campuran");
  const [count, setCount] = useState(5);
  const [isHots, setIsHots] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string>(`### KUMPULAN SOAL HOTS KURIKULUM MERDEKA
**Mata Pelajaran:** IPAS  
**Fase / Kelas:** B / 4 SD  
**Materi:** Bagian Tubuh Tumbuhan dan Fungsinya  

---

#### A. Pilihan Ganda (HOTS - Analisis & Evaluasi)

1. Sekelompok siswa kelas 4 melakukan percobaan dengan meletakkan setangkai bunga mawar putih ke dalam gelas berisi air yang telah diberi pewarna makanan biru. Setelah didiamkan selama beberapa jam, mahkota bunga berubah menjadi kebiruan.  
Fenomena tersebut membuktikan bahwa...  
A. Daun menyerap air untuk fotosintesis  
B. Batang memiliki pembuluh xilem yang mengangkut air ke bagian atas  
C. Bunga menghasilkan pigmen warna sendiri saat terkena udara  
D. Akar kehilangan fungsi menyerap air saat dipotong  
*Kunci Jawaban: B*  
*Pembahasan: Air berwarna merambat naik melalui berkas pengangkut xilem pada batang hingga mencapai kelopak bunga (daya kapilaritas batang).*

2. Di hutan mangrove yang berlumpur dan miskin oksigen, tanaman bakau mengembangkan akar napas (pneumatofora) yang mencuat ke atas permukaan air. Jika tanaman bakau ditanam di tanah padat tanpa air pasang surut, adaptasi morfologi yang paling mungkin terganggu adalah...  
A. Penyerapan sinar matahari oleh klorofil  
B. Pertukaran gas oksigen melalui lentisel akar napas  
C. Pembentukan buah dan biji  
D. Penyerapan zat hara oleh akar serabut  
*Kunci Jawaban: B*

---

#### B. Soal Uraian / Penalaran Mendalam

3. Bu Ani merawat tanaman tomat di dalam pot di dalam rumah yang jauh dari jendela. Meskipun disiram secara teratur setiap hari, daun tanaman tersebut berwarna pucat kekuningan dan batangnya tumbuh kurus memanjang (etiolasi).  
a. Mengapa kondisi tersebut dapat terjadi pada tanaman tomat Bu Ani?  
b. Tindakan apa yang harus dilakukan Bu Ani agar tanaman tomat dapat tumbuh kokoh dan berbuah?  
*Pedoman Penskoran: Nilai 10 jika peserta didik menjelaskan ketiadaan cahaya matahari menghambat klorofil dan fotosintesis, serta menyarankan pemindahan pot ke area terkena sinar matahari pagi.*`);

  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const prompt = `Buatkan ${count} butir soal ${soalType} level ${
        isHots ? "HOTS (High Order Thinking Skills: C4 Analisis, C5 Evaluasi, C6 Kreasi)" : "Standar"
      } Kurikulum Merdeka untuk topik: "${topic}". Cantumkan stimulus konteks nyata/studi kasus, kunci jawaban, rubrik penilaian, dan pembahasan mendalam berorientasi Deep Learning.`;

      const result = await AIService.generateSoal(prompt);
      setGeneratedQuestions(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedQuestions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    ExportService.exportTextPDF("BANK SOAL HOTS KURIKULUM MERDEKA", generatedQuestions, `Bank_Soal_${topic.replace(/\s+/g, "_")}.pdf`);
  };

  const handleExportWord = () => {
    ExportService.exportToWord("BANK SOAL HOTS KURIKULUM MERDEKA", generatedQuestions, `Bank_Soal_${topic.replace(/\s+/g, "_")}.doc`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold tracking-wide uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Asesmen Formatif & Sumatif AI</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Bank Soal HOTS Otomatis & Rubrik Penilaian
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Hasilkan soal bertingkat kognitif tinggi (C4-C6) berbasis stimulus studi kasus kontekstual lengkap dengan kunci jawaban dan rubrik penskoran.
        </p>

        {/* Configuration Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Materi / Topik Pembelajaran</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: IPAS Kelas 4 Bagian Tubuh Tumbuhan..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-400 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Bentuk Soal</label>
            <select
              value={soalType}
              onChange={(e) => setSoalType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
            >
              <option value="Campuran">Campuran (PG + Uraian)</option>
              <option value="PG">Pilihan Ganda Saja</option>
              <option value="Essay">Uraian / Penalaran</option>
              <option value="Isian">Isian Singkat</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Jumlah Butir Soal</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold"
            >
              <option value={5}>5 Soal</option>
              <option value={10}>10 Soal</option>
              <option value={15}>15 Soal</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isHots}
              onChange={(e) => setIsHots(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-400"
            />
            <span>Prioritaskan Level Kognitif HOTS (Penalaran & Pemecahan Masalah Nyata)</span>
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? "Menyusun Soal..." : "Buat Bank Soal"}</span>
          </button>
        </div>
      </div>

      {/* Output Document */}
      {generatedQuestions && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Dokumen Naskah Soal & Rubrik</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin"}</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={handleExportWord}
                className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Word (.doc)</span>
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-white/90 text-slate-800 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-[600px] overflow-y-auto">
            {generatedQuestions}
          </div>
        </div>
      )}
    </div>
  );
};
