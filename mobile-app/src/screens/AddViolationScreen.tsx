import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomCard from '../components/CustomCard';

interface ViolationForm {
  studentName: string;
  studentId: string;
  violationType: string;
  description: string;
  location: string;
  imageUri: string | null;
}

const VIOLATION_TYPES = [
  'Terlambat Masuk Kelas',
  'Tidak Menggunakan Seragam',
  'Merokok di Area Kampus',
  'Tidak Mengikuti Praktikum',
  'Pelanggaran Tata Tertib',
  'Lainnya',
];

const AddViolationScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState<ViolationForm>({
    studentName: '',
    studentId: '',
    violationType: '',
    description: '',
    location: '',
    imageUri: null,
  });
  const [errors, setErrors] = useState<Partial<ViolationForm>>({});
  const [loading, setLoading] = useState(false);
  const [showViolationTypes, setShowViolationTypes] = useState(false);

  const updateForm = (field: keyof ViolationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ViolationForm> = {};

    if (!form.studentName.trim()) {
      newErrors.studentName = 'Nama mahasiswa harus diisi';
    }

    if (!form.studentId.trim()) {
      newErrors.studentId = 'NIM mahasiswa harus diisi';
    }

    if (!form.violationType.trim()) {
      newErrors.violationType = 'Jenis pelanggaran harus dipilih';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Deskripsi pelanggaran harus diisi';
    }

    if (!form.location.trim()) {
      newErrors.location = 'Lokasi kejadian harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin untuk mengakses galeri foto');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setForm(prev => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto dari galeri');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin untuk mengakses kamera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setForm(prev => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto dengan kamera');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto untuk bukti pelanggaran',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Galeri', onPress: pickImage },
        { text: 'Kamera', onPress: takePhoto },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual submission to Firebase
      // For now, just show success message
      Alert.alert(
        'Berhasil',
        'Pelanggaran berhasil dicatat',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Gagal menyimpan pelanggaran: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomCard>
        <Text style={styles.sectionTitle}>Data Mahasiswa</Text>
        
        <CustomInput
          label="Nama Mahasiswa"
          value={form.studentName}
          onChangeText={(value) => updateForm('studentName', value)}
          placeholder="Masukkan nama lengkap mahasiswa"
          error={errors.studentName}
          required
        />

        <CustomInput
          label="NIM"
          value={form.studentId}
          onChangeText={(value) => updateForm('studentId', value)}
          placeholder="Masukkan NIM mahasiswa"
          error={errors.studentId}
          required
        />
      </CustomCard>

      <CustomCard>
        <Text style={styles.sectionTitle}>Detail Pelanggaran</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Jenis Pelanggaran <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.picker, errors.violationType && styles.pickerError]}
            onPress={() => setShowViolationTypes(!showViolationTypes)}
          >
            <Text style={[styles.pickerText, !form.violationType && styles.placeholderText]}>
              {form.violationType || 'Pilih jenis pelanggaran'}
            </Text>
          </TouchableOpacity>
          {errors.violationType && (
            <Text style={styles.errorText}>{errors.violationType}</Text>
          )}
        </View>

        {showViolationTypes && (
          <View style={styles.optionsContainer}>
            {VIOLATION_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.option}
                onPress={() => {
                  updateForm('violationType', type);
                  setShowViolationTypes(false);
                }}
              >
                <Text style={styles.optionText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <CustomInput
          label="Deskripsi Pelanggaran"
          value={form.description}
          onChangeText={(value) => updateForm('description', value)}
          placeholder="Jelaskan detail pelanggaran yang terjadi"
          multiline
          numberOfLines={4}
          error={errors.description}
          required
        />

        <CustomInput
          label="Lokasi Kejadian"
          value={form.location}
          onChangeText={(value) => updateForm('location', value)}
          placeholder="Masukkan lokasi terjadinya pelanggaran"
          error={errors.location}
          required
        />
      </CustomCard>

      <CustomCard>
        <Text style={styles.sectionTitle}>Bukti Foto</Text>
        
        {form.imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: form.imageUri }} style={styles.image} />
            <CustomButton
              title="Ganti Foto"
              onPress={showImagePicker}
              variant="secondary"
              style={styles.changePhotoButton}
            />
          </View>
        ) : (
          <CustomButton
            title="Ambil Foto Bukti"
            onPress={showImagePicker}
            variant="secondary"
          />
        )}
      </CustomCard>

      <View style={styles.submitContainer}>
        <CustomButton
          title={loading ? 'Menyimpan...' : 'Simpan Pelanggaran'}
          onPress={handleSubmit}
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#dc2626',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  pickerError: {
    borderColor: '#dc2626',
    borderWidth: 2,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 16,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  changePhotoButton: {
    width: 120,
  },
  submitContainer: {
    marginVertical: 20,
  },
});

export default AddViolationScreen;
