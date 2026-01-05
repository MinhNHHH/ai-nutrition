from sqlalchemy.orm import Session
from src.models.images import Image


class ImageRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def insert(self, image: Image):
        try:
            print(self.db)
            self.db.add(image)
            self.db.commit()
            return image
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_all(self):
        return self.db.query(Image).all()
    
    def get_by_id(self, id: int):
        return self.db.query(Image).filter(Image.id == id).first()
    
    def delete(self, id: int):
        image = self.get_by_id(id)
        if image:
            self.db.delete(image)
            self.db.commit()
        return image