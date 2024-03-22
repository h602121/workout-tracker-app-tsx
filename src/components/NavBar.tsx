import React from 'react';
import {View, TouchableOpacity, Platform, ViewStyle, Text, Pressable} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useNavigation } from "expo-router";


const Navbar: React.FC = () => {
    // Define platform-specific shadow styles as a React Native style object
    const shadowStyle: ViewStyle = Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
        },
        android: {
            elevation: 3,
        },
    }) || {};

    return (
        <View style={shadowStyle} className="absolute bottom-0 left-0 right-0 bg-gray-700 h-16 flex-row justify-around items-center rounded-t-3xl">
            <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={() => router.push('/main')}
            >
                <MaterialCommunityIcons name="home" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={() => router.push('/WorkoutsPage')} // Use router.push to navigate
            >
                <MaterialCommunityIcons name="dumbbell" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                className="flex-1 items-center justify-center"
                onPress={() => router.push('/AiPage')}
            >
                <MaterialCommunityIcons name="robot" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default Navbar;
