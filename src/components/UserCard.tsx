import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {router, useNavigation} from "expo-router";
import AccountPage from "../app/AccountPage";
import {Session} from "@supabase/supabase-js";
import {supabase} from "../lib/supabase";
import {useSessionContext} from "../context/sessionContext";

export default function UserCard (){
    const navigator = useNavigation();
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const {session} = useSessionContext()

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <View className="flex-row items-center bg-white h-16 w-full px-4 mt-8 rounded-lg shadow ">
            {/* Profile Picture */}
            <Image
                source={{ uri: 'https://phantom-marca-mx.unidadeditorial.es/0ed82d49ad87961a637ef454511788eb/resize/660/f/webp/mx/assets/multimedia/imagenes/2023/05/20/16846178754107.jpg' }} // Replace with actual image URI
                style={{ width: 50, height: 50, borderRadius: 25 }}
                className="mr-4"
            />
            {/* Workouts Completed */}
            <Text className="flex-1 text-lg">
                Hi {username}!
            </Text>
            {/* Settings Icon */}
            <TouchableOpacity onPress={() => router.push('/AccountPage')}>
                <Ionicons name="settings-outline" size={24} color="black"/>
            </TouchableOpacity>
        </View>
    );
};

