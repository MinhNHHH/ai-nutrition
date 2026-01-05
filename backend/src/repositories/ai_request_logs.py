from sqlalchemy.orm import Session
from src.models.ai_request_logs import AIRequestLog

class AIRequestLogRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def insert(self, ai_request_log: AIRequestLog):
        try:
            self.db.add(ai_request_log)
            self.db.commit()
            return ai_request_log
        except Exception as e:
            self.db.rollback()
            raise e