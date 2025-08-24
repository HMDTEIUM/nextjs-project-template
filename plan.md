```markdown
# Rencana Implementasi Aplikasi Mobile Pelaporan Pelanggaran Mahasiswa Baru

## Pendahuluan
Kita akan memulai proyek React Native baru (menggunakan Expo) untuk membuat aplikasi mobile lintas platform yang memungkinkan admin, staf, dan mahasiswa mengelola pelanggaran dengan rekaman foto, deskripsi, dan waktu. Aplikasi ini akan menggunakan Firebase sebagai solusi cloud (untuk autentikasi, Firestore, dan Storage) dan seluruh UI akan menggunakan teks, warna, dan layout modern dengan bahasa Indonesia.

## Struktur Proyek Baru
Buat folder baru misalnya `mobile-app/` yang berisi:
- `package.json`
- `App.tsx`
- Folder direktori:
  - `/src/screens`
  - `/src/components`
  - `/src/services`
  - `/src/navigation`
  - `/README.md` (dengan petunjuk setup Expo dan Firebase)

## Dependensi Utama
- React Native & Expo
- React Navigation (stack dan tab)
- Firebase (Auth, Firestore, Storage)
- Expo Image Picker (untuk ambil foto)
- Library state management (React Context atau Redux sederhana)

## Rincian Perubahan dan Pembuatan File

### Package & Konfigurasi
- **mobile-app/package.json**  
  - Tambahkan dependensi: `expo`, `react-native`, `@react-navigation/native`, `@react-navigation/stack`, `firebase`, `expo-image-picker`
  - Pastikan script untuk menjalankan menggunakan Expo (misalnya `expo start`).

### Entry Point
- **mobile-app/App.tsx**  
  - Setup Navigation Container.
  - Gunakan Context untuk mengelola status autentikasi.
  - Render layar Login jika belum terautentikasi, atau Dashboard jika sudah.

### Navigasi
- **mobile-app/src/navigation/AppNavigator.tsx**  
  - Buat stack navigator dengan rute: Login, Dashboard, Tambah Pelanggaran, Cari Siswa, dan Laporan.
  - Implementasikan rute aman (protected routes) berdasarkan status login.

### Layar (Screens)
- **mobile-app/src/screens/LoginScreen.tsx**  
  - Form input email & password.
  - Tombol "Masuk" dengan validasi form dan penanganan error (alert dalam Bahasa Indonesia).
  - Panggilan ke `authService` untuk proses login.
  
- **mobile-app/src/screens/DashboardScreen.tsx**  
  - Tampilan ringkasan statistik (jumlah pelanggaran, siswa terdata) dan navigasi ke layar lain (lihat tombol “Tambah Pelanggaran”, “Data Siswa”, “Laporan”).
  - UI modern dengan padding, margin, dan tipografi yang jelas.

- **mobile-app/src/screens/AddViolationScreen.tsx**  
  - Form untuk memasukkan data pelanggaran:
    - Tombol "Ambil Foto" dengan integrasi Expo Image Picker.
    - Input deskripsi, pilihan kategori pelanggaran (dropdown dengan opsi yang telah ditentukan), dan cap tanggal/waktu otomatis.
    - Tombol "Simpan Pelanggaran" untuk menyimpan data melalui `violationService` (upload foto ke Firebase Storage dan simpan metadata ke Firestore).
  - Penanganan error dengan try-catch dan alert error.

- **mobile-app/src/screens/StudentSearchScreen.tsx**  
  - Input pencarian siswa, list hasil pencarian (nama, NIM, dsb) yang diambil dari Firestore melalui `studentService`.
  - Tampilan pesan “Tidak ada data” jika pencarian tidak menemukan hasil.

- **mobile-app/src/screens/ViolationReportScreen.tsx**  
  - Tampilan laporan dan analitik (misalnya hitung jumlah pelanggaran berdasarkan kategori atau tanggal).
  - Jika memungkinkan, buat grafik sederhana menggunakan View dengan lebar proporsional (tanpa menggunakan ikon eksternal).
  - Sediakan filter tanggal dan kategori, serta error handling untuk pemrosesan data.

### Komponen UI Custom
Buat komponen-komponen reusable untuk memastikan konsistensi UI.
- **mobile-app/src/components/CustomButton.tsx**  
  - Button modern dengan styling kustom; gunakan TouchableOpacity dengan padding, warna latar, dan teks yang mudah dibaca.
- **mobile-app/src/components/CustomInput.tsx**  
  - Input field dengan validasi realtime dan styling minimalis.
- **mobile-app/src/components/CustomCard.tsx**  
  - Card untuk menampilkan data pelanggaran atau informasi siswa dengan border lembut dan bayangan ringan.

### Layanan (Services)
Integrasi dengan Firebase untuk operasi cloud.
- **mobile-app/src/services/firebaseConfig.ts**  
  - Inisialisasi Firebase dengan konfigurasi (request API Key dari user jika belum ada).
  - Tambahkan error handling saat inisialisasi (misalnya, tampilkan error jika konfigurasi tidak ditemukan).

- **mobile-app/src/services/authService.ts**  
  - Fungsi login (email & password), logout, dan monitoring status autentikasi menggunakan Firebase Auth.
  - Pastikan untuk menangani error (misalnya, user tidak ditemukan, password salah).

- **mobile-app/src/services/violationService.ts**  
  - Fungsi untuk menambahkan pelanggaran, membaca data pelanggaran, dan filtering berdasarkan kriteria.
  - Implementasikan upload foto ke Firebase Storage dan simpan URL-nya di Firestore.
  
- **mobile-app/src/services/studentService.ts**  
  - Fungsi pencarian siswa dari koleksi Firestore, dengan parameter pencarian dan penanganan error.

## UI/UX dan Penanganan Error
- Semua layar dan komponen menggunakan layout modern dengan ruang kosong (spacing) yang konsisten, tipografi jelas, dan skema warna netral.
- Setiap operasi async (login, upload, fetch data) di-wrap dalam try-catch dan menampilkan pesan error yang informatif dalam Bahasa Indonesia.
- Form validasi dilakukan secara real-time, dan feedback visual diberikan kepada pengguna (misalnya, border merah atau teks error kecil).

## Integrasi Cloud & Autentikasi
- Aplikasi akan menggunakan Firebase sebagai penyimpanan data waktu nyata:
  - Autentikasi: Email & password untuk admin.
  - Firestore: Database untuk pelanggaran, data siswa, dan kategori.
  - Storage: Upload foto dari pelanggaran.
- Pastikan untuk meminta API Key Firebase ke pengguna dan dokumentasikan setup Firebase pada README.

## Pengujian
- Uji setiap layanan dengan simulasi operasi offline dan error handling.
- Jalankan aplikasi di emulator Android/iOS menggunakan Expo dan periksa log error menggunakan debugging tools Expo.
- Pastikan validasi form berfungsi dan navigasi antar layar lancar.

## Summary
- Proyek baru dibuat dengan React Native (Expo) untuk aplikasi pelaporan pelanggaran mahasiswa baru dengan UI berbahasa Indonesia.
- Layar utama meliputi Login, Dashboard, Tambah Pelanggaran, Pencarian Siswa, dan Laporan.
- Komponen UI kustom dibuat untuk tombol, input, dan card dengan desain modern.
- Integrasi Firebase untuk autentikasi, Firestore, dan Storage diimplementasikan melalui layanan khusus.
- Penanganan error dan validasi form dilakukan secara menyeluruh pada setiap operasional.
- Navigasi diatur dengan react-navigation dan status autentikasi dikelola melalui context.
- Fitur inti mencakup rekaman pelanggaran, pencarian siswa, dan laporan analitik.
- Dokumentasi setup dan penggunaan disertakan pada README agar developer lain dapat dengan mudah mengonfigurasi proyek.
