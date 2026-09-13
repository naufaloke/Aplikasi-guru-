export type UserRole = "Kepala Sekolah" | "Guru" | "Wali Kelas" | "Admin" | "Orang Tua";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nip?: string;
  avatarUrl?: string;
  classAssigned?: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  logo: string;
  address: string;
  principal: string;
  nipPrincipal: string;
  academicYear: string;
  semester: "Ganjil" | "Genap" | string;
  district: string;
  city: string;
  province: string;
  nss?: string;
  accreditation?: string;
  headmaster?: string;
  headmasterNip?: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  ukg: string;
  subject: string;
  classes: string[];
  phone: string;
  email: string;
  photoUrl: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: number; // 1 - 6
  homeroomTeacher: string; // Teacher name or id
  room: string;
  capacity?: number;
  studentCount?: number;
}

export type Classroom = SchoolClass;

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: "L" | "P";
  pob: string; // Tempat Lahir
  dob: string; // Tanggal Lahir (YYYY-MM-DD)
  religion: "Islam" | "Kristen" | "Katolik" | "Hindu" | "Buddha" | "Konghucu";
  address: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  classId: string;
  photoUrl?: string;
}

export type AttendanceStatus = "Hadir" | "Alpa" | "Sakit" | "Izin";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  timestamp: string;
  notes?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  semester?: string;
  tugas: number; // Tugas / PR
  ph: number; // Penilaian Harian
  pts: number; // Penilaian Tengah Semester
  pas: number; // Penilaian Akhir Semester / Sumatif Akhir
  finalScore?: number;
  predicate?: string;
  description?: string;
}

export interface LessonPlanModule {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  topic: string;
  allocationTime: string;
  content: string; // Full markdown / formatted text
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface JournalRecord {
  id: string;
  date: string;
  day: string;
  classId: string;
  subject: string;
  period: string; // Jam ke-
  material: string;
  attendanceSummary: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  reflection: string;
  aiSummary?: string;
  teacherName: string;
}

export type TeachingJournal = {
  id: string;
  date: string;
  timeSlot?: string;
  classId: string;
  subject: string;
  topic: string;
  activities: string;
  challenges?: string;
  solutions?: string;
  reflections: string;
  [key: string]: any;
};

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: "MPLS" | "PTS" | "PAS" | "Libur" | "Agenda" | "Upacara";
  description?: string;
  color?: string;
}

export interface ScheduleItem {
  id: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu";
  timeSlot: string; // e.g. "07:30 - 08:45"
  subject: string;
  classId: string;
  teacherName: string;
  room?: string;
}

export interface ImportPreviewRow {
  rowNumber: number;
  nisn: string;
  nis: string;
  name: string;
  gender: "L" | "P" | string;
  pob: string;
  dob: string;
  religion: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  classId: string;
  status: "Valid" | "Duplikat" | "Error";
  errorMessages: string[];
  duplicateReason?: string;
}

export interface ImportLog {
  id: string;
  timestamp: string;
  fileName: string;
  total: number;
  success: number;
  errors: number;
  duplicates: number;
}
