import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const UserCard: React.FC = () => {
    return (
        <View className="flex-row items-center bg-white h-16 w-full px-4 mt-4 rounded-lg shadow">
            {/* Profile Picture */}
            <Image
                source={{ uri: 'https://phantom-marca-mx.unidadeditorial.es/0ed82d49ad87961a637ef454511788eb/resize/660/f/webp/mx/assets/multimedia/imagenes/2023/05/20/16846178754107.jpg' }} // Replace with actual image URI
                style={{ width: 50, height: 50, borderRadius: 25 }}
                className="mr-4"
            />
            {/* Workouts Completed */}
            <Text className="flex-1 text-lg">
                Workouts: 66
            </Text>
            {/* Settings Icon */}
            <TouchableOpacity>
                <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

export default UserCard;
