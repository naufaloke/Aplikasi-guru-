import { useState } from "react";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { AIChatDrawer } from "./components/common/AIChatDrawer";

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { ImportExcelPage } from "./pages/ImportExcelPage";
import { AbsensiDigitalPage } from "./pages/AbsensiDigitalPage";
import { ModulAIPage } from "./pages/ModulAIPage";
import { PenilaianPage } from "./pages/PenilaianPage";
import { AnalisisNilaiPage } from "./pages/AnalisisNilaiPage";
import { BankSoalAIPage } from "./pages/BankSoalAIPage";
import { LKPDAIPage } from "./pages/LKPDAIPage";
import { MediaAIPage } from "./pages/MediaAIPage";
import { JurnalMengajarPage } from "./pages/JurnalMengajarPage";
import { RaporDigitalPage } from "./pages/RaporDigitalPage";
import { PortalOrangTuaPage } from "./pages/PortalOrangTuaPage";
import {
  DataSekolahPage,
  DataGuruPage,
  DataKelasPage,
  DataSiswaPage,
} from "./pages/DataMasterPages";
import {
  KurikulumPage,
  CPPage,
  ATPPage,
  RPPOtomatisPage,
} from "./pages/CurriculumPages";
import {
  KalenderAkademikPage,
  JadwalPelajaranPage,
} from "./pages/KalenderJadwalPages";
import { ScanLJKPage } from "./pages/ScanLJKPage";
import {
  ManajemenDokumenPage,
  PengaturanPage,
} from "./pages/PengaturanDokumenPages";

import { UserRole } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("Wali Kelas");

  const renderCurrentPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onNavigate={setActiveTab} onOpenAIChat={() => setAiChatOpen(true)} />;
      case "import-excel":
        return <ImportExcelPage onNavigate={setActiveTab} />;
      case "absensi":
        return <AbsensiDigitalPage />;
      case "modul-ai":
        return <ModulAIPage />;
      case "nilai":
        return <PenilaianPage />;
      case "analisis-nilai":
        return <AnalisisNilaiPage />;
      case "soal-ai":
        return <BankSoalAIPage />;
      case "lkpd":
        return <LKPDAIPage />;
      case "media-ai":
        return <MediaAIPage />;
      case "jurnal":
        return <JurnalMengajarPage />;
      case "rapor":
        return <RaporDigitalPage />;
      case "portal-ortu":
        return <PortalOrangTuaPage />;
      case "scan-ljk":
        return <ScanLJKPage />;
      case "data-sekolah":
        return <DataSekolahPage />;
      case "data-guru":
        return <DataGuruPage />;
      case "data-kelas":
        return <DataKelasPage />;
      case "data-siswa":
        return <DataSiswaPage onNavigate={setActiveTab} />;
      case "kurikulum":
        return <KurikulumPage />;
      case "cp":
        return <CPPage />;
      case "atp":
        return <ATPPage />;
      case "rpp":
        return <RPPOtomatisPage />;
      case "kalender":
        return <KalenderAkademikPage />;
      case "jadwal":
        return <JadwalPelajaranPage />;
      case "dokumen":
        return <ManajemenDokumenPage onNavigate={setActiveTab} />;
      case "pengaturan":
        return <PengaturanPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} onOpenAIChat={() => setAiChatOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAIChat={() => setAiChatOpen(true)}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          currentRole={currentRole}
          onOpenAIChat={() => setAiChatOpen(true)}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Floating AI Assistant Drawer */}
      <AIChatDrawer
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />
    </div>
  );
}
