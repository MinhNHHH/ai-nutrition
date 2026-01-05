export interface Nutrition {
    calories_kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    sugar_g: number;
    sodium_mg: number;
}

export interface PortionEstimation {
    value: number;
    unit: string;
}

export interface Dish {
    dish_id: string;
    dish_name: string;
    ingredients: string[];
    portion_estimation: PortionEstimation;
    nutrition: Nutrition;
    health_tags: string[];
    estimation_confidence: 'low' | 'medium' | 'high';
}

export interface DishData {
    meal_name?: string;
    dishes: Dish[];
    total_nutrition: {
        calories_kcal: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
    };
    health_score?: number;
    total_weight_g?: number;
}
