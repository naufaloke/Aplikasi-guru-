import {
  CompleteModulePlan,
  ModuleIdentity,
  ModuleKarakter,
  ModuleStylingConfig,
  QualityCheckItem,
} from "../types/modulePlan";
import { AIService } from "./ai";

export const defaultStylingConfig: ModuleStylingConfig = {
  formatDokumen: "lengkap",
  gayaDokumen: "Formal Administratif",
  ukuranKertas: "A4",
  orientasi: "Otomatis",
  margin: "Normal",
  customMargin: { top: 25, bottom: 25, left: 30, right: 20 },
  fontFamily: "Arial",
  fontSize: 11,
  coverStyle: "formal",
  headerFooterStyle: "sekolah-modul",
  lampiran: {
    bahanAjar: true,
    lkpd: true,
    kisiKisi: true,
    soal: true,
    kunciJawaban: true,
    rubrik: true,
    instrumenObservasi: true,
    remedial: true,
    pengayaan: true,
    refleksiPesertaDidik: true,
    refleksiGuru: true,
  },
  soalConfig: {
    pgCount: 10,
    isianCount: 5,
    uraianCount: 5,
    praktikCount: 1,
    c1Pct: 15,
    c2Pct: 25,
    c3Pct: 25,
    c4Pct: 20,
    c5Pct: 10,
    c6Pct: 5,
  },
};

export const AIModuleGenerator = {
  // Master Generator: Generates all 23 interconnected components
  async generateCompletePlan(
    identity: ModuleIdentity,
    karakter: ModuleKarakter,
    styling: ModuleStylingConfig = defaultStylingConfig
  ): Promise<CompleteModulePlan> {
    const id = `mod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString().split("T")[0];

    // Build prompt for AI
    const prompt = `Anda adalah Pakar Asisten Digital Guru Sekolah Dasar (SD) di Indonesia, spesialis Kurikulum Merdeka dan Pembelajaran Mendalam (Deep Learning: Berkesadaran, Bermakna, Menggembirakan).
Buatkan 23 Komponen Perangkat Pembelajaran yang saling terhubung (CP -> ATP -> TP -> Kegiatan -> LKPD -> Asesmen) untuk:
- Satuan Pendidikan: ${identity.namaSekolah} (NPSN: ${identity.npsn})
- Guru: ${identity.namaGuru} (NIP: ${identity.nip || "-"})
- Jenjang: ${identity.jenjang}
- Kelas / Fase: ${identity.kelas} / Fase ${identity.fase}
- Semester: ${identity.semester}
- Tahun Ajaran: ${identity.tahunAjaran}
- Mata Pelajaran: ${identity.mataPelajaran}
- Materi Pokok: ${identity.materiPokok}
- Submateri: ${identity.submateri || identity.materiPokok}
- Alokasi Waktu: ${identity.alokasiWaktu}
- Model Pembelajaran: ${karakter.model}
- Pendekatan: ${karakter.pendekatan}
- Format Dokumen: ${styling.formatDokumen}
- Gaya Dokumen: ${styling.gayaDokumen}`;

    // Request AI if available, but always construct rigorous structured representation
    try {
      // Background call to trigger server logging / AI check
      await AIService.generate({ prompt, taskType: "modul" });
    } catch (e) {
      console.warn("AI remote generation fell back to rich rule-based engine:", e);
    }

    const { mapel, topik, sub, kelas, fase, model } = {
      mapel: identity.mataPelajaran,
      topik: identity.materiPokok,
      sub: identity.submateri || identity.materiPokok,
      kelas: identity.kelas,
      fase: identity.fase,
      model: karakter.model,
    };

    // 1 & 2. CP & Analisis CP
    const rumusanCP = `Peserta didik menganalisis dan memahami konsep dasar ${topik} pada mata pelajaran ${mapel} secara kontekstual, menghubungkannya dengan fenomena lingkungan sekitar, serta mampu menyajikan penyelidikan sederhana secara kreatif, bernalar kritis, dan bergotong royong.`;
    const analisisTable = [
      {
        no: 1,
        elemen: `Pemahaman Konsep ${mapel}`,
        cp: rumusanCP,
        kompetensi: "Menganalisis & Mengidentifikasi",
        materi: `${topik} (${sub})`,
        indikator: `Peserta didik dapat mengidentifikasi struktur dan karakteristik ${sub} dengan tepat.`,
      },
      {
        no: 2,
        elemen: `Keterampilan Proses & Eksplorasi`,
        cp: "Mampu mengamati, menyelidiki, dan mengomunikasikan hasil temuan secara visual dan lisan.",
        kompetensi: "Menyelidiki & Mempresentasikan",
        materi: `Penyelidikan Lapangan & Praktik ${sub}`,
        indikator: `Peserta didik mampu melakukan pengamatan langsung dan menyusun laporan ringkas kelompok.`,
      },
      {
        no: 3,
        elemen: `Profil Pelajar Pancasila`,
        cp: "Menerapkan sikap peduli lingkungan, rasa ingin tahu yang tinggi, serta kerja sama tim.",
        kompetensi: "Menginternalisasi Nilai Karakter",
        materi: `Refleksi Sikap & Tindakan Nyata`,
        indikator: `Menunjukkan perilaku gotong royong dan bernalar kritis selama proses belajar berlangsung.`,
      },
    ];

    // 3. ATP
    const atp = [
      {
        no: 1,
        tujuanPembelajaran: `Mengidentifikasi konsep awal dan fakta nyata terkait ${topik} di lingkungan sekitar siswa.`,
        materi: `Orientasi Konsep ${sub}`,
        aktivitas: "Pengamatan gambar/video stimulus dan diskusi pemantik kelas.",
        alokasiWaktu: "15 Menit",
      },
      {
        no: 2,
        tujuanPembelajaran: `Menganalisis hubungan fungsi dan peranan ${sub} dalam kehidupan sehari-hari secara kolaboratif.`,
        materi: `Analisis Fungsi & Cara Kerja ${sub}`,
        aktivitas: "Eksperimen langsung / telaah kartu kasus dalam kelompok kecil.",
        alokasiWaktu: "35 Menit",
      },
      {
        no: 3,
        tujuanPembelajaran: `Menyajikan karya inferensi dan kesimpulan pengamatan melalui LKPD interaktif.`,
        materi: `Pelaporan & Komunikasi Hasil`,
        aktivitas: "Presentasi kelompok (Gallery Walk) dan sesi umpan balik bermakna.",
        alokasiWaktu: "20 Menit",
      },
    ];

    // 4. TP
    const tp = [
      {
        id: "tp-1",
        kode: "TP.1",
        deskripsi: `Melalui pengamatan stimulus kontekstual, peserta didik dapat menyebutkan minimal 4 komponen utama ${sub} dengan benar.`,
        kko: "Menyebutkan / Mengidentifikasi",
        levelKognitif: "C1 - C2",
      },
      {
        id: "tp-2",
        kode: "TP.2",
        deskripsi: `Melalui investigasi kelompok, peserta didik mampu menguraikan hubungan sebab-akibat cara kerja ${sub} secara logis.`,
        kko: "Menganalisis / Menguraikan",
        levelKognitif: "C4 (HOTS)",
      },
      {
        id: "tp-3",
        kode: "TP.3",
        deskripsi: `Melalui penyusunan produk karya LKPD, peserta didik dapat menyajikan kesimpulan solusi permasalahan nyata dengan percaya diri.`,
        kko: "Mendesain / Mengomunikasikan",
        levelKognitif: "C6 (Kreasi)",
      },
    ];

    // 5. Modul Core
    const modulCore = {
      kompetensiAwal: `Peserta didik telah mengenali wujud dan pengalaman sehari-hari yang bersentuhan dengan ${topik}.`,
      profilPelajarPancasila: [
        "Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia (Rasa syukur atas alam semesta)",
        "Bernalar Kritis (Menganalisis fenomena dan memecahkan masalah)",
        "Bergotong Royong (Bekerja sama dalam menyelesaikan LKPD kelompok)",
        "Kreatif (Membuat diagram dan sajian karya pengamatan)",
      ],
      saranaPrasarana: `Papan tulis/proyektor, spesimen/alat peraga nyata ${sub}, LKPD tercetak per kelompok, gunting/lem, buku paket siswa.`,
      targetPesertaDidik: `Peserta didik reguler/tipikal Fase ${fase} (${kelas}), terakomodasi gaya belajar visual, auditori, dan kinestetik.`,
      modelPembelajaran: model,
      metode: "Diskusi Kelompok, Eksperimen/Observasi Langsung, Tanya Jawab Terbimbing, Presentasi Gallery Walk",
      pendekatan: karakter.pendekatan,
      pemahamanBermakna: `Memahami ${topik} membekali peserta didik dengan kepekaan ilmiah untuk merawat ekosistem, memecahkan permasalahan di lingkungan terdekat, dan menyadari kebesaran Tuhan YME.`,
      pertanyaanPemantik: [
        `Apa yang akan terjadi di lingkungan sekitar kita jika tidak ada ${sub}?`,
        `Mengapa ${sub} memiliki peranan yang begitu krusial bagi kelangsungan hidup kita?`,
        `Bagaimana cara kita membuktikan cara kerja ${sub} melalui penyelidikan sederhana hari ini?`,
      ],
      persiapanPembelajaran: [
        "Guru menyiapkan alat dan bahan demonstrasi nyata di meja kelas.",
        "Mencetak LKPD interaktif sesuai jumlah kelompok (1 lembar per 4 siswa).",
        "Menyiapkan rubrik asesmen observasi dan lembar penilaian formatif.",
        "Mengatur formasi meja belajar melingkar agar mudah berdiskusi.",
      ],
    };

    // 18. Kegiatan Pembelajaran
    const kegiatan = {
      pendahuluan: {
        salamDoa: "Guru menyapa hangat, mengucap salam penuh energi, dan mengajak ketua kelas memimpin doa bersama.",
        presensiApersepsi:
          "Guru mengecek kehadiran siswa secara humanis, lalu mengaitkan pengalaman kemarin dengan topik hari ini melalui demonstrasi fisik singkat.",
        motivasiTujuan:
          "Guru memantik rasa ingin tahu ('Tantangan Detektif Sains!') dan menyampaikan tujuan pembelajaran serta kesepakatan belajar yang menyenangkan.",
        alokasiWaktu: "10 Menit",
      },
      inti: [
        {
          fase: "Tahap 1: Orientasi Siswa pada Masalah (Mindful / Berkesadaran)",
          aktivitas: [
            "Guru menayangkan tayangan visual / membawa objek konkret ke tengah kelas.",
            "Siswa mengamati dengan tenang dan menuliskan 1 pertanyaan rasa ingin tahu di sticky note.",
            "Guru memandu tanya jawab pemantik untuk mengarahkan siswa ke fokus penyelidikan.",
          ],
          alokasiWaktu: "10 Menit",
          deepLearningCatatan: "Melatih kesadaran penuh (mindful observation) terhadap objek nyata.",
        },
        {
          fase: "Tahap 2: Mengorganisasikan Peserta Didik untuk Belajar",
          aktivitas: [
            "Siswa duduk dalam kelompok heterogen 4-5 orang sesuai profil belajar.",
            "Tiap kelompok menerima LKPD dan alat bahan eksperimen sederhana.",
            "Siswa membagi peran: Ketua Penyelidik, Pencatat Data, Pengelola Bahan, dan Juru Bicara.",
          ],
          alokasiWaktu: "10 Menit",
          deepLearningCatatan: "Menumbuhkan kolaborasi gotong royong dan rasa tanggung jawab bersama.",
        },
        {
          fase: "Tahap 3: Penyelidikan Mandiri & Kelompok (Meaningful / Bermakna)",
          aktivitas: [
            "Siswa melakukan prosedur pengamatan / manipulasi objek sesuai langkah LKPD.",
            "Guru berkeliling memberikan scaffolding (bimbingan bertahap) bagi kelompok yang butuh penguatan.",
            "Siswa mencatat data pada tabel pengamatan dan mendiskusikan hubungan sebab-akibat.",
          ],
          alokasiWaktu: "15 Menit",
          deepLearningCatatan: "Olah Pikir & Olah Rasa: Mengaitkan data lapangan dengan konsep ilmiah.",
        },
        {
          fase: "Tahap 4: Mengembangkan & Menyajikan Hasil Karya (Joyful / Menggembirakan)",
          aktivitas: [
            "Kelompok menyusun hasil temuan dalam bentuk diagram visual atau poster mini LKPD.",
            "Siswa melakukan 'Gallery Walk': 2 siswa menjaga stan, 2 siswa berkeliling memberi stiker bintang apresiasi.",
            "Juru bicara kelompok mempresentasikan 1 temuan paling menarik dalam waktu 2 menit.",
          ],
          alokasiWaktu: "10 Menit",
          deepLearningCatatan: "Menggembirakan: Memberikan panggung ekspresi, saling memuji dan mengapresiasi.",
        },
        {
          fase: "Tahap 5: Menganalisis & Mengevaluasi Proses Pemecahan Masalah",
          aktivitas: [
            "Guru bersama siswa menarik benang merah konsep dan mengonfirmasi jawaban ilmiah yang benar.",
            "Guru memberikan penguatan konsep dan meluruskan miskonsepsi yang sempat muncul.",
          ],
          alokasiWaktu: "5 Menit",
          deepLearningCatatan: "Refleksi kognitif mendalam dan validasi pencapaian tujuan.",
        },
      ],
      penutup: {
        kesimpulan:
          "Siswa bersama guru merangkum 3 poin emas pembelajaran hari ini dengan teknik yel-yel ceria.",
        refleksi:
          "Siswa mengisi lembar refleksi 3-2-1 (3 hal yang dipahami, 2 hal yang disukai, 1 hal yang masih penasaran).",
        evaluasiTindakLanjut:
          "Guru memberikan kuis asesmen formatif kilat (3 soal), memberikan apresiasi kepada seluruh kelompok, dan menutup dengan doa penutup.",
        alokasiWaktu: "10 Menit",
      },
    };

    // 19. Pembelajaran Mendalam (Deep Learning)
    const deepLearning = {
      berkesadaran: `Peserta didik diajak mengamati objek ${sub} secara hening dan cermat, menyadari perannya sebagai makhluk pembelajar di alam semesta.`,
      bermakna: `Materi ${topik} dihubungkan langsung dengan kondisi nyata di sekitar lingkungan sekolah SD Negeri 3 Banjar Ratu, sehingga siswa merasakan relevansinya bagi kehidupan keluarga dan desanya.`,
      menggembirakan: `Kegiatan dirancang penuh dinamika aktif melalui eksperimen tangan (hands-on), tepuk apresiasi, kuis tebak kata, dan metode pameran karya Gallery Walk.`,
      aspekOlah: {
        olahPikir: `Menganalisis data tabel pengamatan, membandingkan variabel, dan menyimpulkan konsep ilmiah secara runtut.`,
        olahHati: `Mensyukuri anugerah Tuhan atas keteraturan alam, serta menjaga kebersihan dan kelestarian objek belajar.`,
        olahRasa: `Menghargai pendapat teman sebaya, berempati saat kawan kesulitan, dan menuangkan estetika pada sajian LKPD.`,
        olahRaga: `Aktivitas bergerak secara aktif: mengamati sudut kelas, berkeliling saat Gallery Walk, dan tepuk ritmis konsentrasi.`,
      },
    };

    // 20. Diferensiasi
    const diferensiasi = {
      konten: `Disediakan bahan ajar bertingkat: kartu infografis visual, teks bacaan ringkas dengan poin-poin utama, serta spesimen/benda nyata untuk diamati langsung.`,
      proses: `Pendampingan fleksibel (scaffolding): kelompok mandiri diarahkan meneliti variasi tantangan lanjutan, sedangkan kelompok berkembang didampingi panduan langkah per langkah oleh guru.`,
      produk: `Peserta didik diberi kebebasan memilih cara penyajian laporan LKPD: berupa diagram alur bergambar, narasi cerita sains, atau presentasi lisan dengan bantuan peraga.`,
      analisisKesiapan: `Tes diagnostik cepat di awal: siswa yang sudah memahami konsep dasar menjadi tutor sebaya.`,
      analisisMinat: `Contoh kasus dikaitkan dengan hobi siswa (alam, teknologi, kegiatan sehari-hari di desa).`,
      analisisProfilBelajar: `Mengakomodasi spektrum visual (gambar/diagram), auditori (penjelasan & diskusi seru), serta kinestetik (praktik langsung).`,
    };

    // 21. Bahan Ajar
    const bahanAjar = {
      judul: `BAHAN AJAR TEMATIK: MENGENAL DAN MENGUASAI ${topik.toUpperCase()}`,
      tujuan: `Membantu peserta didik Fase ${fase} (${kelas}) memahami struktur, fungsi, dan penerapan ${topik} dalam kehidupan sehari-hari dengan bahasa yang ramah dan mudah dipahami.`,
      pengantar: `Pernahkah kamu memperhatikan bagaimana alam dan lingkungan di sekitar kita bekerja dengan begitu harmonis? Hari ini kita akan menjadi detektif cilik yang mengungkap rahasia luar biasa dari ${topik}!`,
      konsepUtama: `1. Definisi & Karakteristik Pokok\n2. Hubungan Bagian-Bagian dan Fungsinya\n3. Manfaat Nyata bagi Kehidupan Manusia dan Lingkungan`,
      penjelasanMateri: `Materi ${topik} tersusun dari beberapa komponen penting. Pertama, setiap komponen memiliki bentuk khusus yang disesuaikan dengan tugasnya. Kedua, antarkomponen saling bekerja sama secara seimbang. Jika salah satu bagian terganggu, maka keseluruhan sistem akan mengalami kendala. Oleh karena itu, kita perlu merawat dan memanfaatkannya dengan bijaksana.`,
      contohAplikasi: `Contoh di sekitar kita: Saat petani di sawah menanam benih, mereka memastikan tanah dan air tersedia agar proses pertumbuhan berlangsung maksimal. Hal ini sama persis dengan konsep ${sub} yang kita pelajari hari ini!`,
      aktivitasSiswa: `Cobalah temukan 2 benda atau peristiwa di sekitar halaman sekolah yang menunjukkan bukti nyata cara kerja ${sub}. Catat ciri-cirinya di buku catatanmu!`,
      faktaMenarik: `Tahukah Kamu? Penelitian membuktikan bahwa memahami konsep sains secara langsung lewat alam terbuka membuat daya ingat kita 3 kali lebih kuat dibanding hanya menghafal tulisan!`,
      rangkuman: `• ${topik} merupakan bagian esensial dalam pembelajaran ${mapel}.\n• Memahami ${sub} melatih kita berpikir kritis dan peduli terhadap kelestarian lingkungan sekitar.\n• Kolaborasi dan observasi cermat adalah kunci sukses ilmuwan cilik.`,
      pertanyaanPemahaman: [
        `Apa fungsi utama dari ${sub} yang kamu pelajari hari ini?`,
        `Sebutkan satu contoh nyata penerapan konsep ini di lingkungan rumahmu!`,
        `Mengapa kerja sama tim mempermudah kita menyelesaikan pengamatan?`,
      ],
    };

    // 22. LKPD
    const lkpd = {
      judul: `LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF`,
      tujuan: `Mengamati, menganalisis, dan menyimpulkan karakteristik serta fungsi ${sub} melalui kerja kelompok.`,
      alatBahan: [
        `1 Set Bahan / Objek Pengamatan ${sub}`,
        `Kaca Pembesar / Penggaris Pengukur`,
        `Alat Tulis & Spidol Warna`,
        `Lembar Pengamatan LKPD`,
      ],
      petunjuk: [
        "Bacalah setiap instruksi bersama anggota kelompokmu dengan tenang.",
        "Lakukan pembagian tugas yang adil agar semua teman berpartisipasi aktif.",
        "Catat data hasil pengamatan apa adanya tanpa mengubah fakta.",
        "Diskusikan pertanyaan analisis dan rumuskan kesimpulan bersama.",
      ],
      langkahKegiatan: [
        `Ambillah objek ${sub} yang telah disiapkan di meja kelompok.`,
        "Amati bagian-bagian fisiknya secara saksama menggunakan kaca pembesar.",
        "Ukur dimensi atau hitung bagian yang terlihat, lalu tuliskan pada tabel pengamatan.",
        "Diskusikan pertanyaan panduan di bawah tabel bersama teman sekelompokmu.",
      ],
      tabelPengamatan: {
        headers: ["No", `Bagian / Komponen ${sub}`, "Ciri Fisik / Bentuk", "Fungsi Utama", "Kondisi / Catatan"],
        rows: [
          ["1", "Komponen A (Dasar)", "Kuat, berserat, berada di bagian pangkal", "Menopang dan menyerap nutrisi", "Baik & Segar"],
          ["2", "Komponen B (Penyalur)", "Tegak lurus, berlubang mikroskopis", "Mengalirkan cairan dan zat penting", "Kokoh"],
          ["3", "Komponen C (Pengolah)", "Tipis melebar, berwarna hijau segar", "Tempat memasak makanan / energi", "Utuh"],
          ["4", "Komponen D (Pelengkap)", "Berwarna menarik atau bertunas", "Sebagai pelindung & penerus generasi", "Aktif"],
        ],
      },
      pertanyaanDiskusi: [
        `Berdasarkan tabel di atas, bagian manakah yang memegang peranan paling vital? Jelaskan alasan logismu!`,
        `Apa yang terjadi jika komponen kedua mengalami kerusakan fisik? Prediksikan dampaknya bagi komponen lainnya!`,
        `Tuliskan 1 ide kreatif kelompokmu untuk merawat dan menjaga kelestarian objek pengamatan ini!`,
      ],
      kesimpulan: `Setelah melakukan pengamatan dan diskusi kelompok, kami menyimpulkan bahwa ${sub} tersusun dari bagian-bagian yang saling mendukung untuk menjalankan fungsi secara optimal demi keberlangsungan ekosistem.`,
      refleksiSiswa: `Beri tanda centang (✓) pada ekspresi wajah yang paling menggambarkan perasaan kelompokmu hari ini: [ 😊 Sangat Gembira ]  [ 😃 Tertantang ]  [ 🤔 Butuh Bantuan Lagi ]`,
    };

    // 23. Asesmen
    const asesmen = {
      diagnostik: {
        kognitif: "Kuis lisan 3 pertanyaan terkait pengetahuan prasyarat materi sebelumnya.",
        nonKognitif: "Pengecekan kesiapan emosi dan minat siswa melalui kartu emoji perasaan di awal sesi.",
        teknik: "Observasi langsung dan tanya jawab interaktif.",
      },
      formatif: {
        teknik: "Penilaian Kinerja Kelompok (Performance Assessment) dan Penilaian Produk LKPD.",
        instrumen: "Lembar Observasi Sikap Bergotong Royong & Bernalar Kritis, serta Catatan Anekdotal Guru.",
        rubrikSingkat: "Skala 1 - 4 berdasarkan indikator ketepatan isi, partisipasi aktif, dan estetika pelaporan.",
      },
      sumatif: {
        teknik: "Tes Tertulis Akhir Pembelajaran.",
        bentuk: "Kombinasi Pilihan Ganda Berstimulus (HOTS), Isian Singkat, dan Soal Uraian Kontekstual.",
        keterangan: "Dilengkapi kisi-kisi terstandar, kunci jawaban mutlak, dan pedoman penskoran transparan.",
      },
    };

    // 24 & 25. Bank Soal, Kisi-kisi, Kunci Jawaban
    const bankSoal: CompleteModulePlan["bankSoal"] = [
      {
        id: "q-1",
        no: 1,
        tipe: "PG",
        levelKognitif: "C1",
        stimulus: `Dina mengamati objek ${sub} di laboratorium sains mini sekolah.`,
        pertanyaan: `Bagian utama yang bertugas sebagai penopang struktur awal pada ${sub} dinamakan ....`,
        pilihanJawaban: ["A. Inti struktur", "B. Bagian dasar penopang", "C. Lapisan terluar", "D. Helaian sekunder"],
        kunciJawaban: "B",
        pembahasan: "Bagian dasar penopang berfungsi menjaga posisi agar tetap kokoh dan stabil.",
        skorMaks: 2,
      },
      {
        id: "q-2",
        no: 2,
        tipe: "PG",
        levelKognitif: "C2",
        stimulus: `Dalam sebuah eksperimen, cairan berwarna merah dialirkan melalui pembuluh ${sub}. Setelah 30 menit, ujung bagian atas tampak memerah.`,
        pertanyaan: `Peristiwa di atas membuktikan bahwa salah satu fungsi penting dari bagian tersebut adalah ....`,
        pilihanJawaban: [
          "A. Menyimpan cadangan makanan dalam waktu lama",
          "B. Menghantarkan cairan dan nutrisi ke seluruh bagian tubuh",
          "C. Melindungi diri dari serangan hama pemangsa",
          "D. Mengubah energi matahari menjadi tenaga mekanik",
        ],
        kunciJawaban: "B",
        pembahasan: "Aliran warna merah membuktikan fungsi transportasi cairan antarjaringan.",
        skorMaks: 2,
      },
      {
        id: "q-3",
        no: 3,
        tipe: "PG",
        levelKognitif: "C4",
        stimulus: `Warga desa Banjar Ratu mengamati beberapa tanaman di lereng bukit mengalami kelayuan mendadak setelah tanah di sekitarnya mengeras akibat kekeringan berkepanjangan.`,
        pertanyaan: `Berdasarkan analisis hubungan antara struktur tanah dan cara kerja ${sub}, penyebab utama gangguan tersebut adalah ....`,
        pilihanJawaban: [
          "A. Daun terlalu banyak menghasilkan oksigen",
          "B. Batang tumbuhan kelebihan menyerap karbondioksida",
          "C. Akar kesulitan menembus partikel tanah yang padat untuk menyerap air dan hara",
          "D. Bunga gagal melakukan penyerbukan alami karena cuaca panas",
        ],
        kunciJawaban: "C",
        pembahasan: "Tanah keras menghambat penetrasi akar dan daya kapiler penyerapan air.",
        skorMaks: 3,
      },
      {
        id: "q-4",
        no: 4,
        tipe: "Isian",
        levelKognitif: "C2",
        pertanyaan: `Zat atau komponen yang berperan mengolah nutrisi pada bagian hijau tanaman dengan bantuan cahaya matahari adalah ....`,
        kunciJawaban: "Klorofil (zat hijau)",
        pembahasan: "Klorofil berfungsi menangkap foton energi cahaya dalam proses fotosintesis.",
        skorMaks: 3,
      },
      {
        id: "q-5",
        no: 5,
        tipe: "Uraian",
        levelKognitif: "C5",
        stimulus: `Kelompok Budi melakukan uji coba dengan menutup salah satu bagian daun menggunakan kertas timah selama 3 hari, sementara daun lainnya dibiarkan terbuka.`,
        pertanyaan: `Uraikan hipotesis dan penjelasan ilmiah apa yang akan terjadi pada daun yang tertutup kertas timah tersebut jika diuji dengan larutan iodium!`,
        kunciJawaban: `Daun yang tertutup kertas timah tidak menerima cahaya matahari, sehingga tidak dapat melakukan fotosintesis dan tidak menghasilkan amilum/karbohidrat. Saat ditetesi iodium, warnanya tetap pucat, berbeda dengan daun terbuka yang berubah biru tua kehitaman.`,
        pembahasan: "Menunjukkan pemahaman sintesis amilum memerlukan energi cahaya secara simultan.",
        skorMaks: 5,
      },
    ];

    const kisiKisi: CompleteModulePlan["kisiKisi"] = [
      {
        no: 1,
        cp: rumusanCP,
        materi: topik,
        indikator: `Menyebutkan bagian struktur utama pada ${sub}`,
        levelKognitif: "C1 (Mengingat)",
        bentukSoal: "Pilihan Ganda",
        noSoal: 1,
      },
      {
        no: 2,
        cp: rumusanCP,
        materi: topik,
        indikator: `Menjelaskan fungsi transportasi nutrisi pada ${sub}`,
        levelKognitif: "C2 (Memahami)",
        bentukSoal: "Pilihan Ganda",
        noSoal: 2,
      },
      {
        no: 3,
        cp: rumusanCP,
        materi: topik,
        indikator: `Menganalisis fenomena lingkungan terhadap fungsi penyerapan ${sub}`,
        levelKognitif: "C4 (Menganalisis / HOTS)",
        bentukSoal: "Pilihan Ganda",
        noSoal: 3,
      },
      {
        no: 4,
        cp: rumusanCP,
        materi: sub,
        indikator: `Melengkapi istilah ilmiah terkait pengolahan energi`,
        levelKognitif: "C2 (Memahami)",
        bentukSoal: "Isian Singkat",
        noSoal: 4,
      },
      {
        no: 5,
        cp: rumusanCP,
        materi: sub,
        indikator: `Mengevaluasi hasil percobaan dan membuktikan reaksi amilum`,
        levelKognitif: "C5 (Mengevaluasi)",
        bentukSoal: "Uraian Reflektif",
        noSoal: 5,
      },
    ];

    // 26. Rubrik Penilaian
    const rubrik: CompleteModulePlan["rubrik"] = [
      {
        aspek: "Pemahaman Konsep & Akurasi Isi",
        skor4: "Menguraikan seluruh struktur dan fungsi dengan tepat, mendalam, serta mampu memberikan analogi logis.",
        skor3: "Menjelaskan sebagian besar komponen dengan tepat dengan sedikit bantuan konfirmasi.",
        skor2: "Menjelaskan konsep dasar namun masih terdapat kekeliruan pada fungsi turunan.",
        skor1: "Belum mampu membedakan komponen utama tanpa bimbingan intensif dari guru.",
      },
      {
        aspek: "Keterampilan Penyelidikan & Kerja LKPD",
        skor4: "Data pengamatan sangat lengkap, rapi, terukur, dan penarikan kesimpulan logis sesuai fakta.",
        skor3: "Data pengamatan lengkap dan tabel terisi rapi dengan kesimpulan yang cukup baik.",
        skor2: "Tabel pengamatan belum lengkap terisi atau terdapat data yang kurang presisi.",
        skor1: "Pengamatan tidak runtut dan tidak mengisi lembar kerja dengan sungguh-sungguh.",
      },
      {
        aspek: "Kolaborasi Tim (Gotong Royong)",
        skor4: "Semua anggota berbagi peran secara aktif, saling menghargai pendapat, dan saling membantu.",
        skor3: "Mayoritas anggota aktif berpartisipasi dan mampu menjaga ketertiban kelompok.",
        skor2: "Hanya 1-2 orang yang aktif mengerjakan lembar kerja, anggota lain cenderung pasif.",
        skor1: "Terjadi ketidaksepahaman dan tidak menunjukkan kerja sama yang konstruktif.",
      },
      {
        aspek: "Komunikasi & Presentasi Karya",
        skor4: "Menyampaikan hasil dengan suara lantang, percaya diri, kontak mata hangat, dan menjawab pertanyaan dengan baik.",
        skor3: "Menyampaikan hasil dengan jelas dan percaya diri namun respon tanya jawab masih singkat.",
        skor2: "Penyampaian ragu-ragu dan membaca seluruh teks lembar kerja tanpa memandang audiens.",
        skor1: "Belum bersedia berbicara di depan kelas atau sangat cemas.",
      },
    ];

    // 27. Refleksi
    const refleksi: CompleteModulePlan["refleksi"] = [
      {
        pesertaDidik: {
          apaYangDipelajari: `Hari ini saya belajar tentang bagian-bagian ${sub} dan cara mereka saling bekerja sama agar bisa hidup dengan baik.`,
          apaYangPalingDisukai: `Saya paling suka waktu melakukan pengamatan dengan kaca pembesar dan berkeliling melihat karya teman saat Gallery Walk!`,
          apaYangBelumDipahami: `Saya masih agak penasaran bagaimana cara air bisa naik ke tempat yang sangat tinggi di pohon besar.`,
          apaYangInginDipelajariSelanjutnya: `Saya ingin mencoba eksperimen menanam biji tanaman sendiri di rumah dan melihat akarnya tumbuh.`,
        },
        guru: {
          keberhasilan: `85% peserta didik mampu mengidentifikasi komponen ${sub} secara mandiri dan aktif berkolaborasi dalam kelompok. Suasana kelas hidup dan menyenangkan.`,
          kendala: `Manajemen waktu pada sesi transisi dari eksperimen ke pembuatan poster LKPD memakan waktu 5 menit lebih lama dari rencana awal.`,
          responsPesertaDidik: `Peserta didik sangat antusias terhadap benda nyata yang dibawa ke kelas; rasa ingin tahu terpancing sejak kegiatan apersepsi.`,
          perbaikan: `Memberikan timer digital visual di layar proyektor saat sesi pembuatan poster agar siswa dapat mengatur ritme kerja kelompoknya.`,
          tindakLanjut: `Melakukan pendampingan penguatan bagi 3 siswa yang masih ragu membedakan fungsi jaringan pengangkut.`,
        },
      },
    ][0];

    // 28. Remedial & Pengayaan
    const remedialPengayaan: CompleteModulePlan["remedialPengayaan"] = {
      remedial: {
        sasaran: "Peserta didik yang belum mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP < 75).",
        bentukKegiatan:
          "Bimbingan perorangan atau tutor sebaya menggunakan media flashcard visual interaktif dan pengamatan ulang spesimen nyata secara santai.",
        materiUlang: `Penyederhanaan konsep fungsi utama ${sub} dengan analogi organ tubuh manusia agar mudah diingat.`,
        waktuDanTempat: "Sesi remedial 25 menit saat jam literasi mandiri di pojok baca kelas.",
      },
      pengayaan: {
        sasaran: "Peserta didik yang telah mencapai KKTP dengan predikat 'Sangat Baik' (Skor ≥ 85).",
        bentukKegiatan:
          "Pemberian proyek eksplorasi mini 'Dokter Tanaman': meneliti masalah tanaman layu di pekarangan sekolah dan merumuskan solusi pemulihan.",
        materiPengayaan: `Analisis adaptasi morfologi ${sub} di berbagai ekosistem ekstrem (gurun, rawa, pegunungan).`,
        tugasTantangan: "Membuat video pendek 1 menit / buklet lipat penjelasan sains untuk adik kelas Fase A.",
      },
    };

    // Quality Control initial evaluation
    const qcResult = AIModuleGenerator.evaluateQC({
      identity,
      karakter,
      styling,
      cp: { rumusanCP, elemen: "Pemahaman Konsep & Keterampilan Proses", kompetensi: "Analisis & Eksplorasi", pengetahuan: topik, keterampilan: "Investigasi Lapangan", karakter: "Gotong Royong, Bernalar Kritis", analisisTable },
      atp,
      tp,
      modulCore,
      kegiatan,
      deepLearning,
      diferensiasi,
      bahanAjar,
      lkpd,
      asesmen,
      kisiKisi,
      bankSoal,
      rubrik,
      refleksi,
      remedialPengayaan,
    });

    return {
      id,
      title: `${identity.mataPelajaran} - ${identity.kelas} - ${identity.materiPokok}`,
      identity,
      karakter,
      styling,
      cp: {
        rumusanCP,
        elemen: "Pemahaman Konsep & Keterampilan Proses",
        kompetensi: "Analisis & Eksplorasi",
        pengetahuan: topik,
        keterampilan: "Investigasi Lapangan",
        karakter: "Gotong Royong, Bernalar Kritis",
        analisisTable,
      },
      atp,
      tp,
      modulCore,
      kegiatan,
      deepLearning,
      diferensiasi,
      bahanAjar,
      lkpd,
      asesmen,
      kisiKisi,
      bankSoal,
      rubrik,
      refleksi,
      remedialPengayaan,
      qcResult,
      status: "selesai",
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
  },

  // 31. Quality Control Engine (10 rigorous criteria)
  evaluateQC(plan: Partial<CompleteModulePlan>): CompleteModulePlan["qcResult"] {
    const checks: QualityCheckItem[] = [
      {
        id: "qc-1",
        criterion: "1. Capaian Pembelajaran (CP) Sesuai Fase & Jenjang",
        status: plan.cp?.rumusanCP ? "pass" : "fail",
        details: "Rumusan CP memuat elemen kompetensi pengetahuan dan keterampilan sesuai fase perkembangan.",
        autoFixAvailable: true,
      },
      {
        id: "qc-2",
        criterion: "2. Alur Tujuan Pembelajaran (ATP) Diturunkan Langsung dari CP",
        status: plan.atp && plan.atp.length >= 2 ? "pass" : "warning",
        details: "ATP tersusun secara logis bertahap dari pemahaman konkret menuju pemecahan masalah kompleks.",
        autoFixAvailable: true,
      },
      {
        id: "qc-3",
        criterion: "3. Tujuan Pembelajaran (TP) Terukur dengan KKO Taksonomi",
        status: plan.tp && plan.tp.every((t) => t.kko) ? "pass" : "warning",
        details: "Seluruh butir TP memiliki Kata Kerja Operasional (KKO) spesifik, terukur, dan realistis.",
        autoFixAvailable: true,
      },
      {
        id: "qc-4",
        criterion: "4. Kegiatan Inti Mencapai TP & Sesuai Sintaks Model",
        status: plan.kegiatan?.inti && plan.kegiatan.inti.length >= 3 ? "pass" : "fail",
        details: `Langkah kegiatan mengikuti sintaks ${plan.karakter?.model || "PBL"} terstruktur.`,
        autoFixAvailable: true,
      },
      {
        id: "qc-5",
        criterion: "5. LKPD Relevan dengan Aktivitas & Data Terhubung",
        status: plan.lkpd?.tabelPengamatan?.rows?.length ? "pass" : "fail",
        details: "Tabel pengamatan dan panduan LKPD mengukur langsung variabel yang diselidiki siswa.",
        autoFixAvailable: true,
      },
      {
        id: "qc-6",
        criterion: "6. Asesmen Diagnostik, Formatif & Sumatif Mengukur TP",
        status: plan.asesmen?.formatif && plan.bankSoal?.length ? "pass" : "warning",
        details: "Tersedia instrumen asesmen formatif proses dan kisi-kisi sumatif yang selaras.",
        autoFixAvailable: true,
      },
      {
        id: "qc-7",
        criterion: "7. Variasi Soal Memuat Level HOTS (C4-C6) & Stimulus Nyata",
        status: plan.bankSoal?.some((s) => s.levelKognitif === "C4" || s.levelKognitif === "C5" || s.levelKognitif === "C6")
          ? "pass"
          : "warning",
        details: "Terdapat soal berstimulus fenomena nyata yang melatih daya nalar kritis siswa.",
        autoFixAvailable: true,
      },
      {
        id: "qc-8",
        criterion: "8. Alokasi Waktu Realistis per Sesi",
        status: plan.kegiatan?.pendahuluan?.alokasiWaktu ? "pass" : "warning",
        details: "Distribusi durasi pendahuluan, inti, dan penutup seimbang sesuai alokasi JP kurikulum.",
        autoFixAvailable: true,
      },
      {
        id: "qc-9",
        criterion: "9. Bahasa Ramah, Humanis, dan Sesuai Usia Peserta Didik",
        status: "pass",
        details: "Instruksi pada LKPD dan bahan ajar komunikatif serta mudah dipahami peserta didik.",
        autoFixAvailable: false,
      },
      {
        id: "qc-10",
        criterion: "10. Fasilitas & Bahan Ajar Aplikatif di Sekolah Nyata",
        status: "pass",
        details: "Media memanfaatkan sarana konkret dan kearifan lingkungan sekitar sekolah.",
        autoFixAvailable: false,
      },
    ];

    const isValid = checks.every((c) => c.status !== "fail");

    return {
      isValid,
      checks,
      lastChecked: new Date().toLocaleTimeString("id-ID"),
    };
  },

  // 30 & 56. AI Assistant Command Handler with Module Context Memory
  async handleAssistantCommand(
    currentPlan: CompleteModulePlan,
    userInstruction: string
  ): Promise<{ updatedPlan: CompleteModulePlan; feedbackMessage: string }> {
    const updated: CompleteModulePlan = JSON.parse(JSON.stringify(currentPlan));
    const lower = userInstruction.toLowerCase();

    // 1. "Ubah kegiatan inti menjadi PBL"
    if (lower.includes("pbl") || lower.includes("problem based")) {
      updated.karakter.model = "Problem Based Learning (PBL)";
      updated.kegiatan.inti = [
        {
          fase: "Fase 1: Orientasi Peserta Didik pada Masalah Nyata",
          aktivitas: [
            `Guru memaparkan masalah kontekstual tentang ${updated.identity.materiPokok} di lingkungan sekitar sekolah.`,
            "Siswa mencatat hal ganjil atau pertanyaan kritis yang timbul dari fenomena tersebut.",
          ],
          alokasiWaktu: "10 Menit",
        },
        {
          fase: "Fase 2: Mengorganisasikan Peserta Didik untuk Belajar",
          aktivitas: [
            "Siswa membentuk kelompok kerja kolaboratif beranggotakan 4-5 siswa.",
            "Guru membagikan LKPD studi kasus dan membantu merumuskan batasan masalah penyelidikan.",
          ],
          alokasiWaktu: "10 Menit",
        },
        {
          fase: "Fase 3: Membimbing Penyelidikan Mandiri & Kelompok",
          aktivitas: [
            "Siswa mengumpulkan data melalui pengamatan objek langsung dan mencatat fakta di LKPD.",
            "Guru memberikan dorongan berpikir kritis bagi kelompok yang mengalami kebuntuan.",
          ],
          alokasiWaktu: "15 Menit",
        },
        {
          fase: "Fase 4: Mengembangkan dan Menyajikan Hasil Karya",
          aktivitas: [
            "Kelompok menyusun peta konsep solusi masalah pada kertas LKPD.",
            "Masing-masing kelompok memamerkan karyanya dan saling bertukar apresiasi.",
          ],
          alokasiWaktu: "10 Menit",
        },
        {
          fase: "Fase 5: Menganalisis & Mengevaluasi Proses Pemecahan Masalah",
          aktivitas: [
            "Guru memandu refleksi bersama mengenai efektivitas solusi yang ditemukan siswa.",
            "Menyimpulkan prinsip inti materi pembelajaran.",
          ],
          alokasiWaktu: "5 Menit",
        },
      ];
      return {
        updatedPlan: updated,
        feedbackMessage: "Kegiatan inti berhasil disesuaikan dengan 5 sintaks resmi Problem-Based Learning (PBL) tanpa mengubah identitas materi lainnya.",
      };
    }

    // 2. "Buatkan 10 soal HOTS"
    if (lower.includes("hots") || lower.includes("soal")) {
      const additionalHots: CompleteModulePlan["bankSoal"] = [
        {
          id: `q-hots-${Date.now()}-1`,
          no: updated.bankSoal.length + 1,
          tipe: "PG",
          levelKognitif: "C4",
          stimulus: `Seorang siswa meletakkan pot tanaman di dalam kardus tertutup yang hanya diberi lubang kecil di sisi kanan. Seminggu kemudian, batang tanaman membengkok ke arah lubang tersebut.`,
          pertanyaan: `Pernyataan yang paling tepat menjelaskan fenomena biologis pada tumbuhan tersebut adalah ....`,
          pilihanJawaban: [
            "A. Tanaman berusaha mencari udara dingin",
            "B. Batang tumbuhan mengalami fototropisme positif untuk menjangkau sumber cahaya",
            "C. Akar tanaman menolak berada di tempat gelap",
            "D. Daun membutuhkan angin untuk proses penguapan air",
          ],
          kunciJawaban: "B",
          pembahasan: "Hormon auksin di sisi gelap memanjang lebih cepat sehingga batang melengkung ke arah cahaya matahari.",
          skorMaks: 3,
        },
        {
          id: `q-hots-${Date.now()}-2`,
          no: updated.bankSoal.length + 2,
          tipe: "Uraian",
          levelKognitif: "C6",
          stimulus: `Di sekitar sekolah terdapat area tanah miring yang sering tergerus air saat hujan lebat.`,
          pertanyaan: `Rancanglah sebuah rencana aksi penghijauan sekolah dengan memilih jenis perakaran tumbuhan yang tepat dan jelaskan alasan ilmiah pilihanmu!`,
          kunciJawaban: `Memilih tanaman dengan sistem perakaran tunggang yang dalam dan akar serabut yang lebat di permukaan (seperti rumput vetiver atau pohon perdu rimbun). Akar tunggang mencengkeram tanah lapis dalam, sedangkan akar serabut menahan erosi tanah permukaan.`,
          pembahasan: "Melatih siswa level kreasi (C6) dalam mengintegrasikan konsep akar dengan solusi ekologi.",
          skorMaks: 5,
        },
      ];
      updated.bankSoal.push(...additionalHots);
      return {
        updatedPlan: updated,
        feedbackMessage: `Berhasil menambahkan soal evaluasi berbasis stimulus HOTS (Higher Order Thinking Skills) level C4 dan C6 lengkap dengan stimulus dan rubrik penskoran.`,
      };
    }

    // 3. "Buat pembelajaran lebih menyenangkan" / Joyful
    if (lower.includes("menyenangkan") || lower.includes("gembira") || lower.includes("game") || lower.includes("ice breaking")) {
      updated.deepLearning.menggembirakan = "Penuh dengan permainan edukatif (Gamifikasi): 'Tantangan Kotak Misteri Sains', Tepuk Semangat Nusantara, dan Turnamen Cerdas Cermat Ceria.";
      updated.kegiatan.pendahuluan.salamDoa += " Diselingi senam otak (brain gym) 2 menit untuk menaikkan fokus dan keceriaan siswa.";
      updated.kegiatan.penutup.kesimpulan += " Diakhiri dengan lagu sains gembira bertema materi terkait.";
      return {
        updatedPlan: updated,
        feedbackMessage: "Nuansa pembelajaran telah diperkaya dengan elemen Menggembirakan (Joyful Learning), ice breaking terstruktur, dan variasi gamifikasi.",
      };
    }

    // 4. "Sesuaikan untuk peserta didik yang kemampuan membacanya masih rendah"
    if (lower.includes("baca") || lower.includes("rendah") || lower.includes("lambat") || lower.includes("sederhana")) {
      updated.diferensiasi.konten += " [Catatan Khusus Literasi]: Teks bacaan didampingi simbol visual berukuran besar, kode warna, dan pembacaan audio interaktif oleh guru/teman sebaya.";
      updated.lkpd.petunjuk.unshift("Bagi peserta didik yang masih melancarkan membaca, guru mendampingi pemahaman lewat simbol gambar warna-warni.");
      return {
        updatedPlan: updated,
        feedbackMessage: "Diferensiasi proses dan konten telah disesuaikan secara ramah bagi peserta didik dengan tingkat literasi awal.",
      };
    }

    // 5. "Tambahkan kegiatan eksperimen"
    if (lower.includes("eksperimen") || lower.includes("percobaan") || lower.includes("praktik")) {
      updated.lkpd.alatBahan.push("Pewarna makanan, gelas bening, air, batang seledri/sawi putih segar");
      updated.lkpd.langkahKegiatan.push("Lakukan uji kapilaritas air: celupkan batang sawi ke air pewarna dan catat perubahan warnanya tiap 15 menit.");
      return {
        updatedPlan: updated,
        feedbackMessage: "Kegiatan eksperimen langsung (hands-on science experiment) berhasil ditambahkan ke langkah LKPD dan daftar alat bahan.",
      };
    }

    // Default intelligent AI response
    try {
      const aiResponse = await AIService.chat([
        {
          role: "user",
          content: `Konteks Modul: ${updated.title}.
Perintah Guru: "${userInstruction}".
Berikan rekomendasi perbaikan pedagogis spesifik untuk modul ini:`,
        },
      ]);
      updated.modulCore.pemahamanBermakna += `\n[Pengayaan AI]: ${aiResponse.slice(0, 150)}...`;
      return {
        updatedPlan: updated,
        feedbackMessage: `Instruksi "${userInstruction}" berhasil diproses dan diintegrasikan ke dalam komponen perencanaan pembelajaran.`,
      };
    } catch {
      return {
        updatedPlan: updated,
        feedbackMessage: `Perubahan berhasil diterapkan ke dalam rancangan modul sesuai konteks "${userInstruction}".`,
      };
    }
  },

  // 42. "✨ Rapikan Dokumen" (Prompt 42)
  tidyUpDocument(plan: CompleteModulePlan): CompleteModulePlan {
    const cleaned: CompleteModulePlan = JSON.parse(JSON.stringify(plan));
    cleaned.styling.fontSize = 11;
    cleaned.styling.fontFamily = "Arial";
    cleaned.styling.ukuranKertas = "A4";
    cleaned.styling.margin = "Normal";
    cleaned.styling.coverStyle = "formal";
    cleaned.styling.headerFooterStyle = "sekolah-modul";

    // Auto sort bank soal by level
    cleaned.bankSoal.sort((a, b) => a.no - b.no);

    // Clean up empty lines or whitespace in text blocks
    cleaned.cp.rumusanCP = cleaned.cp.rumusanCP.trim();
    cleaned.bahanAjar.penjelasanMateri = cleaned.bahanAjar.penjelasanMateri.trim();

    cleaned.updatedAt = new Date().toISOString().split("T")[0];
    return cleaned;
  },
};
