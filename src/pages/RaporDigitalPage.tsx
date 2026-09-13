import { useState, useEffect } from "react";
import {
  FileBadge,
  Printer,
  Download,
  CheckCircle2,
  School,
  UserCheck,
  CalendarCheck,
  Award,
} from "lucide-react";
import { StorageService } from "../services/storage";
import { ExportService } from "../services/pdf";
import { Student, SchoolProfile, GradeRecord } from "../types";

export const RaporDigitalPage = () => {
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [school, setSchool] = useState<SchoolProfile>(StorageService.getSchool());
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [grades, setGrades] = useState<GradeRecord[]>(StorageService.getGrades());

  useEffect(() => {
    const list = StorageService.getStudents();
    setStudents(list);
    setSchool(StorageService.getSchool());
    setGrades(StorageService.getGrades());
    if (list.length > 0 && !selectedStudentId) {
      setSelectedStudentId(list[0].id);
    }
  }, []);

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  const subjects = [
    { code: "PAB", name: "Pendidikan Agama dan Budi Pekerti", score: 88, predicate: "B", desc: "Menunjukkan penguasaan yang sangat baik dalam memahami makna rukun iman dan mempraktikkan doa harian." },
    { code: "PPN", name: "Pendidikan Pancasila", score: 86, predicate: "B", desc: "Mampu menjelaskan makna sila-sila Pancasila dan menerapkannya dalam musyawarah kelas." },
    { code: "BIN", name: "Bahasa Indonesia", score: 92, predicate: "A", desc: "Sangat terampil dalam menyusun paragraf deskripsi dan mempresentasikan ide pokok secara runtut." },
    { code: "MAT", name: "Matematika", score: 85, predicate: "B", desc: "Cakap dalam menyelesaikan operasi pecahan senilai dan pemecahan masalah perkalian kontekstual." },
    { code: "IPA", name: "Ilmu Pengetahuan Alam dan Sosial (IPAS)", score: 90, predicate: "A", desc: "Sangat mahir menganalisis morfologi bagian tumbuhan serta proses fotosintesis dengan diagram terstruktur." },
    { code: "SNB", name: "Seni Rupa", score: 87, predicate: "B", desc: "Menunjukkan kreativitas yang tinggi dalam memadukan warna komplementer pada karya kolase bahan alam." },
    { code: "PJK", name: "Pendidikan Jasmani, Olahraga, dan Kesehatan", score: 84, predicate: "B", desc: "Menguasai variasi pola gerak dasar lokomotor dan manipulatif dalam permainan bola kecil." },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!student) return;
    const content = `
RAPOR PESERTA DIDIK
SEKOLAH DASAR NEGERI 3 BANJAR RATU
Nama Siswa: ${student.name}
NISN / NIS: ${student.nisn} / ${student.nis}
Kelas / Semester: 4A / 1 (Ganjil)
Tahun Pelajaran: 2024/2025

HASIL PENCAPAIAN KOMPETENSI BELAJAR:
${subjects.map((s, idx) => `${idx + 1}. ${s.name}: Nilai ${s.score} (${s.predicate})\nDeskripsi: ${s.desc}`).join("\n\n")}

REKAPITULASI PRESENSI:
Sakit: 1 Hari
Izin: 0 Hari
Tanpa Keterangan: 0 Hari

CATATAN WALI KELAS:
Ananda ${student.name} memiliki motivasi belajar yang tinggi, santun dalam bertutur kata, dan aktif berkolaborasi. Pertahankan prestasimu di semester berikutnya!
    `;
    ExportService.exportTextPDF(`Rapor_${student.name.replace(/\s+/g, "_")}`, content, `Rapor_${student.name.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold tracking-wide uppercase mb-2">
            <FileBadge className="w-3.5 h-3.5 text-blue-600" />
            <span>Laporan Hasil Belajar Kurikulum Merdeka</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Rapor Digital & Cetak Massal Siswa
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Format resmi Kemdikbudristek dengan deskripsi capaian pembelajaran otomatis, absensi, dan validasi tanda tangan digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rapor</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Student Selector Tab Bar */}
      <div className="glass-card p-3 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2 no-print">
        <span className="text-xs font-bold text-slate-500 px-2">Pilih Siswa:</span>
        {students.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStudentId(s.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              student?.id === s.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Report Card Sheet Paper Design */}
      {student && (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-300 shadow-xl space-y-6 text-slate-800 print:shadow-none print:border-none print:p-0">
          {/* School Header KOP */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h3 className="font-extrabold text-sm md:text-base uppercase tracking-wider text-slate-700">
              Pemerintah Kabupaten Lampung Tengah • Dinas Pendidikan
            </h3>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">
              SD NEGERI 3 BANJAR RATU
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Alamat: Jl. Raya Lintas Sumatra No. 45, Desa Banjar Ratu, Kec. Way Pengubuan • NPSN: 10801234
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-base font-black uppercase tracking-widest text-blue-900 underline underline-offset-4">
              Laporan Hasil Belajar (Rapor Siswa)
            </h3>
          </div>

          {/* Student Identitas Table */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <p><span className="font-semibold text-slate-500 w-32 inline-block">Nama Peserta Didik:</span> <strong>{student.name}</strong></p>
              <p><span className="font-semibold text-slate-500 w-32 inline-block">NISN / NIS:</span> <strong>{student.nisn} / {student.nis}</strong></p>
              <p><span className="font-semibold text-slate-500 w-32 inline-block">Sekolah:</span> SD Negeri 3 Banjar Ratu</p>
            </div>
            <div className="space-y-1">
              <p><span className="font-semibold text-slate-500 w-32 inline-block">Kelas / Rombel:</span> <strong>Kelas 4A (Fase B)</strong></p>
              <p><span className="font-semibold text-slate-500 w-32 inline-block">Semester / T.P.:</span> 1 (Ganjil) / 2024-2025</p>
              <p><span className="font-semibold text-slate-500 w-32 inline-block">Fase:</span> Fase B (Kelas 3 - 4 SD)</p>
            </div>
          </div>

          {/* Academic Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-300 p-2.5 text-center w-10">No</th>
                  <th className="border border-slate-300 p-2.5 w-60">Mata Pelajaran</th>
                  <th className="border border-slate-300 p-2.5 text-center w-16">Nilai</th>
                  <th className="border border-slate-300 p-2.5 text-center w-16">Predikat</th>
                  <th className="border border-slate-300 p-2.5">Capaian Kompetensi Pembelajaran</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub, idx) => (
                  <tr key={sub.code}>
                    <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 font-bold">{sub.name}</td>
                    <td className="border border-slate-300 p-2 text-center font-black">{sub.score}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold">{sub.predicate}</td>
                    <td className="border border-slate-300 p-2 text-[11px] leading-snug text-slate-700">{sub.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extracurricular & Attendance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Ekstrakurikuler */}
            <div className="border border-slate-300 rounded-xl p-3">
              <h4 className="font-bold text-slate-800 mb-2">Ekstrakurikuler</h4>
              <p><strong>Pramuka Siaga:</strong> Aktif, rajin, dan menguasai kode kehormatan Dwisatya (Predikat A)</p>
              <p className="mt-1"><strong>Seni Tari Tradisional:</strong> Menguasai gerak dasar tari Cangget Lampung (Predikat B)</p>
            </div>

            {/* Rekap Absensi */}
            <div className="border border-slate-300 rounded-xl p-3">
              <h4 className="font-bold text-slate-800 mb-2">Ketidakhadiran</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500">Sakit</span>
                  <p className="font-bold text-slate-800">1 Hari</p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500">Izin</span>
                  <p className="font-bold text-slate-800">0 Hari</p>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500">Alpa</span>
                  <p className="font-bold text-slate-800">0 Hari</p>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Wali Kelas */}
          <div className="border border-slate-300 rounded-xl p-4 text-xs bg-slate-50/60">
            <h4 className="font-bold text-slate-800 mb-1">Catatan Wali Kelas:</h4>
            <p className="italic text-slate-700 leading-relaxed">
              &quot;Ananda {student.name} memiliki semangat belajar yang luar biasa dan berakhlak mulia. Terus tingkatkan kemampuan penalaran logis dan jadilah teladan bagi teman-temanmu.&quot;
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-3 gap-4 text-xs text-center">
            <div>
              <p>Mengetahui,</p>
              <p>Orang Tua / Wali Siswa</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-slate-300 text-[11px]">(Tanda Tangan)</span>
              </div>
              <p className="font-bold underline">{student.fatherName !== "-" ? student.fatherName : "Orang Tua Siswa"}</p>
            </div>

            <div>
              <p>Mengetahui,</p>
              <p>Kepala Sekolah</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-emerald-700 font-serif font-bold text-xs">Verified Digital</span>
              </div>
              <p className="font-bold underline">Drs. H. Mulyono, M.Pd.</p>
              <p className="text-[10px] text-slate-500">NIP. 196805121992031004</p>
            </div>

            <div>
              <p>Banjar Ratu, 21 Desember 2024</p>
              <p>Wali Kelas 4A</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-blue-700 font-serif font-bold text-xs">Verified Digital</span>
              </div>
              <p className="font-bold underline">Budi Santoso, S.Pd., Gr.</p>
              <p className="text-[10px] text-slate-500">NIP. 198807142014021003</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
