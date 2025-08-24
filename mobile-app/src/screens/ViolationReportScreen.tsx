import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CustomCard from '../components/CustomCard';
import CustomButton from '../components/CustomButton';

interface ViolationReport {
  id: string;
  studentName: string;
  studentId: string;
  violationType: string;
  description: string;
  location: string;
  date: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'investigating';
}

interface ReportStats {
  totalViolations: number;
  pendingReports: number;
  resolvedReports: number;
  todayReports: number;
  violationsByType: { [key: string]: number };
}

const ViolationReportScreen = () => {
  const [reports, setReports] = useState<ViolationReport[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    totalViolations: 0,
    pendingReports: 0,
    resolvedReports: 0,
    todayReports: 0,
    violationsByType: {},
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [loading, setLoading] = useState(false);

  const mockReports: ViolationReport[] = [
    {
      id: '1',
      studentName: 'Ahmad Rizki Pratama',
      studentId: '210441100001',
      violationType: 'Terlambat Masuk Kelas',
      description: 'Mahasiswa terlambat masuk kelas selama 15 menit tanpa keterangan',
      location: 'Ruang Kelas A.1.1',
      date: '2024-01-15T08:15:00Z',
      reportedBy: 'admin@um.ac.id',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Siti Nurhaliza',
      studentId: '210441100002',
      violationType: 'Tidak Menggunakan Seragam',
      description: 'Mahasiswa tidak menggunakan seragam praktikum yang sesuai',
      location: 'Lab Komputer 1',
      date: '2024-01-14T10:30:00Z',
      reportedBy: 'admin@um.ac.id',
      status: 'resolved',
    },
    {
      id: '3',
      studentName: 'Budi Santoso',
      studentId: '210441100003',
      violationType: 'Merokok di Area Kampus',
      description: 'Mahasiswa kedapatan merokok di area parkir kampus',
      location: 'Area Parkir Gedung A',
      date: '2024-01-13T14:20:00Z',
      reportedBy: 'admin@um.ac.id',
      status: 'investigating',
    },
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual data fetching from Firebase
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(mockReports);
      
      // Calculate stats
      const totalViolations = mockReports.length;
      const pendingReports = mockReports.filter(r => r.status === 'pending').length;
      const resolvedReports = mockReports.filter(r => r.status === 'resolved').length;
      const today = new Date().toDateString();
      const todayReports = mockReports.filter(r => 
        new Date(r.date).toDateString() === today
      ).length;
      
      const violationsByType: { [key: string]: number } = {};
      mockReports.forEach(report => {
        violationsByType[report.violationType] = (violationsByType[report.violationType] || 0) + 1;
      });
      
      setStats({
        totalViolations,
        pendingReports,
        resolvedReports,
        todayReports,
        violationsByType,
      });
    } catch (error: any) {
      Alert.alert('Error', 'Gagal memuat data laporan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReports = () => {
    if (selectedFilter === 'all') return reports;
    return reports.filter(report => report.status === selectedFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'investigating':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'resolved':
        return 'Selesai';
      case 'investigating':
        return 'Investigasi';
      default:
        return status;
    }
  };

  const renderReportItem = (report: ViolationReport) => (
    <CustomCard key={report.id} style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.studentName}>{report.studentName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
            {getStatusText(report.status)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.studentId}>NIM: {report.studentId}</Text>
      <Text style={styles.violationType}>{report.violationType}</Text>
      <Text style={styles.description}>{report.description}</Text>
      
      <View style={styles.reportFooter}>
        <Text style={styles.location}>📍 {report.location}</Text>
        <Text style={styles.date}>
          {new Date(report.date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </CustomCard>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Statistics Section */}
      <CustomCard>
        <Text style={styles.sectionTitle}>Statistik Pelanggaran</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalViolations}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.pendingReports}</Text>
            <Text style={styles.statLabel}>Menunggu</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.resolvedReports}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.todayReports}</Text>
            <Text style={styles.statLabel}>Hari Ini</Text>
          </View>
        </View>
      </CustomCard>

      {/* Violation Types Chart */}
      <CustomCard>
        <Text style={styles.sectionTitle}>Jenis Pelanggaran</Text>
        {Object.entries(stats.violationsByType).map(([type, count]) => (
          <View key={type} style={styles.chartItem}>
            <Text style={styles.chartLabel}>{type}</Text>
            <View style={styles.chartBar}>
              <View 
                style={[
                  styles.chartFill, 
                  { width: `${(count / stats.totalViolations) * 100}%` }
                ]} 
              />
              <Text style={styles.chartValue}>{count}</Text>
            </View>
          </View>
        ))}
      </CustomCard>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            Semua
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'pending' && styles.activeFilter]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text style={[styles.filterText, selectedFilter === 'pending' && styles.activeFilterText]}>
            Menunggu
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'resolved' && styles.activeFilter]}
          onPress={() => setSelectedFilter('resolved')}
        >
          <Text style={[styles.filterText, selectedFilter === 'resolved' && styles.activeFilterText]}>
            Selesai
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      <View style={styles.reportsContainer}>
        <Text style={styles.sectionTitle}>
          Daftar Laporan ({getFilteredReports().length})
        </Text>
        
        {loading ? (
          <CustomCard>
            <Text style={styles.loadingText}>Memuat data...</Text>
          </CustomCard>
        ) : getFilteredReports().length > 0 ? (
          getFilteredReports().map(renderReportItem)
        ) : (
          <CustomCard>
            <Text style={styles.emptyText}>Tidak ada laporan untuk filter ini</Text>
          </CustomCard>
        )}
      </View>

      <View style={styles.refreshContainer}>
        <CustomButton
          title="Muat Ulang Data"
          onPress={loadReports}
          variant="secondary"
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  chartItem: {
    marginBottom: 12,
  },
  chartLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  chartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    height: 24,
    position: 'relative',
  },
  chartFill: {
    backgroundColor: '#1f2937',
    height: '100%',
    borderRadius: 4,
    minWidth: 20,
  },
  chartValue: {
    position: 'absolute',
    right: 8,
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#1f2937',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  reportsContainer: {
    marginBottom: 16,
  },
  reportCard: {
    marginBottom: 12,
  },
  reportHeader: {
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
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  studentId: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  violationType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  refreshContainer: {
    marginBottom: 32,
  },
});

export default ViolationReportScreen;
