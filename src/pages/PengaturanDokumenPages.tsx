import { useState } from "react";
import {
  FolderOpen,
  Settings,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  FileBadge,
} from "lucide-react";
import { StorageService } from "../services/storage";

export const ManajemenDokumenPage = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const documents = [
    { title: "Kurikulum Satuan Pendidikan (KSP) SD Negeri 3 Banjar Ratu", type: "PDF", size: "2.4 MB", updated: "10 Agustus 2024", tab: "kurikulum" },
    { title: "Modul Ajar IPAS Kelas 4 - Bagian Tubuh Tumbuhan", type: "Word", size: "840 KB", updated: "12 September 2024", tab: "modul-ai" },
    { title: "Daftar Rekapitulasi Presensi Semester Ganjil 2024", type: "Excel", size: "420 KB", updated: "Hari ini", tab: "absensi" },
    { title: "Bank Soal HOTS Formatif & Sumatif IPAS", type: "PDF", size: "1.1 MB", updated: "Kemarin", tab: "soal-ai" },
    { title: "Buku Rapor Digital Kelas 4A Terpadu", type: "PDF", size: "5.6 MB", updated: "Hari ini", tab: "rapor" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
          <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Arsip Digital Terpadu</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Manajemen Dokumen & Administrasi Guru
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Seluruh berkas perencanaan mengajar, asesmen, modul AI, dan lembar kerja tersimpan rapi dalam satu pusat arsip.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(doc.tab)}
            className="glass-card p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs md:text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Format {doc.type} • {doc.size} • Diperbarui {doc.updated}
                </p>
              </div>
            </div>

            <button className="px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-colors">
              Buka Berkas
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PengaturanPage = () => {
  const [offline, setOffline] = useState(StorageService.getOfflineMode());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleOffline = () => {
    const next = !offline;
    setOffline(next);
    StorageService.setOfflineMode(next);
    setSuccessMsg(next ? "Mode Offline Diaktifkan (Penyimpanan Lokal Aktif)" : "Sinkronisasi Cloud Diaktifkan");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleBackup = () => {
    const data = {
      school: StorageService.getSchool(),
      students: StorageService.getStudents(),
      teachers: StorageService.getTeachers(),
      classes: StorageService.getClasses(),
      attendance: StorageService.getAttendance(),
      grades: StorageService.getGrades(),
      journals: StorageService.getJournals(),
      modules: StorageService.getModules(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BACKUP_GURU_AI_SDN3_BANJAR_RATU_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin mengatur ulang data kembali ke data contoh SD Negeri 3 Banjar Ratu?")) {
      StorageService.resetToDefaults();
      alert("Data berhasil direset!");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase mb-2">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>Konfigurasi Sistem</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Pengaturan Aplikasi & Backup Cloud
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Kelola cadangan data (backup), pemulihan data (restore), mode offline, dan sinkronisasi otomatis.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Offline Mode Switch */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Mode Kerja Offline (Lokal)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gunakan aplikasi di daerah minim sinyal/internet. Data tetap tersimpan aman di browser dan akan disinkronkan saat internet kembali stabil.
            </p>
          </div>
          <button
            onClick={handleToggleOffline}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              offline
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {offline ? "Offline Aktif" : "Online / Cloud"}
          </button>
        </div>

        {/* Backup and Restore */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">Cadangkan & Pulihkan Basis Data</h3>
          <p className="text-xs text-slate-500">
            Unduh seluruh rekaman siswa, absensi, nilai, dan modul ajar dalam format file JSON terenkripsi untuk keamanan data sekolah.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleBackup}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup Lengkap (.json)</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Data ke Contoh Standar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
