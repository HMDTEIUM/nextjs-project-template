import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Ganti dengan konfigurasi Firebase Anda
// Dapatkan konfigurasi ini dari Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Inisialisasi Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase berhasil diinisialisasi');
} catch (error) {
  console.error('Error menginisialisasi Firebase:', error);
  
  // Fallback untuk development - buat mock objects
  auth = {} as any;
  db = {} as any;
  storage = {} as any;
}

export { auth, db, storage };
export default app;
