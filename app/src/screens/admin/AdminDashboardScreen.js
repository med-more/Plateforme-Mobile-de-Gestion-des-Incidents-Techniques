import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import StatsCard from '../../components/StatsCard';
import QuickActions from '../../components/QuickActions';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  
  // Fetch data with React Query
  const { data: dashboardData, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Mock data fetch function
  async function fetchDashboardData() {
    // In a real app, this would be an API call
    return {
      stats: {
        totalTickets: 124,
        openTickets: 42,
        inProgress: 18,
        urgent: 7,
      },
      recentActivity: [
        { id: 1, title: 'Ticket #1256', action: 'assigned to John', time: '2 min ago' },
        { id: 2, title: 'Ticket #1255', action: 'status updated', time: '15 min ago' },
      ],
    };
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg">Chargement...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-red-500">Erreur de chargement</Text>
        <TouchableOpacity 
          onPress={refetch}
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl 
          refreshing={isLoading}
          onRefresh={refetch}
          colors={['#3b82f6']}
        />
      }
    >
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl font-bold text-gray-900">Tableau de bord</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500">Bienvenue, Administrateur</Text>
      </View>

      {/* Stats Cards */}
      <View className="px-6 py-4">
        <View className="flex-row flex-wrap justify-between">
          <StatsCard 
            title="Tickets ouverts" 
            value={dashboardData.stats.openTickets} 
            icon="alert-circle-outline"
            color="bg-red-100"
            textColor="text-red-800"
          />
          <StatsCard 
            title="En cours" 
            value={dashboardData.stats.inProgress} 
            icon="time-outline"
            color="bg-yellow-100"
            textColor="text-yellow-800"
          />
          <StatsCard 
            title="Urgents" 
            value={dashboardData.stats.urgent} 
            icon="warning-outline"
            color="bg-orange-100"
            textColor="text-orange-800"
          />
          <StatsCard 
            title="Total tickets" 
            value={dashboardData.stats.totalTickets} 
            icon="list-outline"
            color="bg-blue-100"
            textColor="text-blue-800"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-2">
        <QuickActions navigation={navigation} />
      </View>

      {/* Recent Activity */}
      <View className="px-6 py-4 mt-2 bg-white rounded-lg mx-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="font-bold text-lg">Activité récente</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ActivityLog')}>
            <Text className="text-blue-500">Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {dashboardData.recentActivity.map((item) => (
          <View key={item.id} className="py-2 border-b border-gray-100 last:border-0">
            <View className="flex-row justify-between">
              <Text className="font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-sm">{item.time}</Text>
            </View>
            <Text className="text-gray-500 mt-1">{item.action}</Text>
          </View>
        ))}
      </View>

      {/* View All Tickets Button */}
      <View className="px-6 py-6">
        <TouchableOpacity 
          onPress={() => navigation.navigate('TicketList')}
          className="bg-blue-600 py-3 rounded-lg flex-row items-center justify-center"
        >
          <Ionicons name="list" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Voir tous les tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AdminDashboardScreen;