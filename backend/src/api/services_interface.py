from sqlalchemy.orm import Session
from src.services.images import ImageService
from src.services.dishes import DishService
from src.services.meal import MealService
from src.services.ai_request_logs import AIRequestLogService
from src.services.users import UserService
from src.services.files import FileService

from src.repositories.images import ImageRepository
from src.repositories.dishes import DishRepository
from src.repositories.meal import MealRepository
from src.repositories.ai_request_logs import AIRequestLogRepository
from src.repositories.users import UserRepository

from core.storage.minio_client import MinioClient
from core.LLM.client import LLMClient

class ServiceInterface:
    def __init__(self, db: Session):
        self.db = db
        self.minio_client = MinioClient()
        self.llm_client = LLMClient()
        self.image_service = ImageService(image_repository=ImageRepository(db))
        self.dish_service = DishService(dish_repository=DishRepository(db))
        self.meal_service = MealService(meal_repository=MealRepository(db))
        self.ai_request_log_service = AIRequestLogService(ai_request_log_repository=AIRequestLogRepository(db))
        self.user_service = UserService(user_repository=UserRepository(db))
        self.file_service = FileService(minio_client=self.minio_client)