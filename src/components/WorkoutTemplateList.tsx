import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSessionContext } from '../context/sessionContext'; // Ensure this is correctly imported
import { supabase } from '../lib/supabase';
import EditTemplateModal from "./EditTemplateModal";
import StartTemplateModal from "./StartTemplateModal"; // Import your initialized Supabase client


// Adjust these interfaces to match your data structure
interface Set {
    set_number: number;
    kilos: number;
    reps: number;
    set_id: number;
}

interface Workout {
    workout_name: string;
    workout_id: number;
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
    const [isStartModalVisible, setIsStartModalVisible] = useState(false);
    const [currentTemplateToEdit, setCurrentTemplateToEdit] = useState<WorkoutTemplate | null>(null);

    //New Code
    const onEdit = (templateId: number) => {
        console.log(templateId, templates.map(t => t.template_id));
        const templateToEdit = templates.find(template => template.template_id === templateId);
        if (templateToEdit) {
            setCurrentTemplateToEdit(templateToEdit);
            setIsEditModalVisible(true);
        } else {
            console.error("Template not found:", templateId);
        }
    };

    const onStart = (templateId: number) => {
        console.log(templateId, templates.map(t => t.template_id));
        const templateToEdit = templates.find(template => template.template_id === templateId);
        if (templateToEdit) {
            setCurrentTemplateToEdit(templateToEdit);
            setIsStartModalVisible(true);
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

        let errorOccurred = false;

        // Update the template name
        const { error: templateError } = await supabase
            .from('workout_templates')
            .update({ template_name: updatedTemplate.template_name })
            .eq('template_id', updatedTemplate.template_id);

        if (templateError) {
            console.error('Error updating template:', templateError);
            errorOccurred = true;
        }

        // Iterate over each workout and update its sets
        for (const workout of updatedTemplate.workouts) {
            for (const set of workout.sets) {
                const { error: setUpdateError } = await supabase
                    .from('workout_sets')
                    .update({
                        kilos: set.kilos,
                        reps: set.reps,
                        set_number: set.set_number
                    })
                    .eq('set_id', set.set_id);

                if (setUpdateError) {
                    console.error(`Error updating set ${set.set_id}:`, setUpdateError);
                    errorOccurred = true;
                }
            }
        }

        if (!errorOccurred) {
            // Refresh local state to reflect the update
            setTemplates(prevTemplates => prevTemplates.map(template =>
                template.template_id === updatedTemplate.template_id ? { ...template, ...updatedTemplate } : template
            ));
            console.log('Template and sets updated successfully');
        }
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
                    workout_id,
                    workout_sets!fk_workout (
                        set_id,
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
                workouts: template.workouts.map(workout => {
                    return ({
                        workout_name: workout.workout_name,
                        workout_id: workout.workout_id,
                        sets: workout.workout_sets.map(set => ({  // Rename workout_sets to sets
                            set_number: set.set_number,
                            kilos: set.kilos,
                            reps: set.reps,
                            set_id: set.set_id
                        }))
                    });
                })
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
                                <TouchableOpacity onPress={() => onStart(template.template_id)}>
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
                                <Text className="font-semibold">{workout.sets.length} x {workout.workout_name}</Text>
                            </View>
                        ))}

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

                <StartTemplateModal
                    isVisible={isStartModalVisible}
                    template={currentTemplateToEdit}
                    onClose={() => setIsStartModalVisible(false)}
                    onSave={(updatedTemplate) => {
                        updateTemplateInDatabase(updatedTemplate);
                        setIsStartModalVisible(false); // Optionally close the modal here
                    }}
                />

            </View>

        </ScrollView>


);
};

export default WorkoutTemplateList;
