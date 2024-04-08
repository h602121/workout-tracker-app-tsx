import React, {useEffect} from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

// Update this interface as per your recent changes
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
    template_id: number; // Ensure this is included
    template_name: string;
    workouts: Workout[];
}

interface EditTemplateModalProps {
    isVisible: boolean;
    template: WorkoutTemplate;
    onClose: () => void;
    onSave: (updatedTemplate: WorkoutTemplate) => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({ isVisible, template, onClose, onSave }) => {
  const [data, setData] = React.useState<WorkoutTemplate | null>(template);

    useEffect(() => {
        setData(template);
    }, [template]);
    if (data === null) return null;
    const onSubmit = () => {
        onSave(data); // Pass the entire data object, including template_id
        onClose(); // Optionally close the modal after saving
    };
console.log(data)
 const onChange = (text: string) => {
        setData({ ...data, template_name: text });
    }

    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <ScrollView className="flex-1 p-4">
                <Text className="text-xl font-bold mb-4">Edit Template</Text>

                <TextInput

                    onChangeText={onChange}
                    value={data.template_name}
                    className="border p-2 rounded mb-4"
                    placeholder="Template Name"
                />

                {/* Extend this section for additional editable fields if necessary */}

                <View className="flex-row justify-around">
                    <TouchableOpacity onPress={onSubmit} className="bg-blue-500 p-3 rounded">
                        <Text className="text-white text-center">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} className="bg-red-500 p-3 rounded">
                        <Text className="text-white text-center">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
};

export default EditTemplateModal;
