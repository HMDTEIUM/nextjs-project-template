import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomCard from '../components/CustomCard';

interface Student {
  id: string;
  name: string;
  nim: string;
  program: string;
  violationCount: number;
  lastViolation?: string;
}

const StudentSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Ahmad Rizki Pratama',
      nim: '210441100001',
      program: 'Teknik Informatika',
      violationCount: 2,
      lastViolation: '2024-01-15',
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      nim: '210441100002',
      program: 'Teknik Elektro',
      violationCount: 0,
    },
    {
      id: '3',
      name: 'Budi Santoso',
      nim: '210441100003',
      program: 'Teknik Informatika',
      violationCount: 1,
      lastViolation: '2024-01-10',
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Peringatan', 'Masukkan nama atau NIM mahasiswa untuk mencari');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // TODO: Implement actual search from Firebase
      // For now, using mock data with simple filtering
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const filtered = mockStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nim.includes(searchQuery)
      );
      
      setSearchResults(filtered);
    } catch (error: any) {
      Alert.alert('Error', 'Gagal mencari data mahasiswa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <CustomCard style={styles.studentCard}>
      <View style={styles.studentHeader}>
        <Text style={styles.studentName}>{item.name}</Text>
        <View style={[
          styles.violationBadge,
          item.violationCount === 0 ? styles.goodBadge : styles.warningBadge
        ]}>
          <Text style={[
            styles.violationBadgeText,
            item.violationCount === 0 ? styles.goodBadgeText : styles.warningBadgeText
          ]}>
            {item.violationCount} Pelanggaran
          </Text>
        </View>
      </View>
      
      <View style={styles.studentDetails}>
        <Text style={styles.studentInfo}>NIM: {item.nim}</Text>
        <Text style={styles.studentInfo}>Program: {item.program}</Text>
        {item.lastViolation && (
          <Text style={styles.lastViolation}>
            Pelanggaran Terakhir: {new Date(item.lastViolation).toLocaleDateString('id-ID')}
          </Text>
        )}
      </View>
    </CustomCard>
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <CustomCard style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Cari Data Mahasiswa</Text>
          <Text style={styles.emptyText}>
            Masukkan nama atau NIM mahasiswa untuk mencari data dan riwayat pelanggaran
          </Text>
        </CustomCard>
      );
    }

    return (
      <CustomCard style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Tidak Ada Hasil</Text>
        <Text style={styles.emptyText}>
          Tidak ditemukan mahasiswa dengan nama atau NIM "{searchQuery}"
        </Text>
      </CustomCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <CustomInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Masukkan nama atau NIM mahasiswa"
          style={styles.searchInput}
        />
        
        <View style={styles.searchButtons}>
          <CustomButton
            title={loading ? 'Mencari...' : 'Cari'}
            onPress={handleSearch}
            disabled={loading}
            style={styles.searchButton}
          />
          
          {(searchQuery || hasSearched) && (
            <CustomButton
              title="Bersihkan"
              onPress={clearSearch}
              variant="secondary"
              style={styles.clearButton}
            />
          )}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        {searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsHeader}>
              Ditemukan {searchResults.length} mahasiswa
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderStudentItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    marginBottom: 0,
  },
  searchButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  searchButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  studentCard: {
    marginBottom: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  violationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goodBadge: {
    backgroundColor: '#d1fae5',
  },
  warningBadge: {
    backgroundColor: '#fef3c7',
  },
  violationBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goodBadgeText: {
    color: '#065f46',
  },
  warningBadgeText: {
    color: '#92400e',
  },
  studentDetails: {
    gap: 4,
  },
  studentInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  lastViolation: {
    fontSize: 12,
    color: '#dc2626',
    fontStyle: 'italic',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StudentSearchScreen;
