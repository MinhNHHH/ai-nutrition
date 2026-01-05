import { useAuthStore } from '../store/authStore';
import { DishData } from '../types';
import { apiClient } from './client';

export const nutritionService = {
    analyzeMeal: async (imageUri: string): Promise<DishData> => {
        // This is a simulation of a multipart/form-data request
        // In a real app, you'd send the image file to the backend

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'meal.jpg',
        } as any);

        // Add access_token from the auth store (back-end return)
        const token = useAuthStore.getState().access_token;
        if (token) {
            formData.append('access_token', token);
        }

        const response = await apiClient.post<DishData>('/analyzer/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }
};
