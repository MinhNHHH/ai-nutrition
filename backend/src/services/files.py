from core.storage.minio_client import MinioClient

class FileService:
    def __init__(self, minio_client: MinioClient):
        self.minio_client = minio_client
    
    def upload_file(self, file: bytes, file_name: str):
        return self.minio_client.put_image_to_storage(file, file_name)