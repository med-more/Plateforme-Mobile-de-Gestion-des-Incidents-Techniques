import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { registerSchema } from '../../utils/validation/registerSchema';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const sendEmailConfirmation = async (email, username) => {
    try {
      await emailjs.send(
        '',
        '',
        {
          to_email: email,
          username: username
        },
        ''
      );
      Toast.show({ type: 'success', text1: 'Email sent for confirmation!' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to send confirmation email' });
    }
  };

  const sendSmsVerification = async (phoneNumber) => {
    try {
      const res = await axios.post('https://verify.twilio.com/v2/Services/TWILIO_SID/Verifications', {
        To: phoneNumber,
        Channel: 'sms'
      }, {
        auth: {
          username: '',
          password: ''
        }
      });
      Toast.show({ type: 'success', text1: 'Verification SMS sent!' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'SMS verification failed!' });
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(values));

        await sendEmailConfirmation(values.email, values.username);

        await sendSmsVerification(values.phoneNumber);

        Toast.show({ type: 'success', text1: 'Registration done, check email & SMS' });
        navigation.navigate('Login');
      } catch (err) {
        const errorMsg = err.message || 'Registration failed';
        setErrors({ email: errorMsg });
        Toast.show({ type: 'error', text1: errorMsg });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
        <Text className="text-2xl font-bold text-center mb-5">Register</Text>

        {[ 
          { name: 'username', placeholder: 'Username' },
          { name: 'email', placeholder: 'Email' },
          { name: 'phoneNumber', placeholder: 'Phone Number' },
          { name: 'password', placeholder: 'Password', secure: true },
          { name: 'confirmPassword', placeholder: 'Confirm Password', secure: true }
        ].map(({ name, placeholder, secure }) => (
          <View key={name} className="mb-4">
            <TextInput
              placeholder={placeholder}
              secureTextEntry={secure}
              value={formik.values[name]}
              onChangeText={formik.handleChange(name)}
              onBlur={formik.handleBlur(name)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            {formik.errors[name] && formik.touched[name] && (
              <Text className="text-red-500 text-sm mt-1">{formik.errors[name]}</Text>
            )}
          </View>
        ))}

        <View className="mb-4">
          <Text className="mb-1 font-semibold">Choose Role</Text>
          {['user', 'admin'].map((roleOption) => (
            <TouchableOpacity
              key={roleOption}
              onPress={() => formik.setFieldValue('role', roleOption)}
              className={`border px-3 py-2 rounded mb-2 ${formik.values.role === roleOption ? 'bg-cyan-200' : ''}`}
            >
              <Text>{roleOption}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting}
          className="bg-cyan-600 py-3 rounded"
        >
          <Text className="text-white text-center font-semibold">
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
