from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from src.models.ai_request_logs import AIRequestLog
from src.models.meal import Meal
from src.models.users import User
from datetime import datetime, timedelta

class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_ai_requests_stats(self, days: int = 7):
        start_date = datetime.now() - timedelta(days=days)
        results = self.db.query(
            cast(AIRequestLog.created_at, Date).label("date"),
            func.count(AIRequestLog.id).label("count"),
            func.sum(AIRequestLog.total_tokens).label("total_tokens")
        ).filter(AIRequestLog.created_at >= start_date) \
         .group_by(cast(AIRequestLog.created_at, Date)) \
         .order_by(cast(AIRequestLog.created_at, Date)) \
         .all()
        
        return [{"date": str(r.date), "count": r.count, "tokens": r.total_tokens or 0} for r in results]

    def get_model_distribution(self):
        results = self.db.query(
            AIRequestLog.model_name,
            func.count(AIRequestLog.id).label("count")
        ).group_by(AIRequestLog.model_name).all()
        
        return [{"model": r.model_name, "count": r.count} for r in results]

    def get_nutrition_stats(self, days: int = 7):
        start_date = datetime.now() - timedelta(days=days)
        results = self.db.query(
            cast(Meal.created_at, Date).label("date"),
            func.sum(Meal.total_calories).label("calories"),
            func.sum(Meal.total_protein).label("protein"),
            func.sum(Meal.total_carbs).label("carbs"),
            func.sum(Meal.total_fat).label("fat")
        ).filter(Meal.created_at >= start_date) \
         .group_by(cast(Meal.created_at, Date)) \
         .order_by(cast(Meal.created_at, Date)) \
         .all()
        
        return [{
            "date": str(r.date),
            "calories": float(r.calories or 0),
            "protein": float(r.protein or 0),
            "carbs": float(r.carbs or 0),
            "fat": float(r.fat or 0)
        } for r in results]

    def get_summary_stats(self):
        total_users = self.db.query(func.count(User.id)).scalar()
        total_requests = self.db.query(func.count(AIRequestLog.id)).scalar()
        total_tokens = self.db.query(func.sum(AIRequestLog.total_tokens)).scalar()
        total_meals = self.db.query(func.count(Meal.id)).scalar()
        
        return {
            "total_users": total_users,
            "total_requests": total_requests,
            "total_tokens": total_tokens or 0,
            "total_meals": total_meals
        }

    def get_detailed_logs(self, limit: int = 20, offset: int = 0):
        from src.models.images import Image
        results = self.db.query(
            AIRequestLog,
            Image.image_url
        ).outerjoin(Image, AIRequestLog.image_id == Image.id) \
         .order_by(AIRequestLog.created_at.desc()) \
         .offset(offset) \
         .limit(limit) \
         .all()
        
        logs = []
        for log, image_url in results:
            logs.append({
                "id": log.id,
                "request": log.request,
                "response": log.response,
                "model": log.model_name,
                "tokens": log.total_tokens,
                "created_at": str(log.created_at),
                "image_url": image_url
            })
        return logs
