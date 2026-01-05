import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogIn } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { authService } from '../src/api/authService';
import { useAuthStore } from '../src/store/authStore';

export default function LoginScreen() {
    const router = useRouter();
    const { setAuth, setLoading, setError, isLoading, error } = useAuthStore();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            // This will open the system browser and wait for the app redirect
            const data = await authService.googleLogin();

            setAuth(data.user, data.access_token);
            router.replace('/' as any);
        } catch (err: any) {
            // Check if it was a user cancellation
            if (err.message !== 'Login cancelled or failed') {
                setError(err.message || 'Authentication failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
                <View className="flex-1 px-8 justify-center py-20">
                    <View className="items-center mb-16">
                        <View className="w-24 h-24 bg-indigo-600 rounded-[32px] items-center justify-center shadow-2xl shadow-indigo-200">
                            <LogIn size={48} color="white" />
                        </View>
                        <Text className="text-4xl font-black mt-8 text-slate-900 text-center">
                            Welcome to{"\n"}
                            <Text className="text-indigo-600">NutriSnap</Text>
                        </Text>
                    </View>

                    <View className="space-y-6">
                        {error && (
                            <View className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
                                <Text className="text-red-600 text-center font-semibold">{error}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={handleGoogleLogin}
                            disabled={isLoading}
                            className={`h-16 rounded-2xl flex-row items-center justify-center space-x-4 border-2 ${isLoading ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 active:bg-slate-50'
                                }`}
                            style={!isLoading ? {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 15,
                                elevation: 2
                            } : {}}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#4F46E5" />
                            ) : (
                                <>
                                    <View className="bg-white rounded-full p-1">
                                        {/* Mock Google Logo Circle */}
                                        <View className="w-6 h-6 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                                            <Text className="text-[12px] font-bold text-slate-500">G</Text>
                                        </View>
                                    </View>
                                    <Text className="text-slate-800 text-xl font-bold">Sign in with Google</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <Text className="text-slate-400 text-center text-sm mt-8 px-10">
                            By signing in, you agree to our
                            <Text className="text-indigo-600 font-medium"> Terms</Text> and
                            <Text className="text-indigo-600 font-medium"> Privacy Policy</Text>.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
