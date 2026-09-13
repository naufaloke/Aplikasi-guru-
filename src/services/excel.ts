import * as XLSX from "xlsx";
import { Student, ImportPreviewRow, AttendanceRecord, GradeRecord } from "../types";
import { StorageService } from "./storage";

export const ExcelService = {
  // 1. Download Master Template Excel
  downloadStudentTemplate: () => {
    const headers = [
      "No",
      "NISN",
      "NIS",
      "Nama",
      "JK",
      "Tempat Lahir",
      "Tanggal Lahir",
      "Agama",
      "Alamat",
      "Nama Ayah",
      "Nama Ibu",
      "HP Ortu",
      "Kelas",
    ];

    const sampleRows = [
      [
        1,
        "0123456789",
        "21401",
        "Andi Saputra",
        "L",
        "Lampung Tengah",
        "2014-05-14",
        "Islam",
        "Dusun 2 RT 04, Desa Banjar Ratu",
        "Supriyanto",
        "Siti Maryam",
        "081273849102",
        "Kelas 4A",
      ],
      [
        2,
        "0123456790",
        "21402",
        "Siti Nurhaliza",
        "P",
        "Bandar Lampung",
        "2014-08-20",
        "Islam",
        "Jl. Melati No. 12, Banjar Ratu",
        "Hendra Gunawan",
        "Nurul Aini",
        "085289123456",
        "Kelas 4A",
      ],
      [
        3,
        "0123456791",
        "21403",
        "Bima Pratama",
        "L",
        "Metro",
        "2014-03-11",
        "Islam",
        "Desa Way Kenanga RT 01",
        "Bambang Irawan",
        "Dewi Astuti",
        "082198765432",
        "Kelas 4A",
      ],
    ];

    const wsData = [headers, ...sampleRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto column widths
    ws["!cols"] = [
      { wch: 5 },
      { wch: 14 },
      { wch: 10 },
      { wch: 24 },
      { wch: 6 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
      { wch: 12 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Siswa");
    XLSX.writeFile(wb, "TEMPLATE_IMPORT_SISWA_GURU_AI.xlsx");
  },

  // 2. Parse Excel/CSV File with Auto-Mapping & Validation
  parseStudentExcel: async (file: File): Promise<{ rows: ImportPreviewRow[]; rawColumns: string[]; mappedColumns: Record<string, string> }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1, defval: "" });

          if (!jsonData || jsonData.length < 2) {
            throw new Error("File kosong atau tidak memiliki baris data setelah header.");
          }

          const rawHeaderRow = jsonData[0] as string[];
          const rawColumns = rawHeaderRow.map((c) => String(c).trim());

          // AI / Heuristic Auto-Column Mapping
          const mappedColumns: Record<string, string> = {};
          rawColumns.forEach((col, idx) => {
            const clean = col.toLowerCase().replace(/[^a-z0-9]/g, "");
            if (clean.includes("nisn")) mappedColumns.nisn = col;
            else if (clean === "nis" || clean.includes("induk")) mappedColumns.nis = col;
            else if (clean.includes("nama") && !clean.includes("ayah") && !clean.includes("ibu") && !clean.includes("ortu")) mappedColumns.name = col;
            else if (clean === "jk" || clean.includes("kelamin") || clean === "lp" || clean.includes("gender")) mappedColumns.gender = col;
            else if (clean.includes("tempat") || clean.includes("pob")) mappedColumns.pob = col;
            else if (clean.includes("tanggal") || clean.includes("dob") || clean.includes("lahir")) mappedColumns.dob = col;
            else if (clean.includes("agama")) mappedColumns.religion = col;
            else if (clean.includes("alamat")) mappedColumns.address = col;
            else if (clean.includes("ayah")) mappedColumns.fatherName = col;
            else if (clean.includes("ibu")) mappedColumns.motherName = col;
            else if (clean.includes("hp") || clean.includes("telp") || clean.includes("telepon") || clean.includes("wa")) mappedColumns.parentPhone = col;
            else if (clean.includes("kelas") || clean.includes("rombel")) mappedColumns.classId = col;
          });

          const existingStudents = StorageService.getStudents();
          const previewRows: ImportPreviewRow[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const rowArr = jsonData[i] as any[];
            if (!rowArr || rowArr.length === 0 || rowArr.every((cell) => cell === "" || cell === null)) {
              continue; // skip completely empty rows
            }

            // Extract values using mapped column indices or positional fallback
            const getValue = (key: string, fallbackIdx?: number): string => {
              const colName = mappedColumns[key];
              if (colName) {
                const colIdx = rawColumns.indexOf(colName);
                if (colIdx >= 0 && rowArr[colIdx] !== undefined) {
                  return String(rowArr[colIdx]).trim();
                }
              }
              if (fallbackIdx !== undefined && rowArr[fallbackIdx] !== undefined) {
                return String(rowArr[fallbackIdx]).trim();
              }
              return "";
            };

            const nisn = getValue("nisn", 1);
            const nis = getValue("nis", 2);
            const name = getValue("name", 3);
            let gender = getValue("gender", 4).toUpperCase();
            if (gender.startsWith("L") || gender.includes("LAKI")) gender = "L";
            else if (gender.startsWith("P") || gender.includes("PEREMPUAN") || gender.includes("WANITA")) gender = "P";
            else gender = "L";

            const pob = getValue("pob", 5) || "Lampung Tengah";
            let dob = getValue("dob", 6) || "2014-01-01";
            // Normalise date if Excel serial number or slash format
            if (!isNaN(Number(dob)) && Number(dob) > 30000) {
              const parsedDate = new Date((Number(dob) - 25569) * 86400 * 1000);
              dob = parsedDate.toISOString().split("T")[0];
            } else if (dob.includes("/")) {
              const parts = dob.split("/");
              if (parts.length === 3) {
                dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
              }
            }

            const religion = getValue("religion", 7) || "Islam";
            const address = getValue("address", 8) || "Desa Banjar Ratu";
            const fatherName = getValue("fatherName", 9) || "-";
            const motherName = getValue("motherName", 10) || "-";
            const parentPhone = getValue("parentPhone", 11) || "081234567890";
            let classId = getValue("classId", 12) || "Kelas 4A";
            // Map friendly class text to classId
            if (classId.toLowerCase().includes("4a") || classId === "4A") classId = "cls-4a";
            else if (classId.toLowerCase().includes("4b") || classId === "4B") classId = "cls-4b";
            else if (classId.toLowerCase().includes("1")) classId = "cls-1a";
            else if (classId.toLowerCase().includes("2")) classId = "cls-2a";
            else if (classId.toLowerCase().includes("3")) classId = "cls-3a";
            else if (classId.toLowerCase().includes("5")) classId = "cls-5a";
            else if (classId.toLowerCase().includes("6")) classId = "cls-6a";
            else classId = "cls-4a";

            // Validations
            const errorMessages: string[] = [];
            if (!name) errorMessages.push("Nama siswa wajib diisi.");
            if (!nisn) {
              errorMessages.push("NISN wajib diisi.");
            } else if (!/^\d{10}$/.test(nisn)) {
              errorMessages.push("NISN harus 10 digit angka.");
            }

            // Duplicate detection
            let isDuplicate = false;
            let duplicateReason = "";
            const dupNISN = existingStudents.find((s) => s.nisn === nisn);
            const dupNIS = nis ? existingStudents.find((s) => s.nis === nis) : null;
            const dupNameDOB = existingStudents.find(
              (s) => s.name.toLowerCase() === name.toLowerCase() && s.dob === dob
            );

            if (dupNISN) {
              isDuplicate = true;
              duplicateReason = `NISN ${nisn} sudah terdaftar atas nama ${dupNISN.name}`;
            } else if (dupNIS) {
              isDuplicate = true;
              duplicateReason = `NIS ${nis} sudah terdaftar atas nama ${dupNIS.name}`;
            } else if (dupNameDOB) {
              isDuplicate = true;
              duplicateReason = `Nama & Tanggal Lahir sama dengan siswa: ${dupNameDOB.name}`;
            }

            let status: ImportPreviewRow["status"] = "Valid";
            if (errorMessages.length > 0) status = "Error";
            else if (isDuplicate) status = "Duplikat";

            previewRows.push({
              rowNumber: i,
              nisn,
              nis,
              name,
              gender: gender as "L" | "P",
              pob,
              dob,
              religion,
              address,
              fatherName,
              motherName,
              parentPhone,
              classId,
              status,
              errorMessages,
              duplicateReason,
            });
          }

          resolve({ rows: previewRows, rawColumns, mappedColumns });
        } catch (err: any) {
          reject(new Error(err?.message || "Gagal memproses file Excel"));
        }
      };

      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsArrayBuffer(file);
    });
  },

  // 3. Export Students to Excel
  exportStudentsExcel: (students: Student[], filename = "DAFTAR_SISWA_SD_NEGERI_3_BANJAR_RATU.xlsx") => {
    const data = students.map((s, idx) => ({
      No: idx + 1,
      NISN: s.nisn,
      NIS: s.nis,
      "Nama Siswa": s.name,
      "Jenis Kelamin": s.gender === "L" ? "Laki-laki" : "Perempuan",
      "Tempat Lahir": s.pob,
      "Tanggal Lahir": s.dob,
      Agama: s.religion,
      Alamat: s.address,
      "Nama Ayah": s.fatherName,
      "Nama Ibu": s.motherName,
      "No HP Ortu": s.parentPhone,
      Kelas: s.classId.toUpperCase(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");
    XLSX.writeFile(wb, filename);
  },

  // 4. Export Attendance Recap
  exportAttendanceExcel: (attendance: AttendanceRecord[], students: Student[], date: string, filename = `REKAP_ABSENSI_${date}.xlsx`) => {
    const data = students.map((s, idx) => {
      const rec = attendance.find((a) => a.studentId === s.id && a.date === date);
      return {
        No: idx + 1,
        NISN: s.nisn,
        "Nama Siswa": s.name,
        Kelas: s.classId.toUpperCase(),
        Tanggal: date,
        Status: rec?.status || "Belum Absen",
        Jam: rec?.timestamp || "-",
        Keterangan: rec?.notes || "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Absensi");
    XLSX.writeFile(wb, filename);
  },

  // 5. Export Grades
  exportGradesExcel: (grades: GradeRecord[], students: Student[], subject: string, filename = `DAFTAR_NILAI_${subject}.xlsx`) => {
    const data = students.map((s, idx) => {
      const g = grades.find((grd) => grd.studentId === s.id && grd.subject === subject);
      return {
        No: idx + 1,
        NISN: s.nisn,
        "Nama Siswa": s.name,
        Mapel: subject,
        Tugas: g?.tugas ?? 0,
        PH: g?.ph ?? 0,
        PTS: g?.pts ?? 0,
        PAS: g?.pas ?? 0,
        "Nilai Akhir": g?.finalScore ?? 0,
        Predikat: g?.predicate || "-",
        Deskripsi: g?.description || "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Nilai ${subject}`);
    XLSX.writeFile(wb, filename);
  },
};
