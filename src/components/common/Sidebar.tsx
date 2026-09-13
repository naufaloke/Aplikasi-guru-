import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  UserCheck,
  FileSpreadsheet,
  BookOpen,
  Target,
  GitCommit,
  Sparkles,
  FileText,
  CalendarCheck2,
  Award,
  HelpCircle,
  FolderOpen,
  Image as ImageIcon,
  BookMarked,
  FileBadge,
  Calendar,
  Clock,
  HeartHandshake,
  ScanLine,
  Settings,
  X,
  Bot,
} from "lucide-react";
import { UserRole } from "../../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: UserRole;
  onOpenAIChat: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  allowedRoles?: UserRole[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentRole,
  onOpenAIChat,
}: SidebarProps) => {
  const sections: MenuSection[] = [
    {
      title: "UTAMA",
      items: [
        { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
        {
          id: "import-excel",
          label: "Import Data Siswa",
          icon: FileSpreadsheet,
          badge: "FITUR UTAMA",
          badgeColor: "bg-emerald-500 text-white",
        },
      ],
    },
    {
      title: "DATA SEKOLAH",
      items: [
        { id: "data-sekolah", label: "Profil Sekolah", icon: School },
        { id: "data-guru", label: "Data Guru", icon: Users },
        { id: "data-kelas", label: "Data Kelas", icon: GraduationCap },
        { id: "data-siswa", label: "Data Siswa", icon: UserCheck },
      ],
    },
    {
      title: "PERENCANAAN & AI",
      items: [
        { id: "kurikulum", label: "Kurikulum & KSP", icon: BookOpen },
        { id: "cp", label: "CP (Capaian Pembelajaran)", icon: Target },
        { id: "atp", label: "ATP (Alur Tujuan)", icon: GitCommit },
        {
          id: "modul-ai",
          label: "Modul Ajar AI",
          icon: Sparkles,
          badge: "UNGGULAN",
          badgeColor: "bg-blue-600 text-white",
        },
        { id: "rpp", label: "RPP Otomatis", icon: FileText },
        { id: "soal-ai", label: "Bank Soal AI (HOTS)", icon: HelpCircle },
        { id: "lkpd", label: "LKPD AI Interaktif", icon: FolderOpen },
        { id: "media-ai", label: "Pembuat Media AI", icon: ImageIcon },
      ],
    },
    {
      title: "KEGIATAN & PENILAIAN",
      items: [
        {
          id: "absensi",
          label: "Absensi Digital",
          icon: CalendarCheck2,
          badge: "WAJIB",
          badgeColor: "bg-emerald-600 text-white",
        },
        { id: "nilai", label: "Input Nilai Siswa", icon: Award },
        { id: "analisis-nilai", label: "Analisis Nilai & Remedial", icon: Sparkles },
        { id: "jurnal", label: "Jurnal Mengajar & Suara", icon: BookMarked },
        { id: "rapor", label: "Rapor Digital", icon: FileBadge },
        { id: "scan-ljk", label: "Scan Lembar Jawaban AI", icon: ScanLine },
      ],
    },
    {
      title: "JADWAL & PORTAL",
      items: [
        { id: "kalender", label: "Kalender Akademik", icon: Calendar },
        { id: "jadwal", label: "Jadwal Pelajaran", icon: Clock },
        { id: "portal-ortu", label: "Portal Orang Tua & WA", icon: HeartHandshake },
        { id: "dokumen", label: "Manajemen Dokumen", icon: FolderOpen },
        { id: "pengaturan", label: "Pengaturan & Sinkronisasi", icon: Settings },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-72 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header inside sidebar */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm leading-tight tracking-tight">
                GURU AI INDONESIA
              </h2>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                Enterprise Edition
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-white" : "text-slate-500"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor || "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom AI Assistant Card */}
        <div className="p-3 border-t border-slate-100">
          <div
            onClick={onOpenAIChat}
            className="cursor-pointer group p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-200/50 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold text-slate-800">Asisten Digital Guru</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Ketik topik apa saja, AI membuat Modul, Soal, Rubrik, dan RPP seketika.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
