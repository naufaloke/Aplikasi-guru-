import { useState, useEffect, FormEvent } from "react";
import {
  School,
  Users,
  GraduationCap,
  UserCheck,
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  Search,
  Download,
  Filter,
  X,
  Phone,
  Mail,
  UserPlus,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Layers,
  Grid,
  RotateCcw,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { ExcelService } from "../services/excel";
import { SchoolProfile, Teacher, Classroom, Student } from "../types";

// ==========================================
// 1. DATA SEKOLAH VIEW
// ==========================================
export const DataSekolahPage = () => {
  const [school, setSchool] = useState<SchoolProfile>(StorageService.getSchool());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    StorageService.saveSchool(school);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
          <School className="w-3.5 h-3.5 text-blue-600" />
          <span>Profil Satuan Pendidikan</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Data Master Sekolah Dasar
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Informasi identitas sekolah yang otomatis tercantum pada KOP Surat, RPP Modul Ajar, dan Buku Rapor Siswa.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-4 border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nama Sekolah</label>
            <input
              type="text"
              value={school.name}
              onChange={(e) => setSchool({ ...school, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">NPSN</label>
            <input
              type="text"
              value={school.npsn}
              onChange={(e) => setSchool({ ...school, npsn: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">NSS</label>
            <input
              type="text"
              value={school.nss || ""}
              onChange={(e) => setSchool({ ...school, nss: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Akreditasi</label>
            <input
              type="text"
              value={school.accreditation || ""}
              onChange={(e) => setSchool({ ...school, accreditation: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-400"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Alamat Lengkap</label>
          <input
            type="text"
            value={school.address}
            onChange={(e) => setSchool({ ...school, address: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800 focus:bg-white focus:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nama Kepala Sekolah</label>
            <input
              type="text"
              value={school.headmaster || school.principal || ""}
              onChange={(e) => setSchool({ ...school, headmaster: e.target.value, principal: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">NIP Kepala Sekolah</label>
            <input
              type="text"
              value={school.headmasterNip || school.nipPrincipal || ""}
              onChange={(e) => setSchool({ ...school, headmasterNip: e.target.value, nipPrincipal: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Data Sekolah Berhasil Disimpan
            </span>
          ) : <div />}

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. DATA GURU VIEW (TAMBAH, EDIT, HAPUS GURU & STAF)
// ==========================================
export const DataGuruPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(StorageService.getTeachers());
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Modal State for Teacher (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    ukg: "",
    subject: "Guru Kelas",
    classes: "Kelas 4A",
    phone: "",
    email: "",
    photoUrl: "",
  });

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleUpdate = () => setTeachers(StorageService.getTeachers());
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const openAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      name: "",
      nip: "",
      ukg: "",
      subject: "Guru Kelas (Tematik)",
      classes: "Kelas 4A",
      phone: "",
      email: "",
      photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setFormData({
      name: t.name,
      nip: t.nip,
      ukg: t.ukg || "",
      subject: t.subject,
      classes: Array.isArray(t.classes) ? t.classes.join(", ") : (t.classes || ""),
      phone: t.phone,
      email: t.email,
      photoUrl: t.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });
    setIsModalOpen(true);
  };

  const handleSaveTeacher = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const classArray = formData.classes
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingTeacher) {
      // Update existing
      StorageService.updateTeacher(editingTeacher.id, {
        name: formData.name,
        nip: formData.nip,
        ukg: formData.ukg,
        subject: formData.subject,
        classes: classArray,
        phone: formData.phone,
        email: formData.email,
        photoUrl: formData.photoUrl,
      });
      showToast(`Data guru "${formData.name}" berhasil diperbarui.`);
    } else {
      // Add new
      const newTeacher: Teacher = {
        id: `tch-${Date.now()}`,
        name: formData.name,
        nip: formData.nip || "-",
        ukg: formData.ukg || "-",
        subject: formData.subject,
        classes: classArray.length > 0 ? classArray : ["Kelas 4A"],
        phone: formData.phone,
        email: formData.email,
        photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      };
      StorageService.addTeacher(newTeacher);
      showToast(`Guru baru "${formData.name}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteTeacher = () => {
    if (deleteTarget) {
      StorageService.deleteTeacher(deleteTarget.id);
      showToast(`Data guru "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    }
  };

  // Filtered teachers list
  const filtered = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.includes(search) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      filterRole === "all" ||
      (filterRole === "kelas" && t.subject.toLowerCase().includes("kelas")) ||
      (filterRole === "mapel" && !t.subject.toLowerCase().includes("kelas"));
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Tenaga Pendidik & Kependidikan</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Data Dewan Guru & Staf ({teachers.length})
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kelola data guru kelas, guru mata pelajaran, kepala sekolah, dan tenaga administrasi SD Negeri 3 Banjar Ratu.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Guru & Staf</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama guru, NIP, atau mata pelajaran..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl outline-none border border-slate-200 focus:bg-white focus:border-blue-400 font-medium"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
        >
          <option value="all">Semua Penugasan</option>
          <option value="kelas">Guru Kelas</option>
          <option value="mapel">Guru Mata Pelajaran</option>
        </select>
      </div>

      {/* Teachers Table with Action Buttons */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">No</th>
                <th className="p-3.5">Nama & Gelar</th>
                <th className="p-3.5">NIP / UKG</th>
                <th className="p-3.5">Mata Pelajaran / Tugas</th>
                <th className="p-3.5">Kelas Diampu</th>
                <th className="p-3.5">Kontak</th>
                <th className="p-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={t.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={t.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">{t.name}</span>
                        <span className="text-[10px] text-slate-400">{t.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="text-slate-700 font-semibold block">{t.nip}</span>
                    {t.ukg && <span className="text-[10px] text-slate-400">UKG: {t.ukg}</span>}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-[11px]">
                      {t.subject}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-600 font-medium text-[11px]">
                      {Array.isArray(t.classes) ? t.classes.join(", ") : t.classes}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{t.phone}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit data guru / staf"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        title="Hapus guru"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Guru & Staf */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {editingTeacher ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-sm text-slate-800">
                  {editingTeacher ? "Edit Data Guru & Staf" : "Tambah Guru & Staf Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Pd., Gr."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    placeholder="198807142014021003 atau -"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">No. UKG / NUPTK</label>
                  <input
                    type="text"
                    placeholder="201502938411"
                    value={formData.ukg}
                    onChange={(e) => setFormData({ ...formData, ukg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tugas / Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Guru Kelas / IPAS / PAI / PJOK"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kelas yang Diampu</label>
                  <input
                    type="text"
                    placeholder="Kelas 4A, Kelas 4B"
                    value={formData.classes}
                    onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">No WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Belajar.id / Resmi</label>
                  <input
                    type="email"
                    placeholder="nama@guru.sd.belajar.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">URL Foto Profil</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTeacher ? "Simpan Perubahan" : "Tambahkan Guru"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Hapus Guru */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Hapus Data Guru?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus data <strong>{deleteTarget.name}</strong> (NIP: {deleteTarget.nip})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteTeacher}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. DATA KELAS VIEW (PEMILIHAN TINGKAT KELAS & ROMBEL PARALEL 1A, 1B, 1C, DST.)
// ==========================================
export const DataKelasPage = () => {
  const [classes, setClasses] = useState<Classroom[]>(StorageService.getClasses());
  const [teachers, setTeachers] = useState<Teacher[]>(StorageService.getTeachers());

  // Level & Search Filter State
  const [selectedLevel, setSelectedLevel] = useState<number | "Semua">("Semua");
  const [selectedClassId, setSelectedClassId] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Class Modal State
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [editClassName, setEditClassName] = useState("");
  const [editLevel, setEditLevel] = useState<number>(1);
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [customRoom, setCustomRoom] = useState("");
  const [customCapacity, setCustomCapacity] = useState<number>(28);

  // Add Class Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLevel, setAddLevel] = useState<number>(1);
  const [addStream, setAddStream] = useState<string>("A");
  const [addClassName, setAddClassName] = useState("Kelas 1A");
  const [addTeacherName, setAddTeacherName] = useState("");
  const [addRoom, setAddRoom] = useState("Gedung A - R.01");
  const [addCapacity, setAddCapacity] = useState<number>(28);

  // Delete Class Confirmation Modal
  const [deletingClass, setDeletingClass] = useState<Classroom | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setClasses(StorageService.getClasses());
      setTeachers(StorageService.getTeachers());
    };
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  // Update Add Form Class Name when level or stream changes
  const handleLevelChange = (lvl: number, stream: string) => {
    setAddLevel(lvl);
    setAddStream(stream);
    setAddClassName(`Kelas ${lvl}${stream.toUpperCase()}`);
    const building = lvl <= 2 ? "Gedung A" : lvl <= 4 ? "Gedung B" : "Gedung C";
    const roomNum = `R.0${lvl}${stream.toLowerCase() === "a" ? "1" : stream.toLowerCase() === "b" ? "2" : "3"}`;
    setAddRoom(`${building} - ${roomNum}`);
  };

  const openAddClassModal = (defaultLvl?: number) => {
    const lvl = defaultLvl || (selectedLevel === "Semua" ? 1 : selectedLevel);
    // Find next unused stream for this level (e.g. if 1A and 1B exist, suggest 1C)
    const existingStreams = classes
      .filter((c) => c.level === lvl)
      .map((c) => c.name.replace(/[^A-Za-z]/g, "").slice(-1).toUpperCase());
    
    let nextStream = "A";
    const candidates = ["A", "B", "C", "D", "E"];
    for (const cand of candidates) {
      if (!existingStreams.includes(cand)) {
        nextStream = cand;
        break;
      }
    }

    handleLevelChange(lvl, nextStream);
    setAddTeacherName("");
    setAddCapacity(lvl >= 5 ? 30 : 28);
    setIsAddModalOpen(true);
  };

  const handleSaveNewClass = (e: FormEvent) => {
    e.preventDefault();
    if (!addClassName.trim()) return;

    const newId = `cls-${addLevel}${addStream.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newClass: Classroom = {
      id: newId,
      name: addClassName.trim(),
      level: addLevel,
      homeroomTeacher: addTeacherName.trim() || "Belum Ditetapkan",
      room: addRoom.trim() || `Ruang Kelas ${addLevel}`,
      capacity: addCapacity || 28,
    };

    StorageService.addClass(newClass);
    setClasses(StorageService.getClasses());
    showToast(`Rombel "${addClassName}" berhasil ditambahkan.`);
    setIsAddModalOpen(false);
  };

  const openEditModal = (cls: Classroom) => {
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditLevel(cls.level);
    setSelectedTeacherName(cls.homeroomTeacher || "");
    setCustomRoom(cls.room || "");
    setCustomCapacity(cls.capacity || 28);
  };

  const handleSaveEditClass = (e: FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    StorageService.updateClass(editingClass.id, {
      name: editClassName.trim() || editingClass.name,
      level: editLevel,
      homeroomTeacher: selectedTeacherName,
      room: customRoom,
      capacity: customCapacity,
    });

    setClasses(StorageService.getClasses());
    showToast(`Data "${editClassName}" berhasil diperbarui.`);
    setEditingClass(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingClass) return;
    StorageService.deleteClass(deletingClass.id);
    setClasses(StorageService.getClasses());
    showToast(`Rombel "${deletingClass.name}" telah dihapus.`);
    setDeletingClass(null);
    if (selectedClassId === deletingClass.id) {
      setSelectedClassId("Semua");
    }
  };

  const handleRestoreStandardClasses = () => {
    if (window.confirm("Muat daftar lengkap rombel paralel standar (Kelas 1A, 1B, 1C, 2A, 2B, 3A, 3B, 4A, 4B, 5A, 5B, 6A, 6B)? Data rombel yang sudah ada akan disinkronkan.")) {
      const standard = StorageService.resetDefaultClasses();
      setClasses(standard);
      showToast("Rombel paralel standar (1A s/d 6B) berhasil dimuat.");
    }
  };

  // Filtered Classes based on:
  // 1. Level Filter (Semua, 1, 2, 3, 4, 5, 6)
  // 2. Specific Class ID Pill
  // 3. Search Query
  const filteredClasses = classes.filter((cls) => {
    const matchLevel = selectedLevel === "Semua" || cls.level === selectedLevel;
    const matchClassId = selectedClassId === "Semua" || cls.id === selectedClassId;
    const matchSearch =
      searchQuery === "" ||
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cls.homeroomTeacher && cls.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cls.room && cls.room.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchLevel && matchClassId && matchSearch;
  });

  // Get list of available parallel classes for the active level
  const availableRombelPills = classes.filter((c) => {
    return selectedLevel === "Semua" || c.level === selectedLevel;
  });

  // Level statistics
  const levelCounts = [1, 2, 3, 4, 5, 6].map((lvl) => ({
    level: lvl,
    fase: lvl <= 2 ? "A" : lvl <= 4 ? "B" : "C",
    count: classes.filter((c) => c.level === lvl).length,
    classes: classes.filter((c) => c.level === lvl),
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Manajemen Rombongan Belajar (Rombel)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Data Kelas & Pemilihan Tingkat Kelas
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
            Pilih tingkat kelas dan rombel paralel (Contoh: Kelas 1A, 1B, 1C, 2A, 2B, dst.) serta tetapkan dewan guru sebagai Wali Kelas masing-masing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleRestoreStandardClasses}
            title="Muat atau reset rombel standar paralel (1A, 1B, 1C, 2A, 2B, 3A, dst.)"
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Muat Rombel Standar (1A–6B)</span>
          </button>

          <button
            type="button"
            onClick={() => openAddClassModal()}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Rombel Baru</span>
          </button>
        </div>
      </div>

      {/* Level Summary Chips / Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {levelCounts.map((item) => {
          const isSelected = selectedLevel === item.level;
          return (
            <button
              key={item.level}
              onClick={() => {
                setSelectedLevel(isSelected ? "Semua" : item.level);
                setSelectedClassId("Semua");
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 ring-2 ring-indigo-300"
                  : "bg-white text-slate-700 border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                }`}>
                  Fase {item.fase}
                </span>
                <span className={`text-xs font-black px-1.5 py-0.5 rounded-full ${
                  isSelected ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {item.count} Rombel
                </span>
              </div>
              <h4 className={`text-base font-black mt-2 tracking-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                Tingkat {item.level}
              </h4>
              <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                {item.classes.length > 0
                  ? item.classes.map((c) => c.name.replace("Kelas ", "")).join(", ")
                  : "Belum ada rombel"}
              </p>
            </button>
          );
        })}
      </div>

      {/* FILTER & SELECTION CONTROLS */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Row 1: Primary Tingkat Selector Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Pemilihan Tingkat Kelas:</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Menampilkan {filteredClasses.length} dari total {classes.length} rombel
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedLevel("Semua");
                setSelectedClassId("Semua");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedLevel === "Semua"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>Semua Tingkat (1 s/d 6)</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedLevel === "Semua" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
              }`}>
                {classes.length}
              </span>
            </button>

            {[1, 2, 3, 4, 5, 6].map((lvl) => {
              const count = classes.filter((c) => c.level === lvl).length;
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedClassId("Semua");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span>Tingkat {lvl} (Fase {lvl <= 2 ? "A" : lvl <= 4 ? "B" : "C"})</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Secondary Quick Class Pills (Contoh: 1A, 1B, 1C, 2A, 2B, dll) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Grid className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Pilih Rombel Spesifik (1A, 1B, 1C, 2A, 2B, dst.):</span>
            </span>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari rombel / wali / ruang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedClassId("Semua")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedClassId === "Semua"
                  ? "bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200"
              }`}
            >
              Semua Rombel ({availableRombelPills.length})
            </button>

            {availableRombelPills.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              const hasHomeroom = cls.homeroomTeacher && cls.homeroomTeacher !== "Belum Ditetapkan";
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(isSelected ? "Semua" : cls.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs scale-105"
                      : "bg-white border border-slate-200 text-slate-800 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${hasHomeroom ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <span>{cls.name}</span>
                </button>
              );
            })}

            {/* Quick add button in the pills row */}
            <button
              onClick={() => openAddClassModal(selectedLevel === "Semua" ? 1 : selectedLevel)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah di Tingkat Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      {filteredClasses.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Tidak Ada Rombel yang Cocok</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tidak ditemukan kelas untuk filter yang dipilih. Anda dapat menambahkan rombel baru atau mengatur ulang filter pencarian.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSelectedLevel("Semua");
                setSelectedClassId("Semua");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Reset Filter
            </button>
            <button
              onClick={() => openAddClassModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Rombel Sekarang</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => {
            const matchedTeacher = teachers.find(
              (t) => t.name.toLowerCase() === (cls.homeroomTeacher || "").toLowerCase()
            );
            const hasHomeroom = cls.homeroomTeacher && cls.homeroomTeacher !== "Belum Ditetapkan";

            return (
              <div
                key={cls.id}
                className={`glass-card p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                  selectedClassId === cls.id
                    ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/20"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header: Class Name and Level Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-xl bg-indigo-100 text-indigo-950 font-black text-sm shadow-2xs">
                        {cls.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Tingkat {cls.level}
                      </span>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Fase {cls.level <= 2 ? "A" : cls.level <= 4 ? "B" : "C"}
                    </span>
                  </div>

                  {/* Homeroom Teacher Section */}
                  <div className={`p-3 rounded-2xl border space-y-1.5 ${
                    hasHomeroom
                      ? "bg-slate-50/90 border-slate-200/80"
                      : "bg-amber-50/60 border-amber-200/70"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Wali Kelas Terpilih:
                      </span>
                      {!hasHomeroom && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded">
                          Perlu Ditentukan
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        hasHomeroom ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {cls.homeroomTeacher?.charAt(0) || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-xs text-slate-800 truncate" title={cls.homeroomTeacher}>
                          {cls.homeroomTeacher || "Belum Ditetapkan"}
                        </p>
                        {matchedTeacher ? (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            NIP: {matchedTeacher.nip}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block">
                            {hasHomeroom ? "Guru Pengampu" : "Klik tombol edit di bawah"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Room & Student Count Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Ruang Belajar:</span>
                      <span className="font-semibold text-slate-700">{cls.room || "Ruang Kelas"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Siswa Terdaftar:</span>
                      <span className="font-bold text-emerald-600">
                        {cls.studentCount || 0} / {cls.capacity || 28} Murid
                      </span>
                    </div>

                    {/* Progress Bar for Capacity */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.round(((cls.studentCount || 0) / (cls.capacity || 28)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions: Edit Data / Wali Kelas & Hapus */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(cls)}
                    className="flex-1 py-2 px-3 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Rombel & Wali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingClass(cls)}
                    title="Hapus Rombel"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Tambah Rombel Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">
                    Tambah Rombongan Belajar (Rombel) Baru
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Daftarkan kelas paralel baru seperti 1A, 1B, 1C, 2A, dst.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClass} className="space-y-4 text-xs">
              {/* Step 1: Tingkat Kelas Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  1. Pilih Tingkat Kelas (Tingkat 1 s/d 6):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelChange(lvl, addStream)}
                      className={`py-2 px-2 text-center rounded-xl font-black text-xs transition-all border ${
                        addLevel === lvl
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50"
                      }`}
                    >
                      Kelas {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Sub-Kelas / Stream (A, B, C, D, E) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  2. Pilih Huruf Rombel Paralel (A, B, C, D, E):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["A", "B", "C", "D", "E"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleLevelChange(addLevel, st)}
                      className={`py-2 px-3 text-center rounded-xl font-black text-sm transition-all border ${
                        addStream === st
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50"
                      }`}
                    >
                      Rombel {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Class Name Preview */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nama Resmi Rombel (Otomatis / Dapat Disesuaikan):
                </label>
                <input
                  type="text"
                  value={addClassName}
                  onChange={(e) => setAddClassName(e.target.value)}
                  placeholder="Contoh: Kelas 1C"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-slate-900 focus:bg-white focus:border-indigo-500"
                  required
                />
              </div>

              {/* Step 4: Homeroom Teacher */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Pilih Guru Sebagai Wali Kelas:
                </label>
                <select
                  value={addTeacherName}
                  onChange={(e) => setAddTeacherName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                >
                  <option value="">-- Tetapkan Nanti / Pilih Guru --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.subject} • NIP: {t.nip})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 5: Room & Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ruangan Kelas
                  </label>
                  <input
                    type="text"
                    value={addRoom}
                    onChange={(e) => setAddRoom(e.target.value)}
                    placeholder="Contoh: Gedung A - R.03"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kapasitas Maksimal
                  </label>
                  <input
                    type="number"
                    value={addCapacity}
                    onChange={(e) => setAddCapacity(parseInt(e.target.value) || 28)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Rombel Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Data & Wali Kelas */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800">
                    Edit Rombel: {editingClass.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Sesuaikan tingkat kelas, nama rombel, dan wali kelas
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Rombel:
                  </label>
                  <input
                    type="text"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    placeholder="Contoh: Kelas 1C"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-slate-800 focus:bg-white focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tingkat Kelas:
                  </label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Tingkat {lvl} (Fase {lvl <= 2 ? "A" : lvl <= 4 ? "B" : "C"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Pilih Guru Sebagai Wali Kelas:
                </label>
                <select
                  value={selectedTeacherName}
                  onChange={(e) => setSelectedTeacherName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                >
                  <option value="">-- Pilih dari Daftar Dewan Guru --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.subject} • NIP: {t.nip})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Dewan guru dapat ditambah atau disunting di menu "Data Guru".
                </span>
              </div>

              {/* Manual input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Atau Ketik Nama Wali Kelas Manual:
                </label>
                <input
                  type="text"
                  value={selectedTeacherName}
                  onChange={(e) => setSelectedTeacherName(e.target.value)}
                  placeholder="Ketik nama lengkap & gelar..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800 focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ruang Kelas
                  </label>
                  <input
                    type="text"
                    value={customRoom}
                    onChange={(e) => setCustomRoom(e.target.value)}
                    placeholder="Contoh: Gedung B - R.04"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kapasitas Maksimal
                  </label>
                  <input
                    type="number"
                    value={customCapacity}
                    onChange={(e) => setCustomCapacity(parseInt(e.target.value) || 28)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Rombel */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">Hapus Rombel Ini?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{deletingClass.name}</strong>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Rombel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. DATA SISWA VIEW (MENU EDIT & HAPUS DATA SISWA LENGKAP)
// ==========================================
export const DataSiswaPage = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [classes] = useState<Classroom[]>(StorageService.getClasses());
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  // Modal State for Student (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Fields
  const [studentForm, setStudentForm] = useState({
    nisn: "",
    nis: "",
    name: "",
    gender: "L" as "L" | "P",
    pob: "Lampung Tengah",
    dob: "2014-05-14",
    religion: "Islam" as Student["religion"],
    address: "Desa Banjar Ratu",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    classId: "cls-4a",
    photoUrl: "",
  });

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleUpdate = () => setStudents(StorageService.getStudents());
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  const openAddStudentModal = () => {
    setEditingStudent(null);
    const nextNis = 21400 + students.length + 1;
    setStudentForm({
      nisn: `012${Math.floor(1000000 + Math.random() * 9000000)}`,
      nis: nextNis.toString(),
      name: "",
      gender: "L",
      pob: "Lampung Tengah",
      dob: "2014-06-15",
      religion: "Islam",
      address: "Desa Banjar Ratu, Way Pengubuan",
      fatherName: "",
      motherName: "",
      parentPhone: "0812",
      classId: "cls-4a",
      photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    });
    setIsModalOpen(true);
  };

  const openEditStudentModal = (s: Student) => {
    setEditingStudent(s);
    setStudentForm({
      nisn: s.nisn,
      nis: s.nis,
      name: s.name,
      gender: s.gender,
      pob: s.pob,
      dob: s.dob,
      religion: s.religion,
      address: s.address,
      fatherName: s.fatherName,
      motherName: s.motherName,
      parentPhone: s.parentPhone,
      classId: s.classId,
      photoUrl: s.photoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    if (editingStudent) {
      // Update
      StorageService.updateStudent(editingStudent.id, {
        nisn: studentForm.nisn,
        nis: studentForm.nis,
        name: studentForm.name,
        gender: studentForm.gender,
        pob: studentForm.pob,
        dob: studentForm.dob,
        religion: studentForm.religion,
        address: studentForm.address,
        fatherName: studentForm.fatherName,
        motherName: studentForm.motherName,
        parentPhone: studentForm.parentPhone,
        classId: studentForm.classId,
        photoUrl: studentForm.photoUrl,
      });
      showToast(`Data siswa "${studentForm.name}" berhasil diperbarui.`);
    } else {
      // Add
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        nisn: studentForm.nisn,
        nis: studentForm.nis,
        name: studentForm.name,
        gender: studentForm.gender,
        pob: studentForm.pob,
        dob: studentForm.dob,
        religion: studentForm.religion,
        address: studentForm.address,
        fatherName: studentForm.fatherName,
        motherName: studentForm.motherName,
        parentPhone: studentForm.parentPhone,
        classId: studentForm.classId,
        photoUrl: studentForm.photoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
      };
      StorageService.addStudent(newStudent);
      showToast(`Siswa baru "${studentForm.name}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteStudent = () => {
    if (deleteTarget) {
      StorageService.deleteStudent(deleteTarget.id);
      showToast(`Data siswa "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
    }
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nisn.includes(search) ||
      s.nis.includes(search);
    const matchClass = filterClass === "all" || s.classId === filterClass;
    return matchSearch && matchClass;
  });

  const handleExport = () => {
    ExcelService.exportStudentsExcel(filtered);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 md:p-8 rounded-3xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase mb-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Basis Data Induk Peserta Didik</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Data Seluruh Siswa ({students.length} Murid)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Data terintegrasi satu pintu: otomatis sinkron dengan Presensi Harian, Penilaian Formatif/Sumatif, dan Rapor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddStudentModal}
            className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Siswa</span>
          </button>
          <button
            onClick={() => onNavigate("import-excel")}
            className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all"
          >
            Import Excel
          </button>
          <button
            onClick={handleExport}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, NISN, atau NIS..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl outline-none border border-slate-200 focus:bg-white focus:border-blue-400 font-medium"
          />
        </div>

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
        >
          <option value="all">Semua Rombel</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table with EDIT and HAPUS actions */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">No</th>
                <th className="p-3.5">NISN / NIS</th>
                <th className="p-3.5">Nama Peserta Didik</th>
                <th className="p-3.5 text-center">L/P</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Tempat & Tgl Lahir</th>
                <th className="p-3.5">Wali Murid</th>
                <th className="p-3.5">No HP Ortu</th>
                <th className="p-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-800 block">{s.nisn}</span>
                    <span className="text-slate-400 block text-[11px]">{s.nis}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.photoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.religion}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full font-black text-[10px] ${
                        s.gender === "L"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {s.gender}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-blue-700 uppercase">{s.classId.replace("cls-", "Kelas ")}</td>
                  <td className="p-3.5 text-slate-500 text-[11px]">
                    {s.pob}, {s.dob}
                  </td>
                  <td className="p-3.5 font-medium">{s.fatherName || s.motherName || "-"}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">{s.parentPhone || "-"}</td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditStudentModal(s)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit data siswa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                        title="Hapus data siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {editingStudent ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-sm text-slate-800">
                  {editingStudent ? "Edit Data Peserta Didik" : "Tambah Siswa Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    NISN (10 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="0123456789"
                    value={studentForm.nisn}
                    onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    NIS Lokal Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="21401"
                    value={studentForm.nis}
                    onChange={(e) => setStudentForm({ ...studentForm, nis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800 focus:bg-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap peserta didik..."
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Jenis Kelamin</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as "L" | "P" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kelas / Rombel</label>
                  <select
                    value={studentForm.classId}
                    onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Agama</label>
                  <select
                    value={studentForm.religion}
                    onChange={(e) => setStudentForm({ ...studentForm, religion: e.target.value as Student["religion"] })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Lampung Tengah"
                    value={studentForm.pob}
                    onChange={(e) => setStudentForm({ ...studentForm, pob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={studentForm.dob}
                    onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Tinggal Siswa</label>
                <input
                  type="text"
                  placeholder="Dusun/RT, Desa Banjar Ratu..."
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    placeholder="Nama ayah..."
                    value={studentForm.fatherName}
                    onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    placeholder="Nama ibu..."
                    value={studentForm.motherName}
                    onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">No HP Ortu / WA</label>
                  <input
                    type="text"
                    placeholder="081273849102"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStudent ? "Simpan Perubahan" : "Tambahkan Siswa"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Hapus Siswa */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-800">Hapus Data Siswa?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus data murid <strong>{deleteTarget.name}</strong> (NISN: {deleteTarget.nisn})?
                Data kehadiran dan nilai terkait akan otomatis disinkronkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
