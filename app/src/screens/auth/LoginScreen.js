import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,KeyboardAvoidingView,Platform,} from 'react-native';
import { useFormik } from 'formik';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { loginSchema } from '../../utils/validation';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const userData = await loginUser(values.email, values.password);
        await login(userData); 
        Toast.show({ type: 'success', text1: 'Login successful!' });
        navigation.navigate('Home');
      } catch (err) {
        const message = err?.response?.data?.message || 'Invalid credentials';
        setErrors({ email: message });
        Toast.show({ type: 'error', text1: message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: '#fff',
        }}
      >
        <Text className="text-3xl font-bold text-center mb-6">Welcome Back</Text>

        {[
          { name: 'email', placeholder: 'Email', keyboardType: 'email-address' },
          { name: 'password', placeholder: 'Password', secure: true },
        ].map(({ name, placeholder, secure, keyboardType }) => (
          <View key={name} className="mb-5">
            <TextInput
              placeholder={placeholder}
              secureTextEntry={secure}
              keyboardType={keyboardType}
              autoCapitalize="none"
              value={formik.values[name]}
              onChangeText={formik.handleChange(name)}
              onBlur={formik.handleBlur(name)}
              className="border border-gray-300 rounded px-4 py-3"
            />
            {formik.errors[name] && formik.touched[name] && (
              <Text className="text-red-500 text-sm mt-1">
                {formik.errors[name]}
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting}
          className="bg-cyan-600 py-4 rounded"
        >
          <Text className="text-white text-center font-semibold">
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="mt-6"
        >
          <Text className="text-center text-cyan-600 underline">
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
