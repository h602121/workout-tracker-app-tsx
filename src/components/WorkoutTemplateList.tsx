import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure this is correctly imported

interface Workout {
    name: string;
    sets: number;
    kg: number;
    reps: number;
}

interface Props {
    templates: { templateName: string; workouts: Workout[] }[];
    onDelete: (templateIndex: number) => void;
    onEdit: (templateIndex: number) => void;
    onStart: (templateIndex: number) => void; // Handler for starting a workout
}

const WorkoutTemplateList: React.FC<Props> = ({ templates, onDelete, onEdit, onStart }) => {
    return (
        <ScrollView className="flex-1">
            <View className="p-2">
                {templates.map((template, index) => (
                    <View key={index} className="mb-4 bg-blue-300 rounded-lg shadow overflow-hidden">
                        <View className="flex-row justify-between items-center p-3 bg-gray-700">
                            <Text className="text-lg font-bold text-white flex-1">{template.templateName}</Text>
                            <TouchableOpacity onPress={() => onEdit(index)}>
                                <MaterialCommunityIcons name="pencil" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onDelete(index)} className="ml-2">
                                <MaterialCommunityIcons name="delete" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Exercises List */}
                        <View className="p-3 bg-gray-100">
                            {template.workouts.map((workout, workoutIndex) => (
                                <View key={workoutIndex} className="mb-3 p-2 rounded-lg bg-gray-100">
                                    <Text className="font-semibold">{workout.name}</Text>
                                    <View className="flex-row justify-between mt-1">
                                        <Text className="text-sm">Sets: {workout.sets}</Text>
                                        <Text className="text-sm">Kg: {workout.kg}</Text>
                                        <Text className="text-sm">Reps: {workout.reps}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        {/* Start Button at the bottom of each card */}
                        <TouchableOpacity
                            className="bg-green-400 p-3 rounded-b-lg items-center flex-row justify-center h-12"
                            onPress={() => onStart(index)}>
                            <MaterialCommunityIcons name="play" size={24} color="white" />
                            <Text className="text-white font-bold ml-2">Start</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default WorkoutTemplateList;
