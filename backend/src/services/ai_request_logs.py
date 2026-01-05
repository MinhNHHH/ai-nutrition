from sqlalchemy.orm import Session
from src.models.ai_request_logs import AIRequestLog
from src.repositories.ai_request_logs import AIRequestLogRepository

class AIRequestLogService:
    def __init__(self, ai_request_log_repository: AIRequestLogRepository):
        self.ai_request_log_repository = ai_request_log_repository
    
    def insert(self, ai_request_log: AIRequestLog):
        return self.ai_request_log_repository.insert(ai_request_log)