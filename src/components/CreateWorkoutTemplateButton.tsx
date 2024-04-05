import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
    onPress: () => void;
}

const CreateWorkoutTemplateButton: React.FC<Props> = ({ onPress }) => {
    return (
        // Use a View as a container to position the button
        <View className="absolute bottom-0 border p-8 items-center justify-center w-screen">
            <TouchableOpacity
                onPress={onPress}
                className="bg-blue-500 p-4 rounded-full shadow-md items-center justify-center "
                style={{ width: 60, height: 60, elevation: 10 }}
            >
                <MaterialCommunityIcons name="plus" color="white" size={24} />
            </TouchableOpacity>
        </View>
    );
};

export default CreateWorkoutTemplateButton;
