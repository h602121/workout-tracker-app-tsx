import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSessionContext } from '../context/sessionContext'; // Ensure this is correctly imported
import { supabase } from '../lib/supabase'; // Import your initialized Supabase client


// Adjust these interfaces to match your data structure
interface Set {
    set_number: number;
    kilos: number;
    reps: number;
}

interface Workout {
    workout_name: string;
    sets: Set[];
}

interface WorkoutTemplate {
    template_name: string;
    workouts: Workout[];
}

const WorkoutTemplateList: React.FC = () => {
    const { session } = useSessionContext();
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from('workout_templates')
                .select(`
                template_name,
                workouts (
                    workout_name,
                    workout_sets (
                        set_number,
                        kilos,
                        reps
                    )
                )
            `)
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error fetching templates', error);
                return;
            }

            // Transform the data to match the WorkoutTemplate[] type
            const transformedTemplates: WorkoutTemplate[] = data?.map(template => ({
                template_name: template.template_name,
                workouts: template.workouts.map(workout => ({
                    workout_name: workout.workout_name,
                    sets: workout.workout_sets.map(set => ({  // Rename workout_sets to sets
                        set_number: set.set_number,
                        kilos: set.kilos,
                        reps: set.reps
                    }))
                }))
            })) || [];

            setTemplates(transformedTemplates);
        };

        fetchTemplates();
    }, [session]);

    // Handlers for edit, delete, start will be implemented here

    return (
        <ScrollView className="flex-1 flex-grow-1 bg-white mt-10 mb-36">
            <View className="p-4">
                {templates.map((template, index) => (
                    <View key={index} className="mb-4 bg-blue-300 rounded-lg shadow-md overflow-hidden">
                        <View className="flex-row justify-between items-center p-3 bg-gray-700">
                            {/* Left side: Template name and play button */}
                            <View className="flex-row items-center">
                                <Text className="text-lg font-bold text-white">{template.template_name}</Text>
                                <TouchableOpacity onPress={() => onEdit(index)}>
                                    <MaterialCommunityIcons name="play" size={24} color="#90EE90" />
                                </TouchableOpacity>
                            </View>

                            {/* Right side: Edit and Delete buttons */}
                            <View className="flex-row">
                                <TouchableOpacity onPress={() => onEdit(index)}>
                                    <MaterialCommunityIcons name="pencil" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onDelete(index)} className="ml-2">
                                    <MaterialCommunityIcons name="delete" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>



                        {/* Workout List */}
                        {template.workouts.map((workout, workoutIndex) => (
                            <View key={workoutIndex} className="p-3 bg-gray-100">
                                <Text className="font-semibold">{workout.workout_name}</Text>
                                {workout.sets.map((set, setIndex) => (
                                    <View key={setIndex} className="flex-row justify-between mt-1">
                                        <Text className="text-sm">Set: {set.set_number}</Text>
                                        <Text className="text-sm">Kg: {set.kilos}</Text>
                                        <Text className="text-sm">Reps: {set.reps}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}

                        {/* Placeholder for Start Button */}

                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default WorkoutTemplateList;
