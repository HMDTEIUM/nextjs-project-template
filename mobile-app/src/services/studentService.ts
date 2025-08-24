import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { violationService } from './violationService';

export interface Student {
  id?: string;
  name: string;
  nim: string;
  program: string;
  email?: string;
  phone?: string;
  address?: string;
  enrollmentYear: number;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: Date;
}

export interface StudentWithViolations extends Student {
  violationCount: number;
  lastViolation?: Date;
}

class StudentService {
  private collectionName = 'students';

  async searchStudents(searchQuery: string): Promise<StudentWithViolations[]> {
    try {
      // TODO: Implement actual search from Firebase
      // For now, return mock data for development
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Ahmad Rizki Pratama',
          nim: '210441100001',
          program: 'Teknik Informatika',
          email: 'ahmad.rizki@student.um.ac.id',
          phone: '081234567890',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
        {
          id: '2',
          name: 'Siti Nurhaliza',
          nim: '210441100002',
          program: 'Teknik Elektro',
          email: 'siti.nurhaliza@student.um.ac.id',
          phone: '081234567891',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
        {
          id: '3',
          name: 'Budi Santoso',
          nim: '210441100003',
          program: 'Teknik Informatika',
          email: 'budi.santoso@student.um.ac.id',
          phone: '081234567892',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
        {
          id: '4',
          name: 'Dewi Sartika',
          nim: '210441100004',
          program: 'Teknik Elektro',
          email: 'dewi.sartika@student.um.ac.id',
          phone: '081234567893',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
        {
          id: '5',
          name: 'Andi Wijaya',
          nim: '210441100005',
          program: 'Teknik Informatika',
          email: 'andi.wijaya@student.um.ac.id',
          phone: '081234567894',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
      ];

      // Filter students based on search query
      const filteredStudents = mockStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nim.includes(searchQuery) ||
        student.program.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Get violation data for each student
      const studentsWithViolations: StudentWithViolations[] = await Promise.all(
        filteredStudents.map(async (student) => {
          try {
            const violations = await violationService.getViolations({ studentId: student.nim });
            const violationCount = violations.length;
            const lastViolation = violations.length > 0 ? violations[0].reportedAt : undefined;

            return {
              ...student,
              violationCount,
              lastViolation,
            };
          } catch (error) {
            // If violation service fails, return student with zero violations
            return {
              ...student,
              violationCount: 0,
              lastViolation: undefined,
            };
          }
        })
      );

      return studentsWithViolations;
    } catch (error: any) {
      console.error('Error searching students:', error);
      throw new Error('Gagal mencari data mahasiswa: ' + error.message);
    }
  }

  async getStudentById(studentId: string): Promise<Student | null> {
    try {
      // TODO: Implement actual fetch from Firebase
      // For now, return mock data
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Ahmad Rizki Pratama',
          nim: '210441100001',
          program: 'Teknik Informatika',
          email: 'ahmad.rizki@student.um.ac.id',
          phone: '081234567890',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
      ];

      return mockStudents.find(s => s.id === studentId || s.nim === studentId) || null;
    } catch (error: any) {
      console.error('Error getting student by ID:', error);
      throw new Error('Gagal mengambil data mahasiswa: ' + error.message);
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('name', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const students: Student[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        students.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Student);
      });

      return students;
    } catch (error: any) {
      console.error('Error getting all students:', error);
      
      // Return mock data if Firebase fails
      return [
        {
          id: '1',
          name: 'Ahmad Rizki Pratama',
          nim: '210441100001',
          program: 'Teknik Informatika',
          email: 'ahmad.rizki@student.um.ac.id',
          phone: '081234567890',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
        {
          id: '2',
          name: 'Siti Nurhaliza',
          nim: '210441100002',
          program: 'Teknik Elektro',
          email: 'siti.nurhaliza@student.um.ac.id',
          phone: '081234567891',
          enrollmentYear: 2021,
          status: 'active',
          createdAt: new Date('2021-08-01'),
        },
      ];
    }
  }

  async getStudentStats(): Promise<{
    total: number;
    active: number;
    byProgram: { [key: string]: number };
    byYear: { [key: number]: number };
  }> {
    try {
      const students = await this.getAllStudents();
      
      const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'active').length,
        byProgram: {} as { [key: string]: number },
        byYear: {} as { [key: number]: number },
      };

      // Count by program
      students.forEach(student => {
        stats.byProgram[student.program] = (stats.byProgram[student.program] || 0) + 1;
        stats.byYear[student.enrollmentYear] = (stats.byYear[student.enrollmentYear] || 0) + 1;
      });

      return stats;
    } catch (error: any) {
      console.error('Error getting student stats:', error);
      throw new Error('Gagal mengambil statistik mahasiswa: ' + error.message);
    }
  }
}

export const studentService = new StudentService();
