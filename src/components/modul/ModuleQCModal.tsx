import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Wrench, X, RefreshCw, Sparkles } from "lucide-react";
import { CompleteModulePlan } from "../../types/modulePlan";
import { AIModuleGenerator } from "../../services/aiModuleGenerator";

interface ModuleQCModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CompleteModulePlan;
  onUpdatePlan: (updated: CompleteModulePlan) => void;
}

export const ModuleQCModal: React.FC<ModuleQCModalProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
}) => {
  const [rechecking, setRechecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRecheck = () => {
    setRechecking(true);
    setTimeout(() => {
      const qcResult = AIModuleGenerator.evaluateQC(plan);
      const updated = { ...plan, qcResult };
      onUpdatePlan(updated);
      setRechecking(false);
    }, 400);
  };

  const handleAutoFix = async (checkId: string) => {
    setFeedback(`Memperbaiki ${checkId}...`);
    const updated = JSON.parse(JSON.stringify(plan)) as CompleteModulePlan;

    if (checkId === "qc-4") {
      // Fix sintaks kegiatan
      const res = await AIModuleGenerator.handleAssistantCommand(updated, "Ubah kegiatan inti menjadi PBL");
      const qcResult = AIModuleGenerator.evaluateQC(res.updatedPlan);
      onUpdatePlan({ ...res.updatedPlan, qcResult });
      setFeedback("Sintaks kegiatan telah diperbaiki secara otomatis!");
    } else if (checkId === "qc-7") {
      // Fix HOTS
      const res = await AIModuleGenerator.handleAssistantCommand(updated, "Buatkan 10 soal HOTS");
      const qcResult = AIModuleGenerator.evaluateQC(res.updatedPlan);
      onUpdatePlan({ ...res.updatedPlan, qcResult });
      setFeedback("Soal berbasis HOTS (C4-C6) telah ditambahkan!");
    } else {
      // General tidy up & recheck
      const tidied = AIModuleGenerator.tidyUpDocument(updated);
      const qcResult = AIModuleGenerator.evaluateQC(tidied);
      onUpdatePlan({ ...tidied, qcResult });
      setFeedback("Komponen telah diselaraskan dengan standar Kurikulum Merdeka!");
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  const checks = plan.qcResult?.checks || [];
  const passedCount = checks.filter((c) => c.status === "pass").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Quality Control (QC) Modul Ajar</h2>
              <p className="text-xs text-emerald-100">
                10 Pengecekan Keterhubungan: CP → ATP → TP → Kegiatan → LKPD → Asesmen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Score Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Skor Kepatuhan Kurikulum:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-emerald-600">{passedCount} / 10 Lolos</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                {passedCount === 10 ? "Sempurna (100%)" : `${passedCount * 10}% Siap Cetak`}
              </span>
            </div>
          </div>
          <button
            onClick={handleRecheck}
            disabled={rechecking}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rechecking ? "animate-spin" : ""}`} />
            Periksa Ulang
          </button>
        </div>

        {feedback && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {feedback}
          </div>
        )}

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {checks.map((c) => (
            <div
              key={c.id}
              className={`p-3.5 rounded-xl border transition-all ${
                c.status === "pass"
                  ? "bg-emerald-50/40 border-emerald-200"
                  : c.status === "warning"
                  ? "bg-amber-50/50 border-amber-200"
                  : "bg-rose-50/50 border-rose-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {c.status === "pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : c.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{c.criterion}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{c.details}</p>
                  </div>
                </div>

                {c.autoFixAvailable && c.status !== "pass" && (
                  <button
                    onClick={() => handleAutoFix(c.id)}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:border-amber-400 text-amber-800 font-semibold shadow-xs hover:bg-amber-50 shrink-0 transition-all"
                  >
                    <Wrench className="w-3 h-3" />
                    Perbaiki Otomatis
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Terakhir dievaluasi: {plan.qcResult?.lastChecked || "Baru saja"}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
