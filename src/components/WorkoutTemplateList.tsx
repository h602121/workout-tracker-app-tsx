import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSessionContext } from '../context/sessionContext'; // Ensure this is correctly imported
import { supabase } from '../lib/supabase';
import EditTemplateModal from "./EditTemplateModal"; // Import your initialized Supabase client


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
    template_id: number;
    template_name: string;
    workouts: Workout[];
}

const WorkoutTemplateList: React.FC = () => {
    const { session } = useSessionContext();
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentTemplateToEdit, setCurrentTemplateToEdit] = useState<WorkoutTemplate | null>(null);

    //New Code
    const onEdit = (templateId: number) => {
        const templateToEdit = templates.find(template => template.template_id === templateId);
        if (templateToEdit) {
            setCurrentTemplateToEdit(templateToEdit);
            setIsEditModalVisible(true);
        } else {
            console.error("Template not found:", templateId);
        }
    };

//New Code
    const updateTemplateInDatabase = async (updatedTemplate: WorkoutTemplate) => {
        if (!updatedTemplate.template_id) {
            console.error('Template missing template_id, cannot update');
            return;
        }

        const { data, error } = await supabase
            .from('workout_templates')
            .update({
                template_name: updatedTemplate.template_name,
                // Ensure other fields are included as necessary
            })
            .match({ template_id: updatedTemplate.template_id }); // Use template_id here

        if (error) {
            console.error('Error updating template:', error);
            return;
        }

        // Refresh local state to reflect the update
        setTemplates(prevTemplates => prevTemplates.map(template =>
            template.template_id === updatedTemplate.template_id ? { ...template, ...updatedTemplate } : template
        ));

        console.log('Template updated successfully', data);
    };




    useEffect(() => {
        const fetchTemplates = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from('workout_templates')
                .select(`
                template_name,
                 template_id,
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
                template_id: template.template_id,
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
                                <Text className="text-lg font-bold text-white">{template.template_name} </Text>
                                <TouchableOpacity onPress={() => onStart(index)}>
                                    <MaterialCommunityIcons name="play" size={24} color="#90EE90" />
                                </TouchableOpacity>
                            </View>

                            {/* Right side: Edit and Delete buttons */}
                            <View className="flex-row">
                                <TouchableOpacity onPress={() => onEdit(template.template_id)}>
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

                <EditTemplateModal
                    isVisible={isEditModalVisible}
                    template={currentTemplateToEdit}
                    onClose={() => setIsEditModalVisible(false)}
                    onSave={(updatedTemplate) => {
                        updateTemplateInDatabase(updatedTemplate);
                        setIsEditModalVisible(false); // Optionally close the modal here
                    }}
                />

            </View>

        </ScrollView>


);
};

export default WorkoutTemplateList;
