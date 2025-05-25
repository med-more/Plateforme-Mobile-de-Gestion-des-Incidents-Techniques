import React from 'react';
import {View,Text,TextInput,TouchableOpacity,ScrollView,KeyboardAvoidingView,Platform} from 'react-native';
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { registerSchema } from '../../utils/validation';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const sendEmailConfirmation = async (email, username) => {
    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          username: username
        },
        process.env.EMAILJS_USER_ID
      );
      Toast.show({ type: 'success', text1: 'Confirmation email sent!' });
    } catch (err) {
      console.error('EmailJS error:', err);
      Toast.show({ type: 'error', text1: 'Failed to send confirmation email' });
    }
  };

  const sendSmsVerification = async (phoneNumber) => {
    try {
      await axios.post('https://verify.twilio.com/v2/Services/YOUR_SERVICE_SID/Verifications',{
          To: phoneNumber,
          Channel: 'sms'
        },
        {
          auth: {
            username: 'TWILIO_ACCOUNT_SID',
            password: 'TWILIO_AUTH_TOKEN'
          }
        }
      );
      Toast.show({ type: 'success', text1: 'SMS verification sent!' });
    } catch (error) {
      console.error('Twilio error:', error);
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

        Toast.show({
          type: 'success',
          text1: 'Registration successful!',
          text2: 'Please check your email and SMS for confirmation.'
        });

        navigation.navigate('Login');
      } catch (err) {
        console.error('Registration error:', err);
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: '#fff'
        }}
      >
        <Text className="text-3xl font-bold text-center mb-6">Create Account</Text>

        {[
          { name: 'username', placeholder: 'Username' },
          { name: 'email', placeholder: 'Email', keyboardType: 'email-address' },
          { name: 'phoneNumber', placeholder: 'Phone Number', keyboardType: 'phone-pad' },
          { name: 'password', placeholder: 'Password', secure: true },
          { name: 'confirmPassword', placeholder: 'Confirm Password', secure: true }
        ].map(({ name, placeholder, secure, keyboardType }) => (
          <View key={name} className="mb-4">
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
              className={`border px-3 py-2 rounded mb-2 ${
                formik.values.role === roleOption ? 'bg-cyan-200' : ''
              }`}
            >
              <Text>{roleOption}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting}
          className="bg-cyan-600 py-4 rounded"
        >
          <Text className="text-white text-center font-semibold">
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="mt-6"
        >
          <Text className="text-center text-cyan-600 underline">
            Already have an account? Login
          </Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
