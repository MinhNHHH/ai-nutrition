import io
from minio import Minio
from minio.error import S3Error

from src.cfgs import get_default

BUCKET_NAME = get_default("MINIO_BUCKET")

class MinioClient:
    def __init__(self):
        self.client = Minio(
            endpoint=get_default("MINIO_CLIENT_ENDPOINT"),
            access_key=get_default("MINIO_CLIENT_ACCESS_KEY"),   # Access Key
            secret_key=get_default("MINIO_CLIENT_SECRET_KEY"),   # Secret Key
            secure=False               # True if using HTTPS
        )
        if not self.client.bucket_exists(get_default("MINIO_BUCKET")):
            print('Bucket does not exist')
            self.client.make_bucket(get_default("MINIO_BUCKET"))

    def put_image_to_storage(self, image_bytes: bytes, object_name: str):
        try:
            self.client.put_object(
                BUCKET_NAME,
                object_name,
                io.BytesIO(image_bytes),
                length=len(image_bytes),
                content_type="image/jpeg")
            return object_name
        except S3Error as e:
            print("Error:", e)
            return None