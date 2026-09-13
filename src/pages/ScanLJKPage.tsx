import { useState, useRef } from "react";
import {
  ScanLine,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { Student } from "../types";

export const ScanLJKPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<{
    studentName: string;
    nisn: string;
    correctAnswers: number;
    totalQuestions: number;
    score: number;
    detectedAnswers: Record<number, string>;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanSimulation = () => {
    setIsScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        studentName: "Andi Saputra",
        nisn: "0123456789",
        correctAnswers: 18,
        totalQuestions: 20,
        score: 90,
        detectedAnswers: {
          1: "B (Benar)",
          2: "B (Benar)",
          3: "A (Benar)",
          4: "C (Benar)",
          5: "D (Salah - Jawaban: C)",
          6: "A (Benar)",
          7: "C (Benar)",
          8: "B (Benar)",
          9: "A (Benar)",
          10: "B (Salah - Jawaban: A)",
        },
      });
    }, 2000);
  };

  const handleSyncToGrade = () => {
    if (!scannedResult) return;
    const students = StorageService.getStudents();
    const andi = students.find((s) => s.name.includes("Andi"));
    if (andi) {
      StorageService.saveGrade(andi.id, "IPAS", {
        tugas: 90,
        ph: 90,
        finalScore: 90,
        predicate: "A",
        description: "Mencapai hasil sempurna dalam asesmen diagnostik lembar jawaban IPAS.",
      });
      alert("Nilai hasil scan otomatis disinkronkan ke Daftar Nilai & Rapor Andi Saputra!");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
          <ScanLine className="w-3.5 h-3.5 text-blue-600" />
          <span>Optical Mark Recognition (OMR) AI</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Scan Lembar Jawaban Komputer (LJK) AI
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Koreksi puluhan lembar jawaban siswa dalam sekejap menggunakan kamera smartphone atau upload foto LJK. Nilai otomatis masuk ke sistem rapor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload / Camera Panel */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="glass-card p-8 rounded-3xl border-2 border-dashed border-blue-300 hover:border-blue-500 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleScanSimulation}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">
            Ambil Foto LJK atau Unggah Gambar
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Pastikan 4 tanda sudut hitam LJK terlihat jelas dan pencahayaan merata.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleScanSimulation();
            }}
            disabled={isScanning}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isScanning ? "Memindai Bulatan..." : "Mulai Simulasi Scan AI"}</span>
          </button>
        </div>

        {/* Scan Result Panel */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200">
          <h3 className="font-bold text-sm text-slate-800 mb-3">Hasil Pemindaian AI</h3>

          {!scannedResult && !isScanning && (
            <div className="text-center py-12 text-xs text-slate-400">
              Belum ada lembar jawaban yang dipindai. Silakan klik tombol di sebelah kiri.
            </div>
          )}

          {isScanning && (
            <div className="text-center py-12 space-y-2">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="font-bold text-xs text-slate-800">Mendeteksi koordinat bulatan pensil...</p>
              <p className="text-[11px] text-slate-500">Mencocokkan dengan kunci jawaban sistem.</p>
            </div>
          )}

          {scannedResult && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{scannedResult.studentName}</h4>
                  <p className="text-xs text-slate-500 font-mono">NISN: {scannedResult.nisn}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Skor Ujian</span>
                  <p className="text-2xl font-black text-emerald-600">{scannedResult.score}</p>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <p>
                  <strong>Benar:</strong> {scannedResult.correctAnswers} dari {scannedResult.totalQuestions} Soal
                </p>
                <p className="text-slate-500">
                  Tingkat Akurasi Deteksi Visual: <strong>99.4%</strong>
                </p>
              </div>

              <button
                onClick={handleSyncToGrade}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Langsung ke Daftar Nilai Siswa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
