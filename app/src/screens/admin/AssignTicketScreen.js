import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery } from '@tanstack/react-query';

const AssignTicketScreen = ({ route }) => {
  const { ticketId } = route.params;
  const [assignedTo, setAssignedTo] = useState('');
  
  const { data: users } = useQuery({
    queryKey: ['agents'],
    queryFn: () => fetchAgents(),
  });

  const { mutate: assignTicket } = useMutation({
    mutationFn: () => assignTicketToAgent(ticketId, assignedTo),
    onSuccess: () => navigation.goBack(),
  });

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-4">Assigner le ticket</Text>
      
      <Picker
        selectedValue={assignedTo}
        onValueChange={setAssignedTo}
        className="mb-4 bg-white rounded"
      >
        <Picker.Item label="Sélectionner un agent" value="" />
        {users?.map(user => (
          <Picker.Item key={user.id} label={user.name} value={user.id} />
        ))}
      </Picker>

      <TouchableOpacity
        onPress={assignTicket}
        disabled={!assignedTo}
        className={`py-3 rounded-lg ${assignedTo ? 'bg-blue-600' : 'bg-gray-400'}`}
      >
        <Text className="text-white text-center font-bold">Assigner</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AssignTicketScreen;