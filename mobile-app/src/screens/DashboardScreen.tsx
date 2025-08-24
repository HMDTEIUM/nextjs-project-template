import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import CustomCard from '../components/CustomCard';

type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardStats {
  totalViolations: number;
  totalStudents: number;
  todayViolations: number;
  pendingReports: number;
}

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalViolations: 0,
    totalStudents: 0,
    todayViolations: 0,
    pendingReports: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // TODO: Implement actual data fetching from Firebase
      // For now, using mock data
      setStats({
        totalViolations: 45,
        totalStudents: 120,
        todayViolations: 3,
        pendingReports: 7,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari sistem?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', 'Gagal logout: ' + error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Selamat datang, {user?.email}
        </Text>
        <Text style={styles.roleText}>
          {user?.role === 'admin' ? 'Administrator' : 'Staff'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <CustomCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalViolations}</Text>
            <Text style={styles.statLabel}>Total Pelanggaran</Text>
          </CustomCard>
          
          <CustomCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalStudents}</Text>
            <Text style={styles.statLabel}>Total Mahasiswa</Text>
          </CustomCard>
        </View>

        <View style={styles.statsRow}>
          <CustomCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.todayViolations}</Text>
            <Text style={styles.statLabel}>Pelanggaran Hari Ini</Text>
          </CustomCard>
          
          <CustomCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pendingReports}</Text>
            <Text style={styles.statLabel}>Laporan Pending</Text>
          </CustomCard>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <CustomCard>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          
          <CustomButton
            title="Tambah Pelanggaran Baru"
            onPress={() => navigation.navigate('AddViolation')}
            style={styles.actionButton}
          />
          
          <CustomButton
            title="Cari Data Mahasiswa"
            onPress={() => navigation.navigate('StudentSearch')}
            variant="secondary"
            style={styles.actionButton}
          />
          
          <CustomButton
            title="Lihat Laporan"
            onPress={() => navigation.navigate('ViolationReport')}
            variant="secondary"
            style={styles.actionButton}
          />
        </CustomCard>
      </View>

      <View style={styles.logoutContainer}>
        <CustomButton
          title="Keluar dari Sistem"
          onPress={handleLogout}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#1f2937',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#d1d5db',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default DashboardScreen;
