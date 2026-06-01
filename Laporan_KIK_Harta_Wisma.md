# DOKUMEN LAPORAN PROJEK KUMPULAN INOVATIF & KREATIF (KIK) 2026
**KUMPULAN:** [Nama Kumpulan Anda]
**AGENSI:** Batalion Ketiga Rejimen Askar Melayu DiRaja (3 RAMD)
**PROJEK:** Harta Wisma V3.0 (Sistem Pengurusan Aset Digital Berasaskan Kod QR)

---

## BAB 1: PENGENALAN
Wisma Perwira 3 RAMD merupakan pusat perjumpaan dan kediaman rasmi bagi Pegawai-Pegawai Batalion Ketiga Rejimen Askar Melayu DiRaja. Pengurusan aset dalaman wisma (seperti perabot, perkakasan elektronik, kelengkapan rekreasi, dan kutleri) adalah amat kritikal untuk memastikan kawalan perbelanjaan yang efisien dan mengelakkan kehilangan harta ketenteraan. Projek "Harta Wisma V3.0" merupakan satu inisiatif inovasi digital bagi mentransformasikan pengurusan aset fizikal kepada sistem pintar.

## BAB 2: PERNYATAAN MASALAH
Proses pengurusan aset sebelum ini menggunakan buku log fizikal dan helaian hamparan (spreadsheet) yang diselenggara secara manual. Beberapa kelemahan ketara telah dikenal pasti:
1. **Masa Verifikasi Stok (Stocktake) Yang Lama:** Proses membandingkan rekod di kertas dengan siri nombor fizikal pada perabot/perkakasan memakan masa berhari-hari.
2. **Ketiadaan Pengesanan Masa Nyata (Real-time Tracking):** Pegawai pengurusan sukar untuk mengetahui nilai semasa keseluruhan aset, serta lokasi tepat sesuatu barangan (contoh: dipindahkan dari bilik mesyuarat ke bilik transit tanpa rekod).
3. **Risiko Integriti Data:** Sistem berasaskan kertas terdedah kepada kecuaian kemasukan data (human error) dan risiko dokumen hilang.
4. **Analitik Data Yang Sukar:** Menjana laporan penilaian susut nilai atau kerosakan aset secara bulanan memerlukan pengiraan manual yang membebankan PMC (President of the Mess Committee).

## BAB 3: INOVASI & PENYELESAIAN (HARTA WISMA V3.0)
Bagi mengatasi masalah di atas, kumpulan kami telah membangunkan sebuah aplikasi web "Harta Wisma V3.0". Ini adalah sebuah Sistem Pengurusan Aset Bebas Pelayan (Serverless Web App) yang mengintegrasikan:
1. **Papan Pemuka Dinamik (Dynamic Dashboard):** Memaparkan secara visual maklumat Jumlah Aset Fizikal, Nilai Keseluruhan Keseluruhan, dan perincian mengikut Kategori/Lokasi secara langsung.
2. **Sistem Pengimbasan Kod QR (QR Tagging):** Aplikasi ini secara automatik menjana Kod QR unik untuk setiap aset baharu yang didaftarkan. Kod ini kemudian dicetak dan ditampal pada aset fizikal.
3. **Semakan Mudah Alih (Mobile-Friendly):** Sesiapa sahaja yang mempunyai akses (Pegawai bertugas) boleh mengimbas Kod QR pada aset menggunakan kamera telefon pintar untuk memaparkan maklumat terperinci aset tersebut (seperti Nombor Siri, No KEW.PA, Tarikh Diperolehi, Nilai, dan Lokasi Semasa).
4. **Pangkalan Data Cloud Firebase:** Menggunakan teknologi awan yang disulitkan (encrypted) bagi memastikan data tersimpan selamat dari sebarang kerosakan fizikal, dan boleh diakses pada bila-bila masa (24/7).

## BAB 4: PENILAIAN IMPAK & FAEDAH (KPI)
Pelaksanaan inovasi ini telah memberikan impak yang besar terhadap pengurusan kelengkapan rejimen:
1. **Penjimatan Masa Sebenar:** Proses *stocktake* tahunan/bulanan dipendekkan daripada tempoh 5 hari (secara manual) kepada kurang dari 1 hari. Pegawai hanya perlu "Scan & Verify".
2. **Ketepatan Data 100%:** Ralat transkripsi kertas dihilangkan sepenuhnya. Sistem laporan binaan-dalam (built-in) berupaya mengeluarkan analitik automatik dengan satu butang.
3. **Pencegahan Ketirisan Kewangan:** Menghalang kes kehilangan aset tanpa jejak, sekaligus menyelamatkan peruntukan rejimen untuk pembelian aset gantian yang tidak sepatutnya.

## BAB 5: KELESTARIAN & KEBOLEHMEREBAKAN (SCALABILITY)
Sistem ini dibina berasaskan kos pembangun yang sangat minimum (menggunakan sumber terbuka). Oleh kerana ia bersaiz ringan dan tidak bergantung kepada pelayan fizikal (on-premise server), sistem Harta Wisma V3.0:
1. **Boleh Diguna Pakai Serta Merta:** Oleh pelbagai wisma lain (contoh: Wisma Bintara 3 RAMD, atau Rejimen lain di bawah naungan markas divisyen).
2. **Kelestarian Operasi:** Dilengkapi dengan fail Panduan Pengguna (README) yang jelas membolehkan penyerahan tugas kepada pegawai baharu dilakukan tanpa memerlukan latihan teknikal yang rumit.

---
**NOTA:** Dokumen ini merupakan deraf asas. Tuan boleh menambah maklumat berbentuk kuantitatif (contohnya angka sebenar nilai ringgit yang dijimatkan) dan rajah / carta tangkap layar (screenshot) aplikasi Harta Wisma V3.0 di ruang-ruang berkaitan sebagai bukti (eviden) fizikal semasa pembentangan KIK.
