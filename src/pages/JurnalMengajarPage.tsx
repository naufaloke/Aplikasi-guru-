import React, { useState, useEffect } from "react";
import {
  BookMarked,
  Mic,
  MicOff,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  RefreshCw,
  FileText,
  Trash2,
  Edit3,
  Search,
  Printer,
  X,
  Palette,
  Globe,
  BookOpen,
  Layers,
  ChevronDown,
  Info,
  Plus,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { TeachingJournal, Classroom } from "../types";
import { AIService } from "../services/ai";
import {
  SD_CLASSES,
  SD_MAIN_SUBJECTS,
  SENI_SUB_OPTIONS,
  MULOK_DEFAULT_OPTIONS,
  SDClassOption,
} from "../constants/curriculumSD";

export const JurnalMengajarPage = () => {
  const [journals, setJournals] = useState<TeachingJournal[]>(StorageService.getJournals());
  const [availableClasses, setAvailableClasses] = useState<Classroom[]>([]);
  
  // Active Form State
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("07:30 - 09:00 (2 JP)");
  
  // Class selection
  const [selectedClass, setSelectedClass] = useState<string>("Kelas IV – Fase B");
  
  // Subject selection logic
  const [selectedBaseSubject, setSelectedBaseSubject] = useState<string>("Ilmu Pengetahuan Alam dan Sosial (IPAS)");
  const [selectedSeniSub, setSelectedSeniSub] = useState<string>("Seni Rupa");
  const [selectedMulokSub, setSelectedMulokSub] = useState<string>("Bahasa Lampung");
  const [customMulokName, setCustomMulokName] = useState<string>("");
  const [customSubjectName, setCustomSubjectName] = useState<string>("");

  // Content Fields
  const [topic, setTopic] = useState("Struktur Anatomi Daun dan Proses Fotosintesis");
  const [activities, setActivities] = useState("Siswa mengamati daun sirih dan daun mangga di halaman sekolah secara berkelompok, lalu menggambar pola tulang daun pada lembar observasi.");
  const [challenges, setChallenges] = useState("Dua siswa sempat berebut kaca pembesar dan waktu presentasi agak mepet.");
  const [solutions, setSolutions] = useState("Guru membagi giliran penggunaan alat laboratorium dan mengatur alarm waktu tiap sesi kelompok.");
  const [reflections, setReflections] = useState("Pembelajaran di luar ruangan sangat meningkatkan antusiasme siswa dalam memahami konsep stomata.");

  // Interaction State
  const [isRecording, setIsRecording] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // History Filters
  const [searchHistory, setSearchHistory] = useState("");
  const [filterClassHistory, setFilterClassHistory] = useState("all");
  const [filterSubjectHistory, setFilterSubjectHistory] = useState("all");

  useEffect(() => {
    const handleUpdate = () => {
      setJournals(StorageService.getJournals());
      setAvailableClasses(StorageService.getClasses());
    };
    setAvailableClasses(StorageService.getClasses());
    window.addEventListener("guru_ai_storage_update", handleUpdate);
    return () => window.removeEventListener("guru_ai_storage_update", handleUpdate);
  }, []);

  // Compute final subject string
  const getComputedSubject = (): string => {
    if (selectedBaseSubject === "Seni dan Budaya") {
      return `Seni dan Budaya (${selectedSeniSub})`;
    }
    if (selectedBaseSubject === "Muatan Lokal") {
      if (selectedMulokSub === "Muatan Lokal lainnya") {
        return `Muatan Lokal (${customMulokName.trim() || "Kustom"})`;
      }
      return `Muatan Lokal (${selectedMulokSub})`;
    }
    if (selectedBaseSubject === "custom") {
      return customSubjectName.trim() || "Mata Pelajaran Khusus";
    }
    return selectedBaseSubject;
  };

  // Voice to text simulation with Web Speech API fallback
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = "id-ID";
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setActivities((prev) => (prev ? prev + " " + transcript : transcript));
            setIsRecording(false);
          };
          recognition.onerror = () => setIsRecording(false);
          recognition.start();
          return;
        } catch (e) {
          console.log(e);
        }
      }

      // Simulation fallback if speech recognition permission isn't granted
      setTimeout(() => {
        setActivities((prev) => (prev ? prev + " Siswa aktif berdiskusi menganalisis hubungan materi dengan kehidupan sehari-hari." : "Siswa aktif berdiskusi menganalisis hubungan materi dengan kehidupan sehari-hari."));
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  // AI Polish: Refines notes into high-standard educational documentation
  const handleAIPolish = async () => {
    setIsRefining(true);
    try {
      const computedSub = getComputedSubject();
      const prompt = `Anda adalah asisten kurikulum cerdas. Rapikan catatan jurnal mengajar guru SD berikut agar berstandar Kurikulum Merdeka dan berorientasi Pembelajaran Mendalam (Deep Learning):
Jenjang / Kelas: ${selectedClass}
Mata Pelajaran: ${computedSub}
Materi Pokok: ${topic}
Aktivitas: ${activities}
Hambatan: ${challenges}
Solusi: ${solutions}
Refleksi Guru: ${reflections}

Susun narasi reflektif yang padat, bermakna, profesional, dan siap dijadikan bahan bukti evaluasi administrasi guru.`;

      const refined = await AIService.chat([{ role: "user", content: prompt }]);
      setReflections((prev) => prev + "\n\n[Rekomendasi Refleksi AI]:\n" + refined);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const finalSubject = getComputedSubject();

    const newJournal: TeachingJournal = {
      id: editingJournalId || `jrn-${Date.now()}`,
      date,
      timeSlot,
      classId: selectedClass,
      subject: finalSubject,
      topic,
      activities,
      challenges,
      solutions,
      reflections,
    };

    StorageService.addJournal(newJournal);
    setSavedSuccess(true);
    setEditingJournalId(null);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleEdit = (journal: TeachingJournal) => {
    setEditingJournalId(journal.id);
    setDate(journal.date || new Date().toISOString().split("T")[0]);
    setTimeSlot(journal.timeSlot || "07:30 - 09:00 (2 JP)");
    setSelectedClass(journal.classId || "Kelas IV – Fase B");
    setTopic(journal.topic || "");
    setActivities(journal.activities || "");
    setChallenges(journal.challenges || "");
    setSolutions(journal.solutions || "");
    setReflections(journal.reflections || "");

    // Parse subject back into base and sub options
    const subj = journal.subject || "";
    if (subj.startsWith("Seni dan Budaya")) {
      setSelectedBaseSubject("Seni dan Budaya");
      for (const sub of SENI_SUB_OPTIONS) {
        if (subj.includes(sub)) {
          setSelectedSeniSub(sub);
          break;
        }
      }
    } else if (subj.startsWith("Muatan Lokal")) {
      setSelectedBaseSubject("Muatan Lokal");
      let matched = false;
      for (const mulok of MULOK_DEFAULT_OPTIONS) {
        if (subj.includes(mulok)) {
          setSelectedMulokSub(mulok);
          matched = true;
          break;
        }
      }
      if (!matched) {
        setSelectedMulokSub("Muatan Lokal lainnya");
        const match = subj.match(/Muatan Lokal \((.*)\)/);
        if (match && match[1]) setCustomMulokName(match[1]);
      }
    } else {
      const isKnown = SD_MAIN_SUBJECTS.some((m) => m.name === subj);
      if (isKnown) {
        setSelectedBaseSubject(subj);
      } else {
        setSelectedBaseSubject("custom");
        setCustomSubjectName(subj);
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan jurnal mengajar ini?")) {
      StorageService.deleteJournal(id);
      if (editingJournalId === id) {
        handleResetForm();
      }
    }
  };

  const handleResetForm = () => {
    setEditingJournalId(null);
    setTopic("");
    setActivities("");
    setChallenges("");
    setSolutions("");
    setReflections("");
  };

  // Filtered Journals for History
  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      (j.topic || "").toLowerCase().includes(searchHistory.toLowerCase()) ||
      (j.subject || "").toLowerCase().includes(searchHistory.toLowerCase()) ||
      (j.activities || "").toLowerCase().includes(searchHistory.toLowerCase());
    const matchesClass = filterClassHistory === "all" || j.classId === filterClassHistory;
    const matchesSubject = filterSubjectHistory === "all" || j.subject.includes(filterSubjectHistory);
    return matchesSearch && matchesClass && matchesSubject;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold tracking-wide uppercase mb-2">
              <BookMarked className="w-3.5 h-3.5 text-blue-600" />
              <span>Administrasi Kurikulum Merdeka SD/MI</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Jurnal Mengajar Harian Guru SD
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
              Catat agenda harian, tujuan pembelajaran, kendala, dan refleksi pedagogis sesuai struktur Kurikulum Merdeka jenjang SD/MI (Kelas I s/d VI, Fase A, B, C) dengan bantuan AI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak / Rekap Jurnal</span>
            </button>
            {editingJournalId && (
              <button
                onClick={handleResetForm}
                className="px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Form Card */}
      <form onSubmit={handleSave} className="glass-card p-6 md:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="font-black text-slate-800 text-sm md:text-base">
              {editingJournalId ? "Mode Edit: Perbarui Jurnal Mengajar" : "Formulir Entri Jurnal Mengajar Guru"}
            </h2>
          </div>
          {editingJournalId && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              Sedang Mengedit ID: {editingJournalId}
            </span>
          )}
        </div>

        {/* 1. SELEKSI KELAS SD/MI (FASE A, B, C) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Pilihan Jenjang & Kelas SD/MI (Kelas 1 s/d 6)
            </label>
            <span className="text-[11px] text-blue-600 font-semibold">Kurikulum Merdeka (Fase A, B, C)</span>
          </div>

          {/* Quick Click Class Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SD_CLASSES.map((cls) => {
              const isSelected = selectedClass === cls.name;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClass(cls.name)}
                  className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-200"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-800"
                    }`}>
                      Fase {cls.fase}
                    </span>
                    <span className={`text-xs font-black ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {cls.romanNumber}
                    </span>
                  </div>
                  <div className="text-xs font-black mt-1.5 truncate">
                    Kelas {cls.romanNumber}
                  </div>
                  <div className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-500"} truncate`}>
                    Fase {cls.fase}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dropdown to pick either standard level or specific rombel */}
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Atau pilih langsung rombel aktif sekolah:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500"
              >
                <optgroup label="Standar Jenjang SD/MI (Fase A, B, C)">
                  {SD_CLASSES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
                {availableClasses.length > 0 && (
                  <optgroup label="Rombongan Belajar Terdaftar">
                    {availableClasses.map((ac) => (
                      <option key={ac.id} value={`${ac.name} (${ac.level ? `Tingkat ${ac.level}` : ""})`}>
                        {ac.name} {ac.homeroomTeacher ? `— Wali: ${ac.homeroomTeacher}` : ""}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* 2. MATA PELAJARAN UTAMA SD */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              1. Mata Pelajaran Utama SD (Kurikulum Merdeka)
            </label>
            <span className="text-[11px] text-slate-400 font-medium">9 Mapel Resmi & Opsi Kustom</span>
          </div>

          {/* Main Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Pilih Mata Pelajaran:
              </label>
              <select
                value={selectedBaseSubject}
                onChange={(e) => setSelectedBaseSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {SD_MAIN_SUBJECTS.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.number}. {item.name}
                  </option>
                ))}
                <option value="custom">+ Masukkan Mata Pelajaran Lainnya (Kustom Guru / Sekolah)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Alokasi Waktu / Jam Ke:
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="Contoh: 07:30 - 09:00 (2 JP)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* SUB-PILIHAN: SENI DAN BUDAYA */}
          {selectedBaseSubject === "Seni dan Budaya" && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <Palette className="w-3.5 h-3.5 text-amber-700" />
                <span>Pilih Cabang Seni dan Budaya:</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Sesuai panduan Kurikulum Merdeka SD, satuan pendidikan menyelenggarakan minimal 1 cabang seni:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {SENI_SUB_OPTIONS.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSeniSub(sub)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                      selectedSeniSub === sub
                        ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                        : "bg-white hover:bg-amber-100 border-amber-200 text-amber-900"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUB-PILIHAN: MUATAN LOKAL */}
          {selectedBaseSubject === "Muatan Lokal" && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pilihan Muatan Lokal Sekolah:</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Pilih Muatan Lokal yang diajarkan di satuan pendidikan atau masukkan materi kustom daerah:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {MULOK_DEFAULT_OPTIONS.map((mulok) => (
                  <button
                    key={mulok}
                    type="button"
                    onClick={() => setSelectedMulokSub(mulok)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                      selectedMulokSub === mulok
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-white hover:bg-emerald-100 border-emerald-200 text-emerald-900"
                    }`}
                  >
                    {mulok}
                  </button>
                ))}
              </div>

              {selectedMulokSub === "Muatan Lokal lainnya" && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Nama Muatan Lokal Kustom:
                  </label>
                  <input
                    type="text"
                    value={customMulokName}
                    onChange={(e) => setCustomMulokName(e.target.value)}
                    placeholder="Contoh: Bahasa Sunda / Aksara Jawa / Budaya Lingkungan Hidup..."
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* INPUT KUSTOM: GURU DAPAT MEMASUKKAN NAMA MATA PELAJARAN SENDIRI */}
          {selectedBaseSubject === "custom" && (
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Input Bebas Nama Mata Pelajaran:</span>
              </div>
              <input
                type="text"
                value={customSubjectName}
                onChange={(e) => setCustomSubjectName(e.target.value)}
                placeholder="Ketik nama mata pelajaran atau muatan khusus (Contoh: Robotika Anak, Tahfidz Al-Qur'an, Pramuka, dll.)"
                className="w-full px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
          )}

          {/* Live Subject Summary Tag */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Mapel Terpilih:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs">
              <BookMarked className="w-3 h-3 text-blue-600" />
              {getComputedSubject()}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">
              {selectedClass}
            </span>
          </div>
        </div>

        {/* 3. TANGGAL & MATERI POKOK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Tanggal Pembelajaran
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Materi Pokok / Tujuan Pembelajaran (TP)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Struktur Anatomi Daun dan Proses Fotosintesis"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* 4. AKTIVITAS DENGAN DIKTE SUARA (VOICE-TO-TEXT) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase text-slate-600">
              Aktivitas Pembelajaran yang Terlaksana
            </label>
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`px-3 py-1 text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
                isRecording
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isRecording ? "Merekam Suara Guru..." : "Dikte Suara (Voice-to-Text)"}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="Deskripsikan langkah-langkah kegiatan belajar siswa (pembuka, inti, penutup, diferensiasi)..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500"
          />
        </div>

        {/* 5. HAMBATAN & SOLUSI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Kendala / Hambatan Belajar Siswa
            </label>
            <textarea
              rows={2}
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Contoh: Beberapa siswa kesulitan memahami konsep dasar atau kekurangan alat..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs text-slate-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Solusi & Rencana Tindak Lanjut
            </label>
            <textarea
              rows={2}
              value={solutions}
              onChange={(e) => setSolutions(e.target.value)}
              placeholder="Contoh: Pendampingan tutor sebaya dan variasi media pembelajaran konkret..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs text-slate-700 focus:bg-white"
            />
          </div>
        </div>

        {/* 6. REFLEKSI GURU & RAPAIKAN DENGAN AI */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase text-slate-600">
              Refleksi Guru & Catatan Pedagogis
            </label>
            <button
              type="button"
              onClick={handleAIPolish}
              disabled={isRefining}
              className="text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isRefining ? "AI Merapikan Refleksi..." : "Rapikan Jurnal dengan AI (Deep Learning)"}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={reflections}
            onChange={(e) => setReflections(e.target.value)}
            placeholder="Tuliskan evaluasi keberhasilan metode pembelajaran, antusiasme siswa, dan hal yang perlu ditingkatkan di pertemuan berikutnya..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-medium text-slate-800 focus:bg-white focus:border-indigo-400"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Catatan Jurnal Mengajar Berhasil Disimpan!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editingJournalId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Batalkan Edit
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingJournalId ? "Simpan Perubahan Jurnal" : "Simpan Entri Jurnal Mengajar"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 7. RIWAYAT JURNAL MENGAJAR TERSIMPAN */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-base text-slate-800">
              Riwayat Jurnal Mengajar Tersimpan ({filteredJournals.length} dari {journals.length})
            </h3>
            <p className="text-xs text-slate-500">
              Arsip digital agenda mengajar guru yang siap disupervisi dan dicetak.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              placeholder="Cari materi, topik, aktivitas..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterClassHistory}
              onChange={(e) => setFilterClassHistory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="all">Semua Kelas</option>
              {SD_CLASSES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filterSubjectHistory}
              onChange={(e) => setFilterSubjectHistory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none max-w-[180px] truncate"
            >
              <option value="all">Semua Mapel</option>
              {SD_MAIN_SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Journal Cards List */}
        {filteredJournals.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-2">
            <BookMarked className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">Tidak ada jurnal mengajar yang sesuai filter</p>
            <p className="text-[11px] text-slate-400">Silakan ubah filter atau tambahkan entri jurnal baru di formulir atas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJournals.map((j) => (
              <div
                key={j.id}
                className="glass-card p-5 rounded-2xl border border-slate-200 space-y-3 hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg">
                      {j.subject}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg">
                      {j.classId}
                    </span>
                    {j.timeSlot && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {j.timeSlot}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {j.date}
                    </span>

                    <button
                      onClick={() => handleEdit(j)}
                      title="Edit Jurnal"
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(j.id, e)}
                      title="Hapus Jurnal"
                      className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-800">{j.topic}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {j.activities}
                  </p>
                </div>

                {(j.challenges || j.solutions) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <strong className="text-slate-700">Kendala:</strong>{" "}
                      <span className="text-slate-600">{j.challenges || "-"}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700">Solusi:</strong>{" "}
                      <span className="text-slate-600">{j.solutions || "-"}</span>
                    </div>
                  </div>
                )}

                {j.reflections && (
                  <div className="text-[11px] text-slate-600 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/50">
                    <strong className="text-blue-950">Refleksi & Evaluasi:</strong>{" "}
                    <span className="whitespace-pre-line">{j.reflections}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. MODAL CETAK / REKAP JURNAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" />
                <h3 className="font-black text-base">Pratinjau Cetak Rekap Jurnal Mengajar Guru</h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-800 text-xs">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h2 className="text-base font-black uppercase tracking-wider">
                  BUKU JURNAL MENGAJAR HARIAN GURU
                </h2>
                <p className="text-xs font-bold text-slate-600">
                  JENJANG SD/MI KURIKULUM MERDEKA
                </p>
                <p className="text-[11px] text-slate-500">
                  Tahun Ajaran 2024/2025 • Dicetak: {new Date().toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-left">
                  <thead>
                    <tr className="bg-slate-100 text-[11px] font-black text-slate-800">
                      <th className="border border-slate-300 p-2 text-center w-8">No</th>
                      <th className="border border-slate-300 p-2 w-20">Tanggal</th>
                      <th className="border border-slate-300 p-2 w-28">Kelas</th>
                      <th className="border border-slate-300 p-2 w-32">Mata Pelajaran</th>
                      <th className="border border-slate-300 p-2">Materi Pokok & Aktivitas</th>
                      <th className="border border-slate-300 p-2 w-48">Refleksi Guru</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJournals.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-300 p-2 whitespace-nowrap">{item.date}</td>
                        <td className="border border-slate-300 p-2 font-bold">{item.classId}</td>
                        <td className="border border-slate-300 p-2 font-bold">{item.subject}</td>
                        <td className="border border-slate-300 p-2 space-y-1">
                          <p className="font-bold text-slate-900">{item.topic}</p>
                          <p className="text-slate-600">{item.activities}</p>
                        </td>
                        <td className="border border-slate-300 p-2 text-[11px] text-slate-600">
                          {item.reflections || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between pt-6 px-4 text-center">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-bold text-slate-800">Kepala Sekolah</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline text-slate-900">Drs. H. Mulyono, M.Pd.</p>
                  <p className="text-slate-500">NIP. 196805121992031004</p>
                </div>
                <div>
                  <p className="text-slate-500">Guru Kelas / Mata Pelajaran,</p>
                  <div className="h-20"></div>
                  <p className="font-bold underline text-slate-900">Budi Santoso, S.Pd., Gr.</p>
                  <p className="text-slate-500">NIP. 198807142014021003</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
