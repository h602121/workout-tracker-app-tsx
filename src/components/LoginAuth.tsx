import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Alert, Image, AppState, TouchableWithoutFeedback, Keyboard} from 'react-native';
import TextInput from "../components/TextInput"; // Your custom TextInput, ensure it accepts className for styling
import { supabase } from '../lib/supabase';
import {Link, router, useNavigation} from "expo-router";
import {Session} from "@supabase/supabase-js";

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})
export default function LoginAuth({ session }: { session: Session | null }) {
    const navigator = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        Keyboard.dismiss();
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            Alert.alert(error.message);
        } else {
            router.push('/main'); // Direct call to navigate
        }

        setLoading(false)
    }


    async function signUpWithEmail() {
        Keyboard.dismiss();

        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        else{
            Alert.alert('Your account is ready')
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                Alert.alert(error.message);
            } else {
                await signInWithEmail()
                router.push('/main'); // Direct call to navigate
            }
        }
        setLoading(false)
    }

    return (

        <View className="flex-1 justify-center items-center bg-white px-5 py-8">

           <Image className="w-40 h-40 mb-12 rounded-full" source={require('../assets/logo-ai.png')}></Image>

            <View className="w-full mb-4">
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    className="text-input shadow-sm rounded-lg bg-gray-100 px-4 py-2"
                />
            </View>
            <View className="w-full mb-6">
                <TextInput
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                    className="text-input shadow-sm rounded-lg bg-gray-100 px-4 py-2"
                />
            </View>
            <TouchableOpacity
                onPress={signInWithEmail}
                disabled={loading}
                className="w-full bg-blue-500 p-3 rounded-lg shadow mb-4"
            >
                <Text className="text-white text-center font-bold">Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={signUpWithEmail}
                disabled={loading}
                className="w-full bg-blue-500 p-3 rounded-lg shadow"
            >
                <Text className="text-white text-center font-bold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};


