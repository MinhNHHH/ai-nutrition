import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { authService } from '../src/api/authService';
import { useAnalyzeMeal } from '../src/hooks/useAnalyzeMeal';
import { useAuthStore } from '../src/store/authStore';
import { useMealStore } from '../src/store/mealStore';

export default function ScanScreen() {
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();
    const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeMeal();
    const { logout, user } = useAuthStore();
    const clearMeal = useMealStore((state) => state.clearMeal);

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            // 1. Clear local state first to trigger background redirect
                            clearMeal();
                            logout();

                            // 2. Perform external logout operations
                            await authService.logout();
                        } catch (error) {
                            console.error('Logout failed:', error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleScan = async () => {
        if (!Device.isDevice && Platform.OS !== 'web') {
            Alert.alert(
                'Simulator Detected',
                'The camera is not available on simulators. Use the simulated analysis or browse your files.',
                [
                    { text: 'Simulate Scan', onPress: () => processImage('mock-uri') },
                    { text: 'Browse Files', onPress: () => handleBrowseFolders() },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
            return;
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImage(uri);
                processImage(uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open camera.');
        }
    };

    const handleUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            processImage(uri);
        }
    };

    const handleBrowseFolders = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImage(uri);
                processImage(uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to access folder/files.');
        }
    };

    const processImage = (uri: string) => {
        analyze(uri, {
            onSuccess: () => {
                setImage(null);
                router.push('/detail');
            }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-3">
                        <UserIcon size={20} color="#4F46E5" />
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs font-bold uppercase">Welcome back</Text>
                        <Text className="text-gray-900 font-bold">{user?.username || 'User'}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleLogout}
                    className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                >
                    <LogOut size={18} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <View className="px-6 pt-6 pb-6">
                <Text className="text-4xl font-black text-gray-900 leading-tight">
                    Snap your{"\n"}
                    <Text className="text-indigo-600">Healthy Meal</Text>
                </Text>
                <Text className="text-gray-500 font-bold mt-2 text-lg">
                    Get instant nutritional breakdown
                </Text>
            </View>

            <View className="flex-1 justify-center items-center px-6">
                {isAnalyzing ? (
                    <View className="items-center">
                        <View className="w-64 h-64 rounded-[40px] overflow-hidden border-4 border-indigo-500 mb-8 relative bg-gray-100">
                            {image ? (
                                <Image source={{ uri: image }} className="w-full h-full opacity-60" />
                            ) : (
                                <View className="w-full h-full items-center justify-center">
                                    <MaterialCommunityIcons name="food" size={80} color="#E5E7EB" />
                                </View>
                            )}
                            <View className="absolute inset-0 items-center justify-center">
                                <ActivityIndicator size="large" color="#4F46E5" />
                            </View>
                            <View className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 shadow-md shadow-indigo-500" style={{ top: '50%' }} />
                        </View>
                        <Text className="text-2xl font-black text-gray-900 mb-2">Analyzing Meal...</Text>
                        <Text className="text-gray-500 font-bold text-center px-10">
                            Our AI is identifying ingredients and estimating portions
                        </Text>
                    </View>
                ) : (
                    <View className="w-full items-center">
                        <View className="w-full aspect-square bg-gray-50 rounded-[48px] items-center justify-center border-2 border-dashed border-gray-200 mb-8 relative overflow-hidden">
                            <View className="absolute top-8 left-8 w-10 h-10 border-t-4 border-l-4 border-gray-300 rounded-tl-xl" />
                            <View className="absolute top-8 right-8 w-10 h-10 border-t-4 border-r-4 border-gray-300 rounded-tr-xl" />
                            <View className="absolute bottom-8 left-8 w-10 h-10 border-b-4 border-l-4 border-gray-300 rounded-bl-xl" />
                            <View className="absolute bottom-8 right-8 w-10 h-10 border-b-4 border-r-4 border-gray-300 rounded-br-xl" />

                            <MaterialCommunityIcons name="camera-iris" size={100} color="#E5E7EB" />
                            <View className="mt-4 items-center">
                                <Text className="text-gray-300 font-black uppercase tracking-[4px]">Align Meal in Frame</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={handleScan}
                            className="w-full bg-gray-900 h-20 rounded-[28px] flex-row items-center justify-center mb-4 shadow-xl shadow-black/20"
                        >
                            <MaterialCommunityIcons name="camera" size={28} color="white" />
                            <Text className="text-white text-xl font-black ml-3">Start Scanning</Text>
                        </Pressable>

                        <View className="flex-row w-full space-x-4">
                            <Pressable
                                onPress={handleUpload}
                                className="flex-1 bg-white border-2 border-gray-100 h-16 rounded-[24px] flex-row items-center justify-center"
                            >
                                <MaterialCommunityIcons name="image-multiple" size={20} color="#4B5563" />
                                <Text className="text-gray-600 font-bold ml-2">Gallery</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleBrowseFolders}
                                className="flex-1 bg-white border-2 border-gray-100 h-16 rounded-[24px] flex-row items-center justify-center ml-4"
                            >
                                <MaterialCommunityIcons name="folder-open" size={20} color="#4B5563" />
                                <Text className="text-gray-600 font-bold ml-2">Files</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>

            {!isAnalyzing && (
                <View className="px-10 pb-10 flex-row items-center justify-center">
                    <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#FACC15" />
                    <Text className="text-gray-400 text-xs font-bold ml-2 uppercase tracking-wider">
                        Tip: Ensure good lighting for best results
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
