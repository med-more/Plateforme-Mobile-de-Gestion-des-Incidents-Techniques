import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useQuery } from '@tanstack/react-query';
import { Dimensions } from 'react-native';

const StatsScreen = () => {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchStats(),
  });

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-6">Statistiques</Text>
      
      {data && (
        <BarChart
          data={{
            labels: ['Ouverts', 'En cours', 'Résolus'],
            datasets: [{
              data: [data.open, data.inProgress, data.closed]
            }]
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      )}
    </View>
  );
};

export default StatsScreen;