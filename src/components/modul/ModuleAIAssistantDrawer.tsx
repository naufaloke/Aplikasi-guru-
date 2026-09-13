import React, { useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Wand2,
  BookOpen,
  HelpCircle,
  Smile,
  Users,
  TestTube,
  Check,
} from "lucide-react";
import { CompleteModulePlan } from "../../types/modulePlan";
import { AIModuleGenerator } from "../../services/aiModuleGenerator";

interface ModuleAIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CompleteModulePlan;
  onUpdatePlan: (updated: CompleteModulePlan) => void;
}

export const ModuleAIAssistantDrawer: React.FC<ModuleAIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
}) => {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ query: string; reply: string }[]>([]);

  if (!isOpen) return null;

  const quickCommands = [
    { label: "Ubah kegiatan inti menjadi PBL", icon: BookOpen },
    { label: "Buatkan 10 soal HOTS", icon: HelpCircle },
    { label: "Buat pembelajaran lebih menyenangkan", icon: Smile },
    { label: "Sesuaikan untuk peserta didik yang kemampuan membacanya masih rendah", icon: Users },
    { label: "Tambahkan kegiatan eksperimen ke LKPD", icon: TestTube },
  ];

  const handleExecute = async (cmd: string) => {
    if (!cmd.trim() || loading) return;
    setLoading(true);

    try {
      const res = await AIModuleGenerator.handleAssistantCommand(plan, cmd);
      onUpdatePlan(res.updatedPlan);
      setHistory((prev) => [{ query: cmd, reply: res.feedbackMessage }, ...prev]);
      setInstruction("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur-xs">
            <Wand2 className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Asisten AI Modul Ajar</h3>
            <p className="text-[11px] text-blue-100">Konteks Aktif: {plan.identity.materiPokok}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Perintah Cepat AI:
        </label>
        <div className="space-y-1.5">
          {quickCommands.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleExecute(q.label)}
                className="w-full text-left flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs text-slate-700 hover:text-blue-800 font-medium transition-all group"
              >
                <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* History & Chat log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">
              Ketik instruksi modifikasi atau klik salah satu perintah cepat di atas untuk menyempurnakan modul secara otomatis.
            </p>
          </div>
        ) : (
          history.map((h, i) => (
            <div key={i} className="space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-50 text-xs text-blue-950 font-medium border border-blue-100 text-right">
                {h.query}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 border border-slate-200 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <p className="leading-relaxed">{h.reply}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute(instruction);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Contoh: Tambahkan 3 pertanyaan pemantik baru..."
            disabled={loading}
            className="flex-1 text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !instruction.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
