import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const TicketSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .required('Le titre est requis'),
  category: Yup.string()
    .min(3, 'La catégorie doit contenir au moins 3 caractères')
    .required('La catégorie est requise')
});

const CreateTicketScreen = () => {
  const handleSubmit = (values, { resetForm }) => {
    Alert.alert('✅ Ticket simulé', 'Votre ticket a été créé (sans enregistrement).');
    resetForm();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Créer un nouveau ticket</Text>

        <Formik
          initialValues={{ title: '', category: '', description: '' }}
          validationSchema={TicketSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Titre du ticket</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.title && errors.title ? styles.inputError : null,
                ]}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                placeholder="Ex: Bug de connexion"
                placeholderTextColor="#999"
              />
              {touched.title && errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}

              <Text style={styles.label}>Catégorie</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.category && errors.category ? styles.inputError : null,
                ]}
                onChangeText={handleChange('category')}
                onBlur={handleBlur('category')}
                value={values.category}
                placeholder="Ex: Matériel, Logiciel, Réseau"
                placeholderTextColor="#999"
              />
              {touched.category && errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  touched.description && errors.description ? styles.inputError : null,
                ]}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder="Décrivez le problème rencontré"
                placeholderTextColor="#999"
                multiline
              />
              {touched.description && errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Soumettre le ticket</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default CreateTicketScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f5f6fa',
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2f3640',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#2f3640',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdde1',
    marginBottom: 4,
    fontSize: 16,
    color: '#2f3640',
  },
  inputError: {
    borderColor: '#e84118',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#273c75',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#e84118',
    marginBottom: 12,
    fontSize: 13,
  },
});
