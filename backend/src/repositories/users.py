from sqlalchemy.orm import Session
from src.models.users import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def insert(self, user: User):
        try:
            self.db.add(user)
            self.db.commit()
            return user
        except Exception as e:
            self.db.rollback()
            raise e

    def upsert_google_user(self, google_id: str, email: str, username: str, profile_pic: str):
        user = self.db.query(User).filter(User.google_id == google_id).first()
        if not user:
            # Check by email as fallback
            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    google_id=google_id,
                    email=email,
                    username=username,
                    profile_pic=profile_pic
                )
                self.db.add(user)
            else:
                user.google_id = google_id
        
        user.profile_pic = profile_pic
        user.username = username
        from sqlalchemy.sql import func
        user.last_login = func.now()
        
        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception as e:
            self.db.rollback()
            raise e