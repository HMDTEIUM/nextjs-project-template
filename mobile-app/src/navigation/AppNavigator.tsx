import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddViolationScreen from '../screens/AddViolationScreen';
import StudentSearchScreen from '../screens/StudentSearchScreen';
import ViolationReportScreen from '../screens/ViolationReportScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  AddViolation: undefined;
  StudentSearch: undefined;
  ViolationReport: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Memuat...</Text>
  </View>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        // Authenticated screens
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'Dashboard Pelanggaran' }}
          />
          <Stack.Screen 
            name="AddViolation" 
            component={AddViolationScreen}
            options={{ title: 'Tambah Pelanggaran' }}
          />
          <Stack.Screen 
            name="StudentSearch" 
            component={StudentSearchScreen}
            options={{ title: 'Cari Data Mahasiswa' }}
          />
          <Stack.Screen 
            name="ViolationReport" 
            component={ViolationReportScreen}
            options={{ title: 'Laporan Pelanggaran' }}
          />
        </>
      ) : (
        // Unauthenticated screens
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '500',
  },
});

export default AppNavigator;
