import { CompleteModulePlan, CustomTemplate } from "../types/modulePlan";
import { StorageService } from "./storage";
import { AIModuleGenerator, defaultStylingConfig } from "./aiModuleGenerator";

const STORAGE_KEYS = {
  COMPLETE_MODULES: "guru_ai_complete_modules_v2",
  TEMPLATES: "guru_ai_module_templates_v2",
};

export const ModuleStorageService = {
  getAllModules(): CompleteModulePlan[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMPLETE_MODULES);
      if (!raw) {
        const seeded = ModuleStorageService.createInitialSeed();
        localStorage.setItem(STORAGE_KEYS.COMPLETE_MODULES, JSON.stringify([seeded]));
        return [seeded];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seen = new Set<string>();
        const unique: CompleteModulePlan[] = [];
        for (const m of parsed) {
          if (m && m.id && !seen.has(m.id)) {
            seen.add(m.id);
            unique.push(m);
          }
        }
        if (unique.length === 0) {
          const seeded = ModuleStorageService.createInitialSeed();
          unique.push(seeded);
        }
        if (unique.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEYS.COMPLETE_MODULES, JSON.stringify(unique));
        }
        return unique;
      }
      return [ModuleStorageService.createInitialSeed()];
    } catch {
      return [ModuleStorageService.createInitialSeed()];
    }
  },

  getModuleById(id: string): CompleteModulePlan | null {
    const list = ModuleStorageService.getAllModules();
    return list.find((m) => m.id === id) || null;
  },

  saveModule(plan: CompleteModulePlan): void {
    const list = ModuleStorageService.getAllModules();
    const idx = list.findIndex((m) => m.id === plan.id);
    const updatedPlan = {
      ...plan,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    if (idx >= 0) {
      list[idx] = updatedPlan;
    } else {
      list.unshift(updatedPlan);
    }

    localStorage.setItem(STORAGE_KEYS.COMPLETE_MODULES, JSON.stringify(list));

    // Also sync with legacy modules table in StorageService
    StorageService.addModule({
      id: plan.id,
      title: `${plan.identity.mataPelajaran} - ${plan.identity.materiPokok}`,
      subject: plan.identity.mataPelajaran,
      gradeLevel: plan.identity.kelas,
      topic: plan.identity.materiPokok,
      allocationTime: plan.identity.alokasiWaktu,
      author: plan.identity.namaGuru,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      content: `# ${plan.title}\n\n${plan.modulCore.pemahamanBermakna}\n\n${plan.cp.rumusanCP}`,
    });
  },

  deleteModule(id: string): void {
    const list = ModuleStorageService.getAllModules().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPLETE_MODULES, JSON.stringify(list));
  },

  duplicateModule(id: string, newTitle?: string): CompleteModulePlan | null {
    const original = ModuleStorageService.getModuleById(id);
    if (!original) return null;

    const copy: CompleteModulePlan = JSON.parse(JSON.stringify(original));
    copy.id = `mod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    copy.title = newTitle || `${original.title} (Salinan)`;
    copy.createdAt = new Date().toISOString().split("T")[0];
    copy.updatedAt = copy.createdAt;
    copy.isFavorite = false;

    ModuleStorageService.saveModule(copy);
    return copy;
  },

  toggleFavorite(id: string): boolean {
    const list = ModuleStorageService.getAllModules();
    const mod = list.find((m) => m.id === id);
    if (mod) {
      mod.isFavorite = !mod.isFavorite;
      localStorage.setItem(STORAGE_KEYS.COMPLETE_MODULES, JSON.stringify(list));
      return mod.isFavorite;
    }
    return false;
  },

  // Templates
  getAllTemplates(): CustomTemplate[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!raw) {
        const defaults: CustomTemplate[] = [
          {
            id: "tpl-default-1",
            name: "Format Baku SD Negeri 3 Banjar Ratu",
            description: "Format lengkap resmi Kurikulum Merdeka Fase B (A4, Arial 11pt, Formal Cover, Header KOP Dinas).",
            styling: defaultStylingConfig,
            createdAt: "2024-08-01",
            isDefault: true,
          },
          {
            id: "tpl-deep-learning",
            name: "Format Khusus Pembelajaran Mendalam (Deep Learning)",
            description: "Menekankan 3 pilar: Berkesadaran (Mindful), Bermakna (Meaningful), Menggembirakan (Joyful).",
            styling: {
              ...defaultStylingConfig,
              formatDokumen: "deep-learning",
              gayaDokumen: "Profesional Modern",
            },
            createdAt: "2024-08-10",
            isDefault: false,
          },
          {
            id: "tpl-ringkas",
            name: "Format RPP Ringkas 1-2 Lembar",
            description: "Format hemat kertas untuk supervisi mingguan cepat.",
            styling: {
              ...defaultStylingConfig,
              formatDokumen: "ringkas",
              gayaDokumen: "Minimalis",
              margin: "Sempit",
              coverStyle: "minimalis",
            },
            createdAt: "2024-08-12",
            isDefault: false,
          },
        ];
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveTemplate(tpl: CustomTemplate): void {
    const list = ModuleStorageService.getAllTemplates();
    const idx = list.findIndex((t) => t.id === tpl.id);
    if (idx >= 0) {
      list[idx] = tpl;
    } else {
      list.push(tpl);
    }
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(list));
  },

  deleteTemplate(id: string): void {
    const list = ModuleStorageService.getAllTemplates().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(list));
  },

  createInitialSeed(): CompleteModulePlan {
    const school = StorageService.getSchool();
    const user = StorageService.getUser();

    return {
      id: "mod-seed-01",
      title: "IPAS - Kelas 4 SD - Bagian Tubuh Tumbuhan dan Fungsinya",
      identity: {
        namaSekolah: school.name || "SD Negeri 3 Banjar Ratu",
        npsn: school.npsn || "10803452",
        namaGuru: user.name || "Budi Santoso, S.Pd., Gr.",
        nip: user.nip || "198807142014021003",
        jenjang: "SD/MI",
        kelas: "Kelas 4",
        fase: "B",
        semester: "1 (Ganjil)",
        tahunAjaran: school.academicYear || "2024/2025",
        mataPelajaran: "IPAS (Ilmu Pengetahuan Alam & Sosial)",
        materiPokok: "Bagian Tubuh Tumbuhan dan Fungsinya",
        submateri: "Akar, Batang, Daun, dan Fotosintesis",
        alokasiWaktu: "2 JP (2 x 35 Menit)",
        namaKepsek: school.principal || "Drs. H. Mulyono, M.Pd.",
        nipKepsek: school.nipPrincipal || "196805121992031004",
      },
      karakter: {
        model: "Problem Based Learning (PBL)",
        pendekatan: "Pembelajaran Mendalam (Deep Learning)",
        tingkatKedalaman: "Lengkap",
      },
      styling: defaultStylingConfig,
      cp: {
        rumusanCP:
          "Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh tumbuhan (akar, batang, daun, bunga, dan buah) melalui penyelidikan lingkungan secara kolaboratif, serta menunjukkan rasa ingin tahu dan kepedulian terhadap kelestarian alam sekitar.",
        elemen: "Pemahaman IPAS (Sains dan Sosial)",
        kompetensi: "Menganalisis, Mengamati, dan Menyajikan",
        pengetahuan: "Morfologi tumbuhan, proses fotosintesis, dan transportasi cairan.",
        keterampilan: "Pengamatan langsung menggunakan kaca pembesar, pengisian tabel data, dan presentasi tim.",
        karakter: "Bernalar Kritis, Bergotong Royong, Beriman dan Bertakwa kepada Tuhan YME.",
        analisisTable: [
          {
            no: 1,
            elemen: "Pemahaman IPAS",
            cp: "Peserta didik menganalisis hubungan bagian tubuh tumbuhan dengan fungsinya.",
            kompetensi: "Menganalisis",
            materi: "Bagian Tubuh Tumbuhan (Akar, Batang, Daun)",
            indikator: "Menguraikan fungsi akar dan batang dalam penyerapan serta penyaluran nutrisi.",
          },
          {
            no: 2,
            elemen: "Keterampilan Proses",
            cp: "Mengamati dan mengomunikasikan hasil penyelidikan sederhana.",
            kompetensi: "Menyelidiki",
            materi: "Eksperimen Kapilaritas Pewarna Batang",
            indikator: "Mencatat perubahan warna pada batang tanaman uji di tabel pengamatan LKPD.",
          },
          {
            no: 3,
            elemen: "Profil Pelajar Pancasila",
            cp: "Menjaga lingkungan alam sekolah dengan penuh kesadaran dan gotong royong.",
            kompetensi: "Menginternalisasi Nilai",
            materi: "Peduli Kelestarian Flora Sekolah",
            indikator: "Bekerja sama dalam kelompok dan merawat tanaman di kebun sekolah.",
          },
        ],
      },
      atp: [
        {
          no: 1,
          tujuanPembelajaran: "Mengidentifikasi bagian morfologi tumbuhan (akar, batang, daun) melalui pengamatan nyata.",
          materi: "Anatomi Tumbuhan",
          aktivitas: "Observasi spesimen di kebun sekolah dan tanya jawab pemantik.",
          alokasiWaktu: "15 Menit",
        },
        {
          no: 2,
          tujuanPembelajaran: "Menganalisis fungsi xilem dan stomata pada proses pengangkutan air dan fotosintesis.",
          materi: "Transportasi & Fotosintesis",
          aktivitas: "Diskusi kelompok membedah spesimen seledri berwarna.",
          alokasiWaktu: "35 Menit",
        },
        {
          no: 3,
          tujuanPembelajaran: "Menyajikan laporan diagram LKPD dan merumuskan kesimpulan fungsi tumbuhan bagi manusia.",
          materi: "Pelaporan Ilmiah Sederhana",
          aktivitas: "Gallery Walk dan presentasi 2 menit tiap perwakilan kelompok.",
          alokasiWaktu: "20 Menit",
        },
      ],
      tp: [
        {
          id: "tp-1",
          kode: "TP.1",
          deskripsi: "Melalui observasi spesimen tumbuhan nyata, peserta didik dapat menyebutkan 5 bagian utama tumbuhan dengan tepat.",
          kko: "Menyebutkan / Mengidentifikasi",
          levelKognitif: "C1 - C2",
        },
        {
          id: "tp-2",
          kode: "TP.2",
          deskripsi: "Melalui eksperimen perendaman batang berwarna, peserta didik mampu menguraikan cara kerja pembuluh xilem secara logis.",
          kko: "Menganalisis / Menguraikan",
          levelKognitif: "C4 (HOTS)",
        },
        {
          id: "tp-3",
          kode: "TP.3",
          deskripsi: "Melalui pembuatan diagram LKPD, peserta didik dapat menyimpulkan peranan fotosintesis bagi suplai oksigen bumi dengan percaya diri.",
          kko: "Menyimpulkan / Mengomunikasikan",
          levelKognitif: "C5 - C6",
        },
      ],
      modulCore: {
        kompetensiAwal: "Peserta didik telah mengenal nama-nama pohon dan tanaman yang biasa dijumpai di pekarangan rumah.",
        profilPelajarPancasila: [
          "Beriman & Bertakwa kepada Tuhan YME (Mensyukuri keanekaragaman flora nusantara)",
          "Bernalar Kritis (Menganalisis hubungan sebab-akibat air dan fotosintesis)",
          "Bergotong Royong (Bekerja sama menyelesaikan tantangan kelompok LKPD)",
          "Kreatif (Mendesain peta konsep visual anatomi tumbuhan)",
        ],
        saranaPrasarana: "Tanaman cabai/seledri asli berakar, kaca pembesar, air pewarna makanan, proyektor, LKPD cetak.",
        targetPesertaDidik: "Peserta didik reguler Fase B Kelas IV (Tipikal gaya belajar visual, auditori, dan kinestetik).",
        modelPembelajaran: "Problem Based Learning (PBL)",
        metode: "Pengamatan Terbimbing, Demonstrasi Konkret, Eksperimen Kelompok, Gallery Walk, Refleksi 3-2-1.",
        pendekatan: "Pembelajaran Mendalam (Deep Learning) terpadu Saintifik dan Kontekstual.",
        pemahamanBermakna: "Tumbuhan adalah produsen utama oksigen dan pangan bumi. Mengetahui cara kerja tubuh tumbuhan mengajarkan kita pentingnya merawat kelestarian tanah dan air.",
        pertanyaanPemantik: [
          "Mengapa pohon beringin yang sangat tinggi tidak layu meskipun pucuk daunnya terkena terik matahari seharian?",
          "Bagaimana air dari dalam tanah bisa berjalan melawan gravitasi naik hingga ke pucuk ranting tertinggi?",
          "Apa yang akan terjadi pada manusia dan hewan jika semua tanaman hijau di dunia berhenti memasak makanan?",
        ],
        persiapanPembelajaran: [
          "Guru menyiapkan spesimen tanaman seledri yang telah direndam cairan merah semalaman.",
          "Mencetak lembar LKPD berwarna untuk 6 kelompok kerja siswa.",
          "Menyiapkan papan pajang hasil karya Gallery Walk di dinding kelas.",
        ],
      },
      kegiatan: {
        pendahuluan: {
          salamDoa: "Guru menyapa siswa dengan senyum hangat, mengajak ketua kelas memimpin doa pembuka dan menyanyikan yel-yel sains.",
          presensiApersepsi: "Mengecek presensi siswa, lalu memperlihatkan batang seledri merah misterius sebagai stimulus rasa ingin tahu.",
          motivasiTujuan: "Menyampaikan misi hari ini: 'Menjadi Detektif Sains Penjelajah Tubuh Tumbuhan' serta membacakan kesepakatan belajar.",
          alokasiWaktu: "10 Menit",
        },
        inti: [
          {
            fase: "Fase 1: Orientasi Siswa pada Masalah Nyata (Mindful / Berkesadaran)",
            aktivitas: [
              "Siswa diajak hening sejenak mengamati tanaman di pot kelas.",
              "Guru melemparkan pertanyaan pemantik: 'Mengapa pohon tidak tumbang saat diterpa angin kencang?'",
              "Siswa menuliskan dugaan sementara (hipotesis) di kertas sticky note.",
            ],
            alokasiWaktu: "10 Menit",
            deepLearningCatatan: "Melatih kesadaran penuh dan fokus pengamatan terhadap detail biologis.",
          },
          {
            fase: "Fase 2: Mengorganisasi Peserta Didik untuk Belajar",
            aktivitas: [
              "Siswa berkumpul dalam kelompok beranggotakan 4-5 orang heterogen.",
              "Setiap kelompok mengambil kaca pembesar dan spesimen tanaman berakar utuh.",
              "Membagi tugas: Juru Ukur, Pengamat Daun, Pencatat Tabel, dan Presenter Tim.",
            ],
            alokasiWaktu: "10 Menit",
            deepLearningCatatan: "Menanamkan nilai gotong royong dan kepemimpinan bersama.",
          },
          {
            fase: "Fase 3: Membimbing Penyelidikan Mandiri & Kelompok (Meaningful / Bermakna)",
            aktivitas: [
              "Siswa meneliti perbedaan bentuk akar serabut vs akar tunggang menggunakan kaca pembesar.",
              "Memotong melintang batang seledri berwarna dan mengamati titik pembuluh xilem yang menyerap warna.",
              "Mencatat seluruh penemuan pada tabel pengamatan LKPD secara jujur dan faktual.",
            ],
            alokasiWaktu: "15 Menit",
            deepLearningCatatan: "Menghubungkan fakta fisik spesimen dengan teori transportasi nutrisi.",
          },
          {
            fase: "Fase 4: Mengembangkan & Menyajikan Hasil Karya (Joyful / Menggembirakan)",
            aktivitas: [
              "Kelompok menempelkan potongan gambar anatomi tumbuhan pada lembar LKPD dan memberi label warna.",
              "Siswa melaksanakan 'Gallery Walk' berputar searah jarum jam untuk melihat LKPD kelompok lain.",
              "Setiap siswa berhak menempelkan 1 stiker bintang jempol pada karya terfavorit.",
            ],
            alokasiWaktu: "10 Menit",
            deepLearningCatatan: "Menggembirakan: Memberikan ruang apresiasi, tepukan, dan rasa bangga atas hasil karya.",
          },
          {
            fase: "Fase 5: Menganalisis & Mengevaluasi Proses Pemecahan Masalah",
            aktivitas: [
              "Guru mengonfirmasi konsep ilmiah: akar menyerap, batang menyalurkan, daun memasak energi.",
              "Meluruskan miskonsepsi (misalnya daun bernapas hanya di malam hari).",
            ],
            alokasiWaktu: "5 Menit",
          },
        ],
        penutup: {
          kesimpulan: "Guru bersama seluruh siswa meneriakkan rangkuman 3 fungsi vital tumbuhan dengan tepukan ritmis.",
          refleksi: "Siswa mengisi kartu refleksi diri 3-2-1 tentang hal yang paling membahagiakan hari ini.",
          evaluasiTindakLanjut: "Pemberian kuis kilat 3 soal formatif dan pesan moral untuk menyiram tanaman sekolah setiap pagi.",
          alokasiWaktu: "10 Menit",
        },
      },
      deepLearning: {
        berkesadaran: "Siswa belajar memusatkan perhatian pada objek nyata, menyadari keteraturan ciptaan Tuhan melalui pembuluh renik tanaman.",
        bermakna: "Konsep akar dan tanah dikaitkan langsung dengan fungsi mencegah banjir dan longsor di wilayah perkebunan Way Pengubuan Lampung Tengah.",
        menggembirakan: "Pembelajaran sarat gerak aktif (hands-on), eksperimen warna yang memukau anak SD, dan parade pameran karya bintang.",
        aspekOlah: {
          olahPikir: "Menganalisis hasil pembelahan batang seledri dan membedakan jenis perakaran.",
          olahHati: "Rasa syukur dan komitmen tidak memetik dedaunan sembarangan.",
          olahRasa: "Menghias LKPD dengan estetika warna yang rapi dan memuji karya sahabat sebangku.",
          olahRaga: "Aktivitas aktif berdiri, mengamati di luar kelas, dan bergerak saat Gallery Walk.",
        },
      },
      diferensiasi: {
        konten: "Menyediakan poster visual 3D bagi anak visual, spesimen konkret bagi anak kinestetik, dan podcast kisah pohon bagi anak auditori.",
        proses: "Guru memberikan pendampingan intensif bagi kelompok yang masih kesulitan menggunakan kaca pembesar.",
        produk: "Siswa bebas memilih bentuk laporan akhir: diagram visual, tabel komparasi, atau rekaman lisan juru bicara kelompok.",
        analisisKesiapan: "Hasil kuis awal menunjukkan 4 siswa telah mahir, 18 siswa berkembang, dan 4 siswa butuh pendampingan konsep dasar.",
        analisisMinat: "Konteks disesuaikan dengan tanaman pertanian lokal seperti pohon kelapa sawit, jagung, dan singkong.",
        analisisProfilBelajar: "Memberikan ruang seimbang antara instruksi audio, lembar kerja visual, dan manipulasi fisik objek.",
      },
      bahanAjar: {
        judul: "BAHAN AJAR SISWA: KEHEBATAN PABRIK AJAIB TUMBUHAN HIJAU",
        tujuan: "Membantu siswa kelas IV memahami struktur dan fungsi bagian tumbuhan secara menyenangkan.",
        pengantar: "Tahukah kamu bahwa sebatang pohon kecil di depan kelasmu bekerja seperti pabrik raksasa yang tidak pernah berhenti memasak makanan?",
        konsepUtama: "1. Akar: Si Jangkar Penopang & Penyerap\n2. Batang: Jalan Tol Penyalur Air\n3. Daun: Dapur Koki Fotosintesis\n4. Bunga & Buah: Penerus Generasi",
        penjelasanMateri: "Akar berada di dalam tanah bertugas menyerap air dan garam mineral, sekaligus mencengkeram tanah agar pohon tidak roboh. Batang memiliki pipa kapiler bernama xilem yang mengalirkan air menuju daun. Di daun, terdapat zat hijau klorofil yang memasak air dan karbondioksida dibantu sinar matahari menjadi glukosa dan oksigen bersih.",
        contohAplikasi: "Saat kita minum es kelapa muda, air dan daging buah kelapa yang manis itu adalah hasil makanan yang dimasak oleh daun pohon kelapa!",
        aktivitasSiswa: "Periksa tanaman hias di rumahmu, apakah akarnya berjenis tunggang (seperti pohon mangga) atau serabut (seperti rumput)?",
        faktaMenarik: "Satu pohon dewasa yang rindang mampu menghasilkan oksigen bersih yang cukup untuk bernapas 4 orang manusia dewasa setiap harinya!",
        rangkuman: "• Bagian tubuh tumbuhan terdiri dari akar, batang, daun, bunga, buah, dan biji.\n• Semua bagian bekerja sama saling melengkapi.\n• Fotosintesis adalah proses tumbuhan memasak makanan yang menghasilkan oksigen untuk kehidupan bumi.",
        pertanyaanPemahaman: [
          "Apa fungsi utama akar bagi berdirinya tumbuhan?",
          "Pipa apakah yang membawa air dari akar menuju daun?",
          "Gas apakah yang dikeluarkan tumbuhan saat siang hari yang sangat berguna bagi kita?",
        ],
      },
      lkpd: {
        judul: "LEMBAR KERJA PESERTA DIDIK (LKPD) – MISI DETEKTIF TUMBUHAN",
        tujuan: "Menyelidiki bentuk morfologi dan membuktikan fungsi bagian tubuh tumbuhan melalui pengamatan nyata.",
        alatBahan: [
          "1 Batang seledri yang direndam air pewarna merah",
          "1 Tanaman rumput liar berakar lengkap",
          "Kaca pembesar (lup) dan penggaris",
          "Pensil warna dan lembar LKPD",
        ],
        petunjuk: [
          "Bekerjalah bersama 4 teman sekelompokmu dengan rukun.",
          "Gunakan kaca pembesar dengan hati-hati saat mengamati akar.",
          "Tuliskan hasil temuan aslimu pada tabel di bawah ini.",
        ],
        langkahKegiatan: [
          "Amati bagian akar rumput liar, hitung cabang-cabangnya.",
          "Irislah batang seledri merah, lihat titik-titik pembuluh yang menyerap warna.",
          "Diskusikan pertanyaan dan rumuskan kesimpulan kelompok.",
        ],
        tabelPengamatan: {
          headers: ["No", "Bagian Tumbuhan", "Ciri-Ciri Fisik Teramati", "Fungsi Utama", "Kondisi"],
          rows: [
            ["1", "Akar", "Bercabang banyak, ada serabut halus di tanah", "Menyerap air & penopang kokoh", "Sehat"],
            ["2", "Batang", "Tegak, memiliki pembuluh titik-titik merah", "Menghantarkan air menuju daun", "Segar"],
            ["3", "Daun", "Tipis, berwarna hijau dengan tulang menyirip", "Dapur fotosintesis pembuat oksigen", "Utuh"],
          ],
        },
        pertanyaanDiskusi: [
          "Mengapa bagian dalam batang seledri berubah warna menjadi merah setelah direndam air pewarna?",
          "Apa yang terjadi jika semua daun pada tanaman rontok karena hama?",
          "Tuliskan 1 pesan ajakan kelompokmu untuk menyayangi tanaman di sekolah!",
        ],
        kesimpulan: "Akar, batang, dan daun tumbuhan bekerja secara harmonis menyerap, menyalurkan, dan mengolah nutrisi agar tumbuhan tetap hidup subur dan menghasilkan udara segar bagi bumi.",
        refleksiSiswa: "Bagian eksperimen mana yang paling membuat kelompokmu kagum hari ini? (Tuliskan alasanmu secara singkat).",
      },
      asesmen: {
        diagnostik: {
          kognitif: "Tanya jawab lisan: Menyebutkan bagian tanaman yang dimakan pada wortel, bayam, dan tebu.",
          nonKognitif: "Pilihan emoji kesiapan belajar (Penuh semangat / Mengantuk / Butuh dorongan).",
          teknik: "Tanya jawab klasikal dan observasi ekspresi wajah.",
        },
        formatif: {
          teknik: "Penilaian Unjuk Kerja Pengamatan (Performance Assessment) & Kelengkapan LKPD.",
          instrumen: "Lembar Observasi Kolaborasi Kelompok dan Rubrik Skala 1 - 4.",
          rubrikSingkat: "Dinilai dari ketelitian data, kerja sama gotong royong, dan kejelasan presentasi.",
        },
        sumatif: {
          teknik: "Tes Tertulis Akhir Materi (Pilihan Ganda HOTS, Isian, dan Uraian).",
          bentuk: "10 Butir Soal Terstandar berbobot 100 poin.",
          keterangan: "Dilengkapi kisi-kisi dan kunci jawaban penskoran objektif.",
        },
      },
      kisiKisi: [
        { no: 1, cp: "Menganalisis bagian tubuh tumbuhan", materi: "Morfologi Tumbuhan", indikator: "Menentukan fungsi utama akar serabut dan tunggang", levelKognitif: "C2 (Memahami)", bentukSoal: "Pilihan Ganda", noSoal: 1 },
        { no: 2, cp: "Menganalisis transportasi nutrisi", materi: "Jaringan Pengangkut", indikator: "Menganalisis hasil eksperimen kapilaritas pembuluh xilem", levelKognitif: "C4 (Menganalisis / HOTS)", bentukSoal: "Pilihan Ganda", noSoal: 2 },
        { no: 3, cp: "Menjelaskan proses fotosintesis", materi: "Fotosintesis", indikator: "Menyebutkan zat hasil sampingan fotosintesis yang dihirup manusia", levelKognitif: "C1 (Mengingat)", bentukSoal: "Isian Singkat", noSoal: 3 },
        { no: 4, cp: "Menganalisis peran ekosistem flora", materi: "Konservasi Lingkungan", indikator: "Menguraikan hubungan akar pohon terhadap pencegahan erosi", levelKognitif: "C5 (Evaluasi / HOTS)", bentukSoal: "Uraian Kontekstual", noSoal: 4 },
      ],
      bankSoal: [
        {
          id: "q-seed-1",
          no: 1,
          tipe: "PG",
          levelKognitif: "C2",
          stimulus: "Pak Ahmad menanam pohon pepaya di kebun belakang sekolah SD Negeri 3 Banjar Ratu. Setelah diguyur hujan lebat, pohon tetap berdiri kokoh dan tidak roboh.",
          pertanyaan: "Bagian tubuh tumbuhan manakah yang berfungsi mencengkeram tanah dengan kuat sehingga pohon pepaya tersebut tidak roboh?",
          pilihanJawaban: ["A. Buah pepaya", "B. Akar pohon", "C. Helai daun", "D. Bunga jantan"],
          kunciJawaban: "B",
          pembahasan: "Akar berfungsi sebagai jangkar utama yang menembus tanah untuk menahan berat batang dan daun.",
          skorMaks: 2,
        },
        {
          id: "q-seed-2",
          no: 2,
          tipe: "PG",
          levelKognitif: "C4",
          stimulus: "Siti meletakkan sebatang tanaman sawi putih ke dalam botol berisi air sirup berwarna ungu. Dua jam kemudian, tulang-tulang daun sawi tampak berwarna ungu kemerahan.",
          pertanyaan: "Berdasarkan percobaan ilmiah tersebut, kesimpulan paling tepat mengenai fungsi batang tanaman adalah ....",
          pilihanJawaban: [
            "A. Mengubah warna air menjadi sari makanan",
            "B. Menyalurkan cairan dan nutrisi dari bawah menuju ke seluruh helai daun",
            "C. Mengeluarkan udara kotor dari dalam tumbuhan",
            "D. Menyimpan cadangan glukosa untuk musim kemarau",
          ],
          kunciJawaban: "B",
          pembahasan: "Percobaan kapilaritas membuktikan fungsi berkas pembuluh xilem di batang yang mengangkut cairan ke pucuk daun.",
          skorMaks: 3,
        },
        {
          id: "q-seed-3",
          no: 3,
          tipe: "Isian",
          levelKognitif: "C1",
          pertanyaan: "Zat hijau pada daun yang bertugas menyerap cahaya matahari saat proses fotosintesis disebut ....",
          kunciJawaban: "Klorofil",
          pembahasan: "Klorofil adalah pigmen alami hijau yang menyerap spektrum cahaya untuk reaksi fotosintesis.",
          skorMaks: 2,
        },
        {
          id: "q-seed-4",
          no: 4,
          tipe: "Uraian",
          levelKognitif: "C5",
          stimulus: "Di lereng perkebunan sawit dekat desa, tanah sering longsor saat musim hujan bila pepohonan besarnya ditebangi secara sembarangan.",
          pertanyaan: "Uraikan hubungan ilmiah antara perakaran tanaman dengan pencegahan bencana tanah longsor berdasarkan apa yang kamu pelajari hari ini!",
          kunciJawaban: "Akar tanaman berfungsi seperti jaring raksasa alami yang mengikat dan mencengkeram butiran tanah agar tidak mudah hanyut oleh derasnya air hujan. Selain itu, akar menyerap kelebihan air tanah sehingga tanah tidak menjadi bubur lumpur yang memicu longsor.",
          pembahasan: "Mengaitkan konsep anatomi akar dengan pemecahan masalah geologis nyata di lingkungan desa.",
          skorMaks: 5,
        },
      ],
      rubrik: [
        {
          aspek: "Akurasi Penjelasan Konsep Sains",
          skor4: "Menguraikan seluruh 5 bagian tumbuhan dan fungsinya secara sempurna, logis, dan menyertakan analogi nyata.",
          skor3: "Menjelaskan 4 bagian tumbuhan dengan benar dan sedikit membutuhkan konfirmasi guru.",
          skor2: "Menjelaskan 2-3 bagian namun terdapat kekeliruan pada fungsi xilem/daun.",
          skor1: "Belum mampu membedakan bagian akar dan batang tanpa bimbingan langsung.",
        },
        {
          aspek: "Keterampilan Observasi & Pengisian LKPD",
          skor4: "Data tabel pengamatan sangat teliti, rapi, terisi lengkap, dan kesimpulan dirumuskan dengan bahasa sendiri yang jelas.",
          skor3: "Tabel pengamatan terisi lengkap dan rapi dengan kesimpulan yang cukup memadai.",
          skor2: "Tabel pengamatan belum lengkap atau terdapat kolom yang terlewat.",
          skor1: "Pengamatan tidak sistematis dan lembar kerja banyak coretan tidak rapi.",
        },
        {
          aspek: "Kerja Sama Tim (Gotong Royong)",
          skor4: "Semua anggota aktif berbagi peran, saling membantu saat teman kesulitan, dan menghargai ide berbeda.",
          skor3: "Sebagian besar anggota aktif dan mampu menjaga ketertiban kelompok.",
          skor2: "Hanya ketua kelompok yang bekerja, anggota lain pasif mengobrol.",
          skor1: "Terjadi perdebatan yang mengganggu jalannya praktikum.",
        },
        {
          aspek: "Penyampaian Hasil & Gallery Walk",
          skor4: "Mempresentasikan temuan dengan suara lantang, percaya diri, kontak mata hangat, dan ramah menerima masukan.",
          skor3: "Penyampaian jelas dan lancar walau masih membaca lembar kerja.",
          skor2: "Penyampaian terbata-bata dan bersuara lirih.",
          skor1: "Malu atau menolak maju saat giliran presentasi.",
        },
      ],
      refleksi: {
        pesertaDidik: {
          apaYangDipelajari: "Saya belajar bahwa batang memiliki pipa air kecil bernama xilem dan daun adalah koki yang membuat oksigen untuk manusia.",
          apaYangPalingDisukai: "Saat melihat batang seledri berubah merah dan melihat akar rumput dengan kaca pembesar!",
          apaYangBelumDipahami: "Bagaimana cara daun menangkap udara kotor yang tidak terlihat mata.",
          apaYangInginDipelajariSelanjutnya: "Ingin membuat percobaan menanam kacang hijau di dalam kapas basah dan mengukur tingginya tiap hari.",
        },
        guru: {
          keberhasilan: "90% siswa tuntas mencapai KKTP (skor ≥ 75). Penggunaan spesimen konkret seledri merah sangat efektif menghilangkan kejenuhan belajar.",
          kendala: "Dua kelompok sempat menumpahkan sedikit air pewarna di meja praktikum.",
          responsPesertaDidik: "Siswa sangat antusias, saling berebut ingin mengamati lewat kaca pembesar.",
          perbaikan: "Menyediakan alas plastik tebal di setiap meja kelompok pada eksperimen berikutnya.",
          tindakLanjut: "Memberikan tantangan proyek mini 'Dokter Tanaman' bagi 4 siswa yang telah selesai lebih awal.",
        },
      },
      remedialPengayaan: {
        remedial: {
          sasaran: "Peserta didik yang memperoleh nilai formatif di bawah 75 (Perlu Pendampingan).",
          bentukKegiatan: "Bimbingan perorangan santai menggunakan kartu bergambar (Flashcard Morfologi) dan pengamatan ulang tanaman pot kelas.",
          materiUlang: "Fungsi dasar akar dan batang dengan analogi sedotan minuman.",
          waktuDanTempat: "20 Menit saat jam istirahat atau jam literasi pagi di Pojok Baca Kelas 4A.",
        },
        pengayaan: {
          sasaran: "Peserta didik yang telah mencapai nilai 85 ke atas (Sangat Baik).",
          bentukKegiatan: "Tantangan Detektif Ekologi: Mengamati tumbuhan parasit (seperti benalu) dan menganalisis mengapa benalu merugikan pohon inangnya.",
          materiPengayaan: "Adaptasi tumbuhan xerofit (kaktus) dan hidrofit (teratai).",
          tugasTantangan: "Membuat 1 lembar komik mini cerita tentang 'Petualangan Butir Air Menuju Pucuk Daun Kelapa'.",
        },
      },
      qcResult: {
        isValid: true,
        checks: [
          { id: "qc-1", criterion: "1. Capaian Pembelajaran Sesuai Fase", status: "pass", details: "Rumusan CP Fase B IPAS terstandar Kemdikbud.", autoFixAvailable: true },
          { id: "qc-2", criterion: "2. ATP Berasal dari CP", status: "pass", details: "ATP tersusun bertahap dari morfologi ke fotosintesis.", autoFixAvailable: true },
          { id: "qc-3", criterion: "3. TP Terukur dengan KKO", status: "pass", details: "Memakai KKO C1, C4, dan C5 terukur.", autoFixAvailable: true },
          { id: "qc-4", criterion: "4. Kegiatan Inti Sintaks PBL", status: "pass", details: "Lengkap 5 fase orientasi masalah hingga evaluasi.", autoFixAvailable: true },
          { id: "qc-5", criterion: "5. LKPD Sesuai Aktivitas", status: "pass", details: "Tabel pengamatan seledri dan rumput terintegrasi penuh.", autoFixAvailable: true },
          { id: "qc-6", criterion: "6. Asesmen Mengukur TP", status: "pass", details: "Instrumen observasi dan kuis sumatif selaras tujuan.", autoFixAvailable: true },
          { id: "qc-7", criterion: "7. Soal HOTS & Stimulus", status: "pass", details: "Soal nomor 2 dan 4 berbasis stimulus kontekstual desa.", autoFixAvailable: true },
          { id: "qc-8", criterion: "8. Alokasi Waktu Realistis", status: "pass", details: "Total 70 menit terdistribusi presisi (10-50-10).", autoFixAvailable: true },
          { id: "qc-9", criterion: "9. Bahasa Ramah Usia SD", status: "pass", details: "Instruksi humanis dan menyenangkan bagi anak kelas IV.", autoFixAvailable: false },
          { id: "qc-10", criterion: "10. Fasilitas Realistis", status: "pass", details: "Memakai bahan pekarangan sekolah tanpa biaya mahal.", autoFixAvailable: false },
        ],
        lastChecked: "10:30:00",
      },
      status: "selesai",
      isFavorite: true,
      createdAt: "2024-08-20",
      updatedAt: "2024-09-02",
    };
  },
};
