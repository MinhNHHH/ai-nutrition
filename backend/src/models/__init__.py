# NOTE: when create new models, we need to include them here
# so that alembic could correctly generate the migration
import sys,os
sys.path.append(os.path.abspath(".."))
from src.database import Base
from src.models.users import User
from src.models.images import Image
from src.models.ai_request_logs import AIRequestLog
from src.models.meal import Meal
from src.models.dishes import Dish

__all__ = [
    User,
    Image,
    AIRequestLog,
    Meal,
    Dish
]