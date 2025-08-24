import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebaseConfig';

export interface Violation {
  id?: string;
  studentName: string;
  studentId: string;
  violationType: string;
  description: string;
  location: string;
  imageUrl?: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'resolved' | 'investigating';
}

class ViolationService {
  private collectionName = 'violations';

  async addViolation(violation: Omit<Violation, 'id' | 'reportedAt' | 'status'>, imageUri?: string): Promise<string> {
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (imageUri) {
        imageUrl = await this.uploadImage(imageUri);
      }

      const violationData = {
        ...violation,
        imageUrl,
        reportedAt: Timestamp.now(),
        status: 'pending' as const,
      };

      const docRef = await addDoc(collection(db, this.collectionName), violationData);
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding violation:', error);
      throw new Error('Gagal menyimpan pelanggaran: ' + error.message);
    }
  }

  async getViolations(filters?: {
    studentId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Violation[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        orderBy('reportedAt', 'desc')
      );

      // Apply filters
      if (filters?.studentId) {
        q = query(q, where('studentId', '==', filters.studentId));
      }
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      const violations: Violation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        violations.push({
          id: doc.id,
          ...data,
          reportedAt: data.reportedAt.toDate(),
        } as Violation);
      });

      // Apply date filters (Firestore doesn't support range queries with other filters easily)
      let filteredViolations = violations;
      
      if (filters?.dateFrom) {
        filteredViolations = filteredViolations.filter(v => 
          v.reportedAt >= filters.dateFrom!
        );
      }
      
      if (filters?.dateTo) {
        filteredViolations = filteredViolations.filter(v => 
          v.reportedAt <= filters.dateTo!
        );
      }

      return filteredViolations;
    } catch (error: any) {
      console.error('Error getting violations:', error);
      throw new Error('Gagal mengambil data pelanggaran: ' + error.message);
    }
  }

  async getViolationStats(): Promise<{
    total: number;
    pending: number;
    resolved: number;
    today: number;
    byType: { [key: string]: number };
  }> {
    try {
      const violations = await this.getViolations();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = {
        total: violations.length,
        pending: violations.filter(v => v.status === 'pending').length,
        resolved: violations.filter(v => v.status === 'resolved').length,
        today: violations.filter(v => {
          const violationDate = new Date(v.reportedAt);
          violationDate.setHours(0, 0, 0, 0);
          return violationDate.getTime() === today.getTime();
        }).length,
        byType: {} as { [key: string]: number },
      };

      // Count by violation type
      violations.forEach(violation => {
        stats.byType[violation.violationType] = (stats.byType[violation.violationType] || 0) + 1;
      });

      return stats;
    } catch (error: any) {
      console.error('Error getting violation stats:', error);
      throw new Error('Gagal mengambil statistik pelanggaran: ' + error.message);
    }
  }

  private async uploadImage(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const filename = `violations/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const imageRef = ref(storage, filename);
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error('Gagal mengupload foto: ' + error.message);
    }
  }

  async updateViolationStatus(violationId: string, status: 'pending' | 'resolved' | 'investigating'): Promise<void> {
    try {
      // TODO: Implement updateDoc when needed
      console.log('Update violation status:', violationId, status);
    } catch (error: any) {
      console.error('Error updating violation status:', error);
      throw new Error('Gagal mengupdate status pelanggaran: ' + error.message);
    }
  }
}

export const violationService = new ViolationService();
