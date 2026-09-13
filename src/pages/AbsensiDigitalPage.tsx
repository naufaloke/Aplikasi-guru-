import { useState, useEffect } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
  FileSpreadsheet,
  FileText,
  Filter,
  Check,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { ExcelService } from "../services/excel";
import { ExportService } from "../services/pdf";
import { Student, AttendanceRecord, AttendanceStatus } from "../types";

export const AbsensiDigitalPage = () => {
  const [selectedClass, setSelectedClass] = useState("cls-4a");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(StorageService.getAttendance());
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"kartu" | "rekap">("kartu");
  const [lastSavedStudent, setLastSavedStudent] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(StorageService.getStudents());
      setAttendance(StorageService.getAttendance());
    };
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const classStudents = students.filter((s) => s.classId === selectedClass);

  // Status mapping for today's selected date
  const getAttendanceForStudent = (studentId: string): AttendanceRecord | undefined => {
    return attendance.find((a) => a.studentId === studentId && a.date === selectedDate);
  };

  // Instant single-click toggle with auto-save & timestamp
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    StorageService.setStudentAttendance(studentId, selectedClass, selectedDate, status);
    setAttendance(StorageService.getAttendance());
    setLastSavedStudent(studentId);
    setTimeout(() => setLastSavedStudent(null), 1500);
  };

  // Set all students to Hadir in one click
  const handleSetAllHadir = () => {
    classStudents.forEach((s) => {
      StorageService.setStudentAttendance(s.id, selectedClass, selectedDate, "Hadir");
    });
    setAttendance(StorageService.getAttendance());
  };

  // Summary counts
  const hadirCount = classStudents.filter(
    (s) => getAttendanceForStudent(s.id)?.status === "Hadir"
  ).length;
  const sakitCount = classStudents.filter(
    (s) => getAttendanceForStudent(s.id)?.status === "Sakit"
  ).length;
  const izinCount = classStudents.filter(
    (s) => getAttendanceForStudent(s.id)?.status === "Izin"
  ).length;
  const alpaCount = classStudents.filter(
    (s) => getAttendanceForStudent(s.id)?.status === "Alpa"
  ).length;
  const total = classStudents.length || 1;
  const attendanceRate = Math.round((hadirCount / total) * 100);

  const handleExportExcel = () => {
    ExcelService.exportAttendanceExcel(attendance, classStudents, selectedDate);
  };

  const handleExportPDF = () => {
    const lines = [
      `Rekapitulasi Absensi Digital Kelas 4A SD Negeri 3 Banjar Ratu`,
      `Tanggal: ${selectedDate}`,
      `Kehadiran: ${hadirCount} Hadir | ${sakitCount} Sakit | ${izinCount} Izin | ${alpaCount} Alpa (${attendanceRate}%)`,
      ``,
      ...classStudents.map((s, idx) => {
        const rec = getAttendanceForStudent(s.id);
        return `${idx + 1}. ${s.name} (${s.nisn}) - Status: ${rec?.status || "Belum Absen"} [Pukul ${rec?.timestamp || "-"}]`;
      }),
    ];
    ExportService.exportTextPDF("Rekap Absensi Harian Siswa", lines.join("\n"), `Absensi_${selectedDate}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fitur Wajib Interaktif</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Absensi Digital Siswa (Sekali Klik & Auto-Save)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Warna berubah seketika tanpa refresh. Waktu absen dan status tersimpan otomatis ke database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowQRModal(true)}
            className="px-3.5 py-2 text-xs font-bold bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Absensi</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filter & Live Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Class and Date picker */}
        <div className="glass-card rounded-2xl p-4 md:col-span-2 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[130px]">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Rombel / Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none border border-transparent focus:border-blue-400"
            >
              <option value="cls-4a">Kelas 4A (Fase B)</option>
              <option value="cls-4b">Kelas 4B (Fase B)</option>
              <option value="cls-1a">Kelas 1A (Fase A)</option>
              <option value="cls-2a">Kelas 2A (Fase A)</option>
              <option value="cls-3a">Kelas 3A (Fase B)</option>
              <option value="cls-5a">Kelas 5A (Fase C)</option>
              <option value="cls-6a">Kelas 6A (Fase C)</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Tanggal Presensi
            </label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 outline-none border border-transparent focus:border-blue-400"
              />
            </div>
          </div>

          <button
            onClick={handleSetAllHadir}
            className="px-3 py-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold rounded-xl transition-all self-end"
          >
            Semua Hadir
          </button>
        </div>

        {/* Real-Time Live Counter Badge */}
        <div className="glass-card rounded-2xl p-4 md:col-span-2 grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/70">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Hadir</span>
            <p className="text-xl font-black text-emerald-600">{hadirCount}</p>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/70">
            <span className="text-[10px] font-bold text-amber-700 uppercase">Sakit</span>
            <p className="text-xl font-black text-amber-600">{sakitCount}</p>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200/70">
            <span className="text-[10px] font-bold text-blue-700 uppercase">Izin</span>
            <p className="text-xl font-black text-blue-600">{izinCount}</p>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200/70">
            <span className="text-[10px] font-bold text-rose-700 uppercase">Alpa</span>
            <p className="text-xl font-black text-rose-600">{alpaCount}</p>
          </div>
        </div>
      </div>

      {/* Student Attendance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classStudents.map((student) => {
          const rec = getAttendanceForStudent(student.id);
          const currentStatus: AttendanceStatus = rec?.status || "Hadir";
          const isJustSaved = lastSavedStudent === student.id;

          return (
            <div
              key={student.id}
              className={`glass-card glass-card-hover rounded-3xl p-4 border transition-all relative overflow-hidden ${
                currentStatus === "Hadir"
                  ? "border-emerald-300/80 bg-emerald-50/20"
                  : currentStatus === "Alpa"
                  ? "border-rose-300/80 bg-rose-50/25"
                  : currentStatus === "Sakit"
                  ? "border-amber-300/80 bg-amber-50/25"
                  : "border-blue-300/80 bg-blue-50/25"
              }`}
            >
              {/* Auto Save Feedback Tag */}
              {isJustSaved && (
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-white/90 px-2 py-0.5 rounded-full shadow-xs animate-bounce">
                  <Check className="w-3 h-3" />
                  <span>Tersimpan</span>
                </div>
              )}

              {/* Student Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{student.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400">NISN: {student.nisn}</p>
                  <p className="text-[10px] text-slate-500">
                    Jam: <span className="font-semibold">{rec?.timestamp || "07:15"}</span>
                  </p>
                </div>
              </div>

              {/* 4 Big One-Click Status Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {/* 🟢 Hadir */}
                <button
                  onClick={() => handleSetStatus(student.id, "Hadir")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === "Hadir"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-102 ring-2 ring-emerald-300"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80"
                  }`}
                >
                  <span>🟢</span>
                  <span>Hadir</span>
                </button>

                {/* 🔴 Alpa */}
                <button
                  onClick={() => handleSetStatus(student.id, "Alpa")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === "Alpa"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-102 ring-2 ring-rose-300"
                      : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/80"
                  }`}
                >
                  <span>🔴</span>
                  <span>Alpa</span>
                </button>

                {/* 🟡 Sakit */}
                <button
                  onClick={() => handleSetStatus(student.id, "Sakit")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === "Sakit"
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-102 ring-2 ring-amber-300"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80"
                  }`}
                >
                  <span>🟡</span>
                  <span>Sakit</span>
                </button>

                {/* 🔵 Izin */}
                <button
                  onClick={() => handleSetStatus(student.id, "Izin")}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === "Izin"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102 ring-2 ring-blue-300"
                      : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/80"
                  }`}
                >
                  <span>🔵</span>
                  <span>Izin</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Absensi Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="glass-dropdown max-w-sm w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-md">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="font-bold text-base text-slate-800">
              QR Presensi Siswa Kelas 4A
            </h3>
            <p className="text-xs text-slate-500">
              Tampilkan di layar proyektor atau cetak untuk ditempel di pintu kelas. Siswa atau Orang Tua dapat memindai untuk presensi mandiri.
            </p>

            {/* Generated QR Code Graphic */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <div className="w-48 h-48 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white text-center">
                <QrCode className="w-32 h-32 text-white" />
                <span className="text-[10px] font-mono tracking-widest mt-1">SDN3-BANJARRATU-4A</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-600 font-semibold">
              Kode Dinamis • Berlaku untuk {selectedDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
