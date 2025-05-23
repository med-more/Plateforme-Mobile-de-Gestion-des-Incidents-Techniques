import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CreateTicketScreen from './src/screens/tickets/CreateTicketScreen'; // Adjust path if needed

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <CreateTicketScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
