import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native'; // Pour les exemples de style

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AssignTicketScreen from '../screens/AssignTicketScreen';
import StatsScreen from '../screens/StatsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ userRole = 'admin' }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AdminDashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6', // Exemple : bleu Tailwind (bg-blue-500)
          },
          headerTintColor: 'white', // Couleur du texte du header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: 'bg-gray-100', // Style de fond des écrans (NativeWind)
        }}
      >
        {/* Écran Dashboard */}
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={({ route }) => ({ 
            title: route.params?.title || 'Tableau de bord Admin',
            headerRight: () => (
              <Text className="text-white mr-4 font-semibold">
                {userRole.toUpperCase()}
              </Text>
            ),
          })} 
        />

        {/* Écran d'assignation (conditionnel) */}
        {userRole === 'admin' && (
          <Stack.Screen 
            name="AssignTicket" 
            component={AssignTicketScreen} 
            options={{
              title: 'Assigner un Ticket',
              headerBackTitle: 'Retour', // Texte personnalisé pour le bouton "back"
            }} 
          />
        )}

        {/* Écran des stats */}
        <Stack.Screen 
          name="Stats" 
          component={StatsScreen} 
          options={{
            title: userRole === 'admin' ? 'Statistiques Avancées' : 'Statistiques',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;