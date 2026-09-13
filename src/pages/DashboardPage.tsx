import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  FileBadge,
  Calendar as CalendarIcon,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { Student, AttendanceRecord, GradeRecord, ScheduleItem, LessonPlanModule } from "../types";

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onOpenAIChat: () => void;
}

export const DashboardPage = ({ onNavigate, onOpenAIChat }: DashboardPageProps) => {
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [classes, setClasses] = useState(StorageService.getClasses());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(StorageService.getAttendance());
  const [grades, setGrades] = useState<GradeRecord[]>(StorageService.getGrades());
  const [schedules, setSchedules] = useState<ScheduleItem[]>(StorageService.getSchedules());
  const [modules, setModules] = useState<LessonPlanModule[]>(StorageService.getModules());

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(StorageService.getStudents());
      setClasses(StorageService.getClasses());
      setAttendance(StorageService.getAttendance());
      setGrades(StorageService.getGrades());
      setSchedules(StorageService.getSchedules());
      setModules(StorageService.getModules());
    };
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const hadirCount = todayAttendance.filter((a) => a.status === "Hadir").length;
  const totalAttended = todayAttendance.length || 1;
  const attendanceRate = Math.round((hadirCount / totalAttended) * 100);

  const pendingGradesCount = students.filter(
    (s) => !grades.some((g) => g.studentId === s.id && g.finalScore)
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Glassmorphism and Deep Learning Tagline */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white p-6 md:p-8 shadow-xl shadow-blue-500/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kurikulum Merdeka • Pembelajaran Mendalam</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Guru AI Indonesia
          </h1>
          <p className="mt-2 text-xs md:text-sm text-blue-100 leading-relaxed">
            Kelola seluruh administrasi pembelajaran SD secara terpadu tanpa berpindah aplikasi:
            mulai dari Perencanaan, Modul Ajar AI, Absensi Digital, Nilai, hingga Rapor dan Portal Orang Tua.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate("import-excel")}
              className="px-4 py-2 text-xs font-bold bg-white text-blue-800 rounded-xl hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Import Siswa Sekali</span>
            </button>
            <button
              onClick={() => onNavigate("modul-ai")}
              className="px-4 py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buat Modul Ajar AI</span>
            </button>
            <button
              onClick={() => onNavigate("absensi")}
              className="px-4 py-2 text-xs font-bold bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 border border-white/30 transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-300" />
              <span>Absensi Hari Ini</span>
            </button>
          </div>
        </div>

        {/* Decorative background visual circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute right-40 -top-10 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl" />
      </div>

      {/* 4 Interactive KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Jumlah Kelas */}
        <div
          onClick={() => onNavigate("data-kelas")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Rombel
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{classes.length}</span>
            <span className="text-xs text-slate-500">Kelas Aktif</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Kelas 1 s/d Kelas 6 SD
          </p>
        </div>

        {/* Card 2: Jumlah Siswa */}
        <div
          onClick={() => onNavigate("data-siswa")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jumlah Siswa
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{students.length}</span>
            <span className="text-xs text-slate-500">Peserta Didik</span>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-500" />
            Sinkron ke Absensi & Nilai
          </p>
        </div>

        {/* Card 3: Kehadiran Hari Ini */}
        <div
          onClick={() => onNavigate("absensi")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kehadiran Hari Ini
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{attendanceRate}%</span>
            <span className="text-xs text-slate-500">({hadirCount}/{totalAttended} Siswa)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Card 4: Nilai Belum Diinput */}
        <div
          onClick={() => onNavigate("nilai")}
          className="glass-card glass-card-hover rounded-2xl p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status Penilaian
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{pendingGradesCount}</span>
            <span className="text-xs text-slate-500">Perlu Verifikasi</span>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-2 flex items-center gap-1">
            Klik untuk input / rekap nilai
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns for Interactive Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Jadwal Hari Ini & Modul Terbaru */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jadwal Pelajaran Hari Ini */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800">Jadwal Mengajar Hari Ini (Senin)</h3>
              </div>
              <button
                onClick={() => onNavigate("jadwal")}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {schedules.slice(0, 3).map((sch, idx) => (
                <div
                  key={`${sch.id || "sch"}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      4A
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-slate-800">{sch.subject}</p>
                      <p className="text-[11px] text-slate-500">{sch.room || "Ruang 04"} • {sch.teacherName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs">
                    {sch.timeSlot}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modul Ajar AI Terbaru */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800">Modul Ajar AI Terkini</h3>
              </div>
              <button
                onClick={() => onNavigate("modul-ai")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <span>Buat Modul Baru</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {modules.map((m, idx) => (
              <div
                key={`${m.id || "mod"}-${idx}`}
                onClick={() => onNavigate("modul-ai")}
                className="p-4 rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white hover:border-emerald-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    {m.subject} • {m.gradeLevel}
                  </span>
                  <span className="text-[11px] text-slate-400">{m.allocationTime}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 mt-2">{m.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {m.topic} — Memuat prinsip Berkesadaran, Bermakna, Menggembirakan, dan diferensiasi TPACK.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Kalender Akademik Mini */}
        <div className="space-y-6">
          {/* Action Quick Launch */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Aksi Cepat Guru</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate("import-excel")}
                className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all group"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform mb-1.5" />
                <p className="font-semibold text-xs text-slate-800">Import Siswa</p>
                <p className="text-[10px] text-slate-500">Excel / CSV</p>
              </button>

              <button
                onClick={() => onNavigate("soal-ai")}
                className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all group"
              >
                <Sparkles className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform mb-1.5" />
                <p className="font-semibold text-xs text-slate-800">Bank Soal HOTS</p>
                <p className="text-[10px] text-slate-500">PG & Uraian</p>
              </button>

              <button
                onClick={() => onNavigate("jurnal")}
                className="p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all group"
              >
                <CheckCircle2 className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform mb-1.5" />
                <p className="font-semibold text-xs text-slate-800">Jurnal Mengajar</p>
                <p className="text-[10px] text-slate-500">Voice-to-Text</p>
              </button>

              <button
                onClick={() => onNavigate("rapor")}
                className="p-3 text-left rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 transition-all group"
              >
                <FileBadge className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform mb-1.5" />
                <p className="font-semibold text-xs text-slate-800">Cetak Rapor</p>
                <p className="text-[10px] text-slate-500">PDF & Word</p>
              </button>
            </div>
          </div>

          {/* Kalender Akademik Mini */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-800">Kalender Akademik</h3>
              </div>
              <button
                onClick={() => onNavigate("kalender")}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Buka
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs">
                <span className="font-bold text-amber-800">PTS Ganjil:</span>
                <p className="text-amber-700 text-[11px]">23 - 28 September 2024</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs">
                <span className="font-bold text-emerald-800">Hari Guru Nasional:</span>
                <p className="text-emerald-700 text-[11px]">25 November 2024</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/70 text-xs">
                <span className="font-bold text-rose-800">PAS Ganjil:</span>
                <p className="text-rose-700 text-[11px]">02 - 07 Desember 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
