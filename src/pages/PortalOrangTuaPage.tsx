import { useState, useEffect } from "react";
import {
  HeartHandshake,
  Send,
  MessageCircle,
  Bell,
  CheckCircle2,
  CalendarCheck,
  Award,
  Phone,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { Student, AttendanceRecord } from "../types";

export const PortalOrangTuaPage = () => {
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(StorageService.getAttendance());
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  useEffect(() => {
    const list = StorageService.getStudents();
    setStudents(list);
    setAttendance(StorageService.getAttendance());
    if (list.length > 0 && !selectedStudentId) {
      setSelectedStudentId(list[0].id);
    }
  }, []);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];
  const today = new Date().toISOString().split("T")[0];
  const studentTodayAttendance = attendance.find((a) => a.studentId === student?.id && a.date === today);

  const handleSendWA = (type: "kehadiran" | "nilai" | "custom") => {
    if (!student) return;

    let phone = student.parentPhone.replace(/[^0-9]/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    let text = "";
    if (type === "kehadiran") {
      const status = studentTodayAttendance?.status || "Hadir";
      const jam = studentTodayAttendance?.timestamp || "07:15";
      text = `*LAPORAN KEHADIRAN SISWA - SD NEGERI 3 BANJAR RATU*%0A%0AYth. Bapak/Ibu Wali dari Ananda *${student.name}*,%0A%0AKami menginformasikan bahwa ananda pada hari ini (${today}) telah tercatat: *${status.toUpperCase()}* di kelas 4A pada pukul *${jam} WIB*.%0A%0ATerima kasih atas kerjasama dan dukungannya dalam kedisiplinan belajar ananda.%0A%0A_Wali Kelas 4A, Budi Santoso, S.Pd., Gr._`;
    } else if (type === "nilai") {
      text = `*REKAP CAPAIAN HASIL BELAJAR - SD NEGERI 3 BANJAR RATU*%0A%0AYth. Bapak/Ibu Wali dari Ananda *${student.name}*,%0A%0AAlhamdulillah ananda menunjukkan perkembangan belajar yang sangat baik dalam asesmen sumatif IPAS & Matematika minggu ini.%0A%0ASilakan pantau detail capaian kompetensi melalui portal rapor digital sekolah.%0A%0ASalam hangat,%0A_SD Negeri 3 Banjar Ratu_`;
    } else {
      text = encodeURIComponent(`*PEMBERITAHUAN GURU KELAS 4A SDN 3 BANJAR RATU*\n\nKepada Yth. Wali Murid ${student.name},\n\n${customMessage}\n\nTerima kasih.`);
    }

    const waUrl = `https://wa.me/${phone}?text=${text}`;
    window.open(waUrl, "_blank");

    setSentStatus(`Pesan WhatsApp telah disiapkan untuk ${student.name} (${student.parentPhone})`);
    setTimeout(() => setSentStatus(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-2">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Komunikasi Terpadu & WhatsApp Gateway</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Portal Orang Tua & Notifikasi WhatsApp 1-Klik
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Kirim notifikasi kehadiran harian otomatis, rekap capaian nilai, dan pengumuman sekolah langsung ke WhatsApp wali murid tanpa ribet.
        </p>
      </div>

      {/* Student selector */}
      <div className="glass-card p-3 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 px-2">Wali Murid:</span>
        {students.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStudentId(s.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              student?.id === s.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {student && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 1 Col: Student and Parent Info Card */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/40"
              />
              <div>
                <h3 className="font-bold text-base text-slate-800">{student.name}</h3>
                <p className="text-xs text-slate-500 font-mono">NISN: {student.nisn}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md">
                  {student.classId.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Orang Tua</span>
                <p className="font-semibold text-slate-800">
                  Ayah: {student.fatherName} • Ibu: {student.motherName}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">No WhatsApp</span>
                <p className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {student.parentPhone}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Alamat Rumah</span>
                <p className="text-slate-600 leading-snug">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Right 2 Cols: 1-Click WhatsApp Notification Hub */}
          <div className="md:col-span-2 glass-card p-6 md:p-8 rounded-3xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Pusat Pengiriman Notifikasi WhatsApp</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                Gateway Aktif
              </span>
            </div>

            {sentStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sentStatus}</span>
              </div>
            )}

            {/* Quick Template Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Kehadiran */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700">Presensi Hari Ini</span>
                  <h4 className="font-bold text-xs text-slate-800 mt-1">Kirim Info Kehadiran</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Status: <strong>{studentTodayAttendance?.status || "Hadir"}</strong> (Pukul {studentTodayAttendance?.timestamp || "07:15"} WIB)
                  </p>
                </div>
                <button
                  onClick={() => handleSendWA("kehadiran")}
                  className="mt-3 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim WA Presensi</span>
                </button>
              </div>

              {/* Card 2: Laporan Nilai */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:border-blue-300 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-700">Akademik Siswa</span>
                  <h4 className="font-bold text-xs text-slate-800 mt-1">Kirim Rekap Nilai</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Nilai rata-rata terkini: <strong>88 (Predikat B/A)</strong>
                  </p>
                </div>
                <button
                  onClick={() => handleSendWA("nilai")}
                  className="mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim WA Nilai</span>
                </button>
              </div>
            </div>

            {/* Custom Message to Parent */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="block font-bold text-slate-700">
                Tulis Pesan Khusus ke Wali Murid (Buku Penghubung Digital)
              </label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Contoh: Mengingatkan agar Ananda membawa gunting dan pewarna makanan untuk proyek sains besok pagi..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800 focus:bg-white focus:border-emerald-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSendWA("custom")}
                  disabled={!customMessage.trim()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pesan Kustom</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
