from fastapi import Depends

from src.repositories.images import ImageRepository
from src.models.images import Image

class ImageService:
    def __init__(self, image_repository: ImageRepository = Depends()):
        self.image_repository = image_repository
    
    def insert(self, image: Image):
        return self.image_repository.insert(image)
    
    def get_all(self):
        return self.image_repository.get_all()
    
    def get_by_id(self, id: int):
        return self.image_repository.get_by_id(id)
    
    def delete(self, id: int):
        return self.image_repository.delete(id)
    
    def put_image_to_storage(self, image_bytes: bytes, image_uri: str) -> str:
        return put_image_to_storage(image_bytes, image_uri)
