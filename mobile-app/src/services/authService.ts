import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebaseConfig';

interface User {
  uid: string;
  email: string;
  role: 'admin' | 'staff';
}

class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // For now, we'll assume all users are admin
      // In a real app, you'd fetch the role from Firestore
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        role: 'admin'
      };
      
      return user;
    } catch (error: any) {
      let errorMessage = 'Terjadi kesalahan saat login';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email tidak ditemukan';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Password salah';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format email tidak valid';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Terlalu banyak percobaan login. Coba lagi nanti';
          break;
        default:
          errorMessage = error.message || 'Terjadi kesalahan saat login';
      }
      
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Terjadi kesalahan saat logout');
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          role: 'admin' // Default role, should be fetched from Firestore in real app
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
