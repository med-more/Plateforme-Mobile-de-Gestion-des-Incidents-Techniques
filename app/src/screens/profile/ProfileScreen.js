import React from 'react'; 
import { View, TextInput, Button, Text } from 'react-native'; 
import { useFormik } from 'formik'; 
import * as Yup from 'yup'; 
import Toast from 'react-native-toast-message'; 
import axios from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const ProfileScreen = () => {
  const formik = useFormik({
    initialValues: {
      email: '',    
      phone: '',    
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email invalide').required('Email requis'),
      phone: Yup.string().matches(/^[0-9]{10,15}$/, 'Numéro invalide').required('Téléphone requis'),
    }),
    onSubmit: async (values) => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        await axios.put(`http://localhost:5000/api/users/${userId}`, values, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        Toast.show({ type: 'success', text1: 'Profil mis à jour avec succès' });
      } catch (error) {
        console.error(error.response?.data || error.message);
        Toast.show({ type: 'error', text1: 'Échec de la mise à jour du profil' });
      }
    },
  });
  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={formik.values.email} 
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')} 
        placeholder="Entrez un nouvel email"
        style={{ borderWidth: 1, marginBottom: 5 }}
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={{ color: 'red' }}>{formik.errors.email}</Text>
      )}
      <Text>Téléphone</Text>
      <TextInput
        value={formik.values.phone}
        onChangeText={formik.handleChange('phone')}
        onBlur={formik.handleBlur('phone')}
        placeholder="Entrez un nouveau téléphone"
        style={{ borderWidth: 1, marginBottom: 5 }}
        keyboardType="phone-pad" 
      />
      {formik.touched.phone && formik.errors.phone && (
        <Text style={{ color: 'red' }}>{formik.errors.phone}</Text>
      )}
      <Button title="Sauvegarder" onPress={formik.handleSubmit} disabled={formik.isSubmitting} />
    </View>
  );
};

export default ProfileScreen;

