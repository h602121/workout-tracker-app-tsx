import React, {useEffect} from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

// Update this interface as per your recent changes
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
    template_id: number; // Ensure this is included
    template_name: string;
    workouts: Workout[];
}

interface EditTemplateModalProps {
    isVisible: boolean;
    template: WorkoutTemplate | null;
    onClose: () => void;
    onSave: (updatedTemplate: WorkoutTemplate) => void;
}



// Interfaces defined above remain unchanged

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({ isVisible, template, onClose, onSave }) => {
    const [data, setData] = React.useState<WorkoutTemplate | null>(template);

    useEffect(() => {
        setData(template);
    }, [template]);

    if (data === null) return null;

    const onSubmit = () => {
        onSave(data);
        onClose();
    };

    const onChangeTemplateName = (text) => {
        setData({ ...data, template_name: text });
    };

    const updateSetDetail = (workoutId: number, setId: number, field: string, value) => {
        const newData = { ...data };
        const workoutIndex = newData.workouts.findIndex(workout => workout.workout_id === workoutId);
        const setIndex = newData.workouts[workoutIndex].sets.findIndex(set => set.set_id === setId);
        newData.workouts[workoutIndex].sets[setIndex][field] = Number(value);
        setData(newData);
    };

    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <ScrollView className='flex-1 p-4 bg-white'>
                <Text className='text-xl font-bold mb-4'>Edit Template</Text>

                <TextInput
                    onChangeText={onChangeTemplateName}
                    value={data.template_name}
                    className='border border-gray-300 p-2 rounded mb-4'
                    placeholder="Template Name"
                />

                {data.workouts.map((workout) => (
                    <View key={workout.workout_id} className='mb-4'>
                        <Text className='text-lg font-bold mb-2'>{workout.workout_name}</Text>
                        {workout.sets.map((set) => (
                            <View key={set.set_id} className='flex-row justify-between items-center mb-2'>
                                <TextInput
                                    onChangeText={(text) => updateSetDetail(workout.workout_id, set.set_id, 'set_number', text)}
                                    value={String(set.set_number)}
                                    className='border border-gray-300 p-1 rounded text-center flex-1 mx-1'
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    onChangeText={(text) => updateSetDetail(workout.workout_id, set.set_id, 'kilos', text)}
                                    value={String(set.kilos)}
                                    className='border border-gray-300 p-1 rounded text-center flex-1 mx-1'
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    onChangeText={(text) => updateSetDetail(workout.workout_id, set.set_id, 'reps', text)}
                                    value={String(set.reps)}
                                    className='border border-gray-300 p-1 rounded text-center flex-1 mx-1'
                                    keyboardType="numeric"
                                />
                            </View>
                        ))}
                    </View>
                ))}

                <View className='items-center'>
                    <TouchableOpacity onPress={onSubmit} className='bg-blue-500 p-3 rounded mb-4'>
                        <Text className='text-white text-center text-lg'>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} className='bg-red-500 p-3 rounded'>
                        <Text className='text-white text-center text-lg'>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
};

export default EditTemplateModal;
