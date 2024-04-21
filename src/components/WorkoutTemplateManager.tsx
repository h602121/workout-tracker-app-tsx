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


                <WorkoutTemplateList templates={templates} />



            <CreateWorkoutTemplateButton onPress={() => setFormVisible(true)}  />


        </View>


    );
};

export default WorkoutTemplatesManager;
