ANALYZE_FOOD = """
Analyze the food items in the provided image.

For each detected dish:
1. Identify the dish name (dish name should be Vietnamese)
2. Estimate portion size (grams or ml)
3. Calculate nutritional values
4. Base value from nutrition calculate health tags on 10 scale (10 is the best)
5. Calculate estimation confidence on 10 scale (10 is the best)

Return the result in the following JSON format:

{
  "dishes": [
    {
      "dish_id": string,
      "dish_name": string,
      "portion_estimation": {
        "value": number,
        "unit": "g | ml"
      },
      "nutrition": {
        "calories_kcal": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number,
        "fiber_g": number,
        "sugar_g": number,
        "sodium_mg": number
      },
      "health_tags": "number/10",
      "estimation_confidence": "number/10"
    }
  ],
  "total_nutrition": {
    "calories_kcal": number,
    "protein_g": number,
    "carbs_g": number,
    "fat_g": number
  }
}
"""