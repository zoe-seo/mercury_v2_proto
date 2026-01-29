"""MinIO storage client for file uploads."""
from minio import Minio
from minio.error import S3Error
from io import BytesIO
import uuid
import json
from app.core.config import get_settings

settings = get_settings()

# Initialize MinIO client
minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_USE_SSL
)


def set_bucket_public_policy():
    """
    Set bucket policy to allow public read access.
    For development only. In production, use presigned URLs.
    """
    try:
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{settings.MINIO_BUCKET_NAME}/*"]
                }
            ]
        }
        minio_client.set_bucket_policy(settings.MINIO_BUCKET_NAME, json.dumps(policy))
        print(f"[STORAGE] Set public read policy for bucket: {settings.MINIO_BUCKET_NAME}")
    except S3Error as e:
        print(f"[STORAGE] Warning: Could not set public policy: {e}")
        print(f"[STORAGE] This is OK - presigned URLs will be used instead")


def ensure_bucket_exists():
    """Ensure the bucket exists, create if not."""
    try:
        if not minio_client.bucket_exists(settings.MINIO_BUCKET_NAME):
            minio_client.make_bucket(settings.MINIO_BUCKET_NAME)
            print(f"[STORAGE] Created bucket: {settings.MINIO_BUCKET_NAME}")

            # Set bucket policy for easier development
            set_bucket_public_policy()
        else:
            print(f"[STORAGE] Bucket already exists: {settings.MINIO_BUCKET_NAME}")
            # Try to set policy for existing bucket too (optional)
            # Uncomment the line below if you want to force public policy on existing buckets
            # set_bucket_public_policy()
    except S3Error as e:
        print(f"[STORAGE] Error ensuring bucket exists: {e}")
        raise


def upload_image(image_data: bytes, filename: str | None = None, content_type: str = "image/png") -> str:
    """
    Upload image to MinIO.

    Args:
        image_data: Image bytes
        filename: Optional filename (will generate UUID if not provided)
        content_type: MIME type of the image (default: image/png)

    Returns:
        Object name (path) in MinIO
    """
    ensure_bucket_exists()

    if filename is None:
        filename = f"{uuid.uuid4()}.png"

    # Use filename directly if it already includes a path
    if '/' in filename:
        object_name = filename
    else:
        object_name = f"images/{filename}"

    try:
        print(f"[STORAGE] Uploading image to MinIO: {object_name} ({len(image_data)} bytes)")

        minio_client.put_object(
            settings.MINIO_BUCKET_NAME,
            object_name,
            BytesIO(image_data),
            length=len(image_data),
            content_type=content_type
        )

        print(f"[STORAGE] Successfully uploaded: {object_name}")
        return object_name
    except S3Error as e:
        print(f"[STORAGE] Error uploading image: {e}")
        raise


def get_image_url(object_name: str, expiry_hours: int = 24) -> str:
    """
    Get presigned URL for an image (valid for specified hours).

    Args:
        object_name: Object name in MinIO
        expiry_hours: URL expiration time in hours (default: 24)

    Returns:
        Presigned URL
    """
    try:
        from datetime import timedelta

        print(f"[STORAGE] Generating presigned URL for: {object_name}")

        # Generate presigned URL (valid for expiry_hours)
        url = minio_client.presigned_get_object(
            settings.MINIO_BUCKET_NAME,
            object_name,
            expires=timedelta(hours=expiry_hours)
        )

        print(f"[STORAGE] Generated presigned URL: {url[:100]}...")
        return url
    except S3Error as e:
        print(f"[STORAGE] Error generating presigned URL: {e}")
        # Fallback to direct URL (will work if bucket is public)
        protocol = "https" if settings.MINIO_USE_SSL else "http"
        fallback_url = f"{protocol}://{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{object_name}"
        print(f"[STORAGE] Using fallback direct URL: {fallback_url}")
        return fallback_url


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
