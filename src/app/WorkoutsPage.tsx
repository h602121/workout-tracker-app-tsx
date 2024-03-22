import React from 'react';
import { View } from 'react-native';
import WorkoutTemplatesManager from "../components/WorkoutTemplateManager";
import NavBar from "../components/NavBar";

const WorkoutsPage: React.FC = () => {
    return (
        <View className="flex-1 px-4 py-2">
            <WorkoutTemplatesManager />
            <NavBar />
        </View>
    );
};

export default WorkoutsPage;
