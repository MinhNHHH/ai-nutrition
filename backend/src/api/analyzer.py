import json
from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
import uuid

from src.database import get_db
from src.models.images import Image
from src.models.meal import Meal
from src.models.dishes import Dish
from src.models.ai_request_logs import AIRequestLog

from src.api.services_interface import ServiceInterface
from src.api.deps import get_current_user
from src.models.users import User

from core.LLM.util import content_analyzer_image
from core.LLM.prompt import ANALYZE_FOOD

router = APIRouter(
    prefix="/analyzer",
    tags=["analyzer"]
)

@router.post("/image")
async def image_analyzer(
    image: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ServiceInterface(db)
    if image is None:
        raise ValueError("Image is required")

    
    image_bytes = await image.read()
    image_uri = f"{uuid.uuid4()}.jpg"
    
    # 2. Save Image record
    db_image = Image(
        user_id=current_user.id,
        image_url=image_uri
    )
    service.image_service.insert(db_image)
    
     # 3. Call AI
    try:
        content = content_analyzer_image(ANALYZE_FOOD, image_bytes)
        ai_response = service.llm_client.generate_content(content)
        
        response_text = ai_response.text
        # response_text might contain markdown blocks if not handled by API
        # but generate_content uses response_mime_type="application/json"
        
        result = json.loads(response_text)
        
         # 4. Save AI Log
        ai_log = AIRequestLog(
            user_id=current_user.id,
            image_id=db_image.id,
            request=ANALYZE_FOOD,
            response=response_text,
            model_name="gemini-2.0-flash", # Consistent with LLM/client.py
            prompt_tokens=ai_response.usage_metadata.prompt_token_count if hasattr(ai_response, 'usage_metadata') else 0,
            completion_tokens=ai_response.usage_metadata.candidates_token_count if hasattr(ai_response, 'usage_metadata') else 0,
            total_tokens=ai_response.usage_metadata.total_token_count if hasattr(ai_response, 'usage_metadata') else 0
        )
        service.ai_request_log_service.insert(ai_log)
        
         # 5. Save Meal
        total_nut = result.get("total_nutrition", {})
        db_meal = Meal(
            user_id=current_user.id,
            name=f"Meal from {image.filename}",
            total_calories=total_nut.get("calories_kcal", 0),
            total_protein=total_nut.get("protein_g", 0),
            total_carbs=total_nut.get("carbs_g", 0),
            total_fat=total_nut.get("fat_g", 0)
        )
        service.meal_service.insert(db_meal)
        
         # 6. Save Dishes
        for dish_data in result.get("dishes", []):
            nut = dish_data.get("nutrition", {})
            portion = dish_data.get("portion_estimation", {})
            
            # Parse health score and confidence (e.g., "8/10")
            health_score = 0
            conf_score = 0
            try:
                if "/" in str(dish_data.get("health_tags", "")):
                    health_score = float(dish_data.get("health_tags").split("/")[0])
                if "/" in str(dish_data.get("estimation_confidence", "")):
                    conf_score = float(dish_data.get("estimation_confidence").split("/")[0])
            except:
                pass

            db_dish = Dish(
                meal_id=db_meal.id,
                image_id=db_image.id,
                name=dish_data.get("dish_name"),
                portion_value=portion.get("value"),
                portion_unit=portion.get("unit"),
                calories=nut.get("calories_kcal"),
                protein=nut.get("protein_g"),
                carbs=nut.get("carbs_g"),
                fat=nut.get("fat_g"),
                fiber=nut.get("fiber_g"),
                sugar=nut.get("sugar_g"),
                sodium=nut.get("sodium_mg"),
                health_score=health_score,
                confidence_score=conf_score
            )
            service.dish_service.insert(db_dish)
        
        # 7. Upload to storage
        object_name = service.file_service.upload_file(image_bytes, image_uri)
        if object_name is None:
            raise ValueError("Failed to upload image to storage")
        
        return result
    except Exception as e:
        service.db.rollback()
        raise ValueError("Failed to analyze image")

    
