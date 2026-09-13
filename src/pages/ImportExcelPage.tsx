import { useState, useRef, DragEvent } from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Edit3,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Database,
  Check,
  FileText,
} from "lucide-react";
import { ExcelService } from "../services/excel";
import { StorageService } from "../services/storage";
import { ImportPreviewRow, Student } from "../types";

interface ImportExcelPageProps {
  onNavigate: (tab: string) => void;
}

export const ImportExcelPage = ({ onNavigate }: ImportExcelPageProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [rawColumns, setRawColumns] = useState<string[]>([]);
  const [mappedColumns, setMappedColumns] = useState<Record<string, string>>({});
  const [duplicateAction, setDuplicateAction] = useState<"skip" | "update" | "new">("skip");
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    total: number;
    success: number;
    errors: number;
    duplicates: number;
  } | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ImportPreviewRow>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setImportResult(null);

    try {
      const { rows, rawColumns: cols, mappedColumns: mapped } = await ExcelService.parseStudentExcel(selectedFile);
      setPreviewRows(rows);
      setRawColumns(cols);
      setMappedColumns(mapped);
    } catch (err: any) {
      alert(`Gagal memproses file Excel: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteRow = (index: number) => {
    setPreviewRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number) => {
    setEditingRowIndex(index);
    setEditFormData(previewRows[index]);
  };

  const handleSaveEdit = () => {
    if (editingRowIndex === null) return;
    setPreviewRows((prev) => {
      const updated = [...prev];
      const target = { ...updated[editingRowIndex], ...editFormData };

      // Re-validate row
      const errors: string[] = [];
      if (!target.name) errors.push("Nama siswa wajib diisi.");
      if (!target.nisn || !/^\d{10}$/.test(target.nisn)) errors.push("NISN harus 10 digit angka.");

      target.errorMessages = errors;
      target.status = errors.length > 0 ? "Error" : target.status === "Duplikat" ? "Duplikat" : "Valid";

      updated[editingRowIndex] = target as ImportPreviewRow;
      return updated;
    });
    setEditingRowIndex(null);
  };

  const handleCommitImport = async () => {
    if (previewRows.length === 0) return;

    setIsImporting(true);
    setImportProgress(10);

    const existingStudents = StorageService.getStudents();
    let updatedList = [...existingStudents];
    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (let i = 0; i < previewRows.length; i++) {
      const row = previewRows[i];
      // Update progress
      setImportProgress(Math.round(((i + 1) / previewRows.length) * 100));

      if (row.status === "Error") {
        errorCount++;
        continue;
      }

      if (row.status === "Duplikat") {
        duplicateCount++;
        if (duplicateAction === "skip") {
          continue;
        } else if (duplicateAction === "update") {
          const matchIdx = updatedList.findIndex(
            (s) => s.nisn === row.nisn || (s.name.toLowerCase() === row.name.toLowerCase() && s.dob === row.dob)
          );
          if (matchIdx >= 0) {
            updatedList[matchIdx] = {
              ...updatedList[matchIdx],
              nis: row.nis || updatedList[matchIdx].nis,
              name: row.name,
              gender: row.gender as "L" | "P",
              pob: row.pob,
              dob: row.dob,
              religion: row.religion as any,
              address: row.address,
              fatherName: row.fatherName,
              motherName: row.motherName,
              parentPhone: row.parentPhone,
              classId: row.classId,
            };
            successCount++;
            continue;
          }
        }
      }

      // Add new student
      const newStudent: Student = {
        id: `std-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        nisn: row.nisn,
        nis: row.nis || String(21400 + updatedList.length + 1),
        name: row.name,
        gender: row.gender as "L" | "P",
        pob: row.pob,
        dob: row.dob,
        religion: (row.religion as any) || "Islam",
        address: row.address,
        fatherName: row.fatherName,
        motherName: row.motherName,
        parentPhone: row.parentPhone,
        classId: row.classId,
        photoUrl:
          row.gender === "L"
            ? "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      };

      updatedList.push(newStudent);
      successCount++;
    }

    // Save and Trigger Automatic Cross-Module Synchronization
    StorageService.saveStudents(updatedList);
    StorageService.addImportLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString("id-ID"),
      fileName: file?.name || "Import_Manual.xlsx",
      total: previewRows.length,
      success: successCount,
      errors: errorCount,
      duplicates: duplicateCount,
    });

    setImportResult({
      total: previewRows.length,
      success: successCount,
      errors: errorCount,
      duplicates: duplicateCount,
    });
    setIsImporting(false);
  };

  const validRowsCount = previewRows.filter((r) => r.status === "Valid").length;
  const duplicateRowsCount = previewRows.filter((r) => r.status === "Duplikat").length;
  const errorRowsCount = previewRows.filter((r) => r.status === "Error").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Title and Template Download */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fitur Utama Terpadu</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Import Data Siswa Sekaligus dari Excel
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Sekali import, data langsung otomatis tersinkronisasi ke Absensi Digital, Daftar Nilai, Rapor, dan Portal Orang Tua!
          </p>
        </div>

        <button
          onClick={ExcelService.downloadStudentTemplate}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Template Excel</span>
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!previewRows.length && !importResult && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-white text-blue-600 shadow-lg shadow-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-800">
            Tarik & Lepaskan File Excel atau Klik untuk Memilih
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
            Mendukung format <strong>.XLSX</strong>, <strong>.XLS</strong>, dan <strong>.CSV</strong>. AI akan otomatis mengenali kolom header (Nama, NISN, Gender, dsb).
          </p>
          <div className="inline-block mt-4 px-4 py-2 bg-white text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 shadow-2xs">
            Pilih File dari Komputer
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12 glass-card rounded-3xl">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-800">Membaca file dan melakukan Auto-Mapping AI...</p>
          <p className="text-xs text-slate-500">Mendeteksi NISN, Nama, jenis kelamin, serta duplikasi data.</p>
        </div>
      )}

      {/* Import Result Screen */}
      {importResult && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border-2 border-emerald-400/40 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800">
            Data Siswa Berhasil Disinkronkan!
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-lg mx-auto">
            Semua data siswa kini telah terhubung ke seluruh sistem administrasi sekolah tanpa perlu memasukkan ulang.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto py-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 font-bold uppercase">Total Data</span>
              <p className="text-xl font-black text-slate-800">{importResult.total}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[11px] text-emerald-600 font-bold uppercase">Berhasil</span>
              <p className="text-xl font-black text-emerald-700">{importResult.success}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[11px] text-amber-600 font-bold uppercase">Duplikat</span>
              <p className="text-xl font-black text-amber-700">{importResult.duplicates}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[11px] text-rose-600 font-bold uppercase">Error</span>
              <p className="text-xl font-black text-rose-700">{importResult.errors}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate("absensi")}
              className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <span>Buka Absensi Digital</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("nilai")}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <span>Buka Input Nilai</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setPreviewRows([]);
                setImportResult(null);
                setFile(null);
              }}
              className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
            >
              Import File Lain
            </button>
          </div>
        </div>
      )}

      {/* Preview Table & Actions Before Committing */}
      {previewRows.length > 0 && !importResult && (
        <div className="space-y-4">
          {/* Summary KPI Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 glass-card rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{file?.name} ({previewRows.length} Baris)</span>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800">
                {validRowsCount} Valid
              </span>
              {duplicateRowsCount > 0 && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-800">
                  {duplicateRowsCount} Duplikat
                </span>
              )}
              {errorRowsCount > 0 && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-100 text-rose-800">
                  {errorRowsCount} Error
                </span>
              )}
            </div>

            {/* Duplicate Action selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Jika duplikat:</span>
              <select
                value={duplicateAction}
                onChange={(e) => setDuplicateAction(e.target.value as any)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 outline-none"
              >
                <option value="skip">Lewati (Abaikan)</option>
                <option value="update">Update Data Yang Ada</option>
                <option value="new">Tambah Sebagai Baru</option>
              </select>
            </div>
          </div>

          {/* AI Auto-Mapping Information Tag */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Auto-Mapping AI Aktif:</strong> Kolom Excel terpetakan otomatis ke basis data SD Kurikulum Merdeka.
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Klik ikon pensil pada baris untuk mengoreksi nilai
            </span>
          </div>

          {/* Real-Time Progress Bar when importing */}
          {isImporting && (
            <div className="glass-card p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Sedang menyinkronkan data ke Absensi, Nilai & Rapor...</span>
                <span>{importProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Preview Data Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200">
            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/90 text-slate-600 font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">No</th>
                    <th className="p-3">NISN</th>
                    <th className="p-3">NIS</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">L/P</th>
                    <th className="p-3">TTL</th>
                    <th className="p-3">No HP Ortu</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        row.status === "Error"
                          ? "bg-rose-50/50"
                          : row.status === "Duplikat"
                          ? "bg-amber-50/40"
                          : ""
                      }`}
                    >
                      <td className="p-3 whitespace-nowrap">
                        {row.status === "Valid" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        )}
                        {row.status === "Duplikat" && (
                          <span
                            title={row.duplicateReason}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 cursor-help"
                          >
                            <AlertTriangle className="w-3 h-3" /> Duplikat
                          </span>
                        )}
                        {row.status === "Error" && (
                          <span
                            title={row.errorMessages.join("; ")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 cursor-help"
                          >
                            <XCircle className="w-3 h-3" /> Error
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-3 font-mono font-medium">{row.nisn}</td>
                      <td className="p-3 font-mono">{row.nis || "-"}</td>
                      <td className="p-3 font-semibold text-slate-800">{row.name}</td>
                      <td className="p-3">{row.gender}</td>
                      <td className="p-3 whitespace-nowrap text-[11px] text-slate-500">
                        {row.pob}, {row.dob}
                      </td>
                      <td className="p-3 font-mono text-[11px]">{row.parentPhone}</td>
                      <td className="p-3 font-medium">{row.classId.toUpperCase()}</td>
                      <td className="p-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(idx)}
                            className="p-1 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Edit baris ini"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(idx)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Hapus baris ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action commit footer */}
          <div className="flex items-center justify-between p-4 glass-card rounded-2xl">
            <button
              onClick={() => {
                setPreviewRows([]);
                setFile(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Batalkan
            </button>

            <button
              disabled={isImporting}
              onClick={handleCommitImport}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>Simpan & Sinkronkan Sekarang ({previewRows.length} Siswa)</span>
            </button>
          </div>
        </div>
      )}

      {/* Row Edit Modal */}
      {editingRowIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="glass-dropdown max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-800">Edit Data Baris Siswa</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nama Siswa *</label>
                <input
                  type="text"
                  value={editFormData.name || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">NISN (10 Digit) *</label>
                  <input
                    type="text"
                    value={editFormData.nisn || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">NIS</label>
                  <input
                    type="text"
                    value={editFormData.nis || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, nis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Jenis Kelamin</label>
                  <select
                    value={editFormData.gender || "L"}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kelas</label>
                  <select
                    value={editFormData.classId || "cls-4a"}
                    onChange={(e) => setEditFormData({ ...editFormData, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="cls-4a">Kelas 4A</option>
                    <option value="cls-4b">Kelas 4B</option>
                    <option value="cls-1a">Kelas 1A</option>
                    <option value="cls-2a">Kelas 2A</option>
                    <option value="cls-3a">Kelas 3A</option>
                    <option value="cls-5a">Kelas 5A</option>
                    <option value="cls-6a">Kelas 6A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">No HP Orang Tua</label>
                <input
                  type="text"
                  value={editFormData.parentPhone || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, parentPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingRowIndex(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
