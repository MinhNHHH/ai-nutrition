import { create } from 'zustand';
import { DishData } from '../types';

interface MealState {
    currentMeal: DishData | null;
    mealImageUri: string | null;
    history: DishData[];
    setMealData: (data: DishData, imageUri?: string) => void;
    clearMeal: () => void;
    addToHistory: (data: DishData) => void;
}

export const useMealStore = create<MealState>((set) => ({
    currentMeal: null,
    mealImageUri: null,
    history: [],
    setMealData: (data, imageUri) => set({ currentMeal: data, mealImageUri: imageUri || null }),
    clearMeal: () => set({ currentMeal: null, mealImageUri: null }),
    addToHistory: (data) => set((state) => ({ history: [...state.history, data] })),
}));
