"""MinIO storage client for file uploads."""
from minio import Minio
from minio.error import S3Error
from io import BytesIO
import uuid
from app.core.config import get_settings

settings = get_settings()

# Initialize MinIO client
minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_USE_SSL
)


def ensure_bucket_exists():
    """Ensure the bucket exists, create if not."""
    try:
        if not minio_client.bucket_exists(settings.MINIO_BUCKET_NAME):
            minio_client.make_bucket(settings.MINIO_BUCKET_NAME)
            print(f"Created bucket: {settings.MINIO_BUCKET_NAME}")
    except S3Error as e:
        print(f"Error ensuring bucket exists: {e}")
        raise


def upload_image(image_data: bytes, filename: str | None = None) -> str:
    """
    Upload image to MinIO.
    
    Args:
        image_data: Image bytes
        filename: Optional filename (will generate UUID if not provided)
    
    Returns:
        Object name (path) in MinIO
    """
    ensure_bucket_exists()
    
    if filename is None:
        filename = f"{uuid.uuid4()}.png"
    
    object_name = f"images/{filename}"
    
    try:
        minio_client.put_object(
            settings.MINIO_BUCKET_NAME,
            object_name,
            BytesIO(image_data),
            length=len(image_data),
            content_type="image/png"
        )
        return object_name
    except S3Error as e:
        print(f"Error uploading image: {e}")
        raise


def get_image_url(object_name: str) -> str:
    """
    Get public URL for an image.
    
    Args:
        object_name: Object name in MinIO
    
    Returns:
        Public URL
    """
    # For development, return direct URL
    # In production, you might want to use presigned URLs
    protocol = "https" if settings.MINIO_USE_SSL else "http"
    return f"{protocol}://{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{object_name}"


def delete_image(object_name: str):
    """
    Delete image from MinIO.
    
    Args:
        object_name: Object name in MinIO
    """
    try:
        minio_client.remove_object(settings.MINIO_BUCKET_NAME, object_name)
    except S3Error as e:
        print(f"Error deleting image: {e}")
        raise
