import React from 'react';
import { View, Text } from 'react-native';

interface Workout {
    name: string;
    sets: number;
    kg: number;
    reps: number;
}

interface Props {
    template: { templateName: string; workouts: Workout[] };
}

const WorkoutTemplateItem: React.FC<Props> = ({ template }) => {
    return (
        <View className="mb-4">
            <Text>{template.templateName}</Text>
            {template.workouts.map((workout, index) => (
                <Text key={index}>{`${workout.name}: ${workout.sets} sets`}</Text>
            ))}
        </View>
    );
};

export default WorkoutTemplateItem;
