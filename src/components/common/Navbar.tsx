import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Sparkles,
  Wifi,
  WifiOff,
  UserCheck,
  School,
  ChevronDown,
  Menu,
  BookOpen,
} from "lucide-react";
import { UserRole, UserProfile, SchoolProfile } from "../../types";
import { StorageService } from "../../services/storage";

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenAIChat: () => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar = ({
  onToggleSidebar,
  onOpenAIChat,
  currentRole,
  onChangeRole,
  onNavigate,
}: NavbarProps) => {
  const [school, setSchool] = useState<SchoolProfile>(StorageService.getSchool());
  const [user, setUser] = useState<UserProfile>(StorageService.getUser());
  const [isOffline, setIsOffline] = useState(StorageService.getOfflineMode());
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSchool(StorageService.getSchool());
      setUser(StorageService.getUser());
      setIsOffline(StorageService.getOfflineMode());
    };
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const roles: UserRole[] = ["Wali Kelas", "Guru", "Kepala Sekolah", "Admin", "Orang Tua"];

  const toggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    StorageService.setOfflineMode(next);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Mobile Toggle & School Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate("data-sekolah")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <School className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 tracking-tight text-sm md:text-base group-hover:text-blue-600 transition-colors">
                  {school.name}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                  NPSN {school.npsn}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                T.P. {school.academicYear} • Semester {school.semester}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Search & AI Shortcut */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa, modul, nilai, jadwal..."
              onClick={() => onNavigate("data-siswa")}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right: Actions, AI Button, Role Switcher, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline/Online toggle badge */}
          <button
            onClick={toggleOffline}
            title={isOffline ? "Mode Offline Aktif (Tersimpan Lokal)" : "Online Terhubung ke Cloud"}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
              isOffline
                ? "bg-amber-50 text-amber-700 border-amber-300"
                : "bg-emerald-50 text-emerald-700 border-emerald-300"
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? "Offline Mode" : "Cloud Sync"}</span>
          </button>

          {/* AI Guru Floating Trigger */}
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Tanya Guru AI</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl p-4 shadow-xl border border-slate-200 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-semibold text-xs text-slate-800">Notifikasi Terkini</h4>
                  <span className="text-[11px] text-blue-600 font-medium">3 Baru</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                  <div className="py-2 text-xs">
                    <p className="font-medium text-slate-800">Absensi Hari Ini Siap Dikirim</p>
                    <p className="text-slate-500 text-[11px]">8 Siswa Kelas 4A telah terdata otomatis.</p>
                  </div>
                  <div className="py-2 text-xs">
                    <p className="font-medium text-slate-800">Modul Ajar IPAS Selesai Digenerate</p>
                    <p className="text-slate-500 text-[11px]">Topik Bagian Tubuh Tumbuhan siap dicetak ke PDF.</p>
                  </div>
                  <div className="py-2 text-xs">
                    <p className="font-medium text-slate-800">Peringatan Nilai PTS</p>
                    <p className="text-slate-500 text-[11px]">1 siswa membutuhkan remedial materi fotosintesis.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Role Switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[11px] text-blue-600 font-medium leading-tight">{currentRole}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-xl border border-slate-200 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    Ganti Peran Aktif
                  </p>
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all ${
                      currentRole === r
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
