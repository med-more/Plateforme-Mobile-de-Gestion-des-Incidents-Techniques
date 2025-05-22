import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too short').required('Password is required'),
});

const authService = {
  login: async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@test.com' && password === 'admin123') {
          resolve({ data: { email, role: 'admin', token: 'abc123' } });
        } else if (email === 'user@test.com' && password === 'user123') {
          resolve({ data: { email, role: 'user', token: 'xyz789' } });
        } else {
          reject({ response: { data: { message: 'Invalid credentials' } } });
        }
      }, 1000);
    });
  },
};

export default function Login({ setUser }) {
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await authService.login(values);
        const userData = response.data;

        await AsyncStorage.setItem('session', JSON.stringify(userData));
        setUser(userData);

        Toast.show({ type: 'success', text1: 'Login successful!' });

        if (userData.role === 'admin') navigation.navigate('AdminScreen');
        else navigation.navigate('UserScreen');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Login failed';
        Toast.show({ type: 'error', text1: errorMsg });
        setErrors({ email: errorMsg });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <View className="flex-1 bg-gray-100 px-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-8">Login</Text>

      <View className="mb-4">
        <Text className="mb-1 text-gray-700 font-semibold">Email</Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          className="bg-white p-3 rounded border border-gray-300"
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <Text className="text-red-500 mt-1">{formik.errors.email}</Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="mb-1 text-gray-700 font-semibold">Password</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="bg-white p-3 rounded border border-gray-300"
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <Text className="text-red-500 mt-1">{formik.errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        className="mb-6"
      >
        <Text className="text-cyan-600 text-right font-medium">Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}
        className={`bg-cyan-600 py-3 rounded ${formik.isSubmitting ? 'opacity-60' : 'hover:bg-cyan-700'}`}
      >
        {formik.isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">Login</Text>
        )}
      </TouchableOpacity>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-cyan-600 font-medium">Register here</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
}
