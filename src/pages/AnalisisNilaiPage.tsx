import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Award,
  Users,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { Student, GradeRecord } from "../types";

export const AnalisisNilaiPage = () => {
  const [selectedSubject, setSelectedSubject] = useState("IPAS");
  const [selectedClass, setSelectedClass] = useState("cls-4a");
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [grades, setGrades] = useState<GradeRecord[]>(StorageService.getGrades());

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(StorageService.getStudents());
      setGrades(StorageService.getGrades());
    };
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const classStudents = students.filter((s) => s.classId === selectedClass);
  const subjectGrades = classStudents.map((s) => {
    const g = grades.find((grd) => grd.studentId === s.id && grd.subject === selectedSubject);
    return {
      student: s,
      finalScore: g?.finalScore ?? 80,
      predicate: g?.predicate ?? "B",
    };
  });

  const scores = subjectGrades.map((sg) => sg.finalScore);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;

  const KKM = 75;
  const tuntasStudents = subjectGrades.filter((sg) => sg.finalScore >= KKM);
  const belumTuntasStudents = subjectGrades.filter((sg) => sg.finalScore < KKM);
  const passRate = classStudents.length > 0 ? Math.round((tuntasStudents.length / classStudents.length) * 100) : 0;

  // Grade breakdown
  const countA = subjectGrades.filter((sg) => sg.finalScore >= 90).length;
  const countB = subjectGrades.filter((sg) => sg.finalScore >= 80 && sg.finalScore < 90).length;
  const countC = subjectGrades.filter((sg) => sg.finalScore >= 70 && sg.finalScore < 80).length;
  const countD = subjectGrades.filter((sg) => sg.finalScore < 70).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold tracking-wide uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Analisis Hasil Belajar AI</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Analisis Ketuntasan & Diagnostik Remedial AI
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Otomatis mengidentifikasi peserta didik yang butuh intervensi, materi esensial yang sulit, dan rekomendasi program pengayaan & remedial.
        </p>

        {/* Filter */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3.5 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-400"
          >
            <option value="IPAS">IPAS (Ilmu Pengetahuan Alam & Sosial)</option>
            <option value="Matematika">Matematika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-400"
          >
            <option value="cls-4a">Kelas 4A</option>
            <option value="cls-4b">Kelas 4B</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Rata-Rata Kelas
          </span>
          <p className="text-2xl font-black text-slate-800 mt-1">{avgScore}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Target KKM: {KKM}
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ketuntasan Belajar
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{passRate}%</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {tuntasStudents.length} dari {classStudents.length} Siswa Tuntas
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nilai Tertinggi
          </span>
          <p className="text-2xl font-black text-blue-600 mt-1">{maxScore}</p>
          <span className="text-[10px] text-blue-500 font-semibold mt-1 block">
            Predikat A (Sangat Mahir)
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nilai Terendah
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">{minScore}</p>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
            {belumTuntasStudents.length} Siswa Perlu Remedial
          </span>
        </div>
      </div>

      {/* Distribution Breakdown & Remedial List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi Nilai */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Distribusi Predikat Kelas 4A ({selectedSubject})</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Predikat A (90 - 100) — Sangat Mahir</span>
                <span>{countA} Siswa</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(countA / classStudents.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Predikat B (80 - 89) — Cakap / Baik</span>
                <span>{countB} Siswa</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${(countB / classStudents.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Predikat C (70 - 79) — Cukup / Berkembang</span>
                <span>{countC} Siswa</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(countC / classStudents.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Predikat D (&lt; 70) — Perlu Intervensi Khusus</span>
                <span>{countD} Siswa</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${(countD / classStudents.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Siswa Butuh Remedial */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Daftar Siswa Membutuhkan Remedial ({belumTuntasStudents.length})</span>
          </h3>

          {belumTuntasStudents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-sm text-slate-700">Luar Biasa! Semua Siswa Tuntas</p>
              <p className="text-xs text-slate-400">Seluruh siswa mencapai kriteria ketuntasan minimal.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {belumTuntasStudents.map(({ student, finalScore }) => (
                <div
                  key={student.id}
                  className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{student.name}</h4>
                    <p className="text-[11px] text-slate-500">NISN: {student.nisn} • Nilai: {finalScore}</p>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-200 text-rose-800">
                    Remedial Bab 2
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="glass-card p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-emerald-50/70 border border-blue-200/80">
        <div className="flex items-center gap-2.5 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-slate-800">Rekomendasi Tindak Lanjut Guru AI</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="font-bold text-blue-700">1. Analisis Materi Sulit</span>
            <p className="leading-relaxed text-slate-600">
              Siswa cenderung kehilangan poin pada indikator analisis fotosintesis & translokasi zat makanan pada xilem/floem.
            </p>
          </div>

          <div className="p-4 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="font-bold text-emerald-700">2. Strategi Remedial</span>
            <p className="leading-relaxed text-slate-600">
              Gunakan media visual interaktif dan eksperimen sederhana mengamati pewarna pada batang seledri untuk memperkuat pemahaman konseptual.
            </p>
          </div>

          <div className="p-4 bg-white/90 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="font-bold text-indigo-700">3. Program Pengayaan</span>
            <p className="leading-relaxed text-slate-600">
              Bagi siswa predikat A, berikan proyek investigasi lanjutan: membuat laporan observasi adaptasi daun kaktus vs teratai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
