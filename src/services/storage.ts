import {
  SchoolProfile,
  Teacher,
  SchoolClass,
  Student,
  AttendanceRecord,
  GradeRecord,
  LessonPlanModule,
  JournalRecord,
  AcademicCalendarEvent,
  ScheduleItem,
  ImportLog,
  UserProfile,
} from "../types";

const STORAGE_KEYS = {
  SCHOOL: "guru_ai_school",
  USER: "guru_ai_user",
  TEACHERS: "guru_ai_teachers",
  CLASSES: "guru_ai_classes",
  STUDENTS: "guru_ai_students",
  ATTENDANCE: "guru_ai_attendance",
  GRADES: "guru_ai_grades",
  MODULES: "guru_ai_modules",
  JOURNALS: "guru_ai_journals",
  CALENDAR: "guru_ai_calendar",
  SCHEDULES: "guru_ai_schedules",
  IMPORT_LOGS: "guru_ai_import_logs",
  OFFLINE_MODE: "guru_ai_offline_mode",
};

// Initial Seed Data for SD Negeri 3 Banjar Ratu
const defaultSchool: SchoolProfile = {
  name: "SD Negeri 3 Banjar Ratu",
  npsn: "10803452",
  logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80",
  address: "Jl. Raya Lintas Sumatra No. 45, Banjar Ratu, Kec. Way Pengubuan",
  principal: "Drs. H. Mulyono, M.Pd.",
  nipPrincipal: "196805121992031004",
  academicYear: "2024/2025",
  semester: "Ganjil",
  district: "Way Pengubuan",
  city: "Kab. Lampung Tengah",
  province: "Lampung",
};

const defaultUser: UserProfile = {
  id: "usr-01",
  name: "Budi Santoso, S.Pd., Gr.",
  email: "budi.santoso@guru.sd.belajar.id",
  role: "Wali Kelas",
  nip: "198807142014021003",
  classAssigned: "Kelas 4A",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const defaultTeachers: Teacher[] = [
  {
    id: "tch-1",
    name: "Budi Santoso, S.Pd., Gr.",
    nip: "198807142014021003",
    ukg: "201502938411",
    subject: "Guru Kelas (Tematik/IPAS)",
    classes: ["Kelas 4A"],
    phone: "081278901234",
    email: "budi.santoso@guru.sd.belajar.id",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "tch-2",
    name: "Siti Rahayu, S.Pd.SD.",
    nip: "199003212015032007",
    ukg: "201603948522",
    subject: "Guru Kelas",
    classes: ["Kelas 4B"],
    phone: "081398765432",
    email: "siti.rahayu@guru.sd.belajar.id",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "tch-3",
    name: "Ahmad Fauzi, S.Pd.I.",
    nip: "198511052010011015",
    ukg: "201401827394",
    subject: "Pendidikan Agama Islam",
    classes: ["Kelas 1A", "Kelas 2A", "Kelas 3A", "Kelas 4A", "Kelas 5A", "Kelas 6A"],
    phone: "085267123490",
    email: "ahmad.fauzi@guru.sd.belajar.id",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "tch-4",
    name: "Rina Kusuma, S.Pd.KOR",
    nip: "199304182019032009",
    ukg: "201804918231",
    subject: "PJOK",
    classes: ["Kelas 4A", "Kelas 4B", "Kelas 5A", "Kelas 6A"],
    phone: "085389012378",
    email: "rina.kusuma@guru.sd.belajar.id",
    photoUrl: "https://images.unsplash.com/photo-1580894732488-8255476a6cf3?w=150&auto=format&fit=crop&q=80",
  },
];

const defaultClasses: SchoolClass[] = [
  { id: "cls-1a", name: "Kelas 1A", level: 1, homeroomTeacher: "Dewi Lestari, S.Pd.", room: "Gedung A - R.01", capacity: 28 },
  { id: "cls-1b", name: "Kelas 1B", level: 1, homeroomTeacher: "Nurul Hidayah, S.Pd.", room: "Gedung A - R.02", capacity: 28 },
  { id: "cls-1c", name: "Kelas 1C", level: 1, homeroomTeacher: "Ahmad Fauzi, S.Pd.", room: "Gedung A - R.03", capacity: 28 },
  { id: "cls-2a", name: "Kelas 2A", level: 2, homeroomTeacher: "Ratna Sari, S.Pd.", room: "Gedung A - R.04", capacity: 28 },
  { id: "cls-2b", name: "Kelas 2B", level: 2, homeroomTeacher: "Diana Putri, S.Pd.", room: "Gedung A - R.05", capacity: 28 },
  { id: "cls-3a", name: "Kelas 3A", level: 3, homeroomTeacher: "Hendra Wijaya, S.Pd.", room: "Gedung B - R.01", capacity: 28 },
  { id: "cls-3b", name: "Kelas 3B", level: 3, homeroomTeacher: "Fitri Handayani, S.Pd.", room: "Gedung B - R.02", capacity: 28 },
  { id: "cls-4a", name: "Kelas 4A", level: 4, homeroomTeacher: "Budi Santoso, S.Pd., Gr.", room: "Gedung B - R.03", capacity: 28 },
  { id: "cls-4b", name: "Kelas 4B", level: 4, homeroomTeacher: "Siti Rahayu, S.Pd.SD.", room: "Gedung B - R.04", capacity: 28 },
  { id: "cls-5a", name: "Kelas 5A", level: 5, homeroomTeacher: "Eko Prasetyo, S.Pd.", room: "Gedung C - R.01", capacity: 30 },
  { id: "cls-5b", name: "Kelas 5B", level: 5, homeroomTeacher: "Rina Kusuma, S.Pd.", room: "Gedung C - R.02", capacity: 30 },
  { id: "cls-6a", name: "Kelas 6A", level: 6, homeroomTeacher: "Sri Wahyuni, M.Pd.", room: "Gedung C - R.03", capacity: 30 },
  { id: "cls-6b", name: "Kelas 6B", level: 6, homeroomTeacher: "Agus Pratama, M.Pd.", room: "Gedung C - R.04", capacity: 30 },
];

const defaultStudents: Student[] = [
  {
    id: "std-001",
    nisn: "0123456789",
    nis: "21401",
    name: "Andi Saputra",
    gender: "L",
    pob: "Lampung Tengah",
    dob: "2014-05-14",
    religion: "Islam",
    address: "Dusun 2 RT 04, Desa Banjar Ratu",
    fatherName: "Supriyanto",
    motherName: "Siti Maryam",
    parentPhone: "081273849102",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-002",
    nisn: "0123456790",
    nis: "21402",
    name: "Siti Nurhaliza",
    gender: "P",
    pob: "Bandar Lampung",
    dob: "2014-08-20",
    religion: "Islam",
    address: "Jl. Melati No. 12, Banjar Ratu",
    fatherName: "Hendra Gunawan",
    motherName: "Nurul Aini",
    parentPhone: "085289123456",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-003",
    nisn: "0123456791",
    nis: "21403",
    name: "Bima Pratama",
    gender: "L",
    pob: "Metro",
    dob: "2014-03-11",
    religion: "Islam",
    address: "Desa Way Kenanga RT 01",
    fatherName: "Bambang Irawan",
    motherName: "Dewi Astuti",
    parentPhone: "082198765432",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-004",
    nisn: "0123456792",
    nis: "21404",
    name: "Cantika Dewi",
    gender: "P",
    pob: "Lampung Tengah",
    dob: "2014-09-29",
    religion: "Islam",
    address: "Komplek Perkebunan Blok C3",
    fatherName: "Wayan Darmawan",
    motherName: "Ni Ketut Suci",
    parentPhone: "087812345678",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-005",
    nisn: "0123456793",
    nis: "21405",
    name: "Dimas Arya Wijaya",
    gender: "L",
    pob: "Kotabumi",
    dob: "2014-11-02",
    religion: "Islam",
    address: "Jl. Merdeka No. 8, Banjar Ratu",
    fatherName: "Agus Wijaya",
    motherName: "Rini Susanti",
    parentPhone: "081367890123",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-006",
    nisn: "0123456794",
    nis: "21406",
    name: "Fadhil Muhammad",
    gender: "L",
    pob: "Bandar Jaya",
    dob: "2014-01-15",
    religion: "Islam",
    address: "Dusun 1 RT 02, Banjar Ratu",
    fatherName: "Rudi Hartono",
    motherName: "Nur Fatimah",
    parentPhone: "081987654321",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-007",
    nisn: "0123456795",
    nis: "21407",
    name: "Gita Permata",
    gender: "P",
    pob: "Lampung Tengah",
    dob: "2014-07-07",
    religion: "Islam",
    address: "Jl. Flamboyan No. 5, Banjar Ratu",
    fatherName: "Hariyanto",
    motherName: "Endang Sulastri",
    parentPhone: "085712349087",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "std-008",
    nisn: "0123456796",
    nis: "21408",
    name: "Hafiz Al-Farizi",
    gender: "L",
    pob: "Lampung Tengah",
    dob: "2014-12-18",
    religion: "Islam",
    address: "Dusun 3 RT 05, Banjar Ratu",
    fatherName: "Kurniawan",
    motherName: "Tri Wahyuni",
    parentPhone: "081290876543",
    classId: "cls-4a",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
  },
];

const todayDate = new Date().toISOString().split("T")[0];

const defaultAttendance: AttendanceRecord[] = [
  { id: "att-1", studentId: "std-001", classId: "cls-4a", date: todayDate, status: "Hadir", timestamp: "07:15:20" },
  { id: "att-2", studentId: "std-002", classId: "cls-4a", date: todayDate, status: "Hadir", timestamp: "07:18:45" },
  { id: "att-3", studentId: "std-003", classId: "cls-4a", date: todayDate, status: "Sakit", timestamp: "07:30:10", notes: "Demam dan batuk" },
  { id: "att-4", studentId: "std-004", classId: "cls-4a", date: todayDate, status: "Hadir", timestamp: "07:05:00" },
  { id: "att-5", studentId: "std-005", classId: "cls-4a", date: todayDate, status: "Izin", timestamp: "07:22:15", notes: "Acara keluarga di desa" },
  { id: "att-6", studentId: "std-006", classId: "cls-4a", date: todayDate, status: "Hadir", timestamp: "07:10:30" },
  { id: "att-7", studentId: "std-007", classId: "cls-4a", date: todayDate, status: "Hadir", timestamp: "07:12:00" },
  { id: "att-8", studentId: "std-008", classId: "cls-4a", date: todayDate, status: "Alpa", timestamp: "08:00:00", notes: "Tanpa keterangan" },
];

const defaultGrades: GradeRecord[] = [
  { id: "grd-1", studentId: "std-001", classId: "cls-4a", subject: "IPAS", tugas: 88, ph: 85, pts: 84, pas: 90, finalScore: 87, predicate: "Sangat Baik", description: "Menunjukkan pemahaman mendalam tentang anatomi tumbuhan dan fungsi ekosistem." },
  { id: "grd-2", studentId: "std-002", classId: "cls-4a", subject: "IPAS", tugas: 92, ph: 90, pts: 88, pas: 94, finalScore: 91, predicate: "Sangat Baik", description: "Sangat terampil melakukan observasi lapangan dan menyajikan laporan kelompok." },
  { id: "grd-3", studentId: "std-003", classId: "cls-4a", subject: "IPAS", tugas: 65, ph: 68, pts: 60, pas: 66, finalScore: 65, predicate: "Perlu Bimbingan", description: "Perlu penguatan konsep fotosintesis dan pendampingan remedial berkala." },
  { id: "grd-4", studentId: "std-004", classId: "cls-4a", subject: "IPAS", tugas: 85, ph: 80, pts: 82, pas: 85, finalScore: 83, predicate: "Baik", description: "Mampu menjelaskan fungsi akar dan batang dengan ilustrasi gambar yang baik." },
  { id: "grd-5", studentId: "std-005", classId: "cls-4a", subject: "IPAS", tugas: 78, ph: 75, pts: 76, pas: 80, finalScore: 77, predicate: "Baik", description: "Cukup aktif dalam investigasi kelompok, perlu peningkatan ketelitian tugas mandiri." },
  { id: "grd-6", studentId: "std-006", classId: "cls-4a", subject: "IPAS", tugas: 90, ph: 88, pts: 85, pas: 88, finalScore: 88, predicate: "Sangat Baik", description: "Memahami hubungan timbal balik ekosistem flora dengan sangat memuaskan." },
  { id: "grd-7", studentId: "std-007", classId: "cls-4a", subject: "IPAS", tugas: 86, ph: 84, pts: 80, pas: 85, finalScore: 84, predicate: "Baik", description: "Disiplin mengumpulkan tugas proyek miniatur bagian tumbuhan." },
  { id: "grd-8", studentId: "std-008", classId: "cls-4a", subject: "IPAS", tugas: 70, ph: 72, pts: 68, pas: 74, finalScore: 71, predicate: "Cukup", description: "Perlu bimbingan lebih dalam analisis fungsi stomata dan proses penguapan daun." },
];

const defaultModules: LessonPlanModule[] = [
  {
    id: "mod-1",
    title: "IPAS Kelas 4 Bagian Tubuh Tumbuhan",
    subject: "IPAS",
    gradeLevel: "Kelas 4",
    topic: "Morfologi & Fungsi Bagian Tubuh Tumbuhan",
    allocationTime: "2 JP (2 x 35 Menit)",
    author: "Budi Santoso, S.Pd., Gr.",
    createdAt: "2024-08-15",
    updatedAt: "2024-09-02",
    content: `# MODUL AJAR KURIKULUM MERDEKA
**Satuan Pendidikan:** SD Negeri 3 Banjar Ratu
**Fase / Kelas / Semester:** B / IV / Ganjil
**Alokasi Waktu:** 2 x 35 Menit (Pertemuan 1)
**Mata Pelajaran:** Ilmu Pengetahuan Alam dan Sosial (IPAS)

## A. Capaian Pembelajaran & Tujuan
- Menganalisis bagian tubuh tumbuhan (akar, batang, daun) serta fungsinya bagi kelangsungan hidup.
- Peserta didik mampu menjelaskan proses fotosintesis dengan diagram alir sederhana.

## B. Pendekatan Pembelajaran Mendalam (Deep Learning)
- **Berkesadaran (Mindful):** Mengamati spesimen tumbuhan asli secara langsung di taman sekolah.
- **Bermakna (Meaningful):** Menghubungkan peran akar tanaman dengan pencegahan longsor di lingkungan desa.
- **Menggembirakan (Joyful):** Kuis interaktif tebak bagian tumbuhan dan teka-teki kelompok fotosintesis.

## C. Diferensiasi Pembelajaran
- Visual: Mengamati poster 3D anatomi daun dan xilem/floem.
- Kinestetik: Mencelupkan batang seledri ke larutan pewarna merah dan membongkar tanah pot tanaman.
- Auditori: Diskusi kelompok dan menyimak rekaman suara podcast cilik tentang hutan lindung.`,
  },
];

const defaultJournals: JournalRecord[] = [
  {
    id: "jrn-1",
    date: todayDate,
    day: "Senin",
    classId: "cls-4a",
    subject: "IPAS",
    period: "Jam ke 1 - 3 (07.30 - 09.15)",
    material: "Eksplorasi Bagian Tubuh Tumbuhan di Taman Sekolah (Sintaks PBL)",
    attendanceSummary: { hadir: 5, sakit: 1, izin: 1, alpa: 1 },
    reflection: "Siswa sangat antusias saat mencabut rumput liar untuk membedakan akar tunggang dan serabut. Namun waktu presentasi kelompok perlu diefisiensikan.",
    aiSummary: "Pembelajaran aktif berbasis lingkungan berjalan lancar. Fokus tindak lanjut: penguatan manajemen waktu pada sesi 'Gallery Walk'.",
    teacherName: "Budi Santoso, S.Pd., Gr.",
  },
];

const defaultCalendar: AcademicCalendarEvent[] = [
  { id: "cal-1", title: "Masa Pengenalan Lingkungan Sekolah (MPLS)", startDate: "2024-07-15", endDate: "2024-07-17", type: "MPLS", color: "bg-blue-500" },
  { id: "cal-2", title: "Asesmen Sumatif Tengah Semester (PTS)", startDate: "2024-09-23", endDate: "2024-09-28", type: "PTS", color: "bg-amber-500" },
  { id: "cal-3", title: "Asesmen Sumatif Akhir Semester (PAS)", startDate: "2024-12-02", endDate: "2024-12-07", type: "PAS", color: "bg-rose-500" },
  { id: "cal-4", title: "Peringatan Hari Guru Nasional", startDate: "2024-11-25", endDate: "2024-11-25", type: "Agenda", color: "bg-emerald-500" },
  { id: "cal-5", title: "Libur Akhir Semester Ganjil", startDate: "2024-12-23", endDate: "2025-01-04", type: "Libur", color: "bg-slate-500" },
];

const defaultSchedules: ScheduleItem[] = [
  { id: "sch-1", day: "Senin", timeSlot: "07:00 - 07:45", subject: "Upacara Bendera", classId: "cls-4a", teacherName: "Seluruh Dewan Guru", room: "Lapangan" },
  { id: "sch-2", day: "Senin", timeSlot: "07:45 - 09:30", subject: "IPAS (Ilmu Pengetahuan Alam & Sosial)", classId: "cls-4a", teacherName: "Budi Santoso, S.Pd., Gr.", room: "R.04" },
  { id: "sch-3", day: "Senin", timeSlot: "09:45 - 11:30", subject: "Bahasa Indonesia", classId: "cls-4a", teacherName: "Budi Santoso, S.Pd., Gr.", room: "R.04" },
  { id: "sch-4", day: "Selasa", timeSlot: "07:30 - 09:15", subject: "Matematika", classId: "cls-4a", teacherName: "Budi Santoso, S.Pd., Gr.", room: "R.04" },
  { id: "sch-5", day: "Selasa", timeSlot: "09:30 - 11:15", subject: "Pendidikan Pancasila", classId: "cls-4a", teacherName: "Budi Santoso, S.Pd., Gr.", room: "R.04" },
  { id: "sch-6", day: "Rabu", timeSlot: "07:30 - 09:45", subject: "PJOK", classId: "cls-4a", teacherName: "Rina Kusuma, S.Pd.KOR", room: "Lapangan Olahraga" },
  { id: "sch-7", day: "Kamis", timeSlot: "07:30 - 09:15", subject: "Pendidikan Agama & Budi Pekerti", classId: "cls-4a", teacherName: "Ahmad Fauzi, S.Pd.I.", room: "R.04" },
  { id: "sch-8", day: "Jumat", timeSlot: "07:15 - 08:30", subject: "Senam Sehat & Literasi Pagi", classId: "cls-4a", teacherName: "Wali Kelas 4A", room: "Halaman" },
  { id: "sch-9", day: "Sabtu", timeSlot: "07:30 - 10:00", subject: "Projek Penguatan Profil Pelajar Pancasila (P5)", classId: "cls-4a", teacherName: "Tim Fasilitator P5", room: "Kebun Sekolah" },
];

const defaultImportLogs: ImportLog[] = [
  {
    id: "log-01",
    timestamp: "2024-07-10 09:30:15",
    fileName: "DATA_SISWA_KELAS_4A_2024.xlsx",
    total: 8,
    success: 8,
    errors: 0,
    duplicates: 0,
  },
];

// Helper to get from local storage or fallback
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("guru_ai_storage_update", { detail: { key } }));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // School
  getSchool: (): SchoolProfile => getStored(STORAGE_KEYS.SCHOOL, defaultSchool),
  saveSchool: (data: SchoolProfile) => setStored(STORAGE_KEYS.SCHOOL, data),

  // Current User
  getUser: (): UserProfile => getStored(STORAGE_KEYS.USER, defaultUser),
  saveUser: (user: UserProfile) => setStored(STORAGE_KEYS.USER, user),

  // Teachers
  getTeachers: (): Teacher[] => getStored(STORAGE_KEYS.TEACHERS, defaultTeachers),
  saveTeachers: (teachers: Teacher[]) => setStored(STORAGE_KEYS.TEACHERS, teachers),
  addTeacher: (teacher: Teacher) => {
    const list = StorageService.getTeachers();
    const idx = list.findIndex((t) => t.id === teacher.id);
    if (idx >= 0) {
      list[idx] = teacher;
    } else {
      list.unshift(teacher);
    }
    StorageService.saveTeachers(list);
  },
  updateTeacher: (id: string, updates: Partial<Teacher>) => {
    const list = StorageService.getTeachers();
    const idx = list.findIndex((t) => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      StorageService.saveTeachers(list);
    }
  },
  deleteTeacher: (id: string) => {
    const list = StorageService.getTeachers().filter((t) => t.id !== id);
    StorageService.saveTeachers(list);
  },

  // Classes
  getClasses: (): SchoolClass[] => {
    const classes = getStored(STORAGE_KEYS.CLASSES, defaultClasses);
    const students = getStored<Student[]>(STORAGE_KEYS.STUDENTS, defaultStudents);
    return classes.map((c) => ({
      ...c,
      studentCount: students.filter((s) => s.classId === c.id).length,
    }));
  },
  saveClasses: (classes: SchoolClass[]) => setStored(STORAGE_KEYS.CLASSES, classes),
  addClass: (cls: SchoolClass) => {
    const rawClasses = getStored<SchoolClass[]>(STORAGE_KEYS.CLASSES, defaultClasses);
    const idx = rawClasses.findIndex((c) => c.id === cls.id);
    if (idx !== -1) {
      rawClasses[idx] = cls;
    } else {
      rawClasses.push(cls);
    }
    setStored(STORAGE_KEYS.CLASSES, rawClasses);
  },
  updateClass: (classId: string, updates: Partial<SchoolClass>) => {
    const rawClasses = getStored<SchoolClass[]>(STORAGE_KEYS.CLASSES, defaultClasses);
    const idx = rawClasses.findIndex((c) => c.id === classId);
    if (idx !== -1) {
      rawClasses[idx] = { ...rawClasses[idx], ...updates };
      setStored(STORAGE_KEYS.CLASSES, rawClasses);
    }
  },
  deleteClass: (classId: string) => {
    const rawClasses = getStored<SchoolClass[]>(STORAGE_KEYS.CLASSES, defaultClasses);
    const filtered = rawClasses.filter((c) => c.id !== classId);
    setStored(STORAGE_KEYS.CLASSES, filtered);
  },
  resetDefaultClasses: () => {
    setStored(STORAGE_KEYS.CLASSES, defaultClasses);
    return defaultClasses;
  },
  updateClassHomeroom: (classId: string, homeroomTeacher: string) => {
    StorageService.updateClass(classId, { homeroomTeacher });
  },

  // Students
  getStudents: (): Student[] => getStored(STORAGE_KEYS.STUDENTS, defaultStudents),
  saveStudents: (students: Student[]) => {
    setStored(STORAGE_KEYS.STUDENTS, students);
    // Automatic reactive sync with attendance and grades
    StorageService.syncWithAttendanceAndGrades(students);
  },
  addStudent: (student: Student) => {
    const list = StorageService.getStudents();
    const idx = list.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.unshift(student);
    }
    StorageService.saveStudents(list);
  },
  updateStudent: (id: string, updates: Partial<Student>) => {
    const list = StorageService.getStudents();
    const idx = list.findIndex((s) => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      StorageService.saveStudents(list);
    }
  },
  deleteStudent: (id: string) => {
    const list = StorageService.getStudents().filter((s) => s.id !== id);
    StorageService.saveStudents(list);
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => getStored(STORAGE_KEYS.ATTENDANCE, defaultAttendance),
  saveAttendance: (records: AttendanceRecord[]) => setStored(STORAGE_KEYS.ATTENDANCE, records),
  setStudentAttendance: (studentId: string, classId: string, date: string, status: AttendanceRecord["status"], notes?: string) => {
    const list = StorageService.getAttendance();
    const existingIdx = list.findIndex((a) => a.studentId === studentId && a.date === date);
    const nowTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    if (existingIdx >= 0) {
      list[existingIdx] = {
        ...list[existingIdx],
        status,
        timestamp: nowTime,
        notes: notes || list[existingIdx].notes,
      };
    } else {
      list.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        classId,
        date,
        status,
        timestamp: nowTime,
        notes,
      });
    }
    StorageService.saveAttendance(list);
  },

  // Grades
  getGrades: (): GradeRecord[] => getStored(STORAGE_KEYS.GRADES, defaultGrades),
  saveGrades: (grades: GradeRecord[]) => setStored(STORAGE_KEYS.GRADES, grades),
  saveGrade: (studentId: string, subject: string, updates: Partial<GradeRecord>) => {
    StorageService.updateStudentGrade(studentId, subject, updates.classId || "cls-4a", updates);
  },
  updateStudentGrade: (studentId: string, subject: string, classId: string, updates: Partial<GradeRecord>) => {
    const list = StorageService.getGrades();
    const idx = list.findIndex((g) => g.studentId === studentId && g.subject === subject);
    
    // Auto calculate final score (weighted: Tugas 20%, PH 30%, PTS 25%, PAS 25%)
    const calculateFinal = (t: number, ph: number, pts: number, pas: number) => {
      const avg = Math.round((t * 0.2) + (ph * 0.3) + (pts * 0.25) + (pas * 0.25));
      let predicate = "Perlu Bimbingan";
      if (avg >= 85) predicate = "Sangat Baik";
      else if (avg >= 75) predicate = "Baik";
      else if (avg >= 65) predicate = "Cukup";
      return { finalScore: avg, predicate };
    };

    if (idx >= 0) {
      const merged = { ...list[idx], ...updates };
      const computed = calculateFinal(merged.tugas, merged.ph, merged.pts, merged.pas);
      list[idx] = { ...merged, ...computed };
    } else {
      const tugas = updates.tugas || 75;
      const ph = updates.ph || 75;
      const pts = updates.pts || 75;
      const pas = updates.pas || 75;
      const computed = calculateFinal(tugas, ph, pts, pas);
      list.push({
        id: `grd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        classId,
        subject,
        tugas,
        ph,
        pts,
        pas,
        ...computed,
        description: "Menunjukkan kemajuan belajar sesuai capaian pembelajaran.",
      });
    }
    StorageService.saveGrades(list);
  },

  // Modules
  getModules: (): LessonPlanModule[] => {
    const raw = getStored(STORAGE_KEYS.MODULES, defaultModules);
    const seen = new Set<string>();
    const unique: LessonPlanModule[] = [];
    for (const m of raw) {
      if (m && m.id && !seen.has(m.id)) {
        seen.add(m.id);
        unique.push(m);
      }
    }
    return unique;
  },
  saveModules: (modules: LessonPlanModule[]) => {
    const seen = new Set<string>();
    const unique = modules.filter((m) => {
      if (!m || !m.id || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
    setStored(STORAGE_KEYS.MODULES, unique);
  },
  addModule: (module: LessonPlanModule) => {
    const list = StorageService.getModules();
    const idx = list.findIndex((m) => m.id === module.id);
    if (idx >= 0) {
      list[idx] = module;
    } else {
      list.unshift(module);
    }
    StorageService.saveModules(list);
  },

  // Journals
  getJournals: (): JournalRecord[] => getStored(STORAGE_KEYS.JOURNALS, defaultJournals),
  saveJournals: (journals: JournalRecord[]) => setStored(STORAGE_KEYS.JOURNALS, journals),
  addJournal: (journal: any) => {
    const list = StorageService.getJournals();
    const idx = list.findIndex((j) => j.id === journal.id);
    if (idx >= 0) {
      list[idx] = journal;
    } else {
      list.unshift(journal);
    }
    StorageService.saveJournals(list);
  },
  deleteJournal: (id: string) => {
    const list = StorageService.getJournals().filter((j: any) => j.id !== id);
    StorageService.saveJournals(list);
  },

  // Calendar
  getCalendar: (): AcademicCalendarEvent[] => getStored(STORAGE_KEYS.CALENDAR, defaultCalendar),
  saveCalendar: (events: AcademicCalendarEvent[]) => setStored(STORAGE_KEYS.CALENDAR, events),
  addCalendarEvent: (event: AcademicCalendarEvent) => {
    const list = StorageService.getCalendar();
    list.unshift(event);
    StorageService.saveCalendar(list);
  },
  updateCalendarEvent: (id: string, updates: Partial<AcademicCalendarEvent>) => {
    const list = StorageService.getCalendar();
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      StorageService.saveCalendar(list);
    }
  },
  deleteCalendarEvent: (id: string) => {
    const list = StorageService.getCalendar().filter((e) => e.id !== id);
    StorageService.saveCalendar(list);
  },

  // Schedules
  getSchedules: (): ScheduleItem[] => getStored(STORAGE_KEYS.SCHEDULES, defaultSchedules),
  saveSchedules: (schedules: ScheduleItem[]) => setStored(STORAGE_KEYS.SCHEDULES, schedules),
  addSchedule: (schedule: ScheduleItem) => {
    const list = StorageService.getSchedules();
    list.push(schedule);
    StorageService.saveSchedules(list);
  },
  updateSchedule: (id: string, updates: Partial<ScheduleItem>) => {
    const list = StorageService.getSchedules();
    const idx = list.findIndex((s) => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      StorageService.saveSchedules(list);
    }
  },
  deleteSchedule: (id: string) => {
    const list = StorageService.getSchedules().filter((s) => s.id !== id);
    StorageService.saveSchedules(list);
  },

  // Import Logs
  getImportLogs: (): ImportLog[] => getStored(STORAGE_KEYS.IMPORT_LOGS, defaultImportLogs),
  addImportLog: (log: ImportLog) => {
    const list = StorageService.getImportLogs();
    list.unshift(log);
    setStored(STORAGE_KEYS.IMPORT_LOGS, list);
  },

  // Offline Mode Toggle
  getOfflineMode: (): boolean => getStored(STORAGE_KEYS.OFFLINE_MODE, false),
  setOfflineMode: (val: boolean) => setStored(STORAGE_KEYS.OFFLINE_MODE, val),

  // Auto-Sync across related tables when students are updated or imported
  syncWithAttendanceAndGrades: (students: Student[]) => {
    const attendance = StorageService.getAttendance();
    const grades = StorageService.getGrades();
    let attChanged = false;
    let grdChanged = false;

    // Ensure every student has an attendance slot for today
    for (const s of students) {
      const hasToday = attendance.some((a) => a.studentId === s.id && a.date === todayDate);
      if (!hasToday) {
        attendance.push({
          id: `att-${Date.now()}-${s.id}`,
          studentId: s.id,
          classId: s.classId,
          date: todayDate,
          status: "Hadir",
          timestamp: "07:15:00",
        });
        attChanged = true;
      }

      // Ensure every student has an IPAS grade slot
      const hasGrade = grades.some((g) => g.studentId === s.id && g.subject === "IPAS");
      if (!hasGrade) {
        grades.push({
          id: `grd-${Date.now()}-${s.id}`,
          studentId: s.id,
          classId: s.classId,
          subject: "IPAS",
          tugas: 80,
          ph: 80,
          pts: 80,
          pas: 80,
          finalScore: 80,
          predicate: "Baik",
          description: "Mencapai tujuan pembelajaran dengan pemahaman yang baik.",
        });
        grdChanged = true;
      }
    }

    if (attChanged) setStored(STORAGE_KEYS.ATTENDANCE, attendance);
    if (grdChanged) setStored(STORAGE_KEYS.GRADES, grades);
  },

  // Full Backup & Restore
  exportAllDataJSON: () => {
    return JSON.stringify(
      {
        school: StorageService.getSchool(),
        teachers: StorageService.getTeachers(),
        classes: StorageService.getClasses(),
        students: StorageService.getStudents(),
        attendance: StorageService.getAttendance(),
        grades: StorageService.getGrades(),
        modules: StorageService.getModules(),
        journals: StorageService.getJournals(),
        calendar: StorageService.getCalendar(),
        schedules: StorageService.getSchedules(),
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  },

  restoreAllDataJSON: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.school) StorageService.saveSchool(data.school);
      if (data.teachers) StorageService.saveTeachers(data.teachers);
      if (data.classes) StorageService.saveClasses(data.classes);
      if (data.students) StorageService.saveStudents(data.students);
      if (data.attendance) StorageService.saveAttendance(data.attendance);
      if (data.grades) StorageService.saveGrades(data.grades);
      if (data.modules) StorageService.saveModules(data.modules);
      if (data.journals) StorageService.saveJournals(data.journals);
      if (data.calendar) StorageService.saveCalendar(data.calendar);
      if (data.schedules) StorageService.saveSchedules(data.schedules);
      return true;
    } catch (err) {
      console.error("Failed to restore JSON:", err);
      return false;
    }
  },

  resetToDefaults: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("guru_ai_storage_update"));
    }
  },
};
