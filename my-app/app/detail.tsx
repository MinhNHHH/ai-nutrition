import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import { useMealStore } from '../src/store/mealStore';
import { Dish } from '../src/types';

const { width } = Dimensions.get('window');

const MacroCard = ({
  label,
  value,
  icon,
  color,
  iconColor,
  unit = 'g'
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  iconColor: string;
  unit?: string;
}) => (
  <View className="bg-white rounded-[24px] p-4 items-center flex-1 mx-1 shadow-sm border border-gray-50">
    <Text className="text-gray-400 text-[10px] font-bold mb-2">{label}</Text>
    <View className="flex-row items-center">
      <View className={`${color} p-1.5 rounded-full mr-1.5`}>
        <MaterialCommunityIcons name={icon as any} size={14} color={iconColor} />
      </View>
      <View className="flex-row items-baseline">
        <Text className="text-gray-900 text-lg font-bold">{Math.round(value)}</Text>
        <Text className="text-gray-400 text-[10px] font-bold ml-0.5">{unit}</Text>
      </View>
    </View>
  </View>
);

const IngredientItem = ({ dish }: { dish: Dish }) => (
  <View className="flex-row items-center py-4 border-b border-gray-100">
    <View className="flex-1">
      <Text className="text-gray-900 font-bold text-base mb-1">{dish.dish_name}</Text>
      <View className="flex-row items-center">
        <Text className="text-gray-400 text-xs font-medium">
          {dish.portion_estimation.value}{dish.portion_estimation.unit} • {dish.nutrition.calories_kcal}kcal
        </Text>
        <View className="flex-row items-center ml-3">
          <MaterialCommunityIcons name="food-drumstick" size={12} color="#F87171" />
          <Text className="text-gray-500 text-xs font-bold ml-1">{Math.round(dish.nutrition.protein_g)}</Text>
        </View>
        <View className="flex-row items-center ml-2">
          <MaterialCommunityIcons name="bread-slice" size={12} color="#FBBF24" />
          <Text className="text-gray-500 text-xs font-bold ml-1">{Math.round(dish.nutrition.carbs_g)}</Text>
        </View>
        <View className="flex-row items-center ml-2">
          <MaterialCommunityIcons name="oil" size={12} color="#34D399" />
          <Text className="text-gray-500 text-xs font-bold ml-1">{Math.round(dish.nutrition.fat_g)}</Text>
        </View>
      </View>
    </View>
    <Pressable className="bg-gray-100 w-8 h-8 rounded-full items-center justify-center">
      <MaterialCommunityIcons name="minus" size={20} color="#9CA3AF" />
    </Pressable>
  </View>
);

export default function DetailScreen() {
  const router = useRouter();
  const currentMeal = useMealStore((state) => state.currentMeal);

  if (!currentMeal) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">No analysis data found</Text>
        <Pressable
          onPress={() => router.replace('/')}
          className="bg-gray-900 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Go Back to Scan</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { total_nutrition, dishes, health_score, meal_name } = currentMeal;
  const mealImageUri = useMealStore((state) => state.mealImageUri);

  const displayHealthScore = React.useMemo(() => {
    if (health_score) return health_score;
    if (!dishes || dishes.length === 0) return 0;

    const total = dishes.reduce((acc, dish) => {
      const score = typeof dish.health_tags === 'string'
        ? parseInt(dish.health_tags.split('/')[0]) || 0
        : 0;
      return acc + score;
    }, 0);

    return Math.round(total / dishes.length);
  }, [health_score, dishes]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 mr-4">
              <Text className="text-gray-400 text-sm font-bold mb-1">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text className="text-gray-900 text-3xl font-black mb-2 leading-tight">
                {meal_name || ''}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="heart" size={16} color="#F87171" />
                <Text className="text-gray-500 text-sm font-bold ml-1">
                  Health: <Text className="text-gray-900">{displayHealthScore}/10</Text>
                </Text>
              </View>
            </View>

            {/* Meal Image */}
            <View className="relative">
              <View className="bg-gray-200 rounded-[32px] w-32 h-32 overflow-hidden shadow-lg transform rotate-6 border-2 border-white">
                <Image
                  source={{ uri: mealImageUri || '' }}
                  className="w-full h-full"
                />
              </View>
              <View className="absolute -z-10 -bottom-2 -right-2 bg-gray-100 rounded-[32px] w-32 h-32 transform -rotate-3" />
            </View>
          </View>

          <Text className="text-gray-900 font-bold text-lg mb-4">Calories & Nutrition</Text>

          {/* Main Stats */}
          <View className="flex-row mb-4">
            <View className="bg-white rounded-[32px] p-5 flex-1 shadow-sm border border-gray-50 items-center">
              <Text className="text-gray-400 text-xs font-bold mb-2">Calories</Text>
              <View className="flex-row items-baseline">
                <Text className="text-gray-900 text-3xl font-black">{Math.round(total_nutrition.calories_kcal)}</Text>
                <Text className="text-gray-400 text-sm font-bold ml-1">kcal</Text>
              </View>
            </View>
          </View>

          {/* Macros Group */}
          <View className="flex-row mb-10">
            <MacroCard
              label="Protein"
              value={total_nutrition.protein_g}
              icon="food-drumstick"
              color="bg-red-50"
              iconColor="#F87171"
            />
            <MacroCard
              label="Carbs"
              value={total_nutrition.carbs_g}
              icon="bread-slice"
              color="bg-amber-50"
              iconColor="#FBBF24"
            />
            <MacroCard
              label="Fat"
              value={total_nutrition.fat_g}
              icon="oil"
              color="bg-emerald-50"
              iconColor="#34D399"
            />
          </View>

          {/* Ingredients Section */}
          <View>
            <Text className="text-gray-900 font-bold text-lg mb-2">Ingredients</Text>
            {dishes.map((dish) => (
              <IngredientItem key={dish.dish_id} dish={dish} />
            ))}
          </View>

          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
