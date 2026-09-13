import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Layers,
  Printer,
  Bookmark,
  Plus,
  Search,
  Star,
  Copy,
  Trash2,
  Edit3,
  FileText,
  Calendar,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  FileUp,
} from "lucide-react";
import { CompleteModulePlan, ModuleStylingConfig } from "../types/modulePlan";
import { ModuleStorageService } from "../services/moduleStorage";
import { QuickGenerateModal } from "../components/modul/QuickGenerateModal";
import { ModuleWizardModal } from "../components/modul/ModuleWizardModal";
import { ModuleQCModal } from "../components/modul/ModuleQCModal";
import { ModuleAIAssistantDrawer } from "../components/modul/ModuleAIAssistantDrawer";
import { TemplateManagerModal } from "../components/modul/TemplateManagerModal";
import { ModuleEditor } from "../components/modul/ModuleEditor";
import { ModulePrintPreview } from "../components/modul/ModulePrintPreview";

export const ModulAIPage = () => {
  // Master State
  const [modules, setModules] = useState<CompleteModulePlan[]>([]);
  const [activeModule, setActiveModule] = useState<CompleteModulePlan | null>(null);
  const [viewMode, setViewMode] = useState<"workspace" | "preview" | "library">("workspace");

  // Modals & Drawers
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showQCModal, setShowQCModal] = useState(false);
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Search in Library
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");

  // Load modules on mount
  useEffect(() => {
    const list = ModuleStorageService.getAllModules();
    setModules(list);
    if (list.length > 0 && !activeModule) {
      setActiveModule(list[0]);
    }
  }, []);

  const handleSelectModule = (mod: CompleteModulePlan) => {
    setActiveModule(mod);
    setViewMode("workspace");
  };

  const handleUpdatePlan = (updated: CompleteModulePlan) => {
    setActiveModule(updated);
    ModuleStorageService.saveModule(updated);
    setModules(ModuleStorageService.getAllModules());
  };

  const handleNewGenerated = (plan: CompleteModulePlan) => {
    ModuleStorageService.saveModule(plan);
    const refreshed = ModuleStorageService.getAllModules();
    setModules(refreshed);
    setActiveModule(plan);
    setViewMode("workspace");
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = ModuleStorageService.duplicateModule(id);
    if (copy) {
      const refreshed = ModuleStorageService.getAllModules();
      setModules(refreshed);
      setActiveModule(copy);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus modul ajar ini?")) {
      ModuleStorageService.deleteModule(id);
      const refreshed = ModuleStorageService.getAllModules();
      setModules(refreshed);
      if (activeModule?.id === id) {
        setActiveModule(refreshed.length > 0 ? refreshed[0] : null);
      }
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    ModuleStorageService.toggleFavorite(id);
    setModules(ModuleStorageService.getAllModules());
  };

  const handleApplyTemplate = (styling: ModuleStylingConfig) => {
    if (activeModule) {
      const updated: CompleteModulePlan = {
        ...activeModule,
        styling,
      };
      handleUpdatePlan(updated);
    }
  };

  const filteredModules = modules.filter((m) => {
    const matchQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.identity.materiPokok.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.identity.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKelas = filterKelas === "Semua" || m.identity.kelas === filterKelas;
    return matchQuery && matchKelas;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Mode Switcher */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold tracking-wide uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Kurikulum Merdeka & Deep Learning</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Modul Ajar AI – Asisten Guru Digital
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Sistem otomatis perancang 23 komponen terintegrasi (CP, ATP, TP, Modul, LKPD, Soal HOTS, Rubrik) yang siap cetak dan ekspor Word/PDF.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Mode Cepat */}
          <button
            onClick={() => setShowQuickModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-98"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>⚡ Mode Cepat</span>
          </button>

          {/* Wizard Lengkap */}
          <button
            onClick={() => setShowWizardModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Wizard Lengkap</span>
          </button>

          {/* Template Saya */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-2xs"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Template</span>
          </button>

          {/* Library Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "library" ? "workspace" : "library")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              viewMode === "library"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Modul Saya ({modules.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE: LIBRARY / DAFTAR MODUL SAYA */}
      {viewMode === "library" && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Arsip & Koleksi Modul Ajar</h2>
              <p className="text-xs text-slate-500">Kelola modul tersimpan, duplikasi, edit, atau cetak sewaktu-waktu</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari materi, mapel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                />
              </div>

              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-medium"
              >
                <option value="Semua">Semua Kelas</option>
                <option value="Kelas 1">Kelas 1</option>
                <option value="Kelas 2">Kelas 2</option>
                <option value="Kelas 3">Kelas 3</option>
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
              </select>
            </div>
          </div>

          {filteredModules.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Belum ada modul yang cocok</p>
              <p className="text-xs text-slate-400 mt-1">Buat modul baru menggunakan tombol di atas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((mod, idx) => (
                <div
                  key={`${mod.id || "mod"}-${idx}`}
                  onClick={() => handleSelectModule(mod)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white hover:shadow-md flex flex-col justify-between ${
                    activeModule?.id === mod.id
                      ? "border-blue-500 ring-2 ring-blue-100 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                        {mod.identity.kelas} • {mod.identity.mataPelajaran}
                      </span>
                      <button
                        onClick={(e) => handleToggleFavorite(mod.id, e)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-amber-500"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            mod.isFavorite ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {mod.identity.materiPokok}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {mod.modulCore.pemahamanBermakna}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      Update: {mod.updatedAt}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDuplicate(mod.id, e)}
                        title="Duplikasi Modul"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(mod.id, e)}
                        title="Hapus Modul"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-blue-600 font-bold flex items-center gap-0.5 pl-1">
                        Buka <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE: WORKSPACE (EDITOR) */}
      {viewMode === "workspace" && activeModule && (
        <ModuleEditor
          plan={activeModule}
          onUpdate={handleUpdatePlan}
          onOpenPreview={() => setViewMode("preview")}
          onOpenQC={() => setShowQCModal(true)}
          onOpenAI={() => setShowAIDrawer(true)}
        />
      )}

      {/* VIEW MODE: PRINT PREVIEW */}
      {viewMode === "preview" && activeModule && (
        <ModulePrintPreview
          plan={activeModule}
          onEdit={() => setViewMode("workspace")}
          onUpdatePlan={handleUpdatePlan}
        />
      )}

      {/* MODALS */}
      <QuickGenerateModal
        isOpen={showQuickModal}
        onClose={() => setShowQuickModal(false)}
        onGenerated={handleNewGenerated}
      />

      <ModuleWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        onGenerated={handleNewGenerated}
      />

      {activeModule && (
        <>
          <ModuleQCModal
            isOpen={showQCModal}
            onClose={() => setShowQCModal(false)}
            plan={activeModule}
            onUpdatePlan={handleUpdatePlan}
          />

          <ModuleAIAssistantDrawer
            isOpen={showAIDrawer}
            onClose={() => setShowAIDrawer(false)}
            plan={activeModule}
            onUpdatePlan={handleUpdatePlan}
          />
        </>
      )}

      <TemplateManagerModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
};
