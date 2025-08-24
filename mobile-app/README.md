# Aplikasi Mobile Pelaporan Pelanggaran Mahasiswa

Aplikasi mobile untuk mencatat dan mengelola pelanggaran mahasiswa baru di Jurusan Teknik Elektro dan Informatika, Universitas Negeri Malang.

## Fitur Utama

- 📱 **Cross-platform**: Berjalan di Android dan iOS
- 🔐 **Autentikasi**: Login untuk admin dan staf
- 📝 **Pencatatan Pelanggaran**: Rekam pelanggaran dengan foto, deskripsi, dan timestamp
- 🔍 **Pencarian Mahasiswa**: Cari data mahasiswa dan riwayat pelanggaran
- 📊 **Laporan & Analitik**: Statistik dan laporan pelanggaran
- ☁️ **Cloud Storage**: Data tersimpan real-time di Firebase
- 🇮🇩 **Bahasa Indonesia**: Interface dalam Bahasa Indonesia

## Teknologi yang Digunakan

- **React Native** dengan Expo
- **TypeScript** untuk type safety
- **Firebase** (Authentication, Firestore, Storage)
- **React Navigation** untuk navigasi
- **Expo Image Picker** untuk mengambil foto

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app di smartphone (untuk testing)

## Setup Firebase

1. Buat project Firebase baru di [Firebase Console](https://console.firebase.google.com)

2. Aktifkan layanan berikut:
   - **Authentication** > Sign-in method > Email/Password
   - **Firestore Database** > Create database (start in test mode)
   - **Storage** > Get started

3. Dapatkan konfigurasi Firebase:
   - Pergi ke Project Settings > General
   - Scroll ke bawah ke "Your apps"
   - Klik "Add app" > Web app
   - Copy konfigurasi Firebase

4. Update file `src/services/firebaseConfig.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

## Instalasi

1. Clone atau download project ini
2. Masuk ke direktori `mobile-app`:
   ```bash
   cd mobile-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Update konfigurasi Firebase (lihat bagian Setup Firebase di atas)

## Menjalankan Aplikasi

### Development Mode

```bash
npm start
```

Atau untuk platform spesifik:

```bash
# Android
npm run android

# iOS  
npm run ios

# Web (untuk testing)
npm run web
```

### Testing di Device

1. Install **Expo Go** di smartphone Anda:
   - [Android - Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Jalankan `npm start`

3. Scan QR code yang muncul dengan:
   - **Android**: Expo Go app
   - **iOS**: Camera app (akan membuka Expo Go)

## Struktur Project

```
mobile-app/
├── src/
│   ├── components/          # Komponen UI reusable
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   └── CustomCard.tsx
│   ├── context/            # React Context
│   │   └── AuthContext.tsx
│   ├── navigation/         # Konfigurasi navigasi
│   │   └── AppNavigator.tsx
│   ├── screens/           # Layar aplikasi
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AddViolationScreen.tsx
│   │   ├── StudentSearchScreen.tsx
│   │   └── ViolationReportScreen.tsx
│   └── services/          # Layanan Firebase
│       ├── firebaseConfig.ts
│       ├── authService.ts
│       ├── violationService.ts
│       └── studentService.ts
├── App.tsx               # Entry point
├── package.json
└── README.md
```

## Penggunaan

### 1. Login
- Buka aplikasi
- Masukkan email dan password admin/staf
- Klik "Masuk"

### 2. Dashboard
- Lihat statistik pelanggaran
- Akses menu utama:
  - Tambah Pelanggaran Baru
  - Cari Data Mahasiswa  
  - Lihat Laporan

### 3. Tambah Pelanggaran
- Isi data mahasiswa (nama, NIM)
- Pilih jenis pelanggaran
- Tulis deskripsi detail
- Ambil foto bukti (opsional)
- Simpan pelanggaran

### 4. Cari Mahasiswa
- Masukkan nama atau NIM mahasiswa
- Lihat hasil pencarian dengan riwayat pelanggaran

### 5. Laporan
- Lihat statistik pelanggaran
- Filter berdasarkan status (semua/menunggu/selesai)
- Analisis berdasarkan jenis pelanggaran

## Konfigurasi Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write violations and students
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /violations/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Error: Firebase not initialized
- Pastikan konfigurasi Firebase sudah benar di `firebaseConfig.ts`
- Cek apakah semua layanan Firebase sudah diaktifkan

### Error: Permission denied
- Pastikan Firebase Security Rules sudah dikonfigurasi
- Cek apakah user sudah login dengan benar

### Error: Expo modules not found
- Jalankan `npm install` ulang
- Pastikan menggunakan Expo CLI terbaru

### Error: Image picker not working
- Pastikan memberikan permission untuk kamera dan galeri
- Test di device fisik, bukan emulator

## Build untuk Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform android
eas build --platform ios
```

## Kontribusi

1. Fork repository ini
2. Buat branch fitur baru: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m 'Tambah fitur baru'`
4. Push ke branch: `git push origin fitur-baru`
5. Buat Pull Request

## Lisensi

MIT License - lihat file LICENSE untuk detail.

## Kontak

Untuk pertanyaan atau dukungan:
- Email: admin@um.ac.id
- Jurusan Teknik Elektro dan Informatika
- Universitas Negeri Malang

---

**Catatan**: Aplikasi ini dibuat khusus untuk keperluan internal Jurusan Teknik Elektro dan Informatika, Universitas Negeri Malang.
