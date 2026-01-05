import { useMutation } from '@tanstack/react-query';
import { nutritionService } from '../api/nutritionService';
import { useMealStore } from '../store/mealStore';

export const useAnalyzeMeal = () => {
    const setMealData = useMealStore((state) => state.setMealData);

    return useMutation({
        mutationFn: (imageUri: string) => nutritionService.analyzeMeal(imageUri),
        onSuccess: (data, imageUri) => {
            setMealData(data, imageUri);
        },
        onError: (error) => {
            console.error('Meal analysis failed:', error);
        },
    });
};
