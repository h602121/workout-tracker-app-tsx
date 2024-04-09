import "react-native-url-polyfill/auto"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://crnhjcjvhgdjfqdpmylb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybmhqY2p2aGdkamZxZHBteWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1MzM0MTIsImV4cCI6MjAyNzEwOTQxMn0.KEonSWW7sekwk3KRlw8a9g2Bz7dAPv4ntOJYkdyNsGU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})