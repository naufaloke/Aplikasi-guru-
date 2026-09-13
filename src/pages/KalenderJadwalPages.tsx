import { useState, useEffect, FormEvent } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  Search,
  Filter,
  X,
  AlertTriangle,
  User,
  BookOpen,
  MapPin,
  CalendarCheck2,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { AcademicCalendarEvent, ScheduleItem, Teacher, Classroom } from "../types";

// Helper to format ISO date string "YYYY-MM-DD" to Indonesian date e.g. "15 Juli 2024"
const formatIndoDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return `${day} ${months[monthIndex] || parts[1]} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const formatEventDateRange = (startDate: string, endDate: string) => {
  if (!startDate) return "";
  if (!endDate || startDate === endDate) {
    return formatIndoDate(startDate);
  }
  return `${formatIndoDate(startDate)} s/d ${formatIndoDate(endDate)}`;
};

// ===================================================
// 1. KALENDER AKADEMIK / PENDIDIKAN (CRUD LENGKAP)
// ===================================================
export const KalenderAkademikPage = () => {
  const [events, setEvents] = useState<AcademicCalendarEvent[]>(StorageService.getCalendar());
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicCalendarEvent | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<{
    title: string;
    startDate: string;
    endDate: string;
    type: AcademicCalendarEvent["type"];
    description: string;
    color: string;
  }>({
    title: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    type: "Agenda",
    description: "",
    color: "bg-blue-500",
  });

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<AcademicCalendarEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleUpdate = () => setEvents(StorageService.getCalendar());
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      title: "",
      startDate: today,
      endDate: today,
      type: "Agenda",
      description: "",
      color: "bg-blue-500",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ev: AcademicCalendarEvent) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      startDate: ev.startDate,
      endDate: ev.endDate || ev.startDate,
      type: ev.type,
      description: ev.description || "",
      color: ev.color || "bg-blue-500",
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingEvent) {
      StorageService.updateCalendarEvent(editingEvent.id, {
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        description: formData.description,
        color: formData.color,
      });
      showToast(`Agenda "${formData.title}" berhasil diperbarui.`);
    } else {
      const newEvent: AcademicCalendarEvent = {
        id: `cal-${Date.now()}`,
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        description: formData.description,
        color: formData.color,
      };
      StorageService.addCalendarEvent(newEvent);
      showToast(`Agenda baru "${formData.title}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (deleteTarget) {
      StorageService.deleteCalendarEvent(deleteTarget.id);
      showToast(`Agenda "${deleteTarget.title}" berhasil dihapus.`);
      setDeleteTarget(null);
    }
  };

  const filtered = events.filter((ev) => {
    const matchSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === "all" || ev.type === filterType;
    return matchSearch && matchType;
  });

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "PTS":
      case "PAS":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "MPLS":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "Libur":
        return "bg-rose-100 text-rose-900 border-rose-300";
      case "Upacara":
        return "bg-purple-100 text-purple-900 border-purple-300";
      default:
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Agenda & Kalender Pendidikan</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Kalender Akademik T.P. 2024/2025 ({events.length} Agenda)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Jadwal operasional KBM, asesmen sumatif, hari libur nasional, dan pembagian rapor SD Negeri 3 Banjar Ratu.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Kalender</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kegiatan, ujian, atau agenda sekolah..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl outline-none border border-slate-200 focus:bg-white focus:border-indigo-400 font-medium"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
        >
          <option value="all">Semua Kategori</option>
          <option value="Agenda">Agenda Sekolah</option>
          <option value="PTS">PTS (Tengah Semester)</option>
          <option value="PAS">PAS (Akhir Semester)</option>
          <option value="MPLS">MPLS</option>
          <option value="Libur">Hari Libur</option>
          <option value="Upacara">Upacara & Peringatan</option>
        </select>
      </div>

      {/* Events Grid with Edit & Delete */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="glass-card p-5 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-700 font-mono text-center shrink-0 border border-indigo-100">
                  <CalendarCheck2 className="w-5 h-5 text-indigo-600 mx-auto" />
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getBadgeStyle(ev.type)}`}>
                    {ev.type}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-800 mt-1.5 leading-snug">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5 font-mono">
                    {formatEventDateRange(ev.startDate, ev.endDate)}
                  </p>
                  {ev.description && (
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {ev.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(ev)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                  title="Edit data agenda"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(ev)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                  title="Hapus agenda"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Tambah / Edit Agenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {editingEvent ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-sm text-slate-800">
                  {editingEvent ? "Edit Agenda Pendidikan" : "Tambah Agenda Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Agenda / Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penilaian Akhir Semester (PAS) Ganjil"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kategori Agenda
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as AcademicCalendarEvent["type"] })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
                >
                  <option value="Agenda">Agenda Sekolah / Umum</option>
                  <option value="PTS">PTS (Penilaian Tengah Semester)</option>
                  <option value="PAS">PAS (Penilaian Akhir Semester)</option>
                  <option value="MPLS">MPLS (Masa Pengenalan Lingkungan Sekolah)</option>
                  <option value="Libur">Hari Libur Nasional / Semester</option>
                  <option value="Upacara">Upacara & Hari Besar Nasional</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value, endDate: e.target.value > formData.endDate ? e.target.value : formData.endDate })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tanggal Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan teknis, tempat, atau sasaran kelas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingEvent ? "Simpan Perubahan" : "Simpan Agenda"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Hapus Agenda */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Hapus Agenda Pendidikan?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus agenda <strong>{deleteTarget.title}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Agenda</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===================================================
// 2. JADWAL PELAJARAN (CRUD LENGKAP: TAMBAH, EDIT, HAPUS)
// ===================================================
export const JadwalPelajaranPage = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(StorageService.getSchedules());
  const [classes] = useState<Classroom[]>(StorageService.getClasses());
  const [teachers] = useState<Teacher[]>(StorageService.getTeachers());

  const [selectedClass, setSelectedClass] = useState<string>("cls-4a");
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    day: "Senin" as ScheduleItem["day"],
    timeSlot: "07:30 - 09:15",
    subject: "IPAS",
    classId: "cls-4a",
    teacherName: "Budi Santoso, S.Pd., Gr.",
    room: "R.04",
  });

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleUpdate = () => setSchedules(StorageService.getSchedules());
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const openAddModal = (defaultDay?: ScheduleItem["day"]) => {
    setEditingSchedule(null);
    setFormData({
      day: defaultDay || "Senin",
      timeSlot: "07:30 - 09:15",
      subject: "IPAS",
      classId: selectedClass === "all" ? "cls-4a" : selectedClass,
      teacherName: teachers[0]?.name || "Budi Santoso, S.Pd., Gr.",
      room: "R.04",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: ScheduleItem) => {
    setEditingSchedule(s);
    setFormData({
      day: s.day,
      timeSlot: s.timeSlot,
      subject: s.subject,
      classId: s.classId,
      teacherName: s.teacherName,
      room: s.room || "R.04",
    });
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;

    if (editingSchedule) {
      StorageService.updateSchedule(editingSchedule.id, {
        day: formData.day,
        timeSlot: formData.timeSlot,
        subject: formData.subject,
        classId: formData.classId,
        teacherName: formData.teacherName,
        room: formData.room,
      });
      showToast(`Jadwal "${formData.subject}" (${formData.day}) berhasil diperbarui.`);
    } else {
      const newSchedule: ScheduleItem = {
        id: `sch-${Date.now()}`,
        day: formData.day,
        timeSlot: formData.timeSlot,
        subject: formData.subject,
        classId: formData.classId,
        teacherName: formData.teacherName,
        room: formData.room,
      };
      StorageService.addSchedule(newSchedule);
      showToast(`Jadwal baru "${formData.subject}" (${formData.day}) berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteSchedule = () => {
    if (deleteTarget) {
      StorageService.deleteSchedule(deleteTarget.id);
      showToast(`Jadwal "${deleteTarget.subject}" berhasil dihapus.`);
      setDeleteTarget(null);
    }
  };

  const filteredSchedules = schedules.filter(
    (s) => selectedClass === "all" || s.classId === selectedClass
  );

  const selectedClassName =
    selectedClass === "all"
      ? "Semua Rombongan Belajar"
      : classes.find((c) => c.id === selectedClass)?.name || selectedClass.toUpperCase();

  const commonSubjects = [
    "IPAS (Ilmu Pengetahuan Alam & Sosial)",
    "Matematika",
    "Bahasa Indonesia",
    "Pendidikan Pancasila",
    "Pendidikan Agama & Budi Pekerti",
    "PJOK (Pendidikan Jasmani & Olahraga)",
    "Seni Rupa / Kerajinan",
    "Bahasa Inggris",
    "Projek Profil Pelajar Pancasila (P5)",
    "Upacara Bendera",
    "Senam Sehat & Literasi Pagi",
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Jadwal Tatap Muka & Ruangan</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Jadwal Pelajaran: {selectedClassName}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Atur dan distribusikan jadwal tatap muka mingguan, alokasi jam pelajaran, guru pengampu, serta ruang belajar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Selector Dropdown */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 shadow-2xs"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => openAddModal()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* Weekly Grid (Senin - Sabtu) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => {
          const dayItems = filteredSchedules.filter((s) => s.day === day);

          return (
            <div
              key={day}
              className="glass-card p-5 rounded-3xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <h3 className="font-black text-sm text-slate-800">{day}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {dayItems.length} Sesi
                  </span>
                </div>

                {/* Day Items */}
                <div className="space-y-2 mt-3">
                  {dayItems.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-slate-400 font-medium">Belum ada jadwal pada hari {day}</p>
                      <button
                        onClick={() => openAddModal(day)}
                        className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        + Tambah Sesi
                      </button>
                    </div>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50/80 hover:bg-blue-50/40 rounded-2xl border border-slate-200/80 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-black text-xs text-slate-800">{item.subject}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="font-mono font-medium">{item.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="font-medium truncate">{item.teacherName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-mono">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{item.room || "R.04"}</span>
                              {selectedClass === "all" && (
                                <span className="ml-2 font-bold text-blue-600 uppercase">
                                  {item.classId.replace("cls-", "Kelas ")}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-all"
                              title="Edit jadwal"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1 text-rose-500 hover:bg-rose-100 rounded-md transition-all"
                              title="Hapus jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Sesi for this specific day */}
              {dayItems.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openAddModal(day)}
                    className="w-full py-1.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sesi {day}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: Tambah / Edit Jadwal Pelajaran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {editingSchedule ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-sm text-slate-800">
                  {editingSchedule ? "Edit Sesi Jadwal Pelajaran" : "Tambah Jadwal Pelajaran"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Hari Belajar <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as ScheduleItem["day"] })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Target Rombel / Kelas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  <select
                    value={commonSubjects.includes(formData.subject) ? formData.subject : "custom"}
                    onChange={(e) => {
                      if (e.target.value !== "custom") {
                        setFormData({ ...formData, subject: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                  >
                    {commonSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                    <option value="custom">-- Ketik Mapel Lainnya --</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Nama mata pelajaran / aktivitas..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Alokasi Waktu (Jam) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 07:30 - 09:15"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Ruang Belajar
                  </label>
                  <input
                    type="text"
                    placeholder="R.04 / Lapangan / Lab"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Guru Pengampu
                </label>
                <select
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800 focus:bg-white focus:border-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                  <option value="Tim Fasilitator P5">Tim Fasilitator P5</option>
                  <option value="Seluruh Dewan Guru">Seluruh Dewan Guru</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSchedule ? "Simpan Perubahan" : "Simpan Jadwal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Hapus Jadwal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Hapus Sesi Jadwal?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus jadwal <strong>{deleteTarget.subject}</strong> pada hari <strong>{deleteTarget.day}</strong> ({deleteTarget.timeSlot})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSchedule}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Jadwal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
