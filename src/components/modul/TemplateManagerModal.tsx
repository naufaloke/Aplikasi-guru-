import React, { useState } from "react";
import { X, Bookmark, Plus, Check, Trash2, Sliders, Star } from "lucide-react";
import { CustomTemplate, ModuleStylingConfig } from "../../types/modulePlan";
import { ModuleStorageService } from "../../services/moduleStorage";
import { defaultStylingConfig } from "../../services/aiModuleGenerator";

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (styling: ModuleStylingConfig) => void;
}

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const [templates, setTemplates] = useState<CustomTemplate[]>(
    ModuleStorageService.getAllTemplates()
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  if (!isOpen) return null;

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newTpl: CustomTemplate = {
      id: `tpl-${Date.now()}`,
      name: newName,
      description: newDesc || "Format tata letak kustom sekolah.",
      styling: defaultStylingConfig,
      createdAt: new Date().toISOString().split("T")[0],
      isDefault: false,
    };

    ModuleStorageService.saveTemplate(newTpl);
    setTemplates(ModuleStorageService.getAllTemplates());
    setNewName("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    ModuleStorageService.deleteTemplate(id);
    setTemplates(ModuleStorageService.getAllTemplates());
  };

  const handleSetDefault = (id: string) => {
    const list = ModuleStorageService.getAllTemplates();
    list.forEach((t) => {
      t.isDefault = t.id === id;
      ModuleStorageService.saveTemplate(t);
    });
    setTemplates(ModuleStorageService.getAllTemplates());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold">Template Saya (Format Khusus Sekolah)</h3>
              <p className="text-xs text-blue-100">Simpan dan gunakan template tata letak favorit Anda</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">Daftar Format Tersimpan:</span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {showAddForm ? "Batal" : "Buat Format Saya Sendiri"}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSaveNew} className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-blue-900">Simpan Format Baru:</h4>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Format Modul Kelas 4 Bu Siti"
                className="w-full text-xs p-2.5 border rounded-lg bg-white"
                required
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Deskripsi singkat format..."
                className="w-full text-xs p-2.5 border rounded-lg bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Simpan Template
              </button>
            </form>
          )}

          <div className="space-y-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                    {tpl.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{tpl.description}</p>
                  <span className="text-[10px] text-slate-400">Dibuat: {tpl.createdAt}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!tpl.isDefault && (
                    <button
                      onClick={() => handleSetDefault(tpl.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1 border rounded"
                    >
                      Jadikan Default
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onApplyTemplate(tpl.styling);
                      onClose();
                    }}
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-2xs"
                  >
                    Gunakan
                  </button>
                  {templates.length > 1 && (
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
