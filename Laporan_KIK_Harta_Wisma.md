# DOKUMEN LAPORAN PROJEK KUMPULAN INOVATIF & KREATIF (KIK) 2026
**KUMPULAN:** [Nama Kumpulan Anda]  
**AGENSI:** Batalion Ketiga Rejimen Askar Melayu DiRaja (3 RAMD)  
**PROJEK:** Harta Wisma V3.0 (Sistem Pengurusan Aset & Audit Digital Pintar Wisma Perwira)

---

## BAB 1: PENGENALAN
Wisma Perwira 3 RAMD merupakan pusat perjumpaan dan kediaman rasmi bagi Pegawai-Pegawai Batalion Ketiga Rejimen Askar Melayu DiRaja. Pengurusan aset dalaman wisma (seperti perabot, perkakasan elektronik, kelengkapan rekreasi, dan kutleri beradat) adalah amat kritikal untuk memastikan kawalan perbelanjaan yang efisien, ketelusan audit, dan mengelakkan kehilangan harta ketenteraan. Projek **"Harta Wisma V3.0"** merupakan satu inisiatif inovasi digital holistik bagi mentransformasikan proses pengurusan, pemeriksaan fizikal, dan mutasi aset kepada platform pintar masa nyata.

## BAB 2: PERNYATAAN MASALAH
Proses pengurusan aset sebelum ini menggunakan buku log fizikal dan helaian hamparan (spreadsheet) yang diselenggara secara manual. Beberapa kelemahan ketara telah dikenal pasti:
1. **Masa Verifikasi Stok (Stocktake) Yang Terlalu Lama:** Proses membandingkan rekod di atas kertas dengan siri nombor fizikal pada perabot/perkakasan memakan masa berhari-hari (purata 5-7 hari bekerja setiap pusingan audit).
2. **Ketiadaan Pengesanan Mutasi / Perpindahan Lokasi (Asset Movement):** Aset kerap dipindahkan untuk majlis khas (contoh: dipindahkan dari bilik mesyuarat ke dewan makan atau bilik transit) tanpa rekod bertulis, menyebabkan status aset dianggap hilang atau tidak dapat dikesan.
3. **Risiko Integriti Data & Kehilangan Rekod:** Buku daftar fizikal terdedah kepada kecuaian kemasukan data (human error), kerosakan fizikal, dan ketiadaan salinan sandaran (backup).
4. **Kesukaran Menjana Laporan Eksekutif untuk PMC:** Menjana laporan penilaian susut nilai, senarai kerosakan, atau status kesihatan inventori bulanan memerlukan pengiraan manual yang membebankan PMC (President of the Mess Committee) dan Pegawai Pengurusan Wisma.

## BAB 3: INOVASI & PENYELESAIAN (HARTA WISMA V3.0)
Bagi merungkai masalah di atas, sebuah aplikasi web pintar bebas pelayan (*Serverless Web App*) telah dibangunkan dengan mengintegrasikan lima tunjang inovasi utama:

1. **Papan Pemuka Eksekutif Dinamik (Executive Dashboard):** Memaparkan maklumat agregat Jumlah Unit Fizikal, Nilai Keseluruhan Inventori, Kadar Kemajuan Audit Stok, dan amaran segera bagi aset yang rosak atau belum ditemui.
2. **Sistem Penandaan & Pengimbasan Kod QR Pantas (QR Tagging & Mobile Scanner):** Setiap aset didaftarkan dengan kod QR unik yang dijana secara automatik. Pegawai bertugas boleh mengimbas terus menggunakan kamera telefon pintar tanpa perlu memasang aplikasi tambahan.
3. **Modul Pemeriksaan Stok Fizikal Masa Nyata (Stocktake & Variance Audit Mode):**
   - Penunjuk kemajuan sesi audit (% Completed Progress Bar).
   - Tindakan 1-klik untuk menanda status aset: **Disahkan (Verified)**, **Rosak (Damaged)**, atau **Tidak Ditemui (Missing)**.
   - Perekodan tarikh semakan terakhir serta nama pegawai pemeriksa secara automatik.
4. **Modul Perekodan Perpindahan Lokasi (Asset Movement & Custody Tracking):**
   - Membolehkan pegawai menukar lokasi penempatan aset serta-merta melalui telefon atau komputer.
   - Merakam sejarah perpindahan lengkap (*Location Audit Trail*) merangkumi: Lokasi Asal $\rightarrow$ Lokasi Baharu, Tarikh, Tujuan Pemindahan (cth: Majlis Makan Beradat), dan Pegawai Bertanggungjawab.
5. **Penjanaan Laporan Rasmi & Eksport Data Fleksibel:**
   - Eksport 1-klik ke format **CSV / Excel** lengkap mengikut standard KEW.PA (KEW.PA-2 dan KEW.PA-3).
   - Format cetakan rasmi berpiawaian ketenteraan dengan ruangan pengesahan Pegawai Wisma dan tandatangan PMC.
6. **Ketahanan Mod Luar Talian (Offline Resilience Caching):**
   - Data semakan stok dan sejarah lokasi disimpan secara hibrid (Pangkalan Data Google Cloud Apps Script & simpanan selamat pelayar tempatan) bagi memastikan sistem kekal berfungsi walaupun talian internet di wisma terhad.

## BAB 4: PENILAIAN IMPAK & FAEDAH (KPI & OUTCOME)
Pelaksanaan inovasi ini telah memberikan impak kuantitatif dan kualitatif yang ketara terhadap pengurusan Rejimen:
1. **Penjimatan Masa Pemeriksaan Stok (85% Lebih Pantas):** Proses *stocktake* tahunan/bulanan dipendekkan daripada tempoh 5 hari (secara manual) kepada kurang dari 1 hari (hanya imbas Kod QR atau semak senarai digital).
2. **Ketepatan Rekod & Sifar Ralat Transkripsi (100% Data Integrity):** Mengelakkan pertindihan nombor siri dan kekeliruan KEW.PA.
3. **Pencegahan Ketirisan & Kawalan Kehilangan Aset:** Pengesanan pergerakan lokasi mengelakkan insiden barang "hilang" yang sebenarnya hanya dipindahkan ke bilik lain. Hal ini menjimatkan peruntukan kewangan batalion daripada perbelanjaan gantian yang tidak wajar.
4. **Kecekapan Pengurusan PMC:** Laporan status nilai semasa dan kerosakan sedia dicetak atau dieksport bila-bila masa bagi tujuan mesyuarat jawatankuasa wisma.

## BAB 5: KELESTARIAN & KEBOLEHMEREBAKAN (SCALABILITY)
Sistem ini dibina berasaskan kos pembangun yang sangat minimum (menggunakan teknologi sumber terbuka yang mesra bajet):
1. **Kebolehmerebakan ke Wisma & Unit Lain:** Sistem ini sedia digunakan (plug-and-play) untuk Wisma Bintara 3 RAMD, stor kompeni, mahupun rejimen-rejimen lain di bawah naungan 3 Divisyen / Tentera Darat Malaysia.
2. **Kelestarian Operasi (Standard Operating Procedure):** Dilengkapi dengan panduan pengguna (README) yang komprehensif, membolehkan peralihan tugas kepada Pegawai Wisma baharu dilaksanakan dengan lancar tanpa latihan teknikal intensif.

---
**Disediakan Untuk:** Jawatankuasa KIK Batalion Ketiga Rejimen Askar Melayu DiRaja (3 RAMD) • 2026
