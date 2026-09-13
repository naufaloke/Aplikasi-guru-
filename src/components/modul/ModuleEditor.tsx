import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Printer,
  FileDown,
  Wand2,
  ShieldCheck,
  Building,
  Target,
  Clock,
  Layers,
  ListOrdered,
  HelpCircle,
  BookOpen,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { CompleteModulePlan } from "../../types/modulePlan";
import { DocxExportService } from "../../services/docxExport";
import { AIModuleGenerator } from "../../services/aiModuleGenerator";

interface ModuleEditorProps {
  plan: CompleteModulePlan;
  onUpdate: (updated: CompleteModulePlan) => void;
  onOpenPreview: () => void;
  onOpenQC: () => void;
  onOpenAI: () => void;
}

export const ModuleEditor: React.FC<ModuleEditorProps> = ({
  plan,
  onUpdate,
  onOpenPreview,
  onOpenQC,
  onOpenAI,
}) => {
  const [activeTab, setActiveTab] = useState<string>("identitas");
  const [currentPlan, setCurrentPlan] = useState<CompleteModulePlan>(plan);
  const [saveStatus, setSaveStatus] = useState<"tersimpan" | "menyimpan">("tersimpan");
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setCurrentPlan(plan);
  }, [plan]);

  // Handle local changes and propagate to parent with debounce
  const updateLocal = (updater: (prev: CompleteModulePlan) => CompleteModulePlan) => {
    setSaveStatus("menyimpan");
    const updated = updater(currentPlan);
    setCurrentPlan(updated);

    const timer = setTimeout(() => {
      onUpdate(updated);
      setSaveStatus("tersimpan");
    }, 400);

    return () => clearTimeout(timer);
  };

  const handleExportDocx = async () => {
    setDownloadingDocx(true);
    try {
      await DocxExportService.exportModuleToDocx(currentPlan);
    } catch (err) {
      console.error("Docx export error:", err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleTidyUp = () => {
    const tidied = AIModuleGenerator.tidyUpDocument(currentPlan);
    updateLocal(() => tidied);
  };

  const passedQCCount = currentPlan.qcResult?.checks?.filter((c) => c.status === "pass").length || 0;

  const tabs = [
    { id: "identitas", label: "Identitas", icon: Building },
    { id: "cp-atp-tp", label: "CP, ATP & TP", icon: Target },
    { id: "modul-core", label: "Komponen Inti", icon: Layers },
    { id: "kegiatan", label: "Kegiatan Belajar", icon: Clock },
    { id: "deep-learning", label: "Deep Learning & Diferensiasi", icon: Sparkles },
    { id: "bahan-ajar", label: "Bahan Ajar", icon: BookOpen },
    { id: "lkpd", label: "LKPD Interaktif", icon: FileText },
    { id: "soal-asesmen", label: "Bank Soal & Asesmen", icon: HelpCircle },
    { id: "rubrik", label: "Rubrik Penilaian", icon: ListOrdered },
    { id: "refleksi-remedial", label: "Refleksi & Remedial", icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-[85vh]">
      {/* Top Workspace Command Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={currentPlan.title}
              onChange={(e) => updateLocal((p) => ({ ...p, title: e.target.value }))}
              className="text-sm font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent max-w-sm sm:max-w-md"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-500">
                {currentPlan.identity.kelas} • {currentPlan.identity.mataPelajaran}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <Check className="w-3 h-3" />
                {saveStatus === "tersimpan" ? "Tersimpan Otomatis" : "Menyimpan..."}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* QC Button */}
          <button
            onClick={onOpenQC}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            QC: {passedQCCount}/10 Lolos
          </button>

          {/* AI Assistant */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xs transition-all"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            Asisten AI
          </button>

          {/* Rapikan Dokumen */}
          <button
            onClick={handleTidyUp}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all"
            title="Rapikan spasi, font, dan margin"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Rapikan
          </button>

          {/* Word Export */}
          <button
            onClick={handleExportDocx}
            disabled={downloadingDocx}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            {downloadingDocx ? "Membuat..." : "Word"}
          </button>

          {/* Print Preview */}
          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            Pratinjau Cetak
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-4 overflow-x-auto flex gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-blue-50/40"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* ================= TAB 1: IDENTITAS ================= */}
        {activeTab === "identitas" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <Building className="w-4 h-4 text-blue-600" />
              Identitas Sekolah & Modul Ajar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  value={currentPlan.identity.namaSekolah}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, namaSekolah: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">NPSN</label>
                <input
                  type="text"
                  value={currentPlan.identity.npsn}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, npsn: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Guru Penyusun</label>
                <input
                  type="text"
                  value={currentPlan.identity.namaGuru}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, namaGuru: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">NIP Guru</label>
                <input
                  type="text"
                  value={currentPlan.identity.nip}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, nip: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={currentPlan.identity.mataPelajaran}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, mataPelajaran: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Materi Pokok</label>
                <input
                  type="text"
                  value={currentPlan.identity.materiPokok}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, materiPokok: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Submateri</label>
                <input
                  type="text"
                  value={currentPlan.identity.submateri}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, submateri: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alokasi Waktu</label>
                <input
                  type="text"
                  value={currentPlan.identity.alokasiWaktu}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      identity: { ...p.identity, alokasiWaktu: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-3">Pejabat Penandatangan Pengesahan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={currentPlan.identity.namaKepsek}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        identity: { ...p.identity, namaKepsek: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={currentPlan.identity.nipKepsek}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        identity: { ...p.identity, nipKepsek: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CP, ATP & TP ================= */}
        {activeTab === "cp-atp-tp" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">1. Capaian Pembelajaran (CP)</h3>
              <textarea
                rows={3}
                value={currentPlan.cp.rumusanCP}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    cp: { ...p.cp, rumusanCP: e.target.value },
                  }))
                }
                className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
              />
            </div>

            {/* Analisis CP Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Analisis CP (Tabel Pemetaan)</h4>
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b">
                    <tr>
                      <th className="p-2 text-left">Elemen</th>
                      <th className="p-2 text-left">Kompetensi</th>
                      <th className="p-2 text-left">Materi</th>
                      <th className="p-2 text-left">Indikator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlan.cp.analisisTable.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 font-medium">{item.elemen}</td>
                        <td className="p-2">{item.kompetensi}</td>
                        <td className="p-2">{item.materi}</td>
                        <td className="p-2 text-slate-600">{item.indikator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tujuan Pembelajaran (TP) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">2. Tujuan Pembelajaran (TP)</h3>
                <button
                  onClick={() => {
                    const newTP = {
                      id: `tp-${Date.now()}`,
                      kode: `TP.${currentPlan.tp.length + 1}`,
                      deskripsi: "Peserta didik mampu menguraikan konsep dengan mandiri.",
                      kko: "Menganalisis",
                      levelKognitif: "C4",
                    };
                    updateLocal((p) => ({ ...p, tp: [...p.tp, newTP] }));
                  }}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah TP
                </button>
              </div>

              <div className="space-y-3">
                {currentPlan.tp.map((t, idx) => (
                  <div key={t.id} className="p-3 border rounded-xl bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={t.kode}
                        onChange={(e) => {
                          const updatedTP = [...currentPlan.tp];
                          updatedTP[idx].kode = e.target.value;
                          updateLocal((p) => ({ ...p, tp: updatedTP }));
                        }}
                        className="font-bold text-blue-700 bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-20"
                      />
                      <button
                        onClick={() => {
                          const updatedTP = currentPlan.tp.filter((_, i) => i !== idx);
                          updateLocal((p) => ({ ...p, tp: updatedTP }));
                        }}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={t.deskripsi}
                      onChange={(e) => {
                        const updatedTP = [...currentPlan.tp];
                        updatedTP[idx].deskripsi = e.target.value;
                        updateLocal((p) => ({ ...p, tp: updatedTP }));
                      }}
                      className="w-full p-2 border rounded-lg bg-white outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="KKO"
                        value={t.kko}
                        onChange={(e) => {
                          const updatedTP = [...currentPlan.tp];
                          updatedTP[idx].kko = e.target.value;
                          updateLocal((p) => ({ ...p, tp: updatedTP }));
                        }}
                        className="p-1.5 border rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Level (C1-C6)"
                        value={t.levelKognitif}
                        onChange={(e) => {
                          const updatedTP = [...currentPlan.tp];
                          updatedTP[idx].levelKognitif = e.target.value;
                          updateLocal((p) => ({ ...p, tp: updatedTP }));
                        }}
                        className="p-1.5 border rounded bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MODUL CORE ================= */}
        {activeTab === "modul-core" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">A. Kompetensi Awal</label>
              <textarea
                rows={2}
                value={currentPlan.modulCore.kompetensiAwal}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    modulCore: { ...p.modulCore, kompetensiAwal: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">B. Pemahaman Bermakna</label>
              <textarea
                rows={2}
                value={currentPlan.modulCore.pemahamanBermakna}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    modulCore: { ...p.modulCore, pemahamanBermakna: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">C. Pertanyaan Pemantik</label>
              <div className="space-y-2">
                {currentPlan.modulCore.pertanyaanPemantik.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => {
                        const updatedQ = [...currentPlan.modulCore.pertanyaanPemantik];
                        updatedQ[idx] = e.target.value;
                        updateLocal((p) => ({
                          ...p,
                          modulCore: { ...p.modulCore, pertanyaanPemantik: updatedQ },
                        }));
                      }}
                      className="flex-1 p-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">D. Sarana & Prasarana</label>
                <textarea
                  rows={3}
                  value={currentPlan.modulCore.saranaPrasarana}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      modulCore: { ...p.modulCore, saranaPrasarana: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">E. Target Peserta Didik</label>
                <textarea
                  rows={3}
                  value={currentPlan.modulCore.targetPesertaDidik}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      modulCore: { ...p.modulCore, targetPesertaDidik: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: KEGIATAN BELAJAR ================= */}
        {activeTab === "kegiatan" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6 text-xs">
            {/* Pendahuluan */}
            <div className="p-4 border rounded-xl bg-slate-50/60 space-y-3">
              <div className="flex justify-between items-center font-bold text-sm text-slate-900">
                <span>1. Kegiatan Pendahuluan</span>
                <input
                  type="text"
                  value={currentPlan.kegiatan.pendahuluan.alokasiWaktu}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      kegiatan: {
                        ...p.kegiatan,
                        pendahuluan: { ...p.kegiatan.pendahuluan, alokasiWaktu: e.target.value },
                      },
                    }))
                  }
                  className="text-right text-xs text-blue-700 bg-transparent border-b outline-none w-24"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Salam & Doa</label>
                <input
                  type="text"
                  value={currentPlan.kegiatan.pendahuluan.salamDoa}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      kegiatan: {
                        ...p.kegiatan,
                        pendahuluan: { ...p.kegiatan.pendahuluan, salamDoa: e.target.value },
                      },
                    }))
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Apersepsi & Presensi</label>
                <input
                  type="text"
                  value={currentPlan.kegiatan.pendahuluan.presensiApersepsi}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      kegiatan: {
                        ...p.kegiatan,
                        pendahuluan: { ...p.kegiatan.pendahuluan, presensiApersepsi: e.target.value },
                      },
                    }))
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Inti */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                2. Kegiatan Inti (Sintaks {currentPlan.karakter.model})
              </h3>
              <div className="space-y-4">
                {currentPlan.kegiatan.inti.map((fase, fIdx) => (
                  <div key={fIdx} className="p-4 border rounded-xl bg-white space-y-2 border-l-4 border-l-blue-600">
                    <div className="flex justify-between font-bold text-blue-900">
                      <input
                        type="text"
                        value={fase.fase}
                        onChange={(e) => {
                          const updatedInti = [...currentPlan.kegiatan.inti];
                          updatedInti[fIdx].fase = e.target.value;
                          updateLocal((p) => ({
                            ...p,
                            kegiatan: { ...p.kegiatan, inti: updatedInti },
                          }));
                        }}
                        className="flex-1 font-bold outline-none"
                      />
                      <input
                        type="text"
                        value={fase.alokasiWaktu}
                        onChange={(e) => {
                          const updatedInti = [...currentPlan.kegiatan.inti];
                          updatedInti[fIdx].alokasiWaktu = e.target.value;
                          updateLocal((p) => ({
                            ...p,
                            kegiatan: { ...p.kegiatan, inti: updatedInti },
                          }));
                        }}
                        className="text-right text-slate-500 w-24 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 pl-2">
                      {fase.aktivitas.map((act, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <span className="text-slate-400">•</span>
                          <input
                            type="text"
                            value={act}
                            onChange={(e) => {
                              const updatedInti = [...currentPlan.kegiatan.inti];
                              updatedInti[fIdx].aktivitas[aIdx] = e.target.value;
                              updateLocal((p) => ({
                                ...p,
                                kegiatan: { ...p.kegiatan, inti: updatedInti },
                              }));
                            }}
                            className="flex-1 p-1.5 border rounded bg-slate-50/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Penutup */}
            <div className="p-4 border rounded-xl bg-slate-50/60 space-y-3">
              <div className="flex justify-between items-center font-bold text-sm text-slate-900">
                <span>3. Kegiatan Penutup</span>
                <span className="text-blue-700">{currentPlan.kegiatan.penutup.alokasiWaktu}</span>
              </div>
              <div>
                <label className="font-semibold block mb-1">Rangkuman / Simpulan</label>
                <input
                  type="text"
                  value={currentPlan.kegiatan.penutup.kesimpulan}
                  onChange={(e) =>
                    updateLocal((p) => ({
                      ...p,
                      kegiatan: {
                        ...p.kegiatan,
                        penutup: { ...p.kegiatan.penutup, kesimpulan: e.target.value },
                      },
                    }))
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: DEEP LEARNING & DIFERENSIASI ================= */}
        {activeTab === "deep-learning" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-emerald-900 mb-3">
                Pembelajaran Mendalam (Deep Learning)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Berkesadaran (Mindful)</label>
                  <textarea
                    rows={2}
                    value={currentPlan.deepLearning.berkesadaran}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        deepLearning: { ...p.deepLearning, berkesadaran: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Bermakna (Meaningful)</label>
                  <textarea
                    rows={2}
                    value={currentPlan.deepLearning.bermakna}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        deepLearning: { ...p.deepLearning, bermakna: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Menggembirakan (Joyful)</label>
                  <textarea
                    rows={2}
                    value={currentPlan.deepLearning.menggembirakan}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        deepLearning: { ...p.deepLearning, menggembirakan: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-bold text-indigo-900 mb-3">
                Diferensiasi Pembelajaran
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Diferensiasi Konten</label>
                  <textarea
                    rows={3}
                    value={currentPlan.diferensiasi.konten}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        diferensiasi: { ...p.diferensiasi, konten: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Diferensiasi Proses</label>
                  <textarea
                    rows={3}
                    value={currentPlan.diferensiasi.proses}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        diferensiasi: { ...p.diferensiasi, proses: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Diferensiasi Produk</label>
                  <textarea
                    rows={3}
                    value={currentPlan.diferensiasi.produk}
                    onChange={(e) =>
                      updateLocal((p) => ({
                        ...p,
                        diferensiasi: { ...p.diferensiasi, produk: e.target.value },
                      }))
                    }
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: BAHAN AJAR ================= */}
        {activeTab === "bahan-ajar" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Judul Bahan Ajar</label>
              <input
                type="text"
                value={currentPlan.bahanAjar.judul}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    bahanAjar: { ...p.bahanAjar, judul: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Pengantar / Apersepsi Kontekstual</label>
              <textarea
                rows={2}
                value={currentPlan.bahanAjar.pengantar}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    bahanAjar: { ...p.bahanAjar, pengantar: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Uraian Materi Pokok</label>
              <textarea
                rows={6}
                value={currentPlan.bahanAjar.penjelasanMateri}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    bahanAjar: { ...p.bahanAjar, penjelasanMateri: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg font-mono leading-relaxed"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">Rangkuman Materi Siswa</label>
              <textarea
                rows={3}
                value={currentPlan.bahanAjar.rangkuman}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    bahanAjar: { ...p.bahanAjar, rangkuman: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 7: LKPD INTERAKTIF ================= */}
        {activeTab === "lkpd" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Judul LKPD</label>
              <input
                type="text"
                value={currentPlan.lkpd.judul}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    lkpd: { ...p.lkpd, judul: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Tujuan LKPD</label>
              <textarea
                rows={2}
                value={currentPlan.lkpd.tujuan}
                onChange={(e) =>
                  updateLocal((p) => ({
                    ...p,
                    lkpd: { ...p.lkpd, tujuan: e.target.value },
                  }))
                }
                className="w-full p-2.5 border rounded-lg"
              />
            </div>

            {/* Tabel Pengamatan LKPD */}
            {currentPlan.lkpd.tabelPengamatan && (
              <div>
                <label className="font-bold text-slate-800 block mb-2">Tabel Lembar Kerja Pengamatan</label>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-100">
                      <tr>
                        {currentPlan.lkpd.tabelPengamatan.headers.map((h, i) => (
                          <th key={i} className="p-2 text-left font-bold border-b">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentPlan.lkpd.tabelPengamatan.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 8: BANK SOAL & ASESMEN ================= */}
        {activeTab === "soal-asesmen" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Bank Soal Asesmen (HOTS & Stimulus)</h3>
              <button
                onClick={() => {
                  const newQ = {
                    id: `q-${Date.now()}`,
                    no: currentPlan.bankSoal.length + 1,
                    tipe: "PG" as const,
                    levelKognitif: "C4" as const,
                    pertanyaan: "Pertanyaan evaluasi baru....",
                    pilihanJawaban: ["A. Pilihan 1", "B. Pilihan 2", "C. Pilihan 3", "D. Pilihan 4"],
                    kunciJawaban: "A",
                    skorMaks: 2,
                  };
                  updateLocal((p) => ({ ...p, bankSoal: [...p.bankSoal, newQ] }));
                }}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Soal
              </button>
            </div>

            <div className="space-y-4">
              {currentPlan.bankSoal.map((q, qIdx) => (
                <div key={q.id} className="p-4 border rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-900">
                      Soal No. {q.no} ({q.tipe}) - Level {q.levelKognitif}
                    </span>
                    <button
                      onClick={() => {
                        const updatedQ = currentPlan.bankSoal.filter((_, i) => i !== qIdx);
                        updateLocal((p) => ({ ...p, bankSoal: updatedQ }));
                      }}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {q.stimulus && (
                    <input
                      type="text"
                      value={q.stimulus}
                      onChange={(e) => {
                        const updated = [...currentPlan.bankSoal];
                        updated[qIdx].stimulus = e.target.value;
                        updateLocal((p) => ({ ...p, bankSoal: updated }));
                      }}
                      placeholder="Stimulus kontekstual..."
                      className="w-full p-2 border rounded bg-white italic"
                    />
                  )}
                  <textarea
                    rows={2}
                    value={q.pertanyaan}
                    onChange={(e) => {
                      const updated = [...currentPlan.bankSoal];
                      updated[qIdx].pertanyaan = e.target.value;
                      updateLocal((p) => ({ ...p, bankSoal: updated }));
                    }}
                    className="w-full p-2 border rounded bg-white"
                  />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-700">Kunci:</span>
                    <input
                      type="text"
                      value={q.kunciJawaban}
                      onChange={(e) => {
                        const updated = [...currentPlan.bankSoal];
                        updated[qIdx].kunciJawaban = e.target.value;
                        updateLocal((p) => ({ ...p, bankSoal: updated }));
                      }}
                      className="p-1 border rounded bg-white font-bold text-emerald-700 w-32"
                    />
                    <span className="font-semibold text-slate-700">Skor:</span>
                    <input
                      type="number"
                      value={q.skorMaks}
                      onChange={(e) => {
                        const updated = [...currentPlan.bankSoal];
                        updated[qIdx].skorMaks = Number(e.target.value);
                        updateLocal((p) => ({ ...p, bankSoal: updated }));
                      }}
                      className="p-1 border rounded bg-white w-16"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: RUBRIK ================= */}
        {activeTab === "rubrik" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Rubrik Penilaian 4 Kategori</h3>
            <div className="space-y-3">
              {currentPlan.rubrik.map((r, rIdx) => (
                <div key={rIdx} className="p-3 border rounded-xl space-y-2 bg-slate-50/40">
                  <span className="font-bold text-slate-900 block">{r.aspek}</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 border rounded bg-emerald-50/50">
                      <strong className="block text-emerald-800 mb-0.5">Sangat Baik (4):</strong>
                      <p>{r.skor4}</p>
                    </div>
                    <div className="p-2 border rounded bg-blue-50/50">
                      <strong className="block text-blue-800 mb-0.5">Baik (3):</strong>
                      <p>{r.skor3}</p>
                    </div>
                    <div className="p-2 border rounded bg-amber-50/50">
                      <strong className="block text-amber-800 mb-0.5">Cukup (2):</strong>
                      <p>{r.skor2}</p>
                    </div>
                    <div className="p-2 border rounded bg-rose-50/50">
                      <strong className="block text-rose-800 mb-0.5">Perlu Bimbingan (1):</strong>
                      <p>{r.skor1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 10: REFLEKSI & REMEDIAL ================= */}
        {activeTab === "refleksi-remedial" && (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5 text-xs">
            <div className="p-4 border rounded-xl bg-slate-50/50 space-y-2">
              <h4 className="font-bold text-slate-900">Refleksi Guru</h4>
              <p><strong>Keberhasilan:</strong> {currentPlan.refleksi.guru.keberhasilan}</p>
              <p><strong>Kendala Teramati:</strong> {currentPlan.refleksi.guru.kendala}</p>
              <p><strong>Rencana Perbaikan:</strong> {currentPlan.refleksi.guru.perbaikan}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-rose-200 bg-rose-50/40 rounded-xl space-y-2">
                <h4 className="font-bold text-rose-900">Program Remedial</h4>
                <p><strong>Sasaran:</strong> {currentPlan.remedialPengayaan.remedial.sasaran}</p>
                <p><strong>Kegiatan:</strong> {currentPlan.remedialPengayaan.remedial.bentukKegiatan}</p>
              </div>

              <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl space-y-2">
                <h4 className="font-bold text-emerald-900">Program Pengayaan</h4>
                <p><strong>Sasaran:</strong> {currentPlan.remedialPengayaan.pengayaan.sasaran}</p>
                <p><strong>Tugas Tantangan:</strong> {currentPlan.remedialPengayaan.pengayaan.tugasTantangan}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
