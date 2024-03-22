import React from 'react';
import { View, Text } from 'react-native';

const Dashboard: React.FC = () => {
    // Example data - replace with your actual data source
    const weeklyGoal = 5;
    const workoutsCompleted = 3; // for simplicity, considering 3 workouts done
    const workoutsProgressPercent = Math.round((workoutsCompleted / weeklyGoal) * 100);

    const weeklyActivity = {
        Monday: 1,
        Tuesday: 2,
    };

    const benchProgressYearly = "10% increase"; // Example progress, adjust as needed

    return (
        <View className="flex-1 px-4 py-2">
            <Text className="text-xl font-bold text-center mb-4">Training Dashboard</Text>

            {/* Workout Progress */}
            <View className="bg-blue-200 rounded-lg p-4 mb-4">
                <Text className="text-lg font-semibold">Workout Progress</Text>
                <Text>{workoutsCompleted} / {weeklyGoal} workouts</Text>
                <Text>{workoutsProgressPercent}% of weekly goal</Text>
                <View className="bg-blue-500 h-2 rounded-full mt-2" style={{width: `${workoutsProgressPercent}%`}}></View>
            </View>

            {/* Weekly Activity */}
            <View className="bg-green-200 rounded-lg p-4 mb-4">
                <Text className="text-lg font-semibold">Weekly Activity</Text>
                <View className="mt-2">
                    <Text>Monday: {weeklyActivity.Monday} workout(s)</Text>
                    <Text>Tuesday: {weeklyActivity.Tuesday} workout(s)</Text>
                </View>
            </View>

            {/* Bench Press Progress */}
            <View className="bg-yellow-200 rounded-lg p-4">
                <Text className="text-lg font-semibold">Bench Press Progress This Year</Text>
                <Text className="mt-2">{benchProgressYearly}</Text>
            </View>
        </View>
    );
};

export default Dashboard;
