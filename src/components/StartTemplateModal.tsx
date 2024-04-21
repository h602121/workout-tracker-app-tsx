import React, {useEffect, useRef, useState} from 'react';
import {Modal, Text, View, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from "react-native-elements";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { supabase } from '../lib/supabase';

// Update this interface as per your recent changes
interface Set {
    set_number: number;
    kilos: number;
    reps: number;
    set_id: number;
    isCompleted?: boolean;
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

interface StartTemplateModalProps {
    isVisible: boolean;
    template: WorkoutTemplate | null;
    onClose: () => void;
    onSave: (updatedTemplate: WorkoutTemplate) => void;
}


// Interfaces defined above remain unchanged

const StartTemplateModal: React.FC<StartTemplateModalProps> = ({isVisible, template, onClose, onSave}) => {
    const [data, setData] = React.useState<WorkoutTemplate | null>(template);
    const [deletedSetIds, setDeletedSetIds] = useState<number[]>([]);
    const [isAddWorkoutModalVisible, setIsAddWorkoutModalVisible] = useState(false);
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);



    useEffect(() => {
        setData(template);
    }, [template]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
            console.log('Timer tick:', prevTimer + 1);  // Log each tick for diagnostic purposes
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                console.log('Interval cleared');  // Confirm interval clearance on unmount
            }
        };
    }, []);  // Empty dependency array ensures this runs only on mount


    if (data === null) return null;

    const displayTime = () => {
        const seconds = timer % 60;
        const minutes = Math.floor(timer / 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const onSubmit = () => {
        onSave(data);
        submitDeletions();
        onClose();
    };

    const onChangeTemplateName = (text: string) => {
        setData({...data, template_name: text});
    };



    const updateSetDetail = (setId: number, field: keyof Set, value: number) => {
        setData((prev) => {
            if(prev === null) return prev;

            const result = prev.workouts.map((workout => {
                const set = workout.sets.find(set => set.set_id === setId)
                if (set) set[field] = Number(value)

                return workout
            }))
            return  {...prev, ...result}
        });
    };

    const deleteSet = (setId: number) => {
        setData((prev) => {
            if (prev === null) return prev;

            const updatedWorkouts = prev.workouts.map((workout) => {
                // Filter out the set to be deleted and track the deleted set ID
                const filteredSets = workout.sets.filter(set => {
                    if (set.set_id === setId) {
                        setDeletedSetIds((prevIds) => [...prevIds, setId]);
                        return false;
                    }
                    return true;
                });

                // Renumber the remaining sets sequentially
                const renumberedSets = filteredSets.map((set, index) => ({
                    ...set,
                    set_number: index + 1
                }));

                return {...workout, sets: renumberedSets};
            });

            return {...prev, workouts: updatedWorkouts};
        });
    };


    const submitDeletions = async () => {
        if (deletedSetIds.length === 0) {
            console.log("No sets to delete");
            return;
        }

        const { data, error } = await supabase
            .from('workout_sets')
            .delete()
            .in('set_id', deletedSetIds);

        if (error) {
            console.error('Failed to delete sets:', error);
        } else {
            console.log('Deleted sets successfully:', data);
            setDeletedSetIds([]); // Clear the tracked deletions after successful operation
        }
    };

    const addNewSet = async (workoutId: number) => {
        // First find the current highest set_number for the given workoutId
        const currentWorkout = data?.workouts.find(workout => workout.workout_id === workoutId);
        const currentMaxSetNumber = currentWorkout?.sets.reduce((max, set) => Math.max(max, set.set_number), 0) || 0;
        const nextSetNumber = currentMaxSetNumber + 1;

        // Insert the new set into Supabase with kilos and reps initialized to 0 and set_number to nextSetNumber
        const { data: newData, error } = await supabase
            .from('workout_sets')
            .insert([
                {
                    workout_id: workoutId,
                    set_number: nextSetNumber,
                    kilos: 0,
                    reps: 0
                }
            ]).select();

        if (error) {
            console.error('Error creating new set:', error);
            return;
        }

        if (newData && newData.length > 0) {
            const newSet = newData[0];

            // Update the local state to include this new set in the correct workout
            setData(prev => {
                if (prev === null) return prev;
                return {
                    ...prev,
                    workouts: prev.workouts.map(workout => {
                        if (workout.workout_id === workoutId) {
                            return {
                                ...workout,
                                sets: [...workout.sets, newSet]
                            };
                        }
                        return workout;
                    })
                };
            });
        }
    };

    const addNewWorkout = async (templateId: number, workoutName: string) => {
        //  Insert new workout into Supabase, linked to the template_id
        if (!workoutName) {
            alert("Please enter a workout name.");
            return;
        }

        const workoutResponse = await supabase
            .from('workouts')
            .insert([{
                workout_name: workoutName,
                template_id: templateId
            }])
            .select('*');
        if (workoutResponse.error) {
            console.error('Error inserting new workout:', workoutResponse.error);
            return;
        }

        const newWorkout = workoutResponse.data[0];

        //  Insert new set for the workout into Supabase
        const setResponse = await supabase
            .from('workout_sets')
            .insert([
                {
                    workout_id: newWorkout.workout_id,
                    set_number: 1,
                    kilos: 0,
                    reps: 0
                }
            ])
            .select('*');

        if (setResponse.error) {
            console.error('Error inserting new set:', setResponse.error);
            return;
        }

        const newSet = setResponse.data[0];

        // Step 3: Update local state to include the new workout and its set
        setData(prev => {
            if (prev === null) return prev;
            const updatedWorkouts = [...prev.workouts, {
                ...newWorkout,
                sets: [newSet]
            }];
            return {
                ...prev,
                workouts: updatedWorkouts
            };
        });
        setNewWorkoutName("");
        setIsAddWorkoutModalVisible(false);
    };

    const deleteWorkout = async (workoutId: number) => {
        // Step 1: Delete the workout from the database
        const { error } = await supabase
            .from('workouts')
            .delete()
            .match({ workout_id: workoutId });

        if (error) {
            console.error('Failed to delete workout and its sets:', error);
            return;
        }

        // Update local state to remove the workout and its sets
        setData(prev => {
            if (prev === null) return prev;

            const updatedWorkouts = prev.workouts.filter(workout => workout.workout_id !== workoutId);
            return { ...prev, workouts: updatedWorkouts };
        });
    };

    const completeSet = (workoutId: number, setId: number) => {
        setData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                workouts: prev.workouts.map(workout => {
                    if (workout.workout_id === workoutId) {
                        return {
                            ...workout,
                            sets: workout.sets.map(set => {
                                if (set.set_id === setId) {
                                    if (set.isCompleted) {
                                        return {...set, isCompleted: false};
                                    }
                                    return {...set, isCompleted: true}; // Toggle completion status
                                }
                                return set;
                            })
                        };
                    }
                    return workout;
                })
            };
        });
    };






    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <ScrollView className='flex-1 p-4 bg-white' contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}>
                <Text className='text-2xl font-bold mb-5'>{data.template_name}</Text>
                <Text className='text-xl  mb-5'>Timer: {displayTime()}</Text>



                {data.workouts.map((workout) => {
                    return (
                        <View key={workout.workout_id} className='mb-4'>
                            <View className = "flex-row items-center">
                                <Text className='text-lg font-bold mb-2'>{workout.workout_name}</Text>
                            </View>
                            <View className='flex-row justify-between items-center mb-2'>
                                <Text className=' p-1 text-center flex-1/2 mx-3 '>Set</Text>
                                <Text className='text-center flex-1 mx-1 '>Kilos</Text>
                                <Text className='text-center flex-1 mx-1  mr-11'>Reps</Text>


                            </View>
                            {workout.sets.map((set, index) => {
                                return (
                                    <View key={set.set_id}
                                          className={`flex-row justify-between items-center  p-1 ${
                                              set.isCompleted ? 'bg-green-200' : 'bg-white'
                                          } ${
                                              index === 0 ? 'rounded-t-lg' : ''  // Top rounding for the first item
                                          } ${
                                              index === workout.sets.length - 1 ? 'rounded-b-lg' : ''  // Bottom rounding for the last item
                                          }`}>

                                        <TextInput
                                            value={String(set.set_number)}
                                            className='p-1 rounded text-center flex-1/2 mx-3 text-blue-500'
                                            editable={false}
                                        />
                                        <TextInput
                                            onChangeText={(text) => updateSetDetail(set.set_id, 'kilos', Number(text))}
                                            value={String(set.kilos)}
                                            className={`border ${set.isCompleted?'border-green-200':'border-gray-300'} p-1 rounded text-center flex-1 mx-1`}
                                            keyboardType="numeric"
                                        />
                                        <TextInput
                                            onChangeText={(text) => updateSetDetail(set.set_id, 'reps', Number(text))}
                                            value={String(set.reps)}
                                            className={`border ${set.isCompleted?'border-green-200':'border-gray-300'} p-1 rounded text-center flex-1 mx-1`}
                                            keyboardType="numeric"
                                        />
                                        <TouchableOpacity
                                            onPress={() => completeSet(workout.workout_id, set.set_id)}
                                            className="p-2 bg-gray-200 rounded-full"
                                        >
                                            <MaterialCommunityIcons name="check" size={18} color={set.isCompleted ? "darkgreen" : "green"}/>
                                        </TouchableOpacity>
                                    </View>

                                );
                            })}
                            <TouchableOpacity
                                onPress={() => addNewSet(workout.workout_id)}
                                className='mb-4 mt-1'
                            >
                                <Text className='text-blue-500 text-center'>Add New Set</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
                <View className='items-center'>
                    <TouchableOpacity
                        onPress={() => setIsAddWorkoutModalVisible(true)}
                        className='mb-4 mt-1'
                    >
                        <Text className='text-blue-500 text-center text-xl'>Add Workout</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
            <View className="absolute  bottom-0 w-full bg-gray-100 p-3 shadow-top flex-row justify-between items-center rounded-t-2xl">
                <TouchableOpacity onPress={onClose} className="flex flex-row items-center">
                    <MaterialCommunityIcons name="close-circle" size={24} color="#ef4444" className="mr-2" />
                    <Text className="text-red-500 font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSubmit} className="flex flex-row items-center">
                    <MaterialCommunityIcons name="check-circle" size={24} color="#3b82f6" className="mr-2" />
                    <Text className="text-blue-500 font-bold">Finish</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddWorkoutModalVisible}
                onRequestClose={() => setIsAddWorkoutModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center  bg-opacity-50 px-4">
                    <View className="bg-gray-300 rounded-lg p-6 shadow-lg w-full max-w-lg">
                        <TextInput
                            placeholder="Enter Workout Name"
                            value={newWorkoutName}
                            onChangeText={setNewWorkoutName}
                            className="h-12 mb-4 border border-gray-200 rounded p-2 text-lg"
                            placeholderTextColor="black"
                        />
                        <TouchableOpacity
                            className="bg-blue-500 rounded-lg p-3 shadow"
                            onPress={() => addNewWorkout(data?.template_id, newWorkoutName)}
                        >
                            <Text className="text-white text-center text-lg">Add Workout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Modal>


    );
};

export default StartTemplateModal;
