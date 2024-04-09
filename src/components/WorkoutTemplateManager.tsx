// WorkoutTemplatesManager.tsx
import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import CreateWorkoutTemplateButton from './CreateWorkoutTemplateButton';
import WorkoutTemplateForm from './WorkoutTemplateForm';
import WorkoutTemplateList from './WorkoutTemplateList';
import NavBar from "./NavBar";
import {useSessionContext} from "../context/sessionContext";

const WorkoutTemplatesManager: React.FC = () => {
    const [formVisible, setFormVisible] = useState(false);
    const [templates, setTemplates] = useState([]);
    const {session} = useSessionContext()

    const handleSaveTemplate = (templateName: string, workouts: any[]) => {
        const newTemplate = { templateName, workouts };
        setTemplates([...templates, newTemplate]);
        setFormVisible(false); // Hide the form after saving
    };

    return (
        <View className="flex-1">
            <Modal visible={formVisible} animationType="slide" onRequestClose={() => setFormVisible(false)}>
                <WorkoutTemplateForm onSave={handleSaveTemplate} />
            </Modal>

            {/* Main content area for WorkoutTemplateList */}
            {/* Assuming the combined height of navbar and button is around h-24 (an example, adjust as needed) */}

                <WorkoutTemplateList templates={templates} />


            {/* Assuming CreateWorkoutTemplateButton is at the bottom above the navbar */}
            {/* This button might need custom positioning depending on your layout */}

            <CreateWorkoutTemplateButton onPress={() => setFormVisible(true)}  />


        </View>


    );
};

export default WorkoutTemplatesManager;
