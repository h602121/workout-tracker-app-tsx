import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

interface Workout {
    name: string;
    sets: number;
    kg: number;
    reps: number;
}

interface Props {
    onSave: (templateName: string, workouts: Workout[]) => void;
}

const WorkoutTemplateForm: React.FC<Props> = ({ onSave }) => {
    const [templateName, setTemplateName] = useState('');
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [tempWorkout, setTempWorkout] = useState({ name: '', sets: '', kg: '', reps: '' });

    const addWorkout = () => {
        if (!tempWorkout.name || !tempWorkout.sets || !tempWorkout.kg || !tempWorkout.reps) {
            // Optional: Add validation message
            return;
        }
        setWorkouts([...workouts, {
            name: tempWorkout.name,
            sets: parseInt(tempWorkout.sets),
            kg: parseInt(tempWorkout.kg),
            reps: parseInt(tempWorkout.reps)
        }]);
        setTempWorkout({ name: '', sets: '', kg: '', reps: '' }); // Reset temporary workout input
    };

    return (
        <ScrollView>
            <View className="p-4">
                <TextInput
                    className="bg-white border border-gray-300 p-2 rounded-lg mb-4"
                    placeholder="Template Name"
                    value={templateName}
                    onChangeText={setTemplateName}
                />
                <TextInput
                    className="bg-white border border-gray-300 p-2 rounded-lg mb-4"
                    placeholder="Workout Name"
                    value={tempWorkout.name}
                    onChangeText={(text) => setTempWorkout({ ...tempWorkout, name: text })}
                />
                {/* Inputs for sets, kg, and reps as number inputs */}
                <TextInput
                    className="bg-white border border-gray-300 p-2 rounded-lg mb-4"
                    placeholder="Sets"
                    keyboardType="numeric"
                    value={tempWorkout.sets}
                    onChangeText={(text) => setTempWorkout({ ...tempWorkout, sets: text })}
                />
                <TextInput
                    className="bg-white border border-gray-300 p-2 rounded-lg mb-4"
                    placeholder="Kg"
                    keyboardType="numeric"
                    value={tempWorkout.kg}
                    onChangeText={(text) => setTempWorkout({ ...tempWorkout, kg: text })}
                />
                <TextInput
                    className="bg-white border border-gray-300 p-2 rounded-lg mb-4"
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={tempWorkout.reps}
                    onChangeText={(text) => setTempWorkout({ ...tempWorkout, reps: text })}
                />
                <TouchableOpacity
                    className="bg-blue-500 p-3 rounded-lg mb-4 items-center"
                    onPress={addWorkout}
                >
                    <Text className="text-white font-bold">Add Workout to Template</Text>
                </TouchableOpacity>

                {/* Display Added Workouts */}
                {workouts.length > 0 && (
                    <View className="mb-4">
                        <Text className="mb-2 font-bold">Added Workouts:</Text>
                        {workouts.map((workout, index) => (
                            <View key={index} className="mb-2 p-2 bg-gray-200 rounded-lg">
                                <Text>Name: {workout.name}</Text>
                                <Text>Sets: {workout.sets}</Text>
                                <Text>Kg: {workout.kg}</Text>
                                <Text>Reps: {workout.reps}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    className="bg-green-500 p-3 rounded-lg items-center"
                    onPress={() => onSave(templateName, workouts)}
                >
                    <Text className="text-white font-bold">Save Template</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default WorkoutTemplateForm;
