import { useState, useEffect } from "react";
import {
  Award,
  FileSpreadsheet,
  Download,
  Sparkles,
  TrendingUp,
  Save,
  Check,
  Search,
  Filter,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { ExcelService } from "../services/excel";
import { Student, GradeRecord } from "../types";

export const PenilaianPage = () => {
  const [selectedSubject, setSelectedSubject] = useState("IPAS");
  const [selectedClass, setSelectedClass] = useState("cls-4a");
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [grades, setGrades] = useState<GradeRecord[]>(StorageService.getGrades());
  const [savedRowId, setSavedRowId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(StorageService.getStudents());
      setGrades(StorageService.getGrades());
    };
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const classStudents = students.filter((s) => s.classId === selectedClass);

  const getStudentGrade = (studentId: string): GradeRecord => {
    const found = grades.find((g) => g.studentId === studentId && g.subject === selectedSubject);
    if (found) return found;

    return {
      id: `grd-${studentId}-${selectedSubject}`,
      studentId,
      classId: "cls-4a",
      subject: selectedSubject,
      semester: "1",
      tugas: 80,
      ph: 80,
      pts: 80,
      pas: 80,
      finalScore: 80,
      predicate: "B",
      description: "Menunjukkan pemahaman yang baik terhadap materi capaian pembelajaran.",
    };
  };

  const handleScoreChange = (
    studentId: string,
    field: "tugas" | "ph" | "pts" | "pas",
    valStr: string
  ) => {
    const num = Math.min(100, Math.max(0, Number(valStr) || 0));
    const current = getStudentGrade(studentId);

    const updatedGrade: Partial<GradeRecord> = {
      ...current,
      [field]: num,
    };

    // Recalculate final score: Tugas 20%, PH 20%, PTS 30%, PAS 30%
    const tugas = field === "tugas" ? num : current.tugas;
    const ph = field === "ph" ? num : current.ph;
    const pts = field === "pts" ? num : current.pts;
    const pas = field === "pas" ? num : current.pas;

    const finalScore = Math.round(tugas * 0.2 + ph * 0.2 + pts * 0.3 + pas * 0.3);
    updatedGrade.finalScore = finalScore;

    if (finalScore >= 90) {
      updatedGrade.predicate = "A";
      updatedGrade.description = `Sangat mahir dalam menguasai seluruh tujuan pembelajaran ${selectedSubject} serta mampu mengaitkan konsep secara mandiri.`;
    } else if (finalScore >= 80) {
      updatedGrade.predicate = "B";
      updatedGrade.description = `Menunjukkan pemahaman yang baik pada materi ${selectedSubject} dan konsisten menyelesaikan asesmen dengan tuntas.`;
    } else if (finalScore >= 70) {
      updatedGrade.predicate = "C";
      updatedGrade.description = `Mampu mencapai kriteria ketuntasan minimal ${selectedSubject}, memerlukan bimbingan tambahan pada materi tertentu.`;
    } else {
      updatedGrade.predicate = "D";
      updatedGrade.description = `Perlu bimbingan dan pendampingan khusus (remedial) untuk mencapai kriteria tujuan pembelajaran ${selectedSubject}.`;
    }

    StorageService.saveGrade(studentId, selectedSubject, updatedGrade);
    setGrades(StorageService.getGrades());
    setSavedRowId(studentId);
    setTimeout(() => setSavedRowId(null), 1200);
  };

  const handleExportExcel = () => {
    ExcelService.exportGradesExcel(grades, classStudents, selectedSubject);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold tracking-wide uppercase mb-2">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Asesmen & Penilaian Kurikulum Merdeka</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Input & Rekap Nilai Siswa (Auto-Calculated)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Ketik angka langsung di tabel. Nilai Akhir, Predikat, dan Deskripsi Capaian Pembelajaran terisi secara otomatis & tersimpan langsung ke Rapor!
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Filter and Subject Selector */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Mata Pelajaran</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-400"
            >
              <option value="IPAS">IPAS (Ilmu Pengetahuan Alam & Sosial)</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              <option value="Seni Rupa">Seni Rupa</option>
              <option value="PJOK">PJOK</option>
              <option value="Pendidikan Agama">Pendidikan Agama Islam</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Rombel / Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-blue-400"
            >
              <option value="cls-4a">Kelas 4A</option>
              <option value="cls-4b">Kelas 4B</option>
              <option value="cls-1a">Kelas 1A</option>
              <option value="cls-2a">Kelas 2A</option>
              <option value="cls-3a">Kelas 3A</option>
              <option value="cls-5a">Kelas 5A</option>
              <option value="cls-6a">Kelas 6A</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Formula: Tugas 20% + PH 20% + PTS 30% + PAS 30%</span>
        </div>
      </div>

      {/* Interactive Grade Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">No</th>
                <th className="p-3.5">NISN</th>
                <th className="p-3.5">Nama Peserta Didik</th>
                <th className="p-3.5 text-center w-20">Tugas</th>
                <th className="p-3.5 text-center w-20">PH</th>
                <th className="p-3.5 text-center w-20">PTS</th>
                <th className="p-3.5 text-center w-20">PAS</th>
                <th className="p-3.5 text-center w-24">Nilai Akhir</th>
                <th className="p-3.5 text-center w-16">Predikat</th>
                <th className="p-3.5 min-w-[280px]">Deskripsi Capaian (Kurikulum Merdeka)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student, idx) => {
                const g = getStudentGrade(student.id);
                const isJustSaved = savedRowId === student.id;

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isJustSaved ? "bg-emerald-50/50" : ""
                    }`}
                  >
                    <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-mono font-medium">{student.nisn}</td>
                    <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                      {student.name}
                    </td>

                    {/* Tugas Input */}
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={g.tugas}
                        onChange={(e) => handleScoreChange(student.id, "tugas", e.target.value)}
                        className="w-16 p-1.5 text-center font-bold bg-slate-50 focus:bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </td>

                    {/* PH Input */}
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={g.ph}
                        onChange={(e) => handleScoreChange(student.id, "ph", e.target.value)}
                        className="w-16 p-1.5 text-center font-bold bg-slate-50 focus:bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </td>

                    {/* PTS Input */}
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={g.pts}
                        onChange={(e) => handleScoreChange(student.id, "pts", e.target.value)}
                        className="w-16 p-1.5 text-center font-bold bg-slate-50 focus:bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </td>

                    {/* PAS Input */}
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={g.pas}
                        onChange={(e) => handleScoreChange(student.id, "pas", e.target.value)}
                        className="w-16 p-1.5 text-center font-bold bg-slate-50 focus:bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      />
                    </td>

                    {/* Calculated Final Score */}
                    <td className="p-3 text-center">
                      <span
                        className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                          g.finalScore >= 85
                            ? "bg-emerald-100 text-emerald-800"
                            : g.finalScore >= 75
                            ? "bg-blue-100 text-blue-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {g.finalScore}
                      </span>
                    </td>

                    {/* Predicate */}
                    <td className="p-3 text-center font-bold text-slate-700">{g.predicate}</td>

                    {/* Auto-Generated Description */}
                    <td className="p-3 text-[11px] text-slate-600 leading-snug">
                      {g.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
